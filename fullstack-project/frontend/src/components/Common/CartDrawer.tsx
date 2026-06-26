"use client";

import React from "react";
import { useCart } from "../../store/CartContext";
import { X, Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import Image from "next/image";

export const CartDrawer: React.FC = () => {
  const { cart, isCartOpen, setCartOpen, updateQuantity, removeFromCart } = useCart();

  if (!isCartOpen) return null;

  const subtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden font-sans">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/55 backdrop-blur-xs transition-opacity duration-300"
        onClick={() => setCartOpen(false)}
      />

      <div className="absolute inset-y-0 right-0 pl-10 max-w-full flex">
        <div className="w-screen max-w-md transform transition-all duration-300 ease-in-out bg-white shadow-2xl flex flex-col">
          {/* Header */}
          <div className="px-6 py-5 border-b border-zinc-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="h-5 w-5 text-[#0072c6]" />
              <h2 className="text-lg font-bold text-zinc-900">Your Cart ({totalItems})</h2>
            </div>
            <button
              onClick={() => setCartOpen(false)}
              className="p-1 rounded-full text-zinc-400 hover:text-zinc-500 hover:bg-zinc-100 transition"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto px-6 py-4 no-scrollbar">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <div className="w-20 h-20 rounded-full bg-zinc-50 flex items-center justify-center mb-4">
                  <ShoppingBag className="h-10 w-10 text-zinc-400" />
                </div>
                <h3 className="text-base font-semibold text-zinc-800">Your cart is empty</h3>
                <p className="text-sm text-zinc-500 mt-1 max-w-xs">
                  Fill it with Decathlon's sports gear to kickstart your fitness journey!
                </p>
                <button
                  onClick={() => setCartOpen(false)}
                  className="mt-6 px-6 py-2.5 bg-[#0072c6] text-white rounded-md text-sm font-semibold hover:bg-blue-700 transition"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {cart.map((item) => (
                  <div key={item.product.id} className="flex gap-4 border-b border-zinc-100 pb-4">
                    <div className="relative h-20 w-20 rounded-md overflow-hidden bg-zinc-50 flex-shrink-0">
                      <Image
                        src={item.product.image}
                        alt={item.product.title}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    </div>
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <span className="text-[10px] font-bold text-[#0072c6] tracking-wider uppercase">
                          {item.product.brand}
                        </span>
                        <h4 className="text-sm font-medium text-zinc-900 line-clamp-1">
                          {item.product.title}
                        </h4>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        {/* Quantity Counter */}
                        <div className="flex items-center border border-zinc-200 rounded-md overflow-hidden">
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            className="p-1.5 hover:bg-zinc-50 text-zinc-500 transition"
                          >
                            <Minus className="h-3.5 w-3.5" />
                          </button>
                          <span className="px-3 text-xs font-semibold text-zinc-800">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            className="p-1.5 hover:bg-zinc-50 text-zinc-500 transition"
                          >
                            <Plus className="h-3.5 w-3.5" />
                          </button>
                        </div>
                        {/* Price & Remove */}
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-bold text-zinc-900">
                            ₹{(item.product.price * item.quantity).toLocaleString("en-IN")}
                          </span>
                          <button
                            onClick={() => removeFromCart(item.product.id)}
                            className="p-1.5 text-zinc-400 hover:text-red-500 rounded-md hover:bg-red-50 transition"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer Checkout Summary */}
          {cart.length > 0 && (
            <div className="border-t border-zinc-100 px-6 py-6 bg-zinc-50">
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm text-zinc-600">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between text-sm text-zinc-600">
                  <span>Shipping</span>
                  <span className="text-green-600 font-medium">FREE</span>
                </div>
                <div className="border-t border-zinc-200 pt-3 flex justify-between text-base font-bold text-zinc-900">
                  <span>Total Amount</span>
                  <span>₹{subtotal.toLocaleString("en-IN")}</span>
                </div>
              </div>
              <button
                onClick={() => alert("Checkout pipeline activated! Thank you for choosing Decathlon.")}
                className="w-full py-3.5 bg-[#0072c6] text-white rounded-md font-bold text-center hover:bg-blue-700 transition shadow-md hover:shadow-lg"
              >
                Proceed to Checkout
              </button>
              <button
                onClick={() => setCartOpen(false)}
                className="w-full text-center mt-3 text-sm font-semibold text-zinc-500 hover:text-zinc-800 transition"
              >
                Continue Shopping
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
