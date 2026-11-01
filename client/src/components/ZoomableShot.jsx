import { useState } from "react";
import { Lightbox, ZoomIcon } from "./MotionCarousel.jsx";

const noop = () => {};

// A single screenshot that opens in the same lightbox the Hermes carousel uses.
export default function ZoomableShot({ src, label, alt }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button type="button" className="scene__shot" onClick={() => setOpen(true)} aria-label={`Zoom into ${label}`}>
        <img src={src} alt={alt} loading="lazy" draggable={false} />
        <span className="motion-carousel__zoom-hint" aria-hidden="true">
          <ZoomIcon />
        </span>
      </button>
      <Lightbox
        slides={[{ name: label, label, src }]}
        index={open ? 0 : null}
        onClose={() => setOpen(false)}
        onPrev={noop}
        onNext={noop}
      />
    </>
  );
}
