'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { AiOutlineDelete } from 'react-icons/ai';
import { MdStar } from 'react-icons/md';

import LikeButton from '@/components/LikeButton';
import { shoes } from '@/data/content';
import type { ProductType } from '@/data/types';
import ButtonPrimary from '@/shared/Button/ButtonPrimary';
import Input from '@/shared/Input/Input';
import InputNumber from '@/shared/InputNumber/InputNumber';

import ContactInfo from './ContactInfo';
import PaymentMethod from './PaymentMethod';
import ShippingAddress from './ShippingAddress';
import { RootState } from '@/store/store';
import { useSelector } from 'react-redux';
import { supabase } from '@/libs/supabaseClient';
import { product } from 'ramda';
import { CartItem } from '@/store/cartSlice';

interface CartDisplay {
  id: number;
  name: string;
  price: number;
  product_size: string;
  quantity: number;
  slug: string;
  image: string;
}

const CheckoutPage = () => {
  const [tabActive, setTabActive] = useState<
    'ContactInfo' | 'ShippingAddress' | 'PaymentMethod'
  >('ShippingAddress');

  const handleScrollToEl = (id: string) => {
    const element = document.getElementById(id);
    setTimeout(() => {
      element?.scrollIntoView({ behavior: 'smooth' });
    }, 80);
  };

  const userId = useSelector((state: RootState) => state.auth.user?.id);
  const [products, setProducts] = useState<CartDisplay[]>([]);
  const [totalPrice, setTotalPrice] = useState<number>(0);

  useEffect(() => {
    const fetchCartId = async () => {
      const { data: cartIdData } = await supabase
        .from('carts')
        .select('id')
        .eq('user_id', userId)
        .single();

      const cartId = cartIdData?.id;

      console.log('userId: ', userId);
      console.log('cartId: ', cartId);

      const { data: cartItemsData } = await supabase
        .from('cart_items')
        .select('product_id, size_id, quantity, price')
        .eq('cart_id', cartId);

      const fetchedProducts: CartDisplay[] = [];

      for (const product of cartItemsData || []) {
        const productId = product.product_id;
        const sizeId = product.size_id;
        const productQty = product.quantity;

        const { data: productInfoData } = await supabase
          .from('products_sizes')
          .select('size')
          .eq('id', sizeId)
          .single();

        const productSize = productInfoData?.size;
        console.log('productSize: ', productSize);

        const { data: productData } = await supabase
          .from('products')
          .select('name, slug, image_cover')
          .eq('id', productId)
          .single();

        fetchedProducts.push({
          id: productId,
          name: productData?.name,
          price: product.price,
          product_size: productSize,
          quantity: productQty,
          slug: productData?.slug,
          image: productData?.image_cover,
        });
      }
      const total = fetchedProducts.reduce((acc, item) => acc + item.price, 0);

      setProducts(fetchedProducts);
      setTotalPrice(total);
    };

    fetchCartId();
  }, []);

  const renderProduct = (item: CartDisplay) => {
    console.log('Products: ', products);
    const { id, name, price, product_size, quantity, slug, image } = item;

    return (
      <div
        key={`${userId}_${id}_${product_size}`}
        className="flex py-5 last:pb-0"
      >
        <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl md:h-40 md:w-40">
          <Image
            fill
            src={image}
            sizes="(max-width: 768px) 160vw, 96px"
            alt={name}
            className="object-contain object-center"
            priority
          />
          <Link className="absolute inset-0" href={`/products/${slug}`} />
        </div>

        <div className="ml-4 flex flex-1 flex-col justify-between">
          <div>
            <div className="flex justify-between ">
              <div>
                <h3 className="font-medium md:text-2xl ">
                  <Link href={`/products/${slug}`}>{name}</Link>
                </h3>
                <span className="my-1 text-sm text-neutral-500">
                  {/* {shoeCategory} */}
                  {product_size} X {quantity}
                </span>
                {/* <div className="flex items-center gap-1">
                  <MdStar className="text-yellow-400" />
                  <span className="text-sm">{rating}</span>
                </div> */}
              </div>
              <span className="font-medium md:text-xl">RM {price}</span>
            </div>
          </div>
          <div className="flex w-full items-end justify-between text-sm">
            <div className="flex items-center gap-3">
              <LikeButton />
              <AiOutlineDelete className="text-2xl" />
            </div>
            <div>
              <InputNumber id={id} product_size={product_size} />
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderLeft = () => {
    return (
      <div className="space-y-8">
        <div id="ContactInfo" className="scroll-mt-24">
          <ContactInfo
            isActive={tabActive === 'ContactInfo'}
            onOpenActive={() => {
              setTabActive('ContactInfo');
              handleScrollToEl('ContactInfo');
            }}
            onCloseActive={() => {
              setTabActive('ShippingAddress');
              handleScrollToEl('ShippingAddress');
            }}
          />
        </div>

        <div id="ShippingAddress" className="scroll-mt-24">
          <ShippingAddress
            isActive={tabActive === 'ShippingAddress'}
            onOpenActive={() => {
              setTabActive('ShippingAddress');
              handleScrollToEl('ShippingAddress');
            }}
            onCloseActive={() => {
              setTabActive('PaymentMethod');
              handleScrollToEl('PaymentMethod');
            }}
          />
        </div>

        <div id="PaymentMethod" className="scroll-mt-24">
          <PaymentMethod
            isActive={tabActive === 'PaymentMethod'}
            onOpenActive={() => {
              setTabActive('PaymentMethod');
              handleScrollToEl('PaymentMethod');
            }}
            onCloseActive={() => setTabActive('PaymentMethod')}
          />
        </div>
      </div>
    );
  };

  return (
    <div className="nc-CheckoutPage">
      <main className="container py-16 lg:pb-28 lg:pt-20 ">
        <div className="mb-16">
          <h2 className="block text-2xl font-semibold sm:text-3xl lg:text-4xl ">
            Checkout
          </h2>
        </div>

        <div className="flex flex-col lg:flex-row">
          <div className="flex-1">{renderLeft()}</div>

          <div className="my-10 shrink-0 border-t border-neutral-300 lg:mx-10 lg:my-0 lg:border-l lg:border-t-0 xl:lg:mx-14 2xl:mx-16 " />

          <div className="w-full lg:w-[36%] ">
            <h3 className="text-lg font-semibold">Order summary</h3>
            <div className="mt-8 divide-y divide-neutral-300">
              {products.map((prod) => renderProduct(prod))}
            </div>

            <div className="mt-10 border-t border-neutral-300 pt-6 text-sm">
              <div>
                <div className="text-sm">Discount code</div>
                <div className="mt-1.5 flex">
                  <Input
                    rounded="rounded-lg"
                    sizeClass="h-12 px-4 py-3"
                    className="flex-1 border-neutral-300 bg-transparent placeholder:text-neutral-500 focus:border-primary"
                  />
                  <button
                    type="button"
                    className="ml-3 flex w-24 items-center justify-center rounded-2xl border border-neutral-300 bg-gray px-4 text-sm font-medium transition-colors hover:bg-neutral-100"
                  >
                    Apply
                  </button>
                </div>
              </div>

              <div className="mt-4 flex justify-between pb-4">
                <span>Subtotal</span>
                <span className="font-semibold">RM {totalPrice}</span>
              </div>
              <div className="flex justify-between py-4">
                <span>Estimated Delivery & Handling</span>
                <span className="font-semibold">Free</span>
              </div>
              <div className="flex justify-between py-4">
                <span>Estimated taxes</span>
                <span className="font-semibold">$24.90</span>
              </div>
              <div className="flex justify-between pt-4 text-base font-semibold">
                <span>Total</span>
                <span>RM {totalPrice}</span>
              </div>
            </div>
            <ButtonPrimary className="mt-8 w-full">Confirm order</ButtonPrimary>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CheckoutPage;

// // /src/app/checkout/page.tsx
// export default function CheckoutPage() {
//   return <div>Checkout Page</div>;
// }
