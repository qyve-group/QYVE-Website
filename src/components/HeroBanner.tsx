'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

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

export default function HeroBanner() {
  return (
    <Swiper
      modules={[Autoplay, Pagination]}
      autoplay={{ delay: 4000 }}
      loop
      pagination={{ clickable: true }}
      className="w-full h-[500px]"
    >
      {banners.map((banner, idx) => (
        <SwiperSlide key={idx}>
          <div
            className="relative w-full h-full bg-cover bg-center"
            style={{ backgroundImage: `url(${banner.image})` }}
          >
            <div className="absolute inset-0 bg-black/50 flex flex-col justify-center items-center text-white text-center p-4">
              <h2 className="text-4xl font-bold mb-2">{banner.title}</h2>
              <p className="text-lg mb-4">{banner.subtitle}</p>
              <button className="bg-white text-black px-6 py-2 rounded-full hover:bg-gray-200 transition">
                {banner.cta}
              </button>
            </div>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
