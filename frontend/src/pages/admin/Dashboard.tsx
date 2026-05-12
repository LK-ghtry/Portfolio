import { useFetch } from '../../hooks/useFetch';
import type { AdminStats } from '../../types';

export default function Dashboard() {
  const { data: stats, loading } = useFetch<AdminStats>('/admin/stats');

  return (
    <div>
      <h1 style={{ color: 'var(--heading-color)', fontSize: '1.8rem', fontWeight: 800, marginBottom: '2rem' }}>
        仪表盘
      </h1>
      {loading ? (
        <p>加载中...</p>
      ) : stats ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
          <StatCard label="待审核留言" value={stats.pending_messages} color="#e60012" />
          <StatCard label="项目总数" value={stats.total_projects} color="var(--accent-color)" />
          <StatCard label="时间线条目" value={stats.total_timeline} color="var(--heading-color)" />
          <StatCard label="技能数量" value={stats.total_skills} color="#4caf50" />
          <StatCard label="兴趣内容" value={stats.total_interests} color="#ff9800" />
        </div>
      ) : (
        <p style={{ color: 'var(--text-secondary)' }}>无法加载统计数据</p>
      )}
    </div>
  );
}

function StatCard({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div style={{
      background: '#fff', borderRadius: 12, padding: '1.5rem',
      boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
    }}>
      <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>{label}</p>
      <p style={{ color, fontSize: '2.5rem', fontWeight: 800 }}>{value}</p>
    </div>
  );
}
