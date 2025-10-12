'use client';

import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Eye, 
  CheckCircle, 
  XCircle, 
  Clock, 
  DollarSign,
  MessageCircle,
  Calendar,
  User
} from 'lucide-react';
import { 
  MOCK_REFUND_REQUESTS, 
  getRefundStatusColor, 
  getRefundStatusText,
  formatRefundAmount,
  type RefundRequest 
} from '@/data/refund-types';

const RefundsPage = () => {
  const [refunds] = useState<RefundRequest[]>(MOCK_REFUND_REQUESTS);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedRefund, setSelectedRefund] = useState<RefundRequest | null>(null);

  // Filter refunds based on search and status
  const filteredRefunds = refunds.filter(refund => {
    const matchesSearch = 
      refund.order_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      refund.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      refund.customer_email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || refund.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Calculate stats
  const stats = {
    total: refunds.length,
    pending: refunds.filter(r => r.status === 'pending').length,
    approved: refunds.filter(r => r.status === 'approved').length,
    rejected: refunds.filter(r => r.status === 'rejected').length,
    processed: refunds.filter(r => r.status === 'processed').length,
    totalAmount: refunds.reduce((sum, r) => sum + r.amount, 0)
  };

  const handleStatusUpdate = (refundId: string, newStatus: string) => {
    console.log('Updating refund status:', refundId, 'to', newStatus);
    // Here you would typically update the refund status in your backend
  };

  const handleProcessRefund = (refundId: string) => {
    console.log('Processing refund:', refundId);
    // Here you would typically process the refund through Stripe
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Refund Management</h1>
        <p className="text-gray-600 mt-2">Manage customer refund requests and process refunds</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-8">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <MessageCircle className="w-5 h-5 text-blue-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Total Requests</p>
              <p className="text-xl font-bold text-gray-900">{stats.total}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Clock className="w-5 h-5 text-yellow-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-xl font-bold text-gray-900">{stats.pending}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Approved</p>
              <p className="text-xl font-bold text-gray-900">{stats.approved}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <XCircle className="w-5 h-5 text-red-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Rejected</p>
              <p className="text-xl font-bold text-gray-900">{stats.rejected}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <CheckCircle className="w-5 h-5 text-blue-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Processed</p>
              <p className="text-xl font-bold text-gray-900">{stats.processed}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <DollarSign className="w-5 h-5 text-green-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Total Amount</p>
              <p className="text-xl font-bold text-gray-900">{formatRefundAmount(stats.totalAmount)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow mb-6">
        <div className="p-4 border-b border-gray-200">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search by order number, customer name, or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="md:w-48">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
                <option value="processed">Processed</option>
              </select>
            </div>
          </div>
        </div>

        {/* Refunds Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Requested
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredRefunds.map((refund) => (
                <tr key={refund.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {refund.order_number}
                      </div>
                      <div className="text-sm text-gray-500">
                        Order ID: {refund.order_id}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {refund.customer_name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {refund.customer_email}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {formatRefundAmount(refund.amount, refund.currency)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRefundStatusColor(refund.status)}`}>
                      {getRefundStatusText(refund.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(refund.requested_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setSelectedRefund(refund)}
                        className="text-blue-600 hover:text-blue-900 flex items-center gap-1"
                      >
                        <Eye className="w-4 h-4" />
                        View
                      </button>
                      
                      {refund.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleStatusUpdate(refund.id, 'approved')}
                            className="text-green-600 hover:text-green-900 flex items-center gap-1"
                          >
                            <CheckCircle className="w-4 h-4" />
                            Approve
                          </button>
                          <button
                            onClick={() => handleStatusUpdate(refund.id, 'rejected')}
                            className="text-red-600 hover:text-red-900 flex items-center gap-1"
                          >
                            <XCircle className="w-4 h-4" />
                            Reject
                          </button>
                        </>
                      )}
                      
                      {refund.status === 'approved' && (
                        <button
                          onClick={() => handleProcessRefund(refund.id)}
                          className="text-blue-600 hover:text-blue-900 flex items-center gap-1"
                        >
                          <DollarSign className="w-4 h-4" />
                          Process
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Refund Detail Modal */}
      {selectedRefund && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  Refund Request Details
                </h3>
                <button
                  onClick={() => setSelectedRefund(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Order Information */}
                <div>
                  <h4 className="text-md font-semibold text-gray-900 mb-3">Order Information</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Order Number:</span>
                      <span className="ml-2 font-medium">{selectedRefund.order_number}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Order ID:</span>
                      <span className="ml-2 font-medium">{selectedRefund.order_id}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Amount:</span>
                      <span className="ml-2 font-medium">{formatRefundAmount(selectedRefund.amount, selectedRefund.currency)}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Status:</span>
                      <span className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRefundStatusColor(selectedRefund.status)}`}>
                        {getRefundStatusText(selectedRefund.status)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Customer Information */}
                <div>
                  <h4 className="text-md font-semibold text-gray-900 mb-3">Customer Information</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Name:</span>
                      <span className="ml-2 font-medium">{selectedRefund.customer_name}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Email:</span>
                      <span className="ml-2 font-medium">{selectedRefund.customer_email}</span>
                    </div>
                  </div>
                </div>

                {/* Refund Details */}
                <div>
                  <h4 className="text-md font-semibold text-gray-900 mb-3">Refund Details</h4>
                  <div className="space-y-3 text-sm">
                    <div>
                      <span className="text-gray-600">Reason:</span>
                      <span className="ml-2 font-medium">{selectedRefund.reason || 'Not specified'}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Requested:</span>
                      <span className="ml-2 font-medium">{new Date(selectedRefund.requested_at).toLocaleString()}</span>
                    </div>
                    {selectedRefund.processed_at && (
                      <div>
                        <span className="text-gray-600">Processed:</span>
                        <span className="ml-2 font-medium">{new Date(selectedRefund.processed_at).toLocaleString()}</span>
                      </div>
                    )}
                    {selectedRefund.notes && (
                      <div>
                        <span className="text-gray-600">Notes:</span>
                        <span className="ml-2 font-medium">{selectedRefund.notes}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* WhatsApp Message */}
                <div>
                  <h4 className="text-md font-semibold text-gray-900 mb-3">WhatsApp Message</h4>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm text-gray-700 mb-2">{selectedRefund.whatsapp_message}</p>
                    <a
                      href={selectedRefund.whatsapp_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-green-600 hover:text-green-700 text-sm"
                    >
                      <MessageCircle className="w-4 h-4" />
                      Open WhatsApp Chat
                    </a>
                  </div>
                </div>

                {/* Eligibility Information */}
                <div>
                  <h4 className="text-md font-semibold text-gray-900 mb-3">Eligibility Information</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Eligible:</span>
                      <span className={`ml-2 font-medium ${selectedRefund.eligibility.is_eligible ? 'text-green-600' : 'text-red-600'}`}>
                        {selectedRefund.eligibility.is_eligible ? 'Yes' : 'No'}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">Days since delivery:</span>
                      <span className="ml-2 font-medium">{selectedRefund.eligibility.days_since_delivery}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Delivery date:</span>
                      <span className="ml-2 font-medium">{new Date(selectedRefund.eligibility.delivery_date).toLocaleDateString()}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Window expires:</span>
                      <span className="ml-2 font-medium">{new Date(selectedRefund.eligibility.refund_window_expires).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4 border-t">
                  {selectedRefund.status === 'pending' && (
                    <>
                      <button
                        onClick={() => {
                          handleStatusUpdate(selectedRefund.id, 'approved');
                          setSelectedRefund(null);
                        }}
                        className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                      >
                        <CheckCircle className="w-4 h-4" />
                        Approve Refund
                      </button>
                      <button
                        onClick={() => {
                          handleStatusUpdate(selectedRefund.id, 'rejected');
                          setSelectedRefund(null);
                        }}
                        className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
                      >
                        <XCircle className="w-4 h-4" />
                        Reject Refund
                      </button>
                    </>
                  )}
                  
                  {selectedRefund.status === 'approved' && (
                    <button
                      onClick={() => {
                        handleProcessRefund(selectedRefund.id);
                        setSelectedRefund(null);
                      }}
                      className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                    >
                      <DollarSign className="w-4 h-4" />
                      Process Refund in Stripe
                    </button>
                  )}
                  
                  <button
                    onClick={() => setSelectedRefund(null)}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RefundsPage;
