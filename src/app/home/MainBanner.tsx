'use client';

import { useEffect } from 'react';

import AOS from 'aos';
import 'aos/dist/aos.css';

const MainBanner = () => {
  useEffect(() => {
    AOS.init({ duration: 2000, once: true }); // `once: true` = animates only on first scroll
  }, []);
  return (
    <div className="relative w-full overflow-hidden h-[600px]">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="w-full h-full object-cover"
      >
        <source src="videos/qyve_video.mp4" type="video/mp4" />
      </video>

      <div className="absolute inset-0 bg-black bg-opacity-50 z-10" />

      <div
        // data-aos="fade-up"
        className="absolute flex flex-col inset-0 z-20 font-bold left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 w-[50%]  items-center justify-center"
      >
        <div className="text-center">
          <h1 className="font-myFont italic text-white text-3xl md:text-4xl lg:text-6xl">
            WELCOME TO YOUR JOURNEY
          </h1>
          <p className="font-myFontLight italic text-white text-lg md:text-xl  lg:text-2xl">
            #OwnYourJourney
          </p>
        </div>
      </div>
    </div>
  );
};

export default MainBanner;
