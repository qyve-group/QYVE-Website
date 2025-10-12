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

  const [products, setProducts] = useState<Product[]>([]);

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
            name: 'QYVE Leyenda \'94 Series',
            description: 'Premium jersey with classic design',
            price: 50,
            stock: 10,
            category_id: 1,
            created_at: new Date(),
            slug: 'qyve-leyenda-94-series',
            previous_price: 60,
            image_cover: '/jersey_pic.jpg',
            colors: ['black', 'pink'],
          },
          {
            id: 9,
            name: 'QYVE Recovery Slides',
            description: 'Comfortable recovery slides for post-game',
            price: 30,
            stock: 5,
            category_id: 1,
            created_at: new Date(),
            slug: 'qyve-recovery-slides',
            previous_price: 35,
            image_cover: '/socks_white_bg.jpg',
            colors: ['black', 'cream'],
          },
          {
            id: 6,
            name: 'QYVE ProGrip Socks',
            description: 'High-performance socks with grip technology',
            price: 18,
            stock: 8,
            category_id: 1,
            created_at: new Date(),
            slug: 'qyve-progrip-socks',
            previous_price: 22,
            image_cover: '/socks_white.png',
            colors: ['white', 'black'],
          },
        ]);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .in('id', [7, 9, 6]);

        if (error) {
          console.error('Error fetching products: ', error);
          // Fallback to demo products on error
          setProducts([]);
        } else {
          setProducts(data);
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
