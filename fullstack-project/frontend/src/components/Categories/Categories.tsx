"use client";

import React, { useRef } from "react";
import { CATEGORIES, SUBCATEGORIES } from "../../data/products";
import { useCart } from "../../store/CartContext";
import { ChevronRight, ChevronLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const CATEGORY_SLUGS: Record<string, string> = {
  monsoon: "monsoon-essentials",
  activewear: "activewear",
  fitness: "fitness-equipment",
  cycling: "cycling",
  hiking: "hiking-trekking",
  shoes: "shoes",
  bags: "bags-backpacks",
  accessories: "sports-accessories",
};

export const Categories: React.FC = () => {
  const { setSearchQuery } = useCart();
  const mainScrollRef = useRef<HTMLDivElement>(null);
  const subScrollRef = useRef<HTMLDivElement>(null);

  const scroll = (ref: React.RefObject<HTMLDivElement | null>, direction: "left" | "right") => {
    if (ref.current) {
      const { scrollLeft } = ref.current;
      const scrollTo = direction === "left" ? scrollLeft - 300 : scrollLeft + 300;
      ref.current.scrollTo({ left: scrollTo, behavior: "smooth" });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 font-sans">
      {/* Big Categories Slider */}
      <div className="relative group">
        <h2 className="text-lg font-black text-zinc-900 mb-4 tracking-tight uppercase">
          Shop by Sports
        </h2>

        {/* Scroll Buttons */}
        <button
          onClick={() => scroll(mainScrollRef, "left")}
          className="absolute left-2 top-[55%] -translate-y-1/2 z-20 p-2.5 rounded-full bg-white/95 hover:bg-white text-zinc-800 shadow-md transition opacity-0 group-hover:opacity-100 hidden md:block hover:scale-105 border border-zinc-100"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          onClick={() => scroll(mainScrollRef, "right")}
          className="absolute right-2 top-[55%] -translate-y-1/2 z-20 p-2.5 rounded-full bg-white/95 hover:bg-white text-zinc-800 shadow-md transition opacity-0 group-hover:opacity-100 hidden md:block hover:scale-105 border border-zinc-100"
        >
          <ChevronRight className="h-5 w-5" />
        </button>

        {/* Categories Horizontal Scroll container */}
        <div
          ref={mainScrollRef}
          className="flex gap-4 overflow-x-auto pb-4 no-scrollbar snap-x scroll-smooth"
        >
          {CATEGORIES.map((cat) => {
            const slug = CATEGORY_SLUGS[cat.id] || cat.id;
            return (
              <Link
                key={cat.id}
                href={`/sports/${slug}`}
                className="flex-shrink-0 w-36 sm:w-44 h-48 sm:h-56 rounded-xl overflow-hidden relative snap-start group/card shadow-xs hover:shadow-md transition duration-300 block"
              >
                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent z-10 group-hover/card:from-black/95 transition duration-300" />
                <Image
                  src={cat.image}
                  alt={cat.name}
                  fill
                  unoptimized
                  className="object-cover group-hover/card:scale-110 transition duration-500"
                  sizes="(max-width: 640px) 144px, 176px"
                  onError={(e) => {
                    const target = e.currentTarget as HTMLImageElement;
                    target.srcset = "";
                    target.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300" viewBox="0 0 300 300"><rect width="300" height="300" fill="%23f4f4f5"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="14" fill="%23a1a1aa">No Image Available</text></svg>';
                  }}
                />
                {/* Category Title */}
                <div className="absolute bottom-4 inset-x-2 z-20 text-center">
                  <span className="text-white text-xs sm:text-sm font-extrabold leading-tight tracking-wide drop-shadow-sm uppercase">
                    {cat.name}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Subcategories Tags Row (Screenshot 2 style) */}
      <div className="relative mt-8 group">
        <h2 className="text-lg font-black text-zinc-900 mb-4 tracking-tight uppercase">
          Quick Workouts & Essentials
        </h2>

        {/* Scroll Buttons */}
        <button
          onClick={() => scroll(subScrollRef, "left")}
          className="absolute left-0 top-[55%] -translate-y-1/2 z-20 p-1.5 rounded-full bg-white text-zinc-800 shadow-sm border border-zinc-100 transition opacity-0 group-hover:opacity-100 hidden md:block"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <button
          onClick={() => scroll(subScrollRef, "right")}
          className="absolute right-0 top-[55%] -translate-y-1/2 z-20 p-1.5 rounded-full bg-white text-zinc-800 shadow-sm border border-zinc-100 transition opacity-0 group-hover:opacity-100 hidden md:block"
        >
          <ChevronRight className="h-4 w-4" />
        </button>

        {/* Circular Subcategories Row */}
        <div
          ref={subScrollRef}
          className="flex gap-6 overflow-x-auto pb-4 no-scrollbar snap-x scroll-smooth"
        >
          {SUBCATEGORIES.map((sub, idx) => (
            <button
              key={idx}
              onClick={() => setSearchQuery(sub)}
              className="flex-shrink-0 flex flex-col items-center gap-2 group/sub cursor-pointer snap-start"
            >
              {/* Circle container containing sketch or initial */}
              <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-full border border-zinc-200 bg-zinc-50 flex items-center justify-center overflow-hidden group-hover/sub:border-[#0072c6] group-hover/sub:bg-blue-50 transition duration-300 shadow-xs relative">
                {/* Simulated outline icon/initial */}
                <span className="text-zinc-500 font-bold text-xs uppercase group-hover/sub:text-[#0072c6] transition">
                  {sub.substring(0, 3)}
                </span>
                {/* Background graphic simulation */}
                <div className="absolute inset-0 opacity-10 bg-radial from-zinc-950 to-transparent pointer-events-none" />
              </div>
              <span className="text-xs font-bold text-zinc-700 group-hover/sub:text-[#0072c6] transition">
                {sub}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
