'use client';

import { useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import SubZeroPreOrderForm from '@/components/SubZeroPreOrderForm';

const SubZeroPreOrder = () => {
  const [isPreOrderOpen, setIsPreOrderOpen] = useState(false);

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

        {/* Pre-Order Card */}
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-8 border-2 border-gray-200 hover:border-blue-500 transition-all">
            <div className="text-center mb-6">
              <div className="text-5xl mb-4">👟</div>
              <h3 className="text-2xl font-bold mb-2">SubZero Futsal Shoes</h3>
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

    </section>
  );
};

export default SubZeroPreOrder;
