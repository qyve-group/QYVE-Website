import React from 'react';

import BrandMessage from './BrandMessage';
import MainBanner from './MainBanner';
import SectionProducts from './SectionProducts';
import Values from './Values';

const page = () => {
  return (
    <div>
      <MainBanner />

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
