import { ArrowUpRight } from 'lucide-react';
import { publications } from '../data/content';
import { SectionBreak } from './SectionBreak';
import { iconProps } from './icon';
import { delay } from './reveal';

export function ResearchList({ onOpen }: { onOpen: (id: string) => void }) {
  return (
    <section id="writing" className="section research">
      <div className="wrap">
        <SectionBreak n="04" />
        <h2 data-reveal="up" style={delay(80)} className="section-title">
          On paper
        </h2>
        <div className="papers">
          {publications.map((p, i) => (
            <a
              key={p.id}
              data-reveal="left"
              href={`#project-${p.id}`}
              onClick={(e) => {
                e.preventDefault();
                onOpen(p.id);
              }}
              className="paper-row"
            >
              <span className="paper-num">{String(i + 1).padStart(2, '0')}</span>
              <span className="paper-main">
                <span className="paper-title">{p.title}</span>
                <span className="paper-author">N. Devrani</span>
              </span>
              <span className="pill pill-sage paper-topic">{p.topic}</span>
              <span className="circle-arrow">
                <ArrowUpRight size={20} {...iconProps} />
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
