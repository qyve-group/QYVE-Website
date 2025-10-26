import React from 'react';

import { topNavLinks } from '@/data/content';

// import Language from '../Language';
import NavigationItem from '../NavItem';

const TopNav = () => {
  console.log('TopNav component rendering...');
  
  return (
    <div className="block">
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center divide-x divide-neutral-100 text-black">
          <a href="/shop" className="mx-3 text-lg font-medium hover:text-primary">Shop</a>
          <a href="/blog" className="mx-3 text-lg font-medium hover:text-primary">Blog</a>
          <a href="/contact" className="mx-3 text-lg font-medium hover:text-primary">Contact</a>
          <a href="/faqs" className="mx-3 text-lg font-medium hover:text-primary">FAQ</a>
        </div>
      </div>
    </div>
  );
};

export default TopNav;
