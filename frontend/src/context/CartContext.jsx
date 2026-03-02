import { createContext, useContext, useEffect, useState, useMemo, useCallback } from "react";
import api from "../lib/api";
import { useAuth } from "./AuthContext";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useAuth();

  const [cart, setCart] = useState(null);
  const [guestCart, setGuestCart] = useState(() => {
    const saved = localStorage.getItem("guest_cart");
    return saved ? JSON.parse(saved) : { items: [], totalPrice: 0 };
  });

  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(false);

  // Sync guest cart to localStorage
  useEffect(() => {
    if (!user) {
      localStorage.setItem("guest_cart", JSON.stringify(guestCart));
      setCart(guestCart);
    }
  }, [guestCart, user]);

  /* ----------------------------------
     Load cart when user logs in
  -----------------------------------*/
  useEffect(() => {
    if (user) {
      handleUserLogin();
    } else {
      setCart(guestCart);
      setWishlist([]);
    }
  }, [user]);

  const handleUserLogin = async () => {
    setLoading(true);
    try {
      // If there are items in guest cart, we might want to merge them
      // For now, let's just fetch the user's cart from server
      await fetchCart();
      // Optionally merge guestCart.items into server cart here
    } catch (err) {
      console.error("Login cart fetch failed", err);
    } finally {
      setLoading(false);
    }
  };

  /* ----------------------------------
     CART
  -----------------------------------*/

  const fetchCart = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const res = await api.get("/cart");
      setCart(res.data);
    } catch (err) {
      console.error("Fetch cart failed", err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const addToCart = useCallback(async (data) => {
    if (user) {
      const res = await api.post("/cart/add", data);
      setCart(res.data.cart);
      return res.data;
    } else {
      // Guest add to cart
      setGuestCart(prev => {
        const existingItemIndex = prev.items.findIndex(i => i.menuItem?._id === data.menuItem || i.menuItem === data.menuItem);
        let newItems = [...prev.items];

        if (existingItemIndex > -1) {
          newItems[existingItemIndex].quantity += (data.quantity || 1);
        } else {
          // Note: In a real app, we'd need more item details here for the UI
          // For now, we'll just push the minimal data and hope the UI handles it
          // or fetch the item details if needed.
          newItems.push({
            _id: Math.random().toString(36).substr(2, 9),
            menuItem: data.menuItemDetails || { _id: data.menuItem, name: "Item", price: 0 },
            quantity: data.quantity || 1,
            restaurant: data.restaurant
          });
        }

        return {
          ...prev,
          items: newItems,
          totalPrice: newItems.reduce((sum, item) => sum + (item.menuItem?.price || 0) * item.quantity, 0)
        };
      });
      return { success: true };
    }
  }, [user]);

  const updateCartItem = useCallback(async (itemId, quantity) => {
    if (user) {
      const res = await api.put(`/cart/update/${itemId}`, { quantity });
      setCart(res.data.cart);
    } else {
      setGuestCart(prev => {
        const newItems = prev.items.map(i => i._id === itemId ? { ...i, quantity } : i);
        return {
          ...prev,
          items: newItems,
          totalPrice: newItems.reduce((sum, item) => sum + (item.menuItem?.price || 0) * item.quantity, 0)
        };
      });
    }
  }, [user]);

  const removeCartItem = useCallback(async (itemId) => {
    if (user) {
      const res = await api.delete(`/cart/remove/${itemId}`);
      setCart(res.data.cart);
    } else {
      setGuestCart(prev => {
        const newItems = prev.items.filter(i => i._id !== itemId);
        return {
          ...prev,
          items: newItems,
          totalPrice: newItems.reduce((sum, item) => sum + (item.menuItem?.price || 0) * item.quantity, 0)
        };
      });
    }
  }, [user]);

  const clearCart = useCallback(async () => {
    if (user) {
      const res = await api.delete("/cart/clear");
      setCart(res.data.cart);
    } else {
      const newCart = { items: [], totalPrice: 0 };
      setGuestCart(newCart);
      localStorage.removeItem("guest_cart");
    }
  }, [user]);

  /* ----------------------------------
     WISHLIST
  -----------------------------------*/

  const fetchWishlist = useCallback(async () => {
    if (!user) return;
    try {
      const res = await api.get("/cart/wishlist");
      setWishlist(res.data);
    } catch (err) {
      console.error("Fetch wishlist failed", err);
    }
  }, [user]);

  const addToWishlist = useCallback(async (menuItemId) => {
    if (!user) {
      toast.error("Please sign in to add to wishlist");
      return;
    }
    const res = await api.post("/cart/wishlist/add", { menuItemId });
    setWishlist(res.data);
  }, [user]);

  const removeFromWishlist = useCallback(async (menuItemId) => {
    if (!user) return;
    const res = await api.delete(`/cart/wishlist/remove/${menuItemId}`);
    setWishlist(res.data);
  }, [user]);

  const value = useMemo(() => ({
    cart,
    wishlist,
    loading,
    fetchCart,
    addToCart,
    updateCartItem,
    removeCartItem,
    clearCart,
    fetchWishlist,
    addToWishlist,
    removeFromWishlist
  }), [cart, wishlist, loading, fetchCart, addToCart, updateCartItem, removeCartItem, clearCart, fetchWishlist, addToWishlist, removeFromWishlist]);

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
