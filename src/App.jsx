import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import StatsBanner from './components/StatsBanner';
import InputTabs from './components/InputTabs';
import WaveConfigurator from './components/WaveConfigurator';
import ExportCard from './components/ExportCard';
import WhatsAppAssistant from './components/WhatsAppAssistant';
import ContactsTable from './components/ContactsTable';
import InstructionsModal from './components/InstructionsModal';
import { deduplicateContacts } from './utils/parser';

export default function App() {
  const [contacts, setContacts] = useState([]);
  const [prefix, setPrefix] = useState('Wave 6 - ');
  const [suffix, setSuffix] = useState('');
  const [countryCode, setCountryCode] = useState('+20');
  const [isDark, setIsDark] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Handle Theme Toggle
  useEffect(() => {
    if (isDark) {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  }, [isDark]);

  // Show Toast Message
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage('');
    }, 4000);
  };

  // Add new contacts from any input method
  const handleAddContacts = (newContacts, successMsg) => {
    setContacts(prev => [...prev, ...newContacts]);
    showToast(successMsg || `تمت إضافة ${newContacts.length} جهة اتصال جديدة بنجاح`);
  };

  // Update specific contact
  const handleUpdateContact = (id, updatedFields) => {
    setContacts(prev => prev.map(c => c.id === id ? { ...c, ...updatedFields } : c));
    showToast('تم تحديث بيانات جهة الاتصال');
  };

  // Delete contact
  const handleDeleteContact = (id) => {
    setContacts(prev => prev.filter(c => c.id !== id));
    showToast('تم حذف جهة الاتصال من القائمة');
  };

  // Deduplicate
  const handleDeduplicate = () => {
    const { unique, duplicatesCount } = deduplicateContacts(contacts);
    setContacts(unique);
    showToast(`تم إزالة ${duplicatesCount} جهة اتصال مكررة بنجاح`);
  };

  // Reset all
  const handleReset = () => {
    if (window.confirm('هل أنت متأكد من رغبتك في مسح القائمة الحالية والبدء من جديد؟')) {
      setContacts([]);
      showToast('تم تفريغ القائمة بنجاح');
    }
  };

  const { duplicatesCount } = deduplicateContacts(contacts);
  const sampleContact = contacts.length > 0 ? contacts[0] : null;

  return (
    <div>
      {/* Ambient background lighting */}
      <div className="bg-ambient-blob blob-1" />
      <div className="bg-ambient-blob blob-2" />

      <div className="app-container">
        
        {/* Header */}
        <Header 
          isDark={isDark} 
          setIsDark={setIsDark} 
          onOpenHelp={() => setIsHelpOpen(true)}
          onReset={handleReset}
          totalCount={contacts.length}
        />

        {/* Floating Toast Notification */}
        {toastMessage && (
          <div style={{
            position: 'fixed',
            bottom: '2rem',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'linear-gradient(135deg, #102354 0%, #162a64 100%)',
            color: 'white',
            padding: '0.75rem 1.5rem',
            borderRadius: 'var(--radius-full)',
            boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
            zIndex: 999,
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
            fontSize: '0.92rem',
            fontWeight: '600',
            border: '1px solid rgba(0, 191, 165, 0.4)'
          }} className="fade-in">
            <span style={{ color: 'var(--accent-teal)' }}>✨</span>
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Live Counters & Banner */}
        <StatsBanner 
          contacts={contacts} 
          prefix={prefix} 
          suffix={suffix} 
        />

        {/* 1. Input Sources Section */}
        <InputTabs 
          onAddContacts={handleAddContacts}
          countryCode={countryCode}
        />

        {/* 2. Wave Tagging & Customization */}
        <WaveConfigurator 
          prefix={prefix}
          setPrefix={setPrefix}
          suffix={suffix}
          setSuffix={setSuffix}
          countryCode={countryCode}
          setCountryCode={setCountryCode}
          onDeduplicate={handleDeduplicate}
          duplicatesCount={duplicatesCount}
          sampleName={sampleContact?.rawName}
        />

        {/* 3. Export Section */}
        <ExportCard 
          contacts={contacts}
          prefix={prefix}
          suffix={suffix}
          onOpenInstructions={() => setIsHelpOpen(true)}
        />

        {/* 4. WhatsApp Group Assistant */}
        <WhatsAppAssistant 
          prefix={prefix}
          sampleContact={sampleContact}
        />

        {/* 5. Contacts Table & Management */}
        <ContactsTable 
          contacts={contacts}
          onUpdateContact={handleUpdateContact}
          onDeleteContact={handleDeleteContact}
          prefix={prefix}
          suffix={suffix}
        />

        {/* Instructions Modal */}
        <InstructionsModal 
          isOpen={isHelpOpen}
          onClose={() => setIsHelpOpen(false)}
        />

        {/* Footer */}
        <footer style={{
          textAlign: 'center',
          padding: '2rem 0 1rem',
          color: 'var(--text-muted)',
          fontSize: '0.85rem'
        }}>
          <div>
            صُممت خصيصاً لإدارة التدريب والتطوير (L&D) - <strong>صيدليات المتحدة (United Pharmacy)</strong>
          </div>
          <div style={{ fontSize: '0.75rem', marginTop: '0.25rem', color: 'var(--text-subtle)' }}>
            جميع البيانات مشفرة وتُعالج بالكامل على جهازك محلياً لضمان الخصوصية والسرعة
          </div>
        </footer>

      </div>
    </div>
  );
}
