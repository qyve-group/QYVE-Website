/* eslint-disable import/no-named-as-default */

import React from 'react';

// import NewsletterSignup from './NewsletterSignup';
// import ProudlyMalaysian from './ProudlyMalaysian';
// import SubZeroCTA from './SubZeroCTA';
import SubZeroFeatures from './SubZeroFeatures';
import SubZeroHero from './SubZeroHero';
import SubZeroPreOrder from './SubZeroPreOrder';
import SubZeroSizeChart from './SubZeroSizeChart';

const SubZeroPage = () => {
  return (
    <div>
      {/* SubZero Landing Page Sections */}
      <SubZeroHero />
      <SubZeroFeatures />
      <SubZeroSizeChart />
      <SubZeroPreOrder />
      {/* <SubZeroCTA /> */}
      {/* <ProudlyMalaysian /> */}
      {/* <NewsletterSignup /> */}
    </div>
  );
};

export default SubZeroPage;
