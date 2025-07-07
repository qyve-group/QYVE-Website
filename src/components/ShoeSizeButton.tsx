// "use client";

import type { FC } from 'react';
// import React, { useEffect, useState } from "react";
import { FaCheckCircle } from 'react-icons/fa';

interface ShoeSizeButtonProps {
  product: {
    id: number;
    size: string;
    stock: number;
    product_id: number;
    product_color_id: number;
  };

  onSelect: (args: {
    selectedSize2: string;
    selectedProductSizeId2: number;
  }) => void;
  isSelected: boolean;
}

const ShoeSizeButton: FC<ShoeSizeButtonProps> = ({
  product,
  onSelect,
  isSelected,
}) => {
  return (
    <button
      type="button"
      disabled={product.stock === 0}
      onClick={() => {
        onSelect({
          selectedSize2: product.size,
          selectedProductSizeId2: product.id,
        });
      }}
      className={`relative w-full rounded-xl py-10 font-medium disabled:bg-gray disabled:text-customGray-300 ${
        isSelected ? 'bg-primary text-black' : 'bg-gray text-black'
      }`}
    >
      <FaCheckCircle
        className={`absolute right-2 top-2 text-black ${
          isSelected ? 'block' : 'hidden'
        }`}
      />
      {product.size.toUpperCase()}
    </button>
  );
};

export default ShoeSizeButton;
