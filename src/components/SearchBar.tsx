"use client";

import { useState, useEffect, useRef } from "react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export default function SearchBar({
  value,
  onChange,
  placeholder = "Search colleges...",
  className = "",
}: SearchBarProps) {
  const [localValue, setLocalValue] = useState(value);
  const [prevValue, setPrevValue] = useState(value);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  if (value !== prevValue) {
    setLocalValue(value);
    setPrevValue(value);
  }

  // Debounce: fire onChange 300ms after user stops typing
  useEffect(() => {
    const timer = setTimeout(() => {
      if (localValue !== value) {
        onChange(localValue);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [localValue, onChange, value]);

  function handleClear() {
    setLocalValue("");
    onChange("");
    inputRef.current?.focus();
  }

  return (
    <div
      className={`relative group ${className}`}
    >
      {/* Animated focus ring */}
      <div
        className={`absolute -inset-0.5 rounded-xl transition-all duration-300 ${
          isFocused
            ? "bg-gradient-to-r from-primary via-secondary to-accent opacity-100 blur-sm"
            : "opacity-0"
        }`}
        aria-hidden="true"
      />

      <div className="relative flex items-center">
        {/* Search icon */}
        <div className="absolute left-3.5 pointer-events-none">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={`transition-colors duration-200 ${
              isFocused ? "text-primary" : "text-muted-light"
            }`}
          >
            <circle
              cx="11"
              cy="11"
              r="7"
              stroke="currentColor"
              strokeWidth="2.5"
            />
            <path
              d="M16.5 16.5L21 21"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </svg>
        </div>

        <input
          ref={inputRef}
          type="text"
          value={localValue}
          onChange={(e) => setLocalValue(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className={`
            w-full pl-11 pr-10 py-2.5
            rounded-xl border border-card-border
            bg-card-bg text-foreground text-sm
            placeholder:text-muted-light
            outline-none
            transition-all duration-200
            hover:border-primary-light/50
            focus:border-transparent focus:ring-0
          `}
          aria-label="Search"
        />

        {/* Clear button */}
        {localValue && (
          <button
            onClick={handleClear}
            className="absolute right-3 p-0.5 rounded-md text-muted-light hover:text-foreground hover:bg-surface transition-all duration-150 active:scale-90"
            aria-label="Clear search"
            type="button"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M18 6L6 18M6 6l12 12"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
