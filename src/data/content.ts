import projectsData from './projects.json';
import publicationsData from './publications.json';
import experienceData from './experience.json';

export type Meta = { k: string; v: string };
export type Subproject = {
  title: string;
  description: string;
  videos: { src: string; caption: string }[];
};

export type Project = {
  id: string;
  title: string;
  category: 'ai' | 'web_development' | '3d_designing';
  updatedAt?: string;
  cardTitle?: string;
  skill: string;
  language: string;
  objective: string;
  description: string;
  imagePath: string;
  cover?: string;
  lead?: string;
  cardTags?: string[];
  cardBlurb?: string;
  meta?: Meta[];
  techStack?: string[];
  tasks?: string[];
  galleryImages?: string[];
  imageStream?: boolean;
  papers?: string[];
  paperNames?: string[];
  models?: string[];
  modelsBasePath?: string;
  subprojects?: Subproject[];
  url?: string;
  urlLabel?: string;
  deprecated?: boolean;
  featured?: boolean;
  order?: number;
};

export type Publication = {
  id: string;
  title: string;
  topic: string;
  pdfPath: string;
  pdfName: string;
  coverPath: string;
  author: string;
  lead: string;
  about: string;
  documents?: { name: string; src: string }[];
  meta?: Meta[];
  tasks?: string[];
};

export type Job = {
  yr: string;
  period: string;
  current?: boolean;
  role: string;
  org: string;
  place: string;
  body: string;
  tags: string[];
};

/** Unified shape rendered by the details page for both projects and papers. */
export type DetailItem = {
  id: string;
  section: 'Project' | 'Research';
  noun: 'project' | 'paper';
  title: string;
  tags: string[];
  lead: string;
  cover: string;
  about: string;
  deprecated: boolean;
  meta: Meta[];
  stack: string[];
  tasks: string[];
  gallery: string[];
  imageStream?: boolean;
  subprojects: Subproject[];
  models: { name: string; src: string; fileName: string }[];
  docsTitle: string;
  docs: { name: string; src: string }[];
  url?: string;
  urlLabel?: string;
};

const fileName = (path: string) => path.split('/').pop() ?? path;

export const projectDomains = ['AI', 'Software Development', 'Designing'] as const;
export type ProjectDomain = typeof projectDomains[number];
export const projectDomain = (project: Project): ProjectDomain => ({
  ai: 'AI', web_development: 'Software Development', '3d_designing': 'Designing',
} as const)[project.category];

// Dated projects sort newest first; existing editorial order is the fallback.
export const projects = [...projectsData as Project[]].sort((a, b) =>
  (Date.parse(b.updatedAt ?? '') || 0) - (Date.parse(a.updatedAt ?? '') || 0)
  || (a.order ?? Number.MAX_SAFE_INTEGER) - (b.order ?? Number.MAX_SAFE_INTEGER));
export const latestProjects = projectDomains.flatMap(domain => {
  const project = projects.find(item => projectDomain(item) === domain);
  return project ? [project] : [];
});
export function projectPageUrl(id?: string) {
  const params = new URLSearchParams(window.location.search);
  params.delete('view');
  params.set('page', 'projects');
  if (id) params.set('project', id);
  else params.delete('project');
  return `${window.location.pathname}?${params}`;
}

export const publications = publicationsData as Publication[];

export const experience = experienceData as Job[];

const projectDetail = (p: Project): DetailItem => {
  const cover = p.cover ?? p.imagePath;
  const papers = p.papers ?? [];
  const modelProjects = p.id === '3d_models'
    ? [p, ...projects.filter(project => project.id !== p.id && project.modelsBasePath)]
    : [p];
  return {
    id: p.id,
    section: 'Project',
    noun: 'project',
    title: p.title,
    tags: [p.skill, p.language],
    lead: p.lead ?? p.objective,
    cover,
    about: p.description,
    deprecated: !!p.deprecated,
    meta: p.meta ?? [],
    stack: p.techStack ?? [],
    tasks: p.tasks ?? [],
    gallery: (p.galleryImages ?? []).filter((src) => p.imageStream || src !== cover),
    imageStream: p.imageStream,
    subprojects: p.subprojects ?? [],
    models: modelProjects.flatMap(project => project.modelsBasePath ? (project.models ?? []).map(name => ({
      name: `${project.id !== p.id ? `${project.title} · ` : ''}${name.replace(/\.stl$/i, '').replace(/-/g, ' ')}`,
      fileName: name,
      src: `${project.modelsBasePath}/${encodeURIComponent(name)}`,
    })) : []),
    docsTitle: 'Related documents',
    docs: papers.map((src, i) => ({ name: p.paperNames?.[i] ?? fileName(src), src })),
    url: p.url,
    urlLabel: p.urlLabel ?? 'Visit project',
  };
};

const paperDetail = (p: Publication): DetailItem => ({
  id: p.id,
  section: 'Research',
  noun: 'paper',
  title: p.title,
  tags: [p.topic],
  lead: p.lead,
  cover: p.coverPath,
  about: p.about,
  deprecated: false,
  meta: [
    { k: 'Topic', v: p.topic },
    { k: 'Author', v: p.author },
    ...(p.meta ?? []),
  ],
  stack: [],
  tasks: p.tasks ?? [],
  gallery: [],
  subprojects: [],
  models: [],
  docsTitle: p.documents ? 'Paper and presentation' : 'Read the paper',
  docs: p.documents ?? [{ name: p.pdfName, src: p.pdfPath }],
});

const projectDetails = projects.map(projectDetail);
const paperDetails = publications.map(paperDetail);

export const detailItems: Record<string, DetailItem> = Object.fromEntries(
  [...projectDetails, ...paperDetails].map((d) => [d.id, d]),
);

/** The item after `id` within its own group (projects or papers), wrapping around. */
export const nextDetail = (id: string): DetailItem => {
  const group = detailItems[id].section === 'Project' ? projectDetails : paperDetails;
  const i = group.findIndex((d) => d.id === id);
  return group[(i + 1) % group.length];
};
