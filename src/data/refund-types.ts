export interface RefundRequest {
  id: string;
  order_id: string;
  customer_id: string;
  customer_name: string;
  customer_email: string;
  order_number: string;
  amount: number;
  currency: string;
  reason?: string;
  status: 'pending' | 'approved' | 'rejected' | 'processed';
  requested_at: string;
  processed_at?: string;
  processed_by?: string;
  notes?: string;
  whatsapp_message: string;
  whatsapp_link: string;
  eligibility: {
    is_eligible: boolean;
    days_since_delivery: number;
    delivery_date: string;
    refund_window_expires: string;
    reason_ineligible?: string;
  };
  stripe_refund_id?: string;
  created_at: string;
  updated_at: string;
}

export interface RefundEligibility {
  is_eligible: boolean;
  days_since_delivery: number;
  delivery_date: string;
  refund_window_expires: string;
  reason_ineligible?: string;
  can_request_refund: boolean;
}

export interface OrderRefundData {
  order_id: string;
  order_number: string;
  customer_name: string;
  customer_email: string;
  delivery_date: string;
  amount: number;
  currency: string;
  status: string;
  eligibility: RefundEligibility;
}

export interface RefundStats {
  total_requests: number;
  pending_requests: number;
  approved_requests: number;
  rejected_requests: number;
  processed_requests: number;
  total_refunded_amount: number;
  average_processing_time: number;
}

// Refund reasons
export const REFUND_REASONS = [
  'Product defect or damage',
  'Wrong item received',
  'Item not as described',
  'Size/color not as ordered',
  'Changed mind',
  'Late delivery',
  'Other'
] as const;

export type RefundReason = typeof REFUND_REASONS[number];

// WhatsApp message templates
export const WHATSAPP_MESSAGE_TEMPLATES = {
  refund_request: (orderNumber: string) => 
    `Hi QYVE, I'd like to request a refund for Order #${orderNumber}.`,
  
  refund_status_update: (orderNumber: string, status: string) =>
    `Hi QYVE, I'd like to check the status of my refund request for Order #${orderNumber}. Current status: ${status}`,
  
  general_inquiry: () =>
    `Hi QYVE team, I have a question`,
  
  order_inquiry: (orderNumber: string) =>
    `Hi QYVE team, I have a question about Order #${orderNumber}`
} as const;

// WhatsApp configuration
export const WHATSAPP_CONFIG = {
  phone_number: '601160974239',
  base_url: 'https://api.whatsapp.com/send/',
  default_message: 'Hi QYVE team, I have a question'
} as const;

// Utility functions
export const generateWhatsAppLink = (
  phoneNumber: string = WHATSAPP_CONFIG.phone_number,
  message: string = WHATSAPP_CONFIG.default_message
): string => {
  const encodedMessage = encodeURIComponent(message);
  return `${WHATSAPP_CONFIG.base_url}?phone=${phoneNumber}&text=${encodedMessage}&type=phone_number&app_absent=0`;
};

export const generateRefundWhatsAppLink = (orderNumber: string): string => {
  const message = WHATSAPP_MESSAGE_TEMPLATES.refund_request(orderNumber);
  return generateWhatsAppLink(WHATSAPP_CONFIG.phone_number, message);
};

export const checkRefundEligibility = (deliveryDate: string): RefundEligibility => {
  const delivery = new Date(deliveryDate);
  const now = new Date();
  const daysSinceDelivery = Math.floor((now.getTime() - delivery.getTime()) / (1000 * 60 * 60 * 24));
  
  const refundWindowDays = 7;
  const refundWindowExpires = new Date(delivery.getTime() + (refundWindowDays * 24 * 60 * 60 * 1000));
  
  const isEligible = daysSinceDelivery <= refundWindowDays;
  const canRequestRefund = isEligible && now <= refundWindowExpires;
  
  return {
    is_eligible: isEligible,
    days_since_delivery: daysSinceDelivery,
    delivery_date: deliveryDate,
    refund_window_expires: refundWindowExpires.toISOString(),
    reason_ineligible: !isEligible ? `Refund window expired. Delivery was ${daysSinceDelivery} days ago.` : undefined,
    can_request_refund: canRequestRefund
  };
};

export const formatRefundAmount = (amount: number, currency: string = 'MYR'): string => {
  return new Intl.NumberFormat('en-MY', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2
  }).format(amount);
};

export const getRefundStatusColor = (status: string): string => {
  switch (status) {
    case 'pending':
      return 'bg-yellow-100 text-yellow-800';
    case 'approved':
      return 'bg-green-100 text-green-800';
    case 'rejected':
      return 'bg-red-100 text-red-800';
    case 'processed':
      return 'bg-blue-100 text-blue-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export const getRefundStatusText = (status: string): string => {
  switch (status) {
    case 'pending':
      return 'Pending Review';
    case 'approved':
      return 'Approved';
    case 'rejected':
      return 'Rejected';
    case 'processed':
      return 'Processed';
    default:
      return 'Unknown';
  }
};

// Mock data for testing
export const MOCK_REFUND_REQUESTS: RefundRequest[] = [
  {
    id: 'refund-001',
    order_id: 'order-123',
    customer_id: 'customer-001',
    customer_name: 'John Doe',
    customer_email: 'john@example.com',
    order_number: 'QYVE-2024-001',
    amount: 299.00,
    currency: 'MYR',
    reason: 'Product defect or damage',
    status: 'pending',
    requested_at: '2024-12-15T10:30:00Z',
    whatsapp_message: 'Hi QYVE, I\'d like to request a refund for Order #QYVE-2024-001.',
    whatsapp_link: generateRefundWhatsAppLink('QYVE-2024-001'),
    eligibility: {
      is_eligible: true,
      days_since_delivery: 2,
      delivery_date: '2024-12-13T14:00:00Z',
      refund_window_expires: '2024-12-20T14:00:00Z',
      can_request_refund: true
    },
    created_at: '2024-12-15T10:30:00Z',
    updated_at: '2024-12-15T10:30:00Z'
  },
  {
    id: 'refund-002',
    order_id: 'order-124',
    customer_id: 'customer-002',
    customer_name: 'Jane Smith',
    customer_email: 'jane@example.com',
    order_number: 'QYVE-2024-002',
    amount: 199.00,
    currency: 'MYR',
    reason: 'Wrong item received',
    status: 'approved',
    requested_at: '2024-12-10T09:15:00Z',
    processed_at: '2024-12-12T16:45:00Z',
    processed_by: 'admin-001',
    notes: 'Customer received wrong size. Refund approved.',
    whatsapp_message: 'Hi QYVE, I\'d like to request a refund for Order #QYVE-2024-002.',
    whatsapp_link: generateRefundWhatsAppLink('QYVE-2024-002'),
    eligibility: {
      is_eligible: true,
      days_since_delivery: 5,
      delivery_date: '2024-12-08T11:30:00Z',
      refund_window_expires: '2024-12-15T11:30:00Z',
      can_request_refund: true
    },
    stripe_refund_id: 're_1234567890',
    created_at: '2024-12-10T09:15:00Z',
    updated_at: '2024-12-12T16:45:00Z'
  }
];

export const MOCK_ORDER_REFUND_DATA: OrderRefundData[] = [
  {
    order_id: 'order-123',
    order_number: 'QYVE-2024-001',
    customer_name: 'John Doe',
    customer_email: 'john@example.com',
    delivery_date: '2024-12-13T14:00:00Z',
    amount: 299.00,
    currency: 'MYR',
    status: 'delivered',
    eligibility: checkRefundEligibility('2024-12-13T14:00:00Z')
  },
  {
    order_id: 'order-124',
    order_number: 'QYVE-2024-002',
    customer_name: 'Jane Smith',
    customer_email: 'jane@example.com',
    delivery_date: '2024-12-08T11:30:00Z',
    amount: 199.00,
    currency: 'MYR',
    status: 'delivered',
    eligibility: checkRefundEligibility('2024-12-08T11:30:00Z')
  },
  {
    order_id: 'order-125',
    order_number: 'QYVE-2024-003',
    customer_name: 'Bob Johnson',
    customer_email: 'bob@example.com',
    delivery_date: '2024-12-01T09:00:00Z',
    amount: 399.00,
    currency: 'MYR',
    status: 'delivered',
    eligibility: checkRefundEligibility('2024-12-01T09:00:00Z')
  }
];
