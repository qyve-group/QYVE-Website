import Link from "next/link";
import type { FC } from "react";
import React from "react";
interface LogoProps {
  className?: string;
}

const Logo: FC<LogoProps> = ({ className = "hidden" }) => {
  return (
    <Link className="flex cursor-pointer items-center gap-2" href="/">
      <svg
        stroke="currentColor"
        fill="currentColor"
        strokeWidth="0"
        viewBox="0 0 600 400"
        // className="w-16 h-16  text-primary"
        className="mt-1"
        height="40"
        width="40"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          className="fill-current" // Uses Tailwind's text color
          d="m120.72225,172.53946C230.72398,43.23937,355.79444,42.65718,355.79444,42.65718L217.50429,0,0,172.53946l217.50429,172.53946,138.29015-42.65718s-125.07046-.58218-235.07219-129.88228Z"
        />
        <path
          className="fill-current"
          d="m566.92913,42.65718L428.63898,0l-217.50435,172.53946,217.50435,172.53946,138.29015-42.65718s-125.07046-.58218-235.07219-129.88228c110.00173-129.30009,235.07219-129.88228,235.07219-129.88228Z"
        />
      </svg>
      <span className={`${className} text-2xl font-bold`}>HotKicks.</span>
    </Link>
  );
};

export default Logo;
