import React, { useState } from "react";
import { Input } from "./Input";
import { Button } from "./Button";
import { useAuth } from "../store/authStore";
import { useRouter } from "next/navigation";

export const LoginForm: React.FC = () => {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const validate = () => {
    const newErrors: { email?: string; password?: string } = {};
    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Please enter a valid email address";
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
    const result = await login({ email, password });
    setLoading(false);

    if (result.success) {
      setMessage({ type: "success", text: "Logged in successfully! Redirecting..." });
      setTimeout(() => {
        router.push("/");
      }, 1000);
    } else {
      setMessage({ type: "error", text: result.message || "Invalid email or password" });
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
        <p className="text-xs font-medium text-zinc-500 mb-1">Enter an email address</p>
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={errors.email}
        />
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
