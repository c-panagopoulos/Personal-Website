// Smooth-scrolls to an in-page anchor. The sticky nav offset comes from each
// section's scroll-margin-top in global.css, so this works for any #id link.
export function scrollToTarget(el) {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  el.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
}

export function handleAnchorClick(event) {
  const href = event.currentTarget.getAttribute("href");
  if (!href || !href.startsWith("#")) return;
  const el = document.querySelector(href);
  if (!el) return;
  event.preventDefault();
  scrollToTarget(el);
}
