import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define product type for cart items
interface CartItem {
  id: string;
  name: string;
  price: number;
  // image: string;
  quantity: number;
}

export interface CartState {
  items: CartItem[];
  totalQuantity: number;
  totalPrice: number;
}

const initialState: CartState = {
  items: [],
  totalQuantity: 0,
  totalPrice: 0,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    // Add item to cart
    addToCart: (state, action: PayloadAction<CartItem>) => {
      const existingItem = state.items.find(
        (item) => item.id === action.payload.id
      );
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.items.push({ ...action.payload, quantity: 1 });
      }
      state.totalQuantity += 1;
      state.totalPrice += action.payload.price;
    },

    // Remove item from cart
    removeFromCart: (state, action: PayloadAction<string>) => {
      const itemIndex = state.items.findIndex(
        (item) => item.id === action.payload
      );
      if (itemIndex !== -1) {
        state.totalQuantity -= state.items[itemIndex]?.quantity || 0;
        state.totalPrice -=
          (state.items[itemIndex]?.price || 0) *
          (state.items[itemIndex]?.quantity || 0);
        state.items.splice(itemIndex, 1);
      }
    },

    // Update quantity of an item
    updateQuantity: (
      state,
      action: PayloadAction<{ id: string; quantity: number }>
    ) => {
      const item = state.items.find((item) => item.id === action.payload.id);
      if (item && action.payload.quantity > 0) {
        const quantityDiff = action.payload.quantity - item.quantity;
        state.totalQuantity += quantityDiff;
        state.totalPrice += quantityDiff * item.price;
        item.quantity = action.payload.quantity;
      }
    },

    // Clear entire cart
    clearCart: (state) => {
      state.items = [];
      state.totalQuantity = 0;
      state.totalPrice = 0;
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } =
  cartSlice.actions;
export default cartSlice.reducer;
