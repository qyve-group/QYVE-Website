import Link from 'next/link';

const SubZeroCTA = () => {
  return (
    <section className="bg-[#1a2942] py-16 md:py-20">
      <div className="container mx-auto px-4 text-center">
        <h2 className="mb-8 text-3xl font-light text-white md:text-4xl">
          Every motion sharper. Every touch cleaner.
          <br />
          Every moment,{' '}
          <span className="font-semibold">under control.</span>
        </h2>

        <Link
          href="/products/subzero"
          className="inline-block rounded-full bg-white px-12 py-4 text-lg font-semibold text-gray-900 transition-all hover:bg-gray-100 hover:scale-105"
        >
          CHECK OUT SUBZERO
        </Link>
      </div>
    </section>
  );
};

export default SubZeroCTA;
