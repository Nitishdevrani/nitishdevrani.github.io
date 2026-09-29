import type { MouseEvent, ReactNode } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { featuredProjects, type Project } from '../data/content';
import { SectionBreak } from './SectionBreak';
import { iconProps } from './icon';
import { delay } from './reveal';

type Open = (id: string) => void;

// Each featured project has its own bento composition; the id picks the layout.
const layouts: Record<string, { cell: 'lg' | 'sm'; card: string; image: 'card' | 'cover' }> = {
  vlm_on_edge: { cell: 'lg', card: 'bento-vlm', image: 'card' },
  ai_agent: { cell: 'sm', card: 'bento-agent', image: 'card' },
  stream_data_pipeline_dashboard: { cell: 'sm', card: 'bento-stream', image: 'cover' },
  petco_website: { cell: 'lg', card: 'bento-petco', image: 'cover' },
};

function CardBody({ id, p }: { id: string; p: Project }) {
  const title = <h3 className="bento-title">{p.cardTitle ?? p.title}</h3>;
  const copy = <p className="bento-copy">{p.cardBlurb}</p>;
  const tags = p.cardTags ?? [];

  switch (id) {
    case 'vlm_on_edge':
      return (
        <div className="bento-body">
          <div className="pill-row">
            {tags.map((t, i) => (
              <span key={t} className={i === 0 ? 'pill pill-accent' : 'pill pill-outline'}>
                {t}
              </span>
            ))}
          </div>
          <div className="bento-foot">
            <div>
              {title}
              {copy}
            </div>
            <span className="bento-arrow">
              <ArrowUpRight size={22} {...iconProps} />
            </span>
          </div>
        </div>
      );
    case 'stream_data_pipeline_dashboard':
      return (
        <>
          <span className="pill">{tags[0]}</span>
          {title}
          {copy}
        </>
      );
    case 'petco_website':
      return (
        <div className="bento-body">
          <span className="pill pill-sage">{tags[0]}</span>
          {title}
          {copy}
          <span className="bento-link">
            View project
            <ArrowUpRight size={18} {...iconProps} />
          </span>
        </div>
      );
    default:
      return (
        <div className="bento-body">
          <span className="pill">{tags[0]}</span>
          {title}
          {copy}
        </div>
      );
  }
}

function BentoCard({ p, index, onOpen }: { p: Project; index: number; onOpen: Open }) {
  const layout = layouts[p.id] ?? layouts.vlm_on_edge;
  const src = layout.image === 'card' ? p.imagePath : (p.cover ?? p.imagePath);
  const media: ReactNode = (
    <div className="bento-media">
      <img className="cover-img washed" src={src} alt="" loading="lazy" />
    </div>
  );
  const mediaLast = p.id === 'stream_data_pipeline_dashboard';
  const handleClick = (e: MouseEvent) => {
    e.preventDefault();
    onOpen(p.id);
  };

  return (
    <div data-reveal="up" style={delay(index % 2 ? 120 : 0)} className={`bento-cell bento-cell-${layout.cell}`}>
      <a href={`#project-${p.id}`} onClick={handleClick} className={`bento-card ${layout.card}`}>
        {!mediaLast && media}
        <CardBody id={p.id} p={p} />
        {mediaLast && media}
      </a>
    </div>
  );
}

export function ProjectBento({ onOpen }: { onOpen: Open }) {
  return (
    <section id="projects" className="section projects">
      <div className="wrap">
        <SectionBreak n="03" />
        <h2 data-reveal="up" style={delay(80)} className="section-title">
          Things I’ve grown
        </h2>
        <div className="bento">
          {featuredProjects.map((p, i) => (
            <BentoCard key={p.id} p={p} index={i} onOpen={onOpen} />
          ))}
        </div>
      </div>
    </section>
  );
}
