/* eslint-disable @typescript-eslint/naming-convention */

'use client';

import Image from 'next/image';
// import { Router } from 'lucide-react';
import { useRouter } from 'next/navigation';
// import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import CheckoutButton from '@/components/CheckoutButton';
import { supabase } from '@/libs/supabaseClient';
import ButtonSecondary from '@/shared/Button/ButtonSecondary';
// import { AiOutlineDelete } from 'react-icons/ai';
// import { MdStar } from 'react-icons/md';
// import LikeButton from '@/components/LikeButton';
// import { shoes } from '@/data/content';
// import type { ProductType } from '@/data/types';
// import ButtonPrimary from '@/shared/Button/ButtonPrimary';
import Input from '@/shared/Input/Input';
import type { CartItem } from '@/store/cartSlice';
import type { RootState } from '@/store/store';

// import InputNumber from '@/shared/InputNumber/InputNumber';
import ContactInfo from './ContactInfo';
// import PaymentMethod from './PaymentMethod';
import ShippingAddress from './ShippingAddress';

// import { product } from 'ramda';
// import { CartItem } from '@/store/cartSlice';

interface CartDisplay {
  id: number;
  name: string;
  price: number;
  product_size: string;
  quantity: number;
  slug: string;
  image: string;
}

type ContactInfoData = {
  phone: string;
  email: string;
};

type ShippingAddressData = {
  fname: string;
  lname: string;
  shippingAddress1: string;
  shippingAddress2: string;
  no: string;
  city: string;
  state: string;
  postalCode: string;
};

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

  const router = useRouter();

  const userId = useSelector((state: RootState) => state.auth.user?.id);
  const [products, setProducts] = useState<CartDisplay[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [, setTotalPrice] = useState<number>(0);
  const [contactInfo, setContactInfo] = useState<ContactInfoData | null>(null);
  const [shippingAddress, setShippingAddress] =
    useState<ShippingAddressData | null>(null);

  const cartItems = useSelector((state: RootState) => state.cart.items);
  const [shippingFee, setShippingFee] = useState(0);
  const [voucher, setVoucher] = useState('');
  const [voucherValidity, setVoucherValidity] = useState('');
  const [clicked, setClicked] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [, setVoucherValue] = useState(0);
  // const [discountType, setDiscountType] = useState('');
  // const [discountValue, setDiscountValue] = useState(0);
  const [discountPercentage, setDiscountPercentage] = useState(0);
  const [discountPrice, setDiscountPrice] = useState(0);

  const [discountValue, setDiscountValue] = useState(0);

  // // Calculate subtotal dynamically
  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );

  const [total, setTotal] = useState(subtotal + shippingFee);

  useEffect(() => {
    const newSubtotal = cartItems.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0,
    );
    setTotal(newSubtotal + shippingFee);
  }, [cartItems, shippingFee]);

  console.log('initial total: ', total);
  // // const estimatedTaxes = subtotal * 0.1; // Example 10% tax
  // // const total = subtotal + estimatedTaxes;
  // const [total, setTotal] = useState(subtotal);
  // setTotal(
  //   subtotal +
  //     shippingFee +
  //     subtotal * (discountPercentage / 100) +
  //     discountPrice,
  // );

  // useEffect(() => {
  //   setTotal(
  //     subtotal +
  //       shippingFee -
  //       subtotal * (discountPercentage / 100) -
  //       discountPrice,
  //   );
  //   setDiscountValue(subtotal * (discountPercentage / 100) + discountPrice);
  // }, [subtotal, shippingFee, discountPercentage, discountPrice]);

  const handleVoucher = async () => {
    setVoucherValidity(''); // reset previous validity
    setVoucherValue(0);
    setDiscountPercentage(0);
    setDiscountPrice(0);
    setDiscountValue(0);
    // setDiscountType('');
    setClicked(false);
    console.log(`userid: ${userId} || voucher: ${voucher}`);
    const res = await fetch('/api/check-voucher', {
      method: 'POST',
      body: JSON.stringify({
        userId,
        code: voucher,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) {
      console.error('Error calling check-voucher', res.status);
    } else {
      const result = await res.json();

      console.log('result: ', result.status);

      if (result.status === 'used') {
        setVoucherValidity(result.status);
      } else if (result.status === 'valid') {
        setVoucherValidity(result.status);
        setVoucherValue(result.value);
        // setDiscountType(result.discountType);
        console.log('result value: ', result.value);
        console.log('discount_type: ', result.discount_type);

        if (result.discount_type === 'percentage') {
          const discPercentage = result.value / 100;
          setDiscountPercentage(result.value / 100);

          setTotal(
            subtotal + shippingFee - subtotal * discPercentage - discountPrice,
          );
          setDiscountValue(subtotal * discPercentage - discountPrice);
          console.log('discount percentage ', discPercentage);
          console.log(
            'total: ',
            subtotal + shippingFee - subtotal * discPercentage - discountPrice,
          );
          console.log(
            'discount value: ',
            subtotal * discPercentage - discountPrice,
          );
        } else if (result.discountType === 'price') {
          setDiscountPrice(result.value);
          const discPrice = result.value;

          setTotal(
            subtotal + shippingFee - subtotal * discountPercentage - discPrice,
          );
          setDiscountValue(subtotal * discountPercentage - discPrice);
        }
      } else if (result.error) {
        console.error('Error: ', result.error);
      }
    }
    setClicked(true);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/shipment/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'checkRates',
            bulk: [
              {
                pick_code: '47400',
                pick_state: 'Selangor',
                pick_country: 'MY',
                send_code: `${shippingAddress?.postalCode}`,
                send_state: `${shippingAddress?.state}`,
                // send_code: `53201`,
                // send_state: `Johor`,
                send_country: 'MY',
                weight: '1',
              },
            ],
          }),
        });

        console.log('Response status:', response.status);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        console.log('Checking rate: ', data);
      } catch (error) {
        if (error instanceof Error) {
          console.error('Failed to fetch shipping rates:', error.message);
        } else {
          console.error('Unknown error:', error);
        }
      }
    };

    fetchData();
  }, [shippingAddress]);

  useEffect(() => {
    // console.log*('Cart updated:', cartItems);
  }, [cartItems]);

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

        // eslint-disable-next-line no-await-in-loop
        const { data: productInfoData } = await supabase
          .from('products_sizes')
          .select('size')
          .eq('id', sizeId)
          .single();

        const productSize = productInfoData?.size;
        // console.log('productSize: ', productSize);

        // eslint-disable-next-line no-await-in-loop
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
      const totalFp = fetchedProducts.reduce(
        (acc, item) => acc + item.price,
        0,
      );

      setProducts(fetchedProducts);
      setTotalPrice(totalFp);
    };

    fetchCartId();
  }, []);

  useEffect(() => {
    if (
      shippingAddress?.state === 'Sabah' ||
      shippingAddress?.state === 'Sarawak'
    ) {
      setShippingFee(15);
    } else {
      setShippingFee(8);
    }
  }, [shippingAddress?.state]);

  const handleContactInfo = (data: ContactInfoData) => {
    setContactInfo(data);
    // console.log('Received from contact info component: ', data);
  };

  const handleShippingInfo = (shippingData: ShippingAddressData) => {
    setShippingAddress(shippingData);
    // console.log('Received from shipping component: ', shippingData);
  };

  const renderProduct = (item: CartItem) => {
    console.log('Products: ', products);
    const { id, name, price, product_size, quantity, image } = item;

    return (
      <div
        key={`${userId}_${id}_${product_size}`}
        className="flex py-5 last:pb-0"
      >
        <div className="relative size-24 shrink-0 overflow-hidden rounded-xl md:size-40">
          <Image
            fill
            src={image}
            sizes="(max-width: 768px) 160vw, 96px"
            alt={name}
            className="object-contain object-center"
            priority
          />
          {/* <Link className="absolute inset-0" href={`/products/${slug}`} /> */}
        </div>

        <div className="ml-4 flex flex-1 flex-col justify-between">
          <div>
            <div className="flex justify-between ">
              <div>
                {/* <h3 className="font-medium md:text-2xl ">
                  <Link href={`/products/${slug}`}>{name}</Link>
                </h3> */}
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
          {/* <div className="flex w-full items-end justify-between text-sm">
            <div className="flex items-center gap-3">
              <LikeButton />
              <AiOutlineDelete className="text-2xl" />
            </div>
            <div>
              <InputNumber
                defaultValue={item.quantity}
                id={item.id}
                product_size={item.product_size}
              />
            </div>
          </div> */}
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
            onDataChange={handleContactInfo}
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
            onShippingChange={handleShippingInfo}
          />
        </div>

        {/* <div id="PaymentMethod" className="scroll-mt-24">
          <PaymentMethod
            isActive={tabActive === 'PaymentMethod'}
            onOpenActive={() => {
              setTabActive('PaymentMethod');
              handleScrollToEl('PaymentMethod');
            }}
            onCloseActive={() => setTabActive('PaymentMethod')}
          />
        </div> */}
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

          <div className="w-full lg:w-[36%]">
            <div className="flex justify-between">
              <h3 className="py-2 text-lg font-semibold">Order summary</h3>
              <ButtonSecondary
                sizeClass="py-2 px-4"
                className="border-2 border-primary text-primary"
                onClick={() => {
                  router.push('../cart');
                }}
              >
                Edit
              </ButtonSecondary>
            </div>

            {/* <div className="mt-8 divide-y divide-neutral-300">
              {products.map((prod) => renderProduct(prod))}
            </div> */}
            <div className="mt-8 divide-y divide-neutral-300">
              {cartItems.map((item) => renderProduct(item))}
            </div>

            <div className="mt-10 border-t border-neutral-300 pt-6 text-sm">
              <div>
                <div className="text-sm">Discount code</div>
                <div className="mt-1.5 flex">
                  <Input
                    rounded="rounded-lg"
                    sizeClass="h-12 px-4 py-3"
                    className="flex-1 border-neutral-300 bg-transparent placeholder:text-neutral-500 focus:border-primary"
                    value={voucher}
                    onChange={(e) => setVoucher(e.target.value)}
                  />
                  <button
                    type="button"
                    className="ml-3 flex w-24 items-center justify-center rounded-2xl border border-neutral-300 bg-gray px-4 text-sm font-medium transition-colors hover:bg-neutral-100"
                    onClick={handleVoucher}
                  >
                    Apply
                  </button>
                </div>
                {clicked && (
                  <div>
                    {(() => {
                      if (voucherValidity === 'used') {
                        return (
                          <div className="text-red-300">
                            Voucher already used
                          </div>
                        );
                      }

                      if (voucherValidity === 'valid') {
                        return (
                          <div className="text-green-300">Voucher applied</div>
                        );
                      }

                      return (
                        <div className="text-red-300">Invalid voucher</div>
                      );
                    })()}
                  </div>
                )}
                {/* {clicked ? (
                  voucherValidity === 'used' ? (
                    <div className="text-red-300">Voucher already used</div>
                  ) : voucherValidity === 'valid' ? (
                    <div className="text-green-300">Voucher applied</div>
                  ) : (
                    <div className="text-red-300">Invalid voucher</div>
                  )
                ) : (
                  <></>
                )} */}
              </div>

              <div className="mt-4 flex justify-between pb-4">
                <span>Subtotal</span>
                <span className="font-semibold">RM {subtotal.toFixed(2)}</span>
              </div>
              <div className="mt-4 flex justify-between pb-4">
                <span>Estimated Delivery & Handling</span>
                <span className="font-semibold">RM {shippingFee}</span>
              </div>
              <div className="flex justify-between py-4">
                <span>Discount</span>
                {clicked && voucherValidity === 'valid' ? (
                  <span className="font-semibold">- RM{discountValue}</span>
                ) : (
                  <span className="font-semibold">-</span>
                )}
              </div>
              <div className="flex justify-between pt-4 text-base font-semibold">
                <span>Total</span>
                <span>RM {total.toFixed(2)}</span>
              </div>
            </div>
            <CheckoutButton
              cartItems={cartItems}
              // orderAddress={shippingAddress}
              orderAddress={{
                fname: shippingAddress?.fname || '',
                lname: shippingAddress?.lname || '',
                shipping_address_1: shippingAddress?.shippingAddress1 || '',
                shipping_address_2: shippingAddress?.shippingAddress2 || '',
                no: shippingAddress?.no || '',
                city: shippingAddress?.city || '',
                postal_code: shippingAddress?.postalCode || '',
                state: shippingAddress?.state || '',
              }}
              orderContact={{
                phone: contactInfo?.phone || '',
                email: contactInfo?.email || '',
              }}
              discountCode={voucher}
              shippingPrice={shippingFee}
            />
            {/* <ButtonPrimary className="mt-8 w-full">Confirm order</ButtonPrimary> */}
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
