import Image from 'next/image';
import Link from 'next/link';
import type { FC } from 'react';
import React from 'react';

import type { ProductType } from '@/data/types';
import { FaCircle } from 'react-icons/fa6';

// import LikeButton from './LikeButton';

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
  return (
    <Link href={`/products/${product.slug}`}>
      <div
        className={`transitionEffect relative border p-3 shadow-sm ${className}`}
      >
        <div className="relative aspect-[4/5] w-full rounded-xl overflow-hidden lg:h-[350px] 2xl:h-[400px]">
          {/* {product.justIn && (
          <div className="absolute left-6 top-0 rounded-b-lg bg-primary px-3 py-2 text-sm uppercase text-white shadow-md">
            Just In!
          </div>
        )} */}
          {/* <LikeButton className="absolute right-2 top-2" /> */}

          <Image
            src={product.image_cover}
            alt={`${product.name} cover photo`}
            className="object-cover object-bottom z-0 rounded-xl"
            fill
          />

          <div className="absolute flex gap-3 bottom-0 right-0 z-20 px-2 py-1">
            {product.colors.length > 1 ? (
              <div className="flex gap-2 text-2xl">
                {product.colors.map((color) => (
                  <FaCircle
                    className={`rounded-full border border-black ${colorMap[color]}`}
                  />
                ))}
              </div>
            ) : (
              <></>
            )}
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
            {/* <p className="text-sm text-neutral-500">{product.shoeCategory}</p> */}
            <p className="text-lg font-medium text-black">RM {product.price}</p>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
