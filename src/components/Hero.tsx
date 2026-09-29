import type { MouseEvent } from 'react';
import { ArrowDown, ArrowUpRight, Briefcase } from 'lucide-react';
import { iconProps } from './icon';
import { delay } from './reveal';

const onMove = (e: MouseEvent<HTMLElement>) => {
  const el = e.currentTarget;
  const r = el.getBoundingClientRect();
  el.style.setProperty('--mx', `${e.clientX - r.left}px`);
  el.style.setProperty('--my', `${e.clientY - r.top}px`);
};

export function Hero() {
  return (
    <section id="top" data-sec="hero" className="hero" onMouseMove={onMove}>
      <div className="hero-glow" />
      <div className="hero-orb hero-orb-a" />
      <div className="hero-orb hero-orb-b" />

      <div className="wrap hero-inner">
        <div className="hero-text">
          <div data-reveal="up" className="status-chip">
            <span className="status-dot" />
            M.Sc. AI &amp; Robotics · UTN Nuremberg
          </div>
          <h1 data-reveal="up" style={delay(80)} className="hero-name">
            Nitish
            <br />
            Devrani
          </h1>
          <p data-reveal="up" style={delay(160)} className="hero-tagline">
            from web products to AI at the edge.
          </p>
          <p data-reveal="up" style={delay(240)} className="hero-copy">
            Full-stack developer shipping React and Next.js products since 2020 — for Petco, Adani One and
            Babyflix. Now in Nuremberg, fitting vision-language models onto edge devices.
          </p>
          <div data-reveal="up" style={delay(320)} className="hero-ctas">
            <a href="#projects" className="btn btn-primary btn-lg">
              See selected work
              <ArrowUpRight size={18} {...iconProps} />
            </a>
            {/* TODO: point at the CV file once it exists. */}
            <a href="#contact" className="btn btn-secondary btn-lg">
              Download CV
            </a>
          </div>
        </div>

        <div className="hero-visual">
          <div data-reveal="scale" className="hero-portrait-holder">
            <div className="hero-portrait">
              <img className="cover-img washed" src="/images/portrait-hero.jpg" alt="Nitish Devrani" />
            </div>
          </div>
          <div className="float-chip float-chip-a">Vision-language models</div>
          <div className="float-chip float-chip-b">Next.js</div>
          <div className="float-chip float-chip-c">Edge AI</div>
          <div className="currently">
            <span className="currently-icon">
              <Briefcase size={18} {...iconProps} />
            </span>
            <span className="currently-text">
              <span className="currently-label">Currently</span>
              <span className="currently-value">Hiwi, UTN Nuremberg</span>
            </span>
          </div>
        </div>
      </div>

      <a href="#experience" className="scroll-cue" aria-label="Scroll to experience">
        <ArrowDown size={20} {...iconProps} />
      </a>
    </section>
  );
}
