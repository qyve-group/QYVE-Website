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

      <div className="absolute flex inset-0 z-20 items-center justify-center">
        <h1
          data-aos="fade-up"
          className="text-white text-xl md:text-2xl lg:text-4xl font-bold"
        >
          Welcome to Your Journey
        </h1>
      </div>
    </div>
  );
};

export default MainBanner;
