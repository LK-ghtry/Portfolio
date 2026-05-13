import { useState } from 'react';
import { ExternalLink } from 'lucide-react';
import { useFetch } from '../hooks/useFetch';
import { useDragScroll } from '../hooks/useDragScroll';
import type { Project, Competition, Skill, Certification } from '../types';
import ScrollReveal from '../components/layout/ScrollReveal';
import LoadingSpinner from '../components/shared/LoadingSpinner';

export default function ProjectsPage() {
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const dragScroll = useDragScroll();
  const { data: projects, loading: pLoading } = useFetch<Project[]>('/projects');
  const { data: competitions, loading: cLoading } = useFetch<Competition[]>('/competitions');
  const { data: skills, loading: sLoading } = useFetch<Skill[]>('/skills');
  const { data: certifications, loading: certLoading } = useFetch<Certification[]>('/certifications');

  if (pLoading || cLoading || sLoading || certLoading) return <LoadingSpinner />;

  return (
    <div style={{ paddingBottom: '6rem' }}>
      {/* Projects */}
      <ScrollReveal>
        <h2 className="section-title-projects" style={{
          textAlign: 'center', color: 'var(--heading-color)', marginBottom: '3rem',
          fontFamily: "'Outfit', 'Noto Sans SC', 'Inter', 'Microsoft YaHei', sans-serif", fontSize: '2.5rem', fontWeight: 800,
        }}>
          项目经验
        </h2>
      </ScrollReveal>

      {/* Project Cards */}
      <div
        ref={dragScroll.ref}
        className="projects-grid"
        {...dragScroll.handlers}
        style={{
          gap: '3rem', paddingBottom: '2rem', display: 'flex',
          overflowX: 'auto', scrollbarWidth: 'none',
          cursor: 'grab', userSelect: 'none',
        }}
      >
        {projects?.map((project) => {
          const isHovered = hoveredId === project.id;
          const isDimmed = hoveredId !== null && hoveredId !== project.id;

          return (
            <ScrollReveal key={project.id} delay={0.1}>
              <div
                className="project-card"
                onClick={() => setSelectedProject(project)}
                onMouseEnter={() => setHoveredId(project.id)}
                onMouseLeave={() => setHoveredId(null)}
                style={{
                  cursor: 'pointer', background: '#e3e6ed', borderRadius: 30,
                  flexDirection: 'column', flexShrink: 0, minWidth: 320, maxWidth: 360,
                  transition: 'all 0.45s cubic-bezier(0.25, 0.8, 0.25, 1)',
                  display: 'flex', overflow: 'hidden',
                  transform: isHovered ? 'scale(1.05) translateY(-8px)' : 'scale(1) translateY(0)',
                  boxShadow: isHovered
                    ? '0 25px 60px rgba(0,0,0,0.18)'
                    : '0 10px 40px rgba(0,0,0,0.06)',
                  filter: isDimmed ? 'blur(3px) grayscale(0.3)' : 'blur(0) grayscale(0)',
                  opacity: isDimmed ? 0.55 : 1,
                  zIndex: isHovered ? 10 : 1,
                }}
              >
                <div className="project-image-placeholder" style={{
                  aspectRatio: '16/9', width: '100%',
                  backgroundColor: project.image_path ? 'transparent' : 'var(--heading-color)',
                  backgroundImage: project.image_path ? `url(${project.image_path})` : undefined,
                  backgroundSize: 'cover', backgroundPosition: 'center',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                  color: '#fff', fontSize: '1.2rem', fontWeight: 700,
                  fontFamily: "'Noto Sans SC', 'Microsoft YaHei', sans-serif",
                  textAlign: 'center', padding: '1rem', gap: '0.5rem',
                  overflow: 'hidden',
                  transition: 'transform 0.45s cubic-bezier(0.25, 0.8, 0.25, 1)',
                  transform: isHovered ? 'scale(1.08)' : 'scale(1)',
                }}>
                  {!project.image_path && (
                    <>
                      <span style={{ fontSize: '1.8rem', fontWeight: 900 }}>
                        {(project.title.includes('唐宋') || project.title.includes('文脉')) ? '诗歌元宇宙'
                          : project.title.includes('语音') ? 'AI语音'
                          : project.title.includes('挑战杯') || project.title.includes('谱') ? '诗歌调研'
                          : project.category}
                      </span>
                      <span style={{ opacity: 0.7, fontSize: '0.85rem' }}>
                        {project.category}
                      </span>
                    </>
                  )}
                </div>
                <div className="project-content" style={{ flexDirection: 'column', flexGrow: 1, padding: '2rem', display: 'flex' }}>
                  <h3 className="project-title" style={{
                    color: 'var(--heading-color)', marginBottom: '1rem',
                    fontFamily: "'Outfit', 'Noto Sans SC', 'Inter', 'Microsoft YaHei', sans-serif",
                    fontSize: '1.5rem', fontWeight: 800, lineHeight: 1.2,
                  }}>
                    {project.title}
                  </h3>
                  <p className="project-short-desc" style={{
                    color: 'var(--text-secondary)', marginBottom: '1.5rem',
                    fontSize: '0.95rem', lineHeight: 1.5,
                  }}>
                    {project.short_description}
                  </p>
                  <div style={{ marginTop: 'auto', display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                    {project.live_url && (
                      <span className="btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
                        <ExternalLink size={14} /> 在线演示
                      </span>
                    )}
                    {project.github_url && (
                      <span className="btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
                        <ExternalLink size={14} /> GitHub
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </ScrollReveal>
          );
        })}
        {(!projects || projects.length === 0) && (
          <p style={{ color: 'var(--text-secondary)', textAlign: 'center', width: '100%' }}>暂无项目</p>
        )}
      </div>

      {/* Competitions */}
      {competitions && competitions.length > 0 && (
        <>
          <ScrollReveal>
            <h2 className="section-title-projects" style={{
              textAlign: 'center', color: 'var(--heading-color)', margin: '4rem 0 3rem',
              fontFamily: "'Outfit', 'Noto Sans SC', 'Inter', 'Microsoft YaHei', sans-serif", fontSize: '2.5rem', fontWeight: 800,
            }}>
              竞赛获奖
            </h2>
          </ScrollReveal>
          <div className="competitions-grid" style={{
            gap: '1.5rem', paddingBottom: '1rem', display: 'flex',
            flexWrap: 'wrap', justifyContent: 'center',
          }}>
            {competitions.map((comp) => (
              <ScrollReveal key={comp.id} delay={0.1}>
                <div className="competition-card" style={{
                  backgroundColor: 'var(--card-bg)', cursor: 'pointer', borderRadius: 12,
                  flexDirection: 'column', width: 260,
                  padding: '1.5rem', transition: 'transform 0.3s, box-shadow 0.3s', display: 'flex',
                }}>
                  <div className="comp-icon" style={{ marginBottom: '0.5rem', fontSize: '1.5rem' }}>{comp.icon}</div>
                  <h3 className="comp-title" style={{
                    color: 'var(--heading-color)', marginBottom: '0.5rem',
                    fontSize: '1rem', fontWeight: 700, lineHeight: 1.3,
                  }}>{comp.title}</h3>
                  {comp.award && (
                    <div className="comp-award" style={{
                      backgroundColor: '#e3e6ed', borderRadius: 4,
                      alignSelf: 'flex-start', marginBottom: '1rem',
                      padding: '4px 8px', fontSize: '0.8rem', fontWeight: 500,
                    }}>{comp.award}</div>
                  )}
                  <div className="comp-date" style={{
                    color: 'var(--text-secondary)', marginTop: 'auto', fontSize: '0.8rem', fontWeight: 500,
                  }}>{comp.date}</div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </>
      )}

      {/* Skills Marquee */}
      {skills && skills.length > 0 && (
        <>
          <ScrollReveal>
            <h2 className="section-title-projects" style={{
              textAlign: 'center', color: 'var(--heading-color)', margin: '4rem 0 3rem',
              fontFamily: "'Outfit', 'Noto Sans SC', 'Inter', 'Microsoft YaHei', sans-serif", fontSize: '2.5rem', fontWeight: 800,
            }}>
              技能
            </h2>
          </ScrollReveal>
          <div style={{ overflow: 'hidden', position: 'relative', padding: '1rem 0' }}>
            <div style={{
              display: 'flex', width: 'max-content',
              animation: 'scroll 20s linear infinite',
            }}>
              {[...skills, ...skills].map((skill, i) => (
                <span key={`${skill.id}-${i}`} style={{
                  marginRight: '2rem', fontSize: '1.5rem', fontWeight: 700,
                  color: 'var(--heading-color)', whiteSpace: 'nowrap',
                }}>
                  {skill.name}
                </span>
              ))}
            </div>
          </div>
          <style>{`
            @keyframes scroll {
              0% { transform: translateX(0); }
              100% { transform: translateX(-50%); }
            }
          `}</style>
        </>
      )}

      {/* Certifications */}
      {certifications && certifications.length > 0 && (
        <>
          <ScrollReveal>
            <h2 className="section-title-projects" style={{
              textAlign: 'center', color: 'var(--heading-color)', margin: '4rem 0 3rem',
              fontFamily: "'Outfit', 'Noto Sans SC', 'Inter', 'Microsoft YaHei', sans-serif", fontSize: '2.5rem', fontWeight: 800,
            }}>
              证书与荣誉
            </h2>
          </ScrollReveal>
          <div className="certs-grid" style={{
            flexDirection: 'column', gap: '1rem', maxWidth: 800, margin: '0 auto', display: 'flex',
          }}>
            {certifications.map((cert) => (
              <ScrollReveal key={cert.id} delay={0.1}>
                <div className="cert-card" style={{
                  background: 'var(--card-bg)', border: '1px solid transparent', borderRadius: 16,
                  alignItems: 'center', gap: '1.5rem', padding: '1.5rem 2rem',
                  transition: 'transform 0.2s, box-shadow 0.2s', display: 'flex',
                }}>
                  <div className="cert-icon" style={{ flexShrink: 0, fontSize: '2rem' }}>{cert.icon}</div>
                  <div className="cert-info" style={{ flexDirection: 'column', gap: '0.25rem', display: 'flex' }}>
                    <div className="cert-title" style={{ color: 'var(--heading-color)', fontSize: '1rem', fontWeight: 700 }}>
                      {cert.title}
                    </div>
                    {cert.issuer && (
                      <div className="cert-issuer" style={{ color: 'var(--accent-color)', fontSize: '0.9rem', fontWeight: 500 }}>
                        {cert.issuer}
                      </div>
                    )}
                    {cert.date && (
                      <div className="cert-date" style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
                        {cert.date}
                      </div>
                    )}
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </>
      )}
      {/* Project Detail Modal */}
      {selectedProject && (
        <div
          onClick={() => setSelectedProject(null)}
          style={{
            position: 'fixed', inset: 0, zIndex: 2000,
            backgroundColor: 'rgba(0,0,0,0.5)',
            backdropFilter: 'blur(8px)',
            display: 'flex', justifyContent: 'center', alignItems: 'center',
            padding: '2rem', animation: 'fade-in 0.3s ease',
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: '#fff', borderRadius: 24, maxWidth: 680, width: '100%',
              maxHeight: '85vh', overflow: 'auto', padding: '3rem',
              boxShadow: '0 30px 80px rgba(0,0,0,0.25)',
              animation: 'fade-in 0.3s ease',
              position: 'relative',
            }}
          >
            {/* Image */}
            {selectedProject.image_path && (
              <img
                src={selectedProject.image_path}
                alt={selectedProject.title}
                style={{
                  width: '100%', borderRadius: 16, marginBottom: '2rem',
                  aspectRatio: '16/9', objectFit: 'cover',
                }}
              />
            )}
            {/* Category badge */}
            <span style={{
              backgroundColor: 'var(--heading-color)', color: '#fff',
              padding: '4px 14px', borderRadius: 20, fontSize: '0.85rem',
              fontWeight: 600, marginBottom: '1rem', display: 'inline-block',
            }}>
              {selectedProject.category}
            </span>
            {/* Title */}
            <h2 style={{
              color: 'var(--heading-color)', fontSize: '2rem', fontWeight: 800,
              marginBottom: '1.5rem', fontFamily: "'Outfit', 'Noto Sans SC', sans-serif",
            }}>
              {selectedProject.title}
            </h2>
            {/* Full description */}
            <p style={{
              color: 'var(--text-secondary)', fontSize: '1.05rem',
              lineHeight: 1.8, marginBottom: '2rem',
            }}>
              {selectedProject.full_description || selectedProject.short_description}
            </p>
            {/* Links */}
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              {selectedProject.live_url && (
                <a href={selectedProject.live_url} target="_blank" rel="noopener noreferrer"
                  className="btn-primary">
                  <ExternalLink size={16} /> 在线演示
                </a>
              )}
              {selectedProject.github_url && (
                <a href={selectedProject.github_url} target="_blank" rel="noopener noreferrer"
                  className="btn-primary">
                  <ExternalLink size={16} /> GitHub
                </a>
              )}
            </div>
            {/* Close button */}
            <button
              onClick={() => setSelectedProject(null)}
              style={{
                position: 'absolute', top: '1rem', right: '1.5rem',
                background: 'none', border: 'none', fontSize: '1.8rem',
                cursor: 'pointer', color: '#999', lineHeight: 1,
              }}
            >
               ×
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
