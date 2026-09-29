import { SectionBreak } from './SectionBreak';
import { delay } from './reveal';

export function Community() {
  return (
    <section id="community" className="community">
      <svg className="wave wave-top" viewBox="0 0 1440 120" preserveAspectRatio="none" aria-hidden>
        <path d="M0 80 C 240 10, 480 10, 720 60 S 1200 120, 1440 40 L 1440 120 L 0 120 Z" />
      </svg>
      <div className="community-band">
        <div className="community-blob" />
        <div className="wrap">
          <SectionBreak n="05" sage />
          <h2 data-reveal="up" style={delay(80)} className="section-title">
            Off the clock, on purpose
          </h2>
          <p data-reveal="up" style={delay(160)} className="section-intro">
            Rural classrooms and long-distance running — the two things that keep me honest.
          </p>

          <div className="community-cards">
            <article data-reveal="up" className="community-card community-card-ngo">
              <div className="community-media">
                <img className="cover-img washed" src="/images/ai/ngo.jpg" alt="Volunteering with rural school children" loading="lazy" />
              </div>
              <div className="community-body">
                <span className="community-label">NGO · 3 years</span>
                <h3 className="community-title">Rural Education Volunteering</h3>
                <p className="community-copy">
                  Assessed learning levels of rural school children and shared the data with government bodies. Stayed
                  with students for days in remote areas — tutoring, easing stage fear, and making room for singing and
                  dancing. Several months each year, three years running.
                </p>
              </div>
            </article>
            <article data-reveal="up" style={delay(120)} className="community-card community-card-run">
              <div className="community-media">
                <img className="cover-img washed" src="/images/ai/marathon.jpg" alt="Nitish with a marathon medal" loading="lazy" />
              </div>
              <div className="community-body">
                <span className="community-label">Hobby</span>
                <h3 className="community-title">Marathon Running</h3>
                <p className="community-copy">
                  Pushing limits physically and mentally — the same endurance software asks for. Keep moving forward.
                </p>
              </div>
            </article>
          </div>
        </div>
      </div>
      <svg className="wave wave-bottom" viewBox="0 0 1440 120" preserveAspectRatio="none" aria-hidden>
        <path d="M0 0 L 1440 0 L 1440 50 C 1200 120, 960 110, 720 60 S 240 10, 0 70 Z" />
      </svg>
    </section>
  );
}
