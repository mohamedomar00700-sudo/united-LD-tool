import React, { useState } from 'react';
import { Search, Trash2, Edit2, MessageSquare, Check, X, AlertTriangle, UserCheck, PhoneCall } from 'lucide-react';
import { formatContactName, isValidPhoneNumber } from '../utils/parser';

export default function ContactsTable({
  contacts,
  onUpdateContact,
  onDeleteContact,
  prefix,
  suffix
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');

  // Filter contacts by search query
  const filtered = contacts.filter((c) => {
    const formatted = formatContactName(c.rawName, prefix, suffix).toLowerCase();
    const phone = (c.rawPhone || '').toLowerCase();
    const q = searchQuery.toLowerCase();
    return formatted.includes(q) || phone.includes(q);
  });

  const startEdit = (c) => {
    setEditingId(c.id);
    setEditName(c.rawName);
    setEditPhone(c.rawPhone);
  };

  const saveEdit = (id) => {
    onUpdateContact(id, {
      rawName: editName.trim(),
      rawPhone: editPhone.trim(),
      isValid: isValidPhoneNumber(editPhone.trim())
    });
    setEditingId(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  const openWhatsApp = (phone, name) => {
    const cleanPhone = phone.replace(/[^\d]/g, '');
    const text = encodeURIComponent(`مرحباً د. ${name}، بخصوص برنامج التدريب والتطوير بصيدليات المتحدة.`);
    window.open(`https://wa.me/${cleanPhone}?text=${text}`, '_blank');
  };

  return (
    <div className="glass-card" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
      
      {/* Table Header & Search */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <h2 style={{ fontSize: '1.15rem', fontWeight: '800', color: 'var(--text-main)', margin: 0 }}>
              قائمة المتدربين وجهات الاتصال
            </h2>
            <span className="chip" style={{ fontSize: '0.8rem' }}>
              {filtered.length} من {contacts.length}
            </span>
          </div>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: 0 }}>
            يمكنك البحث أو تعديل أي اسم ورقم مباشرة قبل التصدير
          </p>
        </div>

        {/* Search Input */}
        <div style={{ position: 'relative', width: '280px', maxWidth: '100%' }}>
          <input 
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="بحث بالاسم أو رقم الهاتف..."
            className="input-field"
            style={{ paddingLeft: '2.4rem', fontSize: '0.88rem' }}
          />
          <Search size={16} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              style={{
                position: 'absolute',
                right: '0.75rem',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'transparent',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer'
              }}
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Table Content */}
      {contacts.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem 1.5rem', color: 'var(--text-muted)' }}>
          <UserCheck size={40} style={{ opacity: 0.3, marginBottom: '0.75rem' }} />
          <h3 style={{ fontSize: '1.05rem', fontWeight: '700', marginBottom: '0.3rem' }}>
            لا توجد جهات اتصال مضافة حتى الآن
          </h3>
          <p style={{ fontSize: '0.85rem' }}>
            قم برفع ملف إكسيل، أو لصق قائمة الأسماء، أو تجربة نموذج جاهز للبدء
          </p>
        </div>
      ) : (
        <div style={{ overflowX: 'auto', maxHeight: '420px', overflowY: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'right' }}>
            <thead>
              <tr style={{
                position: 'sticky',
                top: 0,
                background: 'var(--bg-card)',
                backdropFilter: 'blur(8px)',
                borderBottom: '2px solid var(--border-subtle)',
                color: 'var(--text-muted)',
                fontSize: '0.82rem',
                fontWeight: '700'
              }}>
                <th style={{ padding: '0.75rem 1rem' }}>#</th>
                <th style={{ padding: '0.75rem 1rem' }}>الاسم المحفوظ (مع الوسم)</th>
                <th style={{ padding: '0.75rem 1rem' }}>رقم الهاتف / الواتساب</th>
                <th style={{ padding: '0.75rem 1rem' }}>الحالة</th>
                <th style={{ padding: '0.75rem 1rem', textAlign: 'center' }}>إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c, index) => {
                const isEditing = editingId === c.id;
                const formattedName = formatContactName(c.rawName, prefix, suffix);

                return (
                  <tr 
                    key={c.id} 
                    style={{
                      borderBottom: '1px solid var(--border-subtle)',
                      transition: 'background-color 0.15s'
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(0,0,0,0.015)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                  >
                    <td style={{ padding: '0.75rem 1rem', fontSize: '0.82rem', color: 'var(--text-subtle)', width: '40px' }}>
                      {index + 1}
                    </td>

                    {/* Name Column */}
                    <td style={{ padding: '0.75rem 1rem', fontWeight: '600' }}>
                      {isEditing ? (
                        <input 
                          type="text" 
                          value={editName} 
                          onChange={(e) => setEditName(e.target.value)}
                          className="input-field"
                          style={{ padding: '0.35rem 0.6rem', fontSize: '0.88rem' }}
                        />
                      ) : (
                        <div>
                          <span style={{ color: 'var(--text-main)' }}>{formattedName}</span>
                          {prefix && (
                            <span style={{ fontSize: '0.72rem', color: 'var(--accent-teal)', display: 'block' }}>
                              الأصل: {c.rawName}
                            </span>
                          )}
                        </div>
                      )}
                    </td>

                    {/* Phone Column */}
                    <td style={{ padding: '0.75rem 1rem', direction: 'ltr', textAlign: 'right', fontFamily: 'Outfit, monospace', fontWeight: '600' }}>
                      {isEditing ? (
                        <input 
                          type="text" 
                          value={editPhone} 
                          onChange={(e) => setEditPhone(e.target.value)}
                          className="input-field"
                          style={{ padding: '0.35rem 0.6rem', fontSize: '0.88rem', direction: 'ltr' }}
                        />
                      ) : (
                        <span style={{ color: 'var(--primary-600)' }}>{c.rawPhone}</span>
                      )}
                    </td>

                    {/* Status Column */}
                    <td style={{ padding: '0.75rem 1rem' }}>
                      {c.isValid ? (
                        <span className="chip" style={{ fontSize: '0.72rem', padding: '0.15rem 0.5rem' }}>
                          صحيح
                        </span>
                      ) : (
                        <span className="chip chip-orange" style={{ fontSize: '0.72rem', padding: '0.15rem 0.5rem' }}>
                          <AlertTriangle size={12} />
                          تحقق من الرقم
                        </span>
                      )}
                    </td>

                    {/* Actions Column */}
                    <td style={{ padding: '0.75rem 1rem', textAlign: 'center', width: '130px' }}>
                      {isEditing ? (
                        <div style={{ display: 'flex', gap: '0.3rem', justifyContent: 'center' }}>
                          <button 
                            onClick={() => saveEdit(c.id)}
                            className="btn btn-emerald btn-sm"
                            style={{ padding: '0.3rem 0.5rem' }}
                            title="حفظ التعديل"
                          >
                            <Check size={14} />
                          </button>
                          <button 
                            onClick={cancelEdit}
                            className="btn btn-secondary btn-sm"
                            style={{ padding: '0.3rem 0.5rem' }}
                            title="إلغاء"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ) : (
                        <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'center' }}>
                          <button 
                            onClick={() => openWhatsApp(c.rawPhone, c.rawName)}
                            className="btn btn-whatsapp btn-sm"
                            style={{ padding: '0.3rem 0.5rem' }}
                            title="مراسلة سريعة عبر الواتساب"
                          >
                            <MessageSquare size={14} />
                          </button>

                          <button 
                            onClick={() => startEdit(c)}
                            className="btn btn-secondary btn-sm"
                            style={{ padding: '0.3rem 0.5rem' }}
                            title="تعديل الاسم أو الرقم"
                          >
                            <Edit2 size={14} />
                          </button>

                          <button 
                            onClick={() => onDeleteContact(c.id)}
                            className="btn btn-subtle btn-sm"
                            style={{ padding: '0.3rem 0.5rem', color: '#ef4444' }}
                            title="حذف من القائمة"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      )}
                    </td>

                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

    </div>
  );
}
