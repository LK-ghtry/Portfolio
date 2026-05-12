import { HashRouter, Routes, Route } from 'react-router-dom';
import DockNav from './components/layout/DockNav';
import AboutPage from './pages/AboutPage';
import ProjectsPage from './pages/ProjectsPage';
import InterestsPage from './pages/InterestsPage';
import ContactPage from './pages/ContactPage';
import WritingPage from './pages/WritingPage';
import MusicPlaylistPage from './pages/MusicPlaylistPage';
import AdminLogin from './pages/admin/AdminLogin';
import AdminLayout from './pages/admin/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import PersonalEditor from './pages/admin/PersonalEditor';
import TimelineEditor from './pages/admin/TimelineEditor';
import ProjectsEditor from './pages/admin/ProjectsEditor';
import SkillsEditor from './pages/admin/SkillsEditor';
import InterestsEditor from './pages/admin/InterestsEditor';
import GuestbookModerator from './pages/admin/GuestbookModerator';
import { AuthProvider } from './context/AuthContext';

function PublicLayout() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <div style={{ flex: 1 }}>
        <Routes>
          <Route path="/" element={<AboutPage />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/interests" element={<InterestsPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/writing" element={<WritingPage />} />
          <Route path="/music-playlist" element={<MusicPlaylistPage />} />
        </Routes>
      </div>
      <footer style={{
        textAlign: 'center', padding: '4rem 1rem 8rem',
        color: '#888', fontSize: '0.9rem',
        borderTop: '1px solid rgba(0,0,0,0.05)',
      }}>
        &copy; {new Date().getFullYear()} 李国宽 &middot; Built with React + Flask
      </footer>
      <DockNav />
    </div>
  );
}

export default function App() {
  return (
    <HashRouter>
      <AuthProvider>
        <Routes>
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin/*" element={<AdminLayout />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="personal" element={<PersonalEditor />} />
            <Route path="timeline" element={<TimelineEditor />} />
            <Route path="projects" element={<ProjectsEditor />} />
            <Route path="skills" element={<SkillsEditor />} />
            <Route path="interests" element={<InterestsEditor />} />
            <Route path="guestbook" element={<GuestbookModerator />} />
          </Route>
          <Route path="/*" element={<PublicLayout />} />
        </Routes>
      </AuthProvider>
    </HashRouter>
  );
}
