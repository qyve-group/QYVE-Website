'use client';

import { useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { useDispatch } from 'react-redux';
import SubZeroPreOrderForm from '@/components/SubZeroPreOrderForm';
import BundleSelector from '@/components/BundleSelector';
import AddMoreItemsModal from '@/components/AddMoreItemsModal';
import { addToCart } from '@/store/cartSlice';

const SubZeroPreOrder = () => {
  const dispatch = useDispatch();
  const [isPreOrderOpen, setIsPreOrderOpen] = useState(false);
  const [isBundleOpen, setIsBundleOpen] = useState(false);
  const [showAddMoreModal, setShowAddMoreModal] = useState(false);
  const [lastAddedItem, setLastAddedItem] = useState<any>(null);

  const handleBundleSelect = async (_bundleId: string, items: any[]) => {
    try {
      for (const item of items) {
        const cartItem = {
          id: Math.floor(Math.random() * 1000000),
          name: item.product_name,
          price: item.price || 0,
          product_size: item.size || 'N/A',
          image: '/placeholder-product.png',
          quantity: item.quantity || 1,
        };
        
        dispatch(addToCart(cartItem));
      }

      setIsBundleOpen(false);
      
      setLastAddedItem({
        name: `${items.length} items from bundle`,
        price: items.reduce((sum, item) => sum + (item.price || 0), 0),
      });
      
      setShowAddMoreModal(true);
    } catch (error) {
      console.error('Failed to add bundle to cart:', error);
      alert('Failed to add bundle to cart. Please try again.');
    }
  };

  return (
    <section className="bg-gradient-to-br from-gray-50 to-white py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold italic mb-4">
            <span className="text-black">SECURE YOUR</span>{' '}
            <span className="text-[#4FD1C5]">SUBZERO</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Limited pre-order slots available. Be among the first to experience
            the future of futsal performance.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Individual Pre-Order */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border-2 border-gray-200 hover:border-blue-500 transition-all">
            <div className="text-center mb-6">
              <div className="text-5xl mb-4">👟</div>
              <h3 className="text-2xl font-bold mb-2">SubZero Shoes Only</h3>
              <p className="text-gray-600 mb-4">
                Get the revolutionary SubZero futsal shoes
              </p>
              <div className="flex items-baseline justify-center gap-2 mb-2">
                <span className="text-4xl font-bold text-blue-600">RM 399</span>
              </div>
              <p className="text-sm text-gray-500">30% deposit required</p>
            </div>

            <ul className="space-y-3 mb-8">
              <li className="flex items-center gap-2 text-gray-700">
                <span className="text-green-600">✓</span>
                SubZero-Weave Tech upper
              </li>
              <li className="flex items-center gap-2 text-gray-700">
                <span className="text-green-600">✓</span>
                Energy return foam midsole
              </li>
              <li className="flex items-center gap-2 text-gray-700">
                <span className="text-green-600">✓</span>
                Multi-directional traction grip
              </li>
              <li className="flex items-center gap-2 text-gray-700">
                <span className="text-green-600">✓</span>
                Sizes 38-45 EU
              </li>
            </ul>

            <button
              onClick={() => setIsPreOrderOpen(true)}
              className="w-full bg-gradient-to-r from-[#0d3d5c] to-[#1a5a7a] text-white py-4 rounded-lg font-semibold text-lg hover:opacity-90 transition-all"
            >
              Pre-Order Now
            </button>
          </div>

          {/* Bundle Pre-Order */}
          <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl shadow-xl p-8 border-2 border-blue-500 relative overflow-hidden">
            <div className="absolute -top-4 -right-4 bg-yellow-400 text-black px-6 py-2 rounded-full font-bold text-sm rotate-12 shadow-lg">
              BEST VALUE
            </div>

            <div className="text-center mb-6 text-white">
              <div className="text-5xl mb-4">🎁</div>
              <h3 className="text-2xl font-bold mb-2">Complete Package</h3>
              <p className="text-blue-100 mb-4">
                Everything you need for peak performance
              </p>
              <div className="flex items-baseline justify-center gap-3 mb-2">
                <span className="text-4xl font-bold">RM 499</span>
                <span className="text-xl text-blue-200 line-through">RM 599</span>
              </div>
              <p className="text-sm text-blue-100">Save RM 100!</p>
            </div>

            <ul className="space-y-3 mb-8 text-white">
              <li className="flex items-center gap-2">
                <span className="text-yellow-300">✓</span>
                SubZero Futsal Shoes
              </li>
              <li className="flex items-center gap-2">
                <span className="text-yellow-300">✓</span>
                2x Performance Grip Socks
              </li>
              <li className="flex items-center gap-2">
                <span className="text-yellow-300">✓</span>
                Premium Sports Bag
              </li>
              <li className="flex items-center gap-2">
                <span className="text-yellow-300">✓</span>
                Priority shipping
              </li>
            </ul>

            <button
              onClick={() => setIsBundleOpen(true)}
              className="w-full bg-white text-blue-700 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-all shadow-lg"
            >
              View Bundle Options
            </button>
          </div>
        </div>

        <div className="text-center mt-12 space-y-4">
          <div className="inline-flex items-center gap-8 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🚚</span>
              <span>8-12 weeks delivery</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">🔒</span>
              <span>Secure payment</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">✨</span>
              <span>Limited slots</span>
            </div>
          </div>
        </div>
      </div>

      {/* Pre-Order Modal */}
      <Transition appear show={isPreOrderOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-50"
          onClose={() => setIsPreOrderOpen(false)}
        >
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
            <div className="flex min-h-full items-center justify-center p-4">
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
                  <SubZeroPreOrderForm
                    productName="SubZero Futsal Shoes"
                    defaultPrice={399.00}
                    onClose={() => setIsPreOrderOpen(false)}
                    onSuccess={(id) => {
                      console.log('Pre-order created:', id);
                      setTimeout(() => setIsPreOrderOpen(false), 3000);
                    }}
                  />
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      {/* Bundle Modal */}
      <Transition appear show={isBundleOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-50"
          onClose={() => setIsBundleOpen(false)}
        >
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
            <div className="flex min-h-full items-center justify-center p-4">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-4xl transform overflow-hidden rounded-2xl bg-white p-8 text-left align-middle shadow-xl transition-all relative">
                  <BundleSelector onSelect={handleBundleSelect} />
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      {/* Add More Items Modal */}
      <AddMoreItemsModal
        isOpen={showAddMoreModal}
        onClose={() => setShowAddMoreModal(false)}
        itemJustAdded={lastAddedItem}
      />
    </section>
  );
};

export default SubZeroPreOrder;
