import { create } from "zustand";

export const useCart = create((set) => ({
  items: [],

  addItem: (item) =>
    set((state) => ({
      items: [...state.items, { ...item, quantity: 1 }],
    })),

  removeItem: (id) =>
    set((state) => ({
      items: state.items.filter((item) => item.id !== id),
    })),

  clearCart: () => set({ items: [] }),
}));

