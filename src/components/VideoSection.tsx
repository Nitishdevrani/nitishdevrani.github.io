import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Pause, Play } from 'lucide-react';

type Props = { id: string; asset: string; label: string; hero?: boolean; layout?: 'scene' | 'contact'; suspended?: boolean; children: ReactNode };

export function GlassPanel({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`exp-glass ${className}`}>{children}</div>;
}

export function VideoSection({ id, asset, label, hero, layout = 'scene', suspended, children }: Props) {
  const section = useRef<HTMLElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [requested, setRequested] = useState<boolean | null>(null);

  useEffect(() => {
    const element = section.current;
    const media = video.current;
    if (!element || !media) return;
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let visible = false;
    let loaded = media.getAttribute('src') === `/assets/${asset}.mp4`;
    let disposed = false;
    const shouldPlay = () => visible && !document.hidden && !suspended && (requested ?? !motion.matches);
    const sync = () => {
      if (shouldPlay() && loaded) {
        void media.play().then(() => { if (disposed || !shouldPlay()) media.pause(); }).catch(() => { /* Poster remains visible if autoplay is unavailable. */ });
      } else media.pause();
    };
    const load = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !loaded) {
        media.src = `/assets/${asset}.mp4`;
        loaded = true;
        sync();
      }
    }, { rootMargin: '250px' });
    const observe = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; sync(); }, { threshold: 0 });
    load.observe(element);
    observe.observe(element);
    document.addEventListener('visibilitychange', sync);
    motion.addEventListener('change', sync);
    return () => {
      disposed = true;
      load.disconnect(); observe.disconnect(); media.pause();
      document.removeEventListener('visibilitychange', sync);
      motion.removeEventListener('change', sync);
    };
  }, [asset, requested, suspended]);

  return (
    <section ref={section} id={id} className={layout === 'contact' ? 'exp-contact' : `exp-scene exp-scene-${asset.toLowerCase()} ${hero ? 'exp-hero' : ''}`} aria-label={label}>
      <div className={layout === 'contact' ? 'exp-contact-media' : 'exp-scene-media'}>
        <video ref={video} poster={`/assets/${asset}-poster.jpg`} muted loop playsInline preload="none" aria-hidden="true" onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} />
        <div className="exp-scene-shade" />
        <span className="exp-film-label">NITISH DEVRANI <span>— {label}</span></span>
        <button className="exp-playback" type="button" onClick={() => {
            setRequested(!playing);
            if (playing) video.current?.pause();
            else void video.current?.play().catch(() => {});
          }} aria-label={`${playing ? 'Pause' : 'Play'} ${label.toLowerCase()} video`}>
          {playing ? <Pause size={14} /> : <Play size={14} />}<span>{playing ? 'Pause' : 'Play'} film</span>
        </button>
      </div>
      <div className={layout === 'contact' ? undefined : 'exp-scene-content'}>{children}</div>
    </section>
  );
}
