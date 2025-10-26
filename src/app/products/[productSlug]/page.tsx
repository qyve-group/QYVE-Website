// "use client";
import { pathOr } from 'ramda';
import React from 'react';

import { trackProductView } from '@/lib/gtag';
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
      .select(
        'id, name, price, previous_price, image_cover, overview, shipment_details, colors, product_shots(images), product_colors(id, color, product_id, image), products_sizes(id, size, stock, product_id, product_color_id)',
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
    'qyve-recovery-slides': {
      id: 9,
      name: 'QYVE Recovery Slides',
      price: 30,
      previous_price: 35,
      image_cover: '/slides_life.jpg',
      overview:
        'Comfortable recovery slides for post-game relaxation. Designed with premium materials for ultimate comfort and support after intense training sessions.',
      shipment_details:
        'Free shipping on orders over RM50. Estimated delivery: 3-5 business days.',
      colors: ['black', 'cream'],
      product_shots: [{ images: ['/slides_life.jpg', '/slides_life2.jpg'] }],
      product_colors: [
        { id: 4, color: 'black', product_id: 9, image: '/slides_life.jpg' },
        { id: 5, color: 'cream', product_id: 9, image: '/slides_life2.jpg' },
      ],
      products_sizes: [
        { id: 11, size: '6', stock: 3, product_id: 9, product_color_id: 4 },
        { id: 12, size: '7', stock: 5, product_id: 9, product_color_id: 4 },
        { id: 13, size: '8', stock: 4, product_id: 9, product_color_id: 4 },
        { id: 14, size: '9', stock: 6, product_id: 9, product_color_id: 4 },
        { id: 15, size: '10', stock: 4, product_id: 9, product_color_id: 4 },
        { id: 16, size: '11', stock: 3, product_id: 9, product_color_id: 4 },
        { id: 17, size: '12', stock: 2, product_id: 9, product_color_id: 4 },
        { id: 18, size: '6', stock: 2, product_id: 9, product_color_id: 5 },
        { id: 19, size: '7', stock: 4, product_id: 9, product_color_id: 5 },
        { id: 20, size: '8', stock: 3, product_id: 9, product_color_id: 5 },
        { id: 21, size: '9', stock: 5, product_id: 9, product_color_id: 5 },
        { id: 22, size: '10', stock: 3, product_id: 9, product_color_id: 5 },
        { id: 23, size: '11', stock: 2, product_id: 9, product_color_id: 5 },
        { id: 24, size: '12', stock: 1, product_id: 9, product_color_id: 5 },
      ],
    },
    'qyve-progrip-socks': {
      id: 6,
      name: 'QYVE ProGrip Socks',
      price: 18,
      previous_price: 22,
      image_cover: '/socks_white.png',
      overview:
        'High-performance socks with advanced grip technology. Designed for athletes who demand superior traction and comfort during intense training sessions.',
      shipment_details:
        'Free shipping on orders over RM50. Estimated delivery: 3-5 business days.',
      colors: ['white', 'black'],
      product_shots: [{ images: ['/socks_white.png', '/socks_black.png'] }],
      product_colors: [
        { id: 6, color: 'white', product_id: 6, image: '/socks_white.png' },
        { id: 7, color: 'black', product_id: 6, image: '/socks_black.png' },
      ],
      products_sizes: [
        { id: 25, size: 'S', stock: 3, product_id: 6, product_color_id: 6 },
        { id: 26, size: 'M', stock: 5, product_id: 6, product_color_id: 6 },
        { id: 27, size: 'L', stock: 4, product_id: 6, product_color_id: 6 },
        { id: 28, size: 'XL', stock: 2, product_id: 6, product_color_id: 6 },
        { id: 29, size: 'S', stock: 2, product_id: 6, product_color_id: 7 },
        { id: 30, size: 'M', stock: 4, product_id: 6, product_color_id: 7 },
        { id: 31, size: 'L', stock: 3, product_id: 6, product_color_id: 7 },
        { id: 32, size: 'XL', stock: 1, product_id: 6, product_color_id: 7 },
      ],
    },
    'qyve-leyenda-94-series': {
      id: 7,
      name: 'QYVE Leyenda \'94 Series',
      price: 50,
      previous_price: 60,
      image_cover: '/jersey_pic.jpg',
      overview:
        'Premium jersey with classic design inspired by the legendary \'94 series. Features premium materials and retro styling for ultimate comfort and style.',
      shipment_details:
        'Free shipping on orders over RM50. Estimated delivery: 3-5 business days.',
      colors: ['black', 'pink'],
      product_shots: [{ images: ['/jersey_pic.jpg', '/jersey_pic_2.jpg'] }],
      product_colors: [
        { id: 8, color: 'black', product_id: 7, image: '/jersey_pic.jpg' },
        { id: 9, color: 'pink', product_id: 7, image: '/jersey_pic_2.jpg' },
      ],
      products_sizes: [
        { id: 33, size: 'S', stock: 3, product_id: 7, product_color_id: 8 },
        { id: 34, size: 'M', stock: 5, product_id: 7, product_color_id: 8 },
        { id: 35, size: 'L', stock: 4, product_id: 7, product_color_id: 8 },
        { id: 36, size: 'XL', stock: 2, product_id: 7, product_color_id: 8 },
        { id: 37, size: 'S', stock: 2, product_id: 7, product_color_id: 9 },
        { id: 38, size: 'M', stock: 4, product_id: 7, product_color_id: 9 },
        { id: 39, size: 'L', stock: 3, product_id: 7, product_color_id: 9 },
        { id: 40, size: 'XL', stock: 1, product_id: 7, product_color_id: 9 },
      ],
    },
  };

  return demoProducts[productSlug] || null;
};

const SingleProductPage = async ({ params }: Props) => {
  const selectedProduct = await getProductData(params.productSlug);
  console.log('selected Product: ', selectedProduct);

  trackProductView({
    item_id: selectedProduct?.id,
    item_name: selectedProduct?.name,
    price: selectedProduct?.price,
    currency: 'MYR',
    item_category: 'Apparel',
    item_brand: 'QYVE',
    image_url: selectedProduct?.image_cover,
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
          product_shots={selectedProduct?.product_shots?.[0]?.images || []}
          // product_shots={images:{pathOr([], ['product_shots', 'images'], selectedProduct)}}
          // product_colors={pathOr([], ['product_colors'], selectedProduct)  as { id: number; color: string; stock: number }
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
