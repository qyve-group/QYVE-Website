const MainBanner = () => {
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

      <div className="absolute inset-0 bg-black bg-opacity-50 z-10"></div>

      <div className="absolute flex inset-0 z-20 items-center justify-center">
        <h1 className="text-white text-xl lg:text-4xl font-bold md:text-2xl">
          Welcome to Your Journey
        </h1>
      </div>
    </div>
  );
};

export default MainBanner;
