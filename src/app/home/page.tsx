import React from 'react';

import BrandMessage from './BrandMessage';
import SectionProducts from './SectionProducts';
// import SubZeroFeatureStrip from './SubZeroFeatureStrip';
import SubZeroSpotlight from './SubZeroSpotlight';
import Values from './Values';

const page = () => {
  return (
    <div>
      <SubZeroSpotlight />

      {/* <SubZeroFeatureStrip /> */}

      <div className="mb-10">
        <SectionProducts />
      </div>

      <div>
        <BrandMessage />
      </div>

      <div>
        <Values />
      </div>
    </div>
  );
};

export default page;
