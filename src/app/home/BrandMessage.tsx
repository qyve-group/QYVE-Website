const BrandMessage = () => {
  return (
    <div className="container flex flex-col bg-white gap-5 items-center justify-center h-[400px]">
      <div>
        <h1 className="text-center lg:text-xl text-md">What are we?</h1>
      </div>

      <div>
        <h1 className="text-xl text-center lg:text-4xl">
          An innovative sports brand that blends <br />
          <span className="font-bold">performance</span>,
          <span className="font-bold"> lifestyle</span>, and
          <span className="font-bold"> affordability</span>
        </h1>
      </div>
    </div>
  );
};

export default BrandMessage;
