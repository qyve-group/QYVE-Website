import type { UUID } from 'crypto';

import { supabase } from '@/libs/supabaseClient';
// import CartSync from "./cartProvider";
// import { debounce } from "@/utils/debounce";
import type { CartItem } from '@/store/cartSlice';
import { setCart } from '@/store/cartSlice';
import type { AppDispatch } from '@/store/store';
// import { store } from '@/store/store';

type CartItemToPush = {
  cartItem_id?: UUID | undefined;
  cart_id: UUID;
  product_id: number;
  quantity: number;
  product_size_id: number;
  price: number;
  // size_id: number;
};

type CartItemToDelete = {
  cartItem_id: UUID;
};

type SupabaseCartItem = {
  id: UUID;
  cart_id: UUID;
  product_id: number;
  size_id: number;
  quantity: number;
  price: number;
};
// example supabaseCartItems
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
//   id: number; // product_id
//   name: string;
//   price: number;
//   product_size: string | null;
//   quantity: number;
//   image: string;
// }
// example reduxCartItems
//   {
//     "id": "1", ------------------------> this is product_id
//     "image": "some url",
//     "name": "BlackJ",
//     "price": 60,
//     "quantity": 1,

// export interface CartItem {
//   id: number; // product_id
//   name: string;
//   price: number;
//   // image: string;
//   product_size: string | null;
//   quantity: number;
//   image: string;
// }

export const fetchCartFromSupabase = async (
  userId: string | null,
  dispatch: AppDispatch,
) => {
  if (!userId) return;

  // const currCart = store.getState().cart;

  try {
    console.log('Fetching cart from supabase...');
    // Fetch the cart ID for the user
    const { data: cart, error: cartError } = await supabase
      .from('carts')
      .select('id')
      .eq('user_id', userId)
      .maybeSingle();

    if (cartError) throw cartError;
    let cartId: UUID | undefined = cart?.id;

    // If no cart exists, create a new one
    if (!cartId) {
      const { data: newCart, error: newCartError } = await supabase
        .from('carts')
        .insert([{ user_id: userId }])
        .select('id')
        .single();

      if (newCartError) throw newCartError;
      cartId = newCart.id;
      // console.log*('New cart created for user id:', userId);
    }

    // console.log*('Cart state before setting from Supabase:', currCart);

    // Fetch cart items from supabase
    const { data: supabaseCartItems, error: supabaseCartItemsError } =
      await supabase
        .from('cart_items')
        .select('*, products_sizes(*, product_colors(*))')
        .eq('cart_id', cartId);

    if (supabaseCartItemsError) throw supabaseCartItemsError;

    console.log('Current cart items from Supabase:', supabaseCartItems);
    console.log(
      'Is supabaseCartItems an array?',
      Array.isArray(supabaseCartItems),
    );

    let supabaseCartItemsFiltered: CartItem[] = [];

    try {
      supabaseCartItemsFiltered = supabaseCartItems.map((supabaseCartItem) => ({
        id: supabaseCartItem.product_size_id,
        name:
          supabaseCartItem.products_sizes?.product_colors?.color ?? 'no name',
        price: supabaseCartItem.price,
        product_size: supabaseCartItem.products_sizes?.size ?? null,
        quantity: supabaseCartItem.quantity,
        image:
          supabaseCartItem.products_sizes?.product_colors?.image ??
          'qyve-white.png',
      }));
    } catch (error) {
      console.error('error with filtering supabasecartitems', error);
    }

    console.log('supabasecartitemsfiltered: ', supabaseCartItemsFiltered);

    try {
      dispatch(setCart(supabaseCartItemsFiltered));
    } catch (error) {
      console.error('error dispatching to cart from supabase: ', error);
    }

    // console.log(
    //   'Cart state after setting from Supabase:',
    //   store.getState().cart,
    // );
  } catch (error) {
    // console.error*('Error fetching cart:', error);
  }
};

export const saveCartToSupabase = async (
  userId: string,
  reduxCartItems: any[],
) => {
  console.log('trying to savecarttosupabase - cartService.tsx ');
  try {
    // ------------------------- fetching cartid and retrieving items from supabase to put into map   ------------------------------------------------------------
    // Fetch the cart ID
    const { data: cart, error: cartError } = await supabase
      .from('carts')
      .select('id')
      .eq('user_id', userId)
      .single();

    // console.log*("User id's cart: ", cart);

    if (cartError || !cart)
      throw new Error(`User id: ${userId} does not have an existing cart`);

    const cartId = cart.id;

    // Fetch existing supabase cart items
    // const { data: supabaseExistingItems, error: supabaseExistingItemsError } =
    //   await supabase.from('cart_items').select('*').eq('cart_id', cartId);

    // if (supabaseExistingItemsError) throw supabaseExistingItemsError;

    const { data: supabaseExistingItems, error: supabaseExistingItemsError } =
      await supabase
        .from('cart_items')
        .select('*, products_sizes(*, product_colors(*))')
        .eq('cart_id', cartId);

    if (supabaseExistingItemsError) throw supabaseExistingItemsError;

    console.log('Current cart items from Supabase:', supabaseExistingItems);
    console.log(
      'Is supabaseCartItems an array?',
      Array.isArray(supabaseExistingItems),
    );

    // let supabaseCartItemsFiltered: CartItem[] = [];

    // try {
    //   supabaseCartItemsFiltered = supabaseExistingItems.map((supabaseItem) => ({
    //     id: supabaseItem.product_size_id,
    //     name:
    //       supabaseItem.products_sizes?.product_colors?.color ?? 'no name',
    //     price: supabaseItem.price,
    //     product_size: supabaseItem.products_sizes?.size ?? null,
    //     quantity: supabaseItem.quantity,
    //     image:
    //       supabaseItem.products_sizes?.product_colors?.image ??
    //       'qyve-white.png',
    //   }));
    // } catch (error) {
    //   console.error('error with filtering supabaseexistingitems', error);
    // }

    console.log('Existing items from Supabase:', supabaseExistingItems);

    // Convert existing items to a Map for quick lookup
    // Supabase cart_items
    const supabaseExistingItemsMap = new Map<string, SupabaseCartItem>();

    supabaseExistingItems.forEach((supabaseExistingItem) => {
      // const key = `${supabaseExistingItem.product_id}-${supabaseExistingItem.product_size_id}`;
      const key = `${supabaseExistingItem.product_size_id}`;
      // const key = `${item.id}`;
      supabaseExistingItemsMap.set(key, supabaseExistingItem);
    });

    // console.log*('existingItemsMap: ', supabaseExistingItemsMap);

    // -------------------------------  getting size_id from supabase using reduxCartItems elements   -------------------------------------------------------------------
    // Prepare batch updates
    const itemsToInsertOrUpdate: CartItemToPush[] = [];
    const itemsToDelete: CartItemToDelete[] = [];

    // console.log*('reduxCartItems: ', reduxCartItems);

    // Loop through cart items to check if supabaseItems need to be updated
    // eslint-disable-next-line no-await-in-loop
    for (const reduxCartitem of reduxCartItems) {
      // /* eslint-disable no-await-in-loop */
      // const { data: reduxSizeInfo } = await supabase
      //   .from('products_sizes')
      //   .select('id')
      //   .eq('product_id', reduxCartitem.id) // item.id is referring to product_id
      //   .eq('size', reduxCartitem.product_size) // Match size name (e.g., "M")
      //   .single();

      // const sizeId = reduxSizeInfo?.id;

      // key for reduxCartItem
      // const key = `${reduxCartitem.id}-${sizeId}`;
      const key = `${reduxCartitem.id}`;

      // cross referencing using reduxCartItem key with existingItemsMap (this is the map containing supabase fetched data) to filter out existing items
      const crossRefExistingItem = supabaseExistingItemsMap.get(key); // item.id is product_id

      // exitingItem is true if product_id and sizeId is the same
      if (crossRefExistingItem) {
        // console.log(
        //   `reduxCartItem key: ${key} found for supabaseExistingItem: ${
        //     supabaseExistingItem
        //   }`,
        // );

        // Update only if quantity, price, or size_id has changed
        if (
          crossRefExistingItem.quantity !== reduxCartitem.quantity ||
          crossRefExistingItem.price !== reduxCartitem.price
        ) {
          // console.log*('Either quantity or price needs update');
          itemsToInsertOrUpdate.push({
            cartItem_id: crossRefExistingItem.id,
            cart_id: cartId,
            // product_id: reduxCartitem.id,
            product_id: crossRefExistingItem.product_id,
            quantity: reduxCartitem.quantity,
            product_size_id: reduxCartitem.id,
            price: reduxCartitem.price,
            // size_id: sizeId,
          });
        }
        // else {
        //   console.log(
        //     'No quantity or price update requrired for this item: ',
        //     key,
        //   );
        // }
        supabaseExistingItemsMap.delete(key);
      } else {
        console.log(
          `reduxCartItem key: ${key} not found for supabaseExistingItem:`,
        );

        const { data: productInfo } = await supabase
          .from('products_sizes')
          .select('product_id')
          .eq('id', reduxCartitem.id);

        // Insert new item
        itemsToInsertOrUpdate.push({
          cartItem_id: undefined,
          // cartItem_id: crossRefExistingItem?.id,
          cart_id: cartId,
          // product_id: reduxCartitem.id,
          product_id: productInfo?.[0]?.product_id,
          quantity: reduxCartitem.quantity,
          product_size_id: reduxCartitem.id,
          price: reduxCartitem.price,
          // size_id: sizeId,
        });

        console.log('new item to insert in suapbase: ', itemsToInsertOrUpdate);
      }
    }

    // Any remaining items in existingItemsMap should be deleted because these items do not need to be updated in supabase. supabaseExistingItemsMap is only used to find items that need updates
    supabaseExistingItemsMap.forEach((item) =>
      itemsToDelete.push({ cartItem_id: item.id }),
    );

    // this is to reformat the title so that it matches with cart_items table in supabase
    const updates = itemsToInsertOrUpdate.map((item) => ({
      id: item?.cartItem_id,
      cart_id: item.cart_id, // Match existing row
      product_id: item.product_id,
      // size_id: item.size_id,
      quantity: item.quantity,
      product_size_id: item.product_size_id,
      price: item.price,
    }));

    console.log('Updates - cartService.tsx: ', updates);

    for (const updateItem of updates) {
      if (updateItem.id) {
        //this id is cartitem id
        // eslint-disable-next-line no-await-in-loop
        const { error } = await supabase
          .from('cart_items')
          // .upsert(updates, { onConflict: "cart_id, product_id, size_id" });
          .upsert(updates);

        if (error) {
          // console.error*('Error upserting');
        }
        // console.log*('Upserting existing cartItem_id: ', updates);
      } else {
        // eslint-disable-next-line no-await-in-loop
        const { error } = await supabase
          .from('cart_items')
          // .upsert(updates, { onConflict: "cart_id, product_id, size_id" });
          .insert(updateItem);

        // console.log*('Inserting new cartItem_id: ', updates);
        if (error) {
          // console.error*('Error inserting');
        }
      }
    }

    console.log('Cart successfully updated in Supabase.');
  } catch (error) {
    // console.error*('Error saving cart:', error);
  }
};

export const saveCartAfterRemove = async (
  userId: string,
  removedCartItem: CartItem,
) => {
  try {
    // ------------------------- fetching cartid and retrieving items from supabase to put into map   ------------------------------------------------------------
    // Fetch the cart ID
    const { data: cart, error: cartError } = await supabase
      .from('carts')
      .select('id')
      .eq('user_id', userId)
      .single();

    // console.log*("User id's cart: ", cart);

    if (cartError || !cart)
      throw new Error(`User id: ${userId} does not have an existing cart`);

    const cartId = cart.id;

    // Fetch existing supabase cart items
    // const { data: supabaseExistingItems, error: supabaseExistingItemsError } =
    //   await supabase.from('cart_items').select('*').eq('cart_id', cartId);

    // if (supabaseExistingItemsError) throw supabaseExistingItemsError;

    // // console.log*('Existing items from Supabase:', supabaseExistingItems);

    const { data: supabaseExistingItems, error: supabaseExistingItemsError } =
      await supabase
        .from('cart_items')
        .select('*, products_sizes(*, product_colors(*))')
        .eq('cart_id', cartId);

    if (supabaseExistingItemsError) throw supabaseExistingItemsError;

    // console.log('Current cart items from Supabase:', supabaseExistingItems);
    // console.log(
    //   'Is supabaseCartItems an array?',
    //   Array.isArray(supabaseExistingItems),
    // );

    console.log(
      'Existing items from Supabase - savecartafterremove carservice.tsx:',
      supabaseExistingItems,
    );

    // Convert existing items to a Map for quick lookup
    // Supabase cart_items
    const supabaseExistingItemsMap = new Map<string, SupabaseCartItem>();

    supabaseExistingItems.forEach((supabaseExistingItem) => {
      const key = `${supabaseExistingItem.product_size_id}`;
      // const key = `${item.id}`;
      supabaseExistingItemsMap.set(key, supabaseExistingItem);
    });

    // console.log*('existingItemsMap: ', supabaseExistingItemsMap);

    // -------------------------------  getting size_id from supabase using reduxCartItems elements   -------------------------------------------------------------------
    // // Prepare batch updates

    // Fetch the size_id based on product_id and size name
    // const { data: reduxSizeInfo } = await supabase
    //   .from('products_sizes')
    //   .select('id')
    //   .eq('product_id', removedCartItem.id) // item.id is referring to product_id
    //   .eq('size', removedCartItem.product_size) // Match size name (e.g., "M")
    //   .single();

    // const sizeId = reduxSizeInfo?.id;

    const reduxKeyToDelete = `${removedCartItem.id}`;

    const supabaseItemToDelete = supabaseExistingItemsMap.get(reduxKeyToDelete);

    if (supabaseItemToDelete) {
      await supabase
        .from('cart_items')
        .delete()
        .eq('id', supabaseItemToDelete.id); // Delete by item ID

      // if (error) {
      //   console.error('Error deleting item from Supabase:', error);
      // }
      // else {
      //   console.log(`Deleted cart item with ID: ${supabaseItemToDelete.id}`);
      // }
    }
  } catch (error) {
    // console.error('Error saving cart:', error);
  }
};
