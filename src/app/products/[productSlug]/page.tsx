import { pathOr } from "ramda";
import React from "react";

// import { shoes } from "@/data/content";

import { supabase } from "@/libs/supabaseClient";

import SectionMoreProducts from "./SectionMoreProducts";
import SectionNavigation from "./SectionNavigation";
import SectionProductHeader from "./SectionProductHeader";
import SectionProductInfo from "./SectionProductInfo";

type Props = {
  params: { productSlug: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

const getProductData = async (productSlug: string) => {
  const { data, error } = await supabase
    .from("products")
    .select("*, sizes")
    .eq("slug", productSlug)
    .single();

  if (error) {
    console.error("Failed to fetch single product: ", error);
  } else {
    console.log(data);
    return data;
  }
};

const SingleProductPage = async ({ params }: Props) => {
  const selectedProduct = await getProductData(params.productSlug);
  // console.log("Id: ", selectedProduct.id);

  return (
    <div className="container">
      <SectionNavigation />

      <div className="mb-20">
        <SectionProductHeader
          // shots={pathOr([], ["shots"], selectedProduct)}
          name={pathOr("", ["name"], selectedProduct)}
          price={pathOr(0, ["price"], selectedProduct)}
          previous_price={pathOr(0, ["previous_price"], selectedProduct)}
          image_cover={pathOr("", ["image_cover"], selectedProduct)}
          sizes={pathOr([], ["sizes"], selectedProduct)}
          id={pathOr(0, ["id"], selectedProduct)}
          // currentPrice={pathOr(0, ["currentPrice"], selectedProduct)}
          // rating={pathOr(0, ["rating"], selectedProduct)}
          // pieces_sold={pathOr(0, ["pieces_sold"], selectedProduct)}
          // reviews={pathOr(0, ["reviews"], selectedProduct)}
        />
      </div>

      <div className="mb-28">
        <SectionProductInfo
          overview={pathOr("", ["overview"], selectedProduct)}
          shipment_details={pathOr([], ["shipment_details"], selectedProduct)}
          ratings={pathOr(0, ["rating"], selectedProduct)}
          reviews={pathOr(0, ["reviews"], selectedProduct)}
        />
      </div>

      <div className="mb-28">
        <SectionMoreProducts />
      </div>
    </div>
  );
};

export default SingleProductPage;
