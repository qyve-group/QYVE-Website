'use client';

import React, { useState } from 'react';
import RefundButton from '@/components/RefundButton';
import RefundEligibilityStatus from '@/components/RefundEligibilityStatus';
import { 
  checkRefundEligibility, 
  generateRefundWhatsAppLink,
  formatRefundAmount,
  REFUND_REASONS,
  type RefundReason 
} from '@/data/refund-types';

const TestRefundPage = () => {
  const [selectedOrder, setSelectedOrder] = useState('recent');

  // Test data for different scenarios
  const testOrders = {
    recent: {
      id: 'QYVE-2024-001',
      amount: 299.00,
      deliveryDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
      description: 'Recent delivery (2 days ago) - Should be eligible'
    },
    expiring: {
      id: 'QYVE-2024-002', 
      amount: 199.00,
      deliveryDate: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(), // 6 days ago
      description: 'Expiring soon (6 days ago) - Should be eligible but expiring'
    },
    expired: {
      id: 'QYVE-2024-003',
      amount: 399.00,
      deliveryDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days ago
      description: 'Expired (10 days ago) - Should not be eligible'
    }
  };

  const currentOrder = testOrders[selectedOrder as keyof typeof testOrders];
  const eligibility = checkRefundEligibility(currentOrder.deliveryDate);
  const whatsappLink = generateRefundWhatsAppLink(currentOrder.id);

  const handleRefundRequest = (orderId: string, reason: RefundReason) => {
    console.log('Refund requested for order:', orderId, 'Reason:', reason);
    alert(`Refund request submitted for ${orderId} with reason: ${reason}`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Refund Feature Test</h1>
      
      {/* Test Order Selection */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Test Scenarios</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Object.entries(testOrders).map(([key, order]) => (
            <button
              key={key}
              onClick={() => setSelectedOrder(key)}
              className={`p-4 rounded-lg border-2 text-left transition-colors ${
                selectedOrder === key 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <h3 className="font-semibold text-gray-900">{order.id}</h3>
              <p className="text-sm text-gray-600 mt-1">{order.description}</p>
              <p className="text-sm text-gray-500 mt-2">
                Amount: {formatRefundAmount(order.amount)}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Current Test Order */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Current Test Order: {currentOrder.id}</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Order Details */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Order Details</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Order Number:</span>
                <span className="font-medium">{currentOrder.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Amount:</span>
                <span className="font-medium">{formatRefundAmount(currentOrder.amount)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Delivery Date:</span>
                <span className="font-medium">
                  {new Date(currentOrder.deliveryDate).toLocaleDateString('en-MY')}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Days Since Delivery:</span>
                <span className="font-medium">{eligibility.days_since_delivery} days</span>
              </div>
            </div>
          </div>

          {/* Refund Eligibility Status */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Refund Eligibility</h3>
            <RefundEligibilityStatus
              eligibility={eligibility}
              className="mb-4"
            />
          </div>
        </div>

        {/* Refund Button */}
        <div className="mt-6 pt-6 border-t">
          <h3 className="font-semibold text-gray-900 mb-3">Refund Request</h3>
          <RefundButton
            orderNumber={currentOrder.id}
            orderId={currentOrder.id}
            amount={currentOrder.amount}
            currency="MYR"
            eligibility={eligibility}
            onRefundRequest={handleRefundRequest}
            className="w-full md:w-auto"
          />
        </div>
      </div>

      {/* WhatsApp Link Preview */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="font-semibold text-gray-900 mb-3">WhatsApp Link Preview</h3>
        <div className="space-y-2">
          <p className="text-sm text-gray-600">
            <strong>Generated Link:</strong>
          </p>
          <div className="bg-white p-3 rounded border text-xs font-mono break-all">
            {whatsappLink}
          </div>
          <p className="text-sm text-gray-600">
            <strong>Prefilled Message:</strong> "Hi QYVE, I'd like to request a refund for Order #{currentOrder.id}."
          </p>
          <button
            onClick={() => window.open(whatsappLink, '_blank')}
            className="mt-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Test WhatsApp Link
          </button>
        </div>
      </div>

      {/* Feature Summary */}
      <div className="mt-8 bg-blue-50 rounded-lg p-6">
        <h3 className="font-semibold text-blue-900 mb-3">Refund Feature Summary</h3>
        <div className="text-sm text-blue-800 space-y-2">
          <p>✅ <strong>Eligibility Control:</strong> 7-day refund window from delivery date</p>
          <p>✅ <strong>WhatsApp Integration:</strong> Prefilled message with order number</p>
          <p>✅ <strong>Reason Selection:</strong> Modal with predefined refund reasons</p>
          <p>✅ <strong>Status Display:</strong> Clear eligibility status with days remaining</p>
          <p>✅ <strong>Automatic Expiry:</strong> Button disappears after 7 days</p>
          <p>✅ <strong>Order Integration:</strong> Only shows for delivered orders</p>
        </div>
      </div>
    </div>
  );
};

export default TestRefundPage;
