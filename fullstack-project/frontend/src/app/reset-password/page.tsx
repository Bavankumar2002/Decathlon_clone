"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "../../store/authStore";
import { Input } from "../../components/Input";
import { Button } from "../../components/Button";
import { ChevronLeft } from "lucide-react";

// Wrap search params parsing in a suspense boundary for Next.js app router static generation compatibility
function ResetPasswordForm() {
  const { resetPassword } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [username, setUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const [errors, setErrors] = useState<{ username?: string; newPassword?: string; confirmPassword?: string }>({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    const userParam = searchParams.get("username");
    if (userParam) {
      setUsername(userParam);
    }
  }, [searchParams]);

  const validate = () => {
    const newErrors: typeof errors = {};
    if (!username) {
      newErrors.username = "Email or Mobile number is required";
    }

    if (!newPassword) {
      newErrors.newPassword = "New password is required";
    } else if (newPassword.length < 8) {
      newErrors.newPassword = "Password must be at least 8 characters long";
    }

    if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    if (!validate()) return;

    const payload: { email?: string; phone?: string; newPassword: string } = {
      newPassword,
    };

    if (/\S+@\S+\.\S+/.test(username)) {
      payload.email = username;
    } else if (/^\d+$/.test(username)) {
      payload.phone = username;
    } else {
      setErrors({ username: "Please enter a valid email or numbers-only phone number" });
      return;
    }

    setLoading(true);
    const result = await resetPassword(payload);
    setLoading(false);

    if (result.success) {
      setMessage({ type: "success", text: "Password reset successful! Redirecting to login..." });
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } else {
      setMessage({ type: "error", text: result.message || "Failed to reset password" });
    }
  };

  return (
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
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          error={errors.username}
        />
      </div>

      <div>
        <p className="text-xs font-medium text-zinc-500 mb-1">New Password (min 8 characters)</p>
        <Input
          type="password"
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          error={errors.newPassword}
        />
      </div>

      <div>
        <p className="text-xs font-medium text-zinc-500 mb-1">Confirm New Password</p>
        <Input
          type="password"
          placeholder="Confirm New Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          error={errors.confirmPassword}
        />
      </div>

      <div className="pt-2">
        <Button type="submit" loading={loading}>
          UPDATE PASSWORD
        </Button>
      </div>
    </form>
  );
}

export default function ResetPasswordPage() {
  const router = useRouter();

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
            <h1 className="text-2xl font-black text-zinc-950 tracking-tight">Reset Password</h1>
            <p className="text-xs text-zinc-500 mt-1 font-semibold">
              Enter your new credentials to update your password.
            </p>
          </div>

          <Suspense fallback={<div className="text-xs text-zinc-500 font-bold">Loading...</div>}>
            <ResetPasswordForm />
          </Suspense>

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
