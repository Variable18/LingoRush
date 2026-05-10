import React from "react";
import { Link } from "react-router-dom";

export default function MinimalNavbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-40 px-6 py-5">
      <div className="mx-auto max-w-7xl flex items-center justify-between">
        {/* Logo (quiet, minimal) */}
        <Link to="/" className="flex items-center gap-3">
          <div className="h-6 w-6 rounded-full bg-white/20 ring-1 ring-white/10" />
          <span className="text-sm tracking-wide text-gray-300">LingoRush</span>
        </Link>

        {/* Compact nav items */}
        <div className="hidden md:flex items-center gap-8">
          {[
            { label: "Company", href: "/product" },
            { label: "Business", href: "/pricing" },
            { label: "Services", href: "/translate" },
          ].map((item) => (
            <Link key={item.label} to={item.href} className="text-sm text-gray-400 hover:text-white transition-colors">
              {item.label}
            </Link>
          ))}

          <Link to="/login" className="text-sm text-gray-400 hover:text-white">Login</Link>
        </div>
      </div>
    </nav>
  );
}
