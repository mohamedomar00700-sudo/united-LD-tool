import React, { useState } from 'react';
import { Download, QrCode, FileText, Copy, Check, Smartphone, Sparkles, X, HelpCircle, Layers } from 'lucide-react';
import confetti from 'canvas-confetti';
import QRCode from 'qrcode';
import { downloadVCard, generateVCard3String } from '../utils/vcard.js';
import { downloadGoogleCsv, copyPhoneNumbersToClipboard } from '../utils/csv.js';

export default function ExportCard({ contacts, prefix, suffix, onOpenInstructions }) {
  const [copied, setCopied] = useState(false);
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState('');

  const count = contacts.length;
  const fileNameWave = prefix ? prefix.replace(/[\s\-\|]+/g, '_').trim() : 'Wave';
  const vcfFileName = `United_Pharmacy_${fileNameWave}_${count}_Contacts.vcf`;

  const handleDownloadVcf = async (version = '3.0') => {
    if (count === 0) return;

    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.7 }
      });
    } catch (e) {
      console.log(e);
    }

    await downloadVCard(contacts, prefix, suffix, vcfFileName, version);
  };

  const handleGenerateQr = async () => {
    if (count === 0) return;
    
    try {
      const vcardStr = generateVCard3String(contacts.slice(0, 15), prefix, suffix);
      
      const url = await QRCode.toDataURL(vcardStr, {
        width: 320,
        margin: 2,
        color: {
          dark: '#102354',
          light: '#ffffff'
        }
      });
      setQrDataUrl(url);
      setQrModalOpen(true);
    } catch (err) {
      console.error(err);
      setQrModalOpen(true);
    }
  };

  const handleCopyNumbers = () => {
    copyPhoneNumbersToClipboard(contacts);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleGoogleCsv = () => {
    downloadGoogleCsv(contacts, prefix, suffix, `United_Pharmacy_${fileNameWave}_Google.csv`);
  };

  return (
    <div className="glass-card" style={{
      padding: '1.75rem',
      marginBottom: '1.5rem',
      background: 'linear-gradient(135deg, rgba(22, 42, 100, 0.03) 0%, rgba(0, 191, 165, 0.08) 100%)',
      border: '1.5px solid rgba(0, 191, 165, 0.3)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #00bfa5 0%, #059669 100%)',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Smartphone size={20} />
            </div>
            <h2 style={{ fontSize: '1.3rem', fontWeight: '800', color: 'var(--text-main)', margin: 0 }}>
              تصدير وحفظ الأسماء فوراً على الهاتف
            </h2>
          </div>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginTop: '0.3rem', marginBottom: 0 }}>
            جاهز لحفظ {count} جهة اتصال بضغطة واحدة على هواتف أندرويد وآيفون وظهورهم في الواتساب
          </p>
        </div>

        <button 
          onClick={onOpenInstructions}
          className="btn btn-secondary btn-sm"
          style={{ fontSize: '0.82rem' }}
        >
          <HelpCircle size={15} style={{ color: 'var(--accent-teal)' }} />
          <span>طريقة فتح واستيراد الملف بالتفصيل</span>
        </button>
      </div>

      {/* Hero Action Buttons */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
        
        {/* Main CTA: Standard VCF 3.0 */}
        <button 
          onClick={() => handleDownloadVcf('3.0')}
          disabled={count === 0}
          className="btn btn-emerald btn-lg pulse-cta"
          style={{ padding: '0.9rem 1.25rem', justifyContent: 'space-between' }}
          title="الملف القياسي المعتمد لكافة أجهزة آيفون ومعظم أجهزة أندرويد الحديثة"
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Download size={22} />
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '1rem', fontWeight: '800' }}>تحميل VCF القياسي (vCard 3.0)</div>
              <div style={{ fontSize: '0.74rem', opacity: 0.9, fontWeight: '500' }}>الأنسب لآيفون وأندرويد الحديث</div>
            </div>
          </div>
          <Sparkles size={16} />
        </button>

        {/* Legacy VCF 2.1 */}
        <button 
          onClick={() => handleDownloadVcf('2.1')}
          disabled={count === 0}
          className="btn btn-secondary btn-lg"
          style={{ padding: '0.9rem 1.25rem', justifyContent: 'center' }}
          title="صيغة بديلة مخصصة لبعض أجهزة سامسونج أو أنظمة أندرويد التي تفضل vCard 2.1"
        >
          <Layers size={20} style={{ color: 'var(--primary-600)' }} />
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.92rem', fontWeight: '700' }}>تحميل VCF البديل (vCard 2.1)</div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>لهواتف سامسونج/أندرويد القديمة</div>
          </div>
        </button>

        {/* Google Contacts CSV */}
        <button 
          onClick={handleGoogleCsv}
          disabled={count === 0}
          className="btn btn-secondary btn-lg"
          style={{ padding: '0.9rem 1.25rem', justifyContent: 'center' }}
          title="استيراد مباشر في Google Contacts ومزامنته مع الهاتف"
        >
          <FileText size={20} style={{ color: '#0284c7' }} />
          <span>تصدير Google Contacts (CSV)</span>
        </button>

        {/* Copy All Numbers */}
        <button 
          onClick={handleCopyNumbers}
          disabled={count === 0}
          className="btn btn-secondary btn-lg"
          style={{ padding: '0.9rem 1.25rem', justifyContent: 'center' }}
        >
          {copied ? <Check size={20} style={{ color: '#10b981' }} /> : <Copy size={20} style={{ color: 'var(--accent-orange)' }} />}
          <span>{copied ? 'تم نسخ جميع الأرقام!' : 'نسخ الأرقام للواتساب'}</span>
        </button>

      </div>

      {/* Crucial Instructions Banner */}
      <div style={{
        background: 'var(--bg-card)',
        padding: '1rem 1.25rem',
        borderRadius: 'var(--radius-md)',
        border: '1px solid rgba(0, 191, 165, 0.3)',
        fontSize: '0.86rem',
        color: 'var(--text-main)',
        lineHeight: 1.6
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '800', color: 'var(--primary-700)', marginBottom: '0.4rem' }}>
          <span>📱</span>
          <span>إذا ظهرت لك رسالة "لا يمكن فتح الملف" (Can't open file) على الموبايل:</span>
        </div>
        <div style={{ paddingRight: '1rem', color: 'var(--text-muted)' }}>
          بعض متصفحات الموبايل لا تعرف التطبيق المسؤول عن فتح الملف عند النقر عليه من الإشعارات. <strong>الحل الأسرع والأضمن 100%:</strong>
          <ul style={{ marginTop: '0.3rem', paddingRight: '1.2rem' }}>
            <li>
              <strong>طريقة 1 (الأسهل):</strong> أرسل الملف لنفسك في محادثة على <strong>الواتساب</strong> واضغط عليه داخل الواتساب؛ سيفتحه الواتساب فوراً ويعرض لك زر <span style={{ color: '#10b981', fontWeight: '700' }}>"حفظ الكل"</span>.
            </li>
            <li>
              <strong>طريقة 2:</strong> افتح تطبيق <strong>جهات الاتصال (Contacts)</strong> على هاتفك ➔ اضغط على <strong>القائمة أو الإعدادات</strong> ➔ اختر <strong>"إدارة جهات الاتصال" (Manage Contacts)</strong> ثم <strong>"استيراد" (Import)</strong> ➔ اختر ملف الـ VCF من مجلد التحميلات (Downloads).
            </li>
          </ul>
        </div>
      </div>

      {/* QR Code Modal */}
      {qrModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.65)',
          backdropFilter: 'blur(5px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '1rem'
        }}>
          <div className="glass-card" style={{ maxWidth: '440px', width: '100%', padding: '1.75rem', position: 'relative' }}>
            <button 
              onClick={() => setQrModalOpen(false)}
              style={{
                position: 'absolute',
                top: '1rem',
                left: '1rem',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                color: 'var(--text-muted)'
              }}
            >
              <X size={20} />
            </button>

            <div style={{ textAlign: 'center', marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '800', marginBottom: '0.4rem' }}>
                نقل مباشر للموبايل عبر QR
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                امسح الكود بكاميرا هاتفك أو أرسل الملف لنفسك عبر الواتساب
              </p>
            </div>

            {qrDataUrl ? (
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.25rem' }}>
                <img 
                  src={qrDataUrl} 
                  alt="QR Code" 
                  style={{
                    borderRadius: 'var(--radius-md)',
                    boxShadow: 'var(--shadow-md)',
                    border: '1px solid var(--border-subtle)',
                    width: '240px',
                    height: '240px'
                  }} 
                />
              </div>
            ) : (
              <div style={{
                padding: '1.5rem',
                textAlign: 'center',
                background: 'rgba(0,0,0,0.03)',
                borderRadius: 'var(--radius-md)',
                marginBottom: '1rem'
              }}>
                <Smartphone size={40} style={{ color: 'var(--accent-teal)', marginBottom: '0.5rem' }} />
                <p style={{ fontSize: '0.9rem', fontWeight: '600' }}>
                  عدد جهات الاتصال كبير ({count} جهة)، الأفضل هو تحميل ملف VCF وإرساله عبر الواتساب لهاتفك.
                </p>
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              <button 
                onClick={() => handleDownloadVcf('3.0')} 
                className="btn btn-emerald"
                style={{ width: '100%' }}
              >
                <Download size={16} />
                <span>تحميل ملف VCF الآن</span>
              </button>
              <button 
                onClick={() => setQrModalOpen(false)} 
                className="btn btn-secondary"
                style={{ width: '100%' }}
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
