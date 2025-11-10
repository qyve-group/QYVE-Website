const ProudlyMalaysian = () => {
  return (
    <section className="bg-white py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="space-y-12 text-center">
          <h2 className="text-4xl font-bold italic text-black md:text-5xl">
            PROUDLY MALAYSIAN
          </h2>

          <div className="text-gray-700 mx-auto max-w-4xl space-y-4 text-lg">
            <p>
              Every pair of SubZero is designed by a proud Malaysian, carrying
              the creativity and spirit of our home onto the futsal court.
              Behind every stitch and every cut lies Malaysian craftsmanship –
              shoes assembled entirely in Malaysia, built with the care and
              precision our makers are known for.
            </p>
            <p className="font-semibold">
              This is more than just a futsal shoe; it is proof that Malaysia
              can create world-class performance gear.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <div className="bg-gray-200 aspect-square w-full rounded-lg" />
            <div className="bg-gray-200 aspect-square w-full rounded-lg" />
            <div className="bg-gray-200 aspect-square w-full rounded-lg" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProudlyMalaysian;
