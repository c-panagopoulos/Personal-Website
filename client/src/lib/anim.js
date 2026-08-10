const DEFAULT_EASING = "cubic-bezier(0.2, 0.7, 0.2, 1)";
const SPEED = 0.7;

export function anim(visible, name, duration, delay = 0, easing = DEFAULT_EASING) {
  return {
    animation: `${name} ${duration * SPEED}s ${easing} ${delay * SPEED}s both`,
    animationPlayState: visible ? "running" : "paused",
  };
}
