import React, { useState } from "react";
import { Input } from "./Input";
import { Button } from "./Button";
import { useAuth } from "../store/authStore";
import { useRouter } from "next/navigation";

export const PhoneLogin: React.FC = () => {
  const { login } = useAuth();
  const router = useRouter();
  const [countryCode, setCountryCode] = useState("+91");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ phone?: string; password?: string }>({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const validate = () => {
    const newErrors: { phone?: string; password?: string } = {};
    if (!phone) {
      newErrors.phone = "Mobile phone number is required";
    } else if (!/^\d+$/.test(phone)) {
      newErrors.phone = "Please enter numbers only";
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
    // Submit login with phone and password
    const result = await login({ phone, password });
    setLoading(false);

    if (result.success) {
      setMessage({ type: "success", text: "Logged in successfully! Redirecting..." });
      setTimeout(() => {
        router.push("/");
      }, 1000);
    } else {
      setMessage({ type: "error", text: result.message || "Invalid mobile number or password" });
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

      {/* Row for Country Code and Phone Number */}
      <div className="flex gap-3">
        {/* Country Code Select */}
        <div className="w-1/3 space-y-1">
          <label className="block text-[10px] font-bold text-zinc-500 uppercase">Country:</label>
          <select
            value={countryCode}
            onChange={(e) => setCountryCode(e.target.value)}
            className="w-full h-[46px] px-3 border border-zinc-300 bg-white font-bold text-sm outline-hidden focus:border-[#3643BA] focus:ring-1 focus:ring-[#3643BA]"
          >
            <option value="+91">🇮🇳 +91</option>
            <option value="+1">🇺🇸 +1</option>
            <option value="+44">🇬🇧 +44</option>
            <option value="+33">🇫🇷 +33</option>
          </select>
        </div>

        {/* Mobile Number Input */}
        <div className="w-2/3 space-y-1">
          <label className="block text-[10px] font-bold text-zinc-500 uppercase">Mobile phone number:</label>
          <Input
            type="tel"
            placeholder="Mobile phone number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            error={errors.phone}
          />
        </div>
      </div>

      <div>
        <p className="text-xs font-medium text-zinc-500 mb-1">Enter password</p>
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
          NEXT
        </Button>
      </div>
    </form>
  );
};
