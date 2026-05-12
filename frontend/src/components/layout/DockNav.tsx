import { useNavigate, useLocation } from 'react-router-dom';
import { User, FolderGit2, Sparkles, Mail } from 'lucide-react';

const items = [
  { path: '/', icon: User, label: '关于我' },
  { path: '/projects', icon: FolderGit2, label: '项目作品' },
  { path: '/interests', icon: Sparkles, label: '其他' },
  { path: '/contact', icon: Mail, label: '联系我' },
];

export default function DockNav() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="dock-outer">
      <div className="dock-panel" role="toolbar" aria-label="Application dock">
        {items.map(({ path, icon: Icon, label }) => (
          <div
            key={path}
            className={`dock-item${location.pathname === path ? ' active' : ''}`}
            role="button"
            tabIndex={0}
            onClick={() => navigate(path)}
            onKeyDown={(e) => e.key === 'Enter' && navigate(path)}
          >
            <div className="dock-icon">
              <Icon className="dock-svg" aria-hidden="true" size={24} />
            </div>
            <div className="dock-label">{label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
