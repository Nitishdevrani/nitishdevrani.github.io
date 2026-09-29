export function SectionBreak({ n, sage = false }: { n: string; sage?: boolean }) {
  return (
    <div data-reveal="up" className={`section-break${sage ? ' is-sage' : ''}`} aria-hidden>
      <span className="section-break-num">{n}</span>
      <span className="section-break-bar" />
      <span className="section-break-dot" />
    </div>
  );
}
