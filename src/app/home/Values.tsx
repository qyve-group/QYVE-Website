// 'use client';

// import AOS from 'aos';
// import 'aos/dist/aos.css';
// import { useEffect } from 'react';

import Image from 'next/image';

const Values = () => {
  // useEffect(() => {
  //   if (window.innerWidth <= 768) {
  //     AOS.init({
  //       once: true,
  //     });
  //   } else {
  //     // Remove data-aos attributes to prevent animations
  //     document.querySelectorAll('[data-aos]').forEach((el) => {
  //       el.removeAttribute('data-aos');
  //     });
  //   }
  // }, []);

  return (
    <div>
      <div className="mt-10 grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 ">
        {[
          {
            src: '/pbs.jpg',
            alt: 'PBS Picture',
            text: `Our community is the centerpoint of our brand. Everything starts
      with the people who wear our gear. We believe in cherishing
      real stories, real struggles, and real feedback.`,
          },
          {
            src: '/qyveplus.png',
            alt: 'Qyve+',
            text: `QYVE+ is where data meets purpose. It's our upcoming tool to help athletes understand, grow, and play with intention—powered by the numbers that matter`,
          },
          {
            src: '/firstqyve.png',
            alt: 'Jersey Picture',
            text: `QYVE Infinitus is where it all begins. Our first product, made for players who deserve a local brand they can stand behind. There’s more coming — stay ready.`,
          },
          {
            src: '/jersey_pic.jpg',
            alt: 'Jersey Picture',
            text: `We are proudly born in Malaysia and shaped by Southeast
      Asia's unique style of play, climate, and culture.`,
          },
          /* eslint-disable react/no-array-index-key */
        ].map(({ src, alt, text }, i) => (
          // eslint-disable-next-line react/no-array-index-key
          <div
            key={i}
            className="group relative aspect-[3/4] w-full overflow-hidden"
          >
            <Image fill src={src} alt={alt} className="object-cover" />
            <div
              // data-aos="fade-up"
              className="absolute inset-0 bg-black bg-opacity-30 transition-all duration-300 group-hover:bg-black group-hover:bg-opacity-70"
            />
            <div
              // data-aos="fade-up"
              className="absolute top-0 left-2 right-2 text-sm inset-0 text-white opacity-0 transition-all duration-700 group-hover:translate-y-[30%] group-hover:opacity-100 sm:text-base"
            >
              <p className="text-shadow-md">{text}</p>
            </div>
          </div>
        ))}
      </div>
      {/* <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        <div className="relative w-full h-[700px] overflow-hidden group">
          <Image
            fill
            src={'/pbs.jpg'}
            alt={'PBS Picture'}
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-30 group-hover:bg-black group-hover:bg-opacity-70"></div>
          <div className="absolute inset-0 text-white px-5 transform translate-y-0 opacity-0 group-hover:translate-y-[40%] group-hover:opacity-100 transition-all duration-700">
            <h1 className="">
              Our community is the centerpoint of our brand. Everything starts
              with the people who wear our gear. We believe in building
              alongside athletes—not just for them—because the best products
              come from real stories, real struggles, and real feedback.
            </h1>
          </div>
        </div>
        <div className="relative w-full h-[700px] overflow-hidden group">
          <Image
            fill
            src={'/jersey_pic_2.jpg'}
            alt={'Jersey Picture'}
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-30 group-hover:bg-black group-hover:bg-opacity-70"></div>
          <div className="absolute inset-0 text-white flex px-5 translate-y-0 opacity-0 group-hover:opacity-100 group-hover:translate-y-[35%] transition-all duration-700">
            <h1 className="">
              We blend performance insights with smart design. Through QYVE
              Plus, we aim to use athlete data to shape better products and
              unlock deeper understanding of the game. Paired with continuous
              innovation in materials and fit, our gear evolves with the
              athlete—never behind them.
            </h1>
          </div>
        </div>
        <div className="relative w-full h-[700px] overflow-hidden group">
          <Image
            fill
            src={'/jersey_pic.jpg'}
            alt={'Jersey Picture'}
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-30 group-hover:bg-black group-hover:bg-opacity-70"></div>
          <div className="absolute inset-0 text-white flex px-5 translate-y-0 opacity-0 group-hover:opacity-100 group-hover:translate-y-[35%] transition-all duration-700">
            <h1 className="">
              Every stitch, sole, and panel is made to move. We prioritize grip,
              comfort, and durability to ensure you play at your peak—whether
              you're chasing titles or chasing the next possession. QYVE gear
              does not just look good—it performs where it matters.
            </h1>
          </div>
        </div>
        <div className="relative h-[700px] w-full overflow-hidden group">
          <Image
            fill
            src={'/jersey_pic.jpg'}
            alt={'Jersey Picture'}
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-30 group-hover:bg-black group-hover:bg-opacity-70"></div>
          <div className="absolute inset-0 text-white flex px-5 translate-y-0 opacity-0 group-hover:opacity-100 group-hover:translate-y-[45%] transition-all duration-700">
            <h1 className="">
              We are proudly born in Malaysia and shaped by Southeast
              Asia&apos;s unique style of play, climate, and culture.
            </h1>
          </div>
        </div>
      </div> */}
    </div>
  );
};

export default Values;
