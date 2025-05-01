// "use client";
import { pathOr } from 'ramda';
import React from 'react';

// import { useEffect, useState } from "react";
// import { shoes } from "@/data/content";
import { supabase } from '@/libs/supabaseClient';

// import SectionMoreProducts from "./SectionMoreProducts";
import SectionNavigation from './SectionNavigation';
import SectionProductHeader from './SectionProductHeader';
import SectionProductInfo from './SectionProductInfo';

type Props = {
  params: { productSlug: string };
  // searchParams: { [key: string]: string | string[] | undefined };
};

export const fetchCache = 'force-no-store'; // Prevents caching
const getProductData = async (productSlug: string) => {
  const { data: product, error: productError } = await supabase
    .from('products')
    .select('id, name, price, previous_price, image_cover')
    .eq('slug', productSlug)
    .single();

  if (productError || !product) {
    // console.error*('Failed to fetch product:', productError);
    return null;
  }

  // // console.log*("Fetched Product:", product);

  // Fetch sizes using the product ID
  const { data: sizes, error: sizesError } = await supabase
    .from('products_sizes')
    .select('size, stock, product_id')
    .eq('product_id', product.id)
    .throwOnError();

  if (sizesError) {
    // console.error*('Failed to fetch sizes:', sizesError);
  }

  return { ...product, products_sizes: sizes || [] }; // This spreads all properties of product and adds products_sizes as a new field.
};

const SingleProductPage = async ({ params }: Props) => {
  const selectedProduct = await getProductData(params.productSlug);

  return (
    <div className="container">
      <SectionNavigation />

      <div className="mb-20">
        <SectionProductHeader
          // shots={pathOr([], ["shots"], selectedProduct)}
          id={pathOr(0, ['id'], selectedProduct)}
          name={pathOr('', ['name'], selectedProduct)}
          price={pathOr(0, ['price'], selectedProduct)}
          previous_price={pathOr(0, ['previous_price'], selectedProduct)}
          image_cover={pathOr('', ['image_cover'], selectedProduct)}
          // sizes={pathOr([], ["sizes"], selectedProduct)}
          products_sizes={pathOr([], ['products_sizes'], selectedProduct)}
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
          overview={pathOr('', ['overview'], selectedProduct)}
          shipment_details={pathOr([], ['shipment_details'], selectedProduct)}
          // ratings={pathOr(0, ["rating"], selectedProduct)}
          // reviews={pathOr(0, ["reviews"], selectedProduct)}
        />
      </div>

      {/* <div className="mb-28">
        <SectionMoreProducts />
      </div> */}
    </div>
  );
};

export default SingleProductPage;
