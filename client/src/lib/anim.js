// Scroll-triggered entrance animations use animation-play-state instead of
// mount/unmount: every element carries its full animation shorthand (with
// delay) from first render but stays "paused" — which, combined with
// fill-mode "both", freezes it at the 0% keyframe — so nothing plays while
// off-screen. Flipping to "running" starts the delay/duration clock at that
// exact moment instead of at page load, which is what makes a section
// "reveal once it enters view" instead of animating invisibly ahead of time.
const DEFAULT_EASING = "cubic-bezier(0.2, 0.7, 0.2, 1)";

// Every caller of anim() (project scenes, assistant/homelab/stack/contact
// sections) feels a bit sluggish at its authored timings — Hero and the big
// statement quotes don't use this helper at all (their own inline
// animations), so scaling here speeds up everything else without touching
// those. Applied to both duration and delay so staggered sequences stay
// proportional instead of just snapping faster at the end.
const SPEED = 0.7;

export function anim(visible, name, duration, delay = 0, easing = DEFAULT_EASING) {
  return {
    animation: `${name} ${duration * SPEED}s ${easing} ${delay * SPEED}s both`,
    animationPlayState: visible ? "running" : "paused",
  };
}
