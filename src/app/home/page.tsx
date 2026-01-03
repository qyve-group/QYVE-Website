import React from 'react';

import LaunchStrip from './LaunchStrip';
import SectionProducts from './SectionProducts';
import SubZeroSpotlight from './SubZeroSpotlight';
import Values from './Values';

const page = () => {
  return (
    <div className="overflow-hidden">
      {/* Black strip announcement */}
      <LaunchStrip />

      {/* White hero section */}
      <SubZeroSpotlight />

      {/* Light gray products section with smooth transition */}
      <div className="relative">
        <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-white to-gray-50" />
        <div className="bg-gray-50 pb-16 pt-8">
          <SectionProducts />
        </div>
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-gray-50 to-white" />
      </div>

      {/* White mission/values section */}
      <Values />
    </div>
  );
};

export default page;
