"use client";
import Image from "next/image";
import React from "react";

import PromoTag from "@/components/PromoTag";
import { headerSection } from "@/data/content";
import shoe_box from "@/images/shoe_box.png";
import ButtonPrimary from "@/shared/Button/ButtonPrimary";
import { supabase } from "@/libs/supabaseClient";
// import BootstrapCarousel from "@/components/Carousel";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { useEffect, useState } from "react";
import { UUID } from "crypto";

type Slide = {
  id: UUID;
  title: string;
  heading: string;
  description: string;
  image_url: string;
  cta_text: string;
  is_active: boolean;
}

const banners = [
  {
    image: '/banner1.jpg',
    title: '🔥 Summer Drop Just Landed',
    subtitle: 'Explore the latest fits for the season.',
    cta: 'Shop Now',
  },
  {
    image: '/banner2.jpg',
    title: '⚡ Flash Sale - 20% Off',
    subtitle: 'Limited time offer, ends midnight!',
    cta: 'Grab Deals',
  },
];


const SectionHeader = () => {
  const [current, setCurrent] = useState(0);
  const intervalTime = 5000; // 5 seconds
  // const slides = [0, 1, 2]; // Can be objects if dynamic
  const [slides, setSlides] = useState<Slide[] | null>([]);
  
  
  // Auto-advance every few seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => {
        const total = slides?.length ?? 1;
        return (prev + 1) % total;
      });
    }, intervalTime);
  
    return () => clearInterval(interval); // Cleanup on unmount
  }, [slides, intervalTime]);

  useEffect(() => {

    const fetchCarousel = async() => {
      const {data: slides } = await supabase.from("carousel_banner").select("*").eq("is_active", true);

      console.log("slides: ", slides);
      setSlides(slides);
    }
    fetchCarousel();
    

  }, [])

  

  return (
    <div className="container items-stretch gap-y-5 lg:flex lg:gap-5 lg:gap-y-0">
      <Carousel className="w-3/4 px-6 text-center">
        <CarouselContent style={{ transform: `translateX(-${current * 100}%)`, transition: "transform 0.5s ease-in-out" }}>
          {slides?.map((slide) => (
            <CarouselItem key={slide.id} className="min-w-full">
              <div className="basis-[68%] items-center space-y-10 rounded-2xl bg-gray p-5 md:flex md:space-y-0">
                {/* Left content */}
                <div className="basis-[63%] flex flex-col justify-between">
                  <div>
                    <h4 className="mb-5 text-xl font-medium text-primary">
                      {slide.title}
                    </h4>
                    <h1 className="text-[50px] font-medium tracking-tight" style={{ lineHeight: "1em" }}>
                      {slide.heading}
                    </h1>
                    <p className="my-10 w-[80%] text-neutral-500">
                      {slide.description}
                    </p>
                    <ButtonPrimary sizeClass="px-5 py-4">View Product</ButtonPrimary>
                  </div>

                  {/* Arrows & Pagination */}
                  <div className="mt-10 flex flex-col items-center space-y-3">
                    <div className="flex items-center justify-center space-x-4">
                      {/* <button onClick={() => setCurrent((current - 1 + slides.length) % slides.length)}>
                        <CarouselPrevious />
                      </button> */}

                      <div className="flex space-x-2">
                        {slides.map((_, idx) => (
                          <div
                            key={idx}
                            className={`h-2 w-2 rounded-full transition-all duration-300 ${
                              idx === current ? "bg-primary scale-125" : "bg-gray-400"
                            }`}
                          />
                        ))}
                      </div>

                      {/* <button onClick={() => setCurrent((current + 1) % slides.length)}>
                        <CarouselNext />
                      </button> */}
                    </div>
                  </div>
                </div>

                {/* Right image */}
                <div className="basis-[37%]">
                  <Image src={slide.image_url} alt={slide.heading} width={500} height={500} className="w-full h-[400px]" />
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

        {/* <Carousel className="w-3/4 px-6 text-center">
          <CarouselContent>
            <CarouselItem>
              <div className="basis-[68%] items-center space-y-10 rounded-2xl bg-gray p-5 md:flex md:space-y-0">
                <div className="basis-[63%] flex flex-col justify-between">
                  <div>
                    <h4 className="mb-5 text-xl font-medium text-primary">
                      {headerSection.title}
                    </h4>
                    <h1
                      className="text-[50px] font-medium tracking-tight"
                      style={{ lineHeight: "1em" }}
                    >
                      {headerSection.heading}
                    </h1>
                    <p className="my-10 w-[80%] text-neutral-500">
                      {headerSection.description}
                    </p>
                    <ButtonPrimary sizeClass="px-5 py-4">View Product</ButtonPrimary>
                  </div>

                  <div className="mt-10 flex flex-col items-center space-y-3">
                    <div className="flex items-center justify-center space-x-4">

                      <div className="flex space-x-2">
                        {[0, 1, 2].map((i) => (
                          <div
                            key={i}
                            className={`h-2 w-2 rounded-full ${
                              i === 0 ? 'bg-primary' : 'bg-gray-400'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="basis-[37%]">
                  <Image src={shoe_box} alt="shoe box" className="w-full" />
                </div>
              </div>
            </CarouselItem>
          </CarouselContent>
        </Carousel> */}

      <div className="mt-5 basis-[30%] lg:mt-0">
        <PromoTag />
      </div>
    </div>
  );
};

export default SectionHeader;
