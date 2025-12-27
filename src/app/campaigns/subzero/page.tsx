/* eslint-disable import/no-named-as-default */

import React from 'react';

import SubZeroFAQs from './SubZeroFAQs';
import SubZeroFeatures from './SubZeroFeatures';
import SubZeroHero from './SubZeroHero';
import SubZeroPreOrder from './SubZeroPreOrder';
import SubZeroSizeChart from './SubZeroSizeChart';
import SubZeroStickyCTA from './SubZeroStickyCTA';
import SubZeroTestimonials from './SubZeroTestimonials';
import SubZeroTrustBadges from './SubZeroTrustBadges';

const SubZeroPage = () => {
  return (
    <div className="pb-20 lg:pb-0">
      {/* SubZero Landing Page Sections */}
      <SubZeroHero />
      <SubZeroTrustBadges />
      <SubZeroFeatures />
      <SubZeroPreOrder />
      <SubZeroSizeChart />
      <SubZeroTestimonials />
      <SubZeroFAQs />

      {/* Sticky CTA for Mobile */}
      <SubZeroStickyCTA />
    </div>
  );
};

export default SubZeroPage;
