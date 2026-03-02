import { X, Minus, Plus, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import Skeleton from "@/components/ui/Skeleton";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/context/CartContext";

export default function Cart({ open, onClose }) {
  const navigate = useNavigate();
  const {
    cart,
    loading,
    updateCartItem,
    removeCartItem
  } = useCart();

  const items = cart?.items || [];
  const subtotal = cart?.cartTotal || cart?.totalPrice || 0;

  const handleIncrease = (item) => {
    updateCartItem(item._id, item.quantity + 1);
  };

  const handleDecrease = (item) => {
    if (item.quantity <= 1) return;
    updateCartItem(item._id, item.quantity - 1);
  };

  const handleRemove = (itemId) => {
    removeCartItem(itemId);
  };

  return (
    <>
      {open && (
        <div className="fixed inset-0 bg-black/60 z-40 backdrop-blur-[2px] transition-all duration-500" onClick={onClose} />
      )}

      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-[420px] bg-white z-50 transform transition-transform duration-500 shadow-2xl flex flex-col ${open ? "translate-x-0" : "translate-x-full"
          }`}
      >
        {/* HEADER */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <div>
            <h2 className="text-2xl font-black text-gray-900 tracking-tight">Your Cart</h2>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-0.5">{items.length} Items Selected</p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full hover:bg-orange-50 hover:text-orange-500 transition-colors">
            <X className="h-6 w-6" />
          </Button>
        </div>

        {/* BODY */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6 scrollbar-hide">
          {loading && (
            <div className="space-y-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="flex gap-4 bg-gray-50/50 rounded-2xl p-4 border border-gray-100/50">
                  <Skeleton className="w-20 h-20 rounded-xl" />
                  <div className="flex-1 space-y-3">
                    <Skeleton className="h-5 w-3/4 rounded-lg" />
                    <Skeleton className="h-4 w-1/4 rounded-lg" />
                    <Skeleton className="h-10 w-32 rounded-xl" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading && items.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4 pt-20">
              <div className="w-24 h-24 bg-orange-50 rounded-full flex items-center justify-center text-4xl mb-2">🛒</div>
              <h3 className="text-xl font-bold text-gray-900">Your cart is empty</h3>
              <p className="text-sm text-gray-500 max-w-[200px]">Looks like you haven't added anything to your cart yet.</p>
              <Button onClick={onClose} className="bg-orange-500 hover:bg-orange-600 rounded-full px-8">Start Shopping</Button>
            </div>
          )}

          {!loading && items.map((item) => {
            const menuItem = item.menuItem || {};
            const name = menuItem.name || item.title || "Menu Item";
            const price = menuItem.price || (item.totalPrice / item.quantity) || 0;
            const imageUrl = menuItem.images?.[0]?.url || item.image?.url || "/placeholder.png";

            return (
              <div
                key={item._id}
                className="flex gap-4 group"
              >
                <div className="w-24 h-24 rounded-2xl overflow-hidden shadow-md flex-shrink-0">
                  <img
                    src={imageUrl}
                    alt={name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>

                <div className="flex-1 min-w-0 py-1">
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="font-bold text-gray-900 truncate pr-2 group-hover:text-orange-600 transition-colors">
                      {name}
                    </h4>
                    <button
                      onClick={() => handleRemove(item._id)}
                      className="text-gray-300 hover:text-rose-500 transition-colors p-1"
                    >
                      <Trash className="h-4 w-4" />
                    </button>
                  </div>

                  <p className="text-orange-600 font-black text-sm mb-3">
                    ₹{(price * item.quantity).toLocaleString()}
                  </p>

                  <div className="flex items-center gap-4 bg-gray-50 w-fit rounded-xl p-1 border border-gray-100">
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleDecrease(item)}
                      className="h-8 w-8 rounded-lg hover:bg-white hover:text-orange-500 shadow-none"
                    >
                      <Minus className="h-3 w-3" />
                    </Button>

                    <span className="font-black text-sm w-4 text-center">
                      {item.quantity}
                    </span>

                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleIncrease(item)}
                      className="h-8 w-8 rounded-lg hover:bg-white hover:text-orange-500 shadow-none"
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* FOOTER */}
        <div className="border-t border-gray-100 px-6 py-8 bg-gray-50/50 space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between text-gray-500 font-bold text-sm uppercase tracking-wider">
              <span>Subtotal</span>
              <span>₹{subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-gray-500 font-bold text-sm uppercase tracking-wider">
              <span>Delivery Fee</span>
              <span className="text-emerald-500">FREE</span>
            </div>
            <div className="flex justify-between text-gray-900 font-black text-2xl pt-2">
              <span>Total</span>
              <span className="text-orange-600">₹{subtotal.toLocaleString()}</span>
            </div>
          </div>

          <Button
            disabled={items.length === 0}
            onClick={() => {
              onClose();
              navigate("/checkout");
            }}
            className="w-full h-14 bg-orange-500 hover:bg-orange-600 rounded-2xl text-lg font-black shadow-xl shadow-orange-500/20 active:scale-[0.98] transition-all"
          >
            Checkout Now
          </Button>
        </div>
      </div>
    </>
  );
}
