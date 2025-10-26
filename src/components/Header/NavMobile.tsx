import Link from 'next/link';
import React from 'react';
import { MdClose } from 'react-icons/md';

import { topNavLinks } from '@/data/content';
import Logo from '@/shared/Logo/Logo';

export interface NavMobileProps {
  onClickClose?: () => void;
}

const NavMobile: React.FC<NavMobileProps> = ({ onClickClose }) => {
  return (
    <div className="h-screen w-full max-w-sm divide-y divide-neutral-300 overflow-y-auto bg-white py-2 shadow-lg ring-1 transition">
      {/* Header with Logo and Close Button */}
      <div className="px-5 py-4 relative">
        <Logo className="block" />
        <button
          onClick={onClickClose}
          className="absolute right-4 top-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
          aria-label="Close menu"
        >
          <MdClose className="text-xl text-gray-600" />
        </button>
      </div>
      
      {/* Navigation Links */}
      <div className="px-5 py-6">
        <ul className="flex flex-col space-y-4">
          {topNavLinks.map((item) => (
            <li key={item.id}>
              <Link
                href={item.href}
                onClick={onClickClose}
                className="block py-3 px-4 text-lg font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
      
      {/* Footer */}
      <div className="px-5 py-4 border-t border-gray-200">
        <p className="text-sm text-gray-500 text-center">
          QYVE - Premium Sports Apparel
        </p>
      </div>
    </div>
  );
};

export default NavMobile;
