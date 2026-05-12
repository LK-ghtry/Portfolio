import { useEffect } from 'react';
import { Outlet, useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LayoutDashboard, User, Clock, FolderKanban, Wrench, Heart, MessageSquare, LogOut } from 'lucide-react';

const navItems = [
  { path: '/admin/dashboard', icon: LayoutDashboard, label: '仪表盘' },
  { path: '/admin/personal', icon: User, label: '个人信息' },
  { path: '/admin/timeline', icon: Clock, label: '时间线' },
  { path: '/admin/projects', icon: FolderKanban, label: '项目作品' },
  { path: '/admin/skills', icon: Wrench, label: '技能证书' },
  { path: '/admin/interests', icon: Heart, label: '兴趣内容' },
  { path: '/admin/guestbook', icon: MessageSquare, label: '留言管理' },
];

export default function AdminLayout() {
  const { isAuthenticated, logout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/admin', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) return null;

  const handleLogout = () => {
    logout();
    navigate('/admin');
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <aside style={{
        width: 240, backgroundColor: 'var(--heading-color)',
        color: '#fff', flexShrink: 0, display: 'flex',
        flexDirection: 'column', padding: '1.5rem 0',
      }}>
        <div style={{ padding: '0 1.5rem 1.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)', marginBottom: '1rem' }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 800 }}>管理后台</h2>
          <p style={{ fontSize: '0.85rem', opacity: 0.7, marginTop: '0.25rem' }}>{user?.username}</p>
        </div>
        <nav style={{ flex: 1 }}>
          {navItems.map(({ path, icon: Icon, label }) => (
            <Link
              key={path}
              to={path}
              style={{
                display: 'flex', alignItems: 'center', gap: '0.75rem',
                padding: '0.75rem 1.5rem', color: '#fff',
                textDecoration: 'none', fontSize: '0.95rem',
                backgroundColor: location.pathname === path ? 'rgba(255,255,255,0.15)' : 'transparent',
                transition: 'background-color 0.2s',
              }}
            >
              <Icon size={18} />
              {label}
            </Link>
          ))}
        </nav>
        <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <button onClick={handleLogout} style={{
            display: 'flex', alignItems: 'center', gap: '0.5rem',
            background: 'none', border: 'none', color: 'rgba(255,255,255,0.7)',
            cursor: 'pointer', fontSize: '0.9rem', padding: 0,
          }}>
            <LogOut size={16} /> 退出登录
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main style={{
        flex: 1, padding: '2rem 3rem',
        backgroundColor: 'var(--bg-color)',
        overflowY: 'auto',
      }}>
        <Outlet />
      </main>
    </div>
  );
}
