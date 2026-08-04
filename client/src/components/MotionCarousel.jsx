// Ported from animate-ui's "Motion Carousel" (community, Embla Carousel +
// Motion) to plain JS — no TypeScript. Underlying mechanics kept as-is
// (Embla for scroll/drag/snap, Motion spring transitions on the active
// slide); only the visual layer (colors, chrome, pagination shape) is
// restyled to match the site.
import { useCallback, useEffect, useState } from "react";
import { motion } from "motion/react";
import useEmblaCarousel from "embla-carousel-react";

const transition = { type: "spring", stiffness: 240, damping: 24, mass: 1 };

function useEmblaControls(emblaApi) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState([]);
  const [prevDisabled, setPrevDisabled] = useState(true);
  const [nextDisabled, setNextDisabled] = useState(true);

  const onDotClick = useCallback((index) => emblaApi?.scrollTo(index), [emblaApi]);
  const onPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const onNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    const updateSelectionState = (api) => {
      setSelectedIndex(api.selectedScrollSnap());
      setPrevDisabled(!api.canScrollPrev());
      setNextDisabled(!api.canScrollNext());
    };
    const onInit = (api) => {
      setScrollSnaps(api.scrollSnapList());
      updateSelectionState(api);
    };
    const onSelect = (api) => updateSelectionState(api);
    onInit(emblaApi);
    emblaApi.on("reInit", onInit).on("select", onSelect);
    return () => emblaApi.off("reInit", onInit).off("select", onSelect);
  }, [emblaApi]);

  return { selectedIndex, scrollSnaps, prevDisabled, nextDisabled, onDotClick, onPrev, onNext };
}

export default function MotionCarousel({ slides, terminalHost = "hermes.local" }) {
  // containScroll:false + matching CSS padding on the viewport (see
  // .motion-carousel__viewport) so align:"center" also centers the first
  // and last slide, not just the interior ones (Embla's default trims the
  // edge snap points, which is what made them hug the container edges).
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false, align: "center", containScroll: false });
  const { selectedIndex, scrollSnaps, prevDisabled, nextDisabled, onDotClick, onPrev, onNext } =
    useEmblaControls(emblaApi);

  const current = slides[selectedIndex] ?? slides[0];
  const fileNumber = String(selectedIndex + 1).padStart(2, "0");

  return (
    <div className="motion-carousel">
      <div className="motion-carousel__terminal">
        <span className="motion-carousel__dot" />
        <span className="motion-carousel__dot" />
        <span className="motion-carousel__dot" />
        <span className="motion-carousel__terminal-label">
          {terminalHost} — evidence/{fileNumber}-{current.name}.png
        </span>
      </div>

      <div className="motion-carousel__viewport" ref={emblaRef}>
        <div className="motion-carousel__track">
          {slides.map((slide, index) => {
            const isActive = index === selectedIndex;
            return (
              <div className="motion-carousel__slide-wrap" key={slide.name}>
                <motion.div
                  className="motion-carousel__slide"
                  initial={false}
                  animate={{ scale: isActive ? 1 : 0.9 }}
                  transition={transition}
                >
                  <span className="motion-carousel__slide-tag">{slide.label}</span>
                </motion.div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="motion-carousel__controls">
        <button
          type="button"
          className="motion-carousel__arrow"
          onClick={onPrev}
          disabled={prevDisabled}
          aria-label="Previous slide"
        >
          <ChevronIcon direction="left" />
        </button>

        <div className="motion-carousel__dots">
          {scrollSnaps.map((_, index) => (
            <DotBar key={index} selected={index === selectedIndex} onClick={() => onDotClick(index)} />
          ))}
        </div>

        <button
          type="button"
          className="motion-carousel__arrow"
          onClick={onNext}
          disabled={nextDisabled}
          aria-label="Next slide"
        >
          <ChevronIcon direction="right" />
        </button>
      </div>

      <p className="motion-carousel__meta">{slides.map((s) => s.label).join(" · ")}</p>
    </div>
  );
}

function DotBar({ selected, onClick }) {
  return (
    <motion.button
      type="button"
      className="motion-carousel__dot-bar"
      onClick={onClick}
      layout
      initial={false}
      animate={{ width: selected ? 20 : 12, backgroundColor: selected ? "#378add" : "#232a36" }}
      transition={transition}
      aria-label="Go to slide"
    />
  );
}

function ChevronIcon({ direction }) {
  const points = direction === "left" ? "14 6 8 12 14 18" : "10 6 16 12 10 18";
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points={points} />
    </svg>
  );
}
