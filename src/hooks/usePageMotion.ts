import { useEffect, type RefObject } from 'react';

export const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const clamp = (v: number) => Math.max(0, Math.min(1, v));

/**
 * Drives the page's scroll-linked motion:
 * - one-shot reveals for every `[data-reveal]` element (IntersectionObserver),
 * - CSS vars on the root: `--hp` hero progress, `--xp` experience ladder fill, `--sp` page progress.
 * With reduced motion, reveals are skipped and parallax stays at 0 (the ladder and progress bar still track).
 */
export function usePageMotion(rootRef: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const motion = !prefersReducedMotion();

    let io: IntersectionObserver | undefined;
    if (motion) {
      root.classList.add('motion');
      io = new IntersectionObserver(
        (entries) => {
          for (const e of entries) {
            if (!e.isIntersecting) continue;
            e.target.classList.add('is-revealed');
            io!.unobserve(e.target);
          }
        },
        { threshold: 0.12, rootMargin: '0px 0px -6% 0px' },
      );
      root.querySelectorAll('[data-reveal]').forEach((el) => io!.observe(el));
    }

    const hero = root.querySelector<HTMLElement>('[data-sec="hero"]');
    const track = root.querySelector<HTMLElement>('[data-track="exp"]');
    let raf = 0;
    const update = () => {
      raf = 0;
      const vh = window.innerHeight;
      if (hero) {
        const r = hero.getBoundingClientRect();
        root.style.setProperty('--hp', motion ? clamp(-r.top / Math.max(r.height, 1)).toFixed(4) : '0');
      }
      if (track) {
        const r = track.getBoundingClientRect();
        root.style.setProperty('--xp', clamp((vh * 0.6 - r.top) / Math.max(r.height, 1)).toFixed(4));
      }
      const se = document.scrollingElement ?? document.documentElement;
      const max = se.scrollHeight - se.clientHeight;
      root.style.setProperty('--sp', max > 0 ? clamp(se.scrollTop / max).toFixed(4) : '0');
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);

    return () => {
      io?.disconnect();
      root.classList.remove('motion');
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [rootRef]);
}
