import React from 'react';

import { topNavLinks } from '@/data/content';

// import Language from '../Language';
import NavigationItem from '../NavItem';

const TopNav = () => {
  return (
    <div className="block">
      <div className="container flex items-center justify-between text-sm ">
        <div className="flex items-center divide-x divide-neutral-100 text-black">
          {topNavLinks.map((item) => (
            <NavigationItem menuItem={item} key={item.id} />
          ))}
        </div>

        {/* <Language /> */}
      </div>
    </div>
  );
};

export default TopNav;
