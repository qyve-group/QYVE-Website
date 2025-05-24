'use client';

// import type { StaticImageData } from "next/image";
// import Image from 'next/image';
import type { FC } from 'react';
import React, { useEffect, useState } from 'react';
import { BsBag } from 'react-icons/bs';
// import { GoDotFill } from 'react-icons/go';
import { LuInfo } from 'react-icons/lu';
// import { MdStar } from 'react-icons/md';
// import { PiSealCheckFill } from 'react-icons/pi';
import { useDispatch, useSelector } from 'react-redux';

import ImageShowCase from '@/components/ImageShowCase';
import ShoeSizeButton from '@/components/ShoeSizeButton';
// import { shoeSizes } from "@/data/content";
// import nike_profile from '@/images/nike_profile.jpg';
import { supabase } from '@/libs/supabaseClient';
// import ButtonCircle3 from '@/shared/Button/ButtonCircle3';
import ButtonPrimary from '@/shared/Button/ButtonPrimary';
import ButtonSecondary from '@/shared/Button/ButtonSecondary';
import Heading from '@/shared/Heading/Heading';
import { addToCart } from '@/store/cartSlice';
import type { RootState } from '@/store/store';
import { useRouter } from 'next/navigation';
// import { supabase } from "@/libs/supabaseClient";

interface SectionProductHeaderProps {
  // shots: StaticImageData[];
  id: number;
  name: string;
  price: number;
  previous_price: number;
  image_cover: string;
  // sizes: string[];
  products_sizes: { size: string; stock: number }[];
  // currentPrice: number;
  // rating: number;
  // pieces_sold: number;
  // reviews: number;
}

const SectionProductHeader: FC<SectionProductHeaderProps> = ({
  // shots,
  id,
  name,
  price,
  previous_price,
  image_cover,
  products_sizes,
  // currentPrice,
  // rating,
  // pieces_sold,
  // reviews,
  // image_cover,
}) => {
  const cart = useSelector((state: RootState) => state.cart); // Get latest cart state
  const dispatch = useDispatch();
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [shots, setShots] = useState<string[]>([]);

  const session = useSelector((state: RootState) => state.auth.session);
  console.log('session: ', session);

  const router = useRouter();

  useEffect(() => {
    const fetchShots = async () => {
      const { data: shotsData, error } = await supabase
        .from('product_shots')
        .select('images')
        .eq('product_id', id);

      if (error) {
        // console.error*('Error fetching shots:', error);
        return;
      }

      // Set shots if data is available, otherwise fallback to empty array
      if (shotsData && shotsData.length > 0) {
        setShots(shotsData?.[0]?.images || []); // safely access images
      } else {
        setShots([]); // No images found, set empty array
      }
    };

    fetchShots();
  }, []);

  const handleAddToCart = () => {
    if (!session) {
      alert('Login to add to cart!');
      return;
    } else if (!selectedSize) {
      alert('Please select a size before adding to cart!');
      return;
    }

    dispatch(
      addToCart({
        id,
        name,
        price,
        product_size: selectedSize,
        // image: shots[0], // Assuming first image is the main product image
        quantity: 1,
        image: image_cover,
      }),
    );
    // console.log*('Adding to Cart:', id, selectedSize);
  };

  const handleBuyNow = () => {
    if (!session) {
      alert('Login to add to cart!');
      return;
    } else if (!selectedSize) {
      alert('Please select a size before adding to cart!');
      return;
    }

    dispatch(
      addToCart({
        id,
        name,
        price,
        product_size: selectedSize,
        // image: shots[0], // Assuming first image is the main product image
        quantity: 1,
        image: image_cover,
      }),
    );
    router.push('../checkout');
    // console.log*('Adding to Cart:', id, selectedSize);
  };

  const handleSelectSize = (product_size: string) => {
    // setSelectedSize(product_size);
    setSelectedSize(product_size);
    // console.log*('selected size: ', selectedSize);
  };

  useEffect(() => {
    // // console.log*("Latest Cart State:", cart);
  }, [cart]);

  // // console.log*("price:", price);
  return (
    <div className="items-stretch justify-between space-y-10 lg:flex lg:space-y-0 mt-5">
      <div className="basis-[1/2]">
        <ImageShowCase shots={shots} />
      </div>
      {/* <div className="basis-1/2">
        <Image
          src={image_cover}
          alt={`${name} cover photo`}
          width={400}
          height={200}
        />
      </div> */}

      <div className="basis-[45%]">
        {/* <Heading className="mb-0" isMain title="new arrival!"> */}
        <Heading className="mb-0" isMain>
          {name}
          {/* {id} */}
        </Heading>

        {/* <div className="mb-10 flex items-center">
          <div className="flex items-center gap-1">
            <ButtonCircle3
              className="overflow-hidden border border-neutral-400"
              size="w-11 h-11"
            >
              <Image
                src={nike_profile}
                alt="nike_profile"
                className="size-full object-cover"
              />
            </ButtonCircle3>
            <span className="font-medium">Nike</span>
            <PiSealCheckFill className="text-blue-600" />
          </div>
          <GoDotFill className="mx-3 text-neutral-500" />
          <div className="flex items-center gap-1">
            <MdStar className="text-yellow-400" />
            <p className="text-sm">
              {rating}{" "}
              <span className="text-neutral-500">{`(${reviews} Reviews)`}</span>
            </p>
          </div>
          <GoDotFill className="mx-3 text-neutral-500" />
          <p className="text-neutral-500">{`${pieces_sold} items sold`}</p>
        </div> */}

        <div className="mb-5 space-y-1">
          <p className="text-neutral-500 line-through">RM{previous_price}</p>
          <h1 className="text-3xl font-medium">RM{price}</h1>
        </div>

        <div className="mb-5 flex items-end justify-between">
          <p className="text-xl">Available sizes</p>
          <p className="flex items-center gap-1 text-sm text-neutral-500">
            Size guide <LuInfo />
          </p>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {products_sizes.map((product) => (
            <ShoeSizeButton
              key={product.size}
              product={product}
              onSelect={handleSelectSize}
              isSelected={selectedSize === product.size} // Check if this button is selected
            />
          ))}
        </div>

        <div className="mt-5 flex items-center gap-5">
          <ButtonPrimary className="w-full" onClick={handleBuyNow}>
            Buy Now
          </ButtonPrimary>
          <ButtonSecondary
            className="flex w-full items-center gap-1 border-2 border-primary text-primary transition-all hover:bg-primary hover:text-white active:scale-95 active:text-white"
            onClick={handleAddToCart}
          >
            <BsBag /> Add to cart
          </ButtonSecondary>
        </div>
      </div>
    </div>
  );
};

export default SectionProductHeader;
