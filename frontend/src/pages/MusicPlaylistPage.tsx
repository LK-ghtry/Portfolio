import { Music, ExternalLink, Headphones } from 'lucide-react';
import { useFetch } from '../hooks/useFetch';
import type { Playlist } from '../types';
import ScrollReveal from '../components/layout/ScrollReveal';
import LoadingSpinner from '../components/shared/LoadingSpinner';

function PlaylistCard({ pl, idx }: { pl: Playlist; idx: number }) {
  return (
    <ScrollReveal delay={idx * 0.1}>
      <div className="playlist-card" style={{
        background: 'var(--card-bg)', borderRadius: 24,
        alignItems: 'center', gap: '2.5rem', padding: '2.5rem',
        transition: 'transform 0.3s', display: 'flex',
        boxShadow: '0 10px 40px rgba(0,0,0,0.04)',
        marginBottom: '1.5rem',
      }}>
        <div className="cd-container" style={{
          background: 'conic-gradient(#333, #555, #333, #111, #333)',
          borderRadius: '50%', flexShrink: 0,
          justifyContent: 'center', alignItems: 'center',
          width: 130, height: 130,
          animation: 'spin 4s linear infinite', display: 'flex',
          position: 'relative',
          boxShadow: '0 8px 20px rgba(0,0,0,0.3), inset 0 0 10px rgba(255,255,255,0.2)',
        }}>
          <div style={{
            background: 'var(--bg-color)', borderRadius: '50%',
            justifyContent: 'center', alignItems: 'center',
            width: 40, height: 40, display: 'flex', position: 'relative',
            boxShadow: 'inset 0 2px 5px rgba(0,0,0,0.5)',
          }}>
            <div style={{ background: '#222', borderRadius: '50%', width: 12, height: 12 }} />
          </div>
          <div style={{
            border: '1px solid rgba(255,255,255,0.1)', borderRadius: '50%',
            position: 'absolute', inset: '8%',
            boxShadow: 'inset 0 0 20px rgba(255,255,255,0.05)',
          }} />
        </div>

        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
            <Music size={18} color="var(--accent-color)" />
            <span style={{
              color: 'var(--accent-color)', fontSize: '0.9rem', fontWeight: 600,
              letterSpacing: '0.5px',
            }}>
              {pl.platform}
            </span>
          </div>
          <h3 style={{
            color: 'var(--heading-color)', marginBottom: '0.75rem',
            fontSize: '1.6rem', fontWeight: 800,
          }}>
            {pl.title}
          </h3>
          {pl.link_url ? (
            <a href={pl.link_url} target="_blank" rel="noopener noreferrer"
              className="btn-primary" style={{ marginTop: '0.5rem' }}>
              <ExternalLink size={16} /> 在{pl.platform}上收听
            </a>
          ) : (
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', fontStyle: 'italic' }}>
              链接待添加
            </p>
          )}
        </div>
      </div>
    </ScrollReveal>
  );
}

export default function MusicPlaylistPage() {
  const { data: playlists, loading } = useFetch<Playlist[]>('/playlists');

  if (loading) return <LoadingSpinner />;

  const hasPlaylists = playlists && playlists.length > 0;

  return (
    <div style={{ paddingBottom: '6rem' }}>
      <ScrollReveal>
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <div style={{ display: 'inline-flex', marginBottom: '1.5rem' }}>
            <Headphones size={48} color="var(--accent-color)" />
          </div>
          <h1 style={{
            color: 'var(--heading-color)', fontSize: '2.5rem', fontWeight: 800,
            fontFamily: "'Outfit', 'Noto Sans SC', 'Inter', 'Microsoft YaHei', sans-serif",
          }}>
            我的歌单
          </h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '1rem', fontSize: '1.05rem' }}>
            音乐是生活的配乐，分享一些常听的歌单
          </p>
        </div>
      </ScrollReveal>

      <div style={{ maxWidth: 700, margin: '0 auto' }}>
        {hasPlaylists ? (
          playlists.map((pl, idx) => <PlaylistCard key={pl.id} pl={pl} idx={idx} />)
        ) : (
          <ScrollReveal>
            <div style={{ textAlign: 'center', padding: '4rem 2rem', color: 'var(--text-secondary)' }}>
              <Music size={40} style={{ marginBottom: '1rem', opacity: 0.4 }} />
              <p style={{ fontSize: '1.1rem' }}>歌单正在整理中，稍后更新</p>
            </div>
          </ScrollReveal>
        )}
      </div>
    </div>
  );
}
