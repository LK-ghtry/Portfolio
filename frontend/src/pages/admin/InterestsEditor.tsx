import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { useFetch } from '../../hooks/useFetch';
import type { Interest, TravelPhoto, Playlist, Writing } from '../../types';
import client from '../../api/client';

function GenericEditor<T extends { id: number }>({
  endpoint, title, fields, emptyItem,
}: {
  endpoint: string; title: string;
  fields: { key: keyof T; label: string }[];
  emptyItem: () => Partial<T>;
}) {
  const { data: items, loading } = useFetch<T[]>(`/${endpoint}`);
  const [list, setList] = useState<T[]>([]);
  const [editItem, setEditItem] = useState<Partial<T> | null>(null);
  const [editId, setEditId] = useState<number | null>(null);
  const [msg, setMsg] = useState('');

  useEffect(() => { if (items) setList(items); }, [items]);

  const handleSave = async () => {
    if (!editItem) return;
    try {
      if (editId) {
        await client.put(`/admin/${endpoint}/${editId}`, editItem);
      } else {
        await client.post(`/admin/${endpoint}`, editItem);
      }
      setMsg('保存成功');
      setTimeout(() => { setMsg(''); window.location.reload(); }, 800);
    } catch { setMsg('保存失败'); }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('确认删除？')) return;
    await client.delete(`/admin/${endpoint}/${id}`);
    setList((l) => l.filter((i) => i.id !== id));
  };

  if (loading) return <p>加载中...</p>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <h2 style={{ color: 'var(--heading-color)', fontSize: '1.5rem', fontWeight: 800 }}>{title}</h2>
        <button onClick={() => { setEditId(null); setEditItem(emptyItem()); }}
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: 'var(--accent-color)', color: '#fff', border: 'none', borderRadius: 8, padding: '0.5rem 1rem', cursor: 'pointer' }}>
          <Plus size={18} /> 新增
        </button>
      </div>
      {msg && <div style={{ backgroundColor: '#e8f5e9', color: '#2e7d32', padding: '0.75rem', borderRadius: 8, marginBottom: '1rem' }}>{msg}</div>}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2rem' }}>
        {list.map((item) => (
          <div key={item.id} style={{ background: '#fff', borderRadius: 12, padding: '1rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
            <span style={{ fontWeight: 600, color: 'var(--heading-color)' }}>
              {String(item[fields[0]?.key as keyof T] || '')}
            </span>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button onClick={() => { setEditId(item.id); setEditItem(item); }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--accent-color)' }}><Edit2 size={16} /></button>
              <button onClick={() => handleDelete(item.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#e60012' }}><Trash2 size={16} /></button>
            </div>
          </div>
        ))}
      </div>
      {editItem && (
        <div style={{ background: '#fff', borderRadius: 16, padding: '2rem', boxShadow: '0 10px 40px rgba(0,0,0,0.1)' }}>
          <h3 style={{ marginBottom: '1.5rem' }}>{editId ? '编辑' : '新增'}</h3>
          <div style={{ display: 'grid', gap: '1rem', maxWidth: 600 }}>
            {fields.map(({ key, label }) => (
              <div key={String(key)}>
                <label style={{ fontWeight: 600, fontSize: '0.9rem', display: 'block', marginBottom: '0.25rem' }}>{label}</label>
                <input type="text" value={String(editItem[key] || '')}
                  onChange={(e) => setEditItem((f) => f ? { ...f, [key]: e.target.value } : null)}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: 8, border: '1px solid #ddd' }} />
              </div>
            ))}
            <button onClick={handleSave} className="btn-primary" style={{ alignSelf: 'flex-start' }}>保存</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function InterestsEditor() {
  return (
    <div>
      <h1 style={{ color: 'var(--heading-color)', fontSize: '1.8rem', fontWeight: 800, marginBottom: '2rem' }}>兴趣内容管理</h1>
      <GenericEditor<Interest>
        endpoint="interests"
        title="兴趣卡片"
        fields={[
          { key: 'title' as keyof Interest, label: '标题' },
          { key: 'description' as keyof Interest, label: '描述' },
          { key: 'icon_name' as keyof Interest, label: '图标名 (lucide)' },
          { key: 'icon_color' as keyof Interest, label: '图标颜色' },
          { key: 'link_url' as keyof Interest, label: '链接地址' },
          { key: 'link_text' as keyof Interest, label: '链接文字' },
        ]}
        emptyItem={() => ({ title: '', description: '', icon_name: 'Star', icon_color: 'var(--accent-color)' })}
      />
      <div style={{ marginTop: '3rem' }}>
        <GenericEditor<Playlist>
          endpoint="playlists"
          title="音乐播放列表"
          fields={[
            { key: 'title' as keyof Playlist, label: '标题' },
            { key: 'platform' as keyof Playlist, label: '平台' },
            { key: 'link_url' as keyof Playlist, label: '链接' },
          ]}
          emptyItem={() => ({ title: '', platform: '网易云音乐' })}
        />
      </div>
      <div style={{ marginTop: '3rem' }}>
        <GenericEditor<TravelPhoto>
          endpoint="travel-photos"
          title="旅行照片"
          fields={[
            { key: 'country' as keyof TravelPhoto, label: '国家/地区' },
            { key: 'image_path' as keyof TravelPhoto, label: '图片路径' },
            { key: 'caption' as keyof TravelPhoto, label: '说明文字' },
          ]}
          emptyItem={() => ({ country: '', image_path: '', caption: '' })}
        />
      </div>
      <div style={{ marginTop: '3rem' }}>
        <GenericEditor<Writing>
          endpoint="writings"
          title="文章写作"
          fields={[
            { key: 'title' as keyof Writing, label: '标题' },
            { key: 'url' as keyof Writing, label: '链接' },
            { key: 'description' as keyof Writing, label: '描述' },
            { key: 'platform' as keyof Writing, label: '平台' },
          ]}
          emptyItem={() => ({ title: '', url: '', description: '', platform: '' })}
        />
      </div>
    </div>
  );
}
