"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

interface CompareStore {
  collegeIds: string[];
  addCollege: (id: string) => void;
  removeCollege: (id: string) => void;
  clearAll: () => void;
  hasCollege: (id: string) => boolean;
}

export const useCompareStore = create<CompareStore>()(
  persist(
    (set, get) => ({
      collegeIds: [],

      addCollege: (id: string) => {
        const current = get().collegeIds;
        if (current.length >= 3) return;
        if (current.includes(id)) return;
        set({ collegeIds: [...current, id] });
      },

      removeCollege: (id: string) => {
        set({ collegeIds: get().collegeIds.filter((cid) => cid !== id) });
      },

      clearAll: () => {
        set({ collegeIds: [] });
      },

      hasCollege: (id: string) => {
        return get().collegeIds.includes(id);
      },
    }),
    {
      name: "compare-colleges",
    }
  )
);
