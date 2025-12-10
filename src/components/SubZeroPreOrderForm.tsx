/* eslint-disable jsx-a11y/label-has-associated-control */

'use client';

import { XMarkIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';

interface PreOrderFormProps {
  productName?: string;
  defaultPrice?: number;
  onClose?: () => void;
  onSuccess?: (preOrderId: string) => void;
}

const SubZeroPreOrderForm = ({
  productName = 'SubZero Futsal Shoes (Early Bird)',
  defaultPrice = 218,
  onClose,
}: PreOrderFormProps) => {
  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    size: '',
    color: 'White',
    quantity: 1,
    shippingAddress: {
      fname: '',
      lname: '',
      address_1: '',
      address_2: '',
      city: '',
      state: '',
      postal_code: '',
      country: 'Malaysia',
    },
    preOrderNotes: '',
    dataConsent: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const sizes = [
    'UK 5.5/ EU 39/ 24.5 cm',
    'UK 6/ EU 40/ 25 cm',
    'UK 6.5/ EU 40.5/ 25.5 cm',
    'UK 7/ EU 41/ 26 cm',
    'UK 7.5/ EU 42/ 26.5 cm',
    'UK 8/ EU 42.5/ 27 cm',
    'UK 8.5/ EU 43/ 27.5 cm',
    'UK 9/ EU 44/ 28 cm',
    'UK 9.5/ EU 44.5/ 28.5 cm',
    'UK 10/ EU 45/ 29 cm',
    'UK 10.5/ EU 45.5/ 29.5 cm',
  ];
  const colors = ['White'];

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value, type } = e.target;
    const { checked } = e.target as HTMLInputElement;

    if (name.startsWith('shipping_')) {
      const field = name.replace('shipping_', '');
      setFormData((prev) => ({
        ...prev,
        shippingAddress: {
          ...prev.shippingAddress,
          [field]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const totalPrice = defaultPrice * formData.quantity;

      const response = await fetch('/api/subzero/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerEmail: formData.customerEmail,
          customerName: formData.customerName,
          customerPhone: formData.customerPhone,
          size: formData.size,
          color: formData.color,
          quantity: formData.quantity,
          unitPrice: defaultPrice,
          totalPrice,
          shippingAddress: formData.shippingAddress,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create checkout session');
      }

      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error('No checkout URL received');
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to proceed to payment',
      );
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl">
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 absolute right-4 top-4"
        >
          <XMarkIcon className="size-6" />
        </button>
      )}

      <h2 className="mb-6 text-3xl font-bold">Pre-Order {productName}</h2>

      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-4 text-red-600">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Customer Information */}
        <div>
          <h3 className="mb-4 text-lg font-semibold">Your Information</h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="text-gray-700 mb-1 block text-sm font-medium">
                Full Name *
              </label>
              <input
                type="text"
                name="customerName"
                value={formData.customerName}
                onChange={handleInputChange}
                required
                className="border-gray-300 w-full rounded-lg border px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="text-gray-700 mb-1 block text-sm font-medium">
                Email *
              </label>
              <input
                type="email"
                name="customerEmail"
                value={formData.customerEmail}
                onChange={handleInputChange}
                required
                className="border-gray-300 w-full rounded-lg border px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="text-gray-700 mb-1 block text-sm font-medium">
                Phone Number
              </label>
              <input
                type="tel"
                name="customerPhone"
                value={formData.customerPhone}
                onChange={handleInputChange}
                placeholder="+60123456789"
                className="border-gray-300 w-full rounded-lg border px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Product Selection */}
        <div>
          <h3 className="mb-4 text-lg font-semibold">Product Details</h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div>
              <label className="text-gray-700 mb-1 block text-sm font-medium">
                Size *
              </label>
              <select
                name="size"
                value={formData.size}
                onChange={handleInputChange}
                required
                className="border-gray-300 w-full rounded-lg border px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Size</option>
                {sizes.map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-gray-700 mb-1 block text-sm font-medium">
                Color *
              </label>
              <select
                name="color"
                value={formData.color}
                onChange={handleInputChange}
                required
                className="border-gray-300 w-full rounded-lg border px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500"
              >
                {colors.map((color) => (
                  <option key={color} value={color}>
                    {color}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-gray-700 mb-1 block text-sm font-medium">
                Quantity *
              </label>
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleInputChange}
                min="1"
                max="10"
                required
                className="border-gray-300 w-full rounded-lg border px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Shipping Address */}
        <div>
          <h3 className="mb-4 text-lg font-semibold">Shipping Address</h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="text-gray-700 mb-1 block text-sm font-medium">
                First Name *
              </label>
              <input
                type="text"
                name="shipping_fname"
                value={formData.shippingAddress.fname}
                onChange={handleInputChange}
                required
                className="border-gray-300 w-full rounded-lg border px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="text-gray-700 mb-1 block text-sm font-medium">
                Last Name *
              </label>
              <input
                type="text"
                name="shipping_lname"
                value={formData.shippingAddress.lname}
                onChange={handleInputChange}
                required
                className="border-gray-300 w-full rounded-lg border px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="md:col-span-2">
              <label className="text-gray-700 mb-1 block text-sm font-medium">
                Address Line 1 *
              </label>
              <input
                type="text"
                name="shipping_address_1"
                value={formData.shippingAddress.address_1}
                onChange={handleInputChange}
                required
                className="border-gray-300 w-full rounded-lg border px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="md:col-span-2">
              <label className="text-gray-700 mb-1 block text-sm font-medium">
                Address Line 2
              </label>
              <input
                type="text"
                name="shipping_address_2"
                value={formData.shippingAddress.address_2}
                onChange={handleInputChange}
                className="border-gray-300 w-full rounded-lg border px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="text-gray-700 mb-1 block text-sm font-medium">
                City *
              </label>
              <input
                type="text"
                name="shipping_city"
                value={formData.shippingAddress.city}
                onChange={handleInputChange}
                required
                className="border-gray-300 w-full rounded-lg border px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="text-gray-700 mb-1 block text-sm font-medium">
                State *
              </label>
              <input
                type="text"
                name="shipping_state"
                value={formData.shippingAddress.state}
                onChange={handleInputChange}
                required
                className="border-gray-300 w-full rounded-lg border px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="text-gray-700 mb-1 block text-sm font-medium">
                Postal Code *
              </label>
              <input
                type="text"
                name="shipping_postal_code"
                value={formData.shippingAddress.postal_code}
                onChange={handleInputChange}
                required
                className="border-gray-300 w-full rounded-lg border px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Additional Notes */}
        {/* <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Special Requests / Notes
          </label>
          <textarea
            name="preOrderNotes"
            value={formData.preOrderNotes}
            onChange={handleInputChange}
            rows={3}
            placeholder="Any special requests or notes for your order..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div> */}

        {/* Price Summary */}
        <div className="bg-gray-50 rounded-lg p-6">
          <div className="mb-2 flex justify-between">
            <span className="text-gray-700">Price per item:</span>
            <span className="font-semibold">RM {defaultPrice.toFixed(2)}</span>
          </div>
          <div className="mb-2 flex justify-between">
            <span className="text-gray-700">Quantity:</span>
            <span className="font-semibold">{formData.quantity}</span>
          </div>
          <div className="mt-2 border-t pt-2">
            <div className="flex justify-between text-lg">
              <span className="font-bold">Total:</span>
              <span className="font-bold text-blue-600">
                {/* RM {(defaultPrice * formData.quantity).toFixed(2)} */}
                RM 218
              </span>
            </div>
            {/* <p className="text-sm text-gray-600 mt-2">
              30% deposit required: RM {(defaultPrice * formData.quantity * 0.3).toFixed(2)}
            </p> */}
          </div>
        </div>

        {/* Data Consent Checkbox */}
        <div className="border-gray-200 rounded-lg border bg-blue-50 p-4">
          <div className="flex items-start gap-3">
            <input
              type="checkbox"
              id="dataConsent"
              name="dataConsent"
              checked={formData.dataConsent}
              onChange={handleInputChange}
              required
              className="border-gray-300 mt-1 size-4 rounded text-blue-600 focus:ring-2 focus:ring-blue-500"
            />
            <label
              htmlFor="dataConsent"
              className="text-gray-700 cursor-pointer text-sm"
            >
              I agree to the collection and use of my personal data for order
              processing, customer support, and updates about products or
              services. *
            </label>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting || !formData.dataConsent}
          className="w-full rounded-lg bg-gradient-to-r from-[#0d3d5c] to-[#1a5a7a] py-4 text-lg font-semibold text-white transition-all hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting ? 'Redirecting to Payment...' : 'Proceed to Payment'}
        </button>

        <p className="text-gray-600 text-center text-sm">
          Expected delivery will be 5-7 days from week of 22/12. You will be
          added to a WhatsApp Group once paid for updates on the shipment and
          the behind the scenes of the shoe. Thank you!
        </p>
      </form>
    </div>
  );
};

export default SubZeroPreOrderForm;
