import type { ReactNode } from 'react';
import { useScrollReveal } from '../../hooks/useScrollReveal';

interface Props {
  children: ReactNode;
  className?: string;
  delay?: number; // in seconds
}

export default function ScrollReveal({ children, className = '', delay = 0 }: Props) {
  const ref = useScrollReveal<HTMLDivElement>(0.1);

  return (
    <div
      ref={ref}
      className={className}
      style={delay ? { transitionDelay: `${delay}s` } : undefined}
    >
      {children}
    </div>
  );
}
