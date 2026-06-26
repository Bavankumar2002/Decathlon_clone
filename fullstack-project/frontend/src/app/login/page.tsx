"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LoginForm } from "../../components/LoginForm";
import { PhoneLogin } from "../../components/PhoneLogin";
import { SocialLogin } from "../../components/SocialLogin";
import { ChevronLeft } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"email" | "phone">("email");

  const handleBack = () => {
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans text-zinc-800">
      {/* Top Header Bar */}
      <header className="w-full border-b border-zinc-150 py-3.5 px-4 sm:px-6 lg:px-8 flex items-center relative select-none">
        {/* Back Button */}
        <button
          onClick={handleBack}
          className="flex items-center gap-1 text-xs font-bold text-zinc-700 hover:text-[#3643BA] transition cursor-pointer"
        >
          <ChevronLeft className="h-4.5 w-4.5" />
          <span>Back</span>
        </button>

        {/* Centered Decathlon Logo */}
        <div className="absolute left-1/2 -translate-x-1/2 flex items-center text-[#3643BA]">
          <span className="text-xl sm:text-2xl font-black tracking-widest uppercase select-none">
            DECATHLON
          </span>
        </div>
      </header>

      {/* Main Form Center Section */}
      <main className="flex-1 flex flex-col justify-center items-center px-4 py-12">
        <div className="max-w-[420px] w-full space-y-6">
          {/* Page Title */}
          <h1 className="text-2xl font-black text-zinc-950 tracking-tight">Login</h1>

          {/* Form Tabs */}
          <div className="flex border-b border-zinc-200">
            <button
              onClick={() => setActiveTab("email")}
              className={`flex-1 text-center py-2.5 text-xs sm:text-sm font-bold border-b-2 transition ${
                activeTab === "email"
                  ? "border-[#3643BA] text-[#3643BA]"
                  : "border-transparent text-zinc-400 hover:text-zinc-600"
              } cursor-pointer`}
            >
              E-mail
            </button>
            <button
              onClick={() => setActiveTab("phone")}
              className={`flex-1 text-center py-2.5 text-xs sm:text-sm font-bold border-b-2 transition ${
                activeTab === "phone"
                  ? "border-[#3643BA] text-[#3643BA]"
                  : "border-transparent text-zinc-400 hover:text-zinc-600"
              } cursor-pointer`}
            >
              Phone number
            </button>
          </div>

          {/* Render Active Form Tab */}
          <div className="bg-white">
            {activeTab === "email" ? <LoginForm /> : <PhoneLogin />}
          </div>

          {/* Social Logins */}
          <div className="space-y-4">
            <SocialLogin />
          </div>

          {/* Bottom Account Links */}
          <div className="space-y-2.5 pt-2 border-t border-zinc-100">
            <p className="text-xs sm:text-sm font-bold text-zinc-900">
              No account? Create one!
            </p>
            <Link
              href="/register"
              className="block text-xs sm:text-sm font-bold text-[#3643BA] hover:underline"
            >
              Create your DECATHLON account
            </Link>
            <Link
              href="/forgot-password"
              className="block text-xs font-bold text-zinc-500 hover:text-zinc-800 transition hover:underline"
            >
              Forgot Password?
            </Link>
          </div>

          {/* Value Propositions */}
          <div className="bg-zinc-50/50 p-4 border border-zinc-100 space-y-3 pt-4">
            <h4 className="text-xs sm:text-sm font-black text-zinc-950">
              It&apos;s better when you&apos;re signed in
            </h4>
            <ul className="space-y-2 text-[11px] sm:text-xs font-semibold text-zinc-600">
              <li className="flex items-center gap-2">
                <svg
                  className="h-4 w-4 text-[#3643BA] shrink-0"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                <span>Exclusive Deals and Sporty Rewards</span>
              </li>
              <li className="flex items-center gap-2">
                <svg
                  className="h-4 w-4 text-[#3643BA] shrink-0"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                <span>Personalised Experiences</span>
              </li>
              <li className="flex items-center gap-2">
                <svg
                  className="h-4 w-4 text-[#3643BA] shrink-0"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                <span>Faster Checkout</span>
              </li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}
