import React, { useState } from 'react';
import { MessageSquare, Link, Copy, Check, ExternalLink, Send, Users, Sparkles, CheckCircle2 } from 'lucide-react';
import { formatContactName } from '../utils/parser';

export default function WhatsAppAssistant({ prefix, sampleContact }) {
  const [groupLink, setGroupLink] = useState('');
  const [customMessage, setCustomMessage] = useState(
    'مرحباً د. {name}، نرحب بك في البرنامج التدريبي بصيدليات المتحدة ({wave}). يرجى الانضمام لجروب الواتساب الرسمي لمتابعة جدول المحاضرات والمواد التدريبية عبر الرابط التالي: {link}'
  );
  const [copiedMsg, setCopiedMsg] = useState(false);

  const waveLabel = prefix ? prefix.replace(/[\s\-\|]+/g, ' ').trim() : 'Wave التدريب';
  const previewName = sampleContact ? sampleContact.rawName : 'أحمد محمود';
  const formattedPreviewMsg = customMessage
    .replace('{name}', previewName)
    .replace('{wave}', waveLabel)
    .replace('{link}', groupLink || 'https://chat.whatsapp.com/EXAMPLE');

  const handleCopyMessage = () => {
    navigator.clipboard.writeText(formattedPreviewMsg);
    setCopiedMsg(true);
    setTimeout(() => setCopiedMsg(false), 2500);
  };

  const handleSendTestWa = () => {
    if (!sampleContact || !sampleContact.rawPhone) {
      alert('يرجى إضافة جهات اتصال أولاً لتجربة الإرسال');
      return;
    }
    const cleanPhone = sampleContact.rawPhone.replace(/[^\d]/g, '');
    const encoded = encodeURIComponent(formattedPreviewMsg);
    window.open(`https://wa.me/${cleanPhone}?text=${encoded}`, '_blank');
  };

  return (
    <div className="glass-card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <MessageSquare size={20} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.15rem', fontWeight: '800', color: 'var(--text-main)', margin: 0 }}>
              مساعد إنشاء ومراسلة جروب الواتساب (WhatsApp Group Assistant)
            </h2>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: 0 }}>
              كيف تجمع كل المتدربين في جروب واحد خلال ثوانٍ معدودة
            </p>
          </div>
        </div>

        <span className="chip" style={{ background: 'rgba(37, 211, 102, 0.1)', color: '#15803d', borderColor: 'rgba(37, 211, 102, 0.3)' }}>
          واتساب الذكي 💬
        </span>
      </div>

      {/* 3 Step Visual Guide */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
        gap: '1rem',
        marginBottom: '1.5rem'
      }}>
        
        {/* Step 1 */}
        <div style={{
          background: 'rgba(0,0,0,0.02)',
          padding: '1rem',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-subtle)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <span style={{
              width: '24px',
              height: '24px',
              borderRadius: '50%',
              background: 'var(--primary-600)',
              color: 'white',
              fontSize: '0.8rem',
              fontWeight: '700',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>1</span>
            <span style={{ fontWeight: '700', fontSize: '0.95rem' }}>حفظ ملف VCF على هاتفك</span>
          </div>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.5 }}>
            حمّل ملف الـ VCF وأرسله لنفسك على الواتساب؛ بفتحه سيتم تسجيل كافة الأسماء على الموبايل وتبدأ جميعها بـ <code style={{ color: 'var(--accent-teal-dark)', fontWeight: '700' }}>{prefix || 'Wave'}</code>.
          </p>
        </div>

        {/* Step 2 */}
        <div style={{
          background: 'rgba(0,0,0,0.02)',
          padding: '1rem',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-subtle)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <span style={{
              width: '24px',
              height: '24px',
              borderRadius: '50%',
              background: '#25D366',
              color: 'white',
              fontSize: '0.8rem',
              fontWeight: '700',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>2</span>
            <span style={{ fontWeight: '700', fontSize: '0.95rem' }}>إنشاء الجروب في 5 ثوانٍ</span>
          </div>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.5 }}>
            في الواتساب: اضغط "مجموعة جديدة" واكتب في البحث <code style={{ color: '#25D366', fontWeight: '700' }}>{prefix ? prefix.trim() : 'Wave'}</code> واضغط "تحديد الكل"؛ سيتم إضافة كل المتدربين دفعة واحدة!
          </p>
        </div>

        {/* Step 3 */}
        <div style={{
          background: 'rgba(0,0,0,0.02)',
          padding: '1rem',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-subtle)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <span style={{
              width: '24px',
              height: '24px',
              borderRadius: '50%',
              background: 'var(--accent-orange)',
              color: 'white',
              fontSize: '0.8rem',
              fontWeight: '700',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>3</span>
            <span style={{ fontWeight: '700', fontSize: '0.95rem' }}>دعوة عبر الرابط (اختياري)</span>
          </div>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.5 }}>
            يمكنك أيضاً نسخ رابط دعوة المجموعة وإرسال رسالة ترحيبية مخصصة لكل صيدلي ومتدرب بنقرة واحدة.
          </p>
        </div>

      </div>

      {/* Group Invite Link & Message Customizer */}
      <div style={{
        background: 'rgba(0,0,0,0.02)',
        padding: '1.25rem',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border-subtle)'
      }}>
        
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', marginBottom: '0.4rem' }}>
            رابط دعوة جروب الواتساب (WhatsApp Group Invite Link):
          </label>
          <div style={{ position: 'relative' }}>
            <input 
              type="text"
              value={groupLink}
              onChange={(e) => setGroupLink(e.target.value)}
              placeholder="مثال: https://chat.whatsapp.com/B123AbcDefGhi..."
              className="input-field"
              style={{ paddingLeft: '2.5rem' }}
            />
            <Link size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          </div>
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', marginBottom: '0.4rem' }}>
            قالب رسالة الدعوة والترحيب (مع تعويض تلقائي للاسم والدفعة):
          </label>
          <textarea 
            rows={3}
            value={customMessage}
            onChange={(e) => setCustomMessage(e.target.value)}
            className="textarea-field"
          />
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.3rem' }}>
            المتغيرات المتاحة: <code>{'{name}'}</code> (اسم المتدرب)، <code>{'{wave}'}</code> (رقم الدفعة)، <code>{'{link}'}</code> (رابط الجروب).
          </div>
        </div>

        {/* Live Message Preview */}
        <div style={{
          background: 'var(--bg-card)',
          padding: '1rem',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-subtle)',
          marginBottom: '1rem'
        }}>
          <div style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
            معاينة نص الرسالة المرسلة:
          </div>
          <div style={{
            fontSize: '0.9rem',
            color: 'var(--text-main)',
            whiteSpace: 'pre-wrap',
            background: 'rgba(37, 211, 102, 0.06)',
            padding: '0.75rem 1rem',
            borderRadius: 'var(--radius-sm)',
            borderRight: '3px solid #25D366'
          }}>
            {formattedPreviewMsg}
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
          <button 
            onClick={handleCopyMessage}
            className="btn btn-secondary btn-sm"
          >
            {copiedMsg ? <Check size={15} style={{ color: '#10b981' }} /> : <Copy size={15} />}
            <span>{copiedMsg ? 'تم نسخ نص الرسالة!' : 'نسخ نص الرسالة'}</span>
          </button>

          {sampleContact && (
            <button 
              onClick={handleSendTestWa}
              className="btn btn-whatsapp btn-sm"
              title="تجربة إرسال الرسالة لأول متدرب في القائمة عبر الواتساب"
            >
              <Send size={15} />
              <span>إرسال تجريبي لأول متدرب ({sampleContact.rawName})</span>
            </button>
          )}
        </div>

      </div>

    </div>
  );
}
