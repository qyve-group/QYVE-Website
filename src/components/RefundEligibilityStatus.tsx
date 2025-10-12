'use client';

import React from 'react';
import { Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { RefundEligibility } from '@/data/refund-types';

interface RefundEligibilityStatusProps {
  eligibility: RefundEligibility;
  className?: string;
}

const RefundEligibilityStatus: React.FC<RefundEligibilityStatusProps> = ({
  eligibility,
  className = ''
}) => {
  const getStatusIcon = () => {
    if (eligibility.can_request_refund) {
      return <CheckCircle className="w-4 h-4 text-green-600" />;
    }
    
    if (eligibility.days_since_delivery > 7) {
      return <XCircle className="w-4 h-4 text-red-600" />;
    }
    
    return <Clock className="w-4 h-4 text-yellow-600" />;
  };

  const getStatusText = () => {
    if (eligibility.can_request_refund) {
      const daysLeft = 7 - eligibility.days_since_delivery;
      return `Refund available (${daysLeft} days left)`;
    }
    
    if (eligibility.days_since_delivery > 7) {
      return 'Refund window expired';
    }
    
    return 'Refund window closing soon';
  };

  const getStatusColor = () => {
    if (eligibility.can_request_refund) {
      return 'text-green-600 bg-green-50 border-green-200';
    }
    
    if (eligibility.days_since_delivery > 7) {
      return 'text-red-600 bg-red-50 border-red-200';
    }
    
    return 'text-yellow-600 bg-yellow-50 border-yellow-200';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-MY', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className={`p-3 rounded-lg border ${getStatusColor()} ${className}`}>
      <div className="flex items-center gap-2 mb-2">
        {getStatusIcon()}
        <span className="text-sm font-medium">{getStatusText()}</span>
      </div>
      
      <div className="text-xs space-y-1">
        <div className="flex justify-between">
          <span>Delivered:</span>
          <span>{formatDate(eligibility.delivery_date)}</span>
        </div>
        
        <div className="flex justify-between">
          <span>Days since delivery:</span>
          <span>{eligibility.days_since_delivery} days</span>
        </div>
        
        <div className="flex justify-between">
          <span>Refund window expires:</span>
          <span>{formatDate(eligibility.refund_window_expires)}</span>
        </div>
        
        {eligibility.reason_ineligible && (
          <div className="mt-2 p-2 bg-white bg-opacity-50 rounded border-l-2 border-red-300">
            <div className="flex items-start gap-1">
              <AlertCircle className="w-3 h-3 text-red-600 mt-0.5 flex-shrink-0" />
              <span className="text-xs text-red-700">{eligibility.reason_ineligible}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RefundEligibilityStatus;
