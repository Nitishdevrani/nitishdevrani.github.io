import { useEffect, useRef } from 'react';
import { ArrowLeft, ArrowRight, ArrowUpRight } from 'lucide-react';
import { detailItems, nextDetail } from '../data/content';
import { iconProps } from './icon';
import { prefersReducedMotion } from '../hooks/usePageMotion';

type Props = { id: string; onClose: () => void; onNext: (id: string) => void };

export function DetailsPage({ id, onClose, onNext }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const d = detailItems[id];
  const next = nextDetail(id);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.scrollTop = 0;
    el.focus({ preventScroll: true });
    if (!prefersReducedMotion()) {
      el.animate(
        [
          { opacity: 0, transform: 'translateY(40px)' },
          { opacity: 1, transform: 'none' },
        ],
        { duration: 550, easing: 'cubic-bezier(.2,.7,.2,1)' },
      );
    }
  }, [id]);

  return (
    <div ref={ref} className="details" role="dialog" aria-modal="true" aria-label={d.title} tabIndex={-1}>
      <div className="details-orb" />
      <div className="glass-bar-holder">
        <div className="glass-bar details-bar">
          <button type="button" className="details-back" onClick={onClose}>
            <ArrowLeft size={18} {...iconProps} />
            Back to portfolio
          </button>
          <span className="details-section">{d.section}</span>
          <button type="button" className="details-next" onClick={() => onNext(next.id)}>
            Next: {next.title}
            <ArrowRight size={18} {...iconProps} />
          </button>
        </div>
      </div>

      <div className="details-content">
        <div className="pill-row">
          {d.tags.map((t) => (
            <span key={t} className="pill pill-accent">
              {t}
            </span>
          ))}
        </div>
        <h1 className="details-title">{d.title}</h1>
        <p className="details-lead">{d.lead}</p>

        <div className="details-cover washed">
          <img className="cover-img" src={d.cover} alt={d.title} />
        </div>

        <div className="details-cols">
          <div className="details-main">
            <div className="details-block">
              <h2 className="details-h2">About this {d.noun}</h2>
              <p className="details-about">{d.about}</p>
              {d.deprecated && <span className="pill pill-sage">This project is now deprecated</span>}
            </div>

            {d.tasks.length > 0 && (
              <div className="details-block">
                <h2 className="details-h2">Key contributions</h2>
                <div className="tasks">
                  {d.tasks.map((t, i) => (
                    <div key={t} className="task">
                      <span className="task-num">{String(i + 1).padStart(2, '0')}</span>
                      <span className="task-text">{t}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {d.gallery.length > 0 && (
              <div className="details-block">
                <h2 className="details-h2">Gallery</h2>
                <div className="gallery">
                  {d.gallery.map((src) => (
                    <a key={src} href={src} target="_blank" rel="noopener noreferrer" className="gallery-item washed">
                      <img className="cover-img" src={src} alt="" loading="lazy" />
                    </a>
                  ))}
                </div>
              </div>
            )}

            {d.docs.length > 0 && (
              <div className="details-block">
                <h2 className="details-h2">{d.docsTitle}</h2>
                {d.docs.map((doc) => (
                  <div key={doc.src} className="doc">
                    <iframe className="doc-frame" src={doc.src} title={doc.name} loading="lazy" />
                    <div className="doc-foot">
                      <span className="doc-name">{doc.name}</span>
                      <a href={doc.src} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                        Open PDF
                        <ArrowUpRight size={16} {...iconProps} />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <aside className="details-aside">
            <div className="meta-card">
              {d.meta.map((m) => (
                <div key={m.k} className="meta-row">
                  <span className="meta-label">{m.k}</span>
                  <span className="meta-value">{m.v}</span>
                </div>
              ))}
              {d.stack.length > 0 && (
                <div className="meta-row">
                  <span className="meta-label">Tech stack</span>
                  <div className="pill-row">
                    {d.stack.map((s) => (
                      <span key={s} className="pill">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
            {d.url && (
              <a href={d.url} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-block">
                {d.urlLabel}
                <ArrowUpRight size={18} {...iconProps} />
              </a>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
}
