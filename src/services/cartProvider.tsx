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

        console.log("cartProvider.tsx ----- Syncing redux cart to supabase...");
        console.log("cart items: ", cart.items);
        debouncedSaveCart(auth.user.id, cart.items);
 
    }, [cart]);

    return null;
}

export default CartSync;