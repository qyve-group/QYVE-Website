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
      // Check if Supabase is configured
      if (!process.env.NEXT_PUBLIC_SUPABASE_URL || 
          process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder')) {
        console.log('Using demo products - Supabase not configured');
        // Use demo products
        const demoProducts = [
          { id: 7, name: 'Classic Black Socks', description: 'Premium cotton blend socks in classic black', price: 25, stock: 10, category_id: 1, created_at: new Date(), slug: 'classic-black-socks', previous_price: 30, image_cover: '/socks_black.png', colors: ['black'] },
          { id: 9, name: 'Essential White Socks', description: 'Comfortable white socks for everyday wear', price: 25, stock: 5, category_id: 1, created_at: new Date(), slug: 'essential-white-socks', previous_price: 30, image_cover: '/socks_white.png', colors: ['white'] },
          { id: 6, name: 'QYVE Jersey', description: 'Premium sport jersey with QYVE branding', price: 85, stock: 8, category_id: 1, created_at: new Date(), slug: 'qyve-jersey', previous_price: 100, image_cover: '/jersey_pic.jpg', colors: ['blue'] }
        ];
        setProducts(demoProducts);
        return;
      }

      try {
        const { data, error } = await supabase.from('products').select();

        if (error) {
          console.error('Error fetching products from Supabase:', error);
          // Fallback to demo products if Supabase fails
          const demoProducts = [
            { id: 7, name: 'Classic Black Socks', description: 'Premium cotton blend socks in classic black', price: 25, stock: 10, category_id: 1, created_at: new Date(), slug: 'classic-black-socks', previous_price: 30, image_cover: '/socks_black.png', colors: ['black'] },
            { id: 9, name: 'Essential White Socks', description: 'Comfortable white socks for everyday wear', price: 25, stock: 5, category_id: 1, created_at: new Date(), slug: 'essential-white-socks', previous_price: 30, image_cover: '/socks_white.png', colors: ['white'] },
            { id: 6, name: 'QYVE Jersey', description: 'Premium sport jersey with QYVE branding', price: 85, stock: 8, category_id: 1, created_at: new Date(), slug: 'qyve-jersey', previous_price: 100, image_cover: '/jersey_pic.jpg', colors: ['blue'] }
          ];
          setProducts(demoProducts);
        } else {
          setProducts(data);
        }
      } catch (error) {
        console.error('Network error fetching products:', error);
        // Fallback to demo products on network error
        const demoProducts = [
          { id: 7, name: 'Classic Black Socks', description: 'Premium cotton blend socks in classic black', price: 25, stock: 10, category_id: 1, created_at: new Date(), slug: 'classic-black-socks', previous_price: 30, image_cover: '/socks_black.png', colors: ['black'] },
          { id: 9, name: 'Essential White Socks', description: 'Comfortable white socks for everyday wear', price: 25, stock: 5, category_id: 1, created_at: new Date(), slug: 'essential-white-socks', previous_price: 30, image_cover: '/socks_white.png', colors: ['white'] },
          { id: 6, name: 'QYVE Jersey', description: 'Premium sport jersey with QYVE branding', price: 85, stock: 8, category_id: 1, created_at: new Date(), slug: 'qyve-jersey', previous_price: 100, image_cover: '/jersey_pic.jpg', colors: ['blue'] }
        ];
        setProducts(demoProducts);
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
