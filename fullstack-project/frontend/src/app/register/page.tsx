"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../../store/authStore";
import { Input } from "../../components/Input";
import { Button } from "../../components/Button";
import { ChevronLeft } from "lucide-react";

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  
  const [errors, setErrors] = useState<{ name?: string; email?: string; phone?: string; password?: string }>({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const validate = () => {
    const newErrors: typeof errors = {};
    if (!name) {
      newErrors.name = "Full Name is required";
    }

    if (!email && !phone) {
      newErrors.email = "Either Email or Mobile Number must be provided";
      newErrors.phone = "Either Email or Mobile Number must be provided";
    }

    if (email && !/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (phone && !/^\d+$/.test(phone)) {
      newErrors.phone = "Phone number must contain numbers only";
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters long";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    if (!validate()) return;

    setLoading(true);
    const result = await register({
      name,
      email: email || undefined,
      phone: phone || undefined,
      password,
    });
    setLoading(false);

    if (result.success) {
      setMessage({ type: "success", text: "Account created successfully! Redirecting..." });
      setTimeout(() => {
        router.push("/");
      }, 1000);
    } else {
      setMessage({ type: "error", text: result.message || "Registration failed" });
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

      {/* Register form section */}
      <main className="flex-1 flex flex-col justify-center items-center px-4 py-12">
        <div className="max-w-[420px] w-full space-y-6">
          <h1 className="text-2xl font-black text-zinc-950 tracking-tight">Create Account</h1>

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
              <p className="text-xs font-medium text-zinc-500 mb-1">Full Name</p>
              <Input
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                error={errors.name}
              />
            </div>

            <div>
              <p className="text-xs font-medium text-zinc-500 mb-1">Email Address (Optional if mobile is set)</p>
              <Input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={errors.email}
              />
            </div>

            <div>
              <p className="text-xs font-medium text-zinc-500 mb-1">Mobile Number (Optional if email is set)</p>
              <Input
                type="tel"
                placeholder="Mobile Number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                error={errors.phone}
              />
            </div>

            <div>
              <p className="text-xs font-medium text-zinc-500 mb-1">Password</p>
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={errors.password}
              />
            </div>

            <div className="pt-2">
              <Button type="submit" loading={loading}>
                CREATE ACCOUNT
              </Button>
            </div>
          </form>

          <div className="text-center pt-2 border-t border-zinc-100">
            <span className="text-xs font-bold text-zinc-500 mr-1.5">Already have an account?</span>
            <Link href="/login" className="text-xs font-bold text-[#3643BA] hover:underline">
              Log in here
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
