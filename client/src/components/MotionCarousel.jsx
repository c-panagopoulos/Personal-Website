// Ported from animate-ui's "Motion Carousel" (community, Embla Carousel +
// Motion) to plain JS — no TypeScript. Underlying mechanics kept as-is
// (Embla for scroll/drag/snap, Motion spring transitions on the active
// slide); only the visual layer (colors, chrome, pagination shape) is
// restyled to match the site.
import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "motion/react";
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
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "center", containScroll: false });
  const { selectedIndex, scrollSnaps, prevDisabled, nextDisabled, onDotClick, onPrev, onNext } =
    useEmblaControls(emblaApi);
  const [zoomedIndex, setZoomedIndex] = useState(null);

  // Lightbox prev/next also moves the underlying carousel, so closing it
  // (or the "see exactly how it answered" style continuity elsewhere on the
  // site) leaves the strip on whichever slide was last viewed, not wherever
  // it happened to be when the lightbox was first opened.
  const zoomPrev = useCallback(() => {
    setZoomedIndex((i) => {
      if (i == null) return i;
      const next = (i - 1 + slides.length) % slides.length;
      emblaApi?.scrollTo(next);
      return next;
    });
  }, [emblaApi, slides.length]);
  const zoomNext = useCallback(() => {
    setZoomedIndex((i) => {
      if (i == null) return i;
      const next = (i + 1) % slides.length;
      emblaApi?.scrollTo(next);
      return next;
    });
  }, [emblaApi, slides.length]);

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
                  whileHover={slide.src ? { scale: isActive ? 1.035 : 0.93 } : undefined}
                  transition={transition}
                  onClick={() => slide.src && setZoomedIndex(index)}
                >
                  {slide.src ? (
                    <>
                      <img className="motion-carousel__slide-img" src={slide.src} alt={slide.label} draggable={false} />
                      <span className="motion-carousel__zoom-hint" aria-hidden="true">
                        <ZoomIcon />
                      </span>
                    </>
                  ) : (
                    <span className="motion-carousel__slide-tag">{slide.label}</span>
                  )}
                  <span className="motion-carousel__slide-caption">{slide.label}</span>
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

      <Lightbox
        slides={slides}
        index={zoomedIndex}
        onClose={() => setZoomedIndex(null)}
        onPrev={zoomPrev}
        onNext={zoomNext}
      />
    </div>
  );
}

function Lightbox({ slides, index, onClose, onPrev, onNext }) {
  const slide = index != null ? slides[index] : null;

  useEffect(() => {
    if (!slide) return undefined;
    const onKey = (event) => {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowLeft") onPrev();
      if (event.key === "ArrowRight") onNext();
    };
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [slide, onClose, onPrev, onNext]);

  return createPortal(
    <AnimatePresence>
      {slide && (
        <motion.div
          className="motion-lightbox"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          onClick={onClose}
        >
          <motion.button
            type="button"
            className="motion-lightbox__close"
            onClick={onClose}
            aria-label="Close preview"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <CloseIcon />
          </motion.button>
          {slides.length > 1 && (
            <motion.button
              type="button"
              className="motion-lightbox__arrow motion-lightbox__arrow--left"
              onClick={(event) => {
                event.stopPropagation();
                onPrev();
              }}
              aria-label="Previous image"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <ChevronIcon direction="left" />
            </motion.button>
          )}
          <motion.img
            key={slide.name}
            className="motion-lightbox__img"
            src={slide.src}
            alt={slide.label}
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 280, damping: 28, mass: 0.9 }}
            onClick={(event) => event.stopPropagation()}
          />
          {slides.length > 1 && (
            <motion.button
              type="button"
              className="motion-lightbox__arrow motion-lightbox__arrow--right"
              onClick={(event) => {
                event.stopPropagation();
                onNext();
              }}
              aria-label="Next image"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <ChevronIcon direction="right" />
            </motion.button>
          )}
          <motion.span
            className="motion-lightbox__caption"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            {slide.label}
          </motion.span>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
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
      animate={{ width: selected ? 20 : 12, backgroundColor: selected ? "#b39d9d" : "#3a3640" }}
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

function ZoomIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="7" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
      <line x1="11" y1="8" x2="11" y2="14" />
      <line x1="8" y1="11" x2="14" y2="11" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="6" y1="6" x2="18" y2="18" />
      <line x1="6" y1="18" x2="18" y2="6" />
    </svg>
  );
}
