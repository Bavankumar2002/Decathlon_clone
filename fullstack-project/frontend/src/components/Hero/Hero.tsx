"use client";

import React, { useState, useEffect } from "react";
import { QrCode, ArrowRight, ArrowLeft, AlertTriangle } from "lucide-react";
import Image from "next/image";

export const Hero: React.FC = () => {
  const [currentAlert, setCurrentAlert] = useState(0);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Rotating alerts (Blue App banner vs Red recall alert)
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentAlert((prev) => (prev + 1) % 2);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const heroSlides = [
    {
      title: "Monsoon Hiking & Trekking gear",
      subtitle: "Stay dry, warm, and secure on any trail",
      buttonText: "Shop Rainwear",
      image: "https://images.unsplash.com/photo-1551632879-6fdc519de10b?w=1200&auto=format&fit=crop&q=80",
    },
    {
      title: "Explore the Outdoors on Two Wheels",
      subtitle: "Premium mountain and hybrid bicycles",
      buttonText: "Explore Cycling",
      image: "https://images.unsplash.com/photo-1541614101331-1a5a3a194e92?w=1200&auto=format&fit=crop&q=80",
    },
    {
      title: "Elevate Your Home Fitness Journey",
      subtitle: "Save up to 40% on fitness equipment",
      buttonText: "Shop Fitness",
      image: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=1200&auto=format&fit=crop&q=80",
    },
  ];

  // Auto-play sliding hero carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  return (
    <div className="w-full font-sans">
      {/* 1. Rotational Alert Bar */}
      <div className="relative overflow-hidden h-10 w-full transition-all duration-500">
        {/* Blue welcome offer banner */}
        <div
          className={`absolute inset-0 bg-[#2b44b3] text-white flex items-center justify-center text-[11px] sm:text-xs font-bold transition-all duration-700 transform ${
            currentAlert === 0
              ? "translate-y-0 opacity-100"
              : "-translate-y-full opacity-0"
          }`}
        >
          <span>App-Exclusive: Your welcome offer awaits.&nbsp;</span>
          <a href="#" className="underline hover:text-zinc-200 transition">
            Download the app now!
          </a>
        </div>

        {/* Red recall banner */}
        <div
          className={`absolute inset-0 bg-[#e61a1a] text-white flex items-center justify-center text-[10px] sm:text-xs font-semibold px-4 transition-all duration-700 transform ${
            currentAlert === 1
              ? "translate-y-0 opacity-100"
              : "translate-y-full opacity-0"
          }`}
        >
          <AlertTriangle className="h-4.5 w-4.5 mr-1.5 shrink-0 animate-pulse text-white" />
          <span className="truncate">
            Notice! | Product Recall | Horse Riding Helmet 100 Fouganza | Contact: 7676798989 or care.india@decathlon.com
          </span>
        </div>
      </div>

      {/* 2. Auto-sliding Main Hero Section */}
      <div className="relative w-full h-[280px] sm:h-[400px] bg-zinc-900 overflow-hidden group">
        {heroSlides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
          >
            {/* Background overlay */}
            <div className="absolute inset-0 bg-black/45 z-10" />
            <Image
              src={slide.image}
              alt={slide.title}
              fill
              className="object-cover"
              priority={index === 0}
              sizes="100vw"
            />
            {/* Content card */}
            <div className="absolute inset-0 z-20 flex flex-col justify-center px-6 sm:px-12 md:px-24 text-white max-w-2xl">
              <span className="text-xs uppercase tracking-widest text-blue-400 font-bold mb-2">
                Decathlon Exclusive
              </span>
              <h1 className="text-2xl sm:text-4xl md:text-5xl font-black leading-tight drop-shadow-sm">
                {slide.title}
              </h1>
              <p className="text-sm sm:text-lg text-zinc-200 mt-3 font-medium">
                {slide.subtitle}
              </p>
              <div className="mt-8">
                <button className="px-6 py-3 bg-[#0072c6] text-white text-xs sm:text-sm font-bold rounded-md hover:bg-blue-700 hover:scale-105 transition duration-300 shadow-md">
                  {slide.buttonText}
                </button>
              </div>
            </div>
          </div>
        ))}

        {/* Sliders navigation buttons */}
        <button
          onClick={() =>
            setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length)
          }
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-white/20 hover:bg-white/40 text-white transition opacity-0 group-hover:opacity-100"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <button
          onClick={() => setCurrentSlide((prev) => (prev + 1) % heroSlides.length)}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-white/20 hover:bg-white/40 text-white transition opacity-0 group-hover:opacity-100"
        >
          <ArrowRight className="h-5 w-5" />
        </button>

        {/* Sliders indicator dots */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentSlide ? "w-6 bg-white" : "w-2 bg-white/50"
              }`}
            />
          ))}
        </div>
      </div>

      {/* 3. Promo Tear-off Coupon Banner Strip */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 bg-zinc-100 rounded-2xl overflow-hidden border border-zinc-200 shadow-xs">
          {/* QR Scan Strip */}
          <div className="bg-white p-6 flex items-center justify-between lg:justify-center gap-6 border-b lg:border-b-0 lg:border-r border-zinc-200 relative">
            <div className="flex-1 lg:flex-none">
              <h3 className="text-base sm:text-lg font-black text-zinc-900 leading-tight">
                Get your <br /> first-order coupon!
              </h3>
              <p className="text-xs text-zinc-500 mt-1 font-semibold">
                Scan to download the app now.
              </p>
            </div>
            <div className="h-16 w-16 bg-zinc-50 border-2 border-zinc-800 rounded-lg flex items-center justify-center shrink-0 shadow-sm relative group hover:scale-105 transition cursor-pointer">
              <QrCode className="h-10 w-10 text-zinc-950" />
              <div className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#0072c6] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-[#0072c6]"></span>
              </div>
            </div>
          </div>

          {/* Coupon 1: NC100 */}
          <div className="relative bg-[#0072c6] text-white p-6 flex flex-col justify-between min-h-[120px] overflow-hidden group">
            {/* Tear ticket Cutout Circle notches */}
            <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-zinc-50 rounded-full z-10" />
            <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-zinc-50 rounded-full z-10" />

            <div className="flex justify-between items-start pl-4 pr-4">
              <div>
                <span className="text-[10px] uppercase font-bold text-blue-200">
                  Welcome Offer
                </span>
                <p className="text-lg font-extrabold mt-0.5 leading-none">
                  Upto ₹100 OFF
                </p>
                <p className="text-[10px] text-blue-100 font-semibold mt-1">
                  On purchase above ₹1499
                </p>
              </div>
              <span className="text-2xl font-black tracking-wider text-white/20 select-none transform rotate-90">
                NC100
              </span>
            </div>
            <div className="flex items-center justify-between pl-4 pr-4 mt-4">
              <div className="px-3 py-1 bg-white/10 rounded-sm font-mono text-xs font-bold border border-white/20">
                Use Code - NC100
              </div>
              <button
                onClick={() => navigator.clipboard.writeText("NC100").then(() => alert("Copied code: NC100"))}
                className="text-xs font-bold text-white underline hover:text-blue-150 transition"
              >
                Copy Code
              </button>
            </div>
          </div>

          {/* Coupon 2: NC200 */}
          <div className="relative bg-[#4a39b3] text-white p-6 flex flex-col justify-between min-h-[120px] overflow-hidden group">
            {/* Tear ticket Cutout Circle notches */}
            <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-zinc-50 rounded-full z-10" />
            <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-zinc-50 rounded-full z-10" />

            <div className="flex justify-between items-start pl-4 pr-4">
              <div>
                <span className="text-[10px] uppercase font-bold text-purple-200">
                  Welcome Offer
                </span>
                <p className="text-lg font-extrabold mt-0.5 leading-none">
                  Upto ₹200 OFF
                </p>
                <p className="text-[10px] text-purple-100 font-semibold mt-1">
                  On purchase above ₹2499
                </p>
              </div>
              <span className="text-2xl font-black tracking-wider text-white/20 select-none transform rotate-90">
                NC200
              </span>
            </div>
            <div className="flex items-center justify-between pl-4 pr-4 mt-4">
              <div className="px-3 py-1 bg-white/10 rounded-sm font-mono text-xs font-bold border border-white/20">
                Use Code - NC200
              </div>
              <button
                onClick={() => navigator.clipboard.writeText("NC200").then(() => alert("Copied code: NC200"))}
                className="text-xs font-bold text-white underline hover:text-purple-150 transition"
              >
                Copy Code
              </button>
            </div>
          </div>

          {/* Coupon 3: NC300 */}
          <div className="relative bg-[#1d273a] text-white p-6 flex flex-col justify-between min-h-[120px] overflow-hidden group">
            {/* Tear ticket Cutout Circle notches */}
            <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-zinc-50 rounded-full z-10" />
            <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-zinc-50 rounded-full z-10" />

            <div className="flex justify-between items-start pl-4 pr-4">
              <div>
                <span className="text-[10px] uppercase font-bold text-zinc-400">
                  Welcome Offer
                </span>
                <p className="text-lg font-extrabold mt-0.5 leading-none">
                  Upto ₹300 OFF
                </p>
                <p className="text-[10px] text-zinc-300 font-semibold mt-1">
                  On purchase above ₹3499
                </p>
              </div>
              <span className="text-2xl font-black tracking-wider text-white/20 select-none transform rotate-90">
                NC300
              </span>
            </div>
            <div className="flex items-center justify-between pl-4 pr-4 mt-4">
              <div className="px-3 py-1 bg-white/10 rounded-sm font-mono text-xs font-bold border border-white/20">
                Use Code - NC300
              </div>
              <button
                onClick={() => navigator.clipboard.writeText("NC300").then(() => alert("Copied code: NC300"))}
                className="text-xs font-bold text-white underline hover:text-zinc-300 transition"
              >
                Copy Code
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
