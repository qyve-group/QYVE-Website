'use client';

import { useState } from 'react';
import { FaRegCircleUser } from 'react-icons/fa6';
import { MdPayment } from 'react-icons/md';
import { TbTruckDelivery } from 'react-icons/tb';
import { useSelector } from 'react-redux';

import ButtonPrimary from '@/shared/Button/ButtonPrimary';
import FormItem from '@/shared/FormItem';
import Input from '@/shared/Input/Input';
import type { RootState } from '@/store/store';

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

interface StreamlinedCheckoutProps {
  subtotal: number;
  shippingFee: number;
  total: number;
  voucher: string;
  voucherValidity: string;
  onVoucherChange: (voucher: string) => void;
  onVoucherApply: () => void;
}

const StreamlinedCheckout = ({
  subtotal,
  shippingFee,
  total,
  voucher,
  voucherValidity,
  onVoucherChange,
  onVoucherApply,
}: StreamlinedCheckoutProps) => {
  // const user = useSelector((state: RootState) => state.auth.user?.name);
  const userEmail = useSelector((state: RootState) => state.auth.user?.email);

  // Contact Info
  const [email, setEmail] = useState<string>(userEmail || '');
  const [phone, setPhone] = useState('');

  // Shipping Address
  const [fname, setFname] = useState('');
  const [lname, setLname] = useState('');
  const [shippingAddress1, setShippingAddress1] = useState('');
  const [shippingAddress2, setShippingAddress2] = useState('');
  const [no, setNo] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [postalCode, setPcode] = useState('');

  // Validation states
  const [errors, setErrors] = useState<Record<string, boolean>>({});
  const [hasSubmit, setHasSubmit] = useState(false);

  // Real-time validation
  const validateField = (field: string, value: string): boolean => {
    let isValid = true;

    switch (field) {
      case 'email':
        isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) && value.length > 0;
        break;
      case 'phone':
        isValid = value.length >= 10 && /^[\d+\-\s()]*$/.test(value);
        break;
      default:
        isValid = value.trim().length > 0;
        break;
    }

    setErrors((prev) => ({ ...prev, [field]: !isValid }));
    return isValid;
  };

  const validateAllFields = () => {
    const fieldsToValidate = {
      email,
      phone,
      fname,
      lname,
      shippingAddress1,
      shippingAddress2,
      no,
      city,
      state,
      postalCode,
    };

    let allValid = true;
    const newErrors: Record<string, boolean> = {};

    Object.entries(fieldsToValidate).forEach(([field, value]) => {
      const isValid = validateField(field, value);
      if (!isValid) {
        allValid = false;
        newErrors[field] = true;
      }
    });

    setErrors(newErrors);
    return allValid;
  };

  const handleCheckout = () => {
    setHasSubmit(true);
    const isValid = validateAllFields();

    if (!isValid) {
      // Scroll to first error
      const firstErrorField = Object.keys(errors).find((key) => errors[key]);
      if (firstErrorField) {
        const element = document.getElementById(firstErrorField);
        element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    // Proceed with checkout if all fields are valid
    const contactInfo: ContactInfoData = { phone, email };
    const shippingAddress: ShippingAddressData = {
      fname,
      lname,
      shippingAddress1,
      shippingAddress2,
      no,
      city,
      state,
      postalCode,
    };

    // Call checkout logic here
    console.log('Checkout data:', { contactInfo, shippingAddress });
  };

  return (
    <div className="mx-auto max-w-4xl space-y-8 p-6">
      {/* Contact Information */}
      <div className="border-gray-200 rounded-xl border bg-white p-6">
        <div className="mb-6 flex items-center gap-3">
          <FaRegCircleUser className="text-2xl text-primary" />
          <h2 className="text-gray-800 text-xl font-semibold">
            Contact Information
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <FormItem label="Email Address *">
            <Input
              id="email"
              type="email"
              value={email}
              rounded="rounded-lg"
              sizeClass="h-12 px-4 py-3"
              className={`border-2 transition-colors ${
                hasSubmit && errors.email
                  ? 'border-red-500 bg-red-50'
                  : 'border-gray-300 focus:border-primary'
              } placeholder:text-gray-400 bg-transparent`}
              placeholder="your.email@example.com"
              onChange={(e) => {
                setEmail(e.target.value);
                if (hasSubmit) validateField('email', e.target.value);
              }}
              onBlur={() => hasSubmit && validateField('email', email)}
            />
            {hasSubmit && errors.email && (
              <p className="mt-1 text-sm text-red-500">
                Please enter a valid email address
              </p>
            )}
          </FormItem>

          <FormItem label="Phone Number *">
            <Input
              id="phone"
              type="tel"
              value={phone}
              rounded="rounded-lg"
              sizeClass="h-12 px-4 py-3"
              className={`border-2 transition-colors ${
                hasSubmit && errors.phone
                  ? 'border-red-500 bg-red-50'
                  : 'border-gray-300 focus:border-primary'
              } placeholder:text-gray-400 bg-transparent`}
              placeholder="+60123456789"
              onChange={(e) => {
                setPhone(e.target.value);
                if (hasSubmit) validateField('phone', e.target.value);
              }}
              onBlur={() => hasSubmit && validateField('phone', phone)}
            />
            {hasSubmit && errors.phone && (
              <p className="mt-1 text-sm text-red-500">
                Please enter a valid phone number (minimum 10 digits)
              </p>
            )}
          </FormItem>
        </div>
      </div>

      {/* Shipping Address */}
      <div className="border-gray-200 rounded-xl border bg-white p-6">
        <div className="mb-6 flex items-center gap-3">
          <TbTruckDelivery className="text-2xl text-primary" />
          <h2 className="text-gray-800 text-xl font-semibold">
            Shipping Address
          </h2>
        </div>

        <div className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <FormItem label="First Name *">
              <Input
                id="fname"
                value={fname}
                rounded="rounded-lg"
                sizeClass="h-12 px-4 py-3"
                className={`border-2 transition-colors ${
                  hasSubmit && errors.fname
                    ? 'border-red-500 bg-red-50'
                    : 'border-gray-300 focus:border-primary'
                } placeholder:text-gray-400 bg-transparent`}
                placeholder="John"
                onChange={(e) => {
                  setFname(e.target.value);
                  if (hasSubmit) validateField('fname', e.target.value);
                }}
                onBlur={() => hasSubmit && validateField('fname', fname)}
              />
              {hasSubmit && errors.fname && (
                <p className="mt-1 text-sm text-red-500">
                  First name is required
                </p>
              )}
            </FormItem>

            <FormItem label="Last Name *">
              <Input
                id="lname"
                value={lname}
                rounded="rounded-lg"
                sizeClass="h-12 px-4 py-3"
                className={`border-2 transition-colors ${
                  hasSubmit && errors.lname
                    ? 'border-red-500 bg-red-50'
                    : 'border-gray-300 focus:border-primary'
                } placeholder:text-gray-400 bg-transparent`}
                placeholder="Doe"
                onChange={(e) => {
                  setLname(e.target.value);
                  if (hasSubmit) validateField('lname', e.target.value);
                }}
                onBlur={() => hasSubmit && validateField('lname', lname)}
              />
              {hasSubmit && errors.lname && (
                <p className="mt-1 text-sm text-red-500">
                  Last name is required
                </p>
              )}
            </FormItem>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <FormItem label="Unit/House No. *">
              <Input
                id="no"
                value={no}
                rounded="rounded-lg"
                sizeClass="h-12 px-4 py-3"
                className={`border-2 transition-colors ${
                  hasSubmit && errors.no
                    ? 'border-red-500 bg-red-50'
                    : 'border-gray-300 focus:border-primary'
                } placeholder:text-gray-400 bg-transparent`}
                placeholder="123A"
                onChange={(e) => {
                  setNo(e.target.value);
                  if (hasSubmit) validateField('no', e.target.value);
                }}
                onBlur={() => hasSubmit && validateField('no', no)}
              />
              {hasSubmit && errors.no && (
                <p className="mt-1 text-sm text-red-500">
                  Unit/House number is required
                </p>
              )}
            </FormItem>

            <div className="md:col-span-2">
              <FormItem label="Street Address 1 *">
                <Input
                  id="shippingAddress1"
                  value={shippingAddress1}
                  rounded="rounded-lg"
                  sizeClass="h-12 px-4 py-3"
                  className={`border-2 transition-colors ${
                    hasSubmit && errors.shippingAddress1
                      ? 'border-red-500 bg-red-50'
                      : 'border-gray-300 focus:border-primary'
                  } placeholder:text-gray-400 bg-transparent`}
                  placeholder="Jalan Example"
                  onChange={(e) => {
                    setShippingAddress1(e.target.value);
                    if (hasSubmit)
                      validateField('shippingAddress1', e.target.value);
                  }}
                  onBlur={() =>
                    hasSubmit &&
                    validateField('shippingAddress1', shippingAddress1)
                  }
                />
                {hasSubmit && errors.shippingAddress1 && (
                  <p className="mt-1 text-sm text-red-500">
                    Street address is required
                  </p>
                )}
              </FormItem>
            </div>
          </div>

          <FormItem label="Street Address 2 *">
            <Input
              id="shippingAddress2"
              value={shippingAddress2}
              rounded="rounded-lg"
              sizeClass="h-12 px-4 py-3"
              className={`border-2 transition-colors ${
                hasSubmit && errors.shippingAddress2
                  ? 'border-red-500 bg-red-50'
                  : 'border-gray-300 focus:border-primary'
              } placeholder:text-gray-400 bg-transparent`}
              placeholder="Apartment, suite, etc."
              onChange={(e) => {
                setShippingAddress2(e.target.value);
                if (hasSubmit)
                  validateField('shippingAddress2', e.target.value);
              }}
              onBlur={() =>
                hasSubmit && validateField('shippingAddress2', shippingAddress2)
              }
            />
            {hasSubmit && errors.shippingAddress2 && (
              <p className="mt-1 text-sm text-red-500">
                Street address 2 is required
              </p>
            )}
          </FormItem>

          <div className="grid gap-6 md:grid-cols-3">
            <FormItem label="City *">
              <Input
                id="city"
                value={city}
                rounded="rounded-lg"
                sizeClass="h-12 px-4 py-3"
                className={`border-2 transition-colors ${
                  hasSubmit && errors.city
                    ? 'border-red-500 bg-red-50'
                    : 'border-gray-300 focus:border-primary'
                } placeholder:text-gray-400 bg-transparent`}
                placeholder="Kuala Lumpur"
                onChange={(e) => {
                  setCity(e.target.value);
                  if (hasSubmit) validateField('city', e.target.value);
                }}
                onBlur={() => hasSubmit && validateField('city', city)}
              />
              {hasSubmit && errors.city && (
                <p className="mt-1 text-sm text-red-500">City is required</p>
              )}
            </FormItem>

            <FormItem label="State *">
              <Input
                id="state"
                value={state}
                rounded="rounded-lg"
                sizeClass="h-12 px-4 py-3"
                className={`border-2 transition-colors ${
                  hasSubmit && errors.state
                    ? 'border-red-500 bg-red-50'
                    : 'border-gray-300 focus:border-primary'
                } placeholder:text-gray-400 bg-transparent`}
                placeholder="Selangor"
                onChange={(e) => {
                  setState(e.target.value);
                  if (hasSubmit) validateField('state', e.target.value);
                }}
                onBlur={() => hasSubmit && validateField('state', state)}
              />
              {hasSubmit && errors.state && (
                <p className="mt-1 text-sm text-red-500">State is required</p>
              )}
            </FormItem>

            <FormItem label="Postal Code *">
              <Input
                id="postalCode"
                value={postalCode}
                rounded="rounded-lg"
                sizeClass="h-12 px-4 py-3"
                className={`border-2 transition-colors ${
                  hasSubmit && errors.postalCode
                    ? 'border-red-500 bg-red-50'
                    : 'border-gray-300 focus:border-primary'
                } placeholder:text-gray-400 bg-transparent`}
                placeholder="50000"
                onChange={(e) => {
                  setPcode(e.target.value);
                  if (hasSubmit) validateField('postalCode', e.target.value);
                }}
                onBlur={() =>
                  hasSubmit && validateField('postalCode', postalCode)
                }
              />
              {hasSubmit && errors.postalCode && (
                <p className="mt-1 text-sm text-red-500">
                  Postal code is required
                </p>
              )}
            </FormItem>
          </div>
        </div>
      </div>

      {/* Order Summary & Checkout */}
      <div className="border-gray-200 rounded-xl border bg-white p-6">
        <div className="mb-6 flex items-center gap-3">
          <MdPayment className="text-2xl text-primary" />
          <h2 className="text-gray-800 text-xl font-semibold">
            Payment & Summary
          </h2>
        </div>

        {/* Voucher */}
        <div className="bg-gray-50 mb-6 rounded-lg p-4">
          <div className="flex gap-3">
            <Input
              value={voucher}
              rounded="rounded-lg"
              sizeClass="h-10 px-3 py-2"
              className="border-gray-300 placeholder:text-gray-400 bg-white"
              placeholder="Enter voucher code"
              onChange={(e) => onVoucherChange(e.target.value)}
            />
            <ButtonPrimary sizeClass="px-4 py-2" onClick={onVoucherApply}>
              Apply
            </ButtonPrimary>
          </div>
          {voucherValidity && (
            <p
              className={`mt-2 text-sm ${
                voucherValidity.includes('Valid')
                  ? 'text-green-600'
                  : 'text-red-600'
              }`}
            >
              {voucherValidity}
            </p>
          )}
        </div>

        {/* Order Summary */}
        <div className="border-t pt-6">
          <div className="space-y-3">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>RM {subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping:</span>
              <span>RM {shippingFee.toFixed(2)}</span>
            </div>
            <div className="flex justify-between border-t pt-3 text-lg font-bold">
              <span>Total:</span>
              <span>RM {total.toFixed(2)}</span>
            </div>
          </div>

          {/* Checkout Button */}
          <div className="mt-6">
            <ButtonPrimary
              className="w-full py-4 text-lg font-semibold"
              onClick={handleCheckout}
            >
              Complete Order - RM {total.toFixed(2)}
            </ButtonPrimary>
            {hasSubmit && Object.keys(errors).some((key) => errors[key]) && (
              <p className="mt-3 text-center text-sm text-red-500">
                Please fix the highlighted errors above to continue
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StreamlinedCheckout;
