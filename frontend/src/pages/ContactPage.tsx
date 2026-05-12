import { useState } from 'react';
import { Mail, Send } from 'lucide-react';
import { GithubIcon, LinkedinIcon } from '../components/shared/SocialIcons';
import { useFetch } from '../hooks/useFetch';
import type { PersonalInfo, GuestbookMessage } from '../types';
import ScrollReveal from '../components/layout/ScrollReveal';
import client from '../api/client';

export default function ContactPage() {
  const { data: info } = useFetch<PersonalInfo>('/personal');
  const { data: messages } = useFetch<GuestbookMessage[]>('/guestbook');
  const { data: pinned } = useFetch<{ author_name: string; message: string } | null>('/guestbook/pinned');

  const [form, setForm] = useState({ author_name: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [envelopeOpen, setEnvelopeOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.message.trim()) return;
    try {
      await client.post('/guestbook', form);
      setSubmitted(true);
      setForm({ author_name: '', message: '' });
      setTimeout(() => setSubmitted(false), 3000);
    } catch {
      // silently fail
    }
  };

  return (
    <div style={{ paddingBottom: '6rem' }}>
      {/* Envelope */}
      <ScrollReveal>
        <div className="envelope-container" style={{
          flexDirection: 'column', justifyContent: 'center',
          alignItems: 'center', minHeight: 450, padding: '2rem', display: 'flex',
        }}>
          <div
            className={`envelope-wrapper${envelopeOpen ? ' envelope-wrapper--open' : ''}`}
            onClick={() => !envelopeOpen && setEnvelopeOpen(true)}
            style={{
              zIndex: 0, backgroundColor: '#3760c9',
              justifyContent: 'center', width: 360, height: 220,
              transition: 'transform 0.3s', display: 'flex',
              position: 'relative', cursor: envelopeOpen ? 'default' : 'pointer',
              transform: envelopeOpen ? 'none' : undefined,
            }}
          >
            {/* Lid one (top flap) */}
            <div className="envelope-lid one" style={{
              transformOrigin: 'top',
              borderBottom: '110px solid transparent',
              borderLeft: '180px solid transparent',
              borderRight: '180px solid transparent',
              width: '100%', height: '100%',
              transition: 'transform 0.25s linear',
              position: 'absolute', top: 0, left: 0,
              zIndex: 3, borderTop: '110px solid #658ced',
              transform: envelopeOpen ? 'rotateX(180deg)' : 'rotateX(0)',
            }} />
            {/* Lid two (inner) */}
            <div className="envelope-lid two" style={{
              transformOrigin: 'top',
              borderBottom: '110px solid transparent',
              borderLeft: '180px solid transparent',
              borderRight: '180px solid transparent',
              width: '100%', height: '100%',
              transition: 'transform 0.25s linear',
              position: 'absolute', top: 0, left: 0,
              zIndex: 1, borderTop: '110px solid #3760c9',
              transform: envelopeOpen ? 'rotateX(180deg)' : 'rotateX(90deg)',
              transitionDelay: envelopeOpen ? '0.25s' : '0s',
            }} />
            {/* Body */}
            <div style={{
              zIndex: 3,
              borderTop: '110px solid transparent',
              borderBottom: '110px solid #c4dff0',
              borderLeft: '180px solid #a4d4f2',
              borderRight: '180px solid #c4dff0',
              width: '100%', height: '100%',
              position: 'absolute', top: 0, left: 0,
            }} />
            {/* Letter */}
            <div style={{
              zIndex: envelopeOpen ? 5 : 2, backgroundColor: '#faf8f0', borderRadius: 15,
              flexDirection: 'column', justifyContent: 'center',
              width: '80%', minHeight: '80%', padding: '1.5rem 2rem',
              transition: 'transform 0.5s ease-out, z-index 0s',
              display: 'flex',
              position: 'absolute', top: 0, left: '10%',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              transform: envelopeOpen ? 'translateY(-80%)' : 'translateY(0)',
            }}>
              <div className="letter-content" style={{ color: '#122c4f', fontFamily: 'Courier New, Courier, monospace' }}>
                {pinned ? (
                  <>
                    <p style={{ wordWrap: 'break-word', margin: 0, lineHeight: 1.7 }}>
                      "{pinned.message}"
                    </p>
                    <p style={{ textAlign: 'right', opacity: 0.7, marginTop: '1.5rem', fontSize: '1rem', fontStyle: 'italic' }}>
                      — {pinned.author_name}
                    </p>
                  </>
                ) : (
                  <p style={{ textAlign: 'center', opacity: 0.7 }}>
                    欢迎留下你的足迹 👋
                  </p>
                )}
              </div>
            </div>
            {/* Label */}
            {!envelopeOpen && (
              <div className="envelope-label" style={{
                textAlign: 'center', color: '#fff', zIndex: 4, pointerEvents: 'none',
                fontFamily: "'Inter', sans-serif",
                animation: 'envelope-pulse 2s ease-in-out infinite',
                position: 'absolute', top: '50%', left: '50%',
                transform: 'translate(-50%, -50%)',
              }}>
                <span style={{ marginBottom: '0.5rem', fontSize: '1.8rem', display: 'block' }}>✉️</span>
                Click to open
              </div>
            )}
          </div>
          {!envelopeOpen && (
            <div className="envelope-hint" style={{
              textAlign: 'center', opacity: 0, color: 'var(--accent-color)',
              marginTop: '2rem', fontSize: '0.95rem',
              animation: 'fade-in 0.5s ease-in 0.5s forwards',
            }}>
              A message from the previous visitor
            </div>
          )}
        </div>
      </ScrollReveal>

      {/* Contact Form + Info */}
      <div className="contacts-split" style={{
        justifyContent: 'space-between', alignItems: 'flex-start',
        gap: '4rem', marginTop: '4rem', display: 'flex', flexWrap: 'wrap',
      }}>
        <ScrollReveal className="contacts-form-section" delay={0}>
          <form className="contact-form" onSubmit={handleSubmit} style={{ flexDirection: 'column', gap: '1.5rem', display: 'flex' }}>
            <input
              className="form-input"
              type="text"
              placeholder="你的名字"
              value={form.author_name}
              onChange={(e) => setForm((f) => ({ ...f, author_name: e.target.value }))}
              style={{
                border: '2px solid var(--heading-color)', background: 'transparent',
                borderRadius: 4, outline: 'none', width: '100%',
                padding: '1.2rem', fontFamily: 'inherit', fontSize: '1rem',
              }}
            />
            <textarea
              className="form-textarea"
              placeholder="写下你想说的话..."
              value={form.message}
              onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
              rows={5}
              style={{
                border: '2px solid var(--heading-color)', background: 'transparent',
                borderRadius: 4, outline: 'none', width: '100%',
                padding: '1.2rem', fontFamily: 'inherit', fontSize: '1rem',
                resize: 'vertical', minHeight: 140,
              }}
            />
            <div className="form-actions" style={{ alignItems: 'center', gap: '1.5rem', display: 'flex' }}>
              <button type="submit" className="btn-submit" style={{
                backgroundColor: 'var(--heading-color)', color: '#fff',
                border: 'none', borderRadius: 4, padding: '1.2rem 2rem',
                fontSize: '1rem', fontWeight: 800, cursor: 'pointer',
                transition: 'background-color 0.3s',
              }}>
                <Send size={18} style={{ marginRight: '0.5rem', display: 'inline' }} />
                {submitted ? '已发送！' : '发送留言'}
              </button>
              <div className="social-squares" style={{ gap: '1rem', display: 'flex' }}>
                {info?.github_url && (
                  <a href={info.github_url} target="_blank" rel="noopener noreferrer" className="social-square"
                    style={{
                      border: '2px solid var(--heading-color)', width: 52, height: 52,
                      color: 'var(--heading-color)', borderRadius: 4,
                      justifyContent: 'center', alignItems: 'center', display: 'flex',
                      transition: 'all 0.3s',
                    }}>
                    <GithubIcon size={22} />
                  </a>
                )}
                {info?.linkedin_url && (
                  <a href={info.linkedin_url} target="_blank" rel="noopener noreferrer" className="social-square"
                    style={{
                      border: '2px solid var(--heading-color)', width: 52, height: 52,
                      color: 'var(--heading-color)', borderRadius: 4,
                      justifyContent: 'center', alignItems: 'center', display: 'flex',
                      transition: 'all 0.3s',
                    }}>
                    <LinkedinIcon size={22} />
                  </a>
                )}
                <a href={`mailto:${info?.email || ''}`} className="social-square"
                  style={{
                    border: '2px solid var(--heading-color)', width: 52, height: 52,
                    color: 'var(--heading-color)', borderRadius: 4,
                    justifyContent: 'center', alignItems: 'center', display: 'flex',
                    transition: 'all 0.3s',
                  }}>
                  <Mail size={22} />
                </a>
              </div>
            </div>
          </form>
        </ScrollReveal>

        <ScrollReveal className="contacts-text-section" delay={0.2}>
          <h1 className="contacts-heading" style={{
            color: 'var(--heading-color)', marginBottom: '2rem',
            fontSize: '4rem', fontWeight: 900, lineHeight: 1.1,
          }}>
            Let's talk for<br />something special
          </h1>
          <p className="contacts-description" style={{
            color: 'var(--text-secondary)', maxWidth: 450,
            fontSize: '1.1rem', lineHeight: 1.6,
          }}>
            如果你对我的经历感兴趣，或者有合作机会，欢迎联系我。
            也可以通过以下方式找到我。
          </p>
          {info?.location && (
            <p style={{ color: 'var(--text-secondary)', marginTop: '1rem' }}>
              📍 {info.location}
            </p>
          )}
        </ScrollReveal>
      </div>

      {/* Guestbook */}
      {messages && messages.length > 0 && (
        <ScrollReveal>
          <div className="guestbook-section" style={{
            flexDirection: 'column', gap: '1.5rem', marginTop: '4rem',
            paddingTop: '2rem', display: 'flex',
            borderTop: '1px solid rgba(0,0,0,0.05)',
          }}>
            <h2 className="guestbook-title" style={{
              color: 'var(--heading-color)', fontSize: '1.8rem', fontWeight: 800,
            }}>
              留言板 ({messages.length})
            </h2>
            {messages.map((msg) => (
              <div key={msg.id} style={{
                background: 'var(--card-bg)', borderRadius: 12, padding: '1.5rem',
                boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
              }}>
                <p style={{ color: 'var(--text-color)', marginBottom: '0.5rem', lineHeight: 1.6 }}>
                  {msg.message}
                </p>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  <span>{msg.author_name}</span>
                  <span>{new Date(msg.created_at).toLocaleDateString('zh-CN')}</span>
                </div>
              </div>
            ))}
          </div>
        </ScrollReveal>
      )}
    </div>
  );
}
