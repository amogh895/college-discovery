"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useSession } from "next-auth/react";
import { useSearchParams, useRouter } from "next/navigation";
import CollegeCard from "@/components/CollegeCard";
import SearchBar from "@/components/SearchBar";
import FilterSidebar, { type FilterState } from "@/components/FilterSidebar";
import { CollegeCardSkeleton } from "@/components/LoadingSpinner";
import EmptyState from "@/components/EmptyState";

interface College {
  id: string;
  name: string;
  location: string;
  state: string;
  fees: number;
  rating: number;
  imageUrl: string | null;
  type: "GOVERNMENT" | "PRIVATE" | "DEEMED";
  description: string | null;
}

interface CollegesResponse {
  colleges: College[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

const STATES = [
  "Maharashtra",
  "Delhi",
  "Tamil Nadu",
  "Rajasthan",
  "Karnataka",
  "Andhra Pradesh",
  "Telangana",
  "Uttar Pradesh",
];

function CollegesContent() {
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const router = useRouter();

  const [colleges, setColleges] = useState<College[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());

  const currentPage = parseInt(searchParams.get("page") || "1", 10);
  const searchQuery = searchParams.get("search") || "";

  const [filters, setFilters] = useState<FilterState>({
    type: searchParams.get("type") ? [searchParams.get("type")!] : [],
    state: searchParams.get("state") || "",
    minFees: parseInt(searchParams.get("minFees") || "0", 10),
    maxFees: parseInt(searchParams.get("maxFees") || "5000000", 10),
    minRating: parseFloat(searchParams.get("minRating") || "0"),
  });

  const [search, setSearch] = useState(searchQuery);

  const buildQueryString = useCallback(() => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (filters.type.length === 1) params.set("type", filters.type[0]);
    if (filters.state) params.set("state", filters.state);
    if (filters.minFees > 0) params.set("minFees", filters.minFees.toString());
    if (filters.maxFees < 5000000) params.set("maxFees", filters.maxFees.toString());
    if (filters.minRating > 0) params.set("minRating", filters.minRating.toString());
    params.set("page", currentPage.toString());
    params.set("limit", "9");
    return params.toString();
  }, [search, filters, currentPage]);

  const fetchColleges = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/colleges?${buildQueryString()}`);
      const data: CollegesResponse = await res.json();
      setColleges(data.colleges);
      setTotalPages(data.totalPages);
    } catch (err) {
      console.error("Failed to fetch colleges:", err);
    } finally {
      setLoading(false);
    }
  }, [buildQueryString]);

  const fetchSavedColleges = useCallback(async () => {
    if (!session?.user) return;
    try {
      const res = await fetch("/api/saved");
      const data = await res.json();
      const ids = new Set<string>(
        (data.savedColleges as College[]).map((c) => c.id)
      );
      setSavedIds(ids);
    } catch (err) {
      console.error("Failed to fetch saved:", err);
    }
  }, [session?.user]);

  useEffect(() => {
    fetchColleges();
  }, [fetchColleges]);

  useEffect(() => {
    fetchSavedColleges();
  }, [fetchSavedColleges]);

  // Update URL when filters change
  const updateURL = useCallback(
    (newFilters: FilterState, newSearch: string, page: number) => {
      const params = new URLSearchParams();
      if (newSearch) params.set("search", newSearch);
      if (newFilters.type.length === 1) params.set("type", newFilters.type[0]);
      if (newFilters.state) params.set("state", newFilters.state);
      if (newFilters.minFees > 0) params.set("minFees", newFilters.minFees.toString());
      if (newFilters.maxFees < 5000000) params.set("maxFees", newFilters.maxFees.toString());
      if (newFilters.minRating > 0) params.set("minRating", newFilters.minRating.toString());
      if (page > 1) params.set("page", page.toString());
      router.push(`/colleges?${params.toString()}`);
    },
    [router]
  );

  const handleFiltersChange = (newFilters: FilterState) => {
    setFilters(newFilters);
    updateURL(newFilters, search, 1);
  };

  const handleSearchChange = (value: string) => {
    setSearch(value);
    updateURL(filters, value, 1);
  };

  const handlePageChange = (page: number) => {
    updateURL(filters, search, page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSave = async (collegeId: string) => {
    try {
      await fetch("/api/saved", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ collegeId }),
      });
      setSavedIds((prev) => new Set(prev).add(collegeId));
    } catch (err) {
      console.error("Failed to save:", err);
    }
  };

  const handleUnsave = async (collegeId: string) => {
    try {
      await fetch(`/api/saved/${collegeId}`, { method: "DELETE" });
      setSavedIds((prev) => {
        const next = new Set(prev);
        next.delete(collegeId);
        return next;
      });
    } catch (err) {
      console.error("Failed to unsave:", err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Explore Colleges</h1>
        <p className="text-muted">
          Discover the best colleges across India
        </p>
      </div>

      {/* Search */}
      <div className="mb-8">
        <SearchBar
          value={search}
          onChange={handleSearchChange}
          placeholder="Search by college name..."
          className="max-w-xl"
        />
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar */}
        <div className="lg:w-72 shrink-0">
          <FilterSidebar
            filters={filters}
            onFiltersChange={handleFiltersChange}
            states={STATES}
          />
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <CollegeCardSkeleton key={i} />
              ))}
            </div>
          ) : colleges.length === 0 ? (
            <EmptyState
              title="No colleges found"
              description="Try adjusting your filters or search query to find what you're looking for."
              action={
                <button
                  onClick={() => {
                    setSearch("");
                    setFilters({
                      type: [],
                      state: "",
                      minFees: 0,
                      maxFees: 5000000,
                      minRating: 0,
                    });
                    router.push("/colleges");
                  }}
                  className="px-6 py-2.5 rounded-xl bg-primary text-white text-sm font-medium hover:bg-primary-dark transition-colors"
                >
                  Clear All Filters
                </button>
              }
            />
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {colleges.map((college) => (
                  <CollegeCard
                    key={college.id}
                    college={college}
                    onSave={session?.user ? handleSave : undefined}
                    onUnsave={session?.user ? handleUnsave : undefined}
                    isSaved={savedIds.has(college.id)}
                    showCompare
                  />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-10 flex items-center justify-center gap-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage <= 1}
                    className="px-4 py-2 rounded-xl border border-card-border text-sm font-medium hover:bg-surface disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    Previous
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`w-10 h-10 rounded-xl text-sm font-medium transition-colors ${
                          page === currentPage
                            ? "bg-primary text-white"
                            : "border border-card-border hover:bg-surface"
                        }`}
                      >
                        {page}
                      </button>
                    )
                  )}

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage >= totalPages}
                    className="px-4 py-2 rounded-xl border border-card-border text-sm font-medium hover:bg-surface disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function CollegesPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <CollegeCardSkeleton key={i} />
            ))}
          </div>
        </div>
      }
    >
      <CollegesContent />
    </Suspense>
  );
}
