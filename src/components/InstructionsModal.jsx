import React from 'react';
import { X, Smartphone, Apple, CheckCircle2, MessageSquare, Zap, HelpCircle } from 'lucide-react';

export default function InstructionsModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.6)',
      backdropFilter: 'blur(5px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '1rem'
    }}>
      <div className="glass-card" style={{
        maxWidth: '680px',
        width: '100%',
        maxHeight: '90vh',
        overflowY: 'auto',
        padding: '2rem',
        position: 'relative'
      }}>
        <button 
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1.25rem',
            left: '1.25rem',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            color: 'var(--text-muted)'
          }}
        >
          <X size={22} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            background: 'rgba(0, 191, 165, 0.12)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--accent-teal)'
          }}>
            <HelpCircle size={24} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.3rem', fontWeight: '800', margin: 0 }}>
              دليل الاستخدام السريع لمنسق التدريب (L&D Guide)
            </h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>
              صيدليات المتحدة - كيف توفر 95% من وقت تسجيل المتدربين وإنشاء المجموعات
            </p>
          </div>
        </div>

        {/* Section 1: The Magic of VCF */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(22, 42, 100, 0.05) 0%, rgba(0, 191, 165, 0.06) 100%)',
          padding: '1.25rem',
          borderRadius: 'var(--radius-md)',
          marginBottom: '1.5rem',
          border: '1px solid rgba(0, 191, 165, 0.2)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '700', fontSize: '1rem', color: 'var(--primary-700)', marginBottom: '0.4rem' }}>
            <Zap size={18} style={{ color: 'var(--accent-orange)' }} />
            <span>ما هو ملف VCF ولماذا هو الحل الأسرع؟</span>
          </div>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-main)', margin: 0, lineHeight: 1.6 }}>
            ملف <code style={{ fontWeight: '700' }}>.vcf</code> (vCard) هو المعيار العالمي المعتمد في أنظمة Android و iOS لنقل جهات الاتصال. ملف واحد يمكن أن يحمل مئات المتدربين، وبمجرد نقره على هاتفك يقوم النظام بحفظ جميع الأسماء دفعة واحدة دون الحاجة لكتابة اسم واحد يدوياً.
          </p>
        </div>

        {/* Section 2: Step-by-Step on Mobile */}
        <h3 style={{ fontSize: '1.05rem', fontWeight: '800', marginBottom: '0.75rem' }}>
          خطوات الحفظ على الهاتف في 3 ثوانٍ:
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
          {/* Android */}
          <div style={{ background: 'rgba(0,0,0,0.02)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '700', color: '#10b981', marginBottom: '0.5rem' }}>
              <Smartphone size={18} />
              <span>هواتف أندرويد (سامسونج، شاومي وغيرها)</span>
            </div>
            <ol style={{ fontSize: '0.82rem', paddingRight: '1.2rem', color: 'var(--text-main)', lineHeight: 1.6 }}>
              <li>حمّل ملف VCF أو أرسله لنفسك في محادثة الواتساب.</li>
              <li>اضغط على الملف في الواتساب أو مدير الملفات.</li>
              <li>اختر تطبيق "جهات الاتصال" أو "حساب Google".</li>
              <li>اضغط <strong>"استيراد الكل" (Import all)</strong>. تم الحفظ فوراً!</li>
            </ol>
          </div>

          {/* iPhone */}
          <div style={{ background: 'rgba(0,0,0,0.02)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '700', color: 'var(--primary-600)', marginBottom: '0.5rem' }}>
              <Apple size={18} />
              <span>هواتف آبل آيفون (Apple iOS)</span>
            </div>
            <ol style={{ fontSize: '0.82rem', paddingRight: '1.2rem', color: 'var(--text-main)', lineHeight: 1.6 }}>
              <li>أرسل ملف VCF لنفسك على الواتساب أو تيليجرام.</li>
              <li>اضغط على الملف داخل المحادثة.</li>
              <li>سيظهر لك شريط في الأعلى به: <strong>"إضافة كل الـ XX جهة اتصال"</strong> (Add all contacts).</li>
              <li>اضغط عليها ثم تأكيد الحفظ!</li>
            </ol>
          </div>
        </div>

        {/* Section 3: WhatsApp Group Creation */}
        <div style={{ background: 'rgba(37, 211, 102, 0.08)', border: '1px solid rgba(37, 211, 102, 0.25)', padding: '1.25rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '700', color: '#15803d', marginBottom: '0.4rem' }}>
            <MessageSquare size={18} />
            <span>كيف تنشئ جروب الواتساب في 10 ثوانٍ بعد الحفظ؟</span>
          </div>
          <p style={{ fontSize: '0.86rem', color: 'var(--text-main)', margin: 0, lineHeight: 1.6 }}>
            بما أن الأداة وضعت بادئة موحدة مثل <code style={{ color: '#15803d', fontWeight: '700' }}>Wave 6</code> أمام كل الأسماء؛ عندما تفتح تطبيق واتساب وتضغط <span style={{ fontWeight: '700' }}>"مجموعة جديدة" (New Group)</span>:
            <br />
            اكتب في شريط البحث أعلى الشاشة: <strong>Wave 6</strong>، سيظهر لك فوراً جميع المتدربين فقط، حددهم جميعاً بضغطة زر وأنشئ المجموعة فوراً!
          </p>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button onClick={onClose} className="btn btn-primary">
            <CheckCircle2 size={16} />
            <span>فهمت، شكراً لك</span>
          </button>
        </div>

      </div>
    </div>
  );
}
