import { useEffect, useRef } from 'react';
import { ArrowLeft, ArrowUpRight, ArrowRight } from 'lucide-react';
import { ModelViewer } from './ModelViewer';
import { detailItems, nextDetail } from '../data/content';

export function DetailDialog({ id, onClose, onNext, standalone = false }: { id: string; onClose: () => void; onNext: (id: string) => void; standalone?: boolean }) {
  const ref = useRef<HTMLDialogElement>(null);
  const item = detailItems[id];
  useEffect(() => {
    if (standalone) return;
    const dialog = ref.current!;
    const previous = document.activeElement as HTMLElement | null;
    const overflow = document.body.style.overflow;
    dialog.showModal();
    document.body.style.overflow = 'hidden';
    return () => {
      dialog.close();
      document.body.style.overflow = overflow;
      previous?.focus({ preventScroll: true });
    };
  }, [standalone]);
  useEffect(() => { ref.current?.scrollTo(0, 0); }, [id]);
  return (
    <dialog open={standalone || undefined} className={`exp-dialog${standalone ? ' exp-detail-page' : ''}`} ref={ref} role={standalone ? 'article' : undefined} aria-labelledby="exp-detail-title" onKeyDown={event => {
      if (standalone || event.key !== 'Tab') return;
      const targets = Array.from(ref.current!.querySelectorAll<HTMLElement>('button:not(:disabled), select, iframe, a[href], [tabindex="0"]'));
      const first = targets[0];
      const last = targets[targets.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
    }} onCancel={(event) => { event.preventDefault(); onClose(); }}>
      <div className="exp-detail-nav">
        <button autoFocus type="button" onClick={onClose}><ArrowLeft size={18} /> {standalone ? 'All projects' : 'Back to portfolio'}</button>
        <span>{item.section}</span>
        <button type="button" onClick={() => onNext(nextDetail(id).id)}>Next <ArrowRight size={18} /></button>
      </div>
      <article className="exp-detail-body">
        <p className="exp-eyebrow">{item.tags.join(' / ')}</p>
        <h1 id="exp-detail-title">{item.title}</h1>
        <p className="exp-detail-lead">{item.lead}</p>
        <img className="exp-detail-cover" src={item.cover} alt={item.title} />
        <h2>About this {item.noun}</h2><p>{item.about}</p>
        {item.deprecated && <p>This project is now deprecated.</p>}
        {!!item.meta.length && <dl>{item.meta.map(({ k, v }) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}</dl>}
        {!!item.stack.length && <><h2>Tech stack</h2><p>{item.stack.join(' · ')}</p></>}
        {!!item.tasks.length && <><h2>Key contributions</h2><ul>{item.tasks.map(task => <li key={task}>{task}</li>)}</ul></>}
        {!!item.gallery.length && <><h2>Gallery</h2><div className={`exp-detail-gallery${id === 'ai_agent' ? ' exp-detail-gallery-compact' : ''}`}>{item.gallery.map(src => <a href={src} target="_blank" rel="noreferrer" key={src}><img src={src} alt={`${item.title} gallery image`} loading="lazy" /></a>)}</div></>}
        {!!item.subprojects.length && <><h2 className="exp-subprojects-heading">Subprojects</h2>{item.subprojects.map(project => (
          <section className="exp-subproject" key={project.title} aria-label={project.title}>
            <h3>{project.title}</h3>
            <p>{project.description}</p>
            <div className={`exp-detail-gallery${project.videos.length === 4 ? ' exp-subproject-gallery-four' : project.videos.length === 3 ? ' exp-subproject-gallery-three' : ''}`}>
              {project.videos.map(video => (
                <figure key={video.src}>
                  <video autoPlay muted loop playsInline preload="metadata" aria-label={`${project.title}: ${video.caption}`}>
                    <source src={video.src} type="video/mp4" />
                  </video>
                  <figcaption>{video.caption}</figcaption>
                </figure>
              ))}
            </div>
          </section>
        ))}</>}
        {!!item.models.length && <ModelViewer key={id} models={item.models} />}
        {!!item.docs.length && <><h2>{item.docsTitle}</h2><div className="pdf-previews">{item.docs.map(doc => (
          <section className="pdf-preview" key={doc.src} aria-label={doc.name}>
            <div className="pdf-preview-heading">
              <h3>{doc.name}</h3>
              <a href={doc.src} target="_blank" rel="noreferrer" aria-label={`Open ${doc.name} in a new tab`}>Open PDF <ArrowUpRight size={18} aria-hidden="true" /></a>
            </div>
            <iframe className="pdf-preview-frame" src={`${encodeURI(doc.src)}#view=FitH`} title={`PDF preview: ${doc.name}`} loading="lazy" />
            <p className="pdf-preview-help">If the preview is unavailable, use Open PDF to read the document.</p>
          </section>
        ))}</div></>}
        {item.url && <a className="exp-button" href={item.url} target="_blank" rel="noreferrer">{item.urlLabel}<ArrowUpRight size={18} /></a>}
      </article>
    </dialog>
  );
}
