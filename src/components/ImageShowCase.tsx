'use client';

// import type { StaticImageData } from "next/image";
import Image from 'next/image';
// import { pathOr } from "ramda";
import type { FC } from 'react';
import React, { useState } from 'react';

import LikeButton from './LikeButton';

interface ImageShowCaseProps {
  shots: string[];
}

const ImageShowCase: FC<ImageShowCaseProps> = ({ shots }) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  console.log('shots in imageshowcase: ', shots);

  return (
    <div className="space-y-3 rounded-2xl border border-neutral-300 p-2">
      <div className="relative h-[300px] w-full overflow-hidden rounded-2xl md:h-[520px]">
        <LikeButton className="absolute right-5 top-5" />
        <Image
          // src={pathOr("", [activeImageIndex], shots)}
          src={shots[activeImageIndex] || ''}
          alt="Product Image"
          fill
          // className="h-full w-full object-cover object-center"
          className="object-cover object-center"
        />
      </div>
      <div className="grid grid-cols-4 gap-3">
        {shots.map((shot, index) => (
          <div
            // key={shot.src}
            key={shot}
            className={`${
              activeImageIndex === index ? 'border-2 border-primary' : ''
            } h-[100px] overflow-hidden rounded-lg`}
          >
            <button
              className="size-full"
              type="button"
              onClick={() => setActiveImageIndex(index)}
            >
              <Image
                src={shot}
                alt={`Product shots ${index + 1}`}
                width={100}
                height={100}
                className="size-full object-cover object-center"
              />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageShowCase;
