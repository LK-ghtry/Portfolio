import { useTypewriter } from '../../hooks/useTypewriter';

interface Props {
  words: string[];
  staticPrefix?: string;
  staticSuffix?: string;
}

export default function TypewriterHero({ words, staticPrefix = '', staticSuffix = '' }: Props) {
  const { text } = useTypewriter(words, 80, 40, 2000);

  return (
    <h1 className="intro-heading" style={{ marginBottom: '0.5rem', fontSize: '2.3rem', fontWeight: 400 }}>
      {staticPrefix}
      <span className="text-type" style={{ whiteSpace: 'pre-wrap', display: 'inline-block' }}>
        <span className="text-type__content" style={{ color: 'inherit' }}>
          {text}
        </span>
      </span>
      <span className="text-type__cursor" style={{
        marginLeft: '0.15rem',
        display: 'inline-block',
        animation: 'blink 1s step-end infinite',
        color: 'var(--accent-color)',
      }}>|</span>
      {staticSuffix}
    </h1>
  );
}
