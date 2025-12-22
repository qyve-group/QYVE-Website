'use client';

import { BoltIcon, ShieldCheckIcon, SparklesIcon } from '@heroicons/react/24/outline';

const features = [
  {
    icon: SparklesIcon,
    title: 'SubZero-Weave Tech',
    description: 'Microfibre leather + mesh for ultimate touch & breathability',
  },
  {
    icon: BoltIcon,
    title: 'Energy Return Foam',
    description: 'EVA rebound technology for explosive power',
  },
  {
    icon: ShieldCheckIcon,
    title: 'Traction Grip',
    description: 'Multi-directional pattern for instant stops & pivots',
  },
];

const SubZeroFeatureStrip = () => {
  return (
    <section className="bg-black py-12 md:py-16">
      <div className="container mx-auto px-4">
        <div className="grid gap-8 md:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="flex flex-col items-center text-center"
            >
              <div className="mb-4 flex size-16 items-center justify-center rounded-full bg-[#4FD1C5]/20">
                <feature.icon className="size-8 text-[#4FD1C5]" />
              </div>
              <h3 className="mb-2 text-lg font-bold text-white">
                {feature.title}
              </h3>
              <p className="text-sm text-white/70">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SubZeroFeatureStrip;
