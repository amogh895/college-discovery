"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import CollegeCard from "@/components/CollegeCard";
import { LoadingSpinner } from "@/components/LoadingSpinner";
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

export default function SavedPage() {
  const { status } = useSession();
  const [savedColleges, setSavedColleges] = useState<College[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSaved = useCallback(async () => {
    if (status !== "authenticated") return;
    setLoading(true);
    try {
      const res = await fetch("/api/saved");
      const data = await res.json();
      setSavedColleges(data.savedColleges || []);
    } catch (err) {
      console.error("Failed to fetch saved colleges:", err);
    } finally {
      setLoading(false);
    }
  }, [status]);

  useEffect(() => {
    fetchSaved();
  }, [fetchSaved]);

  const handleUnsave = async (collegeId: string) => {
    try {
      await fetch(`/api/saved/${collegeId}`, { method: "DELETE" });
      setSavedColleges((prev) => prev.filter((c) => c.id !== collegeId));
    } catch (err) {
      console.error("Failed to unsave:", err);
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <LoadingSpinner message="Loading saved colleges..." />
      </div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16">
        <EmptyState
          title="Sign in to view saved colleges"
          description="You need to be logged in to save and view colleges."
          action={
            <Link
              href="/auth/login?callbackUrl=/saved"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-white font-medium hover:bg-primary-dark transition-colors"
            >
              Sign In
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Saved Colleges</h1>
        <p className="mt-1 text-muted">
          {savedColleges.length > 0
            ? `You have ${savedColleges.length} saved college${savedColleges.length > 1 ? "s" : ""}`
            : "Your saved colleges will appear here"}
        </p>
      </div>

      {savedColleges.length === 0 ? (
        <EmptyState
          title="No saved colleges yet"
          description="Start exploring and save colleges you're interested in."
          icon={
            <svg className="w-16 h-16 text-muted-light" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
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
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedColleges.map((college) => (
            <CollegeCard
              key={college.id}
              college={college}
              isSaved={true}
              onUnsave={handleUnsave}
              showCompare
            />
          ))}
        </div>
      )}
    </div>
  );
}
