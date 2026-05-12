import { Mail, Download } from 'lucide-react';
import { GithubIcon, LinkedinIcon } from '../components/shared/SocialIcons';
import FloatingLetters from '../components/about/FloatingLetters';
import TypewriterHero from '../components/about/TypewriterHero';
import Timeline from '../components/about/Timeline';
import ScrollReveal from '../components/layout/ScrollReveal';
import { useFetch } from '../hooks/useFetch';
import type { PersonalInfo } from '../types';
import LoadingSpinner from '../components/shared/LoadingSpinner';

export default function AboutPage() {
  const { data: info, loading } = useFetch<PersonalInfo>('/personal');

  if (loading) return <LoadingSpinner />;

  const words = info?.subtitle?.split(' / ') || ['AI产品运营', '内容运营', '产品运营'];

  return (
    <div className="about-page" style={{ paddingBottom: '6rem' }}>
      {/* Hero Section */}
      <section style={{
        justifyContent: 'center', alignItems: 'center',
        marginBottom: '8rem', display: 'flex',
        minHeight: '65vh', position: 'relative',
      }}>
        <FloatingLetters />
      </section>

      {/* Intro Section */}
      <section style={{
        justifyContent: 'center', alignItems: 'center',
        marginBottom: '8rem', display: 'flex',
        flexDirection: 'column', position: 'relative',
        textAlign: 'center',
      }}>
        <ScrollReveal className="intro-content" delay={0}>
          <TypewriterHero words={words} staticPrefix="Hi, I'm " />
          <h1 style={{
            fontSize: '2.3rem', color: 'var(--heading-color)',
            fontWeight: 400, marginBottom: '1rem',
          }}>
            {info?.name_cn || '李国宽'}
          </h1>
          <p className="intro-text" style={{
            color: 'var(--text-secondary)', maxWidth: 600,
            margin: '0 auto 2rem', fontSize: '1rem',
            textAlign: 'center',
          }}>
            {info?.bio || '暂无简介'}
          </p>
          <div style={{
            display: 'flex', gap: '1rem', flexWrap: 'wrap',
            alignItems: 'center', justifyContent: 'center',
            position: 'relative', zIndex: 20,
          }}>
            <div className="social-links" style={{ gap: '1rem', display: 'flex' }}>
              {info?.github_url && (
                <a href={info.github_url} target="_blank" rel="noopener noreferrer" className="social-icon"
                  style={{
                    border: '2px solid var(--heading-color)', width: 40, height: 40,
                    color: 'var(--heading-color)', borderRadius: 8,
                    justifyContent: 'center', alignItems: 'center', transition: 'all 0.3s', display: 'flex',
                  }}
                >
                  <GithubIcon size={20} />
                </a>
              )}
              {info?.linkedin_url && (
                <a href={info.linkedin_url} target="_blank" rel="noopener noreferrer" className="social-icon"
                  style={{
                    border: '2px solid var(--heading-color)', width: 40, height: 40,
                    color: 'var(--heading-color)', borderRadius: 8,
                    justifyContent: 'center', alignItems: 'center', transition: 'all 0.3s', display: 'flex',
                  }}
                >
                  <LinkedinIcon size={20} />
                </a>
              )}
              <a href={`mailto:${info?.email || '610013559@qq.com'}`} className="social-icon"
                style={{
                  border: '2px solid var(--heading-color)', width: 40, height: 40,
                  color: 'var(--heading-color)', borderRadius: 8,
                  justifyContent: 'center', alignItems: 'center', transition: 'all 0.3s', display: 'flex',
                }}
              >
                <Mail size={20} />
              </a>
            </div>
            {info?.resume_path && (
              <a href={info.resume_path} className="btn-primary" download>
                <Download size={18} /> 下载简历
              </a>
            )}
          </div>
        </ScrollReveal>
      </section>

      {/* Timeline */}
      <Timeline />
    </div>
  );
}
