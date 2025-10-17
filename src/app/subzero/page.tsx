import React from 'react';

import NewsletterSignup from './NewsletterSignup';
import ProudlyMalaysian from './ProudlyMalaysian';
import SubZeroCTA from './SubZeroCTA';
import SubZeroFeatures from './SubZeroFeatures';
import SubZeroHero from './SubZeroHero';

const SubZeroPage = () => {
  return (
    <div>
      {/* SubZero Landing Page Sections */}
      <SubZeroHero />
      <SubZeroFeatures />
      <SubZeroCTA />
      <ProudlyMalaysian />
      <NewsletterSignup />
    </div>
  );
};

export default SubZeroPage;
