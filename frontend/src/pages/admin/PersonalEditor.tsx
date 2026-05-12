import { useState, useEffect } from 'react';
import { useFetch } from '../../hooks/useFetch';
import type { PersonalInfo } from '../../types';
import client from '../../api/client';

export default function PersonalEditor() {
  const { data } = useFetch<PersonalInfo>('/personal');
  const [form, setForm] = useState<Partial<PersonalInfo>>({});
  const [msg, setMsg] = useState('');

  useEffect(() => { if (data) setForm(data); }, [data]);

  const handleChange = (field: keyof PersonalInfo, value: string) => {
    setForm((f) => ({ ...f, [field]: value }));
  };

  const handleSave = async () => {
    try {
      await client.put('/admin/personal', form);
      setMsg('保存成功');
      setTimeout(() => setMsg(''), 2000);
    } catch {
      setMsg('保存失败');
    }
  };

  const fields: { key: keyof PersonalInfo; label: string; type?: string }[] = [
    { key: 'name_cn', label: '中文名' },
    { key: 'name_en', label: '英文名' },
    { key: 'title', label: '职位/头衔' },
    { key: 'subtitle', label: '副标题（用 / 分隔多条）' },
    { key: 'location', label: '所在地' },
    { key: 'email', label: '邮箱' },
    { key: 'phone', label: '电话' },
    { key: 'career_goal', label: '求职意向' },
    { key: 'github_url', label: 'GitHub 链接' },
    { key: 'linkedin_url', label: 'LinkedIn 链接' },
    { key: 'twitter_url', label: 'Twitter 链接' },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ color: 'var(--heading-color)', fontSize: '1.8rem', fontWeight: 800 }}>个人信息</h1>
        <button onClick={handleSave} className="btn-primary">保存</button>
      </div>
      {msg && <div style={{ backgroundColor: '#e8f5e9', color: '#2e7d32', padding: '0.75rem', borderRadius: 8, marginBottom: '1rem' }}>{msg}</div>}
      <div style={{ display: 'grid', gap: '1rem', maxWidth: 600 }}>
        {fields.map(({ key, label }) => (
          <div key={key} style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            <label style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--heading-color)' }}>{label}</label>
            <input
              type="text"
              value={form[key] || ''}
              onChange={(e) => handleChange(key, e.target.value)}
              style={{ padding: '0.75rem', borderRadius: 8, border: '1px solid #ddd', fontSize: '1rem' }}
            />
          </div>
        ))}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          <label style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--heading-color)' }}>个人简介</label>
          <textarea
            value={form.bio || ''}
            onChange={(e) => handleChange('bio', e.target.value)}
            rows={5}
            style={{ padding: '0.75rem', borderRadius: 8, border: '1px solid #ddd', fontSize: '1rem', resize: 'vertical' }}
          />
        </div>
      </div>
    </div>
  );
}
