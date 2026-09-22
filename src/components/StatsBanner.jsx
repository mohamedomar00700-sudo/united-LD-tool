import React from 'react';
import { Users, CheckCircle2, Tag, ShieldCheck } from 'lucide-react';
import { formatContactName } from '../utils/parser';

export default function StatsBanner({ contacts, prefix, suffix }) {
  const total = contacts.length;
  const validCount = contacts.filter(c => c.isValid).length;
  const sampleName = total > 0 ? formatContactName(contacts[0].rawName, prefix, suffix) : (prefix ? `${prefix} اسم المتدرب` : 'اسم المتدرب');

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
      gap: '1rem',
      marginBottom: '1.5rem'
    }}>
      {/* Stat 1: Total Contacts */}
      <div className="glass-card" style={{ padding: '1.1rem 1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={{
          width: '46px',
          height: '46px',
          borderRadius: '12px',
          background: 'rgba(22, 42, 100, 0.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--primary-600)'
        }}>
          <Users size={24} />
        </div>
        <div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '600' }}>إجمالي المتدربين</div>
          <div style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--text-main)', lineHeight: 1.2 }}>
            {total} <span style={{ fontSize: '0.85rem', fontWeight: '500', color: 'var(--text-muted)' }}>جهة اتصال</span>
          </div>
        </div>
      </div>

      {/* Stat 2: Valid Numbers */}
      <div className="glass-card" style={{ padding: '1.1rem 1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={{
          width: '46px',
          height: '46px',
          borderRadius: '12px',
          background: 'rgba(0, 191, 165, 0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--accent-teal)'
        }}>
          <CheckCircle2 size={24} />
        </div>
        <div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '600' }}>الأرقام الصالحة</div>
          <div style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--accent-teal)', lineHeight: 1.2 }}>
            {validCount} <span style={{ fontSize: '0.85rem', fontWeight: '500', color: 'var(--text-muted)' }}>جاهز للحفظ</span>
          </div>
        </div>
      </div>

      {/* Stat 3: Wave Tag Preview */}
      <div className="glass-card" style={{ padding: '1.1rem 1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={{
          width: '46px',
          height: '46px',
          borderRadius: '12px',
          background: 'rgba(245, 158, 11, 0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--accent-orange)'
        }}>
          <Tag size={24} />
        </div>
        <div style={{ overflow: 'hidden' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '600' }}>معاينة شكل الاسم بالهاتف</div>
          <div style={{
            fontSize: '0.95rem',
            fontWeight: '700',
            color: 'var(--text-main)',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}>
            {sampleName}
          </div>
        </div>
      </div>

      {/* Stat 4: Security Guarantee */}
      <div className="glass-card" style={{ padding: '1.1rem 1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={{
          width: '46px',
          height: '46px',
          borderRadius: '12px',
          background: 'rgba(56, 189, 248, 0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#0284c7'
        }}>
          <ShieldCheck size={24} />
        </div>
        <div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '600' }}>خصوصية البيانات</div>
          <div style={{ fontSize: '0.95rem', fontWeight: '700', color: '#0284c7', lineHeight: 1.2 }}>
            100% داخل المتصفح
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-subtle)' }}>لا تُرفع البيانات لأي خادم</div>
        </div>
      </div>
    </div>
  );
}
