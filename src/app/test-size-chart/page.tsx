'use client';

import React, { useState } from 'react';
import SizeChartButton from '@/components/SizeChartButton';
import SizeChartModal from '@/components/SizeChartModal';

const TestSizeChartPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('futsal');

  const categories = [
    { id: 'futsal', name: 'Futsal Shoes', products: ['QYVE Infinitus', 'QYVE Leyenda \'94 Series'] },
    { id: 'jersey', name: 'Jersey', products: ['BOLA QYVE Jersey'] },
    { id: 'slides', name: 'Recovery Slides', products: ['QYVE Recovery Slides'] },
    { id: 'socks', name: 'ProGrip Socks', products: ['QYVE ProGrip Socks'] }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            QYVE Size Chart System
          </h1>
          <p className="text-lg text-gray-600">
            Test the comprehensive size chart system for all QYVE product categories
          </p>
        </div>

        {/* Category Selection */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Select Product Category
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`p-4 rounded-lg border-2 transition-all ${
                  selectedCategory === category.id
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:border-gray-300 text-gray-700'
                }`}
              >
                <h3 className="font-semibold mb-2">{category.name}</h3>
                <div className="text-sm text-gray-600">
                  {category.products.map((product, index) => (
                    <div key={index}>• {product}</div>
                  ))}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Size Chart Buttons Demo */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">
            Size Chart Button Variants
          </h2>
          
          <div className="space-y-6">
            {/* Button Variant */}
            <div>
              <h3 className="text-lg font-medium text-gray-800 mb-3">Button Variant</h3>
              <div className="flex flex-wrap gap-4">
                {categories.map((category) => (
                  <SizeChartButton
                    key={`button-${category.id}`}
                    category={category.id}
                    productName={category.products[0]}
                    variant="button"
                  />
                ))}
              </div>
            </div>

            {/* Link Variant */}
            <div>
              <h3 className="text-lg font-medium text-gray-800 mb-3">Link Variant</h3>
              <div className="flex flex-wrap gap-4">
                {categories.map((category) => (
                  <SizeChartButton
                    key={`link-${category.id}`}
                    category={category.id}
                    productName={category.products[0]}
                    variant="link"
                  />
                ))}
              </div>
            </div>

            {/* Icon Variant */}
            <div>
              <h3 className="text-lg font-medium text-gray-800 mb-3">Icon Variant</h3>
              <div className="flex flex-wrap gap-4">
                {categories.map((category) => (
                  <SizeChartButton
                    key={`icon-${category.id}`}
                    category={category.id}
                    productName={category.products[0]}
                    variant="icon"
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Direct Modal Test */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Direct Modal Test
          </h2>
          <p className="text-gray-600 mb-4">
            Test the size chart modal directly for the selected category
          </p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Open Size Chart Modal
          </button>
        </div>

        {/* Features Overview */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">
            Size Chart System Features
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800">Size Charts</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Comprehensive size tables for all categories</li>
                <li>• Multiple measurement systems (US, UK, EU, CM)</li>
                <li>• Category-specific sizing guidelines</li>
                <li>• Professional measurement instructions</li>
                <li>• Pro tips for each product type</li>
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800">Size Finder</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Dynamic questionnaire system</li>
                <li>• Brand-specific size recommendations</li>
                <li>• Foot width and fit preferences</li>
                <li>• Confidence scoring for recommendations</li>
                <li>• Personalized reasoning for each suggestion</li>
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800">Integration</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Product card integration</li>
                <li>• Product page integration</li>
                <li>• Multiple button variants</li>
                <li>• Responsive modal design</li>
                <li>• Category-based filtering</li>
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800">User Experience</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Intuitive tabbed interface</li>
                <li>• Progress tracking for questionnaire</li>
                <li>• Mobile-responsive design</li>
                <li>• Accessible color schemes</li>
                <li>• Smooth animations and transitions</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Size Chart Modal */}
      <SizeChartModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        category={selectedCategory}
        productName={categories.find(c => c.id === selectedCategory)?.products[0]}
      />
    </div>
  );
};

export default TestSizeChartPage;
