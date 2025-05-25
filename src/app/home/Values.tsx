import Image from 'next/image';

const Values = () => {
  return (
    <div>
      <div className="grid grid-cols-4 gap-4">
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
            {/* <h1 className="text-center max-w-xl text-3xl md:text-4xl font-semibold leading-relaxed tracking-wide drop-shadow-lg">
              Our community is the centerpoint of our brand. Everything starts
              with the people who wear our gear. We believe in building
              alongside athletes—not just for them—because the best products
              come from real stories, real struggles, and real feedback.
            </h1> */}
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
      </div>
      {/* <div className="grid grid-cols-2 bg-black text-white">
        <div className="grid grid-cols-4 bg-white">
          <div>
            <Image
              height={300}
              width={300}
              src={'/jersey_pic.jpg'}
              alt={'Jersey Picture'}
              className="w-full h-full object-contain"
            />
          </div>
          <div>
            <Image
              height={300}
              width={300}
              src={'/jersey_pic.jpg'}
              alt={'Jersey Picture'}
              className="w-full h-full object-contain"
            />
          </div>
          <div>
            <Image
              height={300}
              width={300}
              src={'/jersey_pic.jpg'}
              alt={'Jersey Picture'}
              className="w-full h-full object-contain"
            />
          </div>
          <div>
            <Image
              height={300}
              width={300}
              src={'/jersey_pic.jpg'}
              alt={'Jersey Picture'}
              className="w-full h-full object-contain"
            />
          </div>

        </div>
        <div className="bg-black h-[400px] flex items-center justify-center">
          <h1 className="text-center max-w-xl">
            Our community is the centerpoint of our brand. Everything starts
            with the people who wear our gear. We believe in building alongside
            athletes—not just for them—because the best products come from real
            stories, real struggles, and real feedback.
          </h1>
        </div>

        <div className="bg-black h-[400px] flex items-center justify-center">
          <h1 className="text-center max-w-xl">
            We blend performance insights with smart design. Through QYVE Plus,
            we aim to use athlete data to shape better products and unlock
            deeper understanding of the game. Paired with continuous innovation
            in materials and fit, our gear evolves with the athlete—never behind
            them.
          </h1>
        </div>
        <div className="bg-white h-[400px] flex items-center justify-center">
          <h1 className="text-center max-w-xl text-black">02</h1>
        </div>

        <div className="bg-white h-[400px] flex items-center justify-center">
          <h1 className="text-center max-w-xl text-black">03</h1>
        </div>
        <div className="bg-black h-[400px] flex items-center justify-center">
          <h1 className="text-center max-w-xl">
            Every stitch, sole, and panel is made to move. We prioritize grip,
            comfort, and durability to ensure you play at your peak—whether
            you're chasing titles or chasing the next possession. QYVE gear does
            not just look good—it performs where it matters.
          </h1>
        </div>

        <div className="bg-black h-[400px] flex items-center justify-center">
          <h1 className="text-center max-w-xl">
            We are proudly born in Malaysia and shaped by Southeast Asia&apos;s
            unique style of play, climate, and culture.
          </h1>
        </div>
        <div className="bg-white h-[400px] flex items-center justify-center">
          <h1 className="text-center max-w-xl text-black">04</h1>
        </div>
      </div> */}
    </div>
  );
};

export default Values;
