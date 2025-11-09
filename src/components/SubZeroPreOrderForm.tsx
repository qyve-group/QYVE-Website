'use client';

import { useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface PreOrderFormProps {
  productName?: string;
  defaultPrice?: number;
  onClose?: () => void;
  onSuccess?: (preOrderId: string) => void;
}

const SubZeroPreOrderForm = ({
  productName = 'SubZero Futsal Shoes (Early Bird)',
  defaultPrice = 214.2,
  onClose,
  onSuccess,
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
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const sizes = ['38', '39', '40', '41', '42', '43', '44', '45'];
  const colors = ['White'];

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;

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
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const totalPrice = defaultPrice * formData.quantity;
      const productVariant = `Size: ${formData.size}, Color: ${formData.color}`;

      const response = await fetch('/api/pre-orders/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerEmail: formData.customerEmail,
          customerName: formData.customerName,
          customerPhone: formData.customerPhone,
          productName,
          productVariant,
          quantity: formData.quantity,
          unitPrice: defaultPrice,
          totalPrice,
          shippingAddress: formData.shippingAddress,
          preOrderNotes: formData.preOrderNotes,
          depositRequired: true,
          depositAmount: totalPrice * 0.3,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit pre-order');
      }

      setSuccess(true);

      if (onSuccess) {
        onSuccess(data.preOrderId);
      }

      setTimeout(() => {
        if (onClose) onClose();
      }, 3000);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to submit pre-order',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="text-center p-8">
        <div className="mb-4 text-6xl">🎉</div>
        <h3 className="text-2xl font-bold text-green-600 mb-2">
          Pre-Order Confirmed!
        </h3>
        {/* <p className="text-gray-600">
          Thank you! We&apos;ll send you an email with payment instructions.
        </p> */}
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <XMarkIcon className="h-6 w-6" />
        </button>
      )}

      <h2 className="text-3xl font-bold mb-6">Pre-Order {productName}</h2>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Customer Information */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Your Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name *
              </label>
              <input
                type="text"
                name="customerName"
                value={formData.customerName}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email *
              </label>
              <input
                type="email"
                name="customerEmail"
                value={formData.customerEmail}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                name="customerPhone"
                value={formData.customerPhone}
                onChange={handleInputChange}
                placeholder="+60123456789"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Product Selection */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Product Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Size *
              </label>
              <select
                name="size"
                value={formData.size}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select Size</option>
                {sizes.map((size) => (
                  <option key={size} value={size}>
                    {size} EU
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Color *
              </label>
              <select
                name="color"
                value={formData.color}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {colors.map((color) => (
                  <option key={color} value={color}>
                    {color}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
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
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Shipping Address */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Shipping Address</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                First Name *
              </label>
              <input
                type="text"
                name="shipping_fname"
                value={formData.shippingAddress.fname}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Last Name *
              </label>
              <input
                type="text"
                name="shipping_lname"
                value={formData.shippingAddress.lname}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address Line 1 *
              </label>
              <input
                type="text"
                name="shipping_address_1"
                value={formData.shippingAddress.address_1}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address Line 2
              </label>
              <input
                type="text"
                name="shipping_address_2"
                value={formData.shippingAddress.address_2}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                City *
              </label>
              <input
                type="text"
                name="shipping_city"
                value={formData.shippingAddress.city}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                State *
              </label>
              <input
                type="text"
                name="shipping_state"
                value={formData.shippingAddress.state}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Postal Code *
              </label>
              <input
                type="text"
                name="shipping_postal_code"
                value={formData.shippingAddress.postal_code}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
        <div className="bg-gray-50 p-6 rounded-lg">
          <div className="flex justify-between mb-2">
            <span className="text-gray-700">Price per item:</span>
            <span className="font-semibold">RM {defaultPrice.toFixed(2)}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="text-gray-700">Quantity:</span>
            <span className="font-semibold">{formData.quantity}</span>
          </div>
          <div className="border-t pt-2 mt-2">
            <div className="flex justify-between text-lg">
              <span className="font-bold">Total:</span>
              <span className="font-bold text-blue-600">
                RM {(defaultPrice * formData.quantity).toFixed(2)}
              </span>
            </div>
            {/* <p className="text-sm text-gray-600 mt-2">
              30% deposit required: RM {(defaultPrice * formData.quantity * 0.3).toFixed(2)}
            </p> */}
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-gradient-to-r from-[#0d3d5c] to-[#1a5a7a] text-white py-4 rounded-lg font-semibold text-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {isSubmitting ? 'Submitting...' : 'Submit Pre-Order'}
        </button>

        <p className="text-sm text-gray-600 text-center">
          Expected delivery: Within 5 days from 12/12 once full payment is made.
        </p>
      </form>
    </div>
  );
};

export default SubZeroPreOrderForm;
