// import { RootState } from '@/store/store';

type CartItem = {
  id: number;
  name: string;
  price: number;
  product_size: string | null;
  quantity: number;
  image: string;
};

function isValidCartItem(item: any): item is CartItem {
  return (
    item &&
    typeof item.id === 'number' &&
    typeof item.name === 'string' &&
    typeof item.price === 'number' &&
    (typeof item.product_size === 'string' || item.product_size === null) &&
    typeof item.quantity === 'number' &&
    typeof item.image === 'string'
  );
}

export function mergeCarts(
  userCart: CartItem[] = [],
  guestCart: Partial<CartItem>[] = [],
): CartItem[] {
  const merged = userCart.map((item) => ({ ...item })); // Clone user cart

  console.log('guestCart cart.ts: ', guestCart);

  console.log('cloned userCart cart.ts: ', merged);

  guestCart.forEach((guestItem) => {
    if (!isValidCartItem(guestItem)) {
      console.warn('Invalid guest cart item skipped:', guestItem);
      return;
    }

    const existingItem = merged.find((item) => item.id === guestItem.id);

    if (existingItem) {
      console.log('item exists: ', existingItem);
      // if (existingItem.quantity === guestItem.quantity) {
      //   console.log('adding exisitng and guest quantity tgt ');
      //   existingItem.quantity += guestItem.quantity;
      // }

      // existingItem.quantity += guestItem.quantity;
    } else {
      merged.push(guestItem); // Safe to push, validated
    }
  });

  return merged;
}

// export function mergeCarts(
//   userCart: CartItem[] = [],
//   guestCart: CartItem[] = [],
// ): CartItem[] {
//   // const dispatch = useDispatch();

//   // const merged = [...userCart];
//     const merged = userCart.map(item => ({ ...item })); // clone items deeply

//   guestCart.forEach((guestItem) => {

//        if (
//       guestItem.id !== undefined &&
//       guestItem.name !== undefined &&
//       guestItem.price !== undefined &&
//       guestItem.product_size !== undefined &&
//       guestItem.image !== undefined &&
//       guestItem.quantity !== undefined
//     ) {
//       const index = merged.findIndex(item => item.id === guestItem.id);

//       if (index !== -1) {
//         merged[index] = {
//           ...merged[index],
//           quantity: merged[index].quantity + guestItem.quantity,
//         };
//       } else {
//         merged.push({
//           id: guestItem.id,
//           name: guestItem.name,
//           price: guestItem.price,
//           product_size: guestItem.product_size,
//           quantity: guestItem.quantity,
//           image: guestItem.image,
//         });
//       }
//     } else {
//       console.warn('Skipping invalid cart item:', guestItem);
//     }

//     // if (existing) {
//     //   // dispatch(
//     //   //   updateQuantity({
//     //   //     id: guestItem.id,
//     //   //     quantity: (existing.quantity += guestItem.quantity),
//     //   //     product_size: guestItem.product_size,
//     //   //   }),
//     //   // );
//     //   existing.quantity += guestItem.quantity;
//     // } else {
//     //   merged.push(guestItem);
//     // }
//   });

//   console.log('resulting mergedcart in cart.ts: ', merged);

//   return merged;
// }
