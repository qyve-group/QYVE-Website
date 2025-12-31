const ProudlyMalaysian = () => {
  return (
    <section className="bg-black py-16">
      <div className="container mx-auto px-4">
        <div className="mb-10 text-center">
          <div className="mb-4 inline-flex items-center gap-3 rounded-full bg-white/10 px-6 py-3">
            <span className="text-3xl">🇲🇾</span>
            <span className="text-lg font-bold text-primary">PROUDLY MALAYSIAN</span>
          </div>
          <h2 className="mb-4 text-3xl font-bold text-white md:text-4xl">
            Built by Malaysians, for Malaysians
          </h2>
          <p className="mx-auto max-w-2xl text-white/70">
            QYVE is Malaysia&apos;s first homegrown futsal shoe brand. We understand local courts, 
            local weather, and the Malaysian style of play.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border border-white/10 bg-white/5 p-6 text-center transition-all hover:border-primary/50 hover:bg-white/10">
            <div className="mb-3 text-4xl">🏭</div>
            <h3 className="mb-2 text-lg font-bold text-white">100% Local</h3>
            <p className="text-sm text-white/60">
              Designed and produced entirely in Malaysia
            </p>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/5 p-6 text-center transition-all hover:border-primary/50 hover:bg-white/10">
            <div className="mb-3 text-4xl">⚽</div>
            <h3 className="mb-2 text-lg font-bold text-white">Court Tested</h3>
            <p className="text-sm text-white/60">
              Tested on Malaysian futsal courts nationwide
            </p>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/5 p-6 text-center transition-all hover:border-primary/50 hover:bg-white/10">
            <div className="mb-3 text-4xl">🌡️</div>
            <h3 className="mb-2 text-lg font-bold text-white">Climate Ready</h3>
            <p className="text-sm text-white/60">
              Engineered for Malaysia&apos;s tropical climate
            </p>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/5 p-6 text-center transition-all hover:border-primary/50 hover:bg-white/10">
            <div className="mb-3 text-4xl">💰</div>
            <h3 className="mb-2 text-lg font-bold text-white">Fair Price</h3>
            <p className="text-sm text-white/60">
              Quality gear without import markups
            </p>
          </div>
        </div>

        <div className="mt-10 text-center">
          <p className="text-sm text-white/50">
            Supporting local means supporting Malaysian athletes, jobs, and innovation
          </p>
        </div>
      </div>
    </section>
  );
};

export default ProudlyMalaysian;
