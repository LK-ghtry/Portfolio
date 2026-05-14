import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { useFetch } from '../../hooks/useFetch';
import type { TimelineItem } from '../../types';
import client from '../../api/client';

const emptyItem = (): Partial<TimelineItem> => ({
  category: 'experience', title: '', subtitle: '', description: '',
  start_date: '', end_date: '', sort_order: 0,
});

export default function TimelineEditor() {
  const { data: items, loading } = useFetch<TimelineItem[]>('/timeline');
  const [list, setList] = useState<TimelineItem[]>([]);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState<Partial<TimelineItem>>(emptyItem());
  const [msg, setMsg] = useState('');

  useEffect(() => { if (items) setList(items); }, [items]);

  const openNew = () => {
    setEditId(null);
    setForm(emptyItem());
  };

  const openEdit = (item: TimelineItem) => {
    setEditId(item.id);
    setForm(item);
  };

  const handleSave = async () => {
    try {
      if (editId) {
        await client.put(`/admin/timeline/${editId}`, form);
      } else {
        await client.post('/admin/timeline', form);
      }
      setMsg('保存成功');
      setTimeout(() => { setMsg(''); window.location.reload(); }, 800);
    } catch {
      setMsg('保存失败');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('确认删除？')) return;
    await client.delete(`/admin/timeline/${id}`);
    setList((l) => l.filter((i) => i.id !== id));
  };

  if (loading) return <p>加载中...</p>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ color: 'var(--heading-color)', fontSize: '1.8rem', fontWeight: 800 }}>时间线管理</h1>
        <button onClick={openNew} style={{
          display: 'flex', alignItems: 'center', gap: '0.5rem',
          backgroundColor: 'var(--accent-color)', color: '#fff',
          border: 'none', borderRadius: 8, padding: '0.6rem 1.2rem',
          fontSize: '0.95rem', fontWeight: 600, cursor: 'pointer',
        }}>
          <Plus size={18} /> 新增
        </button>
      </div>
      {msg && <div style={{ backgroundColor: '#e8f5e9', color: '#2e7d32', padding: '0.75rem', borderRadius: 8, marginBottom: '1rem' }}>{msg}</div>}

      {/* List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2rem' }}>
        {list.map((item) => (
          <div key={item.id} style={{
            background: '#fff', borderRadius: 12, padding: '1rem 1.5rem',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
          }}>
            <div>
              <span style={{
                fontSize: '0.75rem', fontWeight: 700, padding: '2px 8px', borderRadius: 4,
                backgroundColor: item.category === 'experience' ? '#e3f2fd' : '#fce4ec',
                color: item.category === 'experience' ? 'var(--accent-color)' : '#e91e63',
                marginRight: '0.75rem',
              }}>
                {item.category === 'experience' ? '经历' : '教育'}
              </span>
              <strong style={{ color: 'var(--heading-color)' }}>{item.title}</strong>
              {item.subtitle && <span style={{ color: 'var(--text-secondary)', marginLeft: '0.5rem', fontSize: '0.9rem' }}>— {item.subtitle}</span>}
              <span style={{ color: '#999', marginLeft: '0.75rem', fontSize: '0.85rem' }}>{item.start_date} ~ {item.end_date}</span>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button onClick={() => openEdit(item)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--accent-color)' }}>
                <Edit2 size={16} />
              </button>
              <button onClick={() => handleDelete(item.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#e60012' }}>
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Form */}
      {(editId !== null || form.title !== undefined) && (
        <div style={{
          background: '#fff', borderRadius: 16, padding: '2rem',
          boxShadow: '0 10px 40px rgba(0,0,0,0.1)', marginTop: '1rem',
        }}>
          <h2 style={{ marginBottom: '1.5rem', color: 'var(--heading-color)' }}>
            {editId ? '编辑条目' : '新增条目'}
          </h2>
          <div style={{ display: 'grid', gap: '1rem', maxWidth: 600 }}>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600 }}>
                <input type="radio" name="cat" checked={form.category === 'experience'}
                  onChange={() => setForm((f) => ({ ...f, category: 'experience' }))} /> 经历
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600 }}>
                <input type="radio" name="cat" checked={form.category === 'education'}
                  onChange={() => setForm((f) => ({ ...f, category: 'education' }))} /> 教育
              </label>
            </div>
            <input placeholder="标题" value={form.title || ''}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              style={{ padding: '0.75rem', borderRadius: 8, border: '1px solid #ddd' }} />
            <input placeholder="副标题" value={form.subtitle || ''}
              onChange={(e) => setForm((f) => ({ ...f, subtitle: e.target.value }))}
              style={{ padding: '0.75rem', borderRadius: 8, border: '1px solid #ddd' }} />
            <textarea placeholder="描述" value={form.description || ''}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              rows={4}
              style={{ padding: '0.75rem', borderRadius: 8, border: '1px solid #ddd', resize: 'vertical' }} />
            <div style={{ display: 'flex', gap: '1rem' }}>
              <input placeholder="开始日期" value={form.start_date || ''}
                onChange={(e) => setForm((f) => ({ ...f, start_date: e.target.value }))}
                style={{ flex: 1, padding: '0.75rem', borderRadius: 8, border: '1px solid #ddd' }} />
              <input placeholder="结束日期" value={form.end_date || ''}
                onChange={(e) => setForm((f) => ({ ...f, end_date: e.target.value }))}
                style={{ flex: 1, padding: '0.75rem', borderRadius: 8, border: '1px solid #ddd' }} />
            </div>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <input placeholder="跳转链接 (URL 或本地文件路径如 files/xxx.pdf)" value={form.link_url || ''}
                onChange={(e) => setForm((f) => ({ ...f, link_url: e.target.value }))}
                style={{ flex: 2, padding: '0.75rem', borderRadius: 8, border: '1px solid #ddd' }} />
              <input placeholder="链接文字 (如 查看详情)" value={form.link_text || ''}
                onChange={(e) => setForm((f) => ({ ...f, link_text: e.target.value }))}
                style={{ flex: 1, padding: '0.75rem', borderRadius: 8, border: '1px solid #ddd' }} />
            </div>
            <button onClick={handleSave} className="btn-primary" style={{ alignSelf: 'flex-start' }}>保存</button>
          </div>
        </div>
      )}
    </div>
  );
}
