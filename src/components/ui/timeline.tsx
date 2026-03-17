import {
  motion,
  useScroll,
  useTransform,
} from 'framer-motion';
import React, { useEffect, useRef, useState } from 'react';

interface TimelineEntry {
  title: string;
  content: React.ReactNode;
}

interface TimelineProps {
  data: TimelineEntry[];
  heading?: string;
  subheading?: string;
}

export const Timeline = ({
  data,
  heading = 'Changelog from my journey',
  subheading = 'A quick timeline highlighting key milestones and impact across my roles.',
}: TimelineProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    setHeight(rect.height);
  }, [data]);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 10%', 'end 50%'],
  });

  const heightTransform = useTransform(scrollYProgress, [0, 1], [0, height]);
  const opacityTransform = useTransform(scrollYProgress, [0, 0.1], [0, 1]);

  return (
    <div className="w-full font-sans md:px-10" ref={containerRef}>
      <div className="max-w-7xl mx-auto py-16 px-4 md:px-8 lg:px-10">
        <h2 className="text-lg md:text-4xl mb-4 text-white max-w-4xl">
          {heading}
        </h2>
        <p className="text-neutral-300 text-sm md:text-base max-w-2xl">
          {subheading}
        </p>
      </div>

      <div ref={ref} className="relative max-w-7xl mx-auto pb-28">
        {data.map((item, index) => (
          <div
            key={`${item.title}-${index}`}
            className={`flex items-start gap-6 md:gap-10 ${index === 0 ? 'pt-10 md:pt-14' : 'pt-8 md:pt-10'} ${index < data.length - 1 ? 'pb-16 md:pb-28' : 'pb-4'}`}
          >
            <div className="relative min-w-[180px] md:min-w-[340px] pr-1 md:pr-4">
              <div className="flex items-center gap-3 md:gap-4">
                <div className="h-7 w-7 rounded-full bg-black border border-neutral-700 flex items-center justify-center shrink-0">
                  <div className="h-3 w-3 rounded-full bg-neutral-300" />
                </div>
                <h3 className="text-2xl md:text-5xl font-bold text-neutral-300 leading-tight">
                  {item.title}
                </h3>
              </div>
            </div>

            <div className="relative w-full max-w-3xl pl-1 md:pl-4">
              <h3 className="sr-only">
                {item.title}
              </h3>
              {item.content}
            </div>
          </div>
        ))}

        <div
          style={{
            height: `${height}px`,
          }}
          className="absolute left-[13px] md:left-[13px] top-0 overflow-hidden w-[2px] bg-[linear-gradient(to_bottom,var(--tw-gradient-stops))] from-transparent from-[0%] via-neutral-700 to-transparent to-[99%] [mask-image:linear-gradient(to_bottom,transparent_0%,black_10%,black_90%,transparent_100%)]"
        >
          <motion.div
            style={{
              height: heightTransform,
              opacity: opacityTransform,
            }}
            className="absolute inset-x-0 top-0 w-[2px] bg-gradient-to-t from-emerald-400 via-cyan-400 to-transparent from-[0%] via-[10%] rounded-full"
          />
        </div>
      </div>
    </div>
  );
};
