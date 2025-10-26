import type { FC } from 'react';
import React from 'react';

import MainNav from './MainNav';

export interface HeaderProps {}

const Header: FC<HeaderProps> = () => {
  console.log('Header component rendering...');
  
  return (
    <div className="nc-Header sticky inset-x-0 top-0 z-50 w-full bg-white shadow-sm">
      <div>DEBUG: Header rendering</div>
      <div className="container mx-auto px-4 flex items-center justify-between py-3">
        <div>LOGO</div>
        <div className="flex items-center gap-5 flex-1 justify-center">
          <a href="/shop" className="mx-3 text-lg font-medium hover:text-primary">Shop</a>
          <a href="/blog" className="mx-3 text-lg font-medium hover:text-primary">Blog</a>
          <a href="/contact" className="mx-3 text-lg font-medium hover:text-primary">Contact</a>
          <a href="/faqs" className="mx-3 text-lg font-medium hover:text-primary">FAQ</a>
        </div>
        <div>Cart | Login</div>
      </div>
    </div>
  );
};

export default Header;
