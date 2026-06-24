"use client";

import Link from "next/link";
import RatingStars from "@/components/RatingStars";
import { useCompareStore } from "@/store/compareStore";

interface College {
  id: string;
  name: string;
  location: string;
  state: string;
  fees: number;
  rating: number;
  imageUrl?: string | null;
  type: "GOVERNMENT" | "PRIVATE" | "DEEMED";
  description?: string | null;
}

interface CollegeCardProps {
  college: College;
  onSave?: (collegeId: string) => void;
  onUnsave?: (collegeId: string) => void;
  isSaved?: boolean;
  showCompare?: boolean;
}

export default function CollegeCard({
  college,
  onSave,
  onUnsave,
  isSaved = false,
  showCompare = false,
}: CollegeCardProps) {
  const { addCollege, removeCollege, hasCollege, collegeIds } = useCompareStore();
  const isInCompare = hasCollege(college.id);

  const gradientMap = {
    GOVERNMENT: "from-blue-600 to-indigo-800",
    PRIVATE: "from-pink-600 to-rose-800",
    DEEMED: "from-emerald-600 to-teal-800",
  };

  const handleSaveToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isSaved && onUnsave) {
      onUnsave(college.id);
    } else if (!isSaved && onSave) {
      onSave(college.id);
    }
  };

  const handleCompareToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isInCompare) {
      removeCollege(college.id);
    } else {
      addCollege(college.id);
    }
  };

  return (
    <div className="group relative overflow-hidden rounded-2xl bg-card-bg border border-card-border card-hover animate-fade-in">
      {/* Image / Gradient Header */}
      <div
        className={`relative h-40 bg-gradient-to-br ${gradientMap[college.type]} overflow-hidden`}
      >
        {college.imageUrl && (
          <img
            src={college.imageUrl}
            alt={college.name}
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />

        {/* Type Badge */}
        <div className="absolute top-3 left-3">
          <span
            className={`px-3 py-1 rounded-full text-xs font-bold badge-${college.type.toLowerCase()}`}
          >
            {college.type}
          </span>
        </div>

        {/* Save Button */}
        {(onSave || onUnsave) && (
          <button
            onClick={handleSaveToggle}
            className="absolute top-3 right-3 w-9 h-9 flex items-center justify-center rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/40 transition-all"
            aria-label={isSaved ? "Unsave college" : "Save college"}
          >
            <svg
              className={`w-5 h-5 transition-colors ${
                isSaved ? "text-red-500 fill-red-500" : "text-white"
              }`}
              fill={isSaved ? "currentColor" : "none"}
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
          </button>
        )}

        {/* College Name */}
        <div className="absolute bottom-3 left-3 right-3">
          <h3 className="text-lg font-bold text-white drop-shadow-lg line-clamp-1">
            {college.name}
          </h3>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4">
        {/* Location */}
        <div className="flex items-center gap-1.5 text-sm text-muted mb-3">
          <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          <span className="truncate">
            {college.location}, {college.state}
          </span>
        </div>

        {/* Rating + Fees */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-1.5">
            <RatingStars rating={college.rating} size="sm" />
            <span className="text-sm font-semibold">{college.rating.toFixed(1)}</span>
          </div>
          <div className="text-right">
            <span className="text-xs text-muted">Fees/Year</span>
            <div className="text-sm font-bold text-primary">
              ₹{(college.fees / 100000).toFixed(1)}L
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <Link
            href={`/colleges/${college.id}`}
            className="flex-1 text-center px-4 py-2 rounded-xl bg-primary text-white text-sm font-medium hover:bg-primary-dark transition-colors"
          >
            View Details
          </Link>

          {showCompare && (
            <button
              onClick={handleCompareToggle}
              disabled={!isInCompare && collegeIds.length >= 3}
              className={`px-3 py-2 rounded-xl text-sm font-medium border transition-all ${
                isInCompare
                  ? "bg-secondary/10 border-secondary/30 text-secondary"
                  : collegeIds.length >= 3
                    ? "bg-surface border-card-border text-muted cursor-not-allowed opacity-50"
                    : "bg-surface border-card-border text-foreground hover:border-secondary/30 hover:bg-secondary/5"
              }`}
              title={
                !isInCompare && collegeIds.length >= 3
                  ? "Max 3 colleges"
                  : isInCompare
                    ? "Remove from compare"
                    : "Add to compare"
              }
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
