import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, ArrowUpRight } from 'lucide-react';

export function ProjectCarousel({ images, title }: { images: string[]; title: string }) {
  const [active, setActive] = useState(0);
  const thumbnails = useRef<HTMLDivElement>(null);
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const move = (direction: number) => setActive(index => (index + direction + images.length) % images.length);

  useEffect(() => {
    const strip = thumbnails.current;
    const selected = strip?.children[active] as HTMLElement | undefined;
    if (strip && selected) strip.scrollTo({ left: selected.offsetLeft - strip.offsetLeft - (strip.clientWidth - selected.clientWidth) / 2, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
  }, [active]);

  return <section className="exp-carousel" aria-label={`${title} photo gallery`} aria-roledescription="carousel" onKeyDown={event => {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    if (event.key === 'Home') setActive(0);
    else if (event.key === 'End') setActive(images.length - 1);
    else move(event.key === 'ArrowRight' ? 1 : -1);
  }}>
    <div className="exp-carousel-stage" onTouchStart={event => {
      touchStart.current = { x: event.touches[0].clientX, y: event.touches[0].clientY };
    }} onTouchCancel={() => { touchStart.current = null; }} onTouchEnd={event => {
      if (!touchStart.current) return;
      const dx = event.changedTouches[0].clientX - touchStart.current.x;
      const dy = event.changedTouches[0].clientY - touchStart.current.y;
      if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy)) move(dx < 0 ? 1 : -1);
      touchStart.current = null;
    }}>
      <img key={images[active]} src={images[active]} alt={`${title} — gallery photo ${active + 1}`} />
    </div>
    <div className="exp-carousel-toolbar">
      <div className="exp-carousel-controls">
        <button type="button" onClick={() => move(-1)} aria-label="Previous photo"><ArrowLeft size={20} /></button>
        <span aria-live="polite" aria-atomic="true">{String(active + 1).padStart(2, '0')} / {String(images.length).padStart(2, '0')}</span>
        <button type="button" onClick={() => move(1)} aria-label="Next photo"><ArrowRight size={20} /></button>
      </div>
      <a href={images[active]} target="_blank" rel="noreferrer">Open full size <ArrowUpRight size={16} /></a>
    </div>
    <div className="exp-carousel-thumbnails" ref={thumbnails}>
      {images.map((src, index) => <button key={src} type="button" aria-label={`Show photo ${index + 1}`} aria-pressed={active === index} onClick={() => setActive(index)}>
        <img src={src} alt="" loading="lazy" />
      </button>)}
    </div>
  </section>;
}
