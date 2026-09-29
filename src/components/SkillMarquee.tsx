const skills = [
  'Next.js', 'React', 'TypeScript', 'Node.js', 'Python', 'Machine Learning',
  'Deep Learning', 'Model fine-tuning', 'Data Engineering', 'Docker', '3D Modeling',
];

export function SkillMarquee() {
  return (
    <div className="marquee-band">
      <div className="marquee-pill">
        {/* The list is doubled so the -50% loop is seamless; the copy is hidden from assistive tech. */}
        <div className="marquee-track">
          {[...skills, ...skills].map((s, i) => (
            <span key={i} className="marquee-item" aria-hidden={i >= skills.length || undefined}>
              {s}
              <span className="marquee-dot" />
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
