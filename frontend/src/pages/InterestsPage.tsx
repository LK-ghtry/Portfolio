import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, ChevronLeft, ChevronRight } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { useFetch } from '../hooks/useFetch';
import type { Interest, TravelPhoto, Playlist } from '../types';
import ScrollReveal from '../components/layout/ScrollReveal';
import LoadingSpinner from '../components/shared/LoadingSpinner';

const iconMap: Record<string, React.ComponentType<any>> = {
  Github: LucideIcons.Code2,
  BookOpen: LucideIcons.BookOpen,
  Music: LucideIcons.Music,
  Youtube: LucideIcons.Video,
  Camera: LucideIcons.Camera,
  Globe: LucideIcons.Globe,
  Heart: LucideIcons.Heart,
};

export default function InterestsPage() {
  const { data: interests, loading: iLoading } = useFetch<Interest[]>('/interests');
  const { data: playlists } = useFetch<Playlist[]>('/playlists');
  const { data: countries } = useFetch<string[]>('/travel-countries');

  const [activeCountry, setActiveCountry] = useState<string>('');
  const [photoIndex, setPhotoIndex] = useState(0);

  const { data: travelPhotos } = useFetch<TravelPhoto[]>(
    activeCountry ? `/travel-photos?country=${encodeURIComponent(activeCountry)}` : '/travel-photos'
  );

  if (iLoading) return <LoadingSpinner />;

  const filteredPhotos = travelPhotos || [];
  const currentPhoto = filteredPhotos[photoIndex];

  return (
    <div style={{ paddingBottom: '6rem' }}>
      {/* Interests Grid */}
      <ScrollReveal>
        <h2 style={{
          textAlign: 'center', color: 'var(--heading-color)', marginBottom: '4rem',
          fontSize: '2.5rem', fontWeight: 400,
          fontFamily: "'Outfit', 'Noto Sans SC', 'Inter', 'Microsoft YaHei', sans-serif",
        }}>
          其他
        </h2>
      </ScrollReveal>

      {interests && interests.length > 0 && (
        <div className="content-grid" style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '2rem', marginBottom: '4rem',
        }}>
          {interests.map((item, idx) => {
            const IconComp = iconMap[item.icon_name] || LucideIcons.Star;
            return (
              <ScrollReveal key={item.id} delay={idx * 0.1}>
                <div className="content-card" style={{
                  background: 'var(--card-bg)', borderRadius: 24,
                  flexDirection: 'column', padding: '2rem',
                  transition: 'transform 0.3s', display: 'flex',
                  boxShadow: '0 10px 40px rgba(0,0,0,0.04)',
                  height: '100%',
                }}>
                  <div className="content-icon" style={{ marginBottom: '1rem', display: 'inline-flex' }}>
                    <IconComp size={40} color={item.icon_color || 'var(--accent-color)'} />
                  </div>
                  <h3 style={{
                    color: 'var(--heading-color)', marginBottom: '0.75rem',
                    fontSize: '1.5rem', fontWeight: 800,
                  }}>
                    {item.title}
                  </h3>
                  <p style={{
                    color: 'var(--text-secondary)', marginBottom: '1.5rem',
                    fontSize: '0.95rem', lineHeight: 1.6, flex: 1,
                  }}>
                    {item.description}
                  </p>
                  {item.link_url?.startsWith('http') ? (
                    <a href={item.link_url} target="_blank" rel="noopener noreferrer"
                      className="btn-primary" style={{
                        alignSelf: 'flex-start', marginTop: 'auto',
                      }}>
                      {item.link_text || '访问'} <ExternalLink size={16} />
                    </a>
                  ) : (
                    <Link to={item.link_url || '#'}
                      className="btn-primary" style={{
                        alignSelf: 'flex-start', marginTop: 'auto',
                        opacity: item.link_url ? 1 : 0.4,
                        pointerEvents: item.link_url ? 'auto' : 'none',
                        textDecoration: 'none',
                      }}>
                      {item.link_text || '即将上线'} <ExternalLink size={16} />
                    </Link>
                  )}
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      )}

      {/* Playlist */}
      {playlists && playlists.length > 0 && (
        <>
          <ScrollReveal>
            <h2 style={{
              textAlign: 'center', color: 'var(--heading-color)',
              marginBottom: '3rem', fontSize: '2rem', fontWeight: 800,
              fontFamily: "'Outfit', 'Noto Sans SC', 'Inter', 'Microsoft YaHei', sans-serif",
            }}>
              音乐
            </h2>
          </ScrollReveal>
          <div style={{ maxWidth: 700, margin: '0 auto', marginBottom: '4rem' }}>
            {playlists.map((pl, idx) => (
              <ScrollReveal key={pl.id} delay={idx * 0.1}>
                <div className="playlist-card" style={{
                  background: 'var(--card-bg)', borderRadius: 24,
                  alignItems: 'center', gap: '2rem', padding: '2rem',
                  transition: 'transform 0.3s', display: 'flex',
                  boxShadow: '0 10px 40px rgba(0,0,0,0.04)',
                  marginBottom: '1.5rem',
                }}>
                  <div className="cd-container" style={{
                    background: 'conic-gradient(#333, #555, #333, #111, #333)',
                    borderRadius: '50%', flexShrink: 0,
                    justifyContent: 'center', alignItems: 'center',
                    width: 120, height: 120,
                    animation: 'spin 4s linear infinite', display: 'flex',
                    position: 'relative',
                    boxShadow: '0 8px 20px rgba(0,0,0,0.3), inset 0 0 10px rgba(255,255,255,0.2)',
                  }}>
                    <div style={{
                      background: 'var(--bg-color)', borderRadius: '50%',
                      justifyContent: 'center', alignItems: 'center',
                      width: 35, height: 35, display: 'flex', position: 'relative',
                      boxShadow: 'inset 0 2px 5px rgba(0,0,0,0.5)',
                    }}>
                      <div style={{
                        background: '#222', borderRadius: '50%', width: 10, height: 10,
                      }} />
                    </div>
                  </div>
                  <div className="playlist-info">
                    <h3 style={{
                      color: 'var(--heading-color)', marginBottom: '0.25rem',
                      fontSize: '1.5rem', fontWeight: 800,
                    }}>{pl.title}</h3>
                    <p style={{
                      color: 'var(--text-secondary)', marginBottom: '0.75rem',
                      fontSize: '0.95rem',
                    }}>{pl.platform}</p>
                    {pl.link_url && (
                      <a href={pl.link_url} target="_blank" rel="noopener noreferrer"
                        style={{ color: 'var(--accent-color)', fontWeight: 600 }}>
                        在{pl.platform}上收听 →
                      </a>
                    )}
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </>
      )}

      {/* Travel Photos */}
      {countries && countries.length > 0 && (
        <>
          <ScrollReveal>
            <h2 style={{
              textAlign: 'center', color: 'var(--heading-color)',
              marginBottom: '3rem', fontSize: '2rem', fontWeight: 800,
              fontFamily: "'Outfit', 'Noto Sans SC', 'Inter', 'Microsoft YaHei', sans-serif",
            }}>
              旅行
            </h2>
          </ScrollReveal>
          <div className="travel-country-pills" style={{
            flexWrap: 'wrap', gap: '0.75rem', marginBottom: '2rem', display: 'flex',
            justifyContent: 'center',
          }}>
            <button
              onClick={() => { setActiveCountry(''); setPhotoIndex(0); }}
              className={`travel-pill${activeCountry === '' ? ' travel-pill--active' : ''}`}
              style={{
                border: '2px solid var(--heading-color)',
                color: activeCountry === '' ? '#fff' : 'var(--heading-color)',
                background: activeCountry === '' ? 'var(--heading-color)' : 'transparent',
                cursor: 'pointer', borderRadius: 999, padding: '0.5rem 1.4rem',
                fontFamily: 'inherit', fontSize: '0.95rem', fontWeight: 600,
                transition: 'all 0.2s',
              }}
            >
              全部
            </button>
            {countries.map((c) => (
              <button
                key={c}
                onClick={() => { setActiveCountry(c); setPhotoIndex(0); }}
                className={`travel-pill${activeCountry === c ? ' travel-pill--active' : ''}`}
                style={{
                  border: '2px solid var(--heading-color)',
                  color: activeCountry === c ? '#fff' : 'var(--heading-color)',
                  background: activeCountry === c ? 'var(--heading-color)' : 'transparent',
                  cursor: 'pointer', borderRadius: 999, padding: '0.5rem 1.4rem',
                  fontFamily: 'inherit', fontSize: '0.95rem', fontWeight: 600,
                  transition: 'all 0.2s',
                }}
              >
                {c}
              </button>
            ))}
          </div>

          {filteredPhotos.length > 0 && (
            <div style={{ flexDirection: 'column', alignItems: 'center', gap: '3rem', display: 'flex' }}>
              {/* Stacked Photos */}
              <div style={{
                justifyContent: 'center', alignItems: 'center',
                width: '100%', height: 500, display: 'flex', position: 'relative',
                perspective: 800,
              }}>
                {filteredPhotos.map((photo, i) => {
                  const offset = i - photoIndex;
                  // wrap-around offsets: show photos before and after current
                  let displayOffset = offset;
                  if (Math.abs(offset) > filteredPhotos.length / 2) {
                    displayOffset = offset > 0 ? offset - filteredPhotos.length : offset + filteredPhotos.length;
                  }
                  const isTop = displayOffset === 0;
                  const absOffset = Math.abs(displayOffset);
                  if (absOffset > 3) return null; // only show nearby photos

                  return (
                    <div
                      key={photo.id}
                      onClick={() => {
                        if (!isTop) setPhotoIndex(i);
                      }}
                      style={{
                        position: 'absolute',
                        width: 280,
                        height: 380,
                        borderRadius: 16,
                        background: '#fff',
                        padding: '10px 10px 40px 10px',
                        boxShadow: isTop
                          ? '0 25px 60px rgba(0,0,0,0.25)'
                          : '0 10px 30px rgba(0,0,0,0.15)',
                        cursor: isTop ? 'default' : 'pointer',
                        zIndex: 10 - absOffset,
                        transform: `
                          rotate(${displayOffset * 5 - 2}deg)
                          translateX(${displayOffset * 30}px)
                          translateY(${absOffset * 12}px)
                          scale(${1 - absOffset * 0.06})
                        `,
                        transition: 'transform 0.4s cubic-bezier(0.25, 0.8, 0.25, 1.2), box-shadow 0.4s ease, z-index 0.4s',
                        opacity: absOffset > 2 ? 0 : 1 - absOffset * 0.2,
                      }}
                    >
                      <img
                        src={photo.image_path || 'https://placehold.co/260x320/f5f3ee/1a237e?text=Photo'}
                        alt={photo.caption}
                        style={{
                          width: '100%', height: '100%',
                          objectFit: 'cover', borderRadius: 10,
                          display: 'block',
                          userSelect: 'none',
                          pointerEvents: 'none',
                        }}
                      />
                    </div>
                  );
                })}
              </div>

              {/* Controls */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                <button
                  onClick={() => setPhotoIndex((prev) => (prev - 1 + filteredPhotos.length) % filteredPhotos.length)}
                  style={{
                    border: '2px solid var(--heading-color)', width: 44, height: 44,
                    color: 'var(--heading-color)', cursor: 'pointer', background: 'none',
                    borderRadius: '50%', justifyContent: 'center', alignItems: 'center',
                    display: 'flex', transition: 'all 0.2s',
                  }}
                >
                  <ChevronLeft size={22} />
                </button>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                  {photoIndex + 1} / {filteredPhotos.length}
                </span>
                <button
                  onClick={() => setPhotoIndex((prev) => (prev + 1) % filteredPhotos.length)}
                  style={{
                    border: '2px solid var(--heading-color)', width: 44, height: 44,
                    color: 'var(--heading-color)', cursor: 'pointer', background: 'none',
                    borderRadius: '50%', justifyContent: 'center', alignItems: 'center',
                    display: 'flex', transition: 'all 0.2s',
                  }}
                >
                  <ChevronRight size={22} />
                </button>
              </div>
              {currentPhoto?.caption && (
                <p style={{ color: 'var(--text-secondary)', textAlign: 'center', marginTop: '-1rem' }}>
                  {currentPhoto.caption}
                </p>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
