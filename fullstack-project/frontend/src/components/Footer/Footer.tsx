"use client";

import React, { useState } from "react";
import {
  RotateCcw,
  Store,
  Truck,
  Smile,
  RefreshCw,
  Globe,
  ChevronDown,
} from "lucide-react";

export const Footer: React.FC = () => {
  const [countryMenuOpen, setCountryMenuOpen] = useState(false);

  const servicesLinks = [
    "Decathlon for Schools",
    "Decathlon for Corporates",
    "Decathlon for Sport Clubs",
    "Giftcard",
    "Affiliate Program",
    "Playo Summer",
    "Second life",
    "Buy back",
    "Installation & assembly",
  ];

  const helpLinks = [
    "Find a store",
    "Return Policy",
    "Shipping policy",
    "Sitemap",
  ];

  const aboutLinks = [
    "About us",
    "Made In India",
    "Social & CSR Initiatives",
    "Careers",
    "Blog",
  ];

  return (
    <footer className="w-full font-sans text-white shrink-0 mt-auto">
      {/* 1. Value Assurances Blue Ribbon */}
      <div className="w-full bg-[#2b44b3] py-5 border-b border-blue-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-5 gap-6 text-center text-xs font-bold tracking-wide">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 group cursor-pointer">
            <div className="p-2 bg-white/10 rounded-full group-hover:bg-white/20 transition">
              <RotateCcw className="h-5 w-5" />
            </div>
            <span>Easy Returns*</span>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 group cursor-pointer">
            <div className="p-2 bg-white/10 rounded-full group-hover:bg-white/20 transition">
              <Store className="h-5 w-5" />
            </div>
            <span>Collect in-store</span>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 group cursor-pointer">
            <div className="p-2 bg-white/10 rounded-full group-hover:bg-white/20 transition">
              <Truck className="h-5 w-5" />
            </div>
            <span>Express Delivery *</span>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 group cursor-pointer">
            <div className="p-2 bg-white/10 rounded-full group-hover:bg-white/20 transition">
              <Smile className="h-5 w-5" />
            </div>
            <span>1 Mn+ happy customers</span>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 group-row-span-2 sm:group-row-span-1 group cursor-pointer col-span-2 md:col-span-1">
            <div className="p-2 bg-white/10 rounded-full group-hover:bg-white/20 transition">
              <RefreshCw className="h-5 w-5" />
            </div>
            <span>We buy back</span>
          </div>
        </div>
      </div>

      {/* 2. Deep Blue Main Columns */}
      <div className="w-full bg-[#24379b] py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* App Info & Membership */}
          <div className="space-y-6">
            <div>
              <h4 className="text-sm font-bold uppercase tracking-wider text-zinc-350">
                Download the app
              </h4>
              <div className="flex gap-3 mt-3">
                {/* Simulated App Badges */}
                <button className="px-4 py-2 border border-white/25 rounded-md hover:bg-white/10 text-xs font-semibold transition text-left flex items-center gap-2 shrink-0">
                  <span className="text-[9px] font-medium block">GET IT ON</span>
                  <span className="font-extrabold text-xs block -mt-1">Google Play</span>
                </button>
                <button className="px-4 py-2 border border-white/25 rounded-md hover:bg-white/10 text-xs font-semibold transition text-left flex items-center gap-2 shrink-0">
                  <span className="text-[9px] font-medium block">Download on the</span>
                  <span className="font-extrabold text-xs block -mt-1">App Store</span>
                </button>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-bold uppercase tracking-wider text-zinc-350">
                Become a member
              </h4>
              <p className="text-xs text-zinc-300 mt-2 max-w-xs leading-relaxed">
                Join our community for tailored advice, extended return pipelines, and early access to drops.
              </p>
              <button className="mt-3 px-5 py-2 bg-white text-[#24379b] rounded-md text-xs font-extrabold hover:bg-zinc-100 transition shadow-sm">
                Sign Up Now
              </button>
            </div>

            {/* Social icons */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-350">
                Follow Us
              </h4>
              <div className="flex gap-4 mt-3">
                <a href="#" className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition" aria-label="Facebook">
                  <svg className="h-4.5 w-4.5 text-white fill-current" viewBox="0 0 24 24">
                    <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.8c4.56-.93 8-4.96 8-9.8z"/>
                  </svg>
                </a>
                <a href="#" className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition font-bold text-sm leading-none flex items-center justify-center h-8.5 w-8.5 text-center" aria-label="X">
                  𝕏
                </a>
                <a href="#" className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition" aria-label="YouTube">
                  <svg className="h-4.5 w-4.5 text-white fill-current" viewBox="0 0 24 24">
                    <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.107C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.388.511a3.002 3.002 0 0 0-2.11 2.107C0 8.053 0 12 0 12s0 3.947.502 5.837a3.003 3.003 0 0 0 2.11 2.107C4.495 20.455 12 20.455 12 20.455s7.505 0 9.388-.511a3.003 3.003 0 0 0 2.11-2.107C24 15.947 24 12 24 12s0-3.947-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </a>
                <a href="#" className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition" aria-label="Instagram">
                  <svg className="h-4.5 w-4.5 text-white" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* SERVICES Column */}
          <div>
            <h4 className="text-sm font-extrabold uppercase tracking-wider text-zinc-100 mb-4 border-b border-white/10 pb-2">
              Services
            </h4>
            <ul className="space-y-2 text-xs font-bold text-zinc-300">
              {servicesLinks.map((link, idx) => (
                <li key={idx}>
                  <a href="#" className="hover:text-white hover:underline transition">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* HELP Column */}
          <div>
            <h4 className="text-sm font-extrabold uppercase tracking-wider text-zinc-100 mb-4 border-b border-white/10 pb-2">
              Help Center
            </h4>
            <ul className="space-y-2 text-xs font-bold text-zinc-300">
              {helpLinks.map((link, idx) => (
                <li key={idx}>
                  <a href="#" className="hover:text-white hover:underline transition">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* ABOUT Column */}
          <div>
            <h4 className="text-sm font-extrabold uppercase tracking-wider text-zinc-100 mb-4 border-b border-white/10 pb-2">
              About Us
            </h4>
            <ul className="space-y-2 text-xs font-bold text-zinc-300">
              {aboutLinks.map((link, idx) => (
                <li key={idx}>
                  <a href="#" className="hover:text-white hover:underline transition">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* 3. Bottom Legal / Copyright Row */}
      <div className="w-full bg-[#1e2e85] py-8 text-xs text-zinc-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            {/* White Decathlon Logo */}
            <span className="text-lg font-black tracking-widest text-white uppercase select-none">
              DECATHLON
            </span>
            <div className="flex items-center gap-4 text-[11px] font-semibold text-zinc-400">
              <a href="#" className="hover:text-white hover:underline transition">
                Terms and Conditions
              </a>
              <span>|</span>
              <a href="#" className="hover:text-white hover:underline transition">
                Privacy Policy
              </a>
            </div>
          </div>

          {/* Country Selector & Copyright */}
          <div className="flex flex-col sm:flex-row items-center gap-6 shrink-0">
            {/* Country Selector */}
            <div className="relative">
              <button
                onClick={() => setCountryMenuOpen(!countryMenuOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 border border-white/20 bg-white/5 rounded-md hover:bg-white/10 text-white font-bold transition shrink-0"
              >
                <Globe className="h-3.5 w-3.5" />
                <span className="flex items-center gap-1">
                  🇮🇳 India
                </span>
                <ChevronDown className="h-3.5 w-3.5 text-zinc-400" />
              </button>

              {countryMenuOpen && (
                <div className="absolute bottom-full right-0 mb-2 w-32 bg-white rounded-md shadow-xl border border-zinc-200 text-zinc-800 text-xs font-bold py-1 z-30">
                  <button
                    onClick={() => setCountryMenuOpen(false)}
                    className="w-full px-3 py-2 text-left hover:bg-zinc-100 flex items-center gap-1.5"
                  >
                    🇮🇳 India
                  </button>
                  <button
                    onClick={() => setCountryMenuOpen(false)}
                    className="w-full px-3 py-2 text-left hover:bg-zinc-100 flex items-center gap-1.5"
                  >
                    🇬🇧 United Kingdom
                  </button>
                  <button
                    onClick={() => setCountryMenuOpen(false)}
                    className="w-full px-3 py-2 text-left hover:bg-zinc-100 flex items-center gap-1.5"
                  >
                    🇫🇷 France
                  </button>
                </div>
              )}
            </div>

            <span className="text-[11px] text-zinc-400 text-center font-medium">
              © 2026 Decathlon Sports India Pvt Ltd. All rights reserved.
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
