"use client";

import React, { useState, useEffect } from "react";
import { useCart } from "../../store/CartContext";
import { useAuth } from "../../store/authStore";
import Link from "next/link";
import {
  Search,
  User,
  Store,
  HelpCircle,
  Heart,
  ShoppingBag,
  MapPin,
  Menu,
  X,
  ChevronDown,
} from "lucide-react";

export const Header: React.FC = () => {
  const {
    cart,
    wishlist,
    setCartOpen,
    setWishlistOpen,
    searchQuery,
    setSearchQuery,
  } = useCart();

  const { user, isAuthenticated, logout } = useAuth();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [locationModalOpen, setLocationModalOpen] = useState(false);
  const [location, setLocation] = useState(
    "Bangalore Central, Bangalore, 560001, Karnataka"
  );
  const [tempLocation, setTempLocation] = useState(location);
  const [placeholderIndex, setPlaceholderIndex] = useState(0);

  const placeholders = [
    'Search for "Badminton Rackets"',
    'Search for "Carrom Boards"',
    'Search for "Rain"',
    'Search for "Hiking Shoes"',
    'Search for "T-shirts"',
  ];

  // Rotate placeholders for micro-animation effect
  useEffect(() => {
    const timer = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % placeholders.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const totalCartItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  const handleLocationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (tempLocation.trim()) {
      setLocation(tempLocation);
      setLocationModalOpen(false);
    }
  };

  return (
    <header className="w-full bg-white border-b border-zinc-100 sticky top-0 z-40 font-sans shadow-xs">
      {/* Top Header Row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(true)}
          className="lg:hidden p-2 -ml-2 text-zinc-600 hover:text-zinc-900"
        >
          <Menu className="h-6 w-6" />
        </button>

        {/* Decathlon Logo */}
        <Link href="/" className="flex-shrink-0 flex items-center text-[#0072c6]">
          <svg
            className="h-7 sm:h-9 w-auto"
            viewBox="0 0 350 70"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Decathlon styled Wordmark */}
            <path d="M0 60V10H16.8C25.6 10 32.4 12.3 37.2 16.9C42 21.5 44.4 27.8 44.4 35.8C44.4 43.6 42 49.8 37.2 54.4C32.4 59 25.6 61.2 16.8 61.2H0V60ZM11.6 50.8H15.6C21 50.8 24.8 49.5 27.2 46.9C29.6 44.3 30.8 40.4 30.8 35.3C30.8 30.2 29.6 26.5 27.2 23.9C24.8 21.3 21 20 15.6 20H11.6V50.8Z" />
            <path d="M52 10H86.4V19.6H63.6V30.4H83.2V40H63.6V50.8H86.8V60.4H52V10Z" />
            <path d="M125.6 52.8C122.8 57.8 117.6 60.4 110 60.4C102 60.4 95.8 57.8 91.4 52.6C87 47.4 84.8 40.2 84.8 31C84.8 21.8 87 14.6 91.4 9.4C95.8 4.2 102 1.6 110 1.6C117.6 1.6 122.8 4.2 125.6 9.2L117.6 16.4C115.8 13.2 113.2 11.6 109.8 11.6C106 11.6 103 13.2 100.8 16.4C98.6 19.6 97.5 24.5 97.5 31C97.5 37.5 98.6 42.4 100.8 45.6C103 48.8 106 50.4 109.8 50.4C113.2 50.4 115.8 48.8 117.6 45.6L125.6 52.8Z" fill="#0072c6" />
            <path d="M135.2 60L148.8 10H160.8L174.4 60H162.8L159.2 46.8H150.4L146.8 60H135.2ZM152 38.4H157.6L154.8 26.8L152 38.4Z" />
            <path d="M178.4 19.6H192.4V60H204V19.6H218V10H178.4V19.6Z" />
            <path d="M224 10H235.6V30.4H254.4V10H266V60H254.4V40H223.9V60H212.3L224 10Z" />
            <path d="M272.8 10H284.4V50.8H306V60.4H272.8V10Z" />
            <path d="M341.2 52.6C336.8 57.8 330.6 60.4 322.6 60.4C314.6 60.4 308.4 57.8 304 52.6C299.6 47.4 297.4 40.2 297.4 31C297.4 21.8 299.6 14.6 304 9.4C308.4 4.2 314.6 1.6 322.6 1.6C330.6 1.6 336.8 4.2 341.2 9.4C345.6 14.6 347.8 21.8 347.8 31C347.8 40.2 345.6 47.4 341.2 52.6ZM312.8 45.6C315 48.8 318 50.4 321.8 50.4C325.6 50.4 328.6 48.8 330.8 45.6C333 42.4 334.1 37.5 334.1 31C334.1 24.5 333 19.6 330.8 16.4C328.6 13.2 325.6 11.6 321.8 11.6C318 11.6 315 13.2 312.8 16.4C310.6 19.6 309.5 24.5 309.5 31C309.5 37.5 310.6 42.4 312.8 45.6Z" />
          </svg>
        </Link>

        {/* Search Bar */}
        <div className="flex-1 max-w-2xl relative hidden md:block">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={placeholders[placeholderIndex]}
              className="w-full h-11 pl-12 pr-4 bg-zinc-100 hover:bg-zinc-200/70 focus:bg-white focus:ring-2 focus:ring-[#0072c6] focus:outline-hidden text-sm rounded-full text-zinc-900 placeholder-zinc-500 font-medium transition-all"
            />
            <Search className="absolute left-4 top-3.5 h-4.5 w-4.5 text-zinc-500" />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-4 top-3 text-xs text-zinc-400 hover:text-zinc-600 font-semibold"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Actions Menu */}
        <div className="flex items-center gap-2 sm:gap-4 md:gap-6 text-zinc-700">
          {isAuthenticated ? (
            <button
              onClick={logout}
              className="flex flex-col items-center gap-0.5 hover:text-[#0072c6] transition group cursor-pointer"
            >
              <User className="h-5 w-5 text-zinc-800 group-hover:text-[#0072c6] fill-zinc-300" />
              <span className="text-[10px] font-bold text-[#0072c6] hidden sm:inline truncate max-w-[60px]">
                {user?.name.split(" ")[0]} (Out)
              </span>
            </button>
          ) : (
            <Link
              href="/login"
              className="flex flex-col items-center gap-0.5 hover:text-[#0072c6] transition group cursor-pointer"
            >
              <User className="h-5 w-5 text-zinc-800 group-hover:text-[#0072c6]" />
              <span className="text-[10px] font-semibold hidden sm:inline">Sign In</span>
            </Link>
          )}
          <button className="flex flex-col items-center gap-0.5 hover:text-[#0072c6] transition group">
            <Store className="h-5 w-5 text-zinc-800 group-hover:text-[#0072c6]" />
            <span className="text-[10px] font-semibold hidden sm:inline">My Store</span>
          </button>
          <button className="flex flex-col items-center gap-0.5 hover:text-[#0072c6] transition group">
            <HelpCircle className="h-5 w-5 text-zinc-800 group-hover:text-[#0072c6]" />
            <span className="text-[10px] font-semibold hidden sm:inline">Support</span>
          </button>
          {/* Wishlist */}
          <button
            onClick={() => setWishlistOpen(true)}
            className="flex flex-col items-center gap-0.5 hover:text-[#0072c6] transition group relative"
          >
            <Heart className="h-5 w-5 text-zinc-800 group-hover:text-[#0072c6]" />
            {wishlist.length > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white font-bold text-[9px] h-4.5 w-4.5 rounded-full flex items-center justify-center animate-bounce">
                {wishlist.length}
              </span>
            )}
            <span className="text-[10px] font-semibold hidden sm:inline">Wishlist</span>
          </button>
          {/* Cart */}
          <button
            onClick={() => setCartOpen(true)}
            className="flex flex-col items-center gap-0.5 hover:text-[#0072c6] transition group relative"
          >
            <ShoppingBag className="h-5 w-5 text-zinc-800 group-hover:text-[#0072c6]" />
            {totalCartItems > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-[#0072c6] text-white font-bold text-[9px] h-4.5 w-4.5 rounded-full flex items-center justify-center animate-pulse">
                {totalCartItems}
              </span>
            )}
            <span className="text-[10px] font-semibold hidden sm:inline">Cart</span>
          </button>
        </div>
      </div>

      {/* Sub-Header Navigation Row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-12 flex items-center justify-between border-t border-zinc-100 text-sm font-semibold text-zinc-800">
        {/* Navigation Categories */}
        <nav className="hidden lg:flex items-center gap-8 h-full">
          <a
            href="#"
            className="hover:text-[#0072c6] hover:border-b-2 hover:border-[#0072c6] py-3.5 transition"
          >
            All Sports
          </a>
          <a
            href="#"
            className="hover:text-[#0072c6] hover:border-b-2 hover:border-[#0072c6] py-3.5 transition"
          >
            Men
          </a>
          <a
            href="#"
            className="hover:text-[#0072c6] hover:border-b-2 hover:border-[#0072c6] py-3.5 transition"
          >
            Women
          </a>
          <a
            href="#"
            className="hover:text-[#0072c6] hover:border-b-2 hover:border-[#0072c6] py-3.5 transition"
          >
            Kids
          </a>
        </nav>

        {/* Mobile Search Indicator */}
        <div className="md:hidden flex-1 max-w-sm mr-4">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search gear..."
              className="w-full h-8 pl-9 pr-3 bg-zinc-100 focus:bg-white focus:outline-hidden text-xs rounded-full text-zinc-900 placeholder-zinc-500 font-medium transition-all"
            />
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-zinc-500" />
          </div>
        </div>

        {/* Delivery Location Section */}
        <button
          onClick={() => setLocationModalOpen(true)}
          className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-[#0072c6] transition shrink-0"
        >
          <MapPin className="h-4 w-4 text-[#0072c6]" />
          <span>Delivery to</span>
          <span className="text-[#0072c6] font-bold line-clamp-1 max-w-[200px] sm:max-w-xs md:max-w-md">
            {location}
          </span>
          <ChevronDown className="h-3 w-3 text-zinc-400" />
        </button>
      </div>

      {/* Interactive Delivery Location Selector Modal */}
      {locationModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-xs"
            onClick={() => setLocationModalOpen(false)}
          />
          {/* Content */}
          <div className="relative bg-white rounded-xl shadow-2xl p-6 max-w-md w-full border border-zinc-100">
            <button
              onClick={() => setLocationModalOpen(false)}
              className="absolute right-4 top-4 p-1 rounded-full text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 transition"
            >
              <X className="h-5 w-5" />
            </button>
            <h3 className="text-base font-bold text-zinc-950 flex items-center gap-2 mb-3">
              <MapPin className="h-5 w-5 text-[#0072c6]" />
              Select Delivery Location
            </h3>
            <p className="text-xs text-zinc-500 mb-4">
              Enter your address or pin code to view stock availability and delivery options in your area.
            </p>
            <form onSubmit={handleLocationSubmit} className="space-y-4">
              <input
                type="text"
                value={tempLocation}
                onChange={(e) => setTempLocation(e.target.value)}
                placeholder="e.g. Bangalore Central, Bangalore, 560001, Karnataka"
                className="w-full px-4 py-2.5 border border-zinc-200 rounded-md focus:ring-2 focus:ring-[#0072c6] focus:outline-hidden text-sm text-zinc-800 font-medium"
              />
              <div className="flex gap-3 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setLocationModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-zinc-600 bg-zinc-100 hover:bg-zinc-200 rounded-md transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-[#0072c6] hover:bg-blue-700 rounded-md transition"
                >
                  Save Address
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Mobile Drawer Navigation Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setMobileMenuOpen(false)}
          />
          {/* Menu Panel */}
          <div className="absolute inset-y-0 left-0 max-w-xs w-full bg-white shadow-2xl flex flex-col z-50">
            <div className="px-6 py-5 border-b border-zinc-100 flex items-center justify-between">
              <span className="text-sm font-bold text-zinc-900 uppercase tracking-wide">
                Menu
              </span>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-1 rounded-full text-zinc-400 hover:text-zinc-600 transition"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <nav className="flex-1 px-6 py-4 space-y-4 text-sm font-semibold text-zinc-800">
              <a
                href="#"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 border-b border-zinc-50 hover:text-[#0072c6]"
              >
                All Sports
              </a>
              <a
                href="#"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 border-b border-zinc-50 hover:text-[#0072c6]"
              >
                Men
              </a>
              <a
                href="#"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 border-b border-zinc-50 hover:text-[#0072c6]"
              >
                Women
              </a>
              <a
                href="#"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 border-b border-zinc-50 hover:text-[#0072c6]"
              >
                Kids
              </a>
            </nav>
            <div className="p-6 bg-zinc-50 border-t border-zinc-100 text-xs text-zinc-500 space-y-2">
              <p>📍 {location}</p>
              <p>© 2026 Decathlon Sports India</p>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
