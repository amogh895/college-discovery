"use client";

import { useState } from "react";

export interface FilterState {
  type: string[];
  state: string;
  minFees: number;
  maxFees: number;
  minRating: number;
}

interface FilterSidebarProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  states: string[];
}

const collegeTypes = [
  { value: "GOVERNMENT", label: "Government", badgeClass: "badge-government" },
  { value: "PRIVATE", label: "Private", badgeClass: "badge-private" },
  { value: "DEEMED", label: "Deemed", badgeClass: "badge-deemed" },
] as const;

function formatFees(value: number): string {
  if (value >= 100000) {
    return `₹${(value / 100000).toFixed(value % 100000 === 0 ? 0 : 1)} Lakhs`;
  }
  return `₹${value.toLocaleString("en-IN")}`;
}

export default function FilterSidebar({
  filters,
  onFiltersChange,
  states,
}: FilterSidebarProps) {
  const [isOpen, setIsOpen] = useState(false);

  function handleTypeToggle(typeValue: string) {
    const newTypes = filters.type.includes(typeValue)
      ? filters.type.filter((t) => t !== typeValue)
      : [...filters.type, typeValue];
    onFiltersChange({ ...filters, type: newTypes });
  }

  function handleStateChange(state: string) {
    onFiltersChange({ ...filters, state });
  }

  function handleMinFeesChange(value: number) {
    onFiltersChange({
      ...filters,
      minFees: value,
      maxFees: Math.max(value, filters.maxFees),
    });
  }

  function handleMaxFeesChange(value: number) {
    onFiltersChange({
      ...filters,
      maxFees: value,
      minFees: Math.min(value, filters.minFees),
    });
  }

  function handleRatingClick(rating: number) {
    onFiltersChange({
      ...filters,
      minRating: filters.minRating === rating ? 0 : rating,
    });
  }

  function handleClearAll() {
    onFiltersChange({
      type: [],
      state: "",
      minFees: 0,
      maxFees: 5000000,
      minRating: 0,
    });
  }

  const hasActiveFilters =
    filters.type.length > 0 ||
    filters.state !== "" ||
    filters.minFees > 0 ||
    filters.maxFees < 5000000 ||
    filters.minRating > 0;

  const filterContent = (
    <div className="space-y-6">
      {/* College Type */}
      <div>
        <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            className="text-primary"
          >
            <path
              d="M12 3L2 9l10 6 10-6-10-6z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinejoin="round"
            />
            <path
              d="M2 17l10 6 10-6M2 13l10 6 10-6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinejoin="round"
            />
          </svg>
          College Type
        </h3>
        <div className="space-y-2">
          {collegeTypes.map((ct) => (
            <label
              key={ct.value}
              className="flex items-center gap-3 cursor-pointer group py-1.5 px-2 rounded-lg hover:bg-surface/50 transition-colors duration-150"
            >
              <div className="relative">
                <input
                  type="checkbox"
                  checked={filters.type.includes(ct.value)}
                  onChange={() => handleTypeToggle(ct.value)}
                  className="sr-only peer"
                />
                <div className="w-4.5 h-4.5 rounded border-2 border-card-border bg-card-bg peer-checked:border-primary peer-checked:bg-primary transition-all duration-200 flex items-center justify-center">
                  <svg
                    width="10"
                    height="10"
                    viewBox="0 0 12 12"
                    fill="none"
                    className={`transition-all duration-200 ${
                      filters.type.includes(ct.value)
                        ? "opacity-100 scale-100"
                        : "opacity-0 scale-50"
                    }`}
                  >
                    <path
                      d="M2 6l3 3 5-5"
                      stroke="white"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>
              <span
                className={`text-xs font-semibold px-2.5 py-1 rounded-full ${ct.badgeClass}`}
              >
                {ct.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-card-border" />

      {/* State Dropdown */}
      <div>
        <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            className="text-primary"
          >
            <path
              d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"
              stroke="currentColor"
              strokeWidth="2"
            />
            <circle cx="12" cy="9" r="2.5" stroke="currentColor" strokeWidth="2" />
          </svg>
          State
        </h3>
        <div className="relative">
          <select
            value={filters.state}
            onChange={(e) => handleStateChange(e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl border border-card-border bg-card-bg text-foreground text-sm appearance-none cursor-pointer outline-none focus:border-primary transition-colors duration-200 hover:border-primary-light/50"
          >
            <option value="">All States</option>
            {states.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-muted-light">
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                d="M6 9l6 6 6-6"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-card-border" />

      {/* Fees Range */}
      <div>
        <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            className="text-primary"
          >
            <path
              d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Fee Range
        </h3>
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-muted">Minimum</span>
              <span className="text-xs font-semibold text-primary">
                {formatFees(filters.minFees)}
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={5000000}
              step={50000}
              value={filters.minFees}
              onChange={(e) => handleMinFeesChange(Number(e.target.value))}
              className="w-full"
            />
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-muted">Maximum</span>
              <span className="text-xs font-semibold text-primary">
                {formatFees(filters.maxFees)}
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={5000000}
              step={50000}
              value={filters.maxFees}
              onChange={(e) => handleMaxFeesChange(Number(e.target.value))}
              className="w-full"
            />
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-card-border" />

      {/* Minimum Rating */}
      <div>
        <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            className="text-primary"
          >
            <path
              d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinejoin="round"
            />
          </svg>
          Minimum Rating
        </h3>
        <div className="flex items-center gap-1.5">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onClick={() => handleRatingClick(star)}
              className="group/star p-0.5 transition-transform duration-150 hover:scale-110 active:scale-95"
              aria-label={`Set minimum rating to ${star}`}
              type="button"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                className="transition-all duration-200"
              >
                <path
                  d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
                  fill={star <= filters.minRating ? "#f59e0b" : "none"}
                  stroke={star <= filters.minRating ? "#f59e0b" : "currentColor"}
                  strokeWidth="1.5"
                  strokeLinejoin="round"
                  className={
                    star <= filters.minRating
                      ? "text-warning"
                      : "text-muted-light group-hover/star:text-warning/60"
                  }
                  style={
                    star <= filters.minRating
                      ? { filter: "drop-shadow(0 0 3px rgba(245, 158, 11, 0.4))" }
                      : undefined
                  }
                />
              </svg>
            </button>
          ))}
          {filters.minRating > 0 && (
            <span className="ml-2 text-xs font-semibold text-warning">
              {filters.minRating}+
            </span>
          )}
        </div>
      </div>

      {/* Clear All */}
      {hasActiveFilters && (
        <>
          <div className="border-t border-card-border" />
          <button
            onClick={handleClearAll}
            className="w-full py-2.5 rounded-xl border border-danger/30 text-danger text-sm font-semibold hover:bg-danger/10 transition-all duration-200 active:scale-[0.98]"
            type="button"
          >
            Clear All Filters
          </button>
        </>
      )}
    </div>
  );

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden flex items-center gap-2 px-4 py-2.5 rounded-xl border border-card-border bg-card-bg text-sm font-medium text-foreground hover:border-primary-light/50 transition-all duration-200 active:scale-[0.98]"
        type="button"
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          className="text-primary"
        >
          <path
            d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        Filters
        {hasActiveFilters && (
          <span className="flex items-center justify-center w-5 h-5 rounded-full bg-primary text-white text-xs font-bold">
            {filters.type.length +
              (filters.state ? 1 : 0) +
              (filters.minFees > 0 ? 1 : 0) +
              (filters.maxFees < 5000000 ? 1 : 0) +
              (filters.minRating > 0 ? 1 : 0)}
          </span>
        )}
      </button>

      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/40 z-40 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar content */}
      <aside
        className={`
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0
          fixed lg:static
          top-0 left-0
          h-full lg:h-auto
          w-72 lg:w-full
          z-50 lg:z-auto
          bg-card-bg lg:bg-transparent
          border-r lg:border-r-0 border-card-border
          p-5 lg:p-0
          overflow-y-auto
          transition-transform duration-300 ease-out
        `}
      >
        {/* Mobile header */}
        <div className="flex items-center justify-between mb-6 lg:hidden">
          <h2 className="text-lg font-bold text-foreground">Filters</h2>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1.5 rounded-lg text-muted hover:text-foreground hover:bg-surface transition-all duration-150"
            aria-label="Close filters"
            type="button"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path
                d="M18 6L6 18M6 6l12 12"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        {/* Desktop header */}
        <div className="hidden lg:flex items-center justify-between mb-5">
          <h2 className="text-sm font-bold text-foreground uppercase tracking-wider">
            Filters
          </h2>
          {hasActiveFilters && (
            <span className="text-xs text-primary font-semibold">
              {filters.type.length +
                (filters.state ? 1 : 0) +
                (filters.minFees > 0 ? 1 : 0) +
                (filters.maxFees < 5000000 ? 1 : 0) +
                (filters.minRating > 0 ? 1 : 0)}{" "}
              active
            </span>
          )}
        </div>

        {filterContent}
      </aside>
    </>
  );
}
