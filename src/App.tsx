import { useCallback, useEffect, useRef, useState } from 'react';
import { NavPill } from './components/NavPill';
import { Hero } from './components/Hero';
import { SkillMarquee } from './components/SkillMarquee';
import { ExperienceLadder } from './components/ExperienceLadder';
import { EducationSteps } from './components/EducationSteps';
import { ProjectBento } from './components/ProjectBento';
import { ResearchList } from './components/ResearchList';
import { Community } from './components/Community';
import { Contact } from './components/Contact';
import { DetailsPage } from './components/DetailsPage';
import { detailItems } from './data/content';
import { usePageMotion } from './hooks/usePageMotion';

const HASH_PREFIX = '#project-';

const idFromHash = () => {
  const { hash } = window.location;
  if (!hash.startsWith(HASH_PREFIX)) return null;
  const id = decodeURIComponent(hash.slice(HASH_PREFIX.length));
  return detailItems[id] ? id : null;
};

function App() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [openId, setOpenId] = useState<string | null>(idFromHash);
  usePageMotion(rootRef);

  // Details state lives in the URL hash, so Back / Esc / the back button all go through history.
  const openItem = useCallback((id: string) => {
    window.history.pushState({ detail: id }, '', `${HASH_PREFIX}${id}`);
    setOpenId(id);
  }, []);

  // "Next" swaps the item in place so Back still returns straight to the portfolio.
  const showNext = useCallback((id: string) => {
    window.history.replaceState(window.history.state, '', `${HASH_PREFIX}${id}`);
    setOpenId(id);
  }, []);

  const closeItem = useCallback(() => {
    if (window.history.state?.detail) {
      window.history.back();
    } else {
      // Landed directly on a details URL: drop the hash without leaving the site.
      window.history.replaceState(null, '', window.location.pathname + window.location.search);
      setOpenId(null);
    }
  }, []);

  useEffect(() => {
    const onPop = () => setOpenId(idFromHash());
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  useEffect(() => {
    if (!openId) return;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeItem();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [openId, closeItem]);

  return (
    <div ref={rootRef} className="page">
      <main inert={openId ? true : undefined}>
        <NavPill />
        <Hero />
        <SkillMarquee />
        <ExperienceLadder />
        <EducationSteps />
        <ProjectBento onOpen={openItem} />
        <ResearchList onOpen={openItem} />
        <Community />
        <Contact />
      </main>
      {openId && <DetailsPage id={openId} onClose={closeItem} onNext={showNext} />}
    </div>
  );
}

export default App;
