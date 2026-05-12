import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function AdminLogin() {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/admin/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const ok = await login(username, password);
    if (ok) {
      navigate('/admin/dashboard');
    } else {
      setError('用户名或密码错误');
    }
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex',
      justifyContent: 'center', alignItems: 'center',
      backgroundColor: 'var(--bg-color)',
    }}>
      <div style={{
        background: '#fff', borderRadius: 16, padding: '3rem',
        width: '100%', maxWidth: 400,
        boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
      }}>
        <h1 style={{
          textAlign: 'center', color: 'var(--heading-color)',
          marginBottom: '2rem', fontSize: '1.5rem', fontWeight: 800,
        }}>
          管理后台登录
        </h1>
        {error && (
          <div style={{
            backgroundColor: '#fee', color: '#c00', padding: '0.75rem',
            borderRadius: 8, marginBottom: '1rem', textAlign: 'center',
          }}>
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <input
            type="text"
            placeholder="用户名"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={{
              padding: '0.75rem 1rem', borderRadius: 8,
              border: '1px solid #ddd', fontSize: '1rem',
            }}
          />
          <input
            type="password"
            placeholder="密码"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              padding: '0.75rem 1rem', borderRadius: 8,
              border: '1px solid #ddd', fontSize: '1rem',
            }}
          />
          <button type="submit" style={{
            backgroundColor: 'var(--heading-color)',
            color: '#fff', border: 'none', borderRadius: 8,
            padding: '0.75rem', fontSize: '1rem', fontWeight: 600,
            cursor: 'pointer',
          }}>
            登录
          </button>
        </form>
        <p style={{ textAlign: 'center', marginTop: '1rem', color: '#999', fontSize: '0.85rem' }}>
          默认账号: admin / admin123
        </p>
      </div>
    </div>
  );
}
