'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect } from 'react';
import { AiOutlineDelete } from 'react-icons/ai';
import { MdStar } from 'react-icons/md';
import { TbBrandPaypal } from 'react-icons/tb';
import { useDispatch, useSelector } from 'react-redux';

// import { fetchCartFromSupabase, saveCartToSupabase } from "@/services/cartService";
import CheckOutButton from '@/components/CheckoutButton';
import LikeButton from '@/components/LikeButton';
// import ButtonPrimary from "@/shared/Button/ButtonPrimary";
import ButtonSecondary from '@/shared/Button/ButtonSecondary';
import InputNumber from '@/shared/InputNumber/InputNumber';
import { removeFromCart } from '@/store/cartSlice';
import type { RootState } from '@/store/store';

const CartPage = () => {
  // const auth = useSelector((state: RootState) => state.auth)
  const dispatch = useDispatch();

  // const userCart = fetchCartFromSupabase(auth.user?.id ?? null, dispatch);

  const cartItems = useSelector((state: RootState) => state.cart.items);

  useEffect(() => {
    // console.log*('Cart updated:', cartItems);
  }, [cartItems]);

  const handleRemove = (id: number, product_size: string | null) => {
    dispatch(removeFromCart({ id, product_size }));
  };

  // Calculate subtotal dynamically
  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );
  const estimatedTaxes = subtotal * 0.1; // Example 10% tax
  const total = subtotal + estimatedTaxes;

  // console.log*('CartItems in Cart: ', cartItems);

  return (
    <div className="nc-CartPage">
      <main className="container py-16 lg:pb-28 lg:pt-20 ">
        <div className="mb-14">
          <h2 className="block text-2xl font-medium sm:text-3xl lg:text-4xl">
            Your Cart
          </h2>
        </div>

        <hr className="my-10 border-neutral-300 xl:my-12" />

        {cartItems.length === 0 ? (
          <p className="text-center text-lg">Your cart is empty.</p>
        ) : (
          <div className="flex flex-col lg:flex-row">
            <div className="w-full divide-y divide-neutral-300 lg:w-3/5 xl:w-[55%]">
              {cartItems.map((item) => (
                <div
                  key={`${item.id}-${item.product_size}`}
                  className="flex py-5 last:pb-0"
                >
                  <div className="relative size-24 shrink-0 overflow-hidden rounded-xl md:size-40">
                    <Image
                      fill
                      src={item.image} // Ensure your cart items have an image property
                      alt={item.name}
                      className="size-full object-contain object-center"
                    />
                    <Link
                      className="absolute inset-0"
                      href={`/products/${item.id}`}
                    />
                  </div>

                  <div className="ml-4 flex flex-1 flex-col justify-between">
                    <div className="flex justify-between">
                      <div>
                        <h3 className="font-medium md:text-2xl">
                          <Link href={`/products/${item.id}`}>{item.name}</Link>
                        </h3>
                        <span className="my-1 text-sm text-neutral-500">
                          Category
                        </span>
                        <div className="flex items-center gap-1">
                          <MdStar className="text-yellow-400" />
                          <span className="text-sm">4.5</span>
                        </div>
                      </div>
                      <span className="font-medium md:text-xl">
                        ${item.price}
                      </span>
                    </div>
                  </div>

                  <div className="flex w-full items-end justify-between text-sm">
                    <div className="flex items-center gap-3">
                      <LikeButton />
                      <AiOutlineDelete
                        className="cursor-pointer text-2xl"
                        onClick={() => handleRemove(item.id, item.product_size)}
                      />
                    </div>
                    <div>
                      <InputNumber
                        defaultValue={item.quantity}
                        id={item.id}
                        product_size={item.product_size}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="my-10 shrink-0 border-t border-neutral-300 lg:mx-10 lg:my-0 lg:border-l lg:border-t-0 xl:mx-16 2xl:mx-20" />
            <div className="flex-1">
              <div className="sticky top-28">
                <h3 className="text-2xl font-semibold">Summary</h3>
                <div className="mt-7 divide-y divide-neutral-300 text-sm">
                  <div className="flex justify-between pb-4">
                    <span>Subtotal</span>
                    <span className="font-semibold">
                      ${subtotal.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between py-4">
                    <span>Estimated Delivery & Handling</span>
                    <span className="font-semibold">Free</span>
                  </div>
                  <div className="flex justify-between py-4">
                    <span>Estimated Taxes</span>
                    <span className="font-semibold">
                      ${estimatedTaxes.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between pt-4 text-base font-semibold">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>
                <CheckOutButton cartItems={cartItems} />
                {/* <ButtonPrimary href="/checkout" className="mt-8 w-full">
                  Checkout Now
                </ButtonPrimary> */}
                <ButtonSecondary
                  className="mt-3 inline-flex w-full items-center gap-1 border-2 border-primary text-primary"
                  href="/checkout"
                >
                  <TbBrandPaypal className="text-2xl" />
                  PayPal
                </ButtonSecondary>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default CartPage;
