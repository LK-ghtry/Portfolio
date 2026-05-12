import { useState, useEffect } from 'react';
import { Check, X, Pin, Trash2 } from 'lucide-react';
import client from '../../api/client';

interface GMessage {
  id: number;
  author_name: string;
  message: string;
  is_approved: boolean;
  is_pinned: boolean;
  created_at: string;
}

export default function GuestbookModerator() {
  const [messages, setMessages] = useState<GMessage[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMessages = async () => {
    try {
      const res = await client.get('/admin/guestbook');
      setMessages(res.data);
    } catch { /* ignore */ }
    setLoading(false);
  };

  useEffect(() => { fetchMessages(); }, []);

  const toggleApproved = async (msg: GMessage) => {
    await client.put(`/admin/guestbook/${msg.id}`, { is_approved: !msg.is_approved });
    fetchMessages();
  };

  const togglePinned = async (msg: GMessage) => {
    await client.put(`/admin/guestbook/${msg.id}`, { is_pinned: !msg.is_pinned });
    fetchMessages();
  };

  const handleDelete = async (id: number) => {
    if (!confirm('确认删除？')) return;
    await client.delete(`/admin/guestbook/${id}`);
    fetchMessages();
  };

  if (loading) return <p>加载中...</p>;

  return (
    <div>
      <h1 style={{ color: 'var(--heading-color)', fontSize: '1.8rem', fontWeight: 800, marginBottom: '2rem' }}>留言管理</h1>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {messages.map((msg) => (
          <div key={msg.id} style={{
            background: msg.is_approved ? '#fff' : '#fffde7',
            borderRadius: 12, padding: '1.5rem',
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
            border: msg.is_pinned ? '2px solid var(--accent-color)' : '1px solid transparent',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
              <div>
                <strong style={{ color: 'var(--heading-color)' }}>{msg.author_name}</strong>
                <span style={{ marginLeft: '0.75rem', fontSize: '0.85rem', color: '#999' }}>
                  {new Date(msg.created_at).toLocaleString('zh-CN')}
                </span>
                {!msg.is_approved && (
                  <span style={{ marginLeft: '0.75rem', backgroundColor: '#ffeb3b', padding: '2px 8px', borderRadius: 4, fontSize: '0.8rem', fontWeight: 600 }}>待审核</span>
                )}
                {msg.is_pinned && (
                  <span style={{ marginLeft: '0.5rem', backgroundColor: 'var(--accent-color)', color: '#fff', padding: '2px 8px', borderRadius: 4, fontSize: '0.8rem', fontWeight: 600 }}>已置顶</span>
                )}
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button onClick={() => toggleApproved(msg)} title={msg.is_approved ? '驳回' : '通过'}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: msg.is_approved ? '#ff9800' : '#4caf50' }}>
                  {msg.is_approved ? <X size={16} /> : <Check size={16} />}
                </button>
                <button onClick={() => togglePinned(msg)} title={msg.is_pinned ? '取消置顶' : '置顶'}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: msg.is_pinned ? 'var(--accent-color)' : '#999' }}>
                  <Pin size={16} />
                </button>
                <button onClick={() => handleDelete(msg.id)} title="删除"
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#e60012' }}>
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
            <p style={{ color: 'var(--text-color)', lineHeight: 1.6 }}>{msg.message}</p>
          </div>
        ))}
        {messages.length === 0 && (
          <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '3rem' }}>暂无留言</p>
        )}
      </div>
    </div>
  );
}
