import { SectionBreak } from './SectionBreak';
import { delay } from './reveal';

const steps = [
  { badge: 'BCA', dates: '2017 — 2020', title: 'Bachelor’s in Computer Application', school: 'Maharishi Dayanand University, India' },
  { badge: 'MCA', dates: '2020 — 2022', title: 'Master’s in Computer Application', school: 'Gurugram University, India' },
  { badge: 'M.Sc', dates: '2024 — 2026', title: 'Master’s in AI & Robotics', school: 'University of Technology Nuremberg, Germany' },
];

export function EducationSteps() {
  return (
    <section id="education" className="section">
      <div className="wrap">
        <SectionBreak n="02" />
        <div className="education-head">
          <h2 data-reveal="up" style={delay(80)} className="section-title">
            Step by step
          </h2>
          <p data-reveal="up" style={delay(160)} className="section-intro">
            From computer applications to AI and robotics — each step a little higher.
          </p>
        </div>

        <div className="steps">
          {steps.map((s, i) => (
            <div key={s.badge} data-reveal="up" style={delay(i * 120)} className={`step step-${i + 1}`}>
              <div className="step-badge">{s.badge}</div>
              <div className="step-dates">{s.dates}</div>
              <h3 className="step-title">{s.title}</h3>
              <p className="step-school">{s.school}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
