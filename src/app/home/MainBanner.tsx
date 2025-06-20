'use client';

import 'aos/dist/aos.css';

import AOS from 'aos';
import { useEffect } from 'react';

const MainBanner = () => {
  useEffect(() => {
    AOS.init({ duration: 2000, once: true }); // `once: true` = animates only on first scroll
  }, []);
  return (
    <div className="relative h-[600px] w-full overflow-hidden">
      <video autoPlay loop muted playsInline className="size-full object-cover">
        <source src="/videos/qyve_video.mp4" type="video/mp4" />
      </video>

      <div className="absolute inset-0 z-10 bg-black bg-opacity-50" />

      <div
        // data-aos="fade-up"
        className="absolute inset-0 left-1/2 top-1/2 z-20 flex w-[50%] -translate-x-1/2 -translate-y-1/2 flex-col items-center  justify-center font-bold"
      >
        <div className="text-center">
          <h1 className="font-myFont text-3xl italic text-white md:text-4xl lg:text-6xl">
            WELCOME TO YOUR JOURNEY
          </h1>
          <p className="font-myFontLight text-lg italic text-white md:text-xl  lg:text-2xl">
            #OwnYourJourney
          </p>
        </div>
      </div>
    </div>
  );
};

export default MainBanner;
