import { supabase } from "@/libs/supabaseClient";
import { setCart } from "@/store/cartSlice";
import { AppDispatch} from "@/store/store";
import { UUID } from "crypto";
import { store } from "@/store/store";
// import CartSync from "./cartProvider"; 
// import { debounce } from "@/utils/debounce";
import { CartItem } from "@/store/cartSlice";


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

// type reduxCartItem = {
//   id: number; //product_id
//   name: string;
//   price: number;
//   product_size: string | null;
//   quantity: number;
//   image: string;
// }
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


// const mergeCarts = async (reduxCart: reduxCartItem[], supabaseCart: supabaseCartItem[]): Promise<reduxCartItem[]> => {
//   const mergedCart: reduxCartItem[] = [];

  
//   // Convert Supabase cart items to a Map for quick lookup
//   const formattedSupabaseCart = new Map(
//     supabaseCart.map((item) => [
//       `${item.product_id}-${item.size_id}`,
//       { ...item, quantity: item.quantity, price: item.price }
//     ])
//   );
//   console.log("formattedSupabaseCart: ", formattedSupabaseCart);

//   // Create a Map for merged cart items
//   const cartMap = new Map<string, any>();

//   console.log("Initial supabaseCart:", supabaseCart);
//   console.log("Initial reduxCart:", reduxCart);

//   // Process Redux cart items and fetch their corresponding size_id
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

//       // Unique key using product_id and size_id
//       const key = `${item.id}-${sizeId}`;

//       if (cartMap.has(key)) {
//         console.log(`Duplicate item detected in Redux: ${key}, merging...`);
//         // Merge quantities and prices properly
//         const existingItem = cartMap.get(key);
//         cartMap.set(key, {
//           ...existingItem,
//           quantity: existingItem.quantity + item.quantity, // Sum quantity
//           price: existingItem.price + item.price, // Sum price
//         });
//       } else {
//         // Add new Redux item
//         cartMap.set(key, { ...item, size_id: sizeId });
//       }
//     })
//   );

//   console.log("Redux cart after merging:", Array.from(cartMap.values()));

//   // Merge Supabase items into the map (without overriding existing Redux items)
//   formattedSupabaseCart.forEach((supabaseItem, key) => {
//     if (cartMap.has(key)) {
//       console.log(`Merging Supabase item with Redux item: ${key}`);
//       // Merge quantities & price
//       const existingItem = cartMap.get(key);
//       cartMap.set(key, {
//         ...existingItem,
//         quantity: existingItem.quantity + supabaseItem.quantity, // Sum quantity
//         price: existingItem.price + supabaseItem.price, // Sum price
//       });
//     } else {
//       // If item is only in Supabase, add it
//       cartMap.set(key, supabaseItem);
//     }
//   });

//   // Convert map values back to an array
//   mergedCart.push(...Array.from(cartMap.values()));

//   console.log("Final mergedCart:", mergedCart);

//   return mergedCart;
// };

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

    console.log("Cart state before setting from Supabase:", currCart);


    // Fetch cart items from supabase
    const { data: supabaseCartItems, error: supabaseCartItemsError } = await supabase
      .from("cart_items")
      .select("*")
      .eq("cart_id", cartId);

    if (supabaseCartItemsError) throw supabaseCartItemsError;

    console.log("Current cart items from Supabase:", supabaseCartItems);

    
    // Fetch additional product and size details for each item
    const supabaseCartWithDetails = await Promise.all(
      supabaseCartItems.map(async (supabaseCartItem) => {
        // Fetch product details
        const { data: supabaseProductInfo, error: productError } = await supabase
          .from("products")
          .select("*")
          .eq("id", supabaseCartItem.product_id)
          .maybeSingle();

        if (productError) {
          console.error("Error fetching product info:", productError);
          return null;
        }

        // Fetch size details
        const { data: supabaseSizeInfo, error: sizeError } = await supabase
          .from("products_sizes")
          .select("*")
          .eq("id", supabaseCartItem.size_id)
          .maybeSingle();

        if (sizeError) {
          console.error("Error fetching size info:", sizeError);
          return null;
        }

        // Construct new cart item
        return {
          id: supabaseCartItem.product_id,
          name: supabaseProductInfo.name,
          price: supabaseCartItem.price,
          product_size: supabaseSizeInfo.size || null,
          quantity: supabaseCartItem.quantity,
          image: supabaseProductInfo.image_cover,
        };
      })
    );

    const supabaseCartWithDetailsFiltered = supabaseCartWithDetails.filter(item => item !== null);

     dispatch(setCart(supabaseCartWithDetailsFiltered));

    console.log("Cart state after setting from Supabase:", store.getState().cart);
  } catch (error) {
    console.error("Error fetching cart:", error);
  }
};

export const saveCartToSupabase = async (userId: string, reduxCartItems: any[]) => {
  try {

    //------------------------- fetching cartid and retrieving items from supabase to put into map   ------------------------------------------------------------
    // Fetch the cart ID
    const { data: cart, error: cartError } = await supabase
      .from("carts")
      .select("id")
      .eq("user_id", userId)
      .single();

      console.log("User id's cart: ", cart);

    if (cartError || !cart) throw new Error(`User id: ${userId} does not have an existing cart`);

    const cartId = cart.id;

    // Fetch existing supabase cart items
    const { data: supabaseExistingItems, error: supabaseExistingItemsError } = await supabase
      .from("cart_items")
      .select("*")
      .eq("cart_id", cartId);

    if (supabaseExistingItemsError) throw supabaseExistingItemsError;

    console.log("Existing items from Supabase:", supabaseExistingItems);

    // Convert existing items to a Map for quick lookup
    //Supabase cart_items 
    const supabaseExistingItemsMap = new Map<string, supabaseCartItem>();

    supabaseExistingItems.forEach((supabaseExistingItem) => {
      const key = `${supabaseExistingItem.product_id}-${supabaseExistingItem.size_id}`;
      // const key = `${item.id}`;
      supabaseExistingItemsMap.set(key, supabaseExistingItem);
    })

    console.log("existingItemsMap: ", supabaseExistingItemsMap);

//-------------------------------  getting size_id from supabase using reduxCartItems elements   -------------------------------------------------------------------
    // Prepare batch updates
    const itemsToInsertOrUpdate: CartItemToPush[] = [];
    const itemsToDelete: CartItemToDelete[] = [];

    console.log("reduxCartItems: ", reduxCartItems);

    // Loop through cart items to check if supabaseItems need to be updated
    for (const reduxCartitem of reduxCartItems) {

      console.log("item: ", reduxCartitem);

      // Fetch the size_id based on product_id and size name
      const { data: reduxSizeInfo, error: reduxSizeInfoError } = await supabase
        .from("products_sizes")
        .select("id")
        .eq("product_id", reduxCartitem.id)  //item.id is referring to product_id
        .eq("size", reduxCartitem.product_size) // Match size name (e.g., "M")
        .single();

        if (reduxSizeInfoError) {
          console.error(`Error fetching size_id for size ${reduxCartitem.product_size}:`, reduxSizeInfoError);
        } else {
          console.log(`size_id: ${reduxSizeInfo.id}, size: ${reduxCartitem.product_size}, product_id: ${reduxCartitem.id}`);
        }

      const sizeId = reduxSizeInfo?.id;

      //key for reduxCartItem
      const key = `${reduxCartitem.id}-${sizeId}`;

      //cross referencing using reduxCartItem key with existingItemsMap (this is the map containing supabase fetched data) to filter out existing items
      const supabaseExistingItem = supabaseExistingItemsMap.get(key); //item.id is product_id
      
      //exitingItem is true if product_id and sizeId is the same
      if (supabaseExistingItem) { 
        console.log("reduxCartItem key: " + key + " found for supabaseExistingItem: " + supabaseExistingItem);

        // Update only if quantity, price, or size_id has changed
        if (
          supabaseExistingItem.quantity !== reduxCartitem.quantity ||
          supabaseExistingItem.price !== reduxCartitem.price
          
        ) {
          console.log("Either quantity or price needs update");
          itemsToInsertOrUpdate.push({
            cartItem_id: supabaseExistingItem.id,
            cart_id: cartId,
            product_id: reduxCartitem.id,
            quantity: reduxCartitem.quantity,
            price: reduxCartitem.price,
            size_id: sizeId,
          });
        }
        else {
          console.log("No quantity or price update requrired for this item: ", key);
        }
        supabaseExistingItemsMap.delete(key)
      } else {
        console.log("reduxCartItem key: " + key + " not found for supabaseExistingItem: " + supabaseExistingItem);

        // Insert new item
        itemsToInsertOrUpdate.push({
          // cartItem_id: undefined,
          cart_id: cartId,
          product_id: reduxCartitem.id,
          quantity: reduxCartitem.quantity,
          price: reduxCartitem.price,
          size_id: sizeId,
        });

      }
    }

    
    // Any remaining items in existingItemsMap should be deleted because these items do not need to be updated in supabase. supabaseExistingItemsMap is only used to find items that need updates
    supabaseExistingItemsMap.forEach((item) => itemsToDelete.push({ cartItem_id: item.id }));

    console.log("itemsToInsertOrUpdate from supabaseExistingItemsMap: ", itemsToInsertOrUpdate);
    console.log("itemsToDelete from supabaseExistingItemsMap: ", itemsToDelete);

    //this is to reformat the title so that it matches with cart_items table in supabase
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
      if (updateItem.id){
          const { error } = await supabase
          .from("cart_items")
          // .upsert(updates, { onConflict: "cart_id, product_id, size_id" });
          .upsert(updates);

          if(error){console.error("Error upserting")};
          console.log("Upserting existing cartItem_id: ", updates);
        }
      else{
        const { error } = await supabase
        .from("cart_items")
        // .upsert(updates, { onConflict: "cart_id, product_id, size_id" });
        .insert(updateItem);

        console.log("Inserting new cartItem_id: ", updates);
        if(error){console.error("Error inserting")};
      }

    }

    console.log("Cart successfully updated in Supabase.");
  } catch (error) {
    console.error("Error saving cart:", error);
  }
};

export const saveCartAfterRemove = async (userId: string, removedCartItem: CartItem) => {
  try {

    //------------------------- fetching cartid and retrieving items from supabase to put into map   ------------------------------------------------------------
    // Fetch the cart ID
    const { data: cart, error: cartError } = await supabase
      .from("carts")
      .select("id")
      .eq("user_id", userId)
      .single();

      console.log("User id's cart: ", cart);

    if (cartError || !cart) throw new Error(`User id: ${userId} does not have an existing cart`);

    const cartId = cart.id;

    // Fetch existing supabase cart items
    const { data: supabaseExistingItems, error: supabaseExistingItemsError } = await supabase
      .from("cart_items")
      .select("*")
      .eq("cart_id", cartId);

    if (supabaseExistingItemsError) throw supabaseExistingItemsError;

    console.log("Existing items from Supabase:", supabaseExistingItems);

    // Convert existing items to a Map for quick lookup
    //Supabase cart_items 
    const supabaseExistingItemsMap = new Map<string, supabaseCartItem>();

    supabaseExistingItems.forEach((supabaseExistingItem) => {
      const key = `${supabaseExistingItem.product_id}-${supabaseExistingItem.size_id}`;
      // const key = `${item.id}`;
      supabaseExistingItemsMap.set(key, supabaseExistingItem);
    })

    console.log("existingItemsMap: ", supabaseExistingItemsMap);

//-------------------------------  getting size_id from supabase using reduxCartItems elements   -------------------------------------------------------------------
    // // Prepare batch updates
    // const itemsToInsertOrUpdate: CartItemToPush[] = [];
    // const itemsToDelete: CartItemToDelete[] = [];

    // Fetch the size_id based on product_id and size name
    const { data: reduxSizeInfo, error: reduxSizeInfoError } = await supabase
    .from("products_sizes")
    .select("id")
    .eq("product_id", removedCartItem.id)  //item.id is referring to product_id
    .eq("size", removedCartItem.product_size) // Match size name (e.g., "M")
    .single();

    if (reduxSizeInfoError) {
      console.error(`Error fetching size_id for size ${removedCartItem.product_size}:`, reduxSizeInfoError);
    } else {
      console.log(`size_id: ${reduxSizeInfo.id}, size: ${removedCartItem.product_size}, product_id: ${removedCartItem.id}`);
    }

    const sizeId = reduxSizeInfo?.id;

    const reduxKeyToDelete = `${removedCartItem.id}-${sizeId}`;

    const supabaseItemToDelete = supabaseExistingItemsMap.get(reduxKeyToDelete);

    if (supabaseItemToDelete) {
      const { error } = await supabase
        .from("cart_items")
        .delete()
        .eq("id", supabaseItemToDelete.id); // Delete by item ID
    
      if (error) {
        console.error("Error deleting item from Supabase:", error);
      } else {
        console.log(`Deleted cart item with ID: ${supabaseItemToDelete.id}`);
      }
    }
  
    // // Loop through cart items using `for...of` for proper async handling
    // for (const reduxCartitem of reduxCartItems) {

    //   console.log("item: ", reduxCartitem);

    //   // Fetch the size_id based on product_id and size name
    //   const { data: reduxSizeInfo, error: reduxSizeInfoError } = await supabase
    //     .from("products_sizes")
    //     .select("id")
    //     .eq("product_id", reduxCartitem.id)  //item.id is referring to product_id
    //     .eq("size", reduxCartitem.product_size) // Match size name (e.g., "M")
    //     .single();

    //     if (reduxSizeInfoError) {
    //       console.error(`Error fetching size_id for size ${reduxCartitem.product_size}:`, reduxSizeInfoError);
    //     } else {
    //       console.log(`size_id: ${reduxSizeInfo.id}, size: ${reduxCartitem.product_size}, product_id: ${reduxCartitem.id}`);
    //     }

    //   const sizeId = reduxSizeInfo?.id;

    //   //------------------------------- //------------------------------- //------------------------------- //------------------------------- 

    //   //key for reduxCartItem
    //   const reduxKey = `${reduxCartitem.id}-${sizeId}`;
      
    //   //cross referencing using reduxCartItem key with existingItemsMap (this is the map containing supabase fetched data) to filter out existing items
    //   const supabaseExistingItem = supabaseExistingItemsMap.get(reduxKey); //item.id is product_id
      
    //   //exitingItem is true if product_id and sizeId is the same
    //   if (supabaseExistingItem) { 
    //     // Update only if quantity, price, or size_id has changed
    //     if (
    //       supabaseExistingItem.quantity !== reduxCartitem.quantity ||
    //       supabaseExistingItem.price !== reduxCartitem.price
    //     ) {
    //       itemsToInsertOrUpdate.push({
    //         cartItem_id: supabaseExistingItem.id,
    //         cart_id: cartId,
    //         product_id: reduxCartitem.id,
    //         quantity: reduxCartitem.quantity,
    //         price: reduxCartitem.price,
    //         size_id: sizeId,
    //       });
    //     }
    //     supabaseExistingItemsMap.delete(reduxKey)
    //   } else {
    //     // Insert new item
    //     itemsToInsertOrUpdate.push({
    //       // cartItem_id: undefined,
    //       cart_id: cartId,
    //       product_id: reduxCartitem.id,
    //       quantity: reduxCartitem.quantity,
    //       price: reduxCartitem.price,
    //       size_id: sizeId,
    //     });

    //   }
    // }

    
    // // Any remaining items in existingItemsMap should be deleted because these items do not need to be updated in supabase. supabaseExistingItemsMap is only used to find items that need updates
    // supabaseExistingItemsMap.forEach((item) => itemsToDelete.push({ cartItem_id: item.id }));

    // console.log("itemsToInsertOrUpdate from supabaseExistingItemsMap: ", itemsToInsertOrUpdate);
    // console.log("itemsToDelete from supabaseExistingItemsMap: ", itemsToDelete);

    // //this is to reformat the title so that it matches with cart_items table in supabase
    // const updates = itemsToInsertOrUpdate.map(item => ({
    //   id: item?.cartItem_id,
    //   cart_id: item.cart_id, // Match existing row
    //   product_id: item.product_id,
    //   size_id: item.size_id,
    //   quantity: item.quantity,
    //   price: item.price
    // }));

    // console.log("Updates: ", updates);
    
    // for (const updateItem of updates) {
    //   if (updateItem.id){
    //       const { error } = await supabase
    //       .from("cart_items")
    //       // .upsert(updates, { onConflict: "cart_id, product_id, size_id" });
    //       .upsert(updates);

    //       if(error){console.error("Error upserting")};
    //       console.log("Upserting existing cartItem_id: ", updates);
    //     }
    //   else{
    //     const { error } = await supabase
    //     .from("cart_items")
    //     // .upsert(updates, { onConflict: "cart_id, product_id, size_id" });
    //     .insert(updateItem);

    //     console.log("Inserting new cartItem_id: ", updates);
    //     if(error){console.error("Error inserting")};
    //   }

    // }

  } catch (error) {
    console.error("Error saving cart:", error);
  }
};

