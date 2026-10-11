// src/animation.js
import React, { createContext, useContext, useMemo, useState } from "react";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";

/**
 * GridProvider holds the filter/group state so Navigation and HomePage
 * can talk without prop-drilling.
 */
const GridContext = createContext(null);

export function GridProvider({ children }) {
  const [filter, setFilter] = useState("All New");   // "all" | "blog" | "video" | "project" | etc.
  const [group, setGroup]   = useState(true);    // optional: re-order by category

  const api = {
    filter,
    setFilter,
    group,
    setGroup,
    // Handy helpers:
    cycleFilter(cycle = ["All New", "New Music",  "New Blogs", "New Videos", "All Old",]) {
      const i = cycle.indexOf(filter);
      const next = cycle[(i + 1) % cycle.length] || "All New";
      setFilter(next);
    },
    toggleGroup() { setGroup(v => !v); }
  };

  return <GridContext.Provider value={api}>{children}</GridContext.Provider>;
}

export function useGridControls() {
  const ctx = useContext(GridContext);
  if (!ctx) throw new Error("useGridControls must be used within <GridProvider>");
  return ctx;
}

/**
 * AnimatedGrid renders your existing boxes but with animated reflow
 * and optional filtering/grouping by category.
 *
 * Pass the same `boxes` you already use in homePage.js:
 *   [{ className, aria, src, alt, category? }, ...]
 * If `category` is missing, we infer a basic grouping from className.
 */
