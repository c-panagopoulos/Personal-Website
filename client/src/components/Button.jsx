import { motion } from "motion/react";

// Ported from animate-ui's Button primitive (github.com/imskyleen/animate-ui,
// registry/primitives/buttons/button) — just the hover/tap scale interaction,
// not the Tailwind/cva variant system, since `.btn` / `.btn--secondary`
// already carry this site's own primary/secondary visual styles.
export default function Button({ variant, className = "", children, ...props }) {
  const cls = ["btn", variant === "secondary" && "btn--secondary", className].filter(Boolean).join(" ");
  return (
    <motion.a className={cls} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} {...props}>
      {children}
    </motion.a>
  );
}
