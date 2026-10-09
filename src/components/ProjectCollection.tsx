import { useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { ImageStreamHero } from './ui/image-stream-hero';
import { latestProjects, projects, projectDomains, projectDomain, projectPageUrl, type ProjectDomain } from '../data/content';

export function ProjectCollection({ archive = false }: { archive?: boolean }) {
  const [filter, setFilter] = useState<ProjectDomain | 'all'>('all');
  const visible = filter === 'all' ? (archive ? projects : latestProjects) : projects.filter(project => projectDomain(project) === filter);
  return <>
    <div className="exp-project-filters" role="group" aria-label="Filter projects by domain">
      {(['all', ...projectDomains] as const).map(domain => <button key={domain} type="button" aria-pressed={filter === domain} onClick={() => setFilter(domain)}>{domain === 'all' ? (archive ? 'All projects' : 'Latest in each') : domain}</button>)}
    </div>
    <p className="exp-project-count" role="status">{visible.length} {visible.length === 1 ? 'project' : 'projects'}{!archive && filter === 'all' ? ' · One from each domain' : ''}</p>
    <div className="exp-projects">{visible.map((project, index) => project.imageStream ? <article className="exp-project exp-car-project" key={project.id}>
      <ImageStreamHero images={(project.galleryImages ?? []).map(src => ({ src }))} cards={Math.max(9, project.galleryImages?.length ?? 0)} speed={24}>
        <div className="image-stream-heading"><p className="exp-eyebrow">Designing / Hand-drawn studies</p><h3>{project.title}</h3></div>
      </ImageStreamHero>
      <a className="exp-text-link" href={projectPageUrl(project.id)}>Explore all {project.galleryImages?.length} sketches <ArrowUpRight size={16} /></a>
    </article> : <a className="exp-project" href={projectPageUrl(project.id)} key={project.id}>
      <div className="exp-project-image"><img src={project.cover ?? project.imagePath} alt={project.cardTitle ?? project.title} loading="lazy" /><span className="exp-project-arrow"><ArrowUpRight size={24} /></span></div>
      <div className="exp-project-copy"><p className="exp-eyebrow">{String(index + 1).padStart(2, '0')} / {projectDomain(project)}</p><h3>{project.cardTitle ?? project.title}</h3><p>{project.cardBlurb ?? project.objective}</p><span className="exp-text-link">View project <ArrowUpRight size={16} /></span></div>
    </a>)}</div>
    {!archive && <div className="exp-project-footer"><a className="exp-button" href={projectPageUrl()}>View all projects <ArrowUpRight size={18} /></a></div>}
  </>;
}
