"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../../store/authStore";
import { Input } from "../../components/Input";
import { Button } from "../../components/Button";
import { ChevronLeft } from "lucide-react";

export default function ForgotPasswordPage() {
  const { forgotPassword } = useAuth();
  const router = useRouter();

  const [input, setInput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    const val = input.trim();
    if (!val) {
      setError("Please enter your email address or mobile number");
      return;
    }

    const payload: { email?: string; phone?: string } = {};
    if (/\S+@\S+\.\S+/.test(val)) {
      payload.email = val;
    } else if (/^\d+$/.test(val)) {
      payload.phone = val;
    } else {
      setError("Please enter a valid email or numbers-only phone number");
      return;
    }

    setLoading(true);
    const result = await forgotPassword(payload);
    setLoading(false);

    if (result.success) {
      setMessage({
        type: "success",
        text: result.message || "Simulated reset request successful. Redirecting to reset page...",
      });
      setTimeout(() => {
        router.push(`/reset-password?username=${encodeURIComponent(val)}`);
      }, 2000);
    } else {
      setMessage({
        type: "error",
        text: result.message || "Something went wrong. Please check your credentials.",
      });
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans text-zinc-800">
      {/* Header */}
      <header className="w-full border-b border-zinc-150 py-3.5 px-4 sm:px-6 lg:px-8 flex items-center relative select-none">
        <button
          onClick={() => router.push("/login")}
          className="flex items-center gap-1 text-xs font-bold text-zinc-700 hover:text-[#3643BA] transition cursor-pointer"
        >
          <ChevronLeft className="h-4.5 w-4.5" />
          <span>Login</span>
        </button>

        <div className="absolute left-1/2 -translate-x-1/2 flex items-center text-[#3643BA]">
          <span className="text-xl sm:text-2xl font-black tracking-widest uppercase select-none">
            DECATHLON
          </span>
        </div>
      </header>

      {/* Main container */}
      <main className="flex-1 flex flex-col justify-center items-center px-4 py-12">
        <div className="max-w-[420px] w-full space-y-6">
          <div>
            <h1 className="text-2xl font-black text-zinc-950 tracking-tight">Forgot Password</h1>
            <p className="text-xs text-zinc-500 mt-1 font-semibold">
              Enter your email address or mobile phone number to receive a simulated reset link.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {message && (
              <div
                className={`p-3 text-xs font-bold ${
                  message.type === "success"
                    ? "bg-[#eefaf5] text-[#227a51] border border-[#daf2e7]"
                    : "bg-red-50 text-red-700 border border-red-200"
                }`}
              >
                {message.text}
              </div>
            )}

            <div>
              <p className="text-xs font-medium text-zinc-500 mb-1">Email or Mobile Number</p>
              <Input
                type="text"
                placeholder="Email or Mobile phone number"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                error={error || undefined}
              />
            </div>

            <div className="pt-2">
              <Button type="submit" loading={loading}>
                RESET PASSWORD
              </Button>
            </div>
          </form>

          <div className="text-center pt-2 border-t border-zinc-100">
            <Link href="/login" className="text-xs font-bold text-[#3643BA] hover:underline">
              Back to Login
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
