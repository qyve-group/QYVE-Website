const BrandMessage = () => {
  return (
    <div className="container flex h-[400px] flex-col items-center justify-center gap-5 bg-black ">
      <div>
        <h1 className="text-md text-center font-myFontEmOne text-primary lg:text-4xl">
          What are we?
        </h1>
      </div>

      <div>
        <h1 className="text-center font-myFontSSBook text-xl text-white lg:text-4xl">
          An innovative sports brand that blends <br />
          <span className="font-bold ">performance</span>,
          <span className="font-bold"> lifestyle</span>, and
          <span className="font-bold"> affordability</span>
        </h1>
      </div>
    </div>
  );
};

export default BrandMessage;
