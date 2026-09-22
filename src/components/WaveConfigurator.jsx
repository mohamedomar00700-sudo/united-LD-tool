import React from 'react';
import { Tag, Sparkles, Filter, Globe, Check, Eye } from 'lucide-react';
import { formatContactName } from '../utils/parser';

const WAVE_PRESETS = [
  'Wave 1 - ',
  'Wave 2 - ',
  'Wave 3 - ',
  'Wave 4 - ',
  'Wave 5 - ',
  'Wave 6 - ',
  'Wave 7 - ',
  'Wave 8 - ',
  'Wave 9 - ',
  'Wave 10 - ',
  'دفعة 6 | ',
  'صيدليات المتحدة - '
];

export default function WaveConfigurator({
  prefix,
  setPrefix,
  suffix,
  setSuffix,
  countryCode,
  setCountryCode,
  onDeduplicate,
  duplicatesCount,
  sampleName
}) {
  const formattedSample = formatContactName(sampleName || 'د. أحمد محمود', prefix, suffix);

  return (
    <div className="glass-card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <h2 style={{ fontSize: '1.15rem', fontWeight: '700', color: 'var(--text-main)', margin: 0 }}>
              تخصيص وسم الدفعة (Wave Tagging & Formatting)
            </h2>
            <span className="chip chip-orange" style={{ fontSize: '0.75rem' }}>
              ميزة رئيسية ⭐
            </span>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>
            أضف علامة موحدة للدفعة لتمييزهم جميعاً على هاتفك وإنشاء جروب الواتساب في ثوانٍ
          </p>
        </div>

        {duplicatesCount > 0 && (
          <button 
            onClick={onDeduplicate} 
            className="btn btn-secondary btn-sm"
            style={{ color: '#d97706', borderColor: '#fde68a', background: '#fffbeb' }}
            title="حذف جهات الاتصال التي تحمل نفس رقم الموبايل"
          >
            <Filter size={15} />
            <span>حذف المكرر ({duplicatesCount} مكرر)</span>
          </button>
        )}
      </div>

      {/* Quick Wave Presets Chips */}
      <div style={{ marginBottom: '1.25rem' }}>
        <div style={{ fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>
          اختيار سريع لرقم الدفعة (Wave Presets):
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
          {WAVE_PRESETS.map((wave) => (
            <button
              key={wave}
              onClick={() => setPrefix(wave)}
              className={`chip ${prefix === wave ? 'active' : ''}`}
            >
              {prefix === wave && <Check size={13} />}
              {wave.replace(/ - | \| /, '')}
            </button>
          ))}
        </div>
      </div>

      {/* Input Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '1.25rem' }}>
        
        {/* Prefix Input */}
        <div>
          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.4rem' }}>
            بادئة الاسم (Prefix - قبل الاسم):
          </label>
          <input 
            type="text"
            value={prefix}
            onChange={(e) => setPrefix(e.target.value)}
            placeholder="مثلاً: Wave 6 - "
            className="input-field"
          />
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            تظهر في أول الاسم على الموبايل والواتساب
          </span>
        </div>

        {/* Suffix Input */}
        <div>
          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.4rem' }}>
            لاحقة الاسم (Suffix - بعد الاسم اختياري):
          </label>
          <input 
            type="text"
            value={suffix}
            onChange={(e) => setSuffix(e.target.value)}
            placeholder="مثلاً:  (صيدليات المتحدة)"
            className="input-field"
          />
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            تظهر في نهاية الاسم (اختياري)
          </span>
        </div>

        {/* Country Code Selector */}
        <div>
          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.4rem' }}>
            كود الدولة الافتراضي (Country Code):
          </label>
          <select 
            value={countryCode} 
            onChange={(e) => setCountryCode(e.target.value)}
            className="select-field"
          >
            <option value="+20">🇪🇬 مصر (+20)</option>
            <option value="+966">🇸🇦 السعودية (+966)</option>
            <option value="+971">🇦🇪 الإمارات (+971)</option>
            <option value="">🌐 بدون إضافة كود تلقائي</option>
          </select>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            يحول 010 إلى +2010 تلقائياً للواتساب
          </span>
        </div>

      </div>

      {/* Live Preview Box */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(22, 42, 100, 0.05) 0%, rgba(0, 191, 165, 0.06) 100%)',
        border: '1px solid rgba(0, 191, 165, 0.25)',
        borderRadius: 'var(--radius-md)',
        padding: '0.9rem 1.25rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '0.75rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <Eye size={18} style={{ color: 'var(--accent-teal)' }} />
          <span style={{ fontSize: '0.88rem', fontWeight: '600' }}>
            معاينة شكل الاسم عند حفظه بالهاتف والواتساب:
          </span>
        </div>
        <div style={{
          background: 'var(--bg-card)',
          padding: '0.4rem 0.9rem',
          borderRadius: 'var(--radius-sm)',
          boxShadow: 'var(--shadow-sm)',
          border: '1px solid var(--border-subtle)',
          fontWeight: '800',
          fontSize: '1rem',
          color: 'var(--primary-700)',
          letterSpacing: '-0.01em'
        }}>
          📱 {formattedSample}
        </div>
      </div>

    </div>
  );
}
