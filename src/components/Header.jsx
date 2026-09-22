import React from 'react';
import { Moon, Sun, HelpCircle, RotateCcw, ShieldCheck, Sparkles } from 'lucide-react';

export default function Header({ isDark, setIsDark, onOpenHelp, onReset, totalCount }) {
  return (
    <header className="glass-card" style={{ padding: '1rem 1.75rem', marginBottom: '1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        
        {/* Brand & Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{
            width: '52px',
            height: '52px',
            borderRadius: '14px',
            background: 'linear-gradient(135deg, #102354 0%, #162a64 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(22, 42, 100, 0.25)',
            overflow: 'hidden',
            padding: '4px'
          }}>
            <img 
              src="/united-logo.png" 
              alt="صيدليات المتحدة" 
              style={{ width: '100%', height: '100%', objectFit: 'contain' }}
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <h1 style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--text-main)', letterSpacing: '-0.02em', margin: 0 }}>
                صيدليات المتحدة
              </h1>
              <span style={{
                background: 'linear-gradient(135deg, #00bfa5 0%, #0284c7 100%)',
                color: 'white',
                fontSize: '0.72rem',
                fontWeight: '700',
                padding: '0.2rem 0.6rem',
                borderRadius: '999px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.25rem'
              }}>
                <Sparkles size={12} />
                L&D Coordinator
              </span>
            </div>
            <p style={{ margin: 0, fontSize: '0.88rem', color: 'var(--text-muted)' }}>
              أداة تنظيم وحفظ جهات الاتصال ومجموعات الواتساب للتدريب والتطوير
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          {totalCount > 0 && (
            <button 
              onClick={onReset} 
              className="btn btn-secondary btn-sm"
              title="إعادة تعيين وبدء قائمة جديدة"
              style={{ color: '#ef4444' }}
            >
              <RotateCcw size={15} />
              <span>تفريغ القائمة</span>
            </button>
          )}

          <button 
            onClick={onOpenHelp} 
            className="btn btn-secondary btn-sm"
            title="طريقة الاستخدام وتسهيل جروب الواتساب"
          >
            <HelpCircle size={16} style={{ color: 'var(--accent-teal)' }} />
            <span>كيفية الاستخدام؟</span>
          </button>

          <button 
            onClick={() => setIsDark(!isDark)} 
            className="btn btn-secondary btn-sm"
            style={{ width: '38px', height: '38px', padding: 0 }}
            title={isDark ? 'الوضع الفاتح' : 'الوضع الليلي'}
          >
            {isDark ? <Sun size={17} style={{ color: '#f59e0b' }} /> : <Moon size={17} style={{ color: '#64748b' }} />}
          </button>
        </div>

      </div>
    </header>
  );
}
