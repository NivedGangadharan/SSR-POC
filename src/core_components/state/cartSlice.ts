import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type CartItem = {
  id: number;
  name: string;
  priceValue?: number;
  priceText?: string;
  imageUrl?: string;
  qty: number;
};

type CartState = { items: CartItem[] };

const initialState: CartState = { items: [] };

const slice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addItem(state: CartState, action: PayloadAction<{ id: number; name: string; priceValue?: number; priceText?: string; imageUrl?: string; qty?: number }>) {
      const { id, name, priceValue, priceText, imageUrl } = action.payload;
      const qty = action.payload.qty ?? 1;
      const existing = state.items.find(i => i.id === id);
      if (existing) {
        existing.qty += qty;
      } else {
        state.items.push({ id, name, priceValue, priceText, imageUrl, qty });
      }
    },
    setCart(state: CartState, action: PayloadAction<CartState>) {
      state.items = action.payload.items ?? [];
    },
    setQty(state: CartState, action: PayloadAction<{ id: number; qty: number }>) {
      const it = state.items.find(i => i.id === action.payload.id);
      if (!it) return;
      if (action.payload.qty <= 0) {
        state.items = state.items.filter(i => i.id !== action.payload.id);
      } else {
        it.qty = action.payload.qty;
      }
    },
    removeItem(state: CartState, action: PayloadAction<{ id: number }>) {
      state.items = state.items.filter(i => i.id !== action.payload.id);
    },
    clearCart(state: CartState) {
      state.items = [];
    },
  },
});

export const { addItem, setCart, setQty, removeItem, clearCart } = slice.actions;
export default slice.reducer;
