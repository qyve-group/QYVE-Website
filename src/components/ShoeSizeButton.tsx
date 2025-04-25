// "use client";

import type { FC } from 'react';
// import React, { useEffect, useState } from "react";
import { FaCheckCircle } from 'react-icons/fa';

interface ShoeSizeButtonProps {
  product: {
    size: string;
    stock: number;
  };
  onSelect: (size: string) => void;
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
        onSelect(product.size);
      }}
      className={`relative w-full rounded-xl py-10 font-medium disabled:bg-gray disabled:text-neutral-500 ${
        isSelected ? 'bg-primary text-white' : 'bg-gray text-black'
      }`}
    >
      <FaCheckCircle
        className={`absolute right-2 top-2 text-white ${
          isSelected ? 'block' : 'hidden'
        }`}
      />
      {product.size.toUpperCase()}
    </button>
  );
};

export default ShoeSizeButton;
