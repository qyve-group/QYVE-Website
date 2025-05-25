import Image from 'next/image';
import React from 'react';

import { footerBannerData } from '@/data/content';
import Heading from '@/shared/Heading/Heading';

// import ButtonPrimary from '../Button/ButtonPrimary';
// import next from 'next';

const FooterBanner = () => {
  return (
    // <div className="rounded-2xl bg-[url('/bgProducts.jpg')] bg-cover bg-center bg-no-repeat py-16 text-white">
    <div className="relative overflow-hidden rounded-2xl py-16 text-white">
      {/* Video Background */}
      {/* <video
        className="absolute inset-0 size-full object-cover"
        src="/videos/Footer_video.mp4"
        autoPlay
        loop
        muted
        playsInline
      /> */}

      {/* Overlay to darken the video if needed */}
      <div className="absolute inset-0 bg-black" />

      {/* Foreground content */}
      <div className="relative z-10">
        <Heading className="mx-auto mb-0 w-4/5 text-justify md:w-1/2" isCenter>
          {footerBannerData.heading}
        </Heading>
        <br />
        <p className="mx-auto w-4/5 text-justify md:w-1/2">
          {footerBannerData.description}
        </p>
        <br />
        <p className="mx-auto w-4/5 text-justify md:w-1/2">
          {footerBannerData.description2}
        </p>
        <div className="mt-10 flex items-center justify-center">
          {/* <ButtonPrimary sizeClass="px-6 py-4">More about us</ButtonPrimary> */}
          <Image src="/qyve-white.png" width={50} height={50} alt="Qyve logo" />
        </div>
      </div>
    </div>
  );
};

export default FooterBanner;
