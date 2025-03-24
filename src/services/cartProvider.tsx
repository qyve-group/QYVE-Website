import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { saveCartToSupabase } from "@/services/cartService";
import { debounce } from "@/utils/debounce";

const debouncedSaveCart = debounce(saveCartToSupabase, 1000); // 1-second delay


const CartSync = () => {

    const auth = useSelector((state: RootState) => state.auth);
    const cart = useSelector((state: RootState) => state.cart);
    const latestCartRef = useRef(cart); // Store the latest cart reference

    useEffect(() => {
        latestCartRef.current = cart; // Update ref on every render
    }, [cart]);


    useEffect(() => {
       
        if (!auth.user || cart.items.length === 0) return;

        // const latestCart = [...cart];

        // console.log("cartProvider.tsx: current redux cart: ", cart);
        // console.log("cartProvider.tsx: current redux cart items: ", cart.items.length);
        // console.log("cartProvider.tsx: current redux cart total price: ", cart.totalPrice);
        // console.log("cartProvider.tsx: current redux cart total quantity: ", cart.totalQuantity);
        // saveCartToSupabase(auth.user.id, cart);
        console.log("cartProvider.tsx ----- Syncing redux cart to supabase...");
        console.log("cart items: ", cart.items);
        debouncedSaveCart(auth.user.id, cart.items);
 
    }, [cart]);

    return null;
}

export default CartSync;