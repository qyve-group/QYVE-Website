'use client';

import { Dialog, Transition } from '@headlessui/react';
import Image from 'next/image';
import Link from 'next/link';
import React, { Fragment, useEffect, useState } from 'react';
import { AiOutlineDelete } from 'react-icons/ai';
import { FaBagShopping } from 'react-icons/fa6';
import { MdClose, MdStar } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';

import { saveCartAfterRemove } from '@/services/cartService';
import ButtonCircle3 from '@/shared/Button/ButtonCircle3';
import ButtonPrimary from '@/shared/Button/ButtonPrimary';
import ButtonSecondary from '@/shared/Button/ButtonSecondary';
import InputNumber from '@/shared/InputNumber/InputNumber';
import type { CartItem } from '@/store/cartSlice';
import { removeFromCart } from '@/store/cartSlice'; // Make sure this action exists in cartSlice
import type { RootState } from '@/store/store';
import { debounce } from '@/utils/debounce';

import LikeButton from './LikeButton';
// import { store } from '@/store/store';

const debouncedSaveCartAfterRemove = debounce(saveCartAfterRemove, 1000); // 1-second delay

const CartSideBar: React.FC = () => {
  const [isVisable, setIsVisable] = useState(false);
  const dispatch = useDispatch();

  const auth = useSelector((state: RootState) => state.auth);

  const initialCart = useSelector((state: RootState) => state.cart);
  console.log('CartSideBar.tsx----- Initial cart state: ', initialCart);

  // Open & Close Sidebar
  const handleOpenMenu = () => setIsVisable(true);
  const handleCloseMenu = () => setIsVisable(false);

  // Get cart items from Redux store
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  // Function to render a single cart item
  const renderProduct = (item: CartItem) => {
    const { id, name, price, product_size, quantity, image } = item;

    return (
      // <div key={id} className="flex py-5 last:pb-0">
      <div key={`${id}-${product_size}`} className="flex py-5 last:pb-0">
        {/* Product Image */}
        <div className="relative size-24 shrink-0 overflow-hidden rounded-xl">
          <Image
            fill
            src={image}
            alt={name}
            className="size-full object-contain object-center"
          />
          <Link
            onClick={handleCloseMenu}
            className="absolute inset-0"
            href={`/products/${id}`}
          />
        </div>

        {/* Product Details */}
        <div className="ml-4 flex flex-1 flex-col justify-between">
          <div>
            <div className="flex justify-between">
              <div>
                <h3 className="font-medium">
                  <Link onClick={handleCloseMenu} href={`/products/${id}`}>
                    {name}
                  </Link>
                </h3>
                <span className="text-sm text-neutral-500">
                  Size: {product_size}
                </span>
                <div className="flex items-center gap-1">
                  <MdStar className="text-yellow-400" />
                </div>
              </div>
              <span className="font-medium">RM{price}</span>
            </div>
          </div>

          {/* Actions: Like, Delete, Quantity */}
          <div className="flex w-full items-end justify-between text-sm">
            <div className="flex items-center gap-3">
              <LikeButton />
              <AiOutlineDelete
                className="cursor-pointer text-2xl"
                onClick={() => {
                  // console.log("eleting item");
                  console.log('Deleting item');
                  dispatch(removeFromCart({ id, product_size }));
                  // debouncedSaveCart(auth.user?.id ?? "", store.getState().cart.items);

                  setTimeout(() => {
                    debouncedSaveCartAfterRemove(auth.user?.id ?? '', item);
                  }, 300);
                  // setTimeout(() => {
                  //   debouncedSaveCartAfterRemove(auth.user?.id ?? "", store.getState().cart.items, item);
                  // }, 300);

                  // dispatch(updateQuantity({id: id, quantity: (quantity), product_size}));
                }}
              />
            </div>
            <InputNumber
              defaultValue={quantity}
              id={id}
              product_size={product_size}
            />
          </div>
        </div>
      </div>
    );
  };

  // Render Sidebar Content
  const renderContent = () => {
    return (
      <Transition appear show={isVisable} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-50 overflow-y-auto"
          onClose={handleCloseMenu}
        >
          <div className="z-max fixed inset-y-0 right-0 w-full max-w-md outline-none focus:outline-none">
            {/* Sidebar Animation */}
            <Transition.Child
              as={Fragment}
              enter="transition duration-100 transform"
              enterFrom="opacity-0 translate-x-full"
              enterTo="opacity-100 translate-x-0"
              leave="transition duration-150 transform"
              leaveFrom="opacity-100 translate-x-0"
              leaveTo="opacity-0 translate-x-full"
            >
              <div className="relative z-20 shadow-lg ring-1 ring-black/5">
                <div className="relative h-screen bg-white">
                  <div className="h-screen overflow-y-auto p-5">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-semibold">Shopping Cart</h3>
                      <ButtonCircle3 onClick={handleCloseMenu}>
                        <MdClose className="text-2xl" />
                      </ButtonCircle3>
                    </div>

                    {/* Cart Items List */}
                    <div className="divide-y divide-neutral-300">
                      {cartItems.length > 0 ? (
                        cartItems.map((item) => renderProduct(item))
                      ) : (
                        <p className="text-center text-neutral-500">
                          Your cart is empty.
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="absolute bottom-0 left-0 w-full bg-neutral-50 p-5">
                    <p className="flex justify-between">
                      <span>
                        <span className="font-medium">Subtotal</span>
                        <span className="block text-sm text-neutral-500">
                          Shipping and taxes calculated at checkout.
                        </span>
                      </span>
                      <span className="text-xl font-medium">
                        RM{' '}
                        {cartItems.reduce(
                          (total, item) => total + item.price * item.quantity,
                          0,
                        )}
                      </span>
                    </p>

                    {/* Checkout & View Cart Buttons */}
                    <div className="mt-5 flex items-center gap-5">
                      <ButtonPrimary
                        href="/checkout"
                        onClick={handleCloseMenu}
                        className="w-full flex-1"
                      >
                        Checkout
                      </ButtonPrimary>
                      <ButtonSecondary
                        href="/cart"
                        onClick={handleCloseMenu}
                        className="w-full flex-1 border-2 border-primary text-primary"
                      >
                        View cart
                      </ButtonSecondary>
                    </div>
                  </div>
                </div>
              </div>
            </Transition.Child>

            {/* Background Overlay */}
            <Transition.Child
              as={Fragment}
              enter="duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0 bg-neutral-900/60" />
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    );
  };

  return (
    <>
      {/* Cart Icon Button */}
      <button
        type="button"
        onClick={handleOpenMenu}
        className="mx-5 flex items-center gap-1 rounded-full bg-neutral-100 p-2 text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
      >
        <FaBagShopping className="text-2xl" />
        {/* <span className="hidden text-sm lg:block">{cartItems.length} items</span> */}
        {/* Prevent hydration mismatch */}
        {hydrated ? (
          <span className="hidden text-sm lg:block">
            {cartItems.length} items
          </span>
        ) : (
          <span className="hidden text-sm lg:block">Loading...</span>
        )}
      </button>

      {renderContent()}
    </>
  );
};

export default CartSideBar;

// 'use client';

// import { Dialog, Transition } from '@headlessui/react';
// import Image from 'next/image';
// import Link from 'next/link';
// import React, { Fragment, useState } from 'react';
// import { AiOutlineDelete } from 'react-icons/ai';
// import { FaBagShopping } from 'react-icons/fa6';
// import { MdClose, MdStar } from 'react-icons/md';

// import { RootState } from "@/store/store";
// import { useDispatch, useSelector } from "react-redux";

// import { shoes } from '@/data/content';
// import type { ProductType } from '@/data/types';
// import ButtonCircle3 from '@/shared/Button/ButtonCircle3';
// import ButtonPrimary from '@/shared/Button/ButtonPrimary';
// import ButtonSecondary from '@/shared/Button/ButtonSecondary';
// import InputNumber from '@/shared/InputNumber/InputNumber';

// import LikeButton from './LikeButton';

// export interface CartSideBarProps {}
// const CartSideBar: React.FC<CartSideBarProps> = () => {
//   const [isVisable, setIsVisable] = useState(false);

//   const handleOpenMenu = () => setIsVisable(true);
//   const handleCloseMenu = () => setIsVisable(false);
//   const cartItems = useSelector((state: RootState) => state.cart.items);

//   // const renderProduct = (item: ProductType) => {
//     const renderProduct = ({ id, name, price, product_size, quantity, image }) => {
//     // const { shoeName, coverImage, currentPrice, slug, rating, shoeCategory } =
//     // const { id, name, price, product_size, quantity, image } = item;

//     return (
//       <div key={id} className="flex py-5 last:pb-0">
//         <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl">
//           <Image
//             fill
//             src={image}
//             alt={name}
//             className="h-full w-full object-contain object-center"
//           />
//           <Link
//             onClick={handleCloseMenu}
//             className="absolute inset-0"
//             // href={`/products/${slug}`}
//           />
//         </div>

//         <div className="ml-4 flex flex-1 flex-col justify-between">
//           <div>
//             <div className="flex justify-between ">
//               <div>
//                 <h3 className="font-medium ">
//                   {/* <Link onClick={handleCloseMenu} href={`/products/${slug}`}>
//                     {id}
//                   </Link> */}
//                 </h3>
//                 {/* <span className="my-1 text-sm text-neutral-500">
//                   {shoeCategory}
//                 </span> */}
//                 <div className="flex items-center gap-1">
//                   <MdStar className="text-yellow-400" />
//                   {/* <span className="text-sm">{rating}</span> */}
//                 </div>
//               </div>
//               <span className=" font-medium">RM{price}</span>
//             </div>
//           </div>
//           <div className="flex w-full items-end justify-between text-sm">
//             <div className="flex items-center gap-3">
//               <LikeButton />
//               <AiOutlineDelete className="text-2xl" />
//             </div>
//             <div>
//               <InputNumber />
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   };

//   const renderContent = () => {
//     return (
//       <Transition appear show={isVisable} as={Fragment}>
//         <Dialog
//           as="div"
//           className="fixed inset-0 z-50 overflow-y-auto"
//           onClose={handleCloseMenu}
//         >
//           <div className="z-max fixed inset-y-0 right-0 w-full max-w-md outline-none focus:outline-none md:max-w-md">
//             <Transition.Child
//               as={Fragment}
//               enter="transition duration-100 transform"
//               enterFrom="opacity-0 translate-x-full"
//               enterTo="opacity-100 translate-x-0"
//               leave="transition duration-150 transform"
//               leaveFrom="opacity-100 translate-x-0"
//               leaveTo="opacity-0 translate-x-full"
//             >
//               <div className="relative z-20">
//                 <div className="overflow-hidden shadow-lg ring-1 ring-black/5">
//                   <div className="relative h-screen bg-white">
//                     <div className="hiddenScrollbar h-screen overflow-y-auto p-5">
//                       <div className="flex items-center justify-between">
//                         <h3 className="text-xl font-semibold">Shopping cart</h3>
//                         <ButtonCircle3 onClick={handleCloseMenu}>
//                           <MdClose className="text-2xl" />
//                         </ButtonCircle3>
//                       </div>
//                       <div className="divide-y divide-neutral-300">
//                         {cartItems(0, 2).map((item) => renderProduct(item))}
//                       </div>
//                     </div>
//                     <div className="absolute bottom-0 left-0 w-full bg-neutral-50 p-5">
//                       <p className="flex justify-between">
//                         <span>
//                           <span className="font-medium">Subtotal</span>
//                           <span className="block text-sm text-neutral-500">
//                             Shipping and taxes calculated at checkout.
//                           </span>
//                         </span>
//                         <span className="text-xl font-medium">$597</span>
//                       </p>
//                       <div className="mt-5 flex items-center gap-5">
//                         <ButtonPrimary
//                           href="/checkout"
//                           onClick={handleCloseMenu}
//                           className="w-full flex-1"
//                         >
//                           Checkout
//                         </ButtonPrimary>
//                         <ButtonSecondary
//                           onClick={handleCloseMenu}
//                           href="/cart"
//                           className="w-full flex-1 border-2 border-primary text-primary"
//                         >
//                           View cart
//                         </ButtonSecondary>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </Transition.Child>

//             <Transition.Child
//               as={Fragment}
//               enter=" duration-300"
//               enterFrom="opacity-0"
//               enterTo="opacity-100"
//               leave=" duration-200"
//               leaveFrom="opacity-100"
//               leaveTo="opacity-0"
//             >
//               <Dialog.Overlay className="fixed inset-0 bg-neutral-900/60" />
//             </Transition.Child>
//           </div>
//         </Dialog>
//       </Transition>
//     );
//   };

//   return (
//     <>
//       <button
//         type="button"
//         onClick={handleOpenMenu}
//         className="mx-5 flex items-center gap-1 rounded-full bg-neutral-100 p-2 text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
//       >
//         <FaBagShopping className="text-2xl" />
//         <span className="hidden text-sm lg:block">3 items</span>
//       </button>

//       {renderContent()}
//     </>
//   );
// };

// export default CartSideBar;
