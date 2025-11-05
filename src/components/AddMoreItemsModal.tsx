'use client';

import { Fragment, useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon, ShoppingCartIcon, SparklesIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

interface BundleItem {
  id: string;
  product_name: string;
  product_image_url?: string;
  item_price: number;
  quantity: number;
}

interface Bundle {
  id: string;
  bundle_name: string;
  bundle_description: string;
  regular_price: number;
  bundle_price: number;
  discount_amount: number;
  badge_text?: string;
  badge_color?: string;
  items: BundleItem[];
}

interface ProductContext {
  name: string;
  price: number;
  category?: string;
  productId?: string;
}

interface AddMoreItemsModalProps {
  isOpen: boolean;
  onClose: () => void;
  itemJustAdded?: {
    name: string;
    price: number;
    image?: string;
  };
  productContext?: ProductContext | null;
}

const AddMoreItemsModal = ({
  isOpen,
  onClose,
  itemJustAdded,
  productContext,
}: AddMoreItemsModalProps) => {
  const [bundles, setBundles] = useState<Bundle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen && productContext) {
      fetchRelevantBundles();
    }
  }, [isOpen, productContext]);

  const fetchRelevantBundles = async () => {
    try {
      setLoading(true);
      
      const params = new URLSearchParams();
      if (productContext?.name) params.append('productName', productContext.name);
      if (productContext?.category) params.append('category', productContext.category);
      if (productContext?.productId) params.append('productId', productContext.productId);
      
      const response = await fetch(`/api/bundles/relevant?${params.toString()}`);
      const data = await response.json();
      
      setBundles(data.bundles || []);
    } catch (error) {
      console.error('Failed to fetch relevant bundles:', error);
      setBundles([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-40" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-4xl transform overflow-hidden rounded-2xl bg-white p-8 text-left align-middle shadow-xl transition-all">
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>

                {/* Success Message */}
                {itemJustAdded && (
                  <div className="mb-6 flex items-center gap-3 bg-green-50 border border-green-200 rounded-lg p-4">
                    <ShoppingCartIcon className="h-8 w-8 text-green-600" />
                    <div>
                      <h3 className="font-semibold text-green-900">
                        Added to Cart!
                      </h3>
                      <p className="text-sm text-green-700">
                        {itemJustAdded.name} - RM {itemJustAdded.price.toFixed(2)}
                      </p>
                    </div>
                  </div>
                )}

                {/* Main Content */}
                <div className="text-center mb-8">
                  <div className="inline-flex items-center gap-2 text-yellow-600 mb-2">
                    <SparklesIcon className="h-6 w-6" />
                    <span className="text-sm font-semibold uppercase tracking-wide">
                      Complete Your Order
                    </span>
                  </div>
                  <Dialog.Title
                    as="h2"
                    className="text-3xl font-bold text-gray-900 mb-2"
                  >
                    Here's what will go well with your purchase
                  </Dialog.Title>
                  <p className="text-gray-600">
                    Get everything you need at a discounted price
                  </p>
                </div>

                {/* Loading State */}
                {loading && (
                  <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                  </div>
                )}

                {/* Bundles Grid */}
                {!loading && bundles.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    {bundles.map((bundle) => (
                      <div
                        key={bundle.id}
                        className="border-2 border-gray-200 rounded-xl p-6 hover:border-blue-500 hover:shadow-lg transition-all relative"
                      >
                        {/* Badge */}
                        {bundle.badge_text && (
                          <div
                            className="absolute -top-3 -right-3 px-4 py-1 rounded-full text-white text-sm font-semibold shadow-lg"
                            style={{ backgroundColor: bundle.badge_color || '#ff6b35' }}
                          >
                            {bundle.badge_text}
                          </div>
                        )}

                        <h3 className="text-xl font-bold mb-2">
                          {bundle.bundle_name}
                        </h3>
                        <p className="text-sm text-gray-600 mb-4">
                          {bundle.bundle_description}
                        </p>

                        {/* Items List */}
                        <div className="mb-4 space-y-2">
                          {bundle.items.map((item, idx) => (
                            <div
                              key={idx}
                              className="flex items-center gap-2 text-sm text-gray-700"
                            >
                              <span className="text-green-600">✓</span>
                              <span>
                                {item.quantity}x {item.product_name}
                              </span>
                            </div>
                          ))}
                        </div>

                        {/* Pricing */}
                        <div className="border-t pt-4 mb-4">
                          <div className="flex items-baseline gap-3 mb-1">
                            <span className="text-2xl font-bold text-blue-600">
                              RM {bundle.bundle_price.toFixed(2)}
                            </span>
                            <span className="text-lg text-gray-400 line-through">
                              RM {bundle.regular_price.toFixed(2)}
                            </span>
                          </div>
                          <p className="text-sm font-semibold text-green-600">
                            Save RM {bundle.discount_amount.toFixed(2)}
                          </p>
                        </div>

                        {/* CTA Button */}
                        <Link
                          href={`/bundles/${bundle.id}`}
                          onClick={onClose}
                          className="block w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white text-center py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-all"
                        >
                          View Bundle
                        </Link>
                      </div>
                    ))}
                  </div>
                )}

                {/* No Bundles */}
                {!loading && bundles.length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-gray-500">No bundles available at the moment.</p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-4">
                  <button
                    onClick={onClose}
                    className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
                  >
                    Continue Shopping
                  </button>
                  <Link
                    href="/checkout"
                    onClick={onClose}
                    className="flex-1 bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors text-center"
                  >
                    Proceed to Checkout
                  </Link>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default AddMoreItemsModal;
