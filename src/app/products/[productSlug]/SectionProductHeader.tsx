'use client';

// import type { StaticImageData } from "next/image";
import Image from 'next/image';
import { useRouter } from 'next/navigation';
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
// import { supabase } from "@/libs/supabaseClient";

interface SectionProductHeaderProps {
  // shots: StaticImageData[];
  id: number;
  name: string;
  price: number;
  previous_price: number;
  image_cover: string;
  // sizes: string[];
  slug: string;
  products_sizes: {
    id: number;
    size: string;
    stock: number;
    product_id: number;
    product_color_id: number;
  }[];
  colors: string[];
  product_shots: string[];
  product_colors: {
    id: number;
    product_id: number;
    color: string;
    image: string;
  }[];
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
  slug,
  products_sizes,
  colors,
  product_shots,
  product_colors,
  // currentPrice,
  // rating,
  // pieces_sold,
  // reviews,
  // image_cover,
}) => {
  const cart = useSelector((state: RootState) => state.cart); // Get latest cart state
  const dispatch = useDispatch();
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<number>(0);
  const [shots, setShots] = useState<string[]>([]);
  const [activeColor, setActiveColor] = useState(0);
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedImage, setSelectedImage] = useState('');
  const [selectedColorId, setSelectedColorId] = useState(1);
  const [selectedProductSizeId, setSelectedProductSizeId] = useState<number>();
  const [custom, setCustom] = useState('');

  const session = useSelector((state: RootState) => state.auth.session);
  console.log('session sectopnproductheader: ', session);
  console.log('slug -sectionproductheader: ', slug);

  const filteredProductSizes = products_sizes.filter(
    (ps) => ps.product_color_id === selectedColorId,
  );

  const router = useRouter();

  useEffect(() => {
    console.log(product_shots);
    const fetchShots = () => {
      setShots(product_shots);

      console.log('shots: ', shots);
    };

    fetchShots();
  }, []);

  const handleAddToCart = () => {
    if (!session) {
      alert('Login to add to cart!');
      return;
    }
    if (!selectedSize) {
      alert('Please select a size before adding to cart!');
      return;
    }
    dispatch(
      addToCart({
        id: selectedProductSizeId!,
        name: `${selectedColor}-${custom}`,
        price,
        product_size: selectedSize,
        // image: shots[0], // Assuming first image is the main product image
        quantity: 1,
        image: selectedImage,
      }),
    );
    // console.log*('Adding to Cart:', id, selectedSize);
  };

  const handleBuyNow = () => {
    if (!session) {
      alert('Login to add to cart!');
      return;
    }
    if (!selectedSize) {
      alert('Please select a size before adding to cart!');
      return;
    }

    dispatch(
      addToCart({
        id: selectedProductSizeId!,
        name: selectedColor,
        price,
        product_size: selectedSize,
        quantity: 1,
        image: selectedImage,
      }),
    );
    router.push('../checkout');
  };

  const handleSelectSize = ({
    selectedSize,
    selectedProductSizeId,
  }: {
    selectedSize: string;
    selectedProductSizeId: number;
  }) => {
    setSelectedSize(selectedSize);
    setSelectedProductSizeId(selectedProductSizeId);
  };

  return (
    <div className="mt-5 items-stretch justify-between space-y-10 lg:flex lg:space-y-0">
      <div className="basis-[1/2]">
        <ImageShowCase shots={shots} />
      </div>

      <div className="basis-[45%]">
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

        <div className="flex flex-col">
          {slug === 'jersey' ? (
            <div className="flex md:flex-row flex-col">
              <div className="basis-[40%]">
                <p className="text-xl mb-5">Available colors</p>
                <div className="flex flex-wrap gap-2 mb-5">
                  {product_colors.map((pc, index) => (
                    <div
                      key={`${pc.product_id}-${pc.id}-${pc.color}`}
                      className={`relative ${
                        activeColor === index ? 'border-2 border-primary' : ''
                      } h-[50px] overflow-hidden rounded-lg aspect-[4/3]`}
                    >
                      <button
                        className="relative size-full "
                        type="button"
                        onClick={() => {
                          setActiveColor(index);
                          setSelectedColorId(pc.id);
                          setSelectedColor(pc.color);
                          setSelectedImage(pc.image || '/qyve-black.png');
                          // setChosenColor(colorName || '');
                          console.log(`Chosen pId: ${id}-${selectedId}`);
                        }}
                      >
                        <Image
                          src={pc.image || '/qyve-black.png'}
                          alt={pc.color || ''}
                          // src={selectedImage || '/qyve-black.png'}
                          // alt={selectedColor || ''}
                          // width={100}
                          // height={100}
                          fill
                          className="object-cover object-center"
                        />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
              <div className="basis-[60%]">
                <p className="text-xl mb-5">Customization</p>

                <textarea
                  id="custom"
                  className="border border-gray-300 rounded-md p-2 w-3/4 md:w-full resize-none placeholder:text-sm"
                  placeholder="Name - Number e.g Max - 7"
                  onChange={(e) => setCustom(e.target.value)}
                />
              </div>
            </div>
          ) : (
            <div>
              <div>
                <p className="text-xl mb-5">Available colors</p>
                <div className="flex flex-wrap gap-2 mb-5">
                  {product_colors.map((pc, index) => (
                    <div
                      key={`${pc.product_id}-${pc.id}-${pc.color}`}
                      className={`relative ${
                        activeColor === index ? 'border-2 border-primary' : ''
                      } h-[50px] overflow-hidden rounded-lg aspect-[4/3]`}
                    >
                      <button
                        className="relative size-full "
                        type="button"
                        onClick={() => {
                          setActiveColor(index);
                          setSelectedColorId(pc.id);
                          setSelectedColor(pc.color);
                          setSelectedImage(pc.image || '/qyve-black.png');
                          // setChosenColor(colorName || '');
                          console.log(`Chosen pId: ${id}-${selectedId}`);
                        }}
                      >
                        <Image
                          src={pc.image || '/qyve-black.png'}
                          alt={pc.color || ''}
                          // src={selectedImage || '/qyve-black.png'}
                          // alt={selectedColor || ''}
                          // width={100}
                          // height={100}
                          fill
                          className="object-cover object-center"
                        />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="mb-5 flex items-end justify-between">
          <p className="text-xl">Available sizes</p>
          <p className="flex items-center gap-1 text-sm text-neutral-500">
            Size guide <LuInfo />
          </p>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {/* {products_sizes.map((product) => (
            <ShoeSizeButton
              key={`${product.product_id}-${product.product_color_id}-${product.id}`}
              product={product}
              onSelect={handleSelectSize}
              isSelected={selectedSize === product.size} // Check if this button is selected
            />
          ))} */}
          {filteredProductSizes.map((product) => (
            <ShoeSizeButton
              key={`${product.product_id}-${product.product_color_id}-${product.id}`}
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
            className="flex w-full items-center gap-1 border-2  text-white bg-black transition-all hover:bg-white hover:border-primary hover:text-black active:scale-95 active:text-white"
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
