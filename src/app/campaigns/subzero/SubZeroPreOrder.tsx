'use client';

import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useState } from 'react';

import SubZeroPreOrderForm from '@/components/SubZeroPreOrderForm';

const SubZeroPreOrder = () => {
  const [isPreOrderOpen, setIsPreOrderOpen] = useState(false);

  return (
    <section
      id="preorder"
      className="bg-gradient-to-br from-gray-50 to-white py-12 sm:py-16"
    >
      <div className="container mx-auto px-4">
        <div className="mb-8 text-center sm:mb-10 md:mb-12">
          <h2 className="mb-3 text-3xl font-bold italic sm:mb-4 sm:text-4xl md:text-5xl">
            <span className="text-black">SECURE YOUR</span>{' '}
            <span className="text-[#4FD1C5]">SUBZERO</span>
          </h2>
        </div>

        {/* Pre-Order Card */}
        <div className="mx-auto max-w-md sm:max-w-lg md:max-w-2xl">
          <div className="rounded-2xl border-2 border-gray-200 bg-white p-6 shadow-lg transition-all hover:border-blue-500 sm:p-8">
            <div className="mb-5 text-center sm:mb-6">
              <h3 className="mb-2 text-xl font-bold sm:text-2xl">Subzero Futsal Shoes</h3>
              <p className="mb-4 text-sm text-gray-600 sm:text-base">
                Get the revolutionary Subzero futsal shoes
              </p>
              <div className="mb-2 flex flex-wrap items-baseline justify-center gap-2 sm:gap-3">
                <span className="font-myFontSS text-2xl line-through sm:text-3xl md:text-4xl">
                  RM 238
                </span>
                <span className="text-2xl font-bold text-[#4FD1C5] sm:text-3xl md:text-4xl">RM 215</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsPreOrderOpen(true)}
              className="w-full rounded-lg bg-gradient-to-r from-[#0d3d5c] to-[#1a5a7a] py-3 text-base font-semibold text-white transition-all hover:opacity-90 sm:py-4 sm:text-lg"
            >
              Buy Now
            </button>
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
            <div className="flex min-h-full items-center justify-center p-3 sm:p-4">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-4xl overflow-hidden rounded-2xl bg-white p-5 text-left align-middle shadow-xl transition-all sm:p-6 md:p-8">
                  <SubZeroPreOrderForm
                    productName="SubZero Futsal Shoes (Early Bird)"
                    defaultPrice={238}
                    onClose={() => setIsPreOrderOpen(false)}
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
