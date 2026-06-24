"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import RatingStars from "@/components/RatingStars";
import { useCompareStore } from "@/store/compareStore";

interface Course {
  id: string;
  name: string;
  duration: string;
  fees: number;
}

interface Placement {
  id: string;
  year: number;
  avgPackage: number;
  highestPackage: number;
}

interface ReviewUser {
  id: string;
  name: string | null;
  email: string;
}

interface Review {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
  user: ReviewUser;
}

interface CollegeDetail {
  id: string;
  name: string;
  location: string;
  state: string;
  fees: number;
  rating: number;
  imageUrl: string | null;
  description: string | null;
  type: "GOVERNMENT" | "PRIVATE" | "DEEMED";
  courses: Course[];
  placements: Placement[];
  reviews: Review[];
}

type Tab = "overview" | "courses" | "placements" | "reviews";

export default function CollegeDetailClient({
  college,
}: {
  college: CollegeDetail;
}) {
  const { data: session } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [isSaved, setIsSaved] = useState(false);
  const [savingState, setSavingState] = useState(false);
  const { addCollege, removeCollege, hasCollege, collegeIds } = useCompareStore();
  const isInCompare = hasCollege(college.id);

  const checkSavedStatus = useCallback(async () => {
    if (!session?.user) return;
    try {
      const res = await fetch("/api/saved");
      const data = await res.json();
      const saved = (data.savedColleges as { id: string }[]).some(
        (c) => c.id === college.id
      );
      setIsSaved(saved);
    } catch (err) {
      console.error("Failed to check saved status:", err);
    }
  }, [session?.user, college.id]);

  useEffect(() => {
    checkSavedStatus();
  }, [checkSavedStatus]);

  const handleSaveToggle = async () => {
    if (!session?.user) {
      router.push("/auth/login");
      return;
    }

    setSavingState(true);
    try {
      if (isSaved) {
        await fetch(`/api/saved/${college.id}`, { method: "DELETE" });
        setIsSaved(false);
      } else {
        await fetch("/api/saved", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ collegeId: college.id }),
        });
        setIsSaved(true);
      }
    } catch (err) {
      console.error("Save toggle failed:", err);
    } finally {
      setSavingState(false);
    }
  };

  const handleCompareToggle = () => {
    if (isInCompare) {
      removeCollege(college.id);
    } else {
      addCollege(college.id);
    }
  };

  const tabs: { key: Tab; label: string; count?: number }[] = [
    { key: "overview", label: "Overview" },
    { key: "courses", label: "Courses", count: college.courses.length },
    { key: "placements", label: "Placements", count: college.placements.length },
    { key: "reviews", label: "Reviews", count: college.reviews.length },
  ];

  const gradientMap = {
    GOVERNMENT: "from-blue-600 via-indigo-700 to-indigo-900",
    PRIVATE: "from-pink-600 via-rose-700 to-rose-900",
    DEEMED: "from-emerald-600 via-teal-700 to-teal-900",
  };

  return (
    <div className="animate-fade-in">
      {/* Hero Banner */}
      <div
        className={`relative bg-gradient-to-br ${gradientMap[college.type]} text-white overflow-hidden`}
      >
        <div className="absolute inset-0">
          <div className="absolute -top-32 -right-32 w-80 h-80 rounded-full bg-white/5 blur-2xl" />
          <div className="absolute -bottom-32 -left-32 w-80 h-80 rounded-full bg-white/5 blur-2xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div>
              <span
                className={`inline-block px-3 py-1 rounded-full text-xs font-bold mb-4 badge-${college.type.toLowerCase()}`}
              >
                {college.type}
              </span>
              <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight">
                {college.name}
              </h1>
              <div className="flex items-center gap-4 mt-4 text-blue-100">
                <div className="flex items-center gap-1.5">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {college.location}, {college.state}
                </div>
                <div className="flex items-center gap-1.5">
                  <RatingStars rating={college.rating} size="sm" />
                  <span className="font-semibold text-white">{college.rating.toFixed(1)}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleSaveToggle}
                disabled={savingState}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm transition-all ${
                  isSaved
                    ? "bg-white text-rose-600"
                    : "bg-white/15 backdrop-blur-sm border border-white/20 text-white hover:bg-white/25"
                }`}
              >
                <svg
                  className={`w-5 h-5 ${isSaved ? "fill-rose-600" : ""}`}
                  fill={isSaved ? "currentColor" : "none"}
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                {isSaved ? "Saved" : "Save"}
              </button>

              <button
                onClick={handleCompareToggle}
                disabled={!isInCompare && collegeIds.length >= 3}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm transition-all ${
                  isInCompare
                    ? "bg-white text-indigo-600"
                    : "bg-white/15 backdrop-blur-sm border border-white/20 text-white hover:bg-white/25 disabled:opacity-40"
                }`}
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                {isInCompare ? "In Compare" : "Compare"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="sticky top-16 z-40 bg-card-bg border-b border-card-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-1 overflow-x-auto py-1 -mb-px">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-2 px-5 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === tab.key
                    ? "border-primary text-primary"
                    : "border-transparent text-muted hover:text-foreground hover:border-card-border"
                }`}
              >
                {tab.label}
                {tab.count !== undefined && tab.count > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-surface text-xs">{tab.count}</span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === "overview" && (
          <div className="animate-fade-in space-y-8">
            {/* Description */}
            <div className="bg-card-bg rounded-2xl border border-card-border p-6">
              <h2 className="text-xl font-bold mb-4">About {college.name}</h2>
              <p className="text-muted leading-relaxed">
                {college.description ||
                  `${college.name} is a prestigious ${college.type.toLowerCase()} institution located in ${college.location}, ${college.state}. Known for its academic excellence and vibrant campus life.`}
              </p>
            </div>

            {/* Key Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                {
                  label: "Annual Fees",
                  value: `₹${(college.fees / 100000).toFixed(1)}L`,
                  icon: "💰",
                },
                {
                  label: "Rating",
                  value: `${college.rating.toFixed(1)} / 5`,
                  icon: "⭐",
                },
                {
                  label: "Courses",
                  value: college.courses.length.toString(),
                  icon: "📚",
                },
                {
                  label: "Reviews",
                  value: college.reviews.length.toString(),
                  icon: "💬",
                },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="bg-card-bg rounded-2xl border border-card-border p-5 text-center"
                >
                  <div className="text-2xl mb-2">{stat.icon}</div>
                  <div className="text-xl font-bold">{stat.value}</div>
                  <div className="text-sm text-muted mt-1">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Latest Placement */}
            {college.placements.length > 0 && (
              <div className="bg-card-bg rounded-2xl border border-card-border p-6">
                <h2 className="text-xl font-bold mb-4">Latest Placement Highlights</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-xl p-4 border border-green-500/20">
                    <div className="text-sm text-muted mb-1">Year</div>
                    <div className="text-2xl font-bold">{college.placements[0].year}</div>
                  </div>
                  <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-xl p-4 border border-blue-500/20">
                    <div className="text-sm text-muted mb-1">Avg Package</div>
                    <div className="text-2xl font-bold">₹{(college.placements[0].avgPackage / 100000).toFixed(1)}L</div>
                  </div>
                  <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-xl p-4 border border-purple-500/20">
                    <div className="text-sm text-muted mb-1">Highest Package</div>
                    <div className="text-2xl font-bold">₹{(college.placements[0].highestPackage / 100000).toFixed(1)}L</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === "courses" && (
          <div className="animate-fade-in">
            {college.courses.length === 0 ? (
              <div className="text-center py-12 text-muted">
                <div className="text-4xl mb-4">📚</div>
                <p>No course information available yet.</p>
              </div>
            ) : (
              <div className="bg-card-bg rounded-2xl border border-card-border overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-card-border bg-surface/50">
                        <th className="text-left px-6 py-4 text-sm font-semibold text-muted">Course Name</th>
                        <th className="text-left px-6 py-4 text-sm font-semibold text-muted">Duration</th>
                        <th className="text-right px-6 py-4 text-sm font-semibold text-muted">Annual Fees</th>
                      </tr>
                    </thead>
                    <tbody>
                      {college.courses.map((course, i) => (
                        <tr
                          key={course.id}
                          className={`border-b border-card-border last:border-0 hover:bg-surface/30 transition-colors ${
                            i % 2 === 0 ? "" : "bg-surface/20"
                          }`}
                        >
                          <td className="px-6 py-4 font-medium">{course.name}</td>
                          <td className="px-6 py-4 text-muted">{course.duration}</td>
                          <td className="px-6 py-4 text-right font-semibold text-primary">
                            ₹{(course.fees / 100000).toFixed(1)}L
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === "placements" && (
          <div className="animate-fade-in">
            {college.placements.length === 0 ? (
              <div className="text-center py-12 text-muted">
                <div className="text-4xl mb-4">📊</div>
                <p>No placement data available yet.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Placement Chart (visual bars) */}
                <div className="bg-card-bg rounded-2xl border border-card-border p-6">
                  <h2 className="text-xl font-bold mb-6">Placement Trends</h2>
                  <div className="space-y-6">
                    {college.placements.map((p) => {
                      const maxPkg = Math.max(
                        ...college.placements.map((pl) => pl.highestPackage)
                      );
                      return (
                        <div key={p.id}>
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-semibold">{p.year}</span>
                            <div className="flex gap-6 text-sm">
                              <span className="text-muted">
                                Avg: <span className="font-semibold text-foreground">₹{(p.avgPackage / 100000).toFixed(1)}L</span>
                              </span>
                              <span className="text-muted">
                                Highest: <span className="font-semibold text-primary">₹{(p.highestPackage / 100000).toFixed(1)}L</span>
                              </span>
                            </div>
                          </div>
                          <div className="flex gap-2 h-6">
                            <div
                              className="bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full"
                              style={{
                                width: `${(p.avgPackage / maxPkg) * 100}%`,
                              }}
                            />
                            <div
                              className="bg-gradient-to-r from-primary to-secondary rounded-full"
                              style={{
                                width: `${((p.highestPackage - p.avgPackage) / maxPkg) * 100}%`,
                              }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="flex gap-6 mt-4 text-xs text-muted">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400" />
                      Average Package
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-gradient-to-r from-primary to-secondary" />
                      Highest Package
                    </div>
                  </div>
                </div>

                {/* Placement Table */}
                <div className="bg-card-bg rounded-2xl border border-card-border overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-card-border bg-surface/50">
                          <th className="text-left px-6 py-4 text-sm font-semibold text-muted">Year</th>
                          <th className="text-right px-6 py-4 text-sm font-semibold text-muted">Avg Package</th>
                          <th className="text-right px-6 py-4 text-sm font-semibold text-muted">Highest Package</th>
                        </tr>
                      </thead>
                      <tbody>
                        {college.placements.map((p, i) => (
                          <tr
                            key={p.id}
                            className={`border-b border-card-border last:border-0 ${
                              i % 2 === 0 ? "" : "bg-surface/20"
                            }`}
                          >
                            <td className="px-6 py-4 font-medium">{p.year}</td>
                            <td className="px-6 py-4 text-right">₹{(p.avgPackage / 100000).toFixed(1)}L</td>
                            <td className="px-6 py-4 text-right font-semibold text-primary">
                              ₹{(p.highestPackage / 100000).toFixed(1)}L
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === "reviews" && (
          <div className="animate-fade-in">
            {college.reviews.length === 0 ? (
              <div className="text-center py-12 text-muted">
                <div className="text-4xl mb-4">💬</div>
                <p>No reviews yet. Be the first to review!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {college.reviews.map((review) => (
                  <div
                    key={review.id}
                    className="bg-card-bg rounded-2xl border border-card-border p-6"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-sm font-bold">
                          {review.user.name?.[0]?.toUpperCase() ||
                            review.user.email[0].toUpperCase()}
                        </div>
                        <div>
                          <div className="font-medium">
                            {review.user.name || "Anonymous"}
                          </div>
                          <div className="text-xs text-muted">
                            {new Date(review.createdAt).toLocaleDateString(
                              "en-IN",
                              {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              }
                            )}
                          </div>
                        </div>
                      </div>
                      <RatingStars rating={review.rating} size="sm" />
                    </div>
                    <p className="text-muted leading-relaxed">{review.comment}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
