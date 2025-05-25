import type { FC } from 'react';
import React from 'react';

import MainNav from './MainNav';
// import TopNav from './TopNav';

export interface HeaderProps {}

const Header: FC<HeaderProps> = () => {
  return (
    <div className="nc-Header sticky inset-x-0 top-0 z-50 w-full bg-black">
      {/* <TopNav /> */}
      <MainNav />
      {/* <TopNav /> */}
    </div>
  );
};

export default Header;
