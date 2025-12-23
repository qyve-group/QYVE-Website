'use client';

import Link from 'next/link';
import React, { useEffect, useState } from 'react';

// import Filter from '@/components/Filter';
import ProductCard from '@/components/ProductCard';
import { productsSection } from '@/data/content';
import { supabase } from '@/libs/supabaseClient';
import ButtonPrimary from '@/shared/Button/ButtonPrimary';
import Heading from '@/shared/Heading/Heading';
// import { useRouter } from 'next/navigation';

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

const SectionProducts = () => {
  // console.log*('Supabase client initialized:', supabase);

  // const router = useRouter();

  const [products, setProducts] = useState<Product[]>();
  const getImageCover = (slug: string) => {
    return `/products/${slug}/${slug}_1.webp`;
  };

  useEffect(() => {
    const fetchProducts = async () => {
      // Check if we have valid Supabase credentials
      if (
        !process.env.NEXT_PUBLIC_SUPABASE_URL ||
        process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder')
      ) {
        console.log('Using demo products - Supabase not configured');
        // Use demo products
        setProducts([
          {
            id: 7,
            name: 'Demo Product 1',
            description: 'Demo description',
            price: 99,
            stock: 10,
            category_id: 1,
            created_at: new Date(),
            slug: 'demo-1',
            previous_price: 120,
            image_cover: '/socks_black.png',
            colors: ['black'],
          },
          {
            id: 9,
            name: 'Demo Product 2',
            description: 'Demo description',
            price: 89,
            stock: 5,
            category_id: 1,
            created_at: new Date(),
            slug: 'demo-2',
            previous_price: 110,
            image_cover: '/socks_white.png',
            colors: ['white'],
          },
          {
            id: 6,
            name: 'Demo Product 3',
            description: 'Demo description',
            price: 79,
            stock: 8,
            category_id: 1,
            created_at: new Date(),
            slug: 'demo-3',
            previous_price: 100,
            image_cover: '/jersey_pic.jpg',
            colors: ['blue'],
          },
        ]);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('products')
          .select(
            'id, name, description, price, stock, category_id, created_at, slug, previous_price, colors',
          )
          .in('id', [11, 9, 6]);

        const productsWithImages = data?.map((product) => ({
          ...product,
          image_cover: getImageCover(product.slug),
        }));

        if (error) {
          console.error('Error fetching products: ', error);
          // Fallback to demo products on error
          setProducts([]);
        } else {
          setProducts(productsWithImages);
        }
      } catch (err) {
        console.error('Failed to connect to Supabase:', err);
        setProducts([]);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="container">
      <Heading isCenter isMain desc={productsSection.description}>
        <div className="mb-2 mt-8 font-myFont text-3xl italic leading-tight md:text-4xl">
          {productsSection.heading}
        </div>
      </Heading>
      {/* <Filter /> */}

      <div className="grid gap-7 md:grid-cols-2 lg:grid-cols-3">
        {products && products.length > 0 ? (
          products
            .slice(0, 3)
            .map((product) => (
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

      <div className="mt-8 flex items-center justify-center">
        <Link href="/shop">
          <ButtonPrimary
            type="button"
            // onClick={() => {
            //   router.push('/shop');
            // }}
          >
            Explore more
          </ButtonPrimary>
        </Link>
      </div>
    </div>
  );
};

export default SectionProducts;
