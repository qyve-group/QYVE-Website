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
import { useDispatch } from 'react-redux';

import ImageShowCase from '@/components/ImageShowCase';
import ShoeSizeButton from '@/components/ShoeSizeButton';
import { event } from '@/lib/gtag';
// import { shoeSizes } from "@/data/content";
// import nike_profile from '@/images/nike_profile.jpg';
// import ButtonCircle3 from '@/shared/Button/ButtonCircle3';
import ButtonPrimary from '@/shared/Button/ButtonPrimary';
import ButtonSecondary from '@/shared/Button/ButtonSecondary';
import Heading from '@/shared/Heading/Heading';
import { addToCart } from '@/store/cartSlice';
// import { supabase } from "@/libs/supabaseClient";

interface SectionProductHeaderProps {
  // shots: StaticImageData[];
  // id: number;
  name: string;
  price: number;
  previous_price: number;
  // image_cover: string;
  // sizes: string[];
  slug: string;
  products_sizes: {
    id: number;
    size: string;
    stock: number;
    product_id: number;
    product_color_id: number;
  }[];
  // colors: string[];
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
  // id,
  name,
  price,
  previous_price,
  // image_cover,
  slug,
  products_sizes,
  // colors,
  product_shots,
  product_colors,
  // currentPrice,
  // rating,
  // pieces_sold,
  // reviews,
  // image_cover,
}) => {
  // const cart = useSelector((state: RootState) => state.cart); // Get latest cart state
  const dispatch = useDispatch();
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  // const [selectedId, setSelectedId] = useState<number>(0);
  const [shots, setShots] = useState<string[]>([]);
  const [activeColor, setActiveColor] = useState(0);
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedImage, setSelectedImage] = useState('');
  // const [selectedColorId, setSelectedColorId] = useState(0);
  const [selectedColorId, setSelectedColorId] = useState<number | null>(null);

  const [selectedProductSizeId, setSelectedProductSizeId] = useState<number>();
  const [custom, setCustom] = useState('');

  // console.log('slug -sectionproductheader: ', slug);

  // Set default color ID and image once when product changes
  useEffect(() => {
    if (products_sizes.length > 0 && selectedColorId === null) {
      const firstColorId = products_sizes[0]?.product_color_id;
      setSelectedColorId(firstColorId ?? null);

      // Set default image from the first color
      const firstColor = product_colors.find((pc) => pc.id === firstColorId);
      if (firstColor && !selectedImage) {
        setSelectedImage(firstColor.image || '/qyve-black.png');
        setSelectedColor(firstColor.color);
      }
    }
  }, [products_sizes, selectedColorId, product_colors, selectedImage]);

  const filteredProductSizes = products_sizes.filter(
    (ps) => ps.product_color_id === selectedColorId,
  );

  console.log('filteredProductSizes: ', filteredProductSizes);

  const router = useRouter();

  useEffect(() => {
    // console.log(product_shots);
    // setSelectedColorId(filteredProductSizes[0]?.product_color_id ?? 0);

    const fetchShots = () => {
      setShots(product_shots);

      // console.log('shots: ', shots);
    };

    fetchShots();
  }, []);

  const handleAddToCart = () => {
    // if (!session) {
    //   alert('Login to add to cart!');
    //   return;
    // }
    if (!selectedSize) {
      alert('Please select a size before adding to cart!');
      return;
    }

    event('add_to_cart', {
      currency: 'MYR',
      value: price,
      items: [
        {
          item_id: selectedProductSizeId,
          item_name: `${selectedColor}`,
          price,
          quantity: 1,
          item_variant: selectedSize,
          // item_brand: 'YourBrandName', // optional but recommended
          // item_category: 'Shoes', // or your product category
          image_url: selectedImage, // optional for reports
        },
      ],
    });

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
    // Allow guest users to buy now - no authentication required
    if (!selectedSize) {
      alert('Please select a size before adding to cart!');
      return;
    }

    event('add_to_cart', {
      currency: 'MYR',
      value: price,
      items: [
        {
          item_id: selectedProductSizeId,
          item_name: `${selectedColor}`,
          price,
          quantity: 1,
          item_variant: selectedSize,
          // item_brand: 'YourBrandName', // optional but recommended
          // item_category: 'Shoes', // or your product category
          image_url: selectedImage, // optional for reports
        },
      ],
    });

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

    // Small delay to ensure Redux state is updated before navigation
    setTimeout(() => {
      router.push('../checkout');
    }, 100);
  };

  const handleSelectSize = ({
    selectedSize2,
    selectedProductSizeId2,
  }: {
    selectedSize2: string;
    selectedProductSizeId2: number;
  }) => {
    setSelectedSize(selectedSize2);
    setSelectedProductSizeId(selectedProductSizeId2);
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
          {slug?.includes('jersey') ? (
            <div className="flex flex-col gap-6 lg:flex-row">
              <div className="basis-2/5">
                <p className="mb-5 text-xl">Available colors</p>
                <div className="mb-5 flex flex-wrap gap-2">
                  {product_colors.map((pc, index) => (
                    <div
                      key={`${pc.product_id}-${pc.id}-${pc.color}`}
                      className={`relative ${
                        activeColor === index ? 'border-2 border-primary' : ''
                      } aspect-[4/3] h-[50px] overflow-hidden rounded-lg`}
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

                          console.log('current selectedcolorid: ', pc.id);
                          console.log('current selectedcolor: ', pc.color);
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
              <div className="basis-3/5">
                <div className="bg-gray-50 rounded-lg border p-6">
                  <div className="mb-4 flex items-center gap-2">
                    <h3 className="text-gray-800 text-xl font-semibold">
                      Jersey Customization
                    </h3>
                    <span className="rounded-full bg-primary px-2 py-1 text-xs font-medium text-black">
                      FREE
                    </span>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label
                        htmlFor="player-name"
                        className="text-gray-700 mb-2 block text-sm font-medium"
                      >
                        Player Name
                      </label>
                      <input
                        type="text"
                        id="player-name"
                        className="border-gray-300 placeholder:text-gray-400 w-full rounded-lg border px-4 py-3 transition-colors focus:border-primary focus:ring-2 focus:ring-primary"
                        placeholder="Enter player name"
                        maxLength={15}
                        onChange={(e) => {
                          const name = e.target.value.toUpperCase();
                          const number =
                            (
                              document.getElementById(
                                'player-number',
                              ) as HTMLInputElement
                            )?.value || '';
                          setCustom(
                            name && number
                              ? `${name} - ${number}`
                              : name || number,
                          );
                          // Update preview
                          const namePreview =
                            document.getElementById('name-preview');
                          if (namePreview)
                            namePreview.textContent = name || 'PLAYER NAME';
                        }}
                      />
                      <p className="text-gray-500 mt-1 text-xs">
                        Max 15 characters
                      </p>
                    </div>

                    <div>
                      <label
                        htmlFor="player-number"
                        className="text-gray-700 mb-2 block text-sm font-medium"
                      >
                        Jersey Number
                      </label>
                      <input
                        type="number"
                        id="player-number"
                        className="border-gray-300 placeholder:text-gray-400 w-full rounded-lg border px-4 py-3 transition-colors focus:border-primary focus:ring-2 focus:ring-primary"
                        placeholder="Enter number (0-99)"
                        min="0"
                        max="99"
                        onChange={(e) => {
                          const number = e.target.value;
                          const name =
                            (
                              document.getElementById(
                                'player-name',
                              ) as HTMLInputElement
                            )?.value.toUpperCase() || '';
                          setCustom(
                            name && number
                              ? `${name} - ${number}`
                              : name || number,
                          );
                          // Update preview
                          const numberPreview =
                            document.getElementById('number-preview');
                          if (numberPreview)
                            numberPreview.textContent = number || '00';
                        }}
                      />
                      <p className="text-gray-500 mt-1 text-xs">
                        Numbers 0-99 only
                      </p>
                    </div>

                    {/* Preview Section */}
                    <div className="border-gray-200 rounded-lg border-2 border-dashed bg-white p-4">
                      <h4 className="text-gray-700 mb-3 flex items-center gap-2 text-sm font-medium">
                        <span>Live Preview</span>
                        <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-800">
                          REAL-TIME
                        </span>
                      </h4>

                      {/* Jersey Back Simulation */}
                      <div
                        className="relative mx-auto h-60 w-48 overflow-hidden rounded-lg"
                        style={{
                          background:
                            'linear-gradient(145deg, #1a1a1a 0%, #2d2d2d 50%, #1a1a1a 100%)',
                        }}
                      >
                        {/* Jersey Texture */}
                        <div
                          className="absolute inset-0 opacity-10"
                          style={{
                            backgroundImage:
                              'repeating-linear-gradient(45deg, transparent, transparent 2px, rgba(255,255,255,0.1) 2px, rgba(255,255,255,0.1) 4px)',
                          }}
                        />

                        {/* Jersey Seams */}
                        <div className="bg-gray-600 absolute inset-y-0 left-1/2 w-px -translate-x-px opacity-30" />
                        <div className="bg-gray-600 absolute inset-x-0 top-1/3 h-px opacity-20" />

                        {/* Player Name */}
                        <div className="absolute inset-x-0 top-8 text-center">
                          <div
                            className="text-sm font-bold tracking-[0.2em] text-white drop-shadow-lg"
                            id="name-preview"
                            style={{
                              textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
                            }}
                          >
                            PLAYER NAME
                          </div>
                        </div>

                        {/* Jersey Number */}
                        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                          <div
                            className="text-6xl font-black leading-none text-white drop-shadow-2xl"
                            id="number-preview"
                            style={{
                              textShadow:
                                '3px 3px 6px rgba(0,0,0,0.9), 0 0 20px rgba(255,255,255,0.1)',
                            }}
                          >
                            00
                          </div>
                        </div>

                        {/* Jersey Brand/Logo Area */}
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
                          <div className="text-gray-400 text-xs tracking-wider opacity-60">
                            QYVE
                          </div>
                        </div>
                      </div>

                      <p className="text-gray-500 mt-3 text-center text-xs">
                        🏆 Exactly how it will look on your jersey back
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div>
              <div>
                <p className="mb-5 text-xl">Available colors</p>
                <div className="mb-5 flex flex-wrap gap-2">
                  {product_colors.map((pc, index) => (
                    <div
                      key={`${pc.product_id}-${pc.id}-${pc.color}`}
                      className={`relative ${
                        activeColor === index ? 'border-2 border-primary' : ''
                      } aspect-[4/3] h-[50px] overflow-hidden rounded-lg`}
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
                          // console.log(`Chosen pId: ${id}-${selectedId}`);
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
            className="flex w-full items-center gap-1 border-2  bg-black text-white transition-all hover:border-primary hover:bg-white hover:text-black active:scale-95 active:text-white"
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
