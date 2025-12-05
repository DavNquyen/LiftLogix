"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";

const mainNavItems = [
  { href: "/dashboard", label: "Dashboard", icon: "📊" },
  { href: "/dashboard/workouts", label: "Workouts", icon: "💪" },
  { href: "/dashboard/meals", label: "Meals", icon: "🍽️" },
  { href: "/dashboard/analytics", label: "Analytics", icon: "📈" },
  { href: "/dashboard/social", label: "Social", icon: "📱" },
];

const progressItems = [
  { href: "/dashboard/prs", label: "PRs", icon: "🏆" },
  { href: "/dashboard/body-weight", label: "Body Weight", icon: "⚖️" },
  { href: "/dashboard/progress-photos", label: "Photos", icon: "📸" },
  { href: "/dashboard/measurements", label: "Measurements", icon: "📏" },
];

export default function DashboardNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuth();
  const [showProgressMenu, setShowProgressMenu] = useState(false);

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const isProgressActive = progressItems.some(item => pathname === item.href);

  return (
    <nav className="bg-zinc-900 border-b border-zinc-800 sticky top-0 z-50">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          <Link href="/dashboard" className="text-xl font-black tracking-tight text-white">
            LIFT<span className="text-blue-500">LOGIX</span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {mainNavItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 px-4 py-2 font-bold transition-all ${
                    isActive
                      ? "bg-blue-600 text-white"
                      : "text-zinc-400 hover:text-white hover:bg-zinc-800"
                  }`}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              );
            })}

            {/* Progress Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowProgressMenu(!showProgressMenu)}
                className={`flex items-center gap-2 px-4 py-2 font-bold transition-all ${
                  isProgressActive
                    ? "bg-blue-600 text-white"
                    : "text-zinc-400 hover:text-white hover:bg-zinc-800"
                }`}
              >
                <span className="text-lg">📊</span>
                <span>Progress</span>
                <span className="text-xs">{showProgressMenu ? "▲" : "▼"}</span>
              </button>

              {showProgressMenu && (
                <div className="absolute top-full right-0 mt-1 bg-zinc-800 border border-zinc-700 min-w-[200px] shadow-lg">
                  {progressItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setShowProgressMenu(false)}
                        className={`flex items-center gap-2 px-4 py-3 font-bold transition-all hover:bg-zinc-700 ${
                          isActive ? "bg-blue-600 text-white" : "text-zinc-400 hover:text-white"
                        }`}
                      >
                        <span className="text-lg">{item.icon}</span>
                        <span>{item.label}</span>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>

            <Link
              href="/dashboard/friends"
              className={`flex items-center gap-2 px-4 py-2 font-bold transition-all ${
                pathname === "/dashboard/friends"
                  ? "bg-blue-600 text-white"
                  : "text-zinc-400 hover:text-white hover:bg-zinc-800"
              }`}
            >
              <span className="text-lg">🤝</span>
              <span>Friends</span>
            </Link>

            <Link
              href="/dashboard/profile"
              className={`flex items-center gap-2 px-4 py-2 font-bold transition-all ${
                pathname === "/dashboard/profile"
                  ? "bg-blue-600 text-white"
                  : "text-zinc-400 hover:text-white hover:bg-zinc-800"
              }`}
            >
              <span className="text-lg">👤</span>
              <span>Profile</span>
            </Link>
          </div>

          <button
            onClick={handleLogout}
            className="px-4 py-2 text-zinc-400 hover:text-white font-bold transition-colors"
          >
            LOGOUT
          </button>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden flex overflow-x-auto pb-4 space-x-2 scrollbar-hide">
          {mainNavItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 px-4 py-2 whitespace-nowrap font-bold transition-all ${
                  isActive
                    ? "bg-blue-600 text-white"
                    : "text-zinc-400 hover:text-white hover:bg-zinc-800"
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            );
          })}
          <button
            onClick={() => setShowProgressMenu(!showProgressMenu)}
            className={`flex items-center gap-2 px-4 py-2 whitespace-nowrap font-bold transition-all ${
              isProgressActive
                ? "bg-blue-600 text-white"
                : "text-zinc-400 hover:text-white hover:bg-zinc-800"
            }`}
          >
            <span className="text-lg">📊</span>
            <span>Progress</span>
          </button>
          {showProgressMenu && progressItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 px-4 py-2 whitespace-nowrap font-bold transition-all ${
                  isActive
                    ? "bg-blue-600 text-white"
                    : "text-zinc-400 hover:text-white hover:bg-zinc-800"
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            );
          })}
          <Link
            href="/dashboard/friends"
            className={`flex items-center gap-2 px-4 py-2 whitespace-nowrap font-bold transition-all ${
              pathname === "/dashboard/friends"
                ? "bg-blue-600 text-white"
                : "text-zinc-400 hover:text-white hover:bg-zinc-800"
            }`}
          >
            <span className="text-lg">🤝</span>
            <span>Friends</span>
          </Link>
          <Link
            href="/dashboard/profile"
            className={`flex items-center gap-2 px-4 py-2 whitespace-nowrap font-bold transition-all ${
              pathname === "/dashboard/profile"
                ? "bg-blue-600 text-white"
                : "text-zinc-400 hover:text-white hover:bg-zinc-800"
            }`}
          >
            <span className="text-lg">👤</span>
            <span>Profile</span>
          </Link>
        </div>
      </div>
    </nav>
  );
}
