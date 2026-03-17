import { Timeline } from './timeline';

interface TimelineDemoProps {
  onSelectProject: (id: string) => void;
}

export function TimelineDemo({ onSelectProject }: TimelineDemoProps) {
  const data = [
    {
      title: 'Sep 2025 - Present',
      content: (
        <div className="space-y-5 pb-6">
          <div className="mb-4">
            <a
              href="https://www.linkedin.com/school/technische-universit%C3%A4t-n%C3%BCrnberg/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 group"
            >
              <img
                src="/images/logos/technische_universitt_nrnberg_logo.jpeg"
                alt="UTN logo"
                className="w-12 h-12 rounded-md object-contain bg-white/10 p-1"
              />
              <h4 className="text-white text-lg font-semibold group-hover:text-cyan-300 transition-colors">UTN (Technische Universitat Nurnberg)</h4>
            </a>
            <p className="text-neutral-300 text-sm mt-1">Role - Hiwi</p>
          </div>
          <ul className="list-disc pl-5 text-neutral-300 text-sm md:text-base space-y-2 mb-4">
            <li>Working as a Hiwi on university initiatives and research-support activities.</li>
            <li>Contributing to implementation, testing, and iterative improvements in academic projects.</li>
          </ul>
          <div>
            <p className="text-neutral-400 text-xs mb-2">Project from this period</p>
            <button
              type="button"
              onClick={() => onSelectProject('german_university_learning_review')}
              className="w-full max-w-2xl aspect-video overflow-hidden rounded-lg border border-white/10 bg-neutral-900/50 cursor-pointer"
            >
              <img
                src="/images/projects/german-university-learning-review/cover2.png"
                alt="German University project"
                className="h-full w-full object-cover"
              />
            </button>
          </div>
          <div aria-hidden="true" className="h-8 md:h-14" />
        </div>
      ),
    },
    {
      title: 'Nov 2023 - Aug 2025',
      content: (
        <div className="space-y-5 pb-6">
          <div className="mb-4">
            <a
              href="https://www.linkedin.com/company/petco-animal-supplies-inc-/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 group"
            >
              <img
                src="/images/logos/petco_animal_supplies_inc__logo.jpeg"
                alt="Petco logo"
                className="w-12 h-12 rounded-md object-contain bg-white/10 p-1"
              />
              <h4 className="text-white text-lg font-semibold group-hover:text-cyan-300 transition-colors">Petco</h4>
            </a>
            <p className="text-neutral-300 text-sm mt-1">Role - Frontend Developer</p>
          </div>
          <ul className="list-disc pl-5 text-neutral-300 text-sm md:text-base space-y-2 mb-4">
            <li>Created, upgraded, and maintained PDP, PLP, brand pages, and homepage experiences.</li>
            <li>Delivered SEO-focused improvements for high-traffic e-commerce storefront pages.</li>
          </ul>
          <div>
            <p className="text-neutral-400 text-xs mb-2">Project from this period</p>
            <button
              type="button"
              onClick={() => onSelectProject('petco_website')}
              className="w-full max-w-2xl aspect-video overflow-hidden rounded-lg border border-white/10 bg-neutral-900/50 cursor-pointer"
            >
              <img
                src="/images/projects/petco-website/cover.png"
                alt="Petco website project"
                className="h-full w-full object-cover"
              />
            </button>
          </div>
          <div aria-hidden="true" className="h-8 md:h-14" />
        </div>
      ),
    },
    {
      title: 'Mar 2022 - Nov 2023',
      content: (
        <div className="space-y-5 pb-6">
          <div className="mb-4">
            <a
              href="https://www.linkedin.com/company/kellton/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 group"
            >
              <img
                src="/images/logos/kellton_logo.jpeg"
                alt="Kellton logo"
                className="w-12 h-12 rounded-md object-contain bg-white/10 p-1"
              />
              <h4 className="text-white text-lg font-semibold group-hover:text-cyan-300 transition-colors">Kellton</h4>
            </a>
            <p className="text-neutral-300 text-sm mt-1">Role - Software Engineer</p>
          </div>
          <ul className="list-disc pl-5 text-neutral-300 text-sm md:text-base space-y-2 mb-4">
            <li>Developed responsive UI components with React.js.</li>
            <li>Integrated REST APIs and developed Progressive Web Apps (PWAs).</li>
          </ul>
          <div>
            <p className="text-neutral-400 text-xs mb-2">Project from this period</p>
            <button
              type="button"
              onClick={() => onSelectProject('adani_sampling')}
              className="w-full max-w-2xl aspect-video overflow-hidden rounded-lg border border-white/10 bg-neutral-900/50 cursor-pointer"
            >
              <img
                src="/images/projects/adani-sampling/cover.png"
                alt="Adani sampling project"
                className="h-full w-full object-cover"
              />
            </button>
          </div>
          <div aria-hidden="true" className="h-8 md:h-14" />
        </div>
      ),
    },
    {
      title: 'Jan 2020 - Mar 2022',
      content: (
        <div className="space-y-5 pb-6">
          <div className="mb-4">
            <a
              href="https://www.linkedin.com/company/oodles-technologies/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 group"
            >
              <img
                src="/images/logos/oodles_technologies_pvt_ltd_logo.jpeg"
                alt="Oodles logo"
                className="w-12 h-12 rounded-md object-contain bg-white/10 p-1"
              />
              <h4 className="text-white text-lg font-semibold group-hover:text-cyan-300 transition-colors">Oodles Technologies</h4>
            </a>
            <p className="text-neutral-300 text-sm mt-1">Role - Sr. Associate Consultant</p>
          </div>
          <ul className="list-disc pl-5 text-neutral-300 text-sm md:text-base space-y-2 mb-4">
            <li>Led a 5-person team on live-streaming projects.</li>
            <li>Migrated legacy PHP platform to React.js and mentored junior developers.</li>
          </ul>
          <div>
            <p className="text-neutral-400 text-xs mb-2">Project from this period</p>
            <button
              type="button"
              onClick={() => onSelectProject('babyflix_app')}
              className="w-full max-w-2xl aspect-video overflow-hidden rounded-lg border border-white/10 bg-neutral-900/50 cursor-pointer"
            >
              <img
                src="/images/projects/babyflix-app/cover.png"
                alt="Babyflix project"
                className="h-full w-full object-cover"
              />
            </button>
          </div>
          <div aria-hidden="true" className="h-8 md:h-14" />
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen w-full">
      <Timeline
        data={data}
        heading="Work Experience Timeline"
        subheading="A timeline view of my professional journey across enterprise, e-commerce, and academic projects."
      />
    </div>
  );
}
