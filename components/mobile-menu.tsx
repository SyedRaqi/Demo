"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

export function MobileMenu({ links, languageHref = "/ur", languageLabel = "اردو" }: { links: readonly (readonly [string, string])[]; languageHref?: string; languageLabel?: string }) {
  const [open, setOpen] = useState(false);
  return <div className="mobile-menu"><button className="menu-button" aria-label={open ? "Close navigation" : "Open navigation"} aria-expanded={open} onClick={() => setOpen((value) => !value)}>{open ? <X size={21} /> : <Menu size={21} />}</button><AnimatePresence>{open && <motion.div className="mobile-menu-panel" initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>{links.map(([label, href]) => <a href={href} key={href} onClick={() => setOpen(false)}>{label}</a>)}<a href={languageHref} onClick={() => setOpen(false)}>{languageLabel}</a></motion.div>}</AnimatePresence></div>;
}
