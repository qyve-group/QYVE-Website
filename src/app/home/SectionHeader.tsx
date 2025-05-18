'use client';

import type { UUID } from 'crypto';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';

// import PromoTag from '@/components/PromoTag';
// import BootstrapCarousel from "@/components/Carousel";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  // CarouselNext,
  // CarouselPrevious,
} from '@/components/ui/carousel';
import { supabase } from '@/libs/supabaseClient';
// import { headerSection } from "@/data/content";
// import shoe_box from "@/images/shoe_box.png";
import ButtonPrimary from '@/shared/Button/ButtonPrimary';
import { useRouter } from 'next/navigation';
// import { headerSection } from '@/data/content';

type Slide = {
  id: UUID;
  title: string;
  heading: string;
  description: string;
  image_url: string;
  cta_text: string;
  is_active: boolean;
};

const banners = [
  {
    id: 1,
    image: '/white-socks-ps.jpg',
    heading: '🔥 QYVE ProGrip Socks',
    title: 'New DROP!',
    subtitle: 'Stay locked in\nNo slips, just goals.',
    cta: 'Buy Now',
    ctalink: '/products/beige_slides',
  },
  {
    id: 2,
    image: '/slides_life.jpg',
    heading: '⚡ QYVE Recovery Slides',
    title: 'Coming Soon',
    subtitle:
      'Give your feet a break after a futsal session—slip into recovery slides for ultimate comfort and faster recovery',
    cta: 'Get IT NOW!',
    ctalink: '/products/beige_slides',
  },
];

const SectionHeader = () => {
  const [current, setCurrent] = useState(0);
  const intervalTime = 5000; // 5 seconds
  // const slides = [0, 1, 2]; // Can be objects if dynamic
  // const [slides, setSlides] = useState<Slide[] | null>([]);
  const total = banners.length;
  const prevSlide = () =>
    setCurrent((prev) => (prev === 0 ? total - 1 : prev - 1));
  const nextSlide = () =>
    setCurrent((prev) => (prev === total - 1 ? 0 : prev + 1));

  // Auto-advance every few seconds
  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     setCurrent((prev) => {
  //       const total = slides?.length ?? 1;
  //       return (prev + 1) % total;
  //     });
  //   }, intervalTime);

  //   return () => clearInterval(interval); // Cleanup on unmount
  // }, [slides, intervalTime]);

  // useEffect(() => {
  //   const fetchCarousel = async () => {
  //     const { data: slidesData } = await supabase
  //       .from('carousel_banner')
  //       .select('*')
  //       .eq('is_active', true);

  //     // console.log*('slides: ', slides);
  //     setSlides(slidesData);
  //   };
  //   fetchCarousel();
  // }, []);

  const router = useRouter();

  return (
    <div className="container relative items-stretch gap-y-5 lg:flex lg:gap-5 lg:gap-y-0">
      <Carousel className="w-3/4 text-center w-full">
        <CarouselContent
          style={{
            transform: `translateX(-${current * 100}%)`,
            transition: 'transform 0.4s ease-in-out',
          }}
        >
          {banners.map((banner) => (
            <CarouselItem key={banner.id} className="min-w-full">
              <div className="h-full basis-[68%] items-center space-y-10 rounded-2xl bg-gray p-5 md:flex md:space-y-0">
                <div className="flex basis-[63%] flex-col justify-between">
                  <div>
                    <h4 className="mb-5 text-xl font-medium text-primary">
                      {banner.title}
                    </h4>
                    <h1
                      className="text-[50px] font-medium tracking-tight"
                      style={{ lineHeight: '1em' }}
                    >
                      {banner.heading}
                    </h1>
                    <p className="my-10 text-neutral-500">
                      {banner.subtitle.split('\n').map((line, idx) => (
                        <React.Fragment key={idx}>
                          {line}
                          <br />
                        </React.Fragment>
                      ))}
                    </p>
                    <ButtonPrimary
                      sizeClass="px-5 py-4"
                      onClick={() => {
                        router.push(banner.ctalink);
                      }}
                    >
                      Buy Now
                    </ButtonPrimary>
                  </div>

                  {/* Arrows & Pagination */}
                  {/* <div className="mt-10 flex flex-col items-center space-y-3 bg-blue-600"> */}
                  <div className="mt-10 flex items-center gap-10 rounded-2xl bg-grey w-max mx-auto px-2 bg-yellow-400">
                    {/* <div className="flex items-center justify-center space-x-4" /> */}
                    <div>
                      <button onClick={prevSlide} className="text-xl">
                        ←
                      </button>
                    </div>
                    <div className="">
                      <div className="text-black flex gap-2">
                        {/* {banners.map((_, idx) =>
                          current === idx ? (
                            <div className="font-bold text-lg text-primary scale-100">
                              {idx + 1}
                            </div>
                          ) : (
                            <div className="text-lg scale-75">{idx + 1}</div>
                          ),
                          
                        )} */}
                        {banners.map((_, idx) => (
                          <div
                            key={`${idx}_${idx + 1}`}
                            className={`flex items-center rounded transition-all duration-1000 ${
                              current === idx
                                ? 'font-bold text-lg text-primary scale-100'
                                : 'text-lg scale-75 text-gray-800'
                            }`}
                          >
                            {idx + 1}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <button onClick={nextSlide} className="text-xl">
                        →
                      </button>
                    </div>
                  </div>
                </div>
                <div className="basis-[37%]">
                  <Image
                    src={banner.image}
                    alt={banner.title}
                    width={500}
                    height={500}
                    className="w-full rounded-2xl"
                  />
                </div>
              </div>
            </CarouselItem>
          ))}

          {/* {slides?.map((slide) => (
            <CarouselItem key={slide.id} className="min-w-full">
              <div className="h-full basis-[68%] items-center space-y-10 rounded-2xl bg-gray p-5 md:flex md:space-y-0">
                <div className="flex basis-[63%] flex-col justify-between">
                  <div>
                    <h4 className="mb-5 text-xl font-medium text-primary">
                      {slide.title}
                    </h4>
                    <h1
                      className="text-[50px] font-medium tracking-tight"
                      style={{ lineHeight: '1em' }}
                    >
                      {slide.heading}
                    </h1>
                    <p className="my-10 w-4/5 text-neutral-500">
                      {slide.description}
                    </p>
                    <ButtonPrimary sizeClass="px-5 py-4">Buy Now</ButtonPrimary>
                  </div>

                  <div className="mt-10 flex flex-col items-center space-y-3">
                    <div className="flex items-center justify-center space-x-4" />
                  </div>
                </div>

                <div className="basis-[37%]">
                  <Image
                    src={slide.image_url}
                    alt={slide.heading}
                    width={500}
                    height={500}
                    className="w-full"
                  />
                </div>
              </div>
            </CarouselItem>
          ))} */}
        </CarouselContent>
        {/* <div className="absolute bottom-0 left-1/2 z-10 flex -translate-x-1/2 -translate-y-3 justify-center space-x-2">
          {slides?.map((slide, idx) => (
            <div
              key={slide.id}
              className={`size-2 rounded-full transition-all duration-300 ${
                idx === current ? 'scale-125 bg-primary' : 'bg-blue-800'
              }`}
            />
          ))}
        </div> */}
      </Carousel>
      {/* <div className="mt-5 basis-[30%] lg:mt-0">
        <PromoTag />
      </div> */}
    </div>
  );
};

export default SectionHeader;
