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

        {/* Right Column - Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl border border-gray-200 p-6 sticky top-6">
            <div className="flex items-center gap-3 mb-6">
              <MdPayment className="text-2xl text-primary" />
              <h2 className="text-xl font-semibold text-gray-800">Order Summary</h2>
            </div>

            {/* Voucher */}
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <div className="flex gap-3">
                <Input
                  value={voucher}
                  rounded="rounded-lg"
                  sizeClass="h-10 px-3 py-2"
                  className="border-gray-300 bg-white placeholder:text-gray-400"
                  placeholder="Enter voucher code"
                  onChange={(e) => onVoucherChange(e.target.value)}
                />
                <ButtonPrimary
                  sizeClass="px-4 py-2"
                  onClick={onVoucherApply}
                >
                  Apply
                </ButtonPrimary>
              </div>
              {voucherValidity && (
                <p className={`text-sm mt-2 ${
                  voucherValidity.includes('Valid') ? 'text-green-600' : 'text-red-600'
                }`}>
                  {voucherValidity}
                </p>
              )}
            </div>

            {/* Order Summary */}
            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>RM {subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping:</span>
                <span>RM {shippingFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg border-t pt-3">
                <span>Total:</span>
                <span>RM {total.toFixed(2)}</span>
              </div>
            </div>

            {/* Checkout Button */}
            <div>
              <ButtonPrimary
                className="w-full py-4 text-lg font-semibold"
                onClick={handleCheckout}
              >
                Complete Order - RM {total.toFixed(2)}
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
    </div>
  );
};

export default CollapsibleCheckout;