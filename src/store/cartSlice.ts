// import FormItem from "@/shared/FormItem";
import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
// import { saveCartToSupabase } from "@/services/cartService";
// import { debounce } from "@/utils/debounce";

// Define product type for cart items
export interface CartItem {
  id: number; // product_id
  name: string;
  price: number;
  // image: string;
  product_size: string | null;
  quantity: number;
  image: string;
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
  name: 'cart', // The slice name (used for actions)
  initialState, // Initial state for the cart
  reducers: {
    // Reducer functions to modify state
    setCart: (state, action: PayloadAction<CartItem[]>) => {
      state.items = action.payload;

      if (action.payload.length == 0) {
        state.totalPrice = 0;
        state.totalQuantity = 0;
      } else {
        let totalPrice = 0;
        let totalQuantity = 0;

        for (const item of state.items) {
          totalQuantity += item.quantity;
          totalPrice += item.price;
        }

        state.totalQuantity = totalQuantity;
        state.totalPrice = totalPrice;
      }

      //console.log*('Setting cart:', action.payload);
    },

    // Add item to cart
    addToCart: (state, action: PayloadAction<CartItem>) => {
      const existingItem = state.items.find(
        // Reducer logic
        (item) =>
          item.id === action.payload.id &&
          item.product_size === action.payload.product_size,
      );

      //console.log*('Before adding item:', JSON.parse(JSON.stringify(state))); // Log before update

      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.items.push({ ...action.payload, quantity: 1 });
      }
      state.totalQuantity += 1;
      state.totalPrice += action.payload.price;

      //console.log*('After adding item:', JSON.parse(JSON.stringify(state))); // Log after update
    },

    // Remove item from cart
    removeFromCart: (
      state,
      action: PayloadAction<{ id: number; product_size: string | null }>,
    ) => {
      const itemIndex = state.items.findIndex(
        (item) =>
          item.id === action.payload.id &&
          item.product_size === action.payload.product_size,
      );
      if (itemIndex !== -1) {
        state.totalQuantity -= state.items[itemIndex]?.quantity || 0;
        state.totalPrice -=
          (state.items[itemIndex]?.price || 0) *
          (state.items[itemIndex]?.quantity || 0);
        state.items.splice(itemIndex, 1); // splice(startingIndex, 1) 1 is how far away to delete
      }
    },

    // Update quantity of an item
    updateQuantity: (
      state,
      // action: PayloadAction<{ id: number; quantity: number;}>
      action: PayloadAction<{
        id: number;
        quantity: number;
        product_size: string | null;
      }>,
    ) => {
      const item = state.items.find(
        (item) =>
          item.id === action.payload.id &&
          item.product_size === action.payload.product_size,
      );
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

export const { setCart, addToCart, removeFromCart, updateQuantity, clearCart } =
  cartSlice.actions;
export default cartSlice.reducer;
