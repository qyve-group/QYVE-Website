'use client';

// import type { UUID } from 'crypto';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { FaCircle } from 'react-icons/fa6';

// import PromoTag from '@/components/PromoTag';
// import BootstrapCarousel from "@/components/Carousel";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  // CarouselNext,
  // CarouselPrevious,
} from '@/components/ui/carousel';
// import { supabase } from '@/libs/supabaseClient';
// import { headerSection } from "@/data/content";
// import shoe_box from "@/images/shoe_box.png";
import ButtonPrimary from '@/shared/Button/ButtonPrimary';

// import { headerSection } from '@/data/content';

// type Slide = {
//   id: UUID;
//   title: string;
//   heading: string;
//   description: string;
//   image_url: string;
//   cta_text: string;
//   is_active: boolean;
// };

const banners = [
  {
    id: 1,
    image: '/products/subzero/subzero_1.webp',
    heading: 'Subzero',
    title: 'Order now',
    subtitle:
      'Built for players who stays cool under pressure. Subzero is Malaysia-made and designed to dominate every futsal match.\n',
    cta: 'Buy Now',
    ctalink: '/products/subzero',
  },
  {
    id: 2,
    image: '/products/recovery_slides/recovery_slides_1.webp',
    heading: 'Recovery Slides',
    title: 'GET YOURS NOW',
    subtitle:
      'Give your feet a break after a futsal session—slip into recovery slides for ultimate comfort and faster recovery',
    cta: 'Get IT NOW!',
    ctalink: '/products/recovery_slides',
  },
];

const ShopHeader = () => {
  const [current, setCurrent] = useState(0);
  // const intervalTime = 5000;
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
    <div className="relative items-stretch gap-y-5 lg:flex lg:gap-5 lg:gap-y-0 ">
      <Carousel className=" w-full text-center">
        <CarouselContent
          style={{
            transform: `translateX(-${current * 100}%)`,
            transition: 'transform 0.4s ease-in-out',
          }}
        >
          {banners.map((banner) => (
            <CarouselItem
              key={banner.id}
              className="relative h-[500px] min-w-full overflow-hidden"
            >
              {/* Background Image */}
              <Image
                src={banner.image}
                alt={banner.title}
                fill
                className="object-cover object-center"
                priority
              />

              {/* Dark Overlay for better text contrast */}
              <div className="absolute inset-0 bg-black bg-opacity-50" />

              {/* Text Content */}
              <div className="absolute inset-0 z-10 flex flex-col items-center justify-center px-6 text-center">
                <h4 className="mb-4 font-myFontSS text-lg text-white md:text-2xl">
                  {/* {banner.title} */}
                </h4>
                <h1 className="font-myFont text-3xl leading-tight text-white drop-shadow-md md:text-6xl">
                  {banner.heading}
                </h1>
                <p className="mt-6 max-w-2xl text-sm text-white md:text-lg">
                  {banner.subtitle.split('\n').map((line, idx) => (
                    // eslint-disable-next-line react/no-array-index-key
                    <React.Fragment key={idx}>
                      {line}
                      <br />
                    </React.Fragment>
                  ))}
                </p>
                <div className="mt-8">
                  <ButtonPrimary
                    sizeClass="px-5 py-3"
                    onClick={() => router.push(banner.ctalink)}
                  >
                    Buy Now
                  </ButtonPrimary>
                </div>
              </div>
            </CarouselItem>
          ))}
          {/* {banners.map((banner) => (
            <CarouselItem key={banner.id} className="min-w-full">
              <Image
                src={banner.image}
                alt={banner.title}
                fill
                className="w-full rounded-2xl object-cover"
              />

              <div className="absolute inset-0 bg-black bg-opacity-50" />

              <div className="h-full basis-[68%] items-center space-y-10 bg-black p-5 md:flex md:space-y-0">
                <div className="flex basis-[63%] flex-col justify-between">
                  <div>
                    <h4 className="mb-5 text-xl font-medium text-white">
                      {banner.title}
                    </h4>
                    <h1
                      className="text-[50px] font-medium tracking-tight text-white"
                      style={{ lineHeight: '1em' }}
                    >
                      {banner.heading}
                    </h1>
                    <p className="my-10 text-white">
                      {banner.subtitle.split('\n').map((line, idx) => (
                         eslint-disable react/no-array-index-key 
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
          ))} */}
          {/* <div className="bg-blue-300">
            <h1>Test</h1>
          </div> */}

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
        <div
          className="bg-grey absolute left-[50%] top-[90%] z-20 flex w-max items-center justify-center gap-10 px-2 opacity-100"
          style={{ transform: 'translateX(-50%)' }}
        >
          {/* <div className="flex items-center justify-center space-x-4" /> */}
          <div>
            <button
              type="button"
              onClick={prevSlide}
              className="text-3xl text-white"
            >
              ←
            </button>
          </div>
          <div className="">
            <div className="flex gap-2 text-black">
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
                /* eslint-disable react/no-array-index-key */
                <div
                  key={`${idx}_${idx + 1}`}
                  className={`flex items-center rounded transition-all duration-100 ${
                    current === idx
                      ? 'text-md scale-80 font-bold text-primary'
                      : 'text-md scale-50 text-white'
                  }`}
                >
                  {/* {idx + 1} */}
                  <FaCircle />
                </div>
              ))}
            </div>
          </div>
          <div>
            <button
              type="button"
              onClick={nextSlide}
              className="text-3xl text-white"
            >
              →
            </button>
          </div>
        </div>
      </Carousel>
      {/* <div className="mt-5 basis-[30%] lg:mt-0">
        <PromoTag />
      </div> */}
    </div>
  );
};

export default ShopHeader;
