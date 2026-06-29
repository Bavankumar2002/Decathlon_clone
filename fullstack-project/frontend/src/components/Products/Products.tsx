"use client";

import React, { useRef, useState, useEffect } from "react";
import { useCart } from "../../store/CartContext";
import { Product } from "../../types";
import { Heart, Star, ChevronLeft, ChevronRight, ShoppingCart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export const Products: React.FC = () => {
  const {
    searchQuery,
    setSearchQuery,
    addToCart,
    toggleWishlist,
    isWishlisted,
  } = useCart();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/products");
        if (!res.ok) {
          throw new Error("Failed to fetch products from the server");
        }
        const data = await res.json();
        
        // Map database products to the frontend Product interface
        const mapped: Product[] = data.map((p: any) => {
          const sellingPrice = p.discount_price ?? p.price;
          const originalPrice = p.price;
          const hasDiscount = p.discount_price && p.discount_price < p.price;
          const discountPercent = hasDiscount ? Math.round(((originalPrice - sellingPrice) / originalPrice) * 100) : 0;
          
          return {
            id: String(p.id),
            brand: p.brand,
            title: p.name,
            price: sellingPrice,
            originalPrice: p.price,
            discount: hasDiscount ? `${discountPercent}% off` : undefined,
            rating: p.rating,
            reviewsCount: p.reviews,
            image: p.image,
            tag: p.stock_status === "Limited stock" ? "Limited stock" : undefined,
            category: p.category
          };
        });
        
        setProducts(mapped);
      } catch (err: any) {
        console.error("Error loading products:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProducts();
  }, []);

  const workoutScrollRef = useRef<HTMLDivElement>(null);
  const styleScrollRef = useRef<HTMLDivElement>(null);
  const shoesScrollRef = useRef<HTMLDivElement>(null);

  const scroll = (ref: React.RefObject<HTMLDivElement | null>, direction: "left" | "right") => {
    if (ref.current) {
      const { scrollLeft } = ref.current;
      const scrollTo = direction === "left" ? scrollLeft - 320 : scrollLeft + 320;
      ref.current.scrollTo({ left: scrollTo, behavior: "smooth" });
    }
  };

  // Filter products by search query
  const filteredProducts = products.filter((product) => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return false;
    return (
      product.title.toLowerCase().includes(query) ||
      product.brand.toLowerCase().includes(query) ||
      product.category.toLowerCase().includes(query)
    );
  });

  const workoutProducts = products.filter((p) => p.category === "Activewear" || p.category === "Fitness Equipment");
  const styleProducts = products.filter((p) => p.category === "Monsoon Essentials" || p.category === "Sports Accessories");
  const shoesProducts = products.filter((p) => p.category === "Shoes" || p.category === "Hiking & Trekking" || p.category === "Bags & Backpacks" || p.category === "Cycling");

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center font-sans">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#0072c6] mx-auto"></div>
        <p className="text-zinc-500 text-sm mt-4 font-semibold">Loading products from database...</p>
      </div>
    );
  }

  const renderProductCard = (product: Product) => {
    const isLoved = isWishlisted(product.id);
    const hasDiscount = product.originalPrice && product.originalPrice > product.price;

    return (
      <div
        key={product.id}
        className="flex-shrink-0 w-64 bg-white border border-zinc-150 rounded-xl overflow-hidden shadow-xs hover:shadow-md hover:border-zinc-300 transition duration-300 flex flex-col justify-between relative group/card snap-start"
      >
        {/* Wishlist Heart Button */}
        <button
          onClick={() => toggleWishlist(product)}
          className="absolute right-3.5 top-3.5 z-20 p-2 rounded-full bg-white/90 hover:bg-white text-zinc-400 hover:text-red-500 shadow-sm transition duration-300 border border-zinc-100 cursor-pointer"
        >
          <Heart
            className={`h-4.5 w-4.5 transition-colors duration-300 ${
              isLoved ? "text-red-500 fill-red-500" : ""
            }`}
          />
        </button>

        {/* Product Tag Badge */}
        {product.tag && (
          <span className="absolute left-3.5 top-3.5 z-20 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider bg-[#eceafc] text-[#4a39b3] rounded-sm shadow-xs">
            {product.tag}
          </span>
        )}

        {/* Product Image */}
        <Link href={`/product/${product.id}`} className="relative h-64 w-full bg-zinc-50 overflow-hidden shrink-0 block cursor-pointer">
          <Image
            src={product.image}
            alt={product.title}
            fill
            unoptimized
            className="object-cover group-hover/card:scale-105 transition duration-500"
            sizes="256px"
            onError={(e) => {
              const target = e.currentTarget as HTMLImageElement;
              target.srcset = "";
              target.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300" viewBox="0 0 300 300"><rect width="300" height="300" fill="%23f4f4f5"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="14" fill="%23a1a1aa">No Image Available</text></svg>';
            }}
          />
        </Link>

        {/* Card Body Info */}
        <div className="p-4 flex-1 flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-bold text-[#0072c6] tracking-widest uppercase">
              {product.brand}
            </span>
            <Link href={`/product/${product.id}`} className="hover:text-[#0072c6] transition block">
              <h3 className="text-xs sm:text-sm font-semibold text-zinc-900 mt-0.5 line-clamp-2 h-10 leading-tight">
                {product.title}
              </h3>
            </Link>

            {/* Rating */}
            <div className="flex items-center gap-1 mt-2 text-zinc-500 text-[11px] font-medium">
              <div className="flex items-center gap-0.5 text-amber-500">
                <Star className="h-3.5 w-3.5 fill-current" />
              </div>
              <span className="text-zinc-800 font-bold">{product.rating}</span>
              <span>•</span>
              <span>
                {product.reviewsCount >= 1000
                  ? `${(product.reviewsCount / 1000).toFixed(1)}k`
                  : product.reviewsCount}{" "}
                reviews
              </span>
            </div>

            {/* Price section */}
            <div className="mt-3 flex flex-wrap items-baseline gap-2">
              <span className="text-base font-black text-zinc-950">
                ₹{product.price.toLocaleString("en-IN")}
              </span>
              {hasDiscount && (
                <>
                  <span className="text-xs text-zinc-400 line-through">
                    MRP ₹{product.originalPrice?.toLocaleString("en-IN")}
                  </span>
                  {product.discount && (
                    <span className="text-[10px] font-extrabold text-white bg-red-500 px-1.5 py-0.5 rounded-sm">
                      {product.discount}
                    </span>
                  )}
                </>
              )}
            </div>

            {/* Discount Code Promotion Text */}
            {product.id === "inesis-umbrella-med-heavy" && (
              <span className="inline-block mt-2 px-2 py-0.5 bg-[#eefaf5] text-[#227a51] text-[9px] font-bold rounded-sm border border-[#daf2e7]">
                Buy 2 @ ₹1899 & Save ₹99 off
              </span>
            )}
          </div>

          {/* Add to Cart button */}
          <Link
            href={`/product/${product.id}`}
            className="w-full mt-4 py-2 border border-zinc-200 hover:border-[#0072c6] hover:bg-[#0072c6] hover:text-white rounded-md text-xs font-bold text-zinc-800 transition duration-300 flex items-center justify-center gap-2 group/btn cursor-pointer"
          >
            <ShoppingCart className="h-3.5 w-3.5 text-zinc-500 group-hover/btn:text-white transition duration-300" />
            Add to Cart
          </Link>
        </div>
      </div>
    );
  };

  // If search query is active, display a responsive products grid of search results instead of standard sections
  if (searchQuery.trim()) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 font-sans">
        <div className="flex items-center justify-between border-b border-zinc-200 pb-4 mb-8">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-zinc-950 tracking-tight uppercase">
              Search Results
            </h2>
            <p className="text-xs sm:text-sm text-zinc-500 mt-1 font-semibold">
              Showing matching items for &ldquo;{searchQuery}&rdquo;
            </p>
          </div>
          <button
            onClick={() => setSearchQuery("")}
            className="text-xs font-bold text-[#0072c6] hover:underline"
          >
            Clear Search
          </button>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="py-24 text-center">
            <h3 className="text-lg font-bold text-zinc-800">No products found</h3>
            <p className="text-sm text-zinc-500 mt-2 max-w-sm mx-auto">
              We couldn&apos;t find anything matching &ldquo;{searchQuery}&rdquo;. Try checking spelling or using broader keywords.
            </p>
            <button
              onClick={() => setSearchQuery("")}
              className="mt-6 px-6 py-2.5 bg-[#0072c6] text-white rounded-md text-sm font-semibold hover:bg-blue-700 transition"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map(renderProductCard)}
          </div>
        )}
      </div>
    );
  }

  // Standard Landing View Sections (from screenshots)
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 font-sans space-y-16">
      {/* SECTION 1: Shop your Workout Checklist */}
      <section className="flex flex-col lg:flex-row gap-6 relative group">
        {/* Left Headline Section */}
        <div className="lg:w-60 flex flex-col justify-between py-2 shrink-0">
          <div>
            <span className="text-[10px] font-black text-[#0072c6] uppercase tracking-widest">
              Active & Gym
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-zinc-950 mt-1 leading-tight tracking-tight uppercase">
              Shop your <br /> Workout &amp; Gym <br /> Essentials
            </h2>
          </div>
          {/* Scroll navigation controls */}
          <div className="flex gap-2 mt-6 lg:mt-0">
            <button
              onClick={() => scroll(workoutScrollRef, "left")}
              className="p-3.5 border border-zinc-200 rounded-full hover:bg-zinc-50 text-zinc-800 shadow-xs hover:border-zinc-300 transition"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={() => scroll(workoutScrollRef, "right")}
              className="p-3.5 border border-zinc-200 rounded-full hover:bg-zinc-50 text-zinc-800 shadow-xs hover:border-zinc-300 transition"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Products List */}
        <div
          ref={workoutScrollRef}
          className="flex-1 flex gap-5 overflow-x-auto pb-4 pt-1 no-scrollbar snap-x scroll-smooth"
        >
          {workoutProducts.map(renderProductCard)}
        </div>
      </section>

      {/* SECTION 2: Style Approved */}
      <section className="flex flex-col lg:flex-row gap-6 relative group">
        {/* Left Headline Section */}
        <div className="lg:w-60 flex flex-col justify-between py-2 shrink-0">
          <div>
            <span className="text-[10px] font-black text-[#0072c6] uppercase tracking-widest">
              Monsoon & Accessories
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-zinc-950 mt-1 leading-tight tracking-tight uppercase">
              Style <br /> Approved. <br /> Monsoon &amp; Gear
            </h2>
          </div>
          {/* Scroll navigation controls */}
          <div className="flex gap-2 mt-6 lg:mt-0">
            <button
              onClick={() => scroll(styleScrollRef, "left")}
              className="p-3.5 border border-zinc-200 rounded-full hover:bg-zinc-50 text-zinc-800 shadow-xs hover:border-zinc-300 transition"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={() => scroll(styleScrollRef, "right")}
              className="p-3.5 border border-zinc-200 rounded-full hover:bg-zinc-50 text-zinc-800 shadow-xs hover:border-zinc-300 transition"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Products List */}
        <div
          ref={styleScrollRef}
          className="flex-1 flex gap-5 overflow-x-auto pb-4 pt-1 no-scrollbar snap-x scroll-smooth"
        >
          {styleProducts.map(renderProductCard)}
        </div>
      </section>

      {/* SECTION 3: Explore best of Outdoor Shoes */}
      <section className="flex flex-col lg:flex-row gap-6 relative group">
        {/* Left Headline Section */}
        <div className="lg:w-60 flex flex-col justify-between py-2 shrink-0">
          <div>
            <span className="text-[10px] font-black text-[#0072c6] uppercase tracking-widest">
              Outdoor Gear &amp; Shoes
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-zinc-950 mt-1 leading-tight tracking-tight uppercase">
              Explore best <br /> of Outdoor Shoes, <br /> Bags &amp; Bikes
            </h2>
          </div>
          {/* Scroll navigation controls */}
          <div className="flex gap-2 mt-6 lg:mt-0">
            <button
              onClick={() => scroll(shoesScrollRef, "left")}
              className="p-3.5 border border-zinc-200 rounded-full hover:bg-zinc-50 text-zinc-800 shadow-xs hover:border-zinc-300 transition"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={() => scroll(shoesScrollRef, "right")}
              className="p-3.5 border border-zinc-200 rounded-full hover:bg-zinc-50 text-zinc-800 shadow-xs hover:border-zinc-300 transition"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Products List */}
        <div
          ref={shoesScrollRef}
          className="flex-1 flex gap-5 overflow-x-auto pb-4 pt-1 no-scrollbar snap-x scroll-smooth"
        >
          {shoesProducts.map(renderProductCard)}
        </div>
      </section>
    </div>
  );
};
