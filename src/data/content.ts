import projectsData from './projects.json';
import publicationsData from './publications.json';
import experienceData from './experience.json';

export type Meta = { k: string; v: string };

export type Project = {
  id: string;
  title: string;
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
  papers?: string[];
  paperNames?: string[];
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
  docsTitle: string;
  docs: { name: string; src: string }[];
  url?: string;
  urlLabel?: string;
};

const fileName = (path: string) => path.split('/').pop() ?? path;

export const featuredProjects = (projectsData as Project[])
  .filter((p) => p.featured)
  .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

export const publications = publicationsData as Publication[];

export const experience = experienceData as Job[];

const projectDetail = (p: Project): DetailItem => {
  const cover = p.cover ?? p.imagePath;
  const papers = p.papers ?? [];
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
    gallery: (p.galleryImages ?? []).filter((src) => src !== cover),
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
  ],
  stack: [],
  tasks: [],
  gallery: [],
  docsTitle: 'Read the paper',
  docs: [{ name: p.pdfName, src: p.pdfPath }],
});

const projectDetails = featuredProjects.map(projectDetail);
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
