"use client";

import React, { use, useState, useEffect } from "react";
import { Header } from "../../../components/Header/Header";
import { Footer } from "../../../components/Footer/Footer";
import { CartDrawer } from "../../../components/Common/CartDrawer";
import { WishlistDrawer } from "../../../components/Common/WishlistDrawer";
import { useCart } from "../../../store/CartContext";
import { Product } from "../../../types";
import { 
  Star, 
  ShoppingCart, 
  Heart, 
  Truck, 
  RotateCcw, 
  Store, 
  ChevronRight, 
  Minus, 
  Plus, 
  ShieldCheck, 
  TrendingUp 
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface PageProps {
  params: Promise<{
    productId: string;
  }>;
}

// Map database categories to their front-end URLs
const CATEGORY_URLS: Record<string, string> = {
  "Monsoon Essentials": "monsoon-essentials",
  "Activewear": "activewear",
  "Fitness Equipment": "fitness-equipment",
  "Cycling": "cycling",
  "Hiking & Trekking": "hiking-trekking",
  "Shoes": "shoes",
  "Bags & Backpacks": "bags-backpacks",
  "Sports Accessories": "sports-accessories"
};

export default function ProductDetailPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const { productId } = resolvedParams;

  const { addToCart, toggleWishlist, isWishlisted } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Configuration States
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [selectedSize, setSelectedSize] = useState<string>("M");
  const [selectedColor, setSelectedColor] = useState<string>("Black");
  const [quantity, setQuantity] = useState<number>(1);

  // Color options metadata
  const colors = [
    { name: "Black", class: "bg-zinc-900 ring-zinc-900" },
    { name: "Indigo Blue", class: "bg-blue-800 ring-blue-800" },
    { name: "Slate Grey", class: "bg-zinc-500 ring-zinc-500" }
  ];

  // Size options metadata
  const sizes = ["S", "M", "L", "XL"];

  // Mock alternate images using CSS filters
  const [galleryImages, setGalleryImages] = useState<string[]>([]);

  useEffect(() => {
    const loadDetails = async () => {
      try {
        setLoading(true);
        // 1. Fetch single product details
        const productRes = await fetch(`http://localhost:5000/api/products/${productId}`);
        if (!productRes.ok) {
          throw new Error("Failed to load product details");
        }
        const data = await productRes.json();
        
        // Map database fields to front-end schema
        const sellingPrice = data.discount_price ?? data.price;
        const originalPrice = data.price;
        const hasDiscount = data.discount_price && data.discount_price < data.price;
        const discountPercent = hasDiscount ? Math.round(((originalPrice - sellingPrice) / originalPrice) * 100) : 0;

        const mapped: Product = {
          id: String(data.id),
          brand: data.brand,
          title: data.name,
          price: sellingPrice,
          originalPrice: data.price,
          discount: hasDiscount ? `${discountPercent}% off` : undefined,
          rating: data.rating,
          reviewsCount: data.reviews,
          image: data.image,
          tag: data.stock_status === "Limited stock" ? "Limited stock" : undefined,
          category: data.category
        };

        setProduct(mapped);
        setSelectedImage(mapped.image);
        setGalleryImages([
          mapped.image,
          // Generate slightly different dimensions/IDs from unsplash to create a realistic gallery if possible
          mapped.image + "&auto=format&fit=crop&w=600&h=600&q=80",
          mapped.image + "&auto=format&fit=crop&w=600&h=600&q=70",
          mapped.image + "&auto=format&fit=crop&w=600&h=600&q=60"
        ]);

        // 2. Fetch all products to filter related items
        const allRes = await fetch("http://localhost:5000/api/products");
        if (allRes.ok) {
          const allData = await allRes.json();
          const relatedMapped: Product[] = allData
            .filter((p: any) => p.category === data.category && String(p.id) !== String(data.id))
            .slice(0, 4)
            .map((p: any) => {
              const sp = p.discount_price ?? p.price;
              const op = p.price;
              const hd = p.discount_price && p.discount_price < p.price;
              const dp = hd ? Math.round(((op - sp) / op) * 100) : 0;

              return {
                id: String(p.id),
                brand: p.brand,
                title: p.name,
                price: sp,
                originalPrice: p.price,
                discount: hd ? `${dp}% off` : undefined,
                rating: p.rating,
                reviewsCount: p.reviews,
                image: p.image,
                tag: p.stock_status === "Limited stock" ? "Limited stock" : undefined,
                category: p.category
              };
            });
          setRelatedProducts(relatedMapped);
        }
      } catch (err: any) {
        console.error("Error loading product detail page:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      loadDetails();
    }
  }, [productId]);

  const handleAddToCart = () => {
    if (!product) return;
    addToCart(product, quantity, selectedSize, selectedColor);
  };

  const handleBuyNow = () => {
    if (!product) return;
    addToCart(product, quantity, selectedSize, selectedColor);
    // Directly trigger checkouts / open the cart drawer
  };

  const isLoved = product ? isWishlisted(product.id) : false;

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-zinc-50 font-sans">
        <Header />
        <main className="flex-1 flex flex-col items-center justify-center py-32 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0072c6]"></div>
          <p className="text-zinc-500 text-sm mt-4 font-semibold">Loading product specifications...</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="flex flex-col min-h-screen bg-zinc-50 font-sans">
        <Header />
        <main className="flex-1 max-w-7xl mx-auto px-4 py-24 text-center">
          <h2 className="text-3xl font-black uppercase text-zinc-950">Product Not Found</h2>
          <p className="text-zinc-500 mt-2">The product you are trying to view does not exist or has been removed.</p>
          <Link
            href="/"
            className="inline-block mt-6 px-6 py-3 bg-[#0072c6] text-white rounded-md font-extrabold uppercase hover:bg-blue-700 transition"
          >
            Go Back Home
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  const hasDiscount = product.originalPrice && product.originalPrice > product.price;
  const categorySlug = CATEGORY_URLS[product.category] || "";

  return (
    <div className="flex flex-col min-h-screen bg-zinc-50 text-zinc-900 font-sans">
      <Header />

      <main className="flex-1 w-full pb-20">
        {/* Breadcrumb Navigation */}
        <nav className="bg-white border-b border-zinc-150 py-3">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-1.5 text-xs font-bold text-zinc-500 uppercase tracking-wider">
            <Link href="/" className="hover:text-[#0072c6] transition">Home</Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span>Sports</span>
            {categorySlug && (
              <>
                <ChevronRight className="h-3.5 w-3.5" />
                <Link href={`/sports/${categorySlug}`} className="hover:text-[#0072c6] transition">{product.category}</Link>
              </>
            )}
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-zinc-900 font-black line-clamp-1 max-w-[200px] sm:max-w-xs">{product.title}</span>
          </div>
        </nav>

        {/* Main Product Frame */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          <div className="bg-white border border-zinc-150 rounded-3xl p-6 md:p-10 shadow-xs flex flex-col lg:flex-row gap-10 md:gap-16">
            
            {/* Left: Product Image Gallery */}
            <div className="lg:w-1/2 flex flex-col gap-4">
              <div className="relative aspect-square w-full bg-zinc-50 rounded-2xl overflow-hidden border border-zinc-100 group">
                <Image
                  src={selectedImage}
                  alt={product.title}
                  fill
                  unoptimized
                  className="object-cover group-hover:scale-105 transition duration-500"
                  priority
                />
                {product.tag && (
                  <span className="absolute left-4 top-4 px-3 py-1 bg-red-500 text-white text-[10px] font-black uppercase tracking-wider rounded-sm shadow-xs">
                    {product.tag}
                  </span>
                )}
              </div>
              
              {/* Thumbnail Bar */}
              <div className="grid grid-cols-4 gap-3">
                {galleryImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(img)}
                    className={`relative aspect-square w-full rounded-xl overflow-hidden border-2 bg-zinc-50 transition ${
                      selectedImage === img 
                        ? "border-[#0072c6] ring-2 ring-blue-100 scale-[1.02]" 
                        : "border-zinc-200 hover:border-zinc-300"
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`Product Thumb ${idx + 1}`}
                      fill
                      unoptimized
                      className="object-cover"
                      sizes="120px"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Right: Product Spec details */}
            <div className="lg:w-1/2 flex flex-col justify-between">
              <div>
                <span className="text-xs font-black text-[#0072c6] tracking-widest uppercase flex items-center gap-1.5 mb-2">
                  <TrendingUp className="h-4.5 w-4.5" />
                  {product.brand} Official
                </span>
                
                <h1 className="text-2xl sm:text-3xl font-black text-zinc-950 leading-tight uppercase tracking-tight">
                  {product.title}
                </h1>

                {/* Rating Frame */}
                <div className="flex items-center gap-2 mt-4 text-xs font-bold text-zinc-500 border-b border-zinc-100 pb-4">
                  <div className="flex items-center gap-0.5 text-amber-500">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star 
                        key={i} 
                        className={`h-4.5 w-4.5 ${
                          i < Math.round(product.rating) ? "fill-current" : "text-zinc-200"
                        }`} 
                      />
                    ))}
                  </div>
                  <span className="text-zinc-950 font-black text-sm">{product.rating}</span>
                  <span>•</span>
                  <span className="hover:underline cursor-pointer">{product.reviewsCount} verified user reviews</span>
                </div>

                {/* Pricing section */}
                <div className="mt-5 flex flex-wrap items-baseline gap-3">
                  <span className="text-3xl font-black text-zinc-950 tracking-tight">
                    ₹{product.price.toLocaleString("en-IN")}
                  </span>
                  {hasDiscount && (
                    <>
                      <span className="text-sm text-zinc-400 line-through">
                        MRP ₹{product.originalPrice?.toLocaleString("en-IN")}
                      </span>
                      {product.discount && (
                        <span className="text-xs font-black text-white bg-red-500 px-2 py-1 rounded-sm shadow-xs uppercase">
                          {product.discount}
                        </span>
                      )}
                    </>
                  )}
                </div>

                {/* Product Description */}
                <div className="mt-6 space-y-2">
                  <h3 className="text-xs font-black text-zinc-400 uppercase tracking-widest">Description</h3>
                  <p className="text-sm text-zinc-600 leading-relaxed font-medium">
                    {product.title} by {product.brand}. Designed for active sports, outdoor safety, and heavy use. Engineered to Decathlon's strict standards. This gear passes multiple quality assurance pipelines for high durability, flexibility, and comfort.
                  </p>
                </div>

                {/* Custom selectors: Colors */}
                <div className="mt-6 space-y-3">
                  <h3 className="text-xs font-black text-zinc-400 uppercase tracking-widest">
                    Select Color: <strong className="text-zinc-800 uppercase">{selectedColor}</strong>
                  </h3>
                  <div className="flex gap-3">
                    {colors.map((color) => (
                      <button
                        key={color.name}
                        onClick={() => setSelectedColor(color.name)}
                        className={`w-9 h-9 rounded-full ${color.class} transition cursor-pointer border-2 border-white ring-2 ${
                          selectedColor === color.name 
                            ? "ring-[#0072c6] scale-105" 
                            : "ring-zinc-200 hover:ring-zinc-300"
                        }`}
                        title={color.name}
                      />
                    ))}
                  </div>
                </div>

                {/* Custom selectors: Sizes */}
                <div className="mt-6 space-y-3">
                  <h3 className="text-xs font-black text-zinc-400 uppercase tracking-widest">
                    Select Size: <strong className="text-zinc-800">{selectedSize}</strong>
                  </h3>
                  <div className="flex gap-2">
                    {sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`px-4 py-2 border rounded-md text-xs font-extrabold uppercase transition cursor-pointer ${
                          selectedSize === size
                            ? "bg-[#0072c6] border-[#0072c6] text-white font-black"
                            : "bg-white border-zinc-200 text-zinc-700 hover:bg-zinc-50"
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quantity selector */}
                <div className="mt-6 space-y-3">
                  <h3 className="text-xs font-black text-zinc-400 uppercase tracking-widest">Quantity</h3>
                  <div className="flex items-center border border-zinc-200 rounded-lg overflow-hidden w-28 bg-white shadow-xs">
                    <button
                      onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                      className="p-2 hover:bg-zinc-50 text-zinc-500 transition cursor-pointer"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="flex-1 text-center text-xs font-bold text-zinc-800 select-none">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(prev => Math.min(10, prev + 1))}
                      className="p-2 hover:bg-zinc-50 text-zinc-500 transition cursor-pointer"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Checkout actions and wishlist button */}
              <div className="mt-8 pt-6 border-t border-zinc-100 space-y-4">
                <div className="flex flex-col sm:flex-row gap-3">
                  {/* Add to Cart button */}
                  <button
                    onClick={handleAddToCart}
                    className="flex-1 py-3.5 border border-zinc-200 hover:border-[#0072c6] hover:bg-[#0072c6] hover:text-white rounded-xl text-sm font-black uppercase tracking-wider text-zinc-800 transition duration-300 flex items-center justify-center gap-2 group/add font-sans shadow-xs cursor-pointer"
                  >
                    <ShoppingCart className="h-4 w-4 text-zinc-500 group-hover/add:text-white transition duration-300" />
                    Add to Cart
                  </button>

                  {/* Buy Now button */}
                  <button
                    onClick={handleBuyNow}
                    className="flex-1 py-3.5 bg-yellow-400 text-zinc-950 font-black uppercase tracking-wider rounded-xl text-sm hover:bg-yellow-500 transition duration-300 shadow-sm cursor-pointer"
                  >
                    Buy Now
                  </button>

                  {/* Wishlist Heart */}
                  <button
                    onClick={() => toggleWishlist(product)}
                    className="p-3.5 rounded-xl border border-zinc-200 hover:border-red-200 hover:bg-red-50/50 text-zinc-400 hover:text-red-500 transition duration-300 cursor-pointer shadow-xs"
                  >
                    <Heart className={`h-5 w-5 ${isLoved ? "text-red-500 fill-red-500" : ""}`} />
                  </button>
                </div>

                {/* Delivery Information specs */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-zinc-50 border border-zinc-100 rounded-2xl p-4 mt-6">
                  <div className="flex items-start gap-2">
                    <Truck className="h-4.5 w-4.5 text-[#0072c6] shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[10px] font-black uppercase text-zinc-900 block leading-tight">Delivery</span>
                      <span className="text-[9px] font-bold text-zinc-400">Within 3-5 working days</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <RotateCcw className="h-4.5 w-4.5 text-[#0072c6] shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[10px] font-black uppercase text-zinc-900 block leading-tight">Easy returns</span>
                      <span className="text-[9px] font-bold text-zinc-400">30 days exchange window</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Store className="h-4.5 w-4.5 text-[#0072c6] shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[10px] font-black uppercase text-zinc-900 block leading-tight">Store pickup</span>
                      <span className="text-[9px] font-bold text-zinc-400">Free in 2 hours</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
            <h2 className="text-xl font-black uppercase tracking-tight text-zinc-950 mb-6 flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-[#0072c6]" />
              Other Gear from {product.category}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {relatedProducts.map((rel) => {
                const hd = rel.originalPrice && rel.originalPrice > rel.price;
                const isLovedRel = isWishlisted(rel.id);

                return (
                  <div
                    key={rel.id}
                    className="bg-white border border-zinc-150 rounded-2xl overflow-hidden shadow-xs hover:shadow-md hover:border-zinc-300 transition duration-300 flex flex-col justify-between relative group/card"
                  >
                    <button
                      onClick={() => toggleWishlist(rel)}
                      className="absolute right-3 top-3 z-20 p-2 rounded-full bg-white/90 hover:bg-white text-zinc-400 hover:text-red-500 shadow-sm transition duration-300 border border-zinc-100 cursor-pointer"
                    >
                      <Heart className={`h-4 w-4 ${isLovedRel ? "text-red-500 fill-red-500" : ""}`} />
                    </button>

                    <Link href={`/product/${rel.id}`} className="relative h-48 w-full bg-zinc-50 overflow-hidden shrink-0 block cursor-pointer">
                      <Image
                        src={rel.image}
                        alt={rel.title}
                        fill
                        unoptimized
                        className="object-cover group-hover/card:scale-105 transition duration-500"
                        sizes="256px"
                      />
                    </Link>

                    <div className="p-4 flex-1 flex flex-col justify-between">
                      <div>
                        <span className="text-[9px] font-black text-[#0072c6] tracking-widest uppercase">
                          {rel.brand}
                        </span>
                        <Link href={`/product/${rel.id}`} className="hover:text-[#0072c6] transition block">
                          <h3 className="text-xs font-semibold text-zinc-900 mt-0.5 line-clamp-2 h-10 leading-tight">
                            {rel.title}
                          </h3>
                        </Link>
                        <div className="flex items-center gap-1 mt-1 text-zinc-500 text-[10px]">
                          <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
                          <span className="font-bold">{rel.rating}</span>
                        </div>
                        <div className="mt-2.5 flex items-baseline gap-1.5">
                          <span className="text-sm font-black text-zinc-950">
                            ₹{rel.price.toLocaleString("en-IN")}
                          </span>
                          {hd && (
                            <span className="text-[10px] text-zinc-400 line-through">
                              ₹{rel.originalPrice?.toLocaleString("en-IN")}
                            </span>
                          )}
                        </div>
                      </div>

                      <Link
                        href={`/product/${rel.id}`}
                        className="w-full mt-4 py-1.5 border border-zinc-200 hover:border-[#0072c6] hover:bg-[#0072c6] hover:text-white rounded-md text-xs font-bold text-zinc-800 transition duration-300 flex items-center justify-center gap-1.5 group/btn cursor-pointer"
                      >
                        <ShoppingCart className="h-3 w-3 text-zinc-500 group-hover/btn:text-white transition duration-300" />
                        Add to Cart
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}
      </main>

      <Footer />
      <CartDrawer />
      <WishlistDrawer />
    </div>
  );
}
