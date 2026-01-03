import Link from 'next/link';
import React from 'react';
import { SocialIcon } from 'react-social-icons';

// import FooterBanner from './FooterBanner';

const Footer: React.FC = () => {
  const waNumber = process.env.NEXT_PUBLIC_WA_NUMBER!;
  const waMessage = encodeURIComponent('Hi QYVE team, I have a question');
  const waLink = `https://wa.me/${waNumber}?text=${waMessage}`;

  return (
    <div>
      {/* <div className="container mb-10">
        <FooterBanner />
      </div> */}

      <div className="bg-black text-white">
        <div className="container py-16">
          <div className="grid gap-12 lg:grid-cols-3">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2">
                <span className="text-xl">🇲🇾</span>
                <span className="text-sm font-bold text-primary">PROUDLY MALAYSIAN</span>
              </div>
              <h3 className="text-2xl font-bold">
                Malaysia&apos;s First Local Futsal Shoe Brand
              </h3>
              <p className="text-white/70">
                {/* Designed by Malaysian players. Assembled in Malaysia.  */}
                Built to empower the local futsal scene and showcase Malaysian talent to the world.
              </p>
              <div className="flex items-center gap-4">
                <SocialIcon
                  network="instagram"
                  url="https://www.instagram.com/qyveofficial"
                  style={{ height: 40, width: 40 }}
                />
                <SocialIcon
                  network="tiktok"
                  bgColor="white"
                  fgColor="black"
                  url="https://www.tiktok.com/@qyveofficial"
                  style={{ height: 40, width: 40 }}
                />
                <SocialIcon 
                  network="whatsapp" 
                  url={waLink} 
                  target="_blank" 
                  style={{ height: 40, width: 40 }}
                />
                <SocialIcon 
                  network="email" 
                  url="mailto:qyveshoe@gmail.com" 
                  style={{ height: 40, width: 40 }}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-4">
                <h4 className="font-bold text-primary">Shop</h4>
                <div className="flex flex-col space-y-3 text-sm text-white/70">
                  <Link href="/products/subzero" className="transition-colors hover:text-white">
                    Subzero Futsal Shoes
                  </Link>
                  <Link href="/shop" className="transition-colors hover:text-white">
                    All Products
                  </Link>
                  <Link href="/campaigns/subzero" className="transition-colors hover:text-white">
                    Subzero Campaign
                  </Link>
                </div>
              </div>
              <div className="space-y-4">
                <h4 className="font-bold text-primary">Support</h4>
                <div className="flex flex-col space-y-3 text-sm text-white/70">
                  <Link href="/size-guide" className="transition-colors hover:text-white">
                    Size Guide
                  </Link>
                  <Link href="/shipping" className="transition-colors hover:text-white">
                    Shipping Info
                  </Link>
                  <Link href="/returns" className="transition-colors hover:text-white">
                    Returns & Exchange
                  </Link>
                  <Link href="/contact" className="transition-colors hover:text-white">
                    Contact Us
                  </Link>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-bold text-primary">Our Promise</h4>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  {/* <span className="text-xl">🏭</span> */}
                  <div>
                    <p className="font-medium text-white">Empowering Malaysians</p>
                    <p className="text-sm text-white/60">Built to uplift local players, makers, and the futsal community</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  {/* <span className="text-xl">⚽</span> */}
                  <div>
                    <p className="font-medium text-white">Raising the Standard</p>
                    <p className="text-sm text-white/60">Built to elevate the level of futsal in Malaysia</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  {/* <span className="text-xl">🤝</span> */}
                  {/* <div>
                    <p className="font-medium text-white">Community First</p>
                    <p className="text-sm text-white/60">Supporting Malaysian futsal talent</p>
                  </div> */}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 md:flex-row">
            <p className="text-sm text-white/50">
              © {new Date().getFullYear()} QYVE. Malaysia&apos;s First Local Futsal Shoe Brand.
            </p>
            <div className="flex items-center gap-6 text-sm text-white/50">
              <Link href="/privacy" className="transition-colors hover:text-white">
                Privacy Policy
              </Link>
              <Link href="/terms" className="transition-colors hover:text-white">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
