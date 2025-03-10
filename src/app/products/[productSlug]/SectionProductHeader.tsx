"use client";

import type { StaticImageData } from "next/image";
import Image from "next/image";
import type { FC } from "react";
import React from "react";
import { BsBag } from "react-icons/bs";
import { GoDotFill } from "react-icons/go";
import { LuInfo } from "react-icons/lu";
import { MdStar } from "react-icons/md";
import { PiSealCheckFill } from "react-icons/pi";

import ImageShowCase from "@/components/ImageShowCase";
import ShoeSizeButton from "@/components/ShoeSizeButton";
import { shoeSizes } from "@/data/content";
import nike_profile from "@/images/nike_profile.jpg";
import ButtonCircle3 from "@/shared/Button/ButtonCircle3";
import ButtonPrimary from "@/shared/Button/ButtonPrimary";
import ButtonSecondary from "@/shared/Button/ButtonSecondary";
import Heading from "@/shared/Heading/Heading";

import { useDispatch } from "react-redux";
import { addToCart } from "@/store/cartSlice";

interface SectionProductHeaderProps {
  // shots: StaticImageData[];
  name: string;
  price: number;
  previous_price: number;
  image_cover: string;
  sizes: string[];
  id: number;
  // currentPrice: number;
  // rating: number;
  // pieces_sold: number;
  // reviews: number;
}

const SectionProductHeader: FC<SectionProductHeaderProps> = ({
  // shots,
  name,
  price,
  previous_price,
  image_cover,
  sizes,
  id,
  // currentPrice,
  // rating,
  // pieces_sold,
  // reviews,
  // image_cover,
}) => {
  const dispatch = useDispatch();

  const handleAddToCart = () => {
    dispatch(
      addToCart({
        id: name, // Assuming `shoeName` is unique; use a proper unique `id` if available
        name: name,
        price: price,
        // image: shots[0], // Assuming first image is the main product image
        quantity: 1,
      })
    );
  };
  // console.log("price:", price);
  return (
    <div className="items-stretch justify-between space-y-10 lg:flex lg:space-y-0">
      {/* <div className="basis-[50%]"><ImageShowCase shots={shots} /></div> */}
      <div className="basis-[50%]">
        <Image
          src={image_cover}
          alt={`${name} cover photo`}
          width={600}
          height={400}
        />
      </div>

      <div className="basis-[45%]">
        <Heading className="mb-0" isMain title="new arrival!">
          {name}
          {/* {id} */}
        </Heading>

        <div className="mb-10 flex items-center">
          <div className="flex items-center gap-1">
            <ButtonCircle3
              className="overflow-hidden border border-neutral-400"
              size="w-11 h-11"
            >
              <Image
                src={nike_profile}
                alt="nike_profile"
                className="h-full w-full object-cover"
              />
            </ButtonCircle3>
            <span className="font-medium">Nike</span>
            <PiSealCheckFill className="text-blue-600" />
          </div>
          <GoDotFill className="mx-3 text-neutral-500" />
          <div className="flex items-center gap-1">
            <MdStar className="text-yellow-400" />
            {/* <p className="text-sm">
              {rating}{" "}
              <span className="text-neutral-500">{`(${reviews} Reviews)`}</span>
            </p> */}
          </div>
          <GoDotFill className="mx-3 text-neutral-500" />
          {/* <p className="text-neutral-500">{`${pieces_sold} items sold`}</p> */}
        </div>

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
        {/* !!!!!!!!!!!!!!!!!!!!!!! */}
        {/* !!!!!!!!!!!!!!!!!!!!!!! */}
        {/* !!!!!!!!!!!!!!!!!!!!!!! */}
        {/* !!!!!!!!!!!!!!!!!!!!!!! */}

        {/* DO THE CONDITION FOR AVAILABLE SIZES HERE */}

        {/* !!!!!!!!!!!!!!!!!!!!!!! */}
        {/* !!!!!!!!!!!!!!!!!!!!!!! */}
        {/* !!!!!!!!!!!!!!!!!!!!!!! */}
        {/* !!!!!!!!!!!!!!!!!!!!!!! */}
        <div className="grid grid-cols-3 gap-3">
          {sizes.map((size) => (
            <ShoeSizeButton key={size} size={size} id={id} />
          ))}
          {/* {shoeSizes.map((size) => (
            <ShoeSizeButton key={size} size={size} />
          ))} */}
        </div>

        <div className="mt-5 flex items-center gap-5">
          <ButtonPrimary className="w-full">Buy Now</ButtonPrimary>
          <ButtonSecondary
            className="flex w-full items-center gap-1 border-2 border-primary text-primary"
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
