'use client';

import React, { useState } from 'react';
import { Ruler } from 'lucide-react';
import SizeChartModal from './SizeChartModal';

interface SizeChartButtonProps {
  category: string;
  productName?: string;
  variant?: 'button' | 'link' | 'icon';
  className?: string;
  children?: React.ReactNode;
}

const SizeChartButton: React.FC<SizeChartButtonProps> = ({
  category,
  productName,
  variant = 'button',
  className = '',
  children
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const getCategoryDisplayName = (category: string) => {
    switch (category) {
      case 'futsal':
        return 'Futsal Shoes';
      case 'jersey':
        return 'Jersey';
      case 'slides':
        return 'Recovery Slides';
      case 'socks':
        return 'ProGrip Socks';
      default:
        return 'Product';
    }
  };

  const renderButton = () => {
    switch (variant) {
      case 'link':
        return (
          <button
            onClick={handleOpenModal}
            className={`inline-flex items-center gap-2 px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 hover:text-blue-800 rounded-lg border border-blue-200 hover:border-blue-300 text-sm font-medium transition-all duration-200 hover:shadow-sm ${className}`}
          >
            <Ruler className="w-4 h-4" />
            {children || `Size Chart - ${getCategoryDisplayName(category)}`}
          </button>
        );

      case 'icon':
        return (
          <button
            onClick={handleOpenModal}
            className={`p-2 text-gray-600 hover:text-blue-600 transition-colors ${className}`}
            title={`View ${getCategoryDisplayName(category)} Size Chart`}
          >
            <Ruler className="w-5 h-5" />
          </button>
        );

      case 'button':
      default:
        return (
          <button
            onClick={handleOpenModal}
            className={`inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors ${className}`}
          >
            <Ruler className="w-4 h-4 mr-2" />
            {children || 'Size Chart'}
          </button>
        );
    }
  };

  return (
    <>
      {renderButton()}
      <SizeChartModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        category={category}
        productName={productName}
      />
    </>
  );
};

export default SizeChartButton;
