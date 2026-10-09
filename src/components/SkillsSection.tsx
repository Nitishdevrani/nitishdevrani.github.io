import { FocusCity } from './ui/focus-city';
import contributions from '../data/github-contributions.json';
import { useState, type CSSProperties } from 'react';
import type { IconType } from 'react-icons';
import { MdManageAccounts } from 'react-icons/md';
import { RiOpenaiFill } from 'react-icons/ri';
import { SiReact, SiNestjs, SiNextdotjs, SiTypescript, SiJavascript, SiNodedotjs, SiRedux, SiHtml5, SiCss, SiDocker, SiPython, SiScikitlearn, SiClaude, SiAutocad, SiFigma } from 'react-icons/si';
import { Bot, Cable, Layers, Search, MousePointer2, PenTool, Sparkles, BrainCircuit, Code2, Database, Megaphone, MessageCircle, Mic, Palette, Presentation, Users, Workflow, type LucideIcon } from 'lucide-react';

type Skill = { name: string; mark?: string; icon?: LucideIcon; brandIcon?: IconType; color: string };
type SkillGroup = { id: string; title: string; description: string; accent: string; icon: LucideIcon; years: number; context: string; skills: Skill[] };

// Years describe the category as a whole, not every individual tool or language.
function yearsSince(year: number, month: number) {
  const now = new Date();
  return Math.max(0, ((now.getFullYear() - year) * 12 + now.getMonth() - month) / 12);
}

function experienceLabel(years: number) {
  const months = Math.round(years * 12);
  const remainder = months % 12;
  return `${Math.floor(months / 12)} years${remainder ? ` ${remainder} months` : ''}`;
}

const groups: SkillGroup[] = [
  { id: 'design', title: 'Designing', description: 'From designing on paper to digital interfaces.', accent: '#39d5bd', icon: Palette, years: 4, context: 'Interfaces & experiences', skills: [
    { name: 'UI design', icon: Palette, color: '#ba98ef' },
    { name: 'Responsive design', mark: 'UI', color: '#63caba' },
    { name: 'UX design', icon: MousePointer2, color: '#81aaff' },
    { name: 'AutoCAD / 3D', brandIcon: SiAutocad, color: '#efae70' },
    { name: 'Canva', mark: 'C', color: '#63d5dc' },
    { name: 'Stitch', icon: Sparkles, color: '#a6b8ff' },
    { name: 'pen.dev', icon: PenTool, color: '#e58ca5' },
    { name: 'Figma', brandIcon: SiFigma, color: '#c0a0ff' },
  ] },
  { id: 'development', title: 'Development', description: 'From localhost to Millions of Users online.', accent: '#f2bb5b', icon: Code2, years: yearsSince(2020, 0), context: 'Building professionally since 2020', skills: [
    { name: 'React', brandIcon: SiReact, color: '#61dafb' }, { name: 'Nest.js', brandIcon: SiNestjs, color: '#ec5674' }, { name: 'Next.js', brandIcon: SiNextdotjs, color: '#f5f5f5' }, { name: 'TypeScript', brandIcon: SiTypescript, color: '#71aaff' }, { name: 'JavaScript', brandIcon: SiJavascript, color: '#f7df1e' }, { name: 'Node.js', brandIcon: SiNodedotjs, color: '#87c976' }, { name: 'Redux', brandIcon: SiRedux, color: '#b399e9' }, { name: 'HTML5', brandIcon: SiHtml5, color: '#ef8e68' }, { name: 'CSS3', brandIcon: SiCss, color: '#7aabf7' }, { name: 'Docker', brandIcon: SiDocker, color: '#68bdef' }, { name: 'Python', brandIcon: SiPython, color: '#f0cb66' },

  ] },
  { id: 'ai', title: 'AI', description: 'From using AI to making my own.', accent: '#ef8b78', icon: BrainCircuit, years: yearsSince(2024, 9), context: 'AI & robotics · UTN', skills: [
    { name: 'scikit-learn', brandIcon: SiScikitlearn, color: '#f5ad65' },
    { name: 'LLM', mark: 'LLM', color: '#b8a0ef' },
    { name: 'VLM', mark: 'VLM', color: '#e1a0d9' },
    { name: 'Claude', brandIcon: SiClaude, color: '#dca58c' },
    { name: 'ChatGPT', brandIcon: RiOpenaiFill, color: '#8bd4b8' },
    { name: 'Prompt engineering', icon: MessageCircle, color: '#e1a0d9' },
    { name: 'Machine learning', icon: BrainCircuit, color: '#a5a0f1' },
    { name: 'Deep learning', icon: Workflow, color: '#ed9a81' },
    { name: 'LoRA fine-tuning', mark: 'LR', color: '#85ccad' },
    { name: 'Data engineering', icon: Database, color: '#88b6ed' },
    { name: 'Data augmentation', icon: Layers, color: '#8bd4b8' },
    { name: 'RAG', icon: Search, color: '#f0cb66' },
    { name: 'MCP', icon: Cable, color: '#b8a0ef' },
    { name: 'Custom Chatbot', icon: Bot, color: '#e1a0d9' },
  ] },
  { id: 'communication', title: 'Communication', description: 'From Namaste to global Conferences.', accent: '#69adff', icon: MessageCircle, years: yearsSince(2020, 0), context: 'Teams, clients & communities', skills: [
    { name: 'German · B2', mark: 'DE', color: '#f2c66d' }, { name: 'English · C1', mark: 'EN', color: '#9cbcf5' }, { name: 'Presentation skills', icon: Presentation, color: '#c4a0ee' }, { name: 'Public speaking', icon: Mic, color: '#ea9aab' }, { name: 'Marketing', icon: Megaphone, color: '#ecc074' }, { name: 'Team management', icon: Users, color: '#8acdb9' }, { name: 'Client handling', icon: MessageCircle, color: '#91bbee' }, { name: 'Ownership & accountability', brandIcon: MdManageAccounts, color: '#dda6e5' },
  ] },
];

function Thumbnail({ skill }: { skill: Skill }) {
  const Icon = skill.icon;
  const BrandIcon = skill.brandIcon;
  return <span className="exp-skill-thumb" style={{ '--thumb-color': skill.color } as CSSProperties} aria-hidden="true">{BrandIcon ? <BrandIcon size={18} /> : Icon ? <Icon size={18} strokeWidth={1.8} /> : skill.mark}</span>;
}

function SkillCard({ group }: { group: SkillGroup }) {
  const [expanded, setExpanded] = useState(false);
  return <article className="exp-skill-card" style={{ '--skill-accent': group.accent } as CSSProperties}>
    <div className="exp-skill-content">
      <h3>{group.title}</h3><p className="exp-skill-description">{group.description}</p>
      <div className="exp-skill-experience"><span>Professional experience</span><strong>{experienceLabel(group.years)}</strong></div>
      <div className="exp-skill-track" role="meter" aria-label={`${group.title}: years of professional experience`} aria-valuemin={0} aria-valuemax={10} aria-valuenow={Math.min(group.years, 10)} aria-valuetext={experienceLabel(group.years)}><span style={{ width: `${Math.min(group.years * 10, 100)}%` }} /></div>
      <div className="exp-skill-scale"><span>0 years</span><span>10 years</span></div>
    </div>
    <div className="exp-skill-footer"><div className="exp-skill-stack" aria-label={group.skills.slice(0, 4).map(skill => skill.name).join(', ')}>{group.skills.slice(0, 4).map(skill => <Thumbnail key={skill.name} skill={skill} />)}</div><button type="button" aria-expanded={expanded} aria-controls={`skills-${group.id}`} onClick={() => setExpanded(!expanded)}>{expanded ? 'Close toolkit' : `All ${group.skills.length} skills`}<span aria-hidden="true">{expanded ? '−' : '+'}</span></button></div>
    <ul id={`skills-${group.id}`} className="exp-skill-list" hidden={!expanded}>{group.skills.map(skill => <li key={skill.name}><Thumbnail skill={skill} /><span>{skill.name}</span></li>)}</ul>
  </article>;
}

export function SkillsSection() {
  return <section id="skills" className="exp-skills" aria-labelledby="skills-heading"><div className="exp-section-heading" data-exp-reveal><div><p className="exp-eyebrow">My toolkit</p><h2 id="skills-heading">Skills &<br /><span>Consistency.</span></h2></div><p>Most of these skills I learned before the rise of AI.</p></div><div className="exp-skills-layout"><div className="exp-skills-grid" data-exp-reveal>{groups.map(group => <SkillCard key={group.id} group={group} />)}</div><aside className="exp-contributions" data-exp-reveal><FocusCity days={contributions.days} theme="dark" defaultWeeks={12} description="The activity behind the toolkit." /><a className="exp-contributions-source" href="https://github.com/nitishdevrani" target="_blank" rel="noreferrer">@nitishdevrani on GitHub <span>Snapshot · {contributions.days.at(-1)?.date}</span></a></aside></div></section>;
}
