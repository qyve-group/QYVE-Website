import React from 'react';

// import BrandMessage from './BrandMessage';
// import MainBanner from './MainBanner';
// import SectionBestDeals from "./SectionBestDeals";
// import SectionBrands from "./SectionBrands";
import ShopHeader from './ShopHeader';
import ShopProducts from './ShopProducts';
import Testimonial from './Testimonial';
// import SectionProducts from './SectionProducts';
// import Values from './Values';

const page = () => {
  return (
    <div>
      {/* <MainBanner />

      <div className="mb-10">
        <SectionProducts />
      </div>
      <div>
        <BrandMessage />
      </div>

      <div>
        <Values />
      </div> */}
      <div>
        <ShopHeader />
      </div>
      <div className="my-7">
        <ShopProducts />
      </div>
      <div className="my-7">
        <Testimonial />
      </div>
      {/* <div className="mb-32">
        <SectionBestDeals />
      </div> */}
      {/* <div className="mb-32">
        <SectionBrands />
      </div> */}
    </div>
  );
};

export default page;
