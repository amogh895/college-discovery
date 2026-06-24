"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { useCompareStore } from "@/store/compareStore";

export default function Navbar() {
  const { data: session } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const { collegeIds } = useCompareStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [prevPathname, setPrevPathname] = useState(pathname);
  const [searchQuery, setSearchQuery] = useState("");
  const [scrolled, setScrolled] = useState(false);

  if (pathname !== prevPathname) {
    setMobileMenuOpen(false);
    setPrevPathname(pathname);
  }

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/colleges?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
    }
  };

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/colleges", label: "Colleges" },
    {
      href: "/compare",
      label: "Compare",
      badge: collegeIds.length > 0 ? collegeIds.length : undefined,
    },
    { href: "/saved", label: "Saved" },
  ];

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-card-bg/80 backdrop-blur-xl border-b border-card-border shadow-lg shadow-black/5"
          : "bg-card-bg border-b border-card-border"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Left Side: Logo & Navigation */}
          <div className="flex items-center gap-6 lg:gap-8">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 shrink-0">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <span className="text-lg font-bold gradient-text hidden sm:block">
                CollegeDiscover
              </span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                    isActive(link.href)
                      ? "text-primary bg-primary/10"
                      : "text-muted hover:text-foreground hover:bg-surface"
                  }`}
                >
                  <span>{link.label}</span>
                  {link.badge && (
                    <span className="w-5 h-5 flex items-center justify-center rounded-full bg-secondary text-white text-xs font-bold shrink-0">
                      {link.badge}
                    </span>
                  )}
                </Link>
              ))}
            </div>
          </div>

          {/* Right Side: Search, Auth, and Mobile Menu */}
          <div className="flex items-center gap-4">
            {/* Search Bar (Desktop) */}
            <form onSubmit={handleSearch} className="hidden lg:flex items-center">
              <div className="relative">
                <svg
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="     Search colleges..."
                  className="w-64 pl-12 pr-4 py-2 rounded-xl bg-surface border border-card-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                />
              </div>
            </form>

            {/* Auth Buttons */}
            <div className="hidden md:flex items-center gap-3">
              {session?.user ? (
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-sm font-bold">
                    {session.user.name?.[0]?.toUpperCase() ||
                      session.user.email?.[0]?.toUpperCase() ||
                      "U"}
                  </div>
                  <button
                    onClick={() => signOut()}
                    className="px-4 py-2 rounded-xl text-sm font-medium text-muted hover:text-danger hover:bg-danger/10 transition-colors"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <>
                  <Link
                    href="/auth/login"
                    className="px-4 py-2 rounded-xl text-sm font-medium text-muted hover:text-foreground hover:bg-surface transition-colors"
                  >
                    Login
                  </Link>
                  <Link
                    href="/auth/register"
                    className="px-4 py-2 rounded-xl bg-primary text-white text-sm font-medium hover:bg-primary-dark transition-colors"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden w-10 h-10 flex items-center justify-center rounded-xl hover:bg-surface transition-colors"
              aria-label="Toggle menu"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-card-border animate-slide-down">
          <div className="px-4 py-4 space-y-2">
            {/* Mobile Search */}
            <form onSubmit={handleSearch} className="mb-3">
              <div className="relative">
                <svg
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search colleges..."
                  className="w-full pl-12 pr-4 py-2.5 rounded-xl bg-surface border border-card-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>
            </form>

            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  isActive(link.href)
                    ? "text-primary bg-primary/10"
                    : "text-foreground hover:bg-surface"
                }`}
              >
                <span>{link.label}</span>
                {link.badge && (
                  <span className="w-5 h-5 flex items-center justify-center rounded-full bg-secondary text-white text-xs font-bold">
                    {link.badge}
                  </span>
                )}
              </Link>
            ))}

            <div className="pt-3 border-t border-card-border">
              {session?.user ? (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-sm font-bold">
                      {session.user.name?.[0]?.toUpperCase() ||
                        session.user.email?.[0]?.toUpperCase() ||
                        "U"}
                    </div>
                    <span className="text-sm font-medium">
                      {session.user.name || session.user.email}
                    </span>
                  </div>
                  <button
                    onClick={() => signOut()}
                    className="text-sm text-danger font-medium"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <Link
                    href="/auth/login"
                    className="flex-1 text-center px-4 py-2.5 rounded-xl border border-card-border text-sm font-medium hover:bg-surface transition-colors"
                  >
                    Login
                  </Link>
                  <Link
                    href="/auth/register"
                    className="flex-1 text-center px-4 py-2.5 rounded-xl bg-primary text-white text-sm font-medium hover:bg-primary-dark transition-colors"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
