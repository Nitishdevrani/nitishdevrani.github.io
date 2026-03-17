import React, { useState } from 'react';
import { AnimatedText } from './components/AnimatedText';
import { ProjectCard } from './components/ProjectCard';
import { ProjectDetails } from './components/ProjectDetails';
import { ContactSection } from './components/ContactSection';
import BackgroundPaperShadersDemo from './components/ui/background-paper-shaders-demo';
import { TimelineDemo } from './components/ui/timeline-demo';
import projectsData from './data/projects.json';
import publicationsData from './data/publications.json';
import './projects.css';

type ProjectCategory = 'web_development' | 'ai' | '3d_designing';

type Project = {
  id: string;
  title: string;
  skill: string;
  language: string;
  objective: string;
  imagePath: string;
  type: string;
  category?: ProjectCategory;
};

const projectSectionConfig: Array<{ key: ProjectCategory; title: string }> = [
  { key: 'web_development', title: 'Web Development' },
  { key: 'ai', title: 'AI' },
  { key: '3d_designing', title: '3D Designing' },
];
// Native window scroll tracker
const ScrollTracker = () => {
  React.useEffect(() => {
    let ticking = false;
    let scrollTimeout: number;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollTop = window.scrollY || document.documentElement.scrollTop;
          const docHeight = document.documentElement.scrollHeight - window.innerHeight;
          const fraction = docHeight > 0 ? scrollTop / docHeight : 0;

          const topPercent = 15 + fraction * 75;
          const isBus = fraction >= 0.4;

          const carEl = document.getElementById('tracking-car-sprite');
          if (carEl) {
            carEl.style.top = `${topPercent}%`;
            carEl.classList.add('is-driving');

            if (isBus) {
              carEl.classList.add('vehicle-bus');
            } else {
              carEl.classList.remove('vehicle-bus');
            }
          }
          ticking = false;
        });
        ticking = true;
      }

      // Detect when scrolling stops
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        const carEl = document.getElementById('tracking-car-sprite');
        if (carEl) carEl.classList.remove('is-driving');
      }, 100);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Trigger initial calculation
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(scrollTimeout);
    };
  }, []);

  return null;
};

// 2D Scroll Tracking Car Overlay using synced DOM state
const ScrollTrackingCar = () => {
  return (
    <div className="road-container">
      <div className="road-line" />
      <div id="tracking-car-sprite" className="vehicle-sprite">
        <div className="smoke-layer">
          <div className="smoke-particle pt-1" />
          <div className="smoke-particle pt-2" />
          <div className="smoke-particle pt-3" />
        </div>
      </div>
    </div>
  );
};

// Content layer
const ContentLayer = ({ onSelectProject }: { onSelectProject: (id: string) => void }) => {
  const projects = projectsData as Project[];

  const projectsByCategory = projectSectionConfig.map((section) => ({
    ...section,
    items: projects.filter((project) => project.category === section.key),
  }));

  return (
    <div style={{ width: '100vw' }}>
      {/* Hero Section */}
      <section className="section-container" style={{ position: 'relative', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
          backgroundImage: 'url(/images/cover.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.15,
          zIndex: -1
        }} />
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          <img
            src="/images/vertical-me.jpg"
            alt="Nitish Devrani"
            style={{
              width: '150px',
              height: '150px',
              borderRadius: '50%',
              objectFit: 'cover',
              border: '3px solid var(--accent-color)',
              marginBottom: '2rem'
            }}
          />
          <AnimatedText tagName="h1" className="text-gradient">Nitish Devrani</AnimatedText>
          <AnimatedText tagName="h2" delay={200}>Full Stack Developer</AnimatedText>
          <AnimatedText tagName="p" className="hero-p" style={{ maxWidth: '600px', margin: '0 auto' }} delay={400}>
            7 years of expertise in building responsive, accessible, and high-performance web applications using React, TypeScript, and modern web technologies.
          </AnimatedText>
        </div>
      </section>

      {/* Experience Section */}
      <section className="section-container">
        <TimelineDemo onSelectProject={onSelectProject} />
      </section>

      {/* Education & Skills Section */}
      <section className="section-container">
        <h2>Education & Skills</h2>
        <div className="grid-cols-2">
          <div className="glass-card">
            <h3>Education</h3>
            <div style={{ marginTop: '1rem' }}>
              <a
                href="https://www.linkedin.com/school/technische-universit%C3%A4t-n%C3%BCrnberg/"
                target="_blank"
                rel="noopener noreferrer"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.65rem' }}
              >
                <img
                  src="/images/logos/technische_universitt_nrnberg_logo.jpeg"
                  alt="UTN logo"
                  style={{ width: '58px', height: '58px', borderRadius: '50%', objectFit: 'contain', background: 'rgba(255,255,255,0.06)', padding: '6px' }}
                />
                <h4 style={{ color: 'var(--accent-color)', margin: 0 }}>M.Sc - Master’s in AI & Robotics</h4>
              </a>
              <p>University of Technology Nuremberg, Germany (2024 – 2026)</p>
            </div>
            <div style={{ marginTop: '1rem' }}>
              <a
                href="https://www.linkedin.com/school/shaheed-bhagat-singh-college-of-education-kalanwali/"
                target="_blank"
                rel="noopener noreferrer"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.65rem' }}
              >
                <img
                  src="/images/logos/gurugram-university.jpeg"
                  alt="Gurugram University logo"
                  style={{ width: '58px', height: '58px', borderRadius: '50%', objectFit: 'contain', background: 'rgba(255,255,255,0.06)', padding: '6px' }}
                />
                <h4 style={{ color: 'var(--accent-color)', margin: 0 }}>MCA - Master’s in Computer Application</h4>
              </a>
              <p>Gurugram University, India (2020 – 2022)</p>
            </div>
            <div style={{ marginTop: '1rem' }}>
              <a
                href="https://www.linkedin.com/school/md-college-dausa/"
                target="_blank"
                rel="noopener noreferrer"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.65rem' }}
              >
                <img
                  src="/images/logos/mdu.jpeg"
                  alt="MDU logo"
                  style={{ width: '58px', height: '58px', borderRadius: '50%', objectFit: 'contain', background: 'rgba(255,255,255,0.06)', padding: '6px' }}
                />
                <h4 style={{ color: 'var(--accent-color)', margin: 0 }}>BCA - Bachelor’s in Computer Application</h4>
              </a>
              <p>Maharishi Dayanand University, India (2017 – 2020)</p>
            </div>
          </div>
          <div className="glass-card">
            <h3>Skills & Certifications</h3>
            <div style={{ marginTop: '1rem' }}>
              <span className="badge">Next.js</span>
              <span className="badge">React.js</span>
              <span className="badge">TypeScript</span>
              <span className="badge">Redux</span>
              <span className="badge">Node.js</span>
              <span className="badge">MySQL</span>
              <span className="badge">MongoDB</span>
              <span className="badge">Javascript</span>
              <span className="badge">HTML</span>
              <span className="badge">CSS</span>
              <span className="badge">Python</span>
              <span className="badge">Figma</span>
              <span className="badge">Prompting</span>
              <span className="badge">Docker</span>
              <span className="badge">Php</span>
              <span className="badge">Wordpress</span>
              <span className="badge">Drupal</span>
              <span className="badge">Machine Learning</span>
              <span className="badge">Deep Learning</span>
              <span className="badge">Data Engineering</span>
              <span className="badge">Model finetuning</span>
              <span className="badge" style={{ borderColor: 'var(--accent-secondary)' }}>3D Modeling / Printing</span>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section className="section-container">
        <h2>Projects</h2>
        {projectsByCategory.map((section) => (
          <div key={section.key} className="project-subsection">
            <h3 className="project-subsection-title">{section.title}</h3>
            <div className="projects-grid">
              {section.items.map((proj) => (
                <ProjectCard
                  key={proj.id}
                  project={proj}
                  onClick={onSelectProject}
                />
              ))}
            </div>
          </div>
        ))}
      </section>

      {/* Publications Section */}
      <section className="section-container">
        <h2>Publications & Research</h2>
        <div className="publication-grid">
          {publicationsData.map((pub) => (
            <div key={pub.id} className="publication-card">
              <img src={pub.coverPath} alt={pub.title} className="pub-thumb" />
              <div className="pub-info">
                <span className="pub-topic">{pub.topic}</span>
                <h3 className="pub-title">{pub.title}</h3>
                <a href={pub.pdfPath} target="_blank" rel="noopener noreferrer" className="read-btn">
                  Read Publication →
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Volunteering & Hobbies */}
      <section className="section-container">
        <h2>Hobbies & Volunteering</h2>
        <div className="grid-cols-2">
          <div className="glass-card" style={{ display: 'flex', gap: '2rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <img
              src="/images/merathon-medal-me.jpg"
              alt="Marathon Medal"
              style={{ width: '250px', borderRadius: '12px', objectFit: 'cover' }}
            />
            <div style={{ flex: 1, minWidth: '280px' }}>
              <h3>Marathon Running</h3>
              <p style={{ marginTop: '1rem' }}>
                Passionate about pushing limits physically and mentally. Participating in marathons helps build endurance, mirroring the dedication required in software engineering. Let us keep moving forward.
              </p>
            </div>
          </div>

          <div className="glass-card" style={{ display: 'flex', gap: '2rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <img
              src="/images/ngo.gif"
              alt="NGO volunteering with rural school children"
              style={{ width: '280px', maxWidth: '100%', borderRadius: '12px', objectFit: 'cover' }}
            />
            <div style={{ flex: 1, minWidth: '280px' }}>
              <h3>Rural Education Volunteering</h3>
              <p style={{ marginTop: '1rem' }}>
                Worked with an NGO to help rural school children evaluate their education level and improve learning outcomes by sharing structured evaluation data with government bodies.
              </p>
              <p style={{ marginTop: '0.75rem' }}>
                During this journey, I traveled to remote areas, stayed with students for days, and built trust as a friend and tutor. Along with assessments, I helped children overcome stage fear and organized group fun sessions like singing and dancing so they could enjoy their childhood while learning.
              </p>
              <p style={{ marginTop: '0.75rem' }}>
                I contributed to this NGO initiative for several months each year over 3 years.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <ContactSection />
    </div>
  );
}

function App() {
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const lastScrollPositionRef = React.useRef(0);

  const selectedProjectView = projectsData.find(p => p.id === selectedProjectId);

  // Handle opening a project: scroll to top, lock body, push history
  const openProject = React.useCallback((id: string) => {
    lastScrollPositionRef.current = window.scrollY || document.documentElement.scrollTop || 0;
    setSelectedProjectId(id);
    window.scrollTo(0, 0);
    document.body.style.overflow = 'hidden';
    window.history.pushState({ projectId: id }, '', `#project-${id}`);
  }, []);

  // Handle closing a project: unlock body scroll
  const closeProject = React.useCallback(() => {
    setSelectedProjectId(null);
    document.body.style.overflow = '';
    window.requestAnimationFrame(() => {
      window.scrollTo(0, lastScrollPositionRef.current);
    });
  }, []);

  // Listen for browser back button
  React.useEffect(() => {
    const handlePopState = () => {
      setSelectedProjectId(null);
      document.body.style.overflow = '';
      window.requestAnimationFrame(() => {
        window.scrollTo(0, lastScrollPositionRef.current);
      });
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  return (
    <div style={{ position: 'relative', width: '100vw', backgroundColor: 'var(--bg-color)', overflowX: 'hidden' }}>

      {/* Native window scroll tracker mapping to absolute DOM elements */}
      <ScrollTracker />

      {/* 2D Scroll Tracking Car Overlay */}
      <ScrollTrackingCar />

      {/* Fixed shader background layer */}
      <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 0, pointerEvents: 'none' }}>
        <BackgroundPaperShadersDemo />
      </div>

      {/* Normal DOM Content flow (restoring native scroll) */}
      <div className="scroll-container" style={{ position: 'relative', zIndex: 2 }}>
        <ContentLayer onSelectProject={openProject} />
      </div>

      {/* Project Details Overlay */}
      <div className={`page-transition-wrapper ${selectedProjectId ? 'active' : ''}`}>
        <ProjectDetails
          project={selectedProjectView}
          isActive={!!selectedProjectId}
          onBack={closeProject}
        />
      </div>
    </div>
  );
}

export default App;
