const BrandMessage = () => {
  return (
    <div className="container flex min-h-[400px] flex-col items-center justify-center gap-6 bg-black py-16">
      <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2">
        <span className="text-xl">🇲🇾</span>
        <span className="text-sm font-semibold text-primary">
          BORN IN MALAYSIA
        </span>
      </div>

      <div>
        <h1 className="text-center font-myFontSSBook text-xl text-white lg:text-4xl">
          Malaysia&apos;s first homegrown futsal brand,
          <br />
          <span className="font-bold text-primary">built by players</span>,
          <span className="font-bold text-primary"> for players</span>
        </h1>
      </div>

      <p className="max-w-2xl text-center text-sm text-white/60 lg:text-base">
        We blend performance, lifestyle, and affordability — all while keeping
        production local and supporting the Malaysian futsal community.
      </p>
    </div>
  );
};

export default BrandMessage;
