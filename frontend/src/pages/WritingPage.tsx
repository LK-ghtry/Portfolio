import { ExternalLink, PenLine, BookOpen } from 'lucide-react';
import { useFetch } from '../hooks/useFetch';
import type { Writing } from '../types';
import ScrollReveal from '../components/layout/ScrollReveal';
import LoadingSpinner from '../components/shared/LoadingSpinner';

export default function WritingPage() {
  const { data: writings, loading } = useFetch<Writing[]>('/writings');

  if (loading) return <LoadingSpinner />;

  return (
    <div style={{ paddingBottom: '6rem' }}>
      <ScrollReveal>
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <div style={{ display: 'inline-flex', marginBottom: '1.5rem' }}>
            <PenLine size={48} color="var(--accent-color)" />
          </div>
          <h1 style={{
            color: 'var(--heading-color)', fontSize: '2.5rem', fontWeight: 800,
            fontFamily: "'Outfit', 'Noto Sans SC', 'Inter', 'Microsoft YaHei', sans-serif",
          }}>
            阅读与写作
          </h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '1rem', fontSize: '1.05rem' }}>
            保持阅读习惯，关注科技与人文交叉领域的内容创作
          </p>
        </div>
      </ScrollReveal>

      <div style={{ maxWidth: 800, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        {writings && writings.length > 0 ? (
          writings.map((writing, idx) => (
            <ScrollReveal key={writing.id} delay={idx * 0.1}>
              <article style={{
                background: 'var(--card-bg)', borderRadius: 16, padding: '2.5rem',
                boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
                transition: 'transform 0.3s',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                  <BookOpen size={20} color="var(--accent-color)" />
                  <span style={{
                    color: 'var(--accent-color)', fontSize: '0.85rem', fontWeight: 600,
                    backgroundColor: '#e8ecf4', padding: '2px 10px', borderRadius: 12,
                  }}>
                    {writing.platform || '文章'}
                  </span>
                </div>
                <h2 style={{
                  color: 'var(--heading-color)', fontSize: '1.5rem', fontWeight: 800,
                  marginBottom: '0.75rem',
                  fontFamily: "'Outfit', 'Noto Sans SC', 'Inter', sans-serif",
                }}>
                  {writing.title}
                </h2>
                {writing.description && (
                  <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, fontSize: '1rem', marginBottom: '1rem' }}>
                    {writing.description}
                  </p>
                )}
                {writing.url ? (
                  <a href={writing.url} target="_blank" rel="noopener noreferrer"
                    className="btn-primary">
                    <ExternalLink size={16} /> 阅读原文
                  </a>
                ) : (
                  <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontStyle: 'italic' }}>
                    链接待添加
                  </span>
                )}
              </article>
            </ScrollReveal>
          ))
        ) : (
          <ScrollReveal>
            <div style={{
              textAlign: 'center', padding: '4rem 2rem',
              color: 'var(--text-secondary)',
            }}>
              <BookOpen size={40} style={{ marginBottom: '1rem', opacity: 0.4 }} />
              <p style={{ fontSize: '1.1rem' }}>
                文章正在整理中，请通过管理后台添加公众号文章链接
              </p>
            </div>
          </ScrollReveal>
        )}
      </div>
    </div>
  );
}
