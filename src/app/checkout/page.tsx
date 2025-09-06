/* eslint-disable @typescript-eslint/naming-convention */

'use client';

import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';

import { supabase } from '@/libs/supabaseClient';
import type { CartItem } from '@/store/cartSlice';
import type { RootState } from '@/store/store';
import StreamlinedCheckout from './StreamlinedCheckout';

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
  const router = useRouter();
  const userId = useSelector((state: RootState) => state.auth.user?.id);
  const isAuthenticated = !!userId;
  const [products, setProducts] = useState<CartDisplay[]>([]);
  const [contactInfo, setContactInfo] = useState<ContactInfoData | null>(null);
  const [shippingAddress, setShippingAddress] = useState<ShippingAddressData | null>(null);

  const cartItems = useSelector((state: RootState) => state.cart.items);
  const [shippingFee, setShippingFee] = useState(0);
  const [voucher, setVoucher] = useState('');
  const [voucherValidity, setVoucherValidity] = useState('');
  const [clicked, setClicked] = useState(false);
  const [discountPercentage, setDiscountPercentage] = useState(0);
  const [discountPrice, setDiscountPrice] = useState(0);
  const [discountValue, setDiscountValue] = useState(0);

  // Calculate subtotal dynamically
  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const [total, setTotal] = useState(subtotal + shippingFee);

  useEffect(() => {
    const newSubtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
    setTotal(newSubtotal + shippingFee);
  }, [cartItems, shippingFee]);

  console.log('initial total: ', total);

  useEffect(() => {
    if (clicked && voucherValidity === 'valid') {
      setTotal(subtotal + shippingFee - discountValue);
    } else {
      setTotal(subtotal + shippingFee);
    }
  }, [
    subtotal,
    shippingFee,
    discountValue,
    clicked,
    voucherValidity,
    discountPercentage,
    discountPrice,
  ]);

  const handleVoucher = async () => {
    setClicked(true);

    try {
      const { data, error } = await supabase
        .from('vouchers')
        .select('*')
        .eq('code', voucher)
        .single();

      if (error || !data) {
        setVoucherValidity('invalid');
        console.log('Invalid voucher');
        return;
      }

      if (data.used) {
        setVoucherValidity('used');
        console.log('Voucher already used');
        return;
      }

      setVoucherValidity('valid');
      setDiscountPercentage(data.discount_percentage || 0);
      setDiscountPrice(data.discount_price || 0);

      if (data.discount_type === 'percentage') {
        const discount = (subtotal * data.discount_percentage) / 100;
        setDiscountValue(discount);
      } else if (data.discount_type === 'price') {
        setDiscountValue(data.discount_price);
      }

      console.log('Valid voucher:', data);
    } catch (err) {
      console.error('Error checking voucher:', err);
      setVoucherValidity('invalid');
    }
  };

  const handleShipment = async () => {
    if (!isAuthenticated) {
      console.log('User not authenticated');
      return;
    }

    const cartId = localStorage.getItem('cartId');
    console.log('userId: ', userId);
    console.log('cartId: ', cartId);

    if (!cartId) {
      console.log('No cart ID found');
      return;
    }

    try {
      const response = await fetch('/api/shipment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cartId,
        }),
      });

      console.log('Response status:', response.status);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Checking rate: ', data);

      if (data.result && data.result.length > 0) {
        const rates = data.result;
        const cheapestRate = rates.reduce((prev: any, current: any) =>
          prev.rate < current.rate ? prev : current,
        );
        setShippingFee(cheapestRate.rate);
      } else {
        setShippingFee(8);
      }
    } catch (error) {
      console.error('Error fetching shipping rates:', error);
      setShippingFee(8);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      handleShipment();
    }
  }, [isAuthenticated]);

  const handleContactInfo = (data: ContactInfoData) => {
    setContactInfo(data);
  };

  const handleShippingInfo = (data: ShippingAddressData) => {
    setShippingAddress(data);
  };

  console.log('initial total: ', total);
  console.log('Products: ', products);

  // Redirect to cart if no items
  useEffect(() => {
    if (cartItems.length === 0) {
      router.push('/cart');
    }
  }, [cartItems, router]);

  return (
    <div className="nc-CheckoutPage">
      <main className="container py-16">
        <div className="mb-8">
          <h2 className="block text-2xl font-semibold sm:text-3xl lg:text-4xl">
            Checkout
          </h2>
        </div>
        
        <StreamlinedCheckout
          subtotal={subtotal}
          shippingFee={shippingFee}
          total={total}
          voucher={voucher}
          voucherValidity={voucherValidity}
          onVoucherChange={setVoucher}
          onVoucherApply={handleVoucher}
        />
      </main>
    </div>
  );
};

export default CheckoutPage;