// "use client";
import { pathOr } from 'ramda';
import React from 'react';

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
  };

  return demoProducts[productSlug] || null;
};

const getShots = (slug: string) => {
  let shots = [];
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

  event('view_item', {
    currency: 'MYR',
    value: selectedProduct?.price,
    items: [
      {
        item_id: selectedProduct?.id,
        item_name: selectedProduct?.name,
        // affiliation: "Google Merchandise Store",
        // coupon: "SUMMER_FUN",
        // discount: 2.22,
        // index: 0,
        // item_brand: "Google",
        // item_category: "Apparel",
        // item_category2: "Adult",
        // item_category3: "Shirts",
        // item_category4: "Crew",
        // item_category5: "Short sleeve",
        // item_list_id: "related_products",
        // item_list_name: "Related Products",
        // item_variant: "green",
        // location_id: "ChIJIQBpAG2ahYAR_6128GcTUEo",
        // price: selectedProduct?.price,
        // quantity: 3
      },
    ],
  });

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

      <div className="mb-28">
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

      <div className="mb-28">
        <SectionMoreProducts selectedProductName={selectedProduct?.name} />
      </div>
    </div>
  );
};

export default SingleProductPage;
