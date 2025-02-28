import React, { useEffect, useState } from "react";

import Filter from "@/components/Filter";
import ProductCard from "@/components/ProductCard";
import { productsSection, shoes } from "@/data/content";
import ButtonPrimary from "@/shared/Button/ButtonPrimary";
import Heading from "@/shared/Heading/Heading";

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
}

const [products, setProducts] = useState<Product>();

useEffect(() => {
  const fetchData = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/products");
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.log("Error fetching products: ", err);
    }
  };

  fetchData();
}, []);

const SectionProducts = () => {
  return (
    <div className="container">
      <Heading isCenter isMain desc={productsSection.description}>
        {productsSection.heading}
      </Heading>
      <Filter />

      <div className="grid gap-7 md:grid-cols-2 lg:grid-cols-3">
        {shoes.map((shoe) => (
          <ProductCard
            key={shoe.shoeName}
            product={shoe}
            className="border-neutral-300"
          />
        ))}
      </div>

      <div className="mt-14 flex items-center justify-center">
        <ButtonPrimary>View More</ButtonPrimary>
      </div>
    </div>
  );
};

export default SectionProducts;
