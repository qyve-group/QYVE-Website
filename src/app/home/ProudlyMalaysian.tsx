const ProudlyMalaysian = () => {
  return (
    <section className="bg-gradient-to-br from-[#0a1f3d] via-[#0d3d5c] to-[#1a5a7a] py-16">
      <div className="container mx-auto px-4">
        <div className="mb-10 text-center">
          <div className="mb-4 inline-flex items-center gap-3 rounded-full bg-white/10 px-6 py-3 backdrop-blur-sm">
            <span className="text-3xl">🇲🇾</span>
            <span className="text-lg font-bold text-white">PROUDLY MALAYSIAN</span>
          </div>
          <h2 className="mb-4 text-3xl font-bold text-white md:text-4xl">
            Built by Malaysians, for Malaysians
          </h2>
          <p className="mx-auto max-w-2xl text-white/80">
            QYVE is Malaysia&apos;s first homegrown futsal shoe brand. We understand local courts, 
            local weather, and the Malaysian style of play.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl bg-white/10 p-6 text-center backdrop-blur-sm transition-all hover:bg-white/20">
            <div className="mb-3 text-4xl">🏭</div>
            <h3 className="mb-2 text-lg font-bold text-white">100% Local</h3>
            <p className="text-sm text-white/70">
              Designed and produced entirely in Malaysia
            </p>
          </div>

          <div className="rounded-xl bg-white/10 p-6 text-center backdrop-blur-sm transition-all hover:bg-white/20">
            <div className="mb-3 text-4xl">⚽</div>
            <h3 className="mb-2 text-lg font-bold text-white">Court Tested</h3>
            <p className="text-sm text-white/70">
              Tested on Malaysian futsal courts nationwide
            </p>
          </div>

          <div className="rounded-xl bg-white/10 p-6 text-center backdrop-blur-sm transition-all hover:bg-white/20">
            <div className="mb-3 text-4xl">🌡️</div>
            <h3 className="mb-2 text-lg font-bold text-white">Climate Ready</h3>
            <p className="text-sm text-white/70">
              Engineered for Malaysia&apos;s tropical climate
            </p>
          </div>

          <div className="rounded-xl bg-white/10 p-6 text-center backdrop-blur-sm transition-all hover:bg-white/20">
            <div className="mb-3 text-4xl">💰</div>
            <h3 className="mb-2 text-lg font-bold text-white">Fair Price</h3>
            <p className="text-sm text-white/70">
              Quality gear without import markups
            </p>
          </div>
        </div>

        <div className="mt-10 text-center">
          <p className="mb-4 text-sm text-white/60">
            Supporting local means supporting Malaysian athletes, jobs, and innovation
          </p>
          <div className="inline-flex items-center gap-2 text-[#4FD1C5]">
            <span className="text-sm font-semibold">Join the movement</span>
            <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProudlyMalaysian;
