import { ExternalLink } from 'lucide-react';
import { useFetch } from '../../hooks/useFetch';
import type { TimelineItem as TItem } from '../../types';
import ScrollReveal from '../layout/ScrollReveal';
import LoadingSpinner from '../shared/LoadingSpinner';

function groupByCategory(items: TItem[]) {
  const exp = items.filter((i) => i.category === 'experience');
  const edu = items.filter((i) => i.category === 'education');
  return { experience: exp, education: edu };
}

const sectionLabels: Record<string, string> = {
  experience: '实习经历',
  education: '教育背景',
};

export default function Timeline() {
  const { data: items, loading } = useFetch<TItem[]>('/timeline');

  if (loading) return <LoadingSpinner />;
  if (!items || items.length === 0) return <p style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>暂无内容</p>;

  const grouped = groupByCategory(items);

  return (
    <div className="timeline-section-wrapper" style={{ marginTop: '4rem' }}>
      {Object.entries(grouped).map(([category, categoryItems]) =>
        categoryItems.length > 0 ? (
          <section key={category} style={{ marginBottom: '4rem' }}>
            <ScrollReveal>
              <h2 className="section-title-projects" style={{
                textAlign: 'center', color: 'var(--heading-color)',
                marginBottom: '3rem', fontFamily: "'Outfit', 'Noto Sans SC', 'Inter', 'Microsoft YaHei', sans-serif",
                fontSize: '2.5rem', fontWeight: 800,
              }}>
                {sectionLabels[category]}
              </h2>
            </ScrollReveal>
            <div style={{ maxWidth: 800, margin: '0 auto', display: 'flex', flexDirection: 'column' }}>
              {categoryItems.map((item, idx) => (
                <ScrollReveal key={item.id} delay={idx * 0.1}>
                  <div style={{ minHeight: 150, display: 'flex', flexDirection: 'row' }}>
                    {/* Separator */}
                    <div style={{
                      flexDirection: 'column', alignItems: 'center',
                      margin: '0 1rem', display: 'flex', order: 1,
                    }}>
                      <div style={{
                        backgroundColor: 'var(--timeline-dot)',
                        borderRadius: '50%', width: 12, height: 12,
                        marginTop: '1rem', flexShrink: 0,
                      }} />
                      {idx < categoryItems.length - 1 && (
                        <div style={{
                          backgroundColor: 'var(--timeline-line)',
                          flexGrow: 1, width: 2, marginTop: '0.5rem',
                        }} />
                      )}
                    </div>
                    {/* Year */}
                    <div style={{
                      flex: 'unset', minWidth: 120, paddingTop: '0.5rem',
                      paddingLeft: '1.5rem', order: 2,
                    }}>
                      <span style={{ color: '#888', fontSize: '1.2rem', fontWeight: 700 }}>
                        {item.start_date} — {item.end_date}
                      </span>
                    </div>
                    {/* Content */}
                    <div style={{
                      textAlign: 'left', flex: 1, paddingTop: '0.5rem',
                      paddingLeft: '3rem', order: 3,
                    }}>
                      <h3 style={{
                        color: 'var(--accent-color)', marginBottom: '0.5rem',
                        fontSize: '1.5rem', fontWeight: 800,
                      }}>{item.title}</h3>
                      {item.subtitle && (
                        <p style={{ color: 'var(--accent-color)', marginBottom: '0.5rem', fontWeight: 500 }}>
                          {item.subtitle}
                        </p>
                      )}
                      {item.description && (
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', whiteSpace: 'pre-wrap' }}>
                          {item.description}
                        </p>
                      )}
                      {item.link_url && (() => {
                          const isExternal = item.link_url.startsWith('http');
                          const href = isExternal ? item.link_url : `${import.meta.env.BASE_URL}${item.link_url.replace(/^\//, '')}`;
                          return (
                        <a
                          href={href}
                          target={isExternal ? '_blank' : undefined}
                          rel={isExternal ? 'noopener noreferrer' : undefined}
                          style={{
                            display: 'inline-flex', alignItems: 'center', gap: '0.3rem',
                            marginTop: '0.5rem', color: 'var(--accent-color)',
                            fontSize: '0.9rem', fontWeight: 600,
                          }}
                        >
                          <ExternalLink size={14} />
                          {item.link_text || '查看详情'}
                        </a>
                        );
                        })()}
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </section>
        ) : null
      )}
    </div>
  );
}
