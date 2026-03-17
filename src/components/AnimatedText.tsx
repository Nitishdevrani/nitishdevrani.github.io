import { useEffect, useRef } from 'react';


interface AnimatedTextProps {
    children: React.ReactNode;
    delay?: number;
    className?: string;
    tagName?: keyof React.JSX.IntrinsicElements;
    style?: React.CSSProperties;
}

export const AnimatedText: React.FC<AnimatedTextProps> = ({ children, delay = 0, className = '', tagName = 'div', style }) => {
    const textRef = useRef<HTMLElement>(null);
    const hasAnimated = useRef(false);

    useEffect(() => {
        if (!textRef.current || hasAnimated.current || !window.IntersectionObserver) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting && !hasAnimated.current && textRef.current) {
                    hasAnimated.current = true;

                    // Use CSS Transitions instead of AnimeJS
                    setTimeout(() => {
                        if (textRef.current) {
                            textRef.current.style.opacity = '1';
                            textRef.current.style.transform = 'translateY(0)';
                        }
                    }, delay);

                    observer.unobserve(textRef.current);
                }
            });
        }, { threshold: 0.1 });

        // Initial state
        textRef.current.style.opacity = '0';
        textRef.current.style.transform = 'translateY(20px)';
        observer.observe(textRef.current);

        return () => observer.disconnect();
    }, [delay]);

    const Tag = tagName as any;

    return (
        <Tag ref={textRef} className={className} style={{ ...style, transition: 'opacity 0.5s ease-out, transform 0.5s ease-out' }}>
            {children}
        </Tag>
    );
};
