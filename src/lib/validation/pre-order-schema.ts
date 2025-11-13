import { z } from 'zod';

export const shippingAddressSchema = z.object({
  fname: z.string().min(1, 'First name is required'),
  lname: z.string().min(1, 'Last name is required'),
  address_1: z.string().min(1, 'Address is required'),
  address_2: z.string().optional(),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  postal_code: z.string().min(1, 'Postal code is required'),
  country: z.string().default('Malaysia'),
});

export const preOrderSchema = z.object({
  customerEmail: z.string().email('Invalid email address'),
  customerName: z.string().min(2, 'Name must be at least 2 characters'),
  customerPhone: z.string().optional(),
  productName: z.string().min(1, 'Product name is required'),
  productVariant: z.string().optional(),
  quantity: z
    .number()
    .int()
    .min(1, 'Quantity must be at least 1')
    .max(100, 'Quantity too large'),
  unitPrice: z
    .number()
    .positive('Price must be positive')
    .max(100000, 'Price too large'),
  totalPrice: z.number().positive('Total must be positive'),
  shippingAddress: shippingAddressSchema.optional(),
  bundleId: z.string().uuid().optional(),
  isPartOfBundle: z.boolean().optional(),
  preOrderNotes: z.string().max(1000, 'Notes too long').optional(),
  depositRequired: z.boolean().optional(),
  depositAmount: z.number().positive().optional(),
});

export type PreOrderInput = z.infer<typeof preOrderSchema>;
export type ShippingAddress = z.infer<typeof shippingAddressSchema>;
