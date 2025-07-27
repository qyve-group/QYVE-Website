import { BsBoxFill } from 'react-icons/bs';
import { FaCalendarAlt } from 'react-icons/fa';
import { FaTruckFast } from 'react-icons/fa6';
import { FiBox } from 'react-icons/fi';
import { IoChatboxOutline } from 'react-icons/io5';
import { MdOutlineCameraAlt } from 'react-icons/md';
import { PiPercentFill } from 'react-icons/pi';

import type { NavItemType } from '@/components/NavItem';
import airForce1 from '@/images/airForce1.webp';
import blackLebron from '@/images/blackLebron.webp';
import brownsb from '@/images/brownsb.webp';
// import brsb from "@/images/brsb.webp";
import compass_profile from '@/images/compass_profile.jpeg';
import compass1 from '@/images/compass1.jpg';
import compass2 from '@/images/compass2.jpg';
import compass3 from '@/images/compass3.png';
import compass4 from '@/images/compass4.jpg';
import dunklow from '@/images/dunklow.webp';
import lebronxx from '@/images/lebronxx.webp';
// import metcon5 from "@/images/metcon5.webp";
// import metcon9 from "@/images/metcon9.webp";
import new_balance from '@/images/new_balance.png';
import new_balance1 from '@/images/new_balance1.webp';
import new_balance2 from '@/images/new_balance2.webp';
import new_balance3 from '@/images/new_balance3.webp';
import new_balance4 from '@/images/new_balance4.webp';
// import nike_blazer from "@/images/nike_blazer.webp";
import nike_profile from '@/images/nike_profile.jpg';
import redlow from '@/images/redlow.webp';
import shot1 from '@/images/shots/shot1.webp';
import shot2 from '@/images/shots/shot2.webp';
import shot3 from '@/images/shots/shot3.jpeg';
import shot4 from '@/images/shots/shot4.jpeg';
import shot5 from '@/images/shots/shot5.webp';
import shot6 from '@/images/shots/shot6.jpeg';
import shot7 from '@/images/shots/shot7.webp';
// import slides from "@/images/slides.webp";
import yellowLow from '@/images/yellowLow.webp';

import type { BlogType } from './types';

export const topNavLinks: NavItemType[] = [
  {
    id: 'eeshop',
    name: 'Shop',
    href: '/shop',
  },
  {
    id: 'eerrrt',
    name: 'Blog',
    href: '/blog',
  },
  // {
  //   id: 'eexct',
  //   name: 'Collections',
  //   href: '/products',
  // },
  // {
  //   id: 'h6ii8g',
  //   name: 'Contact',
  //   href: '/contact',
  // },
  {
    id: 'h678ty',
    name: 'FAQ',
    href: '/faqs',
  },
  // {
  //   id: 'h6i78g',
  //   name: 'Checkout',
  //   href: '/checkout',
  // },
  // {
  //   id: 'f678ty',
  //   name: 'Cart',
  //   href: '/cart',
  // },
];

export const NavLinks: NavItemType[] = [
  // {
  //   id: 'ee46t',
  //   name: 'Home',
  //   href: '/home',
  // },
  {
    id: 'eeshop',
    name: 'Shop',
    href: '/shop',
  },
  {
    id: 'eerrrt',
    name: 'Blog',
    href: '/blog',
  },
  // {
  //   id: 'eexct',
  //   name: 'Collection',
  //   href: '/products',
  // },

  // {
  //   id: 'h6ii8g',
  //   name: 'Contact',
  //   href: '/contact',
  // },
  {
    id: 'h678ty',
    name: 'FAQ',
    href: '/faqs',
  },
  // {
  //   id: 'h6i78g',
  //   name: 'Checkout',
  //   href: '/checkout',
  // },
  // {
  //   id: 'f678ty',
  //   name: 'Cart',
  //   href: '/cart',
  // },
];

// export const headerSection = [
//   {
//     id: 1,
//     title: 'NEW ARRIVAL!',
//     heading: 'QYVE ProGrip Socks',
//     description: 'Stay locked in.\nNo slips, just goals',
//   },
//   {
//     id: 2,
//     title: 'Coming soon',
//     heading: 'QYVE Recovery Slides',
//     description:
//       'Give your feet a break after a futsal session—slip into recovery slides for ultimate comfort and faster recovery',
//   },
// ];

export const promotionTag = {
  heading: 'DISC UP TO 50% FOR SNEAKERS FEST ID 2023',
  description:
    'Join the sneaker fest 2023 on 23 October. We have more fun gigs too and supported by FootWear!.',
};

export const shoes = [
  {
    slug: 'airForce1',
    shoeName: 'Air Force 1',
    coverImage: airForce1,
    currentPrice: 199,
    previousPrice: 250,
    shoeCategory: "Men's shoes",
    rating: 4.8,
    reviews: 56,
    pieces_sold: 600,
    justIn: false,
    shots: [airForce1, shot1, shot2, shot3, shot4, shot5, shot6, shot7],
    overview:
      'When your workouts wade into the nitty gritty, the Nike Free Metcon 5 can meet you in the depths, help you dig deep to find that final ounce of force and come out of the other side on a high. It matches style with substance, forefoot flexibility with backend stability, perfect for flying through a cardio day or enhancing your agility. A revamped upper offers easier entry with a collar made just for your ankle.',
    shipment_details: [
      {
        icon: <PiPercentFill className="text-xl text-secondary" />,
        title: 'Discount',
        description: '> $100 Disc 10%',
      },
      {
        icon: <FaCalendarAlt className="text-xl text-secondary" />,
        title: 'Delivery Time',
        description: '6 - 12 Working days',
      },
      {
        icon: <BsBoxFill className="text-xl text-secondary" />,
        title: 'Package',
        description: 'Reagular Premium Box',
      },
      {
        icon: <FaTruckFast className="text-xl text-secondary" />,
        title: 'Estimated Arrival',
        description: '10 - 12 October 23',
      },
    ],
  },
  {
    slug: 'blackLebron',
    shoeName: 'Lebron Black',
    coverImage: blackLebron,
    currentPrice: 199,
    previousPrice: 250,
    shoeCategory: "Men's shoes",
    rating: 4.8,
    reviews: 56,
    pieces_sold: 600,
    justIn: true,
    shots: [blackLebron, shot1, shot2, shot3, shot4, shot5, shot6, shot7],
    overview:
      'When your workouts wade into the nitty gritty, the Nike Free Metcon 5 can meet you in the depths, help you dig deep to find that final ounce of force and come out of the other side on a high. It matches style with substance, forefoot flexibility with backend stability, perfect for flying through a cardio day or enhancing your agility. A revamped upper offers easier entry with a collar made just for your ankle.',
    shipment_details: [
      {
        icon: <PiPercentFill className="text-xl text-secondary" />,
        title: 'Discount',
        description: '> $100 Disc 10%',
      },
      {
        icon: <FaCalendarAlt className="text-xl text-secondary" />,
        title: 'Delivery Time',
        description: '6 - 12 Working days',
      },
      {
        icon: <BsBoxFill className="text-xl text-secondary" />,
        title: 'Package',
        description: 'Reagular Premium Box',
      },
      {
        icon: <FaTruckFast className="text-xl text-secondary" />,
        title: 'Estimated Arrival',
        description: '10 - 12 October 23',
      },
    ],
  },
  {
    slug: 'brownsb',
    shoeName: 'SB Low Brown',
    coverImage: brownsb,
    currentPrice: 199,
    previousPrice: 250,
    shoeCategory: "Men's shoes",
    rating: 4.8,
    reviews: 56,
    pieces_sold: 600,
    justIn: false,
    shots: [brownsb, shot1, shot2, shot3, shot4, shot5, shot6, shot7],
    overview:
      'When your workouts wade into the nitty gritty, the Nike Free Metcon 5 can meet you in the depths, help you dig deep to find that final ounce of force and come out of the other side on a high. It matches style with substance, forefoot flexibility with backend stability, perfect for flying through a cardio day or enhancing your agility. A revamped upper offers easier entry with a collar made just for your ankle.',
    shipment_details: [
      {
        icon: <PiPercentFill className="text-xl text-secondary" />,
        title: 'Discount',
        description: '> $100 Disc 10%',
      },
      {
        icon: <FaCalendarAlt className="text-xl text-secondary" />,
        title: 'Delivery Time',
        description: '6 - 12 Working days',
      },
      {
        icon: <BsBoxFill className="text-xl text-secondary" />,
        title: 'Package',
        description: 'Reagular Premium Box',
      },
      {
        icon: <FaTruckFast className="text-xl text-secondary" />,
        title: 'Estimated Arrival',
        description: '10 - 12 October 23',
      },
    ],
  },
  // {
  //   slug: "brsb",
  //   shoeName: "BRSB",
  //   coverImage: brsb,
  //   currentPrice: 199,
  //   previousPrice: 250,
  //   shoeCategory: "Men's shoes",
  //   rating: 4.8,
  //   reviews: 56,
  //   pieces_sold: 600,
  //   justIn: false,
  //   shots: [brsb, shot1, shot2, shot3, shot4, shot5, shot6, shot7],
  //   overview:
  //     "When your workouts wade into the nitty gritty, the Nike Free Metcon 5 can meet you in the depths, help you dig deep to find that final ounce of force and come out of the other side on a high. It matches style with substance, forefoot flexibility with backend stability, perfect for flying through a cardio day or enhancing your agility. A revamped upper offers easier entry with a collar made just for your ankle.",
  //   shipment_details: [
  //     {
  //       icon: <PiPercentFill className="text-xl text-secondary" />,
  //       title: "Discount",
  //       description: "> $100 Disc 10%",
  //     },
  //     {
  //       icon: <FaCalendarAlt className="text-xl text-secondary" />,
  //       title: "Delivery Time",
  //       description: "6 - 12 Working days",
  //     },
  //     {
  //       icon: <BsBoxFill className="text-xl text-secondary" />,
  //       title: "Package",
  //       description: "Reagular Premium Box",
  //     },
  //     {
  //       icon: <FaTruckFast className="text-xl text-secondary" />,
  //       title: "Estimated Arrival",
  //       description: "10 - 12 October 23",
  //     },
  //   ],
  // },
  // {
  //   slug: "dunklow",
  //   shoeName: "Dunk Low",
  //   coverImage: dunklow,
  //   currentPrice: 199,
  //   previousPrice: 250,
  //   shoeCategory: "Men's shoes",
  //   rating: 4.8,
  //   reviews: 56,
  //   pieces_sold: 600,
  //   justIn: false,
  //   shots: [dunklow, shot1, shot2, shot3, shot4, shot5, shot6, shot7],
  //   overview:
  //     "When your workouts wade into the nitty gritty, the Nike Free Metcon 5 can meet you in the depths, help you dig deep to find that final ounce of force and come out of the other side on a high. It matches style with substance, forefoot flexibility with backend stability, perfect for flying through a cardio day or enhancing your agility. A revamped upper offers easier entry with a collar made just for your ankle.",
  //   shipment_details: [
  //     {
  //       icon: <PiPercentFill className="text-xl text-secondary" />,
  //       title: "Discount",
  //       description: "> $100 Disc 10%",
  //     },
  //     {
  //       icon: <FaCalendarAlt className="text-xl text-secondary" />,
  //       title: "Delivery Time",
  //       description: "6 - 12 Working days",
  //     },
  //     {
  //       icon: <BsBoxFill className="text-xl text-secondary" />,
  //       title: "Package",
  //       description: "Reagular Premium Box",
  //     },
  //     {
  //       icon: <FaTruckFast className="text-xl text-secondary" />,
  //       title: "Estimated Arrival",
  //       description: "10 - 12 October 23",
  //     },
  //   ],
  // },
  // {
  //   slug: "lebronxx",
  //   shoeName: "Lebron XXL",
  //   coverImage: lebronxx,
  //   currentPrice: 199,
  //   previousPrice: 250,
  //   shoeCategory: "Men's shoes",
  //   rating: 4.8,
  //   reviews: 56,
  //   pieces_sold: 600,
  //   justIn: false,
  //   shots: [lebronxx, shot1, shot2, shot3, shot4, shot5, shot6, shot7],
  //   overview:
  //     "When your workouts wade into the nitty gritty, the Nike Free Metcon 5 can meet you in the depths, help you dig deep to find that final ounce of force and come out of the other side on a high. It matches style with substance, forefoot flexibility with backend stability, perfect for flying through a cardio day or enhancing your agility. A revamped upper offers easier entry with a collar made just for your ankle.",
  //   shipment_details: [
  //     {
  //       icon: <PiPercentFill className="text-xl text-secondary" />,
  //       title: "Discount",
  //       description: "> $100 Disc 10%",
  //     },
  //     {
  //       icon: <FaCalendarAlt className="text-xl text-secondary" />,
  //       title: "Delivery Time",
  //       description: "6 - 12 Working days",
  //     },
  //     {
  //       icon: <BsBoxFill className="text-xl text-secondary" />,
  //       title: "Package",
  //       description: "Reagular Premium Box",
  //     },
  //     {
  //       icon: <FaTruckFast className="text-xl text-secondary" />,
  //       title: "Estimated Arrival",
  //       description: "10 - 12 October 23",
  //     },
  //   ],
  // },
  // {
  //   slug: "metcon5",
  //   shoeName: "Metcon 5",
  //   coverImage: metcon5,
  //   currentPrice: 199,
  //   previousPrice: 250,
  //   shoeCategory: "Men's shoes",
  //   rating: 4.8,
  //   reviews: 56,
  //   pieces_sold: 600,
  //   justIn: true,
  //   shots: [metcon5, shot1, shot2, shot3, shot4, shot5, shot6, shot7],
  //   overview:
  //     "When your workouts wade into the nitty gritty, the Nike Free Metcon 5 can meet you in the depths, help you dig deep to find that final ounce of force and come out of the other side on a high. It matches style with substance, forefoot flexibility with backend stability, perfect for flying through a cardio day or enhancing your agility. A revamped upper offers easier entry with a collar made just for your ankle.",
  //   shipment_details: [
  //     {
  //       icon: <PiPercentFill className="text-xl text-secondary" />,
  //       title: "Discount",
  //       description: "> $100 Disc 10%",
  //     },
  //     {
  //       icon: <FaCalendarAlt className="text-xl text-secondary" />,
  //       title: "Delivery Time",
  //       description: "6 - 12 Working days",
  //     },
  //     {
  //       icon: <BsBoxFill className="text-xl text-secondary" />,
  //       title: "Package",
  //       description: "Reagular Premium Box",
  //     },
  //     {
  //       icon: <FaTruckFast className="text-xl text-secondary" />,
  //       title: "Estimated Arrival",
  //       description: "10 - 12 October 23",
  //     },
  //   ],
  // },
  // {
  //   slug: "metcon9",
  //   shoeName: "Metcon 9",
  //   coverImage: metcon9,
  //   currentPrice: 199,
  //   previousPrice: 250,
  //   shoeCategory: "Men's shoes",
  //   rating: 4.8,
  //   reviews: 56,
  //   pieces_sold: 600,
  //   justIn: false,
  //   shots: [metcon9, shot1, shot2, shot3, shot4, shot5, shot6, shot7],
  //   overview:
  //     "When your workouts wade into the nitty gritty, the Nike Free Metcon 5 can meet you in the depths, help you dig deep to find that final ounce of force and come out of the other side on a high. It matches style with substance, forefoot flexibility with backend stability, perfect for flying through a cardio day or enhancing your agility. A revamped upper offers easier entry with a collar made just for your ankle.",
  //   shipment_details: [
  //     {
  //       icon: <PiPercentFill className="text-xl text-secondary" />,
  //       title: "Discount",
  //       description: "> $100 Disc 10%",
  //     },
  //     {
  //       icon: <FaCalendarAlt className="text-xl text-secondary" />,
  //       title: "Delivery Time",
  //       description: "6 - 12 Working days",
  //     },
  //     {
  //       icon: <BsBoxFill className="text-xl text-secondary" />,
  //       title: "Package",
  //       description: "Reagular Premium Box",
  //     },
  //     {
  //       icon: <FaTruckFast className="text-xl text-secondary" />,
  //       title: "Estimated Arrival",
  //       description: "10 - 12 October 23",
  //     },
  //   ],
  // },
  // {
  //   slug: "nike_blazer",
  //   shoeName: "Nike Blazer",
  //   coverImage: nike_blazer,
  //   currentPrice: 199,
  //   previousPrice: 250,
  //   shoeCategory: "Men's shoes",
  //   rating: 4.8,
  //   reviews: 56,
  //   pieces_sold: 600,
  //   justIn: true,
  //   shots: [nike_blazer, shot1, shot2, shot3, shot4, shot5, shot6, shot7],
  //   overview:
  //     "When your workouts wade into the nitty gritty, the Nike Free Metcon 5 can meet you in the depths, help you dig deep to find that final ounce of force and come out of the other side on a high. It matches style with substance, forefoot flexibility with backend stability, perfect for flying through a cardio day or enhancing your agility. A revamped upper offers easier entry with a collar made just for your ankle.",
  //   shipment_details: [
  //     {
  //       icon: <PiPercentFill className="text-xl text-secondary" />,
  //       title: "Discount",
  //       description: "> $100 Disc 10%",
  //     },
  //     {
  //       icon: <FaCalendarAlt className="text-xl text-secondary" />,
  //       title: "Delivery Time",
  //       description: "6 - 12 Working days",
  //     },
  //     {
  //       icon: <BsBoxFill className="text-xl text-secondary" />,
  //       title: "Package",
  //       description: "Reagular Premium Box",
  //     },
  //     {
  //       icon: <FaTruckFast className="text-xl text-secondary" />,
  //       title: "Estimated Arrival",
  //       description: "10 - 12 October 23",
  //     },
  //   ],
  // },
  // {
  //   slug: "redlow",
  //   shoeName: "Dunk Low Red",
  //   coverImage: redlow,
  //   currentPrice: 199,
  //   previousPrice: 250,
  //   shoeCategory: "Men's shoes",
  //   rating: 4.8,
  //   reviews: 56,
  //   pieces_sold: 600,
  //   justIn: false,
  //   shots: [redlow, shot1, shot2, shot3, shot4, shot5, shot6, shot7],
  //   overview:
  //     "When your workouts wade into the nitty gritty, the Nike Free Metcon 5 can meet you in the depths, help you dig deep to find that final ounce of force and come out of the other side on a high. It matches style with substance, forefoot flexibility with backend stability, perfect for flying through a cardio day or enhancing your agility. A revamped upper offers easier entry with a collar made just for your ankle.",
  //   shipment_details: [
  //     {
  //       icon: <PiPercentFill className="text-xl text-secondary" />,
  //       title: "Discount",
  //       description: "> $100 Disc 10%",
  //     },
  //     {
  //       icon: <FaCalendarAlt className="text-xl text-secondary" />,
  //       title: "Delivery Time",
  //       description: "6 - 12 Working days",
  //     },
  //     {
  //       icon: <BsBoxFill className="text-xl text-secondary" />,
  //       title: "Package",
  //       description: "Reagular Premium Box",
  //     },
  //     {
  //       icon: <FaTruckFast className="text-xl text-secondary" />,
  //       title: "Estimated Arrival",
  //       description: "10 - 12 October 23",
  //     },
  //   ],
  // },
  // {
  //   slug: "slides",
  //   shoeName: "Slides",
  //   coverImage: slides,
  //   currentPrice: 199,
  //   previousPrice: 250,
  //   shoeCategory: "Men's shoes",
  //   rating: 4.8,
  //   reviews: 56,
  //   pieces_sold: 600,
  //   justIn: false,
  //   shots: [slides, shot1, shot2, shot3, shot4, shot5, shot6, shot7],
  //   overview:
  //     "When your workouts wade into the nitty gritty, the Nike Free Metcon 5 can meet you in the depths, help you dig deep to find that final ounce of force and come out of the other side on a high. It matches style with substance, forefoot flexibility with backend stability, perfect for flying through a cardio day or enhancing your agility. A revamped upper offers easier entry with a collar made just for your ankle.",
  //   shipment_details: [
  //     {
  //       icon: <PiPercentFill className="text-xl text-secondary" />,
  //       title: "Discount",
  //       description: "> $100 Disc 10%",
  //     },
  //     {
  //       icon: <FaCalendarAlt className="text-xl text-secondary" />,
  //       title: "Delivery Time",
  //       description: "6 - 12 Working days",
  //     },
  //     {
  //       icon: <BsBoxFill className="text-xl text-secondary" />,
  //       title: "Package",
  //       description: "Reagular Premium Box",
  //     },
  //     {
  //       icon: <FaTruckFast className="text-xl text-secondary" />,
  //       title: "Estimated Arrival",
  //       description: "10 - 12 October 23",
  //     },
  //   ],
  // },
  // {
  //   slug: "yellowLow",
  //   shoeName: "Dunk Low Yellow",
  //   coverImage: yellowLow,
  //   currentPrice: 199,
  //   previousPrice: 250,
  //   shoeCategory: "Men's shoes",
  //   rating: 4.8,
  //   reviews: 56,
  //   pieces_sold: 600,
  //   justIn: true,
  //   shots: [yellowLow, shot1, shot2, shot3, shot4, shot5, shot6, shot7],
  //   overview:
  //     "When your workouts wade into the nitty gritty, the Nike Free Metcon 5 can meet you in the depths, help you dig deep to find that final ounce of force and come out of the other side on a high. It matches style with substance, forefoot flexibility with backend stability, perfect for flying through a cardio day or enhancing your agility. A revamped upper offers easier entry with a collar made just for your ankle.",
  //   shipment_details: [
  //     {
  //       icon: <PiPercentFill className="text-xl text-secondary" />,
  //       title: "Discount",
  //       description: "> $100 Disc 10%",
  //     },
  //     {
  //       icon: <FaCalendarAlt className="text-xl text-secondary" />,
  //       title: "Delivery Time",
  //       description: "6 - 12 Working days",
  //     },
  //     {
  //       icon: <BsBoxFill className="text-xl text-secondary" />,
  //       title: "Package",
  //       description: "Reagular Premium Box",
  //     },
  //     {
  //       icon: <FaTruckFast className="text-xl text-secondary" />,
  //       title: "Estimated Arrival",
  //       description: "10 - 12 October 23",
  //     },
  //   ],
  // },
];

export const productsSection = {
  heading: 'Featured Products',
  description:
    'Born on the court. Built for performance and style. Designed in Malaysia.',
};

const shoeBrands = ['Nike', 'Alexander Mqueen', 'New Balance', 'Compass'];

const shoeTypes = ['Type', 'Sandals', 'Sneakers', 'Boots'];

const sizes = ['Size', 'S', 'M', 'L', 'XL', 'XXl'];

const prices = [
  'Price',
  'Below $100',
  'Below $200',
  'Below $300',
  'Below $400',
];

export const filters = [shoeBrands, prices, sizes, shoeTypes];

export const brandsSection = {
  heading: 'The Official Store of The Amazing Brand',
  description:
    'We work together with high quality and famous brands around the world',
  brands: [
    {
      brandName: 'New Balance',
      rating: 4.9,
      reviews: 10334,
      followers: 7.2,
      visitLink: 'https:// www.newbalance.com',
      logo: new_balance,
      shoes: [new_balance1, new_balance2, new_balance3, new_balance4],
    },
    {
      brandName: 'Compass',
      rating: 4.9,
      reviews: 10334,
      followers: 8.5,
      visitLink: 'https:// www.sepatucompass.com/',
      logo: compass_profile,
      shoes: [compass1, compass2, compass3, compass4],
    },
    {
      brandName: 'Nike',
      rating: 4.9,
      reviews: 10334,
      followers: 11.2,
      visitLink: 'https:// nike.com',
      logo: nike_profile,
      shoes: [yellowLow, redlow, dunklow, lebronxx],
    },
  ],
};

export const footerBannerData = {
  heading: 'EMPOWERING TRUST THROUGH EVERY STEP ON THE COURT',
  description:
    'At QYVE, we believe that true performance begins with trust — trust in your gear, trust in your team, and trust in the community that supports you. Our mission is to bridge the gap between athletes and innovation by delivering futsal products designed with precision, honesty, and a deep understanding of the game.',

  description2:
    ' Every pair of shoes, every stitch, and every decision we make is driven by a commitment to quality and transparency. \nWe are not just here to sell — we are here to stand beside every player who laces up with purpose. Together, we are building more than just a brand — we are building a community grounded in reliability, respect, and a passion for futsal.',
};

export const footerData = {
  description:
    "Found in 2024, QYVE's mission is to elevate the standards of sports in the region by prioritizing performance, innovation and the community - bringing players together through a shared passion of the game.",
  footerLinks: [
    {
      title: 'Main Pages',
      links: [
        { href: '/home', name: 'Home' },
        { href: '/about-us', name: 'About Us' },
        { href: '/products', name: 'Products' },
        { href: '/cart', name: 'Cart' },
        // { href: '/checkout', name: 'Checkout' },
        // { href: '/blog', name: 'Blogs' },
      ],
    },
    {
      title: 'Single Pages',
      links: [
        { href: '/product/yellowLow', name: 'Product Single' },
        {
          href: '/blog/the-evolution-of-sneaker-culture-a-historical-perspective',
          name: 'Blog Single',
        },
      ],
    },
    {
      title: 'Other Pages',
      links: [{ href: '/rt', name: 'Not Found' }],
    },
    {
      title: 'Utility Pages',
      links: [
        { href: '/faq', name: 'FAQS' },
        { href: '/contact', name: 'Contact' },
        { href: '/forgot-pass', name: 'Forgot Password' },
        { href: '/login', name: 'Login' },
        { href: '/signup', name: 'Signup' },
      ],
    },
  ],
};

export const newsletter = {
  heading: "Don't wanna miss our offers?",
  description:
    'Drop your email below and start receiving the best offers from HotKicks',
};

export const shoeSizes = [
  'EU36',
  'EU37',
  'EU38',
  'EU39',
  'EU40',
  'EU41',
  'EU42',
  'EU43',
  'EU44',
];

export const note =
  ' Lorem ipsum, dolor sit amet consectetur adipisicing elit. Vitae, est eum magnam doloremque, at adipisci debitis, similique dolores ipsa unde necessitatibus vero quibusdam nostrum numquam!';

export const contactSection = {
  heading: 'Contact us',
  description:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quis quis phasellus eleifend tellus orci ornare.',
  directContactInfoHeader: {
    heading: 'Prefer to reach out directly?',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nibh magna sit diam pharetra.',
  },
  directContactInfo: [
    {
      icon: <FiBox className="text-5xl" />,
      title: 'Sales',
      description:
        'Lorem ipsum dolor sit amet consectetur adipiscing elit blandit velit semper aliquam.',
      contactLink: {
        href: 'mailto:sales@hotkicks.com',
        title: 'sales@hotkicks.com',
      },
    },
    {
      icon: <IoChatboxOutline className="text-5xl" />,
      title: 'Support',
      description:
        'Lorem ipsum dolor sit amet consectetur adipiscing elit blandit velit semper aliquam.',
      contactLink: {
        href: 'mailto:support@hotckicks.com',
        title: 'support@hotckicks.com',
      },
    },
    {
      icon: <MdOutlineCameraAlt className="text-5xl" />,
      title: 'Influencers',
      description:
        'Lorem ipsum dolor sit amet consectetur adipiscing elit blandit velit semper aliquam.',
      contactLink: {
        href: 'mailto:influencers@hotckicks.com',
        title: 'influencers@hotckicks.com',
      },
    },
  ],
  instagramPhotos: [
    // 'https:// images.unsplash.com/photo-1595341888016-a392ef81b7de?q=80&w=1479&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    // 'https:// images.unsplash.com/photo-1463100099107-aa0980c362e6?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    // 'https:// images.unsplash.com/photo-1511556532299-8f662fc26c06?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    // 'https:// images.unsplash.com/photo-1505784045224-1247b2b29cf3?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    // 'https:// images.unsplash.com/photo-1604671801908-6f0c6a092c05?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  ],
};

export const faqsData = {
  heading: 'Frequently Asked Questions',
  description:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin eget adipiscing nibh nunc. Velit rhoncus arcu velesaed.',
  faqs: [
    {
      category: 'About QYVE',
      data: [
        {
          question: 'What is QYVE?',
          answer:
            'QYVE is an innovative sports brand that blends performance, lifestyle and affordability.',
        },
        {
          question: 'What does the name “QYVE” means?',
          answer:
            'QYVE is a crafted name that echoes our purpose: to deliver Quality products that support Your journey with Value and relentless Evolution. It’s our way of saying — own your journey, every step of the way',
        },
        {
          question: 'Where is QYVE based?',
          answer: 'Our Tanah Air is Malaysia.',
        },
        {
          question: 'What makes QYVE different from other sportswear brands?',
          answer:
            'We’re proud to be born in Southeast Asia — and we’re here to change the game. QYVE is different because we design with purpose: to uplift local athletes, inspire a movement, and redefine what it means to be a sports brand in this region.',
        },
      ],
    },
    // {
    //   category: 'Shipping',
    //   data: [
    //     {
    //       question: 'How can I track my order?',
    //       answer:
    //         'You can track your order by logging into your account and checking the order status. Additionally, a tracking number will be provided in the shipping confirmation email.',
    //     },
    //     {
    //       question: 'What is the estimated delivery time for my order?',
    //       answer:
    //         'Delivery times vary based on your location. Typically, domestic orders take 3-5 business days, while international orders may take 7-14 business days.',
    //     },
    //     {
    //       question: 'Can I change my shipping address after placing an order?',
    //       answer:
    //         'Unfortunately, we cannot change the shipping address once the order is placed. Please double-check your information before completing the purchase.',
    //     },
    //     {
    //       question: 'Do you offer expedited shipping options?',
    //       answer:
    //         'Yes, we offer expedited shipping at an additional cost. You can choose your preferred shipping method during the checkout process.',
    //     },
    //     {
    //       question: 'What should I do if my order is delayed or lost?',
    //       answer:
    //         'If your order is significantly delayed or lost, please contact our customer support team, and we will investigate the issue.',
    //     },
    //   ],
    // },
    {
      category: 'Products',
      data: [
        {
          question: 'What is QYVE Infinitus?',
          answer:
            'QYVE Infinitus is our first and flagship futsal shoe, built with simplicity. It is our Beginner series meant to cater to players who are just starting out and looking to unleash their potential. ',
        },
        {
          question: 'What sizes are available for QYVE Infinitus?',
          answer:
            'Unfortunately, we have it available in Size EUR 40 and 41 and sold out from size EUR 42 to EUR 44 due to demand. However, we are working hard towards designing our next generation futsal shoe which will be available in many sizes. ',
        },
        {
          question: 'What are QYVE ProGrip Socks?',
          answer:
            'It is our best-selling anti-slip grip socks that are built with ProGrip technology, engineered to give you the maximum traction and boost your performance in-game. ',
        },
        {
          question: 'Are the QYVE ProGrip Socks only for Futsal?',
          answer:
            'No, while it caters to the game of futsal’s agility and quick cuts, it is also widely used in other similar sports such as Padel, Pickle, Tennis, Badminton, Running and more. ',
        },
        {
          question: 'How do I wash and care for ProGrip Socks?',
          answer:
            'Machine Washable at a maximum 30 degrees, no tumble dry and no iron can be used.',
        },
        {
          question: 'What makes QYVE Recovery Slides unique?',
          answer:
            'It is designed with ultra-soft EVA foam that provides ergonomic value to your feet after a tiring game.',
        },
        {
          question: 'Can I wear QYVE Recovery Slides daily?',
          answer: 'Yes you can!',
        },
        {
          question: 'How do I care for my QYVE Recovery Slides?',
          answer:
            'Take a wet cloth or tissue and wipe the surface for any excess dirt. If there’s any stubborn stains, run cold water over the Slides and gently scrub off the stain with soap. After cleaning, let the slippers air-dry naturally. Avoid using direct heat sources like hair dryers. When not in use, store your slippers in a cool, dry place and away from direct sunlight as it may deform the colour.',
        },
        {
          question:
            'What colour sizes are available for the QYVE Recovery Slides?',
          answer:
            'They are available in Black and Beige and in 4 sizes which are EUR 38-39, EUR40-41, EUR42-43 and EUR43-45.',
        },
        {
          question: 'What material is the QYVE Retro Jersey made out of?',
          answer:
            'It is made out of Microfiber RJ which is a high-quality jersey material and is heat-resistant, sweat wicking and long-lasting.',
        },
        {
          question: 'What does Leyenda Espesial mean?',
          answer:
            "Especially legendary, inspired by the Argentinian iconic world cup squad from 1994. The 1994 home kit was a striking update on the traditional Argentinian sky blue and white stripes and had great significance as Maradona was included in this squad after a long absence. Relieve the magic of 1994 with QYVE's refreshed design and celebrate history's favourite moments with more from our retro series.",
        },
        {
          question: 'Can I customise the QYVE Retro Jersey?',
          answer:
            'Yes, you can! Contact us through our WhatsApp or contact form to let us know your name and number.',
        },
        {
          question: 'What sizes are available for the QYVE Retro Jersey?',
          answer: 'Available from size S to XXXL.',
        },
      ],
    },
    {
      category: 'Payment, Order and Shipping',
      data: [
        {
          question: 'How many payment options do you provide?',
          answer: 'We accept major credit cards, debit cards and fpx.',
        },
        {
          question: 'How long does shipping take?',
          answer:
            'All of Malaysia (except Sabah and Sarawak): 3-5 Working Days Sabah and Sarawak: 5-7 Working Days',
        },
        {
          question: 'Who is QYVE’s courier partner?',
          answer:
            'We use various service providers that can deliver the best service at the point of time.',
        },
        {
          question: 'How much is the shipping cost?',
          answer:
            'RM 8 for all of Malaysia (except Sabah and Sarawak): RM 10 Sabah and Sarawak: RM15',
        },
        {
          question: 'Can I track my order?',
          answer:
            'Yes, you will be provided the tracking number through email and in your accoutn under "my orders".',
        },
        {
          question: 'What if I receive the wrong item or size',
          answer:
            'We have a money-back guarantee policy, so if you receive the wrong item or size, we will return or refund the item (subject to the return policy).',
        },
      ],
    },
    {
      category: 'Customer Support',
      data: [
        {
          question: 'How do I contact QYVE?',
          answer:
            'You can reach out to us through our socials, or our WhatsApp.',
        },
        {
          question: 'What are our customer service hours?',
          answer:
            'We endeavour to reply to you as fast as we can. Official customer service hours are between 9am to 6pm daily.',
        },
        // {
        //   question: 'Are there any restocking fees for returns?',
        //   answer:
        //     'We do not charge restocking fees for returns. However, please review our return policy for specific details.',
        // },
        // {
        //   question: 'How long does it take to process a refund?',
        //   answer:
        //     'Refunds are typically processed within 5-7 business days after we receive the returned items and verify their condition.',
        // },
        // {
        //   question: "Can I return sneakers if I've worn them?",
        //   answer:
        //     'We only accept returns for unworn sneakers. Please try them on in a clean, indoor environment to ensure they are the right fit before wearing them outside.',
        // },
      ],
    },
  ],
};

const demoBlogData = {
  sectionOne: {
    title: 'What cleaning products are safe for different sneaker materials?',
    paragraph1:
      'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    points: [
      'Pretium nibh ipsum consequat nisl vel pretium. Sed vulputate mi sit',
      'Tristique nulla aliquet enim tortor at auctor urna. Sit amet aliquam id diam maer  dolore eu fugiat nulla pariatur',
      'Nam libero justo laoreet sit amet. Lacus sed viverra tellus in hac',
      'Tempus imperdiet nulla malesuada pellentesque elit eget gravida cum sociis',
    ],
    paragraph2:
      'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat',
  },
  sectionTwo: {
    title: 'Can you provide a step-by-step guide to cleaning sneakers?',
    description:
      'Augue lacus viverra vitae congue eu consequat ac felis donec. Pellentesque pulvinar pellentesque habitant morbi tristique senectus. Morbi tristique senectus et netus et malesuada fames ac turpis. Iaculis eu non diam phasellus vestibulum lorem sed.',
    midImage:
      'https:// images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  },
  sectionThree: {
    title: 'How do I prevent and remove stains from my sneakers?',
    description:
      'Augue lacus viverra vitae congue eu consequat ac felis donec. Pellentesque pulvinar pellentesque habitant morbi tristique senectus. Morbi tristique senectus et netus et malesuada fames ac turpis. Iaculis eu non diam phasellus vestibulum lorem sed.',
  },
  sectionFour: {
    title:
      'What are the best practices for drying sneakers without causing damage?',
    description:
      'Bibendum at varius vel pharetra vel turpis nunc. Dictumst quisque sagittis purus sit amet volutpat consequat mauris nunc. Volutpat est velit egestas dui id ornare.',
    points: [
      'Pretium nibh ipsum consequat nisl vel pretium. Sed vulputate mi sit',
      'Tristique nulla aliquet enim tortor at auctor urna. Sit amet aliquam id diam maer  dolore eu fugiat nulla pariatur',
      'Nam libero justo laoreet sit amet. Lacus sed viverra tellus in hac',
      'Tempus imperdiet nulla malesuada pellentesque elit eget gravida cum sociis',
    ],
  },
  quote:
    '“Lorem ipsum dolor sit amet, consectetur adipiscing elit. Dolor porta rhoncus, viverra sit et auctor. Augue in volutpat sed eget in etiam.”',
  sectionFive: [
    {
      title: 'How should I store my sneakers to maintain their quality?',
      description:
        'Tincidunt nunc pulvinar sapien et ligula. Sed blandit libero volutpat sed cras ornare arcu dui vivamus. Aliquet bibendum enim facilisis gravida neque convallis a cras. Molestie nunc non blandit massa enim nec dui nunc.',
    },
    {
      title:
        'What special care should be taken to extend the lifespan of sneakers?',
      description:
        'Tincidunt nunc pulvinar sapien et ligula. Sed blandit libero volutpat sed cras ornare arcu dui vivamus. Aliquet bibendum enim facilisis gravida neque convallis a cras. Molestie nunc non blandit massa enim nec dui nunc.',
    },
  ],
};

export const blogs: BlogType[] = [
  {
    title: 'The Evolution of Sneaker Culture: A Historical Perspective',
    brief:
      'Lorem ipsum dolor sit amet, lormol amenrtol consectetur adipiscing elit, sed do eiusmod tempor.',
    date: 'October 2, 2022',
    coverImage:
      'https:// images.unsplash.com/photo-1455849318743-b2233052fcff?q=80&w=1469&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    blogData: demoBlogData,
    tag: 'Style',
    slug: 'the-evolution-of-sneaker-culture-a-historical-perspective',
  },
  {
    title: 'Top 10 Sneaker Trends to Watch in 2023',
    brief:
      'Lorem ipsum dolor sit amet, lormol amenrtol consectetur adipiscing elit, sed do eiusmod tempor.',
    date: 'October 2, 2022',
    coverImage:
      'https:// images.unsplash.com/photo-1448387473223-5c37445527e7?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    blogData: demoBlogData,
    tag: 'Fitting',
    slug: 'top-10-sneaker-trends-to-watch-in-2023',
  },
  {
    title: 'How to Clean and Maintain Your Sneaker Collection',
    brief:
      'Lorem ipsum dolor sit amet, lormol amenrtol consectetur adipiscing elit, sed do eiusmod tempor.',
    date: 'October 2, 2022',
    coverImage:
      'https:// images.unsplash.com/photo-1469395446868-fb6a048d5ca3?q=80&w=1633&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    blogData: demoBlogData,
    tag: 'Style',
    slug: 'how-to-clean-and-maintain-your-sneaker-collection',
  },
  {
    title:
      'The Influence of Sneaker Collaborations: From Athletes to Designers',
    brief:
      'Lorem ipsum dolor sit amet, lormol amenrtol consectetur adipiscing elit, sed do eiusmod tempor.',
    date: 'October 2, 2022',
    coverImage:
      'https:// images.unsplash.com/photo-1659614404055-670edff49a1b?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    blogData: demoBlogData,
    tag: 'General',
    slug: 'the-influence-of-sneaker-collaborations-from-athletes-to-designers',
  },
  {
    title: 'Sneaker Sizing Guide: Finding the Perfect Fit',
    brief:
      'Lorem ipsum dolor sit amet, lormol amenrtol consectetur adipiscing elit, sed do eiusmod tempor.',
    date: 'October 2, 2022',
    coverImage:
      'https:// images.unsplash.com/photo-1515396800500-75d7b90b3b94?q=80&w=1492&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    blogData: demoBlogData,
    tag: 'Style',
    slug: 'sneaker-sizing-guide-finding-the-perfect-fit',
  },
  {
    title:
      'Sneaker Collecting 101: Building and Organizing Your Sneaker Collection',
    brief:
      'Lorem ipsum dolor sit amet, lormol amenrtol consectetur adipiscing elit, sed do eiusmod tempor.',
    date: 'October 2, 2022',
    coverImage:
      'https:// images.unsplash.com/photo-1552346154-21d32810aba3?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    blogData: demoBlogData,
    tag: 'Fitting',
    slug: 'sneaker-collecting-101-building-and-organizing-your-sneaker-collection',
  },
  {
    title: 'Behind the Design: Sneaker Production Process Unveiled',
    brief:
      'Lorem ipsum dolor sit amet, lormol amenrtol consectetur adipiscing elit, sed do eiusmod tempor.',
    date: 'October 2, 2022',
    coverImage:
      'https:// images.unsplash.com/photo-1565814636199-ae8133055c1c?q=80&w=1480&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    blogData: demoBlogData,
    tag: 'General',
    slug: 'behind-the-design-sneaker-production-process-unveiled',
  },
  {
    title:
      'Exploring Limited Edition Sneaker Drops: How to Cop Exclusive Releases',
    brief:
      'Lorem ipsum dolor sit amet, lormol amenrtol consectetur adipiscing elit, sed do eiusmod tempor.',
    date: 'October 2, 2022',
    coverImage:
      'https:// images.unsplash.com/photo-1495555961986-6d4c1ecb7be3?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    blogData: demoBlogData,
    tag: 'General',
    slug: 'exploring-limited-edition-sneaker-drops-how-to-cop-exclusive-releases',
  },
  {
    title: 'Sneaker Spotlight: Nike Review and Styling Tips',
    brief:
      'Lorem ipsum dolor sit amet, lormol amenrtol consectetur adipiscing elit, sed do eiusmod tempor.',
    date: 'October 2, 2022',
    coverImage:
      'https:// images.unsplash.com/photo-1607522370275-f14206abe5d3?q=80&w=1421&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    blogData: demoBlogData,
    tag: 'Style',
    slug: 'sneaker-spotlight-nike-review-and-styling-tips',
  },
  {
    title: 'Sustainable Sneaker Choices: Eco-Friendly Options in the Market',
    brief:
      'Lorem ipsum dolor sit amet, lormol amenrtol consectetur adipiscing elit, sed do eiusmod tempor.',
    date: 'October 2, 2022',
    coverImage:
      'https:// images.unsplash.com/flagged/photo-1556637640-2c80d3201be8?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    blogData: demoBlogData,
    tag: 'Style',
    slug: 'sustainable-sneaker-choices-eco-friendly-options-in-the-market',
  },
];

export const productsCollection = {
  heading: 'Shoes Collection',
  description:
    'Lorem ipsum dolor sit amet consectetur adipiscing elit facilisi pellentesque cursus eget morbi sagittis sagittis.',
};
