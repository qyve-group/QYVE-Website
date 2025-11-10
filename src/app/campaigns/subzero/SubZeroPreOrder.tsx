'use client';

import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useState } from 'react';

import SubZeroPreOrderForm from '@/components/SubZeroPreOrderForm';

const SubZeroPreOrder = () => {
  const [isPreOrderOpen, setIsPreOrderOpen] = useState(false);

  return (
    <section
      id="preorder"
      className="from-gray-50 bg-gradient-to-br to-white py-16"
    >
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-4xl font-bold italic">
            <span className="text-black">SECURE YOUR</span>{' '}
            <span className="text-[#4FD1C5]">SUBZERO</span>
          </h2>
          <p className="text-gray-600 mx-auto max-w-2xl text-lg">
            Limited pre-order slots available. Be among the first to experience
            the future of futsal performance.
          </p>
        </div>

        {/* Pre-Order Card */}
        <div className="mx-auto max-w-2xl">
          <div className="border-gray-200 rounded-2xl border-2 bg-white p-8 shadow-lg transition-all hover:border-blue-500">
            <div className="mb-6 text-center">
              <div className="mb-3 inline-block rounded-full bg-gradient-to-r from-[#0d3d5c] to-[#1a5a7a] px-4 py-1 text-sm font-bold text-white">
                EARLY BIRD - RM 20 OFF
              </div>
              {/* <div className="text-5xl mb-4">👟</div> */}
              <h3 className="mb-2 text-2xl font-bold">SubZero Futsal Shoes</h3>
              <p className="text-gray-600 mb-4">
                Get the revolutionary SubZero futsal shoes
              </p>
              <div className="mb-2 flex items-baseline justify-center gap-3">
                <span className="text-gray-400 text-2xl line-through">
                  RM 238
                </span>
                <span className="text-4xl font-bold text-blue-600">RM 218</span>
              </div>
              <p className="mb-1 text-sm font-semibold text-green-600">
                Save RM 20!
              </p>
              {/* <p className="text-sm text-gray-500">30% deposit required (RM 64.26)</p> */}
            </div>

            <ul className="mb-8 space-y-3">
              <li className="text-gray-700 flex items-center gap-2">
                {/* <span className="text-green-600">✓</span> */}
                SubZero-Weave Tech upper
              </li>
              <li className="text-gray-700 flex items-center gap-2">
                {/* <span className="text-green-600">✓</span> */}
                Energy return foam midsole
              </li>
              <li className="text-gray-700 flex items-center gap-2">
                {/* <span className="text-green-600">✓</span> */}
                Multi-directional traction grip
              </li>
              <li className="text-gray-700 flex items-center gap-2">
                {/* <span className="text-green-600">✓</span> */}
                Sizes 38-44 EU
              </li>
            </ul>

            <button
              type="button"
              /* onClick={() => setIsPreOrderOpen(true)} */
              onClick={() =>
                window.open('https://forms.gle/oEzXaeWTwE5qbrHi7', '_blank')
              }
              className="w-full rounded-lg bg-gradient-to-r from-[#0d3d5c] to-[#1a5a7a] py-4 text-lg font-semibold text-white transition-all hover:opacity-90"
            >
              Pre-Order Now
            </button>
          </div>
        </div>

        {/* <div className="mt-12 space-y-4 text-center">
          <div className="text-gray-600 inline-flex items-center gap-8 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🚚</span>
              <span>Within 5 days delivery after 12/12</span>
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
        </div> */}
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
                <Dialog.Panel className="w-full max-w-4xl overflow-hidden rounded-2xl bg-white p-8 text-left align-middle shadow-xl transition-all">
                  <SubZeroPreOrderForm
                    productName="SubZero Futsal Shoes (Early Bird)"
                    defaultPrice={214.2}
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
