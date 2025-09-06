'use client';

import { useState } from 'react';
import { useSelector } from 'react-redux';
import { FaRegCircleUser } from 'react-icons/fa6';
import { TbTruckDelivery } from 'react-icons/tb';
import { MdPayment, MdExpandMore, MdExpandLess } from 'react-icons/md';
import { FiCheck, FiAlertCircle } from 'react-icons/fi';

import ButtonPrimary from '@/shared/Button/ButtonPrimary';
import ButtonSecondary from '@/shared/Button/ButtonSecondary';
import Input from '@/shared/Input/Input';
import FormItem from '@/shared/FormItem';
// import CheckoutButton from '@/components/CheckoutButton';
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

interface CollapsibleCheckoutProps {
  subtotal: number;
  shippingFee: number;
  total: number;
  voucher: string;
  voucherValidity: string;
  onVoucherChange: (voucher: string) => void;
  onVoucherApply: () => void;
  contactInfo: ContactInfoData | null;
  shippingAddress: ShippingAddressData | null;
  onContactInfoChange: (data: ContactInfoData) => void;
  onShippingAddressChange: (data: ShippingAddressData) => void;
  cartItems: any[];
}

const CollapsibleCheckout = ({
  subtotal,
  shippingFee,
  total,
  voucher,
  voucherValidity,
  onVoucherChange,
  onVoucherApply,
  contactInfo,
  shippingAddress,
  onContactInfoChange,
  onShippingAddressChange,
  cartItems,
}: CollapsibleCheckoutProps) => {
  const userEmail = useSelector((state: RootState) => state.auth.user?.email);

  // Form states
  const [email, setEmail] = useState<string>(userEmail || '');
  const [phone, setPhone] = useState('');
  const [fname, setFname] = useState('');
  const [lname, setLname] = useState('');
  const [shippingAddress1, setShippingAddress1] = useState('');
  const [shippingAddress2, setShippingAddress2] = useState('');
  const [no, setNo] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [postalCode, setPcode] = useState('');

  // UI states
  const [activeSection, setActiveSection] = useState<'contact' | 'shipping' | null>(null);
  const [errors, setErrors] = useState<Record<string, boolean>>({});
  const [hasSubmit, setHasSubmit] = useState(false);

  // Validation
  const validateField = (field: string, value: string): boolean => {
    let isValid = true;
    
    switch (field) {
      case 'email':
        isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) && value.length > 0;
        break;
      case 'phone':
        isValid = value.length >= 10 && /^[\d\+\-\s\(\)]*$/.test(value);
        break;
      default:
        isValid = value.trim().length > 0;
        break;
    }

    setErrors(prev => ({ ...prev, [field]: !isValid }));
    return isValid;
  };

  const validateContactInfo = () => {
    const contactErrors: Record<string, boolean> = {};
    
    if (!validateField('email', email)) contactErrors.email = true;
    if (!validateField('phone', phone)) contactErrors.phone = true;
    
    return Object.keys(contactErrors).length === 0;
  };

  const validateShippingAddress = () => {
    const shippingErrors: Record<string, boolean> = {};
    
    const fields = { fname, lname, shippingAddress1, shippingAddress2, no, city, state, postalCode };
    
    Object.entries(fields).forEach(([field, value]) => {
      if (!validateField(field, value)) {
        shippingErrors[field] = true;
      }
    });
    
    return Object.keys(shippingErrors).length === 0;
  };

  const handleSaveContact = () => {
    if (validateContactInfo()) {
      onContactInfoChange({ phone, email });
      setActiveSection(null);
    }
  };

  const handleSaveShipping = () => {
    if (validateShippingAddress()) {
      onShippingAddressChange({
        fname, lname, shippingAddress1, shippingAddress2, no, city, state, postalCode
      });
      setActiveSection(null);
    }
  };

  const handleCheckout = () => {
    setHasSubmit(true);
    
    const contactValid = contactInfo || validateContactInfo();
    const shippingValid = shippingAddress || validateShippingAddress();
    
    if (!contactValid) {
      setActiveSection('contact');
      return;
    }
    
    if (!shippingValid) {
      setActiveSection('shipping');
      return;
    }
    
    // Proceed with checkout
    console.log('Checkout ready!');
  };

  // Status indicators
  const getContactStatus = () => {
    if (contactInfo) return 'complete';
    if (Object.keys(errors).some(key => ['email', 'phone'].includes(key) && errors[key])) return 'error';
    return 'incomplete';
  };

  const getShippingStatus = () => {
    if (shippingAddress) return 'complete';
    if (Object.keys(errors).some(key => !['email', 'phone'].includes(key) && errors[key])) return 'error';
    return 'incomplete';
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Column - Forms */}
        <div className="lg:col-span-2 space-y-6">
          {/* Contact Information Section */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div 
              className={`p-6 cursor-pointer transition-colors ${
                activeSection === 'contact' ? 'bg-blue-50' : 'hover:bg-gray-50'
              }`}
              onClick={() => setActiveSection(activeSection === 'contact' ? null : 'contact')}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <FaRegCircleUser className="text-2xl text-primary" />
                  <div>
                    <h2 className="text-lg font-semibold text-gray-800">Contact Information</h2>
                    {contactInfo ? (
                      <p className="text-sm text-gray-600">
                        {contactInfo.email} • {contactInfo.phone}
                      </p>
                    ) : (
                      <p className="text-sm text-gray-500">Click to add contact details</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {getContactStatus() === 'complete' && <FiCheck className="text-green-600 text-xl" />}
                  {getContactStatus() === 'error' && <FiAlertCircle className="text-red-600 text-xl" />}
                  {activeSection === 'contact' ? <MdExpandLess className="text-xl" /> : <MdExpandMore className="text-xl" />}
                </div>
              </div>
            </div>

            {activeSection === 'contact' && (
              <div className="border-t bg-gray-50 p-6 space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <FormItem label="Email Address *">
                    <Input
                      type="email"
                      value={email}
                      rounded="rounded-lg"
                      sizeClass="h-12 px-4 py-3"
                      className={`border-2 transition-colors ${
                        hasSubmit && errors.email 
                          ? 'border-red-500 bg-red-50' 
                          : 'border-gray-300 focus:border-primary'
                      } bg-white placeholder:text-gray-400`}
                      placeholder="your.email@example.com"
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (hasSubmit) validateField('email', e.target.value);
                      }}
                    />
                    {hasSubmit && errors.email && (
                      <p className="text-red-500 text-sm mt-1">Please enter a valid email address</p>
                    )}
                  </FormItem>

                  <FormItem label="Phone Number *">
                    <Input
                      type="tel"
                      value={phone}
                      rounded="rounded-lg"
                      sizeClass="h-12 px-4 py-3"
                      className={`border-2 transition-colors ${
                        hasSubmit && errors.phone 
                          ? 'border-red-500 bg-red-50' 
                          : 'border-gray-300 focus:border-primary'
                      } bg-white placeholder:text-gray-400`}
                      placeholder="+60123456789"
                      onChange={(e) => {
                        setPhone(e.target.value);
                        if (hasSubmit) validateField('phone', e.target.value);
                      }}
                    />
                    {hasSubmit && errors.phone && (
                      <p className="text-red-500 text-sm mt-1">Please enter a valid phone number</p>
                    )}
                  </FormItem>
                </div>

                <div className="flex gap-3 pt-4">
                  <ButtonPrimary onClick={handleSaveContact}>
                    Save Contact Info
                  </ButtonPrimary>
                  <ButtonSecondary onClick={() => setActiveSection(null)}>
                    Cancel
                  </ButtonSecondary>
                </div>
              </div>
            )}
          </div>

          {/* Shipping Address Section */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div 
              className={`p-6 cursor-pointer transition-colors ${
                activeSection === 'shipping' ? 'bg-blue-50' : 'hover:bg-gray-50'
              }`}
              onClick={() => setActiveSection(activeSection === 'shipping' ? null : 'shipping')}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <TbTruckDelivery className="text-2xl text-primary" />
                  <div>
                    <h2 className="text-lg font-semibold text-gray-800">Shipping Address</h2>
                    {shippingAddress ? (
                      <p className="text-sm text-gray-600">
                        {shippingAddress.fname} {shippingAddress.lname}, {shippingAddress.city}
                      </p>
                    ) : (
                      <p className="text-sm text-gray-500">Click to add shipping address</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {getShippingStatus() === 'complete' && <FiCheck className="text-green-600 text-xl" />}
                  {getShippingStatus() === 'error' && <FiAlertCircle className="text-red-600 text-xl" />}
                  {activeSection === 'shipping' ? <MdExpandLess className="text-xl" /> : <MdExpandMore className="text-xl" />}
                </div>
              </div>
            </div>

            {activeSection === 'shipping' && (
              <div className="border-t bg-gray-50 p-6 space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <FormItem label="First Name *">
                    <Input
                      value={fname}
                      rounded="rounded-lg"
                      sizeClass="h-12 px-4 py-3"
                      className={`border-2 transition-colors ${
                        hasSubmit && errors.fname 
                          ? 'border-red-500 bg-red-50' 
                          : 'border-gray-300 focus:border-primary'
                      } bg-white placeholder:text-gray-400`}
                      placeholder="John"
                      onChange={(e) => {
                        setFname(e.target.value);
                        if (hasSubmit) validateField('fname', e.target.value);
                      }}
                    />
                  </FormItem>

                  <FormItem label="Last Name *">
                    <Input
                      value={lname}
                      rounded="rounded-lg"
                      sizeClass="h-12 px-4 py-3"
                      className={`border-2 transition-colors ${
                        hasSubmit && errors.lname 
                          ? 'border-red-500 bg-red-50' 
                          : 'border-gray-300 focus:border-primary'
                      } bg-white placeholder:text-gray-400`}
                      placeholder="Doe"
                      onChange={(e) => {
                        setLname(e.target.value);
                        if (hasSubmit) validateField('lname', e.target.value);
                      }}
                    />
                  </FormItem>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <FormItem label="Unit/House No. *">
                    <Input
                      value={no}
                      rounded="rounded-lg"
                      sizeClass="h-12 px-4 py-3"
                      className={`border-2 transition-colors ${
                        hasSubmit && errors.no 
                          ? 'border-red-500 bg-red-50' 
                          : 'border-gray-300 focus:border-primary'
                      } bg-white placeholder:text-gray-400`}
                      placeholder="123A"
                      onChange={(e) => {
                        setNo(e.target.value);
                        if (hasSubmit) validateField('no', e.target.value);
                      }}
                    />
                  </FormItem>

                  <div className="md:col-span-2">
                    <FormItem label="Street Address 1 *">
                      <Input
                        value={shippingAddress1}
                        rounded="rounded-lg"
                        sizeClass="h-12 px-4 py-3"
                        className={`border-2 transition-colors ${
                          hasSubmit && errors.shippingAddress1 
                            ? 'border-red-500 bg-red-50' 
                            : 'border-gray-300 focus:border-primary'
                        } bg-white placeholder:text-gray-400`}
                        placeholder="Jalan Example"
                        onChange={(e) => {
                          setShippingAddress1(e.target.value);
                          if (hasSubmit) validateField('shippingAddress1', e.target.value);
                        }}
                      />
                    </FormItem>
                  </div>
                </div>

                <FormItem label="Street Address 2 *">
                  <Input
                    value={shippingAddress2}
                    rounded="rounded-lg"
                    sizeClass="h-12 px-4 py-3"
                    className={`border-2 transition-colors ${
                      hasSubmit && errors.shippingAddress2 
                        ? 'border-red-500 bg-red-50' 
                        : 'border-gray-300 focus:border-primary'
                    } bg-white placeholder:text-gray-400`}
                    placeholder="Apartment, suite, etc."
                    onChange={(e) => {
                      setShippingAddress2(e.target.value);
                      if (hasSubmit) validateField('shippingAddress2', e.target.value);
                    }}
                  />
                </FormItem>

                <div className="grid md:grid-cols-3 gap-4">
                  <FormItem label="City *">
                    <Input
                      value={city}
                      rounded="rounded-lg"
                      sizeClass="h-12 px-4 py-3"
                      className={`border-2 transition-colors ${
                        hasSubmit && errors.city 
                          ? 'border-red-500 bg-red-50' 
                          : 'border-gray-300 focus:border-primary'
                      } bg-white placeholder:text-gray-400`}
                      placeholder="Kuala Lumpur"
                      onChange={(e) => {
                        setCity(e.target.value);
                        if (hasSubmit) validateField('city', e.target.value);
                      }}
                    />
                  </FormItem>

                  <FormItem label="State *">
                    <Input
                      value={state}
                      rounded="rounded-lg"
                      sizeClass="h-12 px-4 py-3"
                      className={`border-2 transition-colors ${
                        hasSubmit && errors.state 
                          ? 'border-red-500 bg-red-50' 
                          : 'border-gray-300 focus:border-primary'
                      } bg-white placeholder:text-gray-400`}
                      placeholder="Selangor"
                      onChange={(e) => {
                        setState(e.target.value);
                        if (hasSubmit) validateField('state', e.target.value);
                      }}
                    />
                  </FormItem>

                  <FormItem label="Postal Code *">
                    <Input
                      value={postalCode}
                      rounded="rounded-lg"
                      sizeClass="h-12 px-4 py-3"
                      className={`border-2 transition-colors ${
                        hasSubmit && errors.postalCode 
                          ? 'border-red-500 bg-red-50' 
                          : 'border-gray-300 focus:border-primary'
                      } bg-white placeholder:text-gray-400`}
                      placeholder="50000"
                      onChange={(e) => {
                        setPcode(e.target.value);
                        if (hasSubmit) validateField('postalCode', e.target.value);
                      }}
                    />
                  </FormItem>
                </div>

                <FormItem label="Country">
                  <Input
                    value="Malaysia"
                    rounded="rounded-lg"
                    sizeClass="h-12 px-4 py-3"
                    className="border-2 border-gray-300 bg-gray-100 text-gray-600 cursor-not-allowed"
                    disabled
                    readOnly
                  />
                  <p className="text-xs text-gray-500 mt-1">We currently only ship within Malaysia</p>
                </FormItem>

                <div className="flex gap-3 pt-4">
                  <ButtonPrimary onClick={handleSaveShipping}>
                    Save Shipping Address
                  </ButtonPrimary>
                  <ButtonSecondary onClick={() => setActiveSection(null)}>
                    Cancel
                  </ButtonSecondary>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Order Summary (Original Design) */}
        <div className="lg:col-span-1">
          <div className="flex justify-between">
            <h3 className="py-2 text-lg font-semibold">Order summary</h3>
            <ButtonSecondary
              sizeClass="py-2 px-4"
              className="border-2 border-primary text-primary"
              onClick={() => {
                window.location.href = '../cart';
              }}
            >
              Edit
            </ButtonSecondary>
          </div>

          <div className="mt-8 divide-y divide-neutral-300">
            {cartItems.map((item) => (
              <div key={item.id} className="flex justify-between py-4">
                <div className="flex items-center space-x-4">
                  <div className="relative h-20 w-20 overflow-hidden rounded-xl">
                    <img
                      src={item.image || '/qyve-black.png'}
                      alt={item.name}
                      className="h-full w-full object-cover object-center"
                    />
                  </div>
                  <div>
                    <h4 className="font-medium">{item.name}</h4>
                    <div className="text-sm text-neutral-500">
                      Size: {item.product_size} | Qty: {item.quantity}
                    </div>
                  </div>
                </div>
                <div className="flex items-center">
                  <span className="font-semibold">RM {(item.price * item.quantity).toFixed(2)}</span>
                </div>
              </div>
            ))}
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
                  onChange={(e) => onVoucherChange(e.target.value)}
                />
                <button
                  type="button"
                  className="ml-3 flex w-24 items-center justify-center rounded-2xl border border-neutral-300 bg-gray px-4 text-sm font-medium transition-colors hover:bg-neutral-100"
                  onClick={onVoucherApply}
                >
                  Apply
                </button>
              </div>
              {voucherValidity && (
                <div className="mt-1 text-sm">
                  <span className={voucherValidity.includes('Valid') ? 'text-green-600' : 'text-red-600'}>
                    {voucherValidity}
                  </span>
                </div>
              )}
            </div>

            <div className="mt-4 divide-y divide-neutral-300">
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
                <span className="font-semibold">-</span>
              </div>
              <div className="flex justify-between pt-4 text-base font-semibold">
                <span>Total</span>
                <span>RM {total.toFixed(2)}</span>
              </div>
            </div>
            
            <ButtonPrimary 
              className="mt-8 w-full"
              onClick={handleCheckout}
            >
              Confirm order
            </ButtonPrimary>
            
            {/* Error messaging */}
            {hasSubmit && (!contactInfo || !shippingAddress) && (
              <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm font-medium flex items-center gap-2">
                  <FiAlertCircle />
                  Please complete all required sections above
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollapsibleCheckout;