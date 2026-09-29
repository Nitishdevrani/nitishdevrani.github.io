import { experience } from '../data/content';
import { SectionBreak } from './SectionBreak';
import { delay } from './reveal';

export function ExperienceLadder() {
  return (
    <section id="experience" className="section experience">
      <div className="wrap experience-grid">
        <SectionBreak n="01" />

        <div className="experience-intro">
          <h2 data-reveal="up" style={delay(80)} className="section-title">
            The ladder so far
          </h2>
          <p data-reveal="up" style={delay(160)} className="section-intro">
            Four rungs since 2020 — from leading a streaming team in Gurugram to research support in Nuremberg.
          </p>
        </div>

        <div data-track="exp" className="ladder">
          <div className="ladder-track" aria-hidden>
            <div className="ladder-fill" />
          </div>
          {experience.map((job) => (
            <div key={job.period} data-reveal="up" className="rung">
              <div className="rung-year" aria-hidden>
                {job.yr}
              </div>
              <article className="rung-card">
                <div className="rung-meta">
                  <span className="pill pill-muted">{job.period}</span>
                  {job.current && (
                    <span className="pill pill-sage">
                      <span className="rung-now-dot" />
                      Now
                    </span>
                  )}
                </div>
                <h3 className="rung-role">{job.role}</h3>
                <div className="rung-org">
                  {job.org} · <span className="rung-place">{job.place}</span>
                </div>
                <p className="rung-body">{job.body}</p>
                <div className="pill-row">
                  {job.tags.map((t) => (
                    <span key={t} className="pill pill-outline">
                      {t}
                    </span>
                  ))}
                </div>
              </article>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
