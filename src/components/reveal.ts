import type { CSSProperties } from 'react';

/** Stagger for a `data-reveal` element; consumed as the transition delay in index.css. */
export const delay = (ms: number) => ({ '--d': `${ms}ms` }) as CSSProperties;
