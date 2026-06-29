"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Product, CartItem } from "../types";

interface CartContextType {
  cart: CartItem[];
  wishlist: Product[];
  isCartOpen: boolean;
  setCartOpen: (open: boolean) => void;
  isWishlistOpen: boolean;
  setWishlistOpen: (open: boolean) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  addToCart: (product: Product, quantity?: number, size?: string, color?: string) => void;
  removeFromCart: (productId: string, size?: string, color?: string) => void;
  updateQuantity: (productId: string, quantity: number, size?: string, color?: string) => void;
  clearCart: () => void;
  toggleWishlist: (product: Product) => void;
  isWishlisted: (productId: string) => boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [isCartOpen, setCartOpen] = useState(false);
  const [isWishlistOpen, setWishlistOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Load cart and wishlist from localStorage on mount
  useEffect(() => {
    try {
      const storedCart = localStorage.getItem("decathlon_cart");
      const storedWishlist = localStorage.getItem("decathlon_wishlist");
      if (storedCart) setCart(JSON.parse(storedCart));
      if (storedWishlist) setWishlist(JSON.parse(storedWishlist));
    } catch (e) {
      console.error("Failed to load local storage state:", e);
    }
  }, []);

  // Save cart to localStorage when it changes
  useEffect(() => {
    try {
      localStorage.setItem("decathlon_cart", JSON.stringify(cart));
    } catch (e) {
      console.error("Failed to save cart to local storage:", e);
    }
  }, [cart]);

  // Save wishlist to localStorage when it changes
  useEffect(() => {
    try {
      localStorage.setItem("decathlon_wishlist", JSON.stringify(wishlist));
    } catch (e) {
      console.error("Failed to save wishlist to local storage:", e);
    }
  }, [wishlist]);

  const addToCart = (product: Product, quantity = 1, size?: string, color?: string) => {
    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex(
        (item) =>
          item.product.id === product.id &&
          item.size === size &&
          item.color === color
      );
      if (existingIndex !== -1) {
        return prevCart.map((item, idx) =>
          idx === existingIndex
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prevCart, { product, quantity, size, color }];
    });
    setCartOpen(true); // Auto-open cart drawer for a responsive feedback loop
  };

  const removeFromCart = (productId: string, size?: string, color?: string) => {
    setCart((prevCart) =>
      prevCart.filter(
        (item) =>
          !(item.product.id === productId && item.size === size && item.color === color)
      )
    );
  };

  const updateQuantity = (productId: string, quantity: number, size?: string, color?: string) => {
    if (quantity <= 0) {
      removeFromCart(productId, size, color);
      return;
    }
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.product.id === productId && item.size === size && item.color === color
          ? { ...item, quantity }
          : item
      )
    );
  };

  const clearCart = () => setCart([]);

  const toggleWishlist = (product: Product) => {
    setWishlist((prevWishlist) => {
      const exists = prevWishlist.some((item) => item.id === product.id);
      if (exists) {
        return prevWishlist.filter((item) => item.id !== product.id);
      }
      return [...prevWishlist, product];
    });
  };

  const isWishlisted = (productId: string) => {
    return wishlist.some((item) => item.id === productId);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        wishlist,
        isCartOpen,
        setCartOpen,
        isWishlistOpen,
        setWishlistOpen,
        searchQuery,
        setSearchQuery,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        toggleWishlist,
        isWishlisted,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
