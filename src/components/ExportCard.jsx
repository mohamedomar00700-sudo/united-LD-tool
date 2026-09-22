import React, { useState } from 'react';
import { Download, QrCode, FileText, Copy, Check, Smartphone, Sparkles, X, Share2, HelpCircle } from 'lucide-react';
import confetti from 'canvas-confetti';
import QRCode from 'qrcode';
import { downloadVCard } from '../utils/vcard';
import { downloadGoogleCsv, copyPhoneNumbersToClipboard } from '../utils/csv';

export default function ExportCard({ contacts, prefix, suffix, onOpenInstructions }) {
  const [copied, setCopied] = useState(false);
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState('');

  const count = contacts.length;
  const fileNameWave = prefix ? prefix.replace(/[\s\-\|]+/g, '_').trim() : 'Wave';
  const vcfFileName = `United_Pharmacy_${fileNameWave}_${count}_Contacts.vcf`;

  const handleDownloadVcf = () => {
    if (count === 0) return;

    // Trigger celebration confetti
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.7 }
      });
    } catch (e) {
      console.log(e);
    }

    downloadVCard(contacts, prefix, suffix, vcfFileName);
  };

  const handleGenerateQr = async () => {
    if (count === 0) return;
    
    // Create a local data URL representation or blob url for quick phone access
    try {
      // Create vcard blob
      const { generateVCardString } = await import('../utils/vcard');
      const vcardStr = generateVCardString(contacts.slice(0, 15), prefix, suffix);
      
      // If small enough, encode directly into QR, or show direct transfer guide
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
      // If vCard is too large for single QR, show the guide
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
          <span>كيف يفتح ملف VCF على الموبايل؟</span>
        </button>
      </div>

      {/* Hero Action Buttons */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem', marginBottom: '1.25rem' }}>
        
        {/* Main CTA: VCF Download */}
        <button 
          onClick={handleDownloadVcf}
          disabled={count === 0}
          className="btn btn-emerald btn-lg pulse-cta"
          style={{ padding: '1rem 1.5rem', justifyContent: 'space-between' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Download size={24} />
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '1.05rem', fontWeight: '800' }}>تحميل ملف VCF للموبايل</div>
              <div style={{ fontSize: '0.78rem', opacity: 0.9, fontWeight: '500' }}>حفظ كل الـ {count} اسم بنقرة واحدة</div>
            </div>
          </div>
          <Sparkles size={18} />
        </button>

        {/* QR Code Quick Transfer */}
        <button 
          onClick={handleGenerateQr}
          disabled={count === 0}
          className="btn btn-secondary btn-lg"
          style={{ padding: '1rem 1.25rem', justifyContent: 'center' }}
        >
          <QrCode size={22} style={{ color: 'var(--primary-600)' }} />
          <span>مسح كود QR بالهاتف</span>
        </button>

        {/* Google Contacts CSV */}
        <button 
          onClick={handleGoogleCsv}
          disabled={count === 0}
          className="btn btn-secondary btn-lg"
          style={{ padding: '1rem 1.25rem', justifyContent: 'center' }}
        >
          <FileText size={22} style={{ color: '#0284c7' }} />
          <span>تصدير Google Contacts (CSV)</span>
        </button>

        {/* Copy All Numbers */}
        <button 
          onClick={handleCopyNumbers}
          disabled={count === 0}
          className="btn btn-secondary btn-lg"
          style={{ padding: '1rem 1.25rem', justifyContent: 'center' }}
        >
          {copied ? <Check size={22} style={{ color: '#10b981' }} /> : <Copy size={22} style={{ color: 'var(--accent-orange)' }} />}
          <span>{copied ? 'تم نسخ جميع الأرقام!' : 'نسخ الأرقام للواتساب'}</span>
        </button>

      </div>

      {/* Explanation Banner */}
      <div style={{
        background: 'var(--bg-card)',
        padding: '0.85rem 1.2rem',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border-subtle)',
        fontSize: '0.84rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        color: 'var(--text-muted)'
      }}>
        <div style={{ color: 'var(--accent-teal)', fontWeight: '700', fontSize: '1rem' }}>💡</div>
        <div>
          <strong style={{ color: 'var(--text-main)' }}>طريقة الحفظ الأسرع على الإطلاق:</strong> قم بتحميل ملف <code style={{ color: 'var(--primary-600)', fontWeight: '700' }}>.vcf</code> وأرسله لنفسك على الواتساب أو تيليجرام وافتحه من الهاتف، سيطلب منك الهاتف مباشرة <span style={{ color: 'var(--accent-teal-dark)', fontWeight: '700' }}>"حفظ جهات الاتصال"</span> وستظهر كلها فوراً في الواتساب!
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
                onClick={handleDownloadVcf} 
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
