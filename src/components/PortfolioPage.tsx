import { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowUpRight, Github, Linkedin } from 'lucide-react';
import { detailItems, experience, publications } from '../data/content';
import { portfolioCommunity, education } from '../data/profile';
import { VideoSection, GlassPanel } from './VideoSection';
import { DetailDialog } from './DetailDialog';
import { ProjectCollection } from './ProjectCollection';
import { SkillsSection } from './SkillsSection';
import './portfolio.css';

function readDetail() {
  try {
    const id = decodeURIComponent(window.location.hash.replace(/^#project-/, ''));
    return window.location.hash.startsWith('#project-') && detailItems[id] ? id : null;
  } catch { return null; }
}

export default function PortfolioPage() {
  const root = useRef<HTMLDivElement>(null);
  const [openId, setOpenId] = useState(readDetail);
  const close = useCallback(() => {
    if (window.history.state?.portfolioDetail) window.history.back();
    else {
      window.history.replaceState(null, '', window.location.pathname + window.location.search);
      setOpenId(null);
    }
  }, []);
  const open = (id: string) => {
    window.history.pushState({ portfolioDetail: true }, '', `#project-${id}`);
    setOpenId(id);
  };
  const next = (id: string) => {
    window.history.replaceState(window.history.state, '', `#project-${id}`);
    setOpenId(id);
  };
  useEffect(() => {
    const sync = () => setOpenId(readDetail());
    window.addEventListener('popstate', sync);
    window.addEventListener('hashchange', sync);
    const oldTitle = document.title;
    document.title = 'Nitish Devrani';
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('exp-visible');
        observer.unobserve(entry.target);
      }
    }), { threshold: 0.08 });
    root.current?.querySelectorAll('[data-exp-reveal]').forEach(el => observer.observe(el));
    return () => {
      document.title = oldTitle;
      observer.disconnect();
      window.removeEventListener('popstate', sync);
      window.removeEventListener('hashchange', sync);
    };
  }, []);

  return (
    <div className="portfolio" ref={root}>
      <a className="exp-skip" href="#work">Skip to work</a>
      <header className="exp-nav">
        <a href="#top" className="exp-brand" aria-label="Nitish Devrani, back to top">nd<span>.</span></a>
        <nav aria-label="Portfolio"><a href="#work">Work</a><a href="#education">Education</a><a href="#contact">Let’s talk <ArrowUpRight size={14} /></a></nav>
      </header>
      <main>
        <VideoSection id="top" asset="Hi" label="A little introduction" hero suspended={!!openId}>
          <GlassPanel className="exp-intro">
            <h1>Nitish<br />Devrani<span>.</span></h1>
            <p className="exp-tagline">Full Stack Developer + <br />AI Researcher</p>
            <p className="exp-copy">Full-stack developer shipping React and Next.js products since 2020 — for Petco, Adani and Babyflix. Now in Nuremberg, working on vision-language models.</p>
            <div className="exp-actions"><a className="exp-button" href="#projects">Explore my work <ArrowUpRight size={18} /></a><a className="exp-text-link" href="#contact">Contact me <ArrowUpRight size={16} /></a></div>
            <p className="exp-location">M.Sc. AI & Robotics · UTN Nuremberg</p>
          </GlassPanel>
        </VideoSection>
        <SkillsSection />
        <VideoSection id="work" asset="Working" label="At work" suspended={!!openId}>
          <GlassPanel>
            <h2>Experience<br /><span>Gained in Years.</span></h2>
            <p className="exp-copy">I started my journey in 2020 in India. Worked for International Clients, teams, different timezones, followed scrum, Agile methodologies, and now I'm working on cutting-edge AI research.</p>
            <div className="exp-jobs">{experience.map((job, index) => {
              const followsSameCompany = experience[index - 1]?.org === job.org;
              const precedesSameCompany = experience[index + 1]?.org === job.org;
              const timelineClass = followsSameCompany || precedesSameCompany ? ' exp-job-connected' : '';
              return <article key={job.period} className={`${timelineClass}${precedesSameCompany ? ' exp-job-connect-next' : ''}${followsSameCompany ? ' exp-job-connect-previous' : ''}`.trim() || undefined}>
              <p className="exp-eyebrow">{job.period}{job.current && ' · Currently'}</p><h3>{job.role}</h3><p className="exp-org">{job.org} <span> / {job.place}</span></p><p>{job.body}</p><div className="exp-tags">{job.tags.map(tag => <span key={tag}>{tag}</span>)}</div>
            </article>;
            })}</div>
          </GlassPanel>
        </VideoSection>
        <section id="projects" className="exp-section">
          <div className="exp-section-heading" data-exp-reveal><div><h2>Projects<span>.</span></h2></div><p>From self learning to<br />Award winning Projects.</p></div>
          <ProjectCollection />
        </section>
        <VideoSection id="education" asset="reading" label="03 / Still learning" suspended={!!openId}>
          <GlassPanel><h2>Education<br /><span>Background.</span></h2><p className="exp-copy">From how to use MS Powerpoint to developing own AI agent. All came from learning.</p><div className="exp-jobs">{education.map(step => <article key={step.badge}><p className="exp-eyebrow">{step.dates} / {step.badge}</p><h3>{step.title}</h3><p>{step.school}</p></article>)}</div></GlassPanel>
        </VideoSection>
        <section id="research" className="exp-section">
          <div className="exp-section-heading" data-exp-reveal><div><h2>Paper & Researches<span>.</span></h2></div></div>
          {publications.map((paper, index) => <a data-exp-reveal className="exp-paper" href={`#project-${paper.id}`} onClick={event => { event.preventDefault(); open(paper.id); }} key={paper.id}><span className="exp-eyebrow">0{index + 1}</span><div><p className="exp-eyebrow">{paper.topic}</p><h3>{paper.title}</h3><p>N. Devrani</p></div><ArrowUpRight size={24} /></a>)}
        </section>
        <section id="community" className="exp-section exp-community">
          <div className="exp-section-heading" data-exp-reveal><div><h2>Hobbies &<br /><span>Volunteerings.</span></h2></div><p>From going too far to teach unprivillaged childs <br /> to long-distance running. These things kept me honest.</p></div>
          <div className="exp-community-grid">{portfolioCommunity.map(item => <article data-exp-reveal key={item.title}><img src={item.image} alt={item.alt} loading="lazy" /><p className="exp-eyebrow">{item.label}</p><h3>{item.title}</h3><p>{item.body}</p></article>)}</div>
        </section>
        <VideoSection id="contact" asset="Contact" label="Contact me" layout="contact" suspended={!!openId}>
          <div className="exp-contact-copy" data-exp-reveal><h2>Let's connect<br />and build something <span>together.</span></h2><p>You can reach out to me at any time.</p><a className="exp-email" href="mailto:nitishdevrani@gmail.com">nitishdevrani@gmail.com <ArrowUpRight size={22} /></a><div className="exp-socials"><a href="https://github.com/Nitishdevrani" target="_blank" rel="noreferrer"><Github size={18} /> GitHub</a><a href="https://www.linkedin.com/in/nitishdevrani/" target="_blank" rel="noreferrer"><Linkedin size={18} /> LinkedIn</a></div></div>
        </VideoSection>
      </main>
      <footer className="exp-footer"><span>© 2026 Nitish Devrani · Nuremberg</span><a href="#top">Back to top ↑</a></footer>
      {openId && <DetailDialog id={openId} onClose={close} onNext={next} />}
    </div>
  );
}
