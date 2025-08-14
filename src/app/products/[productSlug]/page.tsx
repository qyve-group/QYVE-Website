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
  const { data: product, error: productError } = await supabase
    .from('products')
    .select(
      // 'id, name, price, previous_price, image_cover, overview, shipment_details, colors, product_shots(images), products_sizes(size, stock), product_colors(id, color, stock, image)',
      'id, name, price, previous_price, image_cover, overview, shipment_details, colors, product_shots(images), product_colors(id, color, product_id, image), products_sizes(id, size, stock, product_id, product_color_id)',
    )
    .eq('slug', productSlug)
    .single();

  if (productError || !product) {
    return null;
  }

  // // console.log*("Fetched Product:", product);

  // Fetch sizes using the product ID
  // const { data: sizes, error: sizesError } = await supabase
  //   .from('products_sizes')
  //   .select('size, stock, product_id')
  //   .eq('product_id', product.id)
  //   .throwOnError();

  // if (sizesError) {
  //   // console.error*('Failed to fetch sizes:', sizesError);
  // }

  // return { ...product, products_sizes: sizes || [] }; // This spreads all properties of product and adds products_sizes as a new field.
  return product;
};

const SingleProductPage = async ({ params }: Props) => {
  const selectedProduct = await getProductData(params.productSlug);
  console.log('selected Product: ', selectedProduct);

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
