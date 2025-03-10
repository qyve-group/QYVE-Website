"use client";

import type { FC } from "react";
import React, { useEffect, useState } from "react";
import { FaCheckCircle } from "react-icons/fa";
import { supabase } from "@/libs/supabaseClient";

interface ShoeSizeButtonProps {
  disabled?: boolean;
  size: string;
  id: number;
}

const ShoeSizeButton: FC<ShoeSizeButtonProps> = ({ disabled, size, id }) => {
  const [isDisabled, setIsDisabled] = useState(disabled);
  const [selected, setSelected] = useState(false);

  console.log("ID: ", id);

  // random for demo
  // useEffect(() => {
  //   if (!id) return; // Ensure id is defined before fetching

  //   console.log("ID: ", id);
  //   const fetchData = async () => {
  //     const { data, error } = await supabase
  //       .from("products_sizes")
  //       .select("stock")
  //       .eq("product_id", id);

  //     if (error) {
  //       console.error("Failed to fetch single product: ", error);
  //     } else {
  //       console.log(data);
  //     }
  //   };

  //   fetchData();
  //   // setIsDisabled(Math.random() > 0.5);
  // }, [id]);

  return (
    <button
      type="button"
      disabled={isDisabled}
      onClick={() => setSelected(!selected)}
      className={`relative w-full rounded-xl py-10 font-medium disabled:bg-gray disabled:text-neutral-500 ${
        selected ? "bg-primary text-white" : "bg-gray text-black"
      }`}
    >
      <FaCheckCircle
        className={`absolute right-2 top-2 text-white ${
          selected ? "block" : "hidden"
        }`}
      />
      {size.toUpperCase()}
    </button>
  );
};

export default ShoeSizeButton;
