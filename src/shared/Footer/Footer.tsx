import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { SocialIcon } from 'react-social-icons';

import FooterBanner from './FooterBanner';

const Footer: React.FC = () => {
  return (
    <div>
      <div className="container mb-10">
        <FooterBanner />
      </div>

      <div className="bg-black text-white">
        <div className="container grid gap-10 py-16 md:grid-cols-[1.5fr_1fr_1fr] lg:gap-16">
          {/* Left - Brand Section */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <Image
                src="/qyve-white.png"
                alt="QYVE"
                width={120}
                height={40}
                className="h-auto w-auto"
              />
            </div>
            <p className="max-w-md text-sm leading-relaxed text-gray-300">
              Founded in 2024, QYVE exists to elevate the standards of futsal
              by prioritizing performance, innovation, and community—bringing
              players together through a shared passion for the game.
            </p>
          </div>

          {/* Center - Support Links */}
          <div className="space-y-6">
            <h4 className="text-lg font-semibold uppercase tracking-wider">
              Support
            </h4>
            <div className="flex flex-col space-y-4">
              <Link
                href="/faq"
                className="text-gray-300 transition-colors hover:text-white"
              >
                FAQs
              </Link>
              <Link
                href="/contact"
                className="text-gray-300 transition-colors hover:text-white"
              >
                Contact Us
              </Link>
              <Link
                href="/my-orders"
                className="text-gray-300 transition-colors hover:text-white"
              >
                Order Status
              </Link>
            </div>
          </div>

          {/* Right - Social Media */}
          <div className="space-y-6">
            <h4 className="text-lg font-semibold uppercase tracking-wider">
              Follow Us
            </h4>
            <div className="flex gap-4">
              <SocialIcon
                network="instagram"
                url="https://www.instagram.com/qyveofficial"
                target="_blank"
                style={{ width: 40, height: 40 }}
              />
              <SocialIcon
                network="tiktok"
                bgColor="white"
                fgColor="black"
                url="https://www.tiktok.com/@qyveofficial"
                target="_blank"
                style={{ width: 40, height: 40 }}
              />
              <SocialIcon
                network="facebook"
                url="https://www.facebook.com/qyveofficial"
                target="_blank"
                style={{ width: 40, height: 40 }}
              />
            </div>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="border-t border-gray-800">
          <div className="container py-6">
            <p className="text-center text-sm text-gray-400">
              © {new Date().getFullYear()} QYVE. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
