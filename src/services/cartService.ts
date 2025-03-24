import { supabase } from "@/libs/supabaseClient";
import { setCart } from "@/store/cartSlice";
import { AppDispatch, RootState } from "@/store/store";
import { UUID } from "crypto";
import { store } from "@/store/store";
import CartSync from "./cartProvider"; 
import { debounce } from "@/utils/debounce";


type CartItemToPush = {
  cartItem_id?: UUID | undefined;
  cart_id: UUID;
  product_id: number;
  quantity: number;
  price: number;
  size_id: number;
};

type CartItemToDelete = {
  cartItem_id: UUID;
};

type supabaseCartItem = {
  id: UUID;
  cart_id: UUID;
  product_id: number;
  size_id: number;
  quantity: number;
  price: number;  
}
  //example supabaseCartItems
    //   {
    //     "id": "7becc05f-f863-428b-82bc-83fda98d8643", ------------------------> this cartItems_id
    //     "cart_id": "3d7bc8ce-745b-4c2c-a60f-5427bd4a4dcd",
    //     "product_id": 6,
    //     "size_id": 6,
    //     "quantity": 1,
    //     "price": 50,
    //     "created_at": "2025-03-21T23:10:04.873857",
    //     "updated_at": "2025-03-21T23:10:04.873857"

type reduxCartItem = {
  id: number; //product_id
  name: string;
  price: number;
  product_size: string | null;
  quantity: number;
  image: string;
}
  //example reduxCartItems
    //   {
    //     "id": "1", ------------------------> this is product_id
    //     "image": "some url",
    //     "name": "BlackJ",
    //     "price": 60,
    //     "quantity": 1,

    // export interface CartItem {
    //   id: number; //product_id
    //   name: string;
    //   price: number;
    //   // image: string;
    //   product_size: string | null;
    //   quantity: number;
    //   image: string;
    // }


const mergeCarts = async (reduxCart: reduxCartItem[], supabaseCart: supabaseCartItem[]): Promise<reduxCartItem[]> => {
  const mergedCart: reduxCartItem[] = [];

  
  // Convert Supabase cart items to a Map for quick lookup
  const formattedSupabaseCart = new Map(
    supabaseCart.map((item) => [
      `${item.product_id}-${item.size_id}`,
      { ...item, quantity: item.quantity, price: item.price }
    ])
  );

  // Create a Map for merged cart items
  const cartMap = new Map<string, any>();

  console.log("Initial supabaseCart:", supabaseCart);
  console.log("Initial reduxCart:", reduxCart);

  // Process Redux cart items and fetch their corresponding size_id
  await Promise.all(
    reduxCart.map(async (item) => {
      // Fetch size_id from Supabase
      const { data: products_sizesTable, error } = await supabase
        .from("products_sizes")
        .select("id")
        .eq("size", item.product_size)
        .eq("product_id", item.id)
        .maybeSingle();

      if (error) {
        console.error("Error fetching size_id from Supabase:", error);
        return;
      }

      const sizeId = products_sizesTable?.id; // Get the size_id

      if (!sizeId) {
        console.warn(`No size_id found for product_id: ${item.id}, size: ${item.product_size}`);
        return;
      }

      // Unique key using product_id and size_id
      const key = `${item.id}-${sizeId}`;

      if (cartMap.has(key)) {
        console.log(`Duplicate item detected in Redux: ${key}, merging...`);
        // Merge quantities and prices properly
        const existingItem = cartMap.get(key);
        cartMap.set(key, {
          ...existingItem,
          quantity: existingItem.quantity + item.quantity, // Sum quantity
          price: existingItem.price + item.price, // Sum price
        });
      } else {
        // Add new Redux item
        cartMap.set(key, { ...item, size_id: sizeId });
      }
    })
  );

  console.log("Redux cart after merging:", Array.from(cartMap.values()));

  // Merge Supabase items into the map (without overriding existing Redux items)
  formattedSupabaseCart.forEach((supabaseItem, key) => {
    if (cartMap.has(key)) {
      console.log(`Merging Supabase item with Redux item: ${key}`);
      // Merge quantities & price
      const existingItem = cartMap.get(key);
      cartMap.set(key, {
        ...existingItem,
        quantity: existingItem.quantity + supabaseItem.quantity, // Sum quantity
        price: existingItem.price + supabaseItem.price, // Sum price
      });
    } else {
      // If item is only in Supabase, add it
      cartMap.set(key, supabaseItem);
    }
  });

  // Convert map values back to an array
  mergedCart.push(...Array.from(cartMap.values()));

  console.log("Final mergedCart:", mergedCart);

  return mergedCart;
};

  // // Convert Supabase cart items to the Redux format
  // const formattedSupabaseCart = supabaseCart.map((item) => ({
  //   cartItem_id: item.id, // Supabase cart item ID
  //   cart_id: item.cart_id,
  //   product_id: item.product_id,
  //   size_id: item.size_id,
  //   quantity: item.quantity,
  //   price: item.price,
  // }));

  // // Create a Map for quick lookups
  // const cartMap = new Map<string, any>();
  // console.log("supabaseCart: " + formattedSupabaseCart + " reduxCart: " + reduxCart);
  // // Add Redux cart items to the map
  //   await Promise.all(
  //     reduxCart.map(async (item) => {
  //       // Fetch size_id from Supabase
  //       const { data: products_sizesTable, error } = await supabase
  //         .from("products_sizes")
  //         .select("id")
  //         .eq("size", item.product_size)
  //         .eq("product_id", item.id)
  //         .maybeSingle();
  
  //       if (error) {
  //         console.error("Error fetching size_id from Supabase:", error);
  //         return;
  //       }
  
  //       const sizeId = products_sizesTable?.id; // Get the size_id
  
  //       if (!sizeId) {
  //         console.warn(`No size_id found for product_id: ${item.id}, size: ${item.product_size}`);
  //         return;
  //       }
  
  //       // Use product_id and size_id as the unique key
  //       const key = `${item.id}-${sizeId}`;
  
  //       // if (cartMap.has(key)) {
  //       //   // If the item already exists, update the quantity and price
  //       //   const existingItem = cartMap.get(key)!;
  //       //   existingItem.quantity += item.quantity;
  //       //   existingItem.price += item.price; // Adjust price if needed
  //       // } else {
  //       //   // If the item does not exist, add it to the map
  //       //   cartMap.set(key, { ...item, size_id: sizeId });
  //       // }

  //       if (cartMap.has(key)) {
  //         console.log(`Duplicate item detected in Redux: ${key}, merging...`);
  //         // Instead of doubling, ensure correct summation
  //         const existingItem = cartMap.get(key);
  //         cartMap.set(key, {
  //           ...existingItem,
  //           quantity: existingItem.quantity + item.quantity, // Sum quantity once
  //           price: existingItem.price + item.price, // Sum price once
  //         });
  //       } else {
  //         // Add a new entry from Redux
  //         cartMap.set(key, { ...item, size_id: sizeId });
  //       }
  //     })
  //   );
  
  //   console.log("Updated reduxCart onto cartMap :", Array.from(cartMap.values())); // Debugging
    

  // // Merge Supabase items into the map
  // formattedSupabaseCart.forEach((supabaseItem) => {
  //   console.log("supabaseItem: ", supabaseItem);
  //   const key = `${supabaseItem.product_id}-${supabaseItem.size_id}`;
  //   // if (cartMap.has(key)) {
  //   //   // Merge quantities if item exists
  //   //   cartMap.get(key).quantity += supabaseItem.quantity;
  //   //   cartMap.get(key).price += supabaseItem.price;
  //   // } else {
  //   //   // Otherwise, add new item from Supabase
  //   //   cartMap.set(key, supabaseItem);
  //   // }

  //   cartMap.set(key, supabaseItem);
  // });

  // // Convert map values back to an array
  // cartMap.forEach((item) => mergedCart.push(item));

  // console.log("mergedCart: ", mergedCart);

  // return mergedCart;
// };

export const fetchCartFromSupabase = async (userId: string | null, dispatch: AppDispatch) => {
  if (!userId) return;

  const currCart = store.getState().cart;

  try {
    // Fetch the cart ID for the user
    const { data: cart, error: cartError } = await supabase
      .from("carts")
      .select("id")
      .eq("user_id", userId)
      .maybeSingle();

    if (cartError) throw cartError;
    let cartId: UUID | undefined = cart?.id;

    // If no cart exists, create a new one
    if (!cartId) {
      const { data: newCart, error: newCartError } = await supabase
        .from("carts")
        .insert([{ user_id: userId }])
        .select("id")
        .single();

      if (newCartError) throw newCartError;
      cartId = newCart.id;
      console.log("New cart created for user id:", userId);
    } 

    // Fetch cart items
    const { data: cartItems, error: itemsError } = await supabase
      .from("cart_items")
      .select("*")
      .eq("cart_id", cartId);

    if (itemsError) throw itemsError;

    console.log("Current cart items from Supabase:", cartItems);

    // Merge Supabase cart with persisted Redux cart
    const mergedCartItems = mergeCarts(currCart.items, cartItems || []);

    console.log("Cart state before setting from Supabase:", currCart);

    console.log("mergedCartItems: ", mergedCartItems);

    // dispatch(setCart(cartItems || []));
    dispatch(setCart(await mergedCartItems))

    console.log("Cart state after setting from Supabase:", store.getState().cart);
  } catch (error) {
    console.error("Error fetching cart:", error);
  }
};

export const saveCartToSupabase = async (userId: string, reduxCartItems: any[]) => {
  try {
    // Fetch the cart ID
    console.log("User id: ", userId);

    const { data: cart, error: cartError } = await supabase
      .from("carts")
      .select("id")
      .eq("user_id", userId)
      .single();

      console.log("User id's cart: ", cart);

    if (cartError || !cart) throw new Error(`User id: ${userId} does not have an existing cart`);

    const cartId = cart.id;

    // Fetch existing cart items
    const { data: existingItems, error: existingItemsError } = await supabase
      .from("cart_items")
      .select("*")
      .eq("cart_id", cartId);

    if (existingItemsError) throw existingItemsError;

    console.log("Existing items from Supabase:", existingItems);

    // Convert existing items to a Map for quick lookup

    //Supabase cart_items 
    // const existingItemsMap = new Map(existingItems.map((item) => [item.product_id, item]));
    const existingItemsMap = new Map<string, supabaseCartItem>();

    existingItems.forEach((item) => {
      const key = `${item.product_id}-${item.size_id}`;
      existingItemsMap.set(key, item);
    })

    console.log("existingItemsMap: ", existingItemsMap);

    // Prepare batch updates
    const itemsToInsertOrUpdate: CartItemToPush[] = [];
    const itemsToDelete: CartItemToDelete[] = [];

    // Loop through cart items using `for...of` for proper async handling
    for (const item of reduxCartItems) {

      // Fetch the size_id based on product_id and size name
      console.log("item: ", item);

    console.log("item.product_id: " + item.id + " size: " + item.product_size);


      //getting size_id
      const { data: sizeData, error: sizeError } = await supabase
        .from("products_sizes")
        .select("id")
        .eq("product_id", item.id)  //item.id is referring to product_id
        .eq("size", item.product_size) // Match size name (e.g., "M")
        .single();

        if (sizeError) {
          console.error(`Error fetching size_id for size ${item.product_size}:`, sizeError);
        } else {
          console.log(`size_id: ${sizeData.id}, size: ${item.product_size}, product_id: ${item.id}`);
        }

      const sizeId = sizeData?.id;

      //Supabase cart_items 
      const key = `${item.id}-${sizeId}`;
      const existingItem = existingItemsMap.get(key); //item.id is product_id

      if (existingItem) {
        // Update only if quantity, price, or size_id has changed
        if (
          existingItem.quantity !== item.quantity ||
          existingItem.price !== item.price ||
          existingItem.size_id !== sizeId
        ) {
          itemsToInsertOrUpdate.push({
            cartItem_id: existingItem.id,
            cart_id: cartId,
            product_id: item.id,
            quantity: item.quantity,
            price: item.price,
            size_id: sizeId,
          });
        }
        existingItemsMap.delete(key)
      } else {
        // Insert new item
        itemsToInsertOrUpdate.push({
          // cartItem_id: undefined,
          cart_id: cartId,
          product_id: item.id,
          quantity: item.quantity,
          price: item.price,
          size_id: sizeId,
        });

        console.log("itemsToInsertOrUpdate elements when no existing/duplicate items in Supabase: ", itemsToInsertOrUpdate);
      }
    }

    
    // Any remaining items in existingItemsMap should be deleted
    existingItemsMap.forEach((item) => itemsToDelete.push({ cartItem_id: item.id }));

    console.log("itemsToInsertOrUpdate: ", itemsToInsertOrUpdate);
    console.log("itemsToDelete: ", itemsToDelete);

    const updates = itemsToInsertOrUpdate.map(item => ({
      id: item?.cartItem_id,
      cart_id: item.cart_id, // Match existing row
      product_id: item.product_id,
      size_id: item.size_id,
      quantity: item.quantity,
      price: item.price
    }));

    console.log("Updates: ", updates);
    
    for (const updateItem of updates) {
      if (updateItem.id == undefined){
        const { error } = await supabase
        .from("cart_items")
        // .upsert(updates, { onConflict: "cart_id, product_id, size_id" });
        .insert(updateItem);
        if(error){console.error("Error inserting")};
      }
      else{
        const { error } = await supabase
        .from("cart_items")
        // .upsert(updates, { onConflict: "cart_id, product_id, size_id" });
        .upsert(updates);
        if(error){console.error("Error upserting")};
      }
    }

  //   const { error } = await supabase
  //   .from("cart_items")
  //   // .upsert(updates, { onConflict: "cart_id, product_id, size_id" });
  //   .upsert(updates);
  
  // if (error) console.error("Upsert error:", error);
      
  //   if (error) console.error("Batch update failed:", error);
  //   else console.log("Batch update successful");
    

    if (itemsToDelete.length > 0) {
      await supabase.from("cart_items").delete().in("id", itemsToDelete.map((item) => item.cartItem_id));
    }

    console.log("Cart successfully updated in Supabase.");
  } catch (error) {
    console.error("Error saving cart:", error);
  }
};









// import { supabase } from "@/libs/supabaseClient";
// import { setCart } from "@/store/cartSlice";
// import { AppDispatch, RootState} from "@/store/store";
// import { UUID } from "crypto";
// import { store } from "@/store/store";

// type cartItemsToPush = {
//   cart_id: UUID;
//   product_id: number;
//   quantity: number;
//   price: number;
//   size_id: number;
// }

// type cartItemsToDelete = {
//   id: UUID;
// }

// export const fetchCartFromSupabase = async (userId: string | null, dispatch: AppDispatch) => {
//   const currCart = store.getState().cart;

//   try {
//     // if(userId == null){return;}
//     // Check if cart exists
//     const { data: cart, error: cartError } = await supabase
//       .from("carts")
//       .select("id")
//       .eq("user_id", userId)
//       .single();

//     let cartId: UUID | undefined = cart?.id;

//     // If no cart exists, create one
//     if (cartId == undefined) {
//       const { data: newCart, error: newCartError } = await supabase
//         .from("carts")
//         .insert([{ user_id: userId }])
//         .select("id")
//         .single();

//       if (newCartError) throw newCartError;
//       cartId = newCart?.id;
//       console.log("New cart id generated: ", cartId);
//       console.log("New cart created for user id: ", userId);
//     }
//     else{
//       console.log("User has an existing cart id: ", cartId);
//     }

//     // Fetch cart items from cart_items table
//     const { data: cartItems, error: itemsError } = await supabase
//       .from("cart_items")
//       .select("*")
//       .eq("cart_id", cartId);

//     if (itemsError) throw itemsError;
    
//     console.log("Current cart items of user from supabase: ", cartItems);

//     console.log("cartService.ts ----- Current cart state: ", currCart);

//     dispatch(setCart(cartItems || []));

//     console.log("cartService.ts ----- Current cart state after setting cart from supabase: ", currCart);

//   } catch (error) {
//     console.error("Error setting cart:", error);
//   }
// };

// export const saveCartToSupabase = async (userId: string, cartItems: any[]) => {
//   try {
//     // Get user's cart ID
//     const { data: cart, error: cartError } = await supabase
//       .from("carts")
//       .select("id")
//       .eq("user_id", userId)
//       .single();

//     if (cartError || !cart) throw new Error("User id: " + userId + " does not have existing cart");

//     // console.log("Retrieving user id: " + userId + "\nRetrieving cart id: " + cart);

//     const cartId = cart.id;

//     try{
//       const { data: existingItems, error: existingItemsError } = await supabase
//       .from("cart_items")
//       .select("*")
//       .eq("cart_id", cartId);

//       console.log("Existing items from Supabase: ", existingItems);
//       // Convert existing items to a map for quick lookup
//       const existingItemsMap = new Map(existingItems?.map((item) => [item.product_id, item]));

//       // Prepare batch updates
//       const itemsToInsertOrUpdate: cartItemsToPush[] = [];
//       const itemsToDelete: cartItemsToDelete[] = []; // If you're deleting based on an 'id'

//       cartItems.forEach((item) => {
//         const existingItem = existingItemsMap.get(item.product_id);
        
//         if (existingItem) {
//           // Update only if quantity or price has changed
//           if (existingItem.quantity !== item.quantity || existingItem.price !== item.price) {
//             const { data: sizeData, error: sizeError } = await supabase
//               .from("products_size")
//               .select("id")
//               .eq("product_id", item.product_id) // Match with the product
//               .eq("size", item.size) // Match size name (e.g., "M")
//               .single();

//             itemsToInsertOrUpdate.push({
//               cart_id: cartId,
//               product_id: item.product_id,
//               quantity: item.quantity,
//               price: item.price,
//               size_id: sizeData,
//             });
//           }
//           // Remove from map to track which items are still in the cart
//           existingItemsMap.delete(item.product_id);
//         } else {

//           const { data: sizeData, error: sizeError } = await supabase
//           .from("products_size")
//           .select("id")
//           .eq("product_id", item.product_id) // Match with the product
//           .eq("size", item.size) // Match size name (e.g., "M")
//           .single();

//           // New item to insert
//           itemsToInsertOrUpdate.push({
//             cart_id: cartId,
//             product_id: item.product_id,
//             quantity: item.quantity,
//             price: item.price,
//             size_id: sizeData,
//           });
//         }
//         });

//         // Any remaining items in existingItemsMap are no longer in the cart, so delete them
//         existingItemsMap.forEach((item) => itemsToDelete.push(item.id));

//         // Perform batch operations
//         if (itemsToInsertOrUpdate.length > 0) {


//           await supabase.from("cart_items").upsert(itemsToInsertOrUpdate);
//         }

//         if (itemsToDelete.length > 0) {
//           await supabase.from("cart_items").delete().in("id", itemsToDelete);
//         }

//     }
//     catch (existingItemsError){
//         console.error("Error in fetching existing items from Supabase: ", existingItemsError);
//     }
    
//   } 
//   catch (cartError) {
//       console.error("Error saving cart:", cartError);
//   }




  






//   //   if (existingItemsError) throw existingItemsError;

//   //   // Convert existing items to a map for quick lookup
//   //   const existingItemsMap = new Map(existingItems.map((item) => [item.product_id, item]));

//   //   // Prepare batch updates
//   //   // const itemsToInsertOrUpdate = [<cartItemsToPush>];
//   //   const itemsToInsertOrUpdate: cartItemsToPush[] = [];
//   //   const itemsToDelete: cartItemsToDelete[] = []; // If you're deleting based on an 'id'

//   //   cartItems.forEach((item) => {
//   //     const existingItem = existingItemsMap.get(item.product_id);
      
//   //     if (existingItem) {
//   //       // Update only if quantity or price has changed
//   //       if (existingItem.quantity !== item.quantity || existingItem.price !== item.price) {
//   //         itemsToInsertOrUpdate.push({
//   //           cart_id: cartId,
//   //           product_id: item.product_id,
//   //           quantity: item.quantity,
//   //           price: item.price,
//   //         });
//   //       }
//   //       // Remove from map to track which items are still in the cart
//   //       existingItemsMap.delete(item.product_id);
//   //     } else {
//   //       // New item to insert
//   //       itemsToInsertOrUpdate.push({
//   //         cart_id: cartId,
//   //         product_id: item.product_id,
//   //         quantity: item.quantity,
//   //         price: item.price,
//   //       });
//   //     }
//   //   });

//   //   // Any remaining items in existingItemsMap are no longer in the cart, so delete them
//   //   existingItemsMap.forEach((item) => itemsToDelete.push(item.id));

//   //   // Perform batch operations
//   //   if (itemsToInsertOrUpdate.length > 0) {
//   //     await supabase.from("cart_items").upsert(itemsToInsertOrUpdate);
//   //   }

//   //   if (itemsToDelete.length > 0) {
//   //     await supabase.from("cart_items").delete().in("id", itemsToDelete);
//   //   }

//   //   console.log("Cart successfully updated in Supabase.");
//   // } catch (error) {
//   //   console.error("Error saving cart:", error);
//   // }






//   //   // Clear existing cart items
//   //   await supabase.from("cart_items").delete().eq("cart_id", cartId);

//   //   // Insert new cart items
//   //   if (cartItems.length > 0) {
//   //     await supabase.from("cart_items").insert(
//   //       cartItems.map((item) => ({
//   //         cart_id: cartId,
//   //         product_id: item.product_id,
//   //         quantity: item.quantity,
//   //         price: item.price,
//   //       }))
//   //     );
//   //   }
//   // } catch (error) {
//   //   console.error("Error saving cart:", error);
//   // }
// };






















// // import { supabase } from "@/libs/supabaseClient";
// // import { setCart } from "@/store/cartSlice";
// // import { AppDispatch } from "@/store/store";

// // interface cart {
// //     cartId: string;
// // }

// // export const fetchCartFromSupabase = async (userId: string, dispatch: AppDispatch) => {
// //   const { data: cart, error } = await supabase.from("carts").select("id").eq("user_id", userId).single();

// //   if (!cart) {
// //     const { data, error } = await supabase
// //       .from("carts")
// //       .insert([{ user_id: userId }])
// //       .select("id")
// //       .single();
// //     cartId = data?.id;
// //   } else {
// //     cartId = cart.id;
// //   }

// //   if (error) {
// //     console.error("Error fetching cart:", error);
// //   } else if (cart) {
// //     dispatch(setCart(cart.items || []));
// //   }
// // };

// // export const saveCartToSupabase = async (userId: string, cartItems: any[]) => {
// //   const { data, error } = await supabase
// //     .from("carts")
// //     .upsert([{ user_id: userId, items: cartItems }], { onConflict: ["user_id"] });

// //   if (error) {
// //     console.error("Error saving cart:", error);
// //   }
// // };
