"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useCompareStore } from "@/store/compareStore";
import RatingStars from "@/components/RatingStars";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import EmptyState from "@/components/EmptyState";

interface Placement {
  id: string;
  year: number;
  avgPackage: number;
  highestPackage: number;
}

interface CompareCollege {
  id: string;
  name: string;
  location: string;
  state: string;
  fees: number;
  rating: number;
  type: "GOVERNMENT" | "PRIVATE" | "DEEMED";
  description: string | null;
  placements: Placement[];
}

export default function ComparePage() {
  const { collegeIds, removeCollege, clearAll } = useCompareStore();
  const [colleges, setColleges] = useState<CompareCollege[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchCompareData = useCallback(async () => {
    if (collegeIds.length < 2) {
      setColleges([]);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch(
        `/api/colleges/compare?ids=${collegeIds.join(",")}`
      );
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to load comparison");
        return;
      }

      setColleges(data.colleges);
    } catch {
      setError("Failed to load comparison data");
    } finally {
      setLoading(false);
    }
  }, [collegeIds]);

  useEffect(() => {
    fetchCompareData();
  }, [fetchCompareData]);

  const getBestValue = (
    values: number[],
    mode: "highest" | "lowest"
  ): number => {
    if (mode === "highest") return Math.max(...values);
    return Math.min(...values);
  };

  const isBest = (
    value: number,
    values: number[],
    mode: "highest" | "lowest"
  ): boolean => {
    return value === getBestValue(values, mode);
  };

  if (collegeIds.length < 2) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 animate-fade-in">
        <EmptyState
          title="Compare Colleges"
          description={
            collegeIds.length === 0
              ? "Add 2-3 colleges to your compare list to see them side by side."
              : "Add at least one more college to start comparing."
          }
          icon={
            <svg className="w-16 h-16 text-muted-light" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          }
          action={
            <Link
              href="/colleges"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-white font-medium hover:bg-primary-dark transition-colors"
            >
              Browse Colleges
            </Link>
          }
        />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <LoadingSpinner message="Loading comparison..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <div className="text-danger text-lg">{error}</div>
      </div>
    );
  }

  const fees = colleges.map((c) => c.fees);
  const ratings = colleges.map((c) => c.rating);
  const avgPackages = colleges.map(
    (c) => c.placements[0]?.avgPackage || 0
  );
  const highestPackages = colleges.map(
    (c) => c.placements[0]?.highestPackage || 0
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Compare Colleges</h1>
          <p className="mt-1 text-muted">
            Side-by-side comparison of {colleges.length} colleges
          </p>
        </div>
        <button
          onClick={clearAll}
          className="px-4 py-2 rounded-xl border border-card-border text-sm font-medium text-danger hover:bg-danger/10 transition-colors"
        >
          Clear All
        </button>
      </div>

      <div className="bg-card-bg rounded-2xl border border-card-border overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full">
            {/* Header with college names */}
            <thead>
              <tr className="border-b border-card-border">
                <th className="text-left px-6 py-5 text-sm font-semibold text-muted w-44">
                  Criteria
                </th>
                {colleges.map((college) => (
                  <th key={college.id} className="px-6 py-5 min-w-[200px]">
                    <div className="flex flex-col items-center gap-2">
                      <Link
                        href={`/colleges/${college.id}`}
                        className="text-lg font-bold hover:text-primary transition-colors"
                      >
                        {college.name}
                      </Link>
                      <button
                        onClick={() => removeCollege(college.id)}
                        className="text-xs text-danger hover:underline"
                      >
                        Remove
                      </button>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {/* Type */}
              <tr className="border-b border-card-border">
                <td className="px-6 py-4 text-sm font-medium text-muted">
                  Type
                </td>
                {colleges.map((c) => (
                  <td key={c.id} className="px-6 py-4 text-center">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-bold badge-${c.type.toLowerCase()}`}
                    >
                      {c.type}
                    </span>
                  </td>
                ))}
              </tr>

              {/* Location */}
              <tr className="border-b border-card-border bg-surface/30">
                <td className="px-6 py-4 text-sm font-medium text-muted">
                  Location
                </td>
                {colleges.map((c) => (
                  <td key={c.id} className="px-6 py-4 text-center text-sm">
                    {c.location}, {c.state}
                  </td>
                ))}
              </tr>

              {/* Fees */}
              <tr className="border-b border-card-border">
                <td className="px-6 py-4 text-sm font-medium text-muted">
                  Annual Fees
                </td>
                {colleges.map((c) => (
                  <td
                    key={c.id}
                    className={`px-6 py-4 text-center text-sm font-semibold ${
                      isBest(c.fees, fees, "lowest")
                        ? "text-success bg-success/5"
                        : ""
                    }`}
                  >
                    ₹{(c.fees / 100000).toFixed(1)}L
                    {isBest(c.fees, fees, "lowest") && (
                      <div className="text-xs font-normal text-success mt-1">
                        ✓ Lowest
                      </div>
                    )}
                  </td>
                ))}
              </tr>

              {/* Rating */}
              <tr className="border-b border-card-border bg-surface/30">
                <td className="px-6 py-4 text-sm font-medium text-muted">
                  Rating
                </td>
                {colleges.map((c) => (
                  <td
                    key={c.id}
                    className={`px-6 py-4 text-center ${
                      isBest(c.rating, ratings, "highest")
                        ? "bg-success/5"
                        : ""
                    }`}
                  >
                    <div className="flex flex-col items-center gap-1">
                      <RatingStars rating={c.rating} size="sm" />
                      <span className="text-sm font-semibold">
                        {c.rating.toFixed(1)}
                      </span>
                      {isBest(c.rating, ratings, "highest") && (
                        <span className="text-xs text-success">✓ Highest</span>
                      )}
                    </div>
                  </td>
                ))}
              </tr>

              {/* Avg Package */}
              <tr className="border-b border-card-border">
                <td className="px-6 py-4 text-sm font-medium text-muted">
                  Avg Placement Package
                </td>
                {colleges.map((c) => {
                  const pkg = c.placements[0]?.avgPackage || 0;
                  return (
                    <td
                      key={c.id}
                      className={`px-6 py-4 text-center text-sm font-semibold ${
                        pkg > 0 && isBest(pkg, avgPackages, "highest")
                          ? "text-success bg-success/5"
                          : ""
                      }`}
                    >
                      {pkg > 0 ? `₹${(pkg / 100000).toFixed(1)}L` : "N/A"}
                      {pkg > 0 &&
                        isBest(pkg, avgPackages, "highest") && (
                          <div className="text-xs font-normal text-success mt-1">
                            ✓ Highest
                          </div>
                        )}
                    </td>
                  );
                })}
              </tr>

              {/* Highest Package */}
              <tr className="border-b border-card-border bg-surface/30">
                <td className="px-6 py-4 text-sm font-medium text-muted">
                  Highest Placement Package
                </td>
                {colleges.map((c) => {
                  const pkg = c.placements[0]?.highestPackage || 0;
                  return (
                    <td
                      key={c.id}
                      className={`px-6 py-4 text-center text-sm font-semibold ${
                        pkg > 0 && isBest(pkg, highestPackages, "highest")
                          ? "text-success bg-success/5"
                          : ""
                      }`}
                    >
                      {pkg > 0 ? `₹${(pkg / 100000).toFixed(1)}L` : "N/A"}
                      {pkg > 0 &&
                        isBest(pkg, highestPackages, "highest") && (
                          <div className="text-xs font-normal text-success mt-1">
                            ✓ Highest
                          </div>
                        )}
                    </td>
                  );
                })}
              </tr>

              {/* Placement Year */}
              <tr>
                <td className="px-6 py-4 text-sm font-medium text-muted">
                  Placement Year
                </td>
                {colleges.map((c) => (
                  <td key={c.id} className="px-6 py-4 text-center text-sm">
                    {c.placements[0]?.year || "N/A"}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-6 text-center">
        <Link
          href="/colleges"
          className="inline-flex items-center gap-2 text-sm text-primary hover:text-primary-dark font-medium transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add more colleges to compare
        </Link>
      </div>
    </div>
  );
}
