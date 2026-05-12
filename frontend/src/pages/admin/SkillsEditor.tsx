import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { useFetch } from '../../hooks/useFetch';
import type { Skill, Certification } from '../../types';
import client from '../../api/client';

function GenericListEditor<T extends { id: number }>({
  endpoint, title, fields, emptyItem,
}: {
  endpoint: string;
  title: string;
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

export default function SkillsEditor() {
  return (
    <div>
      <h1 style={{ color: 'var(--heading-color)', fontSize: '1.8rem', fontWeight: 800, marginBottom: '2rem' }}>技能与证书</h1>
      <GenericListEditor<Skill>
        endpoint="skills"
        title="技能"
        fields={[
          { key: 'name' as keyof Skill, label: '名称' },
          { key: 'category' as keyof Skill, label: '分类' },
        ]}
        emptyItem={() => ({ name: '', category: 'general' })}
      />
      <div style={{ marginTop: '3rem' }}>
        <GenericListEditor<Certification>
          endpoint="certifications"
          title="证书与荣誉"
          fields={[
            { key: 'title' as keyof Certification, label: '名称' },
            { key: 'issuer' as keyof Certification, label: '颁发机构' },
            { key: 'date' as keyof Certification, label: '日期' },
            { key: 'icon' as keyof Certification, label: '图标 (emoji)' },
          ]}
          emptyItem={() => ({ title: '', issuer: '', icon: '📜' })}
        />
      </div>
    </div>
  );
}
