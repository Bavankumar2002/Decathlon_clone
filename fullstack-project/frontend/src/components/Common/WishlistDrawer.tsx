"use client";

import React from "react";
import { useCart } from "../../store/CartContext";
import { X, Heart, ShoppingCart, Trash2 } from "lucide-react";
import Image from "next/image";

export const WishlistDrawer: React.FC = () => {
  const {
    wishlist,
    isWishlistOpen,
    setWishlistOpen,
    addToCart,
    toggleWishlist,
  } = useCart();

  if (!isWishlistOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden font-sans">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/55 backdrop-blur-xs transition-opacity duration-300"
        onClick={() => setWishlistOpen(false)}
      />

      <div className="absolute inset-y-0 right-0 pl-10 max-w-full flex">
        <div className="w-screen max-w-md transform transition-all duration-300 ease-in-out bg-white shadow-2xl flex flex-col">
          {/* Header */}
          <div className="px-6 py-5 border-b border-zinc-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-red-500 fill-red-500" />
              <h2 className="text-lg font-bold text-zinc-900">Your Wishlist ({wishlist.length})</h2>
            </div>
            <button
              onClick={() => setWishlistOpen(false)}
              className="p-1 rounded-full text-zinc-400 hover:text-zinc-500 hover:bg-zinc-100 transition"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Wishlist Items List */}
          <div className="flex-1 overflow-y-auto px-6 py-4 no-scrollbar">
            {wishlist.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <div className="w-20 h-20 rounded-full bg-zinc-50 flex items-center justify-center mb-4">
                  <Heart className="h-10 w-10 text-zinc-400" />
                </div>
                <h3 className="text-base font-semibold text-zinc-800">Your wishlist is empty</h3>
                <p className="text-sm text-zinc-500 mt-1 max-w-xs">
                  Tap the heart icon on your favorite items to save them here for later!
                </p>
                <button
                  onClick={() => setWishlistOpen(false)}
                  className="mt-6 px-6 py-2.5 bg-[#0072c6] text-white rounded-md text-sm font-semibold hover:bg-blue-700 transition"
                >
                  Explore Products
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {wishlist.map((product) => (
                  <div key={product.id} className="flex gap-4 border-b border-zinc-100 pb-4">
                    <div className="relative h-20 w-20 rounded-md overflow-hidden bg-zinc-50 flex-shrink-0">
                      <Image
                        src={product.image}
                        alt={product.title}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    </div>
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <span className="text-[10px] font-bold text-[#0072c6] tracking-wider uppercase">
                          {product.brand}
                        </span>
                        <h4 className="text-sm font-medium text-zinc-900 line-clamp-1">
                          {product.title}
                        </h4>
                        <div className="flex items-baseline gap-2 mt-1">
                          <span className="text-sm font-bold text-zinc-900">
                            ₹{product.price.toLocaleString("en-IN")}
                          </span>
                          {product.originalPrice && product.originalPrice > product.price && (
                            <span className="text-[11px] text-zinc-400 line-through">
                              MRP ₹{product.originalPrice.toLocaleString("en-IN")}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <button
                          onClick={() => {
                            addToCart(product);
                            toggleWishlist(product); // Remove from wishlist after moving to cart
                          }}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0072c6] text-white rounded-md text-xs font-semibold hover:bg-blue-700 transition"
                        >
                          <ShoppingCart className="h-3.5 w-3.5" />
                          Add to Cart
                        </button>
                        <button
                          onClick={() => toggleWishlist(product)}
                          className="p-1.5 text-zinc-400 hover:text-red-500 rounded-md hover:bg-red-50 transition"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
