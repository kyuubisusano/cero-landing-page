"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { IN_VIEW, riseSoft, stagger } from "./motion";

/** Staggers its children in the first time it enters view. */
export function RevealGroup({
  children,
  gap = 0.07,
  delay = 0,
  className,
  id,
}: {
  children: ReactNode;
  gap?: number;
  delay?: number;
  className?: string;
  id?: string;
}) {
  return (
    <motion.div
      id={id}
      className={className}
      variants={stagger(gap, delay)}
      initial="hidden"
      whileInView="show"
      viewport={IN_VIEW}
    >
      {children}
    </motion.div>
  );
}

/** One child of a RevealGroup. */
export function RevealItem({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div className={className} variants={riseSoft}>
      {children}
    </motion.div>
  );
}
