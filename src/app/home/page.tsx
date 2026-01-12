import React from 'react';

// import BrandMessage from './BrandMessage';
import LaunchStrip from './LaunchStrip';
// import ProudlyMalaysian from './ProudlyMalaysian';
import SectionProducts from './SectionProducts';
import SubZeroSpotlight from './SubZeroSpotlight';
import Values from './Values';

const page = () => {
  return (
    <div>
      <LaunchStrip />

      <SubZeroSpotlight />

      <div className="mb-10">
        <SectionProducts />
      </div>

      {/* <ProudlyMalaysian /> */}

      {/* <div>
        <BrandMessage />
      </div> */}

      <div>
        <Values />
      </div>
    </div>
  );
};

export default page;
