import Image from 'next/image';
import Link from 'next/link';
import type { FC } from 'react';
import React from 'react';
import { FaCircle } from 'react-icons/fa6';

import type { ProductType } from '@/data/types';

interface ProductCardProps {
  product: ProductType;
  className?: string;
  showPrevPrice?: boolean;
}

const ProductCard: FC<ProductCardProps> = ({
  product,
  className,
  showPrevPrice = false,
}) => {
  const colorMap: { [key: string]: string } = {
    beige: 'text-beige-500',
    pink: 'text-pink-500',
    black: 'text-black',
    white: 'text-white',
  };

  const isOutOfStock = product.stock === 0;

  const cardContent = (
    <div
      className={`transitionEffect relative border p-3 shadow-sm ${className} ${
        isOutOfStock ? 'cursor-not-allowed opacity-50 grayscale' : ''
      }`}
    >
      <div className="relative aspect-[4/5] w-full overflow-hidden rounded-xl lg:h-[350px] 2xl:h-[400px]">
        <Image
          src={product.image_cover}
          alt={`${product.name} cover photo`}
          className="z-0 rounded-xl object-cover object-bottom"
          fill
        />

        {isOutOfStock && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/40">
            <span className="rounded-full bg-black px-4 py-2 text-sm font-bold uppercase text-white">
              Out of Stock
            </span>
          </div>
        )}

        <div className="absolute bottom-0 right-0 z-20 flex gap-3 px-2 py-1">
          {product.colors.length > 1 ? (
            <div className="flex gap-2 text-2xl">
              {product.colors.map((color, index) => (
                <FaCircle
                  key={`${color}_${index + 1}`}
                  className={`rounded-full border border-black ${colorMap[color]}`}
                />
              ))}
            </div>
          ) : null}
        </div>
      </div>
      <div className="mt-3 border-t">
        <div className="mt-3 flex items-center justify-between">
          <div className="text-2xl">{product.name}</div>
          <p
            className={`text-neutral-500 ${
              showPrevPrice ? 'block' : 'hidden'
            } text-sm line-through`}
          >
            RM{product.previous_price}
          </p>
        </div>

        <div className="flex items-center justify-between">
          <p className="text-lg font-medium text-black">RM {product.price}</p>
          {isOutOfStock && (
            <span className="text-sm font-medium text-red-500">Sold Out</span>
          )}
        </div>
      </div>
    </div>
  );

  if (isOutOfStock) {
    return <div className="cursor-not-allowed">{cardContent}</div>;
  }

  return <Link href={`/products/${product.slug}`}>{cardContent}</Link>;
};

export default ProductCard;
