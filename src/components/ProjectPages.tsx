import { useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { detailItems, projectPageUrl } from '../data/content';
import { ProjectCollection } from './ProjectCollection';
import { DetailDialog } from './DetailDialog';
import './portfolio.css';

export default function ProjectPages() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get('project');
  const item = id ? detailItems[id] : null;
  params.delete('view');
  params.delete('page');
  params.delete('project');
  const home = `${window.location.pathname}${params.size ? `?${params}` : ''}#projects`;
  useEffect(() => {
    document.title = `${item?.title ?? (id ? 'Project not found' : 'All projects')} — Nitish Devrani`;
  }, [id, item]);
  return <div className="portfolio exp-project-page">
    <header className="exp-archive-nav"><a className="exp-brand" href={home}>nd<span>.</span></a><a href={home}><ArrowLeft size={16} /> Back to portfolio</a></header>
    <main>
      {item?.section === 'Project' && id ? <DetailDialog standalone id={id} onClose={() => window.location.assign(projectPageUrl())} onNext={next => window.location.assign(projectPageUrl(next))} /> : <section className="exp-section">
        <div className="exp-section-heading"><div><p className="exp-eyebrow">The project archive</p><h1>{id ? 'Project not found.' : 'All projects.'}</h1></div><p>AI, software development and designing.</p></div>
        {id && <p>Explore the projects below to find what you’re looking for.</p>}
        <ProjectCollection archive />
      </section>}
    </main>
  </div>;
}
