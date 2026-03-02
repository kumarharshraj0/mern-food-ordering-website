const Cart = require("../models/Cart");
const MenuItem = require("../models/Menu");

/* -----------------------------
   HELPER: Calculate Item Total
----------------------------- */
const calculateItemTotal = (basePrice, size, addons, quantity) => {
  const sizePrice = size?.price || 0;
  const addonsTotal = addons?.reduce((sum, a) => sum + a.price, 0) || 0;
  return (basePrice + sizePrice + addonsTotal) * quantity;
};

/* -----------------------------
   GET CART
----------------------------- */
exports.getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id })
      .populate("items.menuItem")
      .populate("items.restaurant", "name");

    if (!cart) {
      cart = await Cart.create({
        user: req.user._id,
        items: [],
        cartTotal: 0
      });
    }

    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* -----------------------------
   ADD TO CART  ✅ FIXED
----------------------------- */
exports.addToCart = async (req, res) => {
  try {
    const {
      menuItem,
      restaurant,
      quantity = 1,
      size = null,
      addons = []
    } = req.body;

    if (!menuItem || !restaurant) {
      return res.status(400).json({ message: "menuItem & restaurant required" });
    }

    /* 🔥 FETCH MENU ITEM (SOURCE OF TRUTH) */
    const menu = await MenuItem.findById(menuItem);
    if (!menu) {
      return res.status(404).json({ message: "Menu item not found" });
    }

    const basePrice = Number(menu.price);
    const qty = Number(quantity);

    if (isNaN(basePrice) || isNaN(qty)) {
      return res.status(400).json({ message: "Invalid price or quantity" });
    }

    const itemTotal = calculateItemTotal(
      basePrice,
      size,
      addons,
      qty
    );

    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      cart = await Cart.create({
        user: req.user._id,
        items: [],
        cartTotal: 0
      });
    }

    /* 🔁 CHECK EXISTING ITEM */
    const existingItem = cart.items.find(
      (i) =>
        i.menuItem.toString() === menuItem &&
        JSON.stringify(i.size) === JSON.stringify(size) &&
        JSON.stringify(i.addons) === JSON.stringify(addons)
    );

    if (existingItem) {
      existingItem.quantity += qty;
      existingItem.totalPrice += itemTotal;
    } else {
      cart.items.push({
        menuItem,
        restaurant,
        title: menu.name,
        image: menu.images?.[0],
        size,
        addons,
        quantity: qty,
        basePrice,
        totalPrice: itemTotal
      });
    }

    /* ✅ SAFE TOTAL RECALCULATION */
    cart.cartTotal = cart.items.reduce(
      (sum, i) => sum + Number(i.totalPrice || 0),
      0
    );

    await cart.save();

    res.json({ success: true, cart });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};


/* -----------------------------
   UPDATE CART ITEM
----------------------------- */
exports.updateCartItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    const { quantity } = req.body;

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const item = cart.items.id(itemId);
    if (!item) return res.status(404).json({ message: "Item not found" });

    item.quantity = quantity;
    item.totalPrice = calculateItemTotal(
      item.basePrice,
      item.size,
      item.addons,
      quantity
    );

    cart.cartTotal = cart.items.reduce(
      (sum, i) => sum + i.totalPrice,
      0
    );

    await cart.save();
    res.json({ message: "Cart updated", cart });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* -----------------------------
   REMOVE CART ITEM
----------------------------- */
exports.removeCartItem = async (req, res) => {
  try {
    const { itemId } = req.params;

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.items = cart.items.filter(
      (i) => i._id.toString() !== itemId
    );

    cart.cartTotal = cart.items.reduce(
      (sum, i) => sum + i.totalPrice,
      0
    );

    await cart.save();
    res.json({ message: "Item removed", cart });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* -----------------------------
   CLEAR CART
----------------------------- */
exports.clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.items = [];
    cart.cartTotal = 0;

    await cart.save();
    res.json({ message: "Cart cleared" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

