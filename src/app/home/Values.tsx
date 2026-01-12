import Image from 'next/image';
import Link from 'next/link';
import { FaCheckCircle } from 'react-icons/fa';

const Values = () => {
  return (
    <section className="bg-white py-16">
      <div className="container mx-auto px-4">
        <div className="text-center">
          {/* <span className="mb-4 inline-block text-sm font-semibold uppercase tracking-wider text-primary">
            Our Mission
          </span> */}
          <h2 className="mb-4 text-3xl font-bold text-black md:text-4xl">
            What We Stand For
          </h2>
          {/* <p className="mx-auto max-w-2xl text-gray-600">
            Malaysia has incredible futsal talent. World-class skills, tactical intelligence, 
            and passion for the game. We&apos;re here to give them gear that matches their potential.
          </p> */}
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          <div className="border-gray-100 bg-gray-50 group rounded-2xl border p-8 transition-all hover:border-primary/30 hover:shadow-lg">
            {/* <div className="mb-6 flex size-16 items-center justify-center rounded-full bg-primary/10 text-3xl transition-all group-hover:bg-primary/20">
              🎯
            </div> */}
            <h3 className="mb-3 text-xl font-bold text-black">
              Recognize Local Talent
            </h3>
            <p className="text-gray-600 mb-4">
              Malaysian players have skills and futsal IQ that rival the best in
              Asia. We see it every week on courts across the country. It&apos;s
              time the world sees it too.
            </p>
            <ul className="text-gray-500 space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <FaCheckCircle className="rounded-full bg-black text-primary" />
                Spotlight local athletes
              </li>
              <li className="flex items-center gap-2">
                <FaCheckCircle className="rounded-full bg-black text-primary" />
                Share Malaysian futsal stories
              </li>
              <li className="flex items-center gap-2">
                <FaCheckCircle className="rounded-full bg-black text-primary" />
                Build a community of players
              </li>
            </ul>
          </div>

          {/* <div className="group rounded-2xl border border-gray-100 bg-gray-50 p-8 transition-all hover:border-primary/30 hover:shadow-lg">
            <div className="mb-6 flex size-16 items-center justify-center rounded-full bg-primary/10 text-3xl transition-all group-hover:bg-primary/20">
              // 🏭
            </div>
            <h3 className="mb-3 text-xl font-bold text-black">Made in Malaysia</h3>
            <p className="mb-4 text-gray-600">
              Designed by Malaysians who play the game. Assembled right here in Malaysia. 
              Every pair supports local jobs and craftsmanship.
            </p>
            <ul className="space-y-2 text-sm text-gray-500">
              <li className="flex items-center gap-2">
                <FaCheckCircle className='text-primary bg-black rounded-full'/>Designed by local players
              </li>
              <li className="flex items-center gap-2">
                <FaCheckCircle className='text-primary bg-black rounded-full'/>Assembled in Malaysia
              </li>
              <li className="flex items-center gap-2">
                <FaCheckCircle className='text-primary bg-black rounded-full'/>Quality without import markup
              </li>
            </ul>
          </div> */}

          <div className="border-gray-100 bg-gray-50 group rounded-2xl border p-8 transition-all hover:border-primary/30 hover:shadow-lg">
            {/* <div className="mb-6 flex size-16 items-center justify-center rounded-full bg-primary/10 text-3xl transition-all group-hover:bg-primary/20">
              🚀
            </div> */}
            <h3 className="mb-3 text-xl font-bold text-black">
              Elevate the Scene
            </h3>
            <p className="text-gray-600 mb-4">
              We&apos;re not just selling shoes — we&apos;re part of a movement
              to push Malaysian futsal forward, from local courts to competitive
              leagues.
            </p>
            <ul className="text-gray-500 space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <FaCheckCircle className="rounded-full bg-black text-primary" />
                Support local tournaments
              </li>
              <li className="flex items-center gap-2">
                <FaCheckCircle className="rounded-full bg-black text-primary" />
                Partner with futsal communities
              </li>
              <li className="flex items-center gap-2">
                <FaCheckCircle className="rounded-full bg-black text-primary" />
                Grow the game together
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 rounded-2xl bg-black p-8 md:p-12">
          <div className="flex flex-col items-center gap-8 md:flex-row">
            <div className="relative aspect-square w-full overflow-hidden rounded-xl md:w-1/3">
              <Image
                src="/pbs.jpg"
                alt="Malaysian Futsal Community"
                fill
                className="object-cover"
              />
            </div>
            <div className="flex-1 text-center md:text-left">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2">
                <span className="text-lg">🇲🇾</span>
                <span className="text-sm font-semibold text-primary">
                  FROM MALAYSIA, FOR MALAYSIA
                </span>
              </div>
              <h3 className="mb-4 text-2xl font-bold text-white md:text-3xl">
                Join the Movement
              </h3>
              <p className="mb-6 text-white/70">
                Every purchase supports local athletes, local jobs, and the
                future of Malaysian futsal.
              </p>
              <Link
                href="/products/subzero"
                className="inline-block rounded-full bg-primary px-8 py-3 font-bold text-black transition-all hover:scale-105 hover:bg-white"
              >
                Shop Subzero
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Values;
