"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

export default function Login() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(email, password);
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black p-4">
      <div className="w-full max-w-md">
        <div className="bg-zinc-900 border-2 border-zinc-800 p-8">
          <div className="mb-8">
            <Link href="/" className="inline-block mb-6">
              <span className="text-2xl font-black tracking-tight text-white">
                LIFT<span className="text-blue-500">LOGIX</span>
              </span>
            </Link>
            <h2 className="text-4xl font-black text-white">WELCOME BACK</h2>
            <p className="text-zinc-400 mt-2 font-medium">Sign in to continue your fitness journey</p>
          </div>

          {error && (
            <div className="bg-red-900 border-2 border-red-600 text-red-100 px-4 py-3 mb-6 font-bold">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-bold text-zinc-400 mb-2">
                EMAIL ADDRESS
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-zinc-800 border-2 border-zinc-700 text-white font-bold focus:outline-none focus:border-blue-600 transition-all"
                placeholder="you@example.com"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-bold text-zinc-400 mb-2">
                PASSWORD
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-zinc-800 border-2 border-zinc-700 text-white font-bold focus:outline-none focus:border-blue-600 transition-all"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-4 font-black hover:bg-blue-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "SIGNING IN..." : "SIGN IN"}
            </button>
          </form>

          <p className="mt-6 text-center text-zinc-400 font-medium">
            Don't have an account?{" "}
            <Link href="/register" className="text-orange-500 font-bold hover:text-orange-400 transition-colors">
              Sign up free
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
