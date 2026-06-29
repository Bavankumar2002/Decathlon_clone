"use client";

import React, { use, useState, useEffect } from "react";
import { Header } from "../../../components/Header/Header";
import { Footer } from "../../../components/Footer/Footer";
import { CartDrawer } from "../../../components/Common/CartDrawer";
import { WishlistDrawer } from "../../../components/Common/WishlistDrawer";
import { useCart } from "../../../store/CartContext";
import { Product } from "../../../types";
import { Heart, Star, ShoppingCart, Filter, Sparkles, Tag, ArrowRight, ShieldCheck, ChevronRight, LayoutGrid, Award, Calendar } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface PageProps {
  params: Promise<{
    categorySlug: string;
  }>;
}

// Sub-store detailed metadata
const CATEGORY_MAP: Record<
  string,
  {
    name: string;
    dbCategoryName: string;
    description: string;
    heroImage: string;
    gradient: string;
    accentColor: string;
    bgBadge: string;
    promoText: string;
    promoCode: string;
    offers: string[];
    reviews: { name: string; rating: number; text: string; date: string }[];
    subNavigation: string[];
  }
> = {
  "monsoon-essentials": {
    name: "Monsoon Essentials",
    dbCategoryName: "Monsoon Essentials",
    description: "Stay active even in heavy rains. Explore 100% windproof & waterproof gear, anti-UV filtration umbrellas, and durable outdoor ponchos.",
    heroImage: "https://images.unsplash.com/photo-1548883354-7622d03aca27?w=1200&auto=format&fit=crop&q=80",
    gradient: "from-blue-700 via-indigo-800 to-sky-900",
    accentColor: "bg-blue-600 border-blue-500 text-blue-600",
    bgBadge: "bg-blue-100 text-blue-800",
    promoText: "Heavy Rain protection guaranteed. Engineered in the French Alps for wet weather hiking.",
    promoCode: "MONSOON15",
    offers: [
      "Buy any 2 Raincoats & get 15% off",
      "Free high-grip shoe spray on orders above ₹1499",
      "Flat ₹200 off on Waterproof Backpacks"
    ],
    reviews: [
      { name: "Rahul S.", rating: 5, text: "The waterproof poncho was a lifesaver during my trek in the Western Ghats. Kept me completely dry!", date: "2026-06-15" },
      { name: "Meera K.", rating: 4, text: "Excellent wind resistance on the Microplus umbrella. Extremely light to carry in my work bag.", date: "2026-06-21" }
    ],
    subNavigation: ["Raincoats", "Umbrellas", "Waterproof Shoes", "Dry Bags"]
  },
  "activewear": {
    name: "Activewear",
    dbCategoryName: "Activewear",
    description: "Built for peak flexibility and performance. Premium jogger pants, mesh running shorts, and breathable compression shirts.",
    heroImage: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=1200&auto=format&fit=crop&q=80",
    gradient: "from-purple-800 via-violet-900 to-rose-950",
    accentColor: "bg-purple-600 border-purple-500 text-purple-600",
    bgBadge: "bg-purple-100 text-purple-800",
    promoText: "High stretch fabrics with rapid sweat-wicking technology. Keeps you dry and comfortable.",
    promoCode: "ACTIVEFIT",
    offers: [
      "Flat 30% Off on Gym Tracksuits",
      "Buy 3 Gym Shorts, Get 1 Free!",
      "New Sign-ups: Get ₹150 off on active joggers"
    ],
    reviews: [
      { name: "Amit P.", rating: 5, text: "The slim fit joggers are so comfortable. Perfect for squats and high-intensity gym sessions.", date: "2026-06-10" },
      { name: "Priya M.", rating: 4, text: "Great fabric weight on the zip-pocket trackpants. Very breathable and sweat-wicking.", date: "2026-06-18" }
    ],
    subNavigation: ["T-Shirts", "Shorts", "Joggers", "Tracksuits", "Sports Bras"]
  },
  "fitness-equipment": {
    name: "Fitness Equipment",
    dbCategoryName: "Fitness Equipment",
    description: "Professional training gear for your home gym. Adjustable heavy dumbbells, alignment yoga mats, and high-tension resistance bands.",
    heroImage: "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=1200&auto=format&fit=crop&q=80",
    gradient: "from-zinc-800 via-neutral-900 to-stone-950",
    accentColor: "bg-zinc-800 border-zinc-700 text-zinc-800",
    bgBadge: "bg-zinc-100 text-zinc-800",
    promoText: "Heavy duty materials certified by home training coaches. Safe, compact, and durable.",
    promoCode: "DOMYOSGYM",
    offers: [
      "No Cost EMI available on orders above ₹4999",
      "Free home workout training guide with every dumbbell set purchase",
      "Flat 20% off on Yoga & Pilates mats"
    ],
    reviews: [
      { name: "Vikram R.", rating: 5, text: "The 10kg dumbbell set build quality is fantastic. The case makes storage very clean.", date: "2026-06-05" },
      { name: "Sonal G.", rating: 5, text: "Best non-slip yoga mat I have owned. The alignment lines really help with posture.", date: "2026-06-14" }
    ],
    subNavigation: ["Dumbbells", "Yoga Mats", "Resistance Bands", "Kettlebells", "Cardio Machines"]
  },
  "cycling": {
    name: "Cycling",
    dbCategoryName: "Cycling",
    description: "Gear up your rides on trails, roads, and cities. Find rockrider mountain bikes, aerodynamic safety helmets, and padded gel gloves.",
    heroImage: "https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=1200&auto=format&fit=crop&q=80",
    gradient: "from-zinc-900 via-slate-800 to-emerald-950",
    accentColor: "bg-emerald-600 border-emerald-500 text-emerald-600",
    bgBadge: "bg-emerald-100 text-emerald-800",
    promoText: "Precision engineered gear. Lifetime warranty on Rockrider cycle frames.",
    promoCode: "RIDEFREE",
    offers: [
      "Free 1-Year Cycle Tune-up & Servicing warranty",
      "Get 20% off on helmets when purchased with any bike",
      "Flat ₹500 off on Hybrid & MTB Cycles"
    ],
    reviews: [
      { name: "Karan D.", rating: 4, text: "Rockrider ST100 has amazing shocks for trails. Excellent value for the price.", date: "2026-06-08" },
      { name: "Arjun V.", rating: 5, text: "Extremely lightweight road helmet. The ventilation keeps me cool during long rides.", date: "2026-06-25" }
    ],
    subNavigation: ["Mountain Bikes", "Helmets", "Gloves", "Bicycle Spares", "Cycling Jerseys"]
  },
  "hiking-trekking": {
    name: "Hiking & Trekking",
    dbCategoryName: "Hiking & Trekking",
    description: "Explore the wild with confidence. Instant pitch camping tents, anti-shock trekking poles, and thermal comfort sleeping bags.",
    heroImage: "https://images.unsplash.com/photo-1501555088652-021faa106b9b?w=1200&auto=format&fit=crop&q=80",
    gradient: "from-emerald-800 via-forest-900 to-amber-950",
    accentColor: "bg-emerald-700 border-emerald-600 text-emerald-700",
    bgBadge: "bg-emerald-100 text-emerald-800",
    promoText: "Weatherproof gear built for mountains. Tested under high winds and snow storms.",
    promoCode: "OUTDOOR10",
    offers: [
      "Get a free camping light on purchasing any tent above ₹2499",
      "Flat ₹300 off on extreme warmth sleeping bags",
      "Combo Offer: Trekking poles pair at 15% off"
    ],
    reviews: [
      { name: "Deepak S.", rating: 5, text: "The MH100 tent survived heavy rainfall at Triund. Sturdy poles and waterproof flysheet.", date: "2026-06-12" },
      { name: "Nisha J.", rating: 5, text: "Quechua anti-shock poles saved my knees during the descent. Must-have trek gear.", date: "2026-06-22" }
    ],
    subNavigation: ["Tents", "Trekking Poles", "Sleeping Bags", "Camping Furniture", "Trek Gear"]
  },
  "shoes": {
    name: "Shoes",
    dbCategoryName: "Shoes",
    description: "High-traction footwear customized for trail trekking, running, walking, and active court sports.",
    heroImage: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1200&auto=format&fit=crop&q=80",
    gradient: "from-orange-700 via-red-800 to-orange-950",
    accentColor: "bg-orange-600 border-orange-500 text-orange-600",
    bgBadge: "bg-orange-100 text-orange-800",
    promoText: "High-grip rubber soles with advanced shock cushioning. Ergonomically shaped.",
    promoCode: "STEPUP",
    offers: [
      "Buy active walking shoes, get extra comfort socks free",
      "Flat ₹400 Off on Cozy Mid Waterproof Boots",
      "Insoles & laces: 20% off when bought with shoes"
    ],
    reviews: [
      { name: "Rohit P.", rating: 5, text: "Lightweight walking shoes are perfect for daily morning runs. Great cushion.", date: "2026-06-16" },
      { name: "Aditi G.", rating: 4, text: "The waterproof boots are really snug and keep out mud perfectly on wet trails.", date: "2026-06-20" }
    ],
    subNavigation: ["Running Shoes", "Hiking Boots", "Walking Shoes", "Sports Insoles"]
  },
  "bags-backpacks": {
    name: "Bags & Backpacks",
    dbCategoryName: "Bags & Backpacks",
    description: "From 10L daily walks to 70L multi-day trekking expeditions. Compact rucksacks, travel bags, and gym duffles.",
    heroImage: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=1200&auto=format&fit=crop&q=80",
    gradient: "from-blue-800 via-sky-900 to-teal-950",
    accentColor: "bg-sky-600 border-sky-500 text-sky-600",
    bgBadge: "bg-sky-100 text-sky-800",
    promoText: "Durable wear-resistant fabrics with a 10-year warranty. Smart access pockets.",
    promoCode: "QUECHUABAG",
    offers: [
      "Quechua 10L Daypack: Free shipping + 10-year global warranty",
      "Flat ₹500 off on 60L+ multi-day hiking rucksacks",
      "Get a free rain cover on purchasing any sports duffle bag"
    ],
    reviews: [
      { name: "Vivek T.", rating: 5, text: "The Arpenaz 10L is impossibly cheap but lasts forever. Outstanding quality for ₹399.", date: "2026-06-02" },
      { name: "Sneha B.", rating: 5, text: "The Symbium rucksack fits like a glove. Balanced distribution and robust zippers.", date: "2026-06-19" }
    ],
    subNavigation: ["Hiking Daypacks", "Trekking Rucksacks", "Gym Duffles", "Running Belts"]
  },
  "sports-accessories": {
    name: "Sports Accessories",
    dbCategoryName: "Sports Accessories",
    description: "Essential training add-ons. Insulated double-wall steel bottles, polarized sunglasses, and heart rate smartwatches.",
    heroImage: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=1200&auto=format&fit=crop&q=80",
    gradient: "from-rose-600 via-rose-700 to-blue-900",
    accentColor: "bg-rose-600 border-rose-500 text-rose-600",
    bgBadge: "bg-rose-100 text-rose-800",
    promoText: "Ergonomic workout helpers. Double wall steel flasks and Polarized UV protectors.",
    promoCode: "ACCESS10",
    offers: [
      "Get 10% off on polarized sunglasses when buying any sports watch",
      "Stainless steel bottles combo: Flat 15% off",
      "Smart watch exchange: Up to ₹1000 off"
    ],
    reviews: [
      { name: "Rajesh L.", rating: 5, text: "Insulated bottle keeps my water ice-cold even after 12 hours in direct sun.", date: "2026-06-11" },
      { name: "Tanya C.", rating: 4, text: "Very good polarizing effect on the sunglasses. Glare is completely gone.", date: "2026-06-23" }
    ],
    subNavigation: ["Water Bottles", "Sunglasses", "Sports Watches", "Sweatbands", "Safety Guards"]
  }
};

const OTHER_CATEGORIES = [
  { id: "monsoon-essentials", name: "Monsoon Essentials", image: "https://images.unsplash.com/photo-1548883354-7622d03aca27?w=400&auto=format&fit=crop&q=80" },
  { id: "activewear", name: "Activewear", image: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=400&auto=format&fit=crop&q=80" },
  { id: "fitness-equipment", name: "Fitness Equipment", image: "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=400&auto=format&fit=crop&q=80" },
  { id: "cycling", name: "Cycling", image: "https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=400&auto=format&fit=crop&q=80" },
  { id: "hiking-trekking", name: "Hiking & Trekking", image: "https://images.unsplash.com/photo-1501555088652-021faa106b9b?w=400&auto=format&fit=crop&q=80" },
  { id: "shoes", name: "Shoes", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&auto=format&fit=crop&q=80" },
  { id: "bags-backpacks", name: "Bags & Backpacks", image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&auto=format&fit=crop&q=80" },
  { id: "sports-accessories", name: "Sports Accessories", image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400&auto=format&fit=crop&q=80" }
];

export default function CategorySubStore({ params }: PageProps) {
  const resolvedParams = use(params);
  const { categorySlug } = resolvedParams;

  const categoryMeta = CATEGORY_MAP[categorySlug];

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

  // Filters & Sorting state
  const [selectedBrand, setSelectedBrand] = useState<string>("All");
  const [maxPrice, setMaxPrice] = useState<number>(20000);
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<string>("featured");

  // Load products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/products");
        if (!res.ok) {
          throw new Error("Failed to load products from database");
        }
        const data = await res.json();
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
            category: p.category,
            stockStatus: p.stock_status
          };
        });
        setProducts(mapped);
      } catch (err: any) {
        console.error("Error loading products for category:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  if (!categoryMeta) {
    return (
      <div className="flex flex-col min-h-screen bg-zinc-50 text-zinc-900 font-sans">
        <Header />
        <main className="flex-1 max-w-7xl mx-auto px-4 py-24 text-center">
          <h2 className="text-3xl font-black uppercase text-zinc-950">Category Not Found</h2>
          <p className="text-zinc-500 mt-2">The sport page you requested does not exist or has been relocated.</p>
          <Link
            href="/"
            className="inline-block mt-6 px-6 py-3 bg-[#0072c6] text-white rounded-md font-extrabold uppercase hover:bg-blue-700 transition"
          >
            Back to Homepage
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  // Filter products by database category name
  const categoryProducts = products.filter(
    (p) => p.category === categoryMeta.dbCategoryName
  );

  const availableBrands = ["All", ...Array.from(new Set(categoryProducts.map((p) => p.brand)))];

  // Apply filters
  const filteredProducts = categoryProducts.filter((product) => {
    if (selectedBrand !== "All" && product.brand !== selectedBrand) return false;
    if (product.price > maxPrice) return false;
    if (inStockOnly && product.tag === "Limited stock") return false;
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      return (
        product.title.toLowerCase().includes(query) ||
        product.brand.toLowerCase().includes(query)
      );
    }
    return true;
  });

  // Apply sorting
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === "price-asc") return a.price - b.price;
    if (sortBy === "price-desc") return b.price - a.price;
    if (sortBy === "rating-desc") return b.rating - a.rating;
    if (sortBy === "reviews-desc") return b.reviewsCount - a.reviewsCount;
    return 0; // Default: Featured
  });

  // Section Partitions:
  // 1. Featured: Sorted products
  // 2. Best Sellers: Rating >= 4.6 or highest reviews count
  const bestSellers = sortedProducts.filter(p => p.rating >= 4.5 || p.reviewsCount > 1000);
  // 3. New Arrivals: Simple mock separation (e.g. ID ends with even digit or has a tag)
  const newArrivals = sortedProducts.filter((p, index) => index % 2 === 0 || p.tag === "Limited stock");

  const renderProductCard = (product: Product) => {
    const isLoved = isWishlisted(product.id);
    const hasDiscount = product.originalPrice && product.originalPrice > product.price;

    return (
      <div
        key={product.id}
        className="flex-shrink-0 bg-white border border-zinc-150 rounded-xl overflow-hidden shadow-xs hover:shadow-md hover:border-zinc-300 transition duration-300 flex flex-col justify-between relative group/card snap-start"
      >
        <button
          onClick={() => toggleWishlist(product)}
          className="absolute right-3 top-3 z-20 p-2 rounded-full bg-white/90 hover:bg-white text-zinc-400 hover:text-red-500 shadow-sm transition duration-300 border border-zinc-100 cursor-pointer"
        >
          <Heart
            className={`h-4 w-4 transition-colors duration-300 ${
              isLoved ? "text-red-500 fill-red-500" : ""
            }`}
          />
        </button>

        {product.tag && (
          <span className="absolute left-3 top-3 z-20 px-2 py-0.5 text-[8px] font-bold uppercase tracking-wider bg-[#eceafc] text-[#4a39b3] rounded-sm">
            {product.tag}
          </span>
        )}

        {/* Product Image */}
        <Link href={`/product/${product.id}`} className="relative h-48 w-full bg-zinc-50 overflow-hidden shrink-0 block cursor-pointer">
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

        <div className="p-4 flex-1 flex flex-col justify-between">
          <div>
            <span className="text-[9px] font-black text-[#0072c6] tracking-widest uppercase">
              {product.brand}
            </span>
            <Link href={`/product/${product.id}`} className="hover:text-[#0072c6] transition block">
              <h3 className="text-xs font-semibold text-zinc-900 mt-0.5 line-clamp-2 h-10 leading-tight">
                {product.title}
              </h3>
            </Link>

            <div className="flex items-center gap-1 mt-1 text-zinc-500 text-[10px] font-medium">
              <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
              <span className="text-zinc-800 font-bold">{product.rating}</span>
              <span>•</span>
              <span>{product.reviewsCount} reviews</span>
            </div>

            <div className="mt-2.5 flex items-baseline gap-1.5">
              <span className="text-sm font-black text-zinc-950">
                ₹{product.price.toLocaleString("en-IN")}
              </span>
              {hasDiscount && (
                <span className="text-[10px] text-zinc-400 line-through">
                  ₹{product.originalPrice?.toLocaleString("en-IN")}
                </span>
              )}
            </div>
          </div>

          <Link
            href={`/product/${product.id}`}
            className="w-full mt-4 py-1.5 border border-zinc-200 hover:border-[#0072c6] hover:bg-[#0072c6] hover:text-white rounded-md text-xs font-bold text-zinc-800 transition duration-300 flex items-center justify-center gap-1.5 group/btn cursor-pointer"
          >
            <ShoppingCart className="h-3 w-3 text-zinc-500 group-hover/btn:text-white transition duration-300" />
            Add to Cart
          </Link>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col min-h-screen bg-zinc-50 text-zinc-900 font-sans">
      <Header />

      {/* Main E-commerce Layout Content */}
      <main className="flex-1 w-full pb-16">
        
        {/* Breadcrumb Navigation */}
        <nav className="bg-white border-b border-zinc-150 py-3">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-1.5 text-xs font-bold text-zinc-500 uppercase tracking-wider">
            <Link href="/" className="hover:text-[#0072c6] transition">Home</Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span>Sports</span>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-zinc-900 font-black">{categoryMeta.name}</span>
          </div>
        </nav>

        {/* Large Hero Banner */}
        <section className={`relative text-white py-14 md:py-24 bg-gradient-to-r ${categoryMeta.gradient} overflow-hidden shadow-inner`}>
          <div className="absolute inset-0 bg-black/40 z-10" />
          <div className="absolute inset-0 z-0 opacity-40">
            <Image
              src={categoryMeta.heroImage}
              alt={categoryMeta.name}
              fill
              unoptimized
              className="object-cover scale-105"
            />
          </div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 flex flex-col items-start gap-4">
            <span className="inline-block px-3 py-1 rounded-full bg-yellow-400 text-zinc-950 text-[10px] font-black uppercase tracking-wider shadow-xs">
              DECATHLON STORE
            </span>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight uppercase drop-shadow-md">
              {categoryMeta.name}
            </h1>
            <p className="text-sm sm:text-base md:text-lg text-white/90 max-w-2xl leading-relaxed font-medium drop-shadow-xs">
              {categoryMeta.description}
            </p>

            {/* Quick Category specific navigation */}
            <div className="flex flex-wrap gap-2 mt-2">
              {categoryMeta.subNavigation.map((sub, i) => (
                <button
                  key={i}
                  onClick={() => setSearchQuery(sub)}
                  className="px-4 py-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 text-xs font-bold tracking-wide transition uppercase cursor-pointer"
                >
                  {sub}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Category specific promotional banner */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-radial from-zinc-900 to-zinc-950 border border-zinc-800 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-lg text-white">
            <div className="flex items-start gap-4">
              <div className="p-3.5 bg-yellow-400 text-zinc-950 rounded-2xl shrink-0">
                <Sparkles className="h-6 w-6" />
              </div>
              <div>
                <span className="text-[10px] font-black text-yellow-400 uppercase tracking-widest">
                  Hot Deal Campaign
                </span>
                <h3 className="text-lg md:text-xl font-black uppercase tracking-tight mt-1">
                  {categoryMeta.promoText}
                </h3>
                <p className="text-xs text-zinc-400 mt-1 font-semibold">
                  Enter coupon <strong className="text-white border-b border-dashed border-white/50">{categoryMeta.promoCode}</strong> at checkout for bonus rewards.
                </p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto shrink-0 justify-end">
              {categoryMeta.offers.map((offer, idx) => (
                <div
                  key={idx}
                  className="px-4 py-3 bg-white/5 border border-white/10 rounded-2xl flex items-center gap-2"
                >
                  <Tag className="h-4 w-4 text-yellow-400 flex-shrink-0" />
                  <span className="text-xs font-extrabold text-zinc-200">{offer}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Filters, Sorting & Shop workspace */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col lg:flex-row gap-8 items-start">
            
            {/* Sidebar Filters */}
            <aside className="w-full lg:w-64 bg-white border border-zinc-150 rounded-2xl p-5 shadow-xs shrink-0">
              <div className="flex items-center justify-between border-b border-zinc-100 pb-3.5 mb-4">
                <div className="flex items-center gap-2 font-black uppercase text-xs sm:text-sm text-zinc-900">
                  <Filter className="h-4 w-4 text-zinc-500" />
                  Filter Products
                </div>
                {(selectedBrand !== "All" || maxPrice !== 20000 || inStockOnly || searchQuery) && (
                  <button
                    onClick={() => {
                      setSelectedBrand("All");
                      setMaxPrice(20000);
                      setInStockOnly(false);
                      setSearchQuery("");
                    }}
                    className="text-[10px] font-bold text-[#0072c6] hover:underline"
                  >
                    Reset
                  </button>
                )}
              </div>

              <div className="space-y-6">
                {/* Brand */}
                <div>
                  <h4 className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-2.5">Brand</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {availableBrands.map((brand) => (
                      <button
                        key={brand}
                        onClick={() => setSelectedBrand(brand)}
                        className={`px-3 py-1.5 rounded-md text-xs font-bold transition uppercase cursor-pointer border ${
                          selectedBrand === brand
                            ? "bg-[#0072c6] border-[#0072c6] text-white"
                            : "bg-white border-zinc-200 text-zinc-700 hover:bg-zinc-50"
                        }`}
                      >
                        {brand}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price */}
                <div>
                  <h4 className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1.5">Price Limit</h4>
                  <div className="flex justify-between text-xs font-extrabold text-zinc-700 mb-1">
                    <span>Under ₹{maxPrice.toLocaleString()}</span>
                  </div>
                  <input
                    type="range"
                    min="200"
                    max="20000"
                    step="200"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(Number(e.target.value))}
                    className="w-full h-1.5 bg-zinc-200 rounded-lg appearance-none cursor-pointer accent-[#0072c6]"
                  />
                  <div className="flex justify-between text-[9px] font-bold text-zinc-400 mt-1">
                    <span>₹200</span>
                    <span>₹20,000</span>
                  </div>
                </div>

                {/* Availability Toggle */}
                <div className="pt-2 border-t border-zinc-100 flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-zinc-800">In Stock</h4>
                    <p className="text-[10px] text-zinc-400">Exclude limited stock</p>
                  </div>
                  <button
                    onClick={() => setInStockOnly(!inStockOnly)}
                    className={`w-10 h-6 rounded-full p-1 transition-colors duration-250 cursor-pointer ${
                      inStockOnly ? "bg-[#0072c6]" : "bg-zinc-200"
                    }`}
                  >
                    <div
                      className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-250 ${
                        inStockOnly ? "translate-x-4" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>
              </div>
            </aside>

            {/* Shop Listings Grid & Sort header */}
            <div className="flex-1 w-full space-y-12">
              
              {/* Toolbar Header */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-zinc-150 pb-4 gap-4">
                <span className="text-xs font-extrabold text-zinc-500 uppercase tracking-wider flex items-center gap-1">
                  <LayoutGrid className="h-4 w-4 text-zinc-400" />
                  Showing {sortedProducts.length} items
                </span>

                {/* Sorting options dropdown */}
                <div className="flex items-center gap-2 self-stretch sm:self-auto justify-between sm:justify-start">
                  <span className="text-xs font-bold text-zinc-500">Sort by:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="text-xs font-bold border border-zinc-200 rounded-md p-1.5 bg-white text-zinc-800 outline-none focus:border-[#0072c6] transition cursor-pointer"
                  >
                    <option value="featured">Featured Gear</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                    <option value="rating-desc">Highest Rated</option>
                    <option value="reviews-desc">Most Reviews</option>
                  </select>
                </div>
              </div>

              {loading ? (
                <div className="py-24 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0072c6] mx-auto"></div>
                  <p className="text-zinc-500 text-xs mt-3 font-semibold">Loading Store Inventory...</p>
                </div>
              ) : sortedProducts.length === 0 ? (
                <div className="bg-white border border-zinc-150 rounded-2xl py-20 px-6 text-center shadow-xs">
                  <h3 className="text-base font-black text-zinc-800 uppercase tracking-tight">No products match criteria</h3>
                  <p className="text-xs text-zinc-500 mt-1">Try clearing filters or search queries.</p>
                  <button
                    onClick={() => {
                      setSelectedBrand("All");
                      setMaxPrice(20000);
                      setInStockOnly(false);
                      setSearchQuery("");
                    }}
                    className="mt-5 px-5 py-2 bg-[#0072c6] text-white rounded-md text-xs font-bold uppercase hover:bg-blue-700 transition"
                  >
                    Clear Filters
                  </button>
                </div>
              ) : (
                <>
                  {/* Grid 1: Featured Gear */}
                  <div>
                    <h2 className="text-base font-black uppercase text-zinc-900 tracking-tight mb-4 flex items-center gap-2">
                      <LayoutGrid className="h-4 w-4 text-[#0072c6]" />
                      Featured Gear
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                      {sortedProducts.map(renderProductCard)}
                    </div>
                  </div>

                  {/* Grid 2: Best Sellers */}
                  {bestSellers.length > 0 && (
                    <div className="pt-8 border-t border-zinc-150">
                      <h2 className="text-base font-black uppercase text-zinc-900 tracking-tight mb-4 flex items-center gap-2">
                        <Award className="h-4.5 w-4.5 text-[#0072c6]" />
                        Best Sellers
                      </h2>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                        {bestSellers.map(renderProductCard)}
                      </div>
                    </div>
                  )}

                  {/* Grid 3: New Arrivals */}
                  {newArrivals.length > 0 && (
                    <div className="pt-8 border-t border-zinc-150">
                      <h2 className="text-base font-black uppercase text-zinc-900 tracking-tight mb-4 flex items-center gap-2">
                        <Calendar className="h-4.5 w-4.5 text-[#0072c6]" />
                        New Arrivals
                      </h2>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                        {newArrivals.map(renderProductCard)}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>

          </div>
        </section>

        {/* Customer Reviews Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
          <h2 className="text-lg font-black uppercase text-zinc-900 tracking-tight mb-6">
            Sport Lovers Feedback
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {categoryMeta.reviews.map((rev, index) => (
              <div
                key={index}
                className="bg-white border border-zinc-150 rounded-2xl p-6 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-0.5 text-amber-500 mb-2.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < rev.rating ? "fill-current" : "text-zinc-200"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-zinc-700 italic leading-relaxed">
                    &ldquo;{rev.text}&rdquo;
                  </p>
                </div>
                <div className="flex items-center justify-between border-t border-zinc-100 pt-4 mt-5">
                  <span className="text-xs font-black text-zinc-900 flex items-center gap-1.5">
                    <span className="h-6 w-6 bg-zinc-100 rounded-full flex items-center justify-center text-[10px] text-zinc-500 uppercase font-black">
                      {rev.name[0]}
                    </span>
                    {rev.name}
                  </span>
                  <span className="text-[10px] font-bold text-zinc-400">{rev.date}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Related Categories Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-20 border-t border-zinc-200 pt-16">
          <h2 className="text-xl font-black uppercase tracking-tight text-zinc-900 mb-6">
            Explore Other Sports
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {OTHER_CATEGORIES.filter((cat) => cat.id !== categorySlug).slice(0, 4).map((cat) => (
              <Link
                key={cat.id}
                href={`/sports/${cat.id}`}
                className="group relative h-32 rounded-xl overflow-hidden shadow-xs hover:shadow-md transition block border border-zinc-200"
              >
                <div className="absolute inset-0 bg-black/45 z-10 group-hover:bg-black/60 transition duration-300" />
                <Image
                  src={cat.image}
                  alt={cat.name}
                  fill
                  unoptimized
                  className="object-cover group-hover:scale-105 transition duration-500"
                  sizes="180px"
                />
                <div className="absolute bottom-3 left-3 z-20">
                  <span className="text-white text-xs font-black uppercase tracking-wider">
                    {cat.name}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Decathlon Guarantee Banner */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
          <div className="bg-zinc-950 text-white rounded-2xl p-6 md:p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-white/10 rounded-xl text-yellow-400">
                <ShieldCheck className="h-7 w-7" />
              </div>
              <div>
                <h3 className="text-lg font-black uppercase tracking-tight">Decathlon 2-Year Warranty</h3>
                <p className="text-xs text-zinc-400 mt-0.5 max-w-md">
                  We stand by our product quality. If your gear breaks or develops faults under normal use conditions, we replace or fix it free.
                </p>
              </div>
            </div>
            <Link
              href="/"
              className="px-5 py-2.5 bg-white text-zinc-950 rounded-lg text-xs font-black uppercase tracking-wide hover:bg-zinc-200 transition shrink-0"
            >
              Know More
            </Link>
          </div>
        </section>

      </main>

      <Footer />

      <CartDrawer />
      <WishlistDrawer />
    </div>
  );
}
