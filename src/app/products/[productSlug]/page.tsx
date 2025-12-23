// "use client";
/* eslint-disable no-plusplus */

import { pathOr } from 'ramda';
import React from 'react';

import SubZeroSizeChart from '@/app/campaigns/subzero/SubZeroSizeChart';
import { event } from '@/lib/gtag';
// import { useEffect, useState } from "react";
// import { shoes } from "@/data/content";
import { supabase } from '@/libs/supabaseClient';

import SectionMoreProducts from './SectionMoreProducts';
// import SectionMoreProducts from "./SectionMoreProducts";
// import SectionNavigation from './SectionNavigation';
import SectionProductHeader from './SectionProductHeader';
import SectionProductInfo from './SectionProductInfo';

type Props = {
  params: { productSlug: string };
  // searchParams: { [key: string]: string | string[] | undefined };
};

type ProductColor = {
  id: number;
  product_id: number;
  color: string;
  image: string;
};

export const fetchCache = 'force-no-store'; // Prevents caching
const getProductData = async (productSlug: string) => {
  console.log('productSlug: ', productSlug);

  try {
    const { data: product, error: productError } = await supabase
      .from('products')
      // .select(
      //   'id, name, price, previous_price, image_cover, overview, shipment_details, colors, product_shots(images), product_colors(id, color, product_id, image), products_sizes(id, size, stock, product_id, product_color_id)',
      // )
      .select(
        'id, name, price, previous_price, overview, shipment_details, colors, product_colors(id, color, product_id, image), products_sizes(id, size, stock, product_id, product_color_id)',
      )
      .eq('slug', productSlug)
      .single();

    if (productError || !product) {
      console.log(
        'Product not found in database, creating demo product for:',
        productSlug,
      );
      // Return demo product data based on slug
      /* eslint-disable-next-line @typescript-eslint/no-use-before-define */
      return createDemoProduct(productSlug);
    }

    return product;
  } catch (error) {
    console.error('Error fetching product from Supabase:', error);
    // Return demo product on any error
    /* eslint-disable-next-line @typescript-eslint/no-use-before-define */
    return createDemoProduct(productSlug);
  }
};

const createDemoProduct = (productSlug: string) => {
  // Create demo products based on the slugs from shop page
  const demoProducts: { [key: string]: any } = {
    'classic-black-socks': {
      id: 7,
      name: 'Classic Black Socks',
      price: 25,
      previous_price: 30,
      image_cover: '/socks_black.png',
      overview:
        'Premium cotton blend socks in classic black. Perfect for everyday wear with superior comfort and durability.',
      shipment_details:
        'Free shipping on orders over RM50. Estimated delivery: 3-5 business days.',
      colors: ['black'],
      product_shots: [{ images: ['/socks_black.png'] }],
      product_colors: [
        { id: 1, color: 'black', product_id: 7, image: '/socks_black.png' },
      ],
      products_sizes: [
        { id: 1, size: 'S', stock: 10, product_id: 7, product_color_id: 1 },
        { id: 2, size: 'M', stock: 15, product_id: 7, product_color_id: 1 },
        { id: 3, size: 'L', stock: 12, product_id: 7, product_color_id: 1 },
      ],
    },
    'essential-white-socks': {
      id: 9,
      name: 'Essential White Socks',
      price: 25,
      previous_price: 30,
      image_cover: '/socks_white.png',
      overview:
        'Comfortable white socks for everyday wear. Made with high-quality materials for long-lasting comfort.',
      shipment_details:
        'Free shipping on orders over RM50. Estimated delivery: 3-5 business days.',
      colors: ['white'],
      product_shots: [{ images: ['/socks_white.png'] }],
      product_colors: [
        { id: 2, color: 'white', product_id: 9, image: '/socks_white.png' },
      ],
      products_sizes: [
        { id: 4, size: 'S', stock: 8, product_id: 9, product_color_id: 2 },
        { id: 5, size: 'M', stock: 12, product_id: 9, product_color_id: 2 },
        { id: 6, size: 'L', stock: 10, product_id: 9, product_color_id: 2 },
      ],
    },
    'qyve-jersey': {
      id: 6,
      name: 'QYVE Jersey',
      price: 85,
      previous_price: 100,
      image_cover: '/jersey_pic.jpg',
      overview:
        'Premium sport jersey with QYVE branding. Designed for performance and style with moisture-wicking technology.',
      shipment_details:
        'Free shipping on orders over RM50. Estimated delivery: 3-5 business days.',
      colors: ['blue'],
      product_shots: [{ images: ['/jersey_pic.jpg'] }],
      product_colors: [
        { id: 3, color: 'blue', product_id: 6, image: '/jersey_pic.jpg' },
      ],
      products_sizes: [
        { id: 7, size: 'S', stock: 5, product_id: 6, product_color_id: 3 },
        { id: 8, size: 'M', stock: 8, product_id: 6, product_color_id: 3 },
        { id: 9, size: 'L', stock: 6, product_id: 6, product_color_id: 3 },
        { id: 10, size: 'XL', stock: 4, product_id: 6, product_color_id: 3 },
      ],
    },
    // subzero: {
    //   id: 100,
    //   name: 'Subzero',
    //   price: 215,
    //   previous_price: '238',
    //   image_cover: '/products/subzero/subzero_1.webp',
    //   overview:
    //     'Built for players who stay cool under pressure. Subzero is Malaysia-made and designed to dominate every futsal match.\n\nUpper: Mesh and microfibre\nMidsole: EVA\nOutsole: Non-marking rubber\n\n',
    //   shipment_details:
    //     'Each Subzero piece is individually handcrafted to order. Please allow up to two weeks for delivery after payment confirmation.\n\n📦 Delivery Time:\n\nStandard delivery: 7-14 days\n\n💰 Estimated Shipping Rates: \nWest Malaysia: RM8\n Sabah & Sarawak: RM15\n\nTracking will be provided once your order is shipped.',
    //   colors: ['white'],
    //   product_shots: [{ images: ['/products/subzero/subzero_1.webp'] }],
    //   product_colors: [
    //     {
    //       id: 100,
    //       color: 'white',
    //       product_id: 100,
    //       image: '/products/subzero/subzero_1.webp',
    //     },
    //   ],
    //   products_sizes: [
    //     {
    //       id: 101,
    //       size: '39',
    //       stock: 50,
    //       product_id: 100,
    //       product_color_id: 100,
    //     },
    //     {
    //       id: 102,
    //       size: '40',
    //       stock: 50,
    //       product_id: 100,
    //       product_color_id: 100,
    //     },
    //     {
    //       id: 103,
    //       size: '41',
    //       stock: 50,
    //       product_id: 100,
    //       product_color_id: 100,
    //     },
    //     {
    //       id: 104,
    //       size: '42',
    //       stock: 50,
    //       product_id: 100,
    //       product_color_id: 100,
    //     },
    //     {
    //       id: 105,
    //       size: '43',
    //       stock: 50,
    //       product_id: 100,
    //       product_color_id: 100,
    //     },
    //     {
    //       id: 106,
    //       size: '44',
    //       stock: 50,
    //       product_id: 100,
    //       product_color_id: 100,
    //     },
    //     {
    //       id: 107,
    //       size: '45',
    //       stock: 50,
    //       product_id: 100,
    //       product_color_id: 100,
    //     },
    //   ],
    // },
  };

  return demoProducts[productSlug] || null;
};

const getShots = (slug: string) => {
  const shots = [];

  for (let num = 1; num < 5; num++) {
    shots.push(`/products/${slug}/${slug}_${num}.webp`);
    // shots.push(`/products/subzero/subzero_${num}.webp`);
  }
  return shots;
};

const SingleProductPage = async ({ params }: Props) => {
  const selectedProduct = await getProductData(params.productSlug);
  console.log('selected Product: ', selectedProduct);

  const shots = getShots(params.productSlug);

  // Calculate total stock from all sizes
  const totalStock =
    selectedProduct?.products_sizes?.reduce(
      (sum: number, size: { stock: number }) => sum + (size.stock || 0),
      0,
    ) || 0;

  const isOutOfStock = totalStock === 0;

  event('view_item', {
    currency: 'MYR',
    value: selectedProduct?.price,
    items: [
      {
        item_id: selectedProduct?.id,
        item_name: selectedProduct?.name,
      },
    ],
  });

  // Show out of stock page
  if (isOutOfStock) {
    return (
      <div className="container py-20">
        <div className="mx-auto max-w-2xl text-center">
          <div className="mb-8 flex justify-center">
            <div className="bg-gray-100 flex size-24 items-center justify-center rounded-full">
              <svg
                className="text-gray-400 size-12"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20 12H4M12 20V4"
                  transform="rotate(45 12 12)"
                />
              </svg>
            </div>
          </div>
          <h1 className="text-gray-900 mb-4 text-3xl font-bold">
            {selectedProduct?.name || 'Product'}
          </h1>
          <p className="text-gray-600 mb-8 text-xl">
            This product is currently out of stock.
          </p>
          <p className="text-gray-500 mb-8">
            We&apos;re working on restocking. Please check back later or browse
            our other products.
          </p>
          <a
            href="/shop"
            className="inline-block rounded-full bg-primary px-8 py-3 font-semibold text-white transition hover:bg-primary/90"
          >
            Browse Other Products
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      {/* <SectionNavigation /> */}

      <div className="mb-20">
        <SectionProductHeader
          // shots={pathOr([], ["shots"], selectedProduct)}
          // id={pathOr(0, ['id'], selectedProduct)}
          name={pathOr('', ['name'], selectedProduct)}
          price={pathOr(0, ['price'], selectedProduct)}
          previous_price={pathOr(0, ['previous_price'], selectedProduct)}
          // image_cover={pathOr('', ['image_cover'], selectedProduct)}
          slug={params.productSlug}
          // sizes={pathOr([], ["sizes"], selectedProduct)}
          products_sizes={pathOr([], ['products_sizes'], selectedProduct)}
          // colors={pathOr([], ['colors'], selectedProduct)}
          // product_shots={selectedProduct?.product_shots?.[0]?.images || []}
          product_shots={shots}
          product_colors={
            pathOr([], ['product_colors'], selectedProduct) as ProductColor[]
          }
          // currentPrice={pathOr(0, ["currentPrice"], selectedProduct)}
          // rating={pathOr(0, ["rating"], selectedProduct)}
          // pieces_sold={pathOr(0, ["pieces_sold"], selectedProduct)}
          // reviews={pathOr(0, ["reviews"], selectedProduct)}
          // name={selectedProduct.name}
          // price={selectedProduct.price}
          // previous_price={selectedProduct.previous_price}
          // image_cover={selectedProduct.image_cover}
          // sizes={selectedProduct.sizes || []} // ✅ Ensure sizes is an array
          // id={selectedProduct.id}
        />
      </div>

      <div className={params.productSlug === 'subzero' ? 'mb-8' : 'mb-28'}>
        <SectionProductInfo
          // product_shots={selectedProduct?.product_shots?.[0]?.images || []}
          overview={selectedProduct?.overview || ''}
          shipment_details={selectedProduct?.shipment_details || ''}
          // overview={pathOr('', ['overview'], selectedProduct)}
          // shipment_details={pathOr([], ['shipment_details'], selectedProduct)}
          // ratings={pathOr(0, ["rating"], selectedProduct)}
          // reviews={pathOr(0, ["reviews"], selectedProduct)}
        />
      </div>

      {params.productSlug === 'subzero' && (
        <>
          {/* <SubZeroFeatures /> */}
          <SubZeroSizeChart />
          {/* <SubZeroTestimonials />
          <SubZeroFAQs /> */}
        </>
      )}

      <div className="mb-28">
        <SectionMoreProducts selectedProductName={selectedProduct?.name} />
      </div>
    </div>
  );
};

export default SingleProductPage;
