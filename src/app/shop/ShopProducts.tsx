'use client';

import React, { useEffect, useState } from 'react';

// import Filter from '@/components/Filter';
import ProductCard from '@/components/ProductCard';
import { productsSection } from '@/data/content';
import { supabase } from '@/libs/supabaseClient';
import Heading from '@/shared/Heading/Heading';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  category_id: number;
  created_at: Date;
  slug: string;
  previous_price: number;
  image_cover: string;
  colors: string[];
}

const ShopProducts = () => {
  // console.log*('Supabase client initialized:', supabase);

  const [products, setProducts] = useState<Product[]>();

  useEffect(() => {
    const fetchProducts = async () => {
      const { data, error } = await supabase.from('products').select();

      // console.log*('Fetched products:', data);
      // console.log*('Supabase error:', error);

      if (error) {
        // console.error*('Error fetching products: ', error);
      } else {
        setProducts(data);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="container">
      <Heading isCenter isMain desc={productsSection.description}>
        <div className="mt-8 font-myFont text-4xl italic">
          {/* {productsSection.heading} */}
          Products
        </div>
      </Heading>
      {/* <Filter /> */}

      <div className="grid gap-7 md:grid-cols-2 lg:grid-cols-3">
        {products && products.length > 0 ? (
          products.map((product) => (
            <ProductCard
              key={product.name}
              product={product}
              className="rounded-2xl border-neutral-300"
            />
          ))
        ) : (
          <p>Loading</p>
        )}

        {/* {products?.map((product) => (
          <ProductCard
            key={product.name}
            product={product}
            className="border-neutral-300"
          />
        ))} */}
      </div>

      {/* <div className="mt-8 flex items-center justify-center">
        <ButtonPrimary>Explore more</ButtonPrimary>
      </div> */}
    </div>
  );
};

export default ShopProducts;
