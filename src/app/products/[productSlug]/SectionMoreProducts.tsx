'use client';

import React from 'react';

import ProductCard from '@/components/ProductCard';
// import { shoes } from '@/data/content';
import Heading from '@/shared/Heading/Heading';
import { useEffect, useState } from 'react';
import { supabase } from '@/libs/supabaseClient';

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
}

type SelectedProduct = {
  selectedProductName: any;
};

const SectionMoreProducts = ({ selectedProductName }: SelectedProduct) => {
  const [products, setProducts] = useState<Product[]>();

  useEffect(() => {
    const fetchProducts = async () => {
      const { data, error } = await supabase.from('products').select();

      if (error) {
        // console.error*('Error fetching products: ', error);
      } else {
        setProducts(data);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div>
      <Heading className="mb-0">Explore more products</Heading>

      <div className="grid gap-7 md:grid-cols-2 lg:grid-cols-3">
        {products && products.length > 0 ? (
          products
            .filter((product) => product.name !== selectedProductName)
            .slice(0, 3)
            .map((product) => (
              <ProductCard
                key={product.name}
                product={product}
                className="border-neutral-300"
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

      {/* <div className="grid gap-7 md:grid-cols-3 lg:grid-cols-3">
        {products.map((product) => (
          <ProductCard
            key={shoe.shoeName}
            product={shoe}
            className="border-neutral-300"
          />
        ))}
      </div> */}
    </div>
  );
};

export default SectionMoreProducts;
