'use client';

import { ChevronDownIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';

const faqs = [
  {
    id: '1',
    question: 'When will SubZero be delivered?',
    answer:
      'SubZero pre-orders are expected to ship in late December 2025. All Early Bird customers will receive priority shipping and tracking information via email.',
  },
  {
    id: '2',
    question: 'What sizes are available?',
    answer:
      'SubZero is available in EU sizes 38-44. Please refer to our size chart for detailed measurements to ensure the perfect fit.',
  },
  {
    id: '3',
    question: 'Can I use SubZero for outdoor football?',
    answer:
      'SubZero is specifically engineered for futsal and indoor court surfaces. The specialized traction pattern is optimized for hard court performance. Using them outdoors may reduce their lifespan and effectiveness.',
  },
  {
    id: '4',
    question: 'What makes SubZero different from other futsal shoes?',
    answer:
      'SubZero features our proprietary SubZero-Weave Tech upper system combining microfibre leather with mesh panels for optimal breathability, Energy Return Foam midsole for shock absorption, and multi-directional Traction Grip outsole for explosive movements.',
  },
  {
    id: '5',
    question: 'Is the Early Bird discount still available?',
    answer:
      'Yes! The Early Bird price of RM 214.20 (10% off RM 238) is available for pre-orders. This is a limited-time offer exclusively for early supporters.',
  },
  {
    id: '6',
    question: 'What is your return policy for SubZero?',
    answer:
      'We offer a 30-day return policy from the delivery date. If you\'re not satisfied with your SubZero shoes, you can return them for a full refund, provided they\'re unworn and in original packaging.',
  },
  {
    id: '7',
    question: 'Are SubZero shoes suitable for wide feet?',
    answer:
      'SubZero has a standard fit design. If you have wider feet, we recommend ordering one size up for optimal comfort. Please check our detailed size chart for measurements.',
  },
  {
    id: '8',
    question: 'What colors are available?',
    answer:
      'The SubZero Early Bird pre-order is currently available in White variant only. Additional colorways may be released in future collections.',
  },
];

const SubZeroFAQs = () => {
  const [openId, setOpenId] = useState<string | null>('1');

  const toggleFAQ = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section className="bg-white py-16 md:py-24">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-4xl font-bold italic text-black md:text-5xl">
            FREQUENTLY ASKED
            <span className="text-[#4FD1C5]"> QUESTIONS</span>
          </h2>
          <p className="text-gray-700 text-lg">
            Everything you need to know about SubZero
          </p>
        </div>

        {/* FAQs List */}
        <div className="mx-auto max-w-3xl space-y-4">
          {faqs.map((faq) => (
            <div
              key={faq.id}
              className="border-gray-200 overflow-hidden rounded-lg border transition-shadow hover:shadow-md"
            >
              <button
                type="button"
                onClick={() => toggleFAQ(faq.id)}
                className="hover:bg-gray-50 flex w-full items-center justify-between bg-white p-6 text-left transition-colors"
              >
                <span className="pr-8 text-lg font-semibold text-black">
                  {faq.question}
                </span>
                <ChevronDownIcon
                  className={`size-6 flex-shrink-0 text-[#4FD1C5] transition-transform ${
                    openId === faq.id ? 'rotate-180' : ''
                  }`}
                />
              </button>

              <div
                className={`transition-all ${
                  openId === faq.id
                    ? 'max-h-96 opacity-100'
                    : 'max-h-0 opacity-0'
                }`}
              >
                <div className="bg-gray-50 px-6 pb-6">
                  <p className="text-gray-700">{faq.answer}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Still Have Questions CTA */}
        <div className="mt-12 text-center">
          <p className="text-gray-600 mb-4">Still have questions?</p>
          <a
            href="https://wa.me/60123456789?text=Hi%20QYVE%20team%2C%20I%20have%20questions%20about%20SubZero"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:bg-gray-100 inline-block rounded-full border-2 border-black px-8 py-3 font-semibold text-black transition-all hover:scale-105"
          >
            Contact Us on WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
};

export default SubZeroFAQs;
