'use client';

import React, { useState } from 'react';
import { MessageCircle, Clock, CheckCircle, XCircle } from 'lucide-react';
import { 
  RefundEligibility, 
  generateRefundWhatsAppLink, 
  formatRefundAmount,
  REFUND_REASONS,
  type RefundReason 
} from '@/data/refund-types';

interface RefundButtonProps {
  orderNumber: string;
  orderId: string;
  amount: number;
  currency: string;
  eligibility: RefundEligibility;
  onRefundRequest?: (orderId: string, reason: RefundReason) => void;
  className?: string;
}

const RefundButton: React.FC<RefundButtonProps> = ({
  orderNumber,
  orderId,
  amount,
  currency,
  eligibility,
  onRefundRequest,
  className = ''
}) => {
  const [showReasonModal, setShowReasonModal] = useState(false);
  const [selectedReason, setSelectedReason] = useState<RefundReason | ''>('');
  const [isLoading, setIsLoading] = useState(false);

  const handleRefundClick = () => {
    if (!eligibility.can_request_refund) {
      return;
    }
    setShowReasonModal(true);
  };

  const handleReasonSubmit = async () => {
    if (!selectedReason) return;
    
    setIsLoading(true);
    try {
      // Generate WhatsApp link with prefilled message
      const whatsappLink = generateRefundWhatsAppLink(orderNumber);
      
      // Open WhatsApp in new tab
      window.open(whatsappLink, '_blank');
      
      // Call callback if provided
      if (onRefundRequest) {
        onRefundRequest(orderId, selectedReason as RefundReason);
      }
      
      // Close modal
      setShowReasonModal(false);
      setSelectedReason('');
    } catch (error) {
      console.error('Error processing refund request:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getButtonContent = () => {
    if (!eligibility.is_eligible) {
      return (
        <div className="flex items-center gap-2 text-gray-500">
          <XCircle className="w-4 h-4" />
          <span>Refund Window Expired</span>
        </div>
      );
    }

    if (eligibility.days_since_delivery > 7) {
      return (
        <div className="flex items-center gap-2 text-gray-500">
          <Clock className="w-4 h-4" />
          <span>Refund Window Closed</span>
        </div>
      );
    }

    return (
      <div className="flex items-center gap-2">
        <MessageCircle className="w-4 h-4" />
        <span>Request Refund</span>
      </div>
    );
  };

  const getButtonStyle = () => {
    if (!eligibility.can_request_refund) {
      return 'bg-gray-100 text-gray-500 cursor-not-allowed';
    }
    return 'bg-red-600 text-white hover:bg-red-700 cursor-pointer';
  };

  return (
    <>
      <button
        onClick={handleRefundClick}
        disabled={!eligibility.can_request_refund}
        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center justify-center ${getButtonStyle()} ${className}`}
      >
        {getButtonContent()}
      </button>

      {/* Refund Reason Modal */}
      {showReasonModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Request Refund for Order #{orderNumber}
            </h3>
            
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">
                Refund Amount: <span className="font-semibold">{formatRefundAmount(amount, currency)}</span>
              </p>
              <p className="text-sm text-gray-600">
                Please select a reason for your refund request:
              </p>
            </div>

            <div className="space-y-2 mb-6">
              {REFUND_REASONS.map((reason) => (
                <label key={reason} className="flex items-center">
                  <input
                    type="radio"
                    name="refundReason"
                    value={reason}
                    checked={selectedReason === reason}
                    onChange={(e) => setSelectedReason(e.target.value as RefundReason)}
                    className="mr-3 text-red-600 focus:ring-red-500"
                  />
                  <span className="text-sm text-gray-700">{reason}</span>
                </label>
              ))}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowReasonModal(false);
                  setSelectedReason('');
                }}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleReasonSubmit}
                disabled={!selectedReason || isLoading}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Opening WhatsApp...
                  </>
                ) : (
                  <>
                    <MessageCircle className="w-4 h-4" />
                    Open WhatsApp
                  </>
                )}
              </button>
            </div>

            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-xs text-blue-800">
                <strong>Note:</strong> Clicking "Open WhatsApp" will open WhatsApp with a prefilled message. 
                You can modify the message before sending it to our support team.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default RefundButton;
