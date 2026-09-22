import React, { useState, useRef } from 'react';
import { FileSpreadsheet, ClipboardPaste, Image as ImageIcon, Upload, Sparkles, AlertCircle, CheckCircle } from 'lucide-react';
import * as XLSX from 'xlsx';
import { createWorker } from 'tesseract.js';
import { parseFreeText, normalizePhone, cleanName, isValidPhoneNumber } from '../utils/parser';

export default function InputTabs({ onAddContacts, countryCode }) {
  const [activeTab, setActiveTab] = useState('excel');
  const [pasteText, setPasteText] = useState('');
  
  // Excel states
  const [excelSheets, setExcelSheets] = useState([]);
  const [selectedSheet, setSelectedSheet] = useState('');
  const [rawRows, setRawRows] = useState([]);
  const [columns, setColumns] = useState([]);
  const [nameColumn, setNameColumn] = useState('');
  const [phoneColumn, setPhoneColumn] = useState('');
  const [excelFileName, setExcelFileName] = useState('');
  const fileInputRef = useRef(null);

  // OCR states
  const [ocrImage, setOcrImage] = useState(null);
  const [ocrProgress, setOcrProgress] = useState(0);
  const [ocrStatus, setOcrStatus] = useState('');
  const [isOcrLoading, setIsOcrLoading] = useState(false);
  const imageInputRef = useRef(null);

  // Handle Excel File Upload
  const handleExcelUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setExcelFileName(file.name);
    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const data = new Uint8Array(evt.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetNames = workbook.SheetNames;
        setExcelSheets(sheetNames);
        
        const firstSheetName = sheetNames[0];
        setSelectedSheet(firstSheetName);
        parseWorksheet(workbook.Sheets[firstSheetName]);
      } catch (err) {
        console.error(err);
        alert('حدث خطأ أثناء قراءة ملف الإكسيل. يرجى التأكد من صيغة الملف.');
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const parseWorksheet = (worksheet) => {
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: '' });
    if (!jsonData || jsonData.length === 0) {
      alert('الملف فارغ أو لا يحتوي على صفوف بيانات.');
      return;
    }

    setRawRows(jsonData);
    const detectedCols = Object.keys(jsonData[0]);
    setColumns(detectedCols);

    // Auto-detect Name Column
    const nameMatch = detectedCols.find(col => 
      /اسم|متدرب|موظف|دكتور|صيدلي|name|trainee|employee/i.test(col)
    ) || detectedCols[0];
    setNameColumn(nameMatch);

    // Auto-detect Phone Column
    const phoneMatch = detectedCols.find(col => 
      /هاتف|تليفون|موبايل|جوال|رقم|phone|mobile|tel|cell/i.test(col)
    ) || detectedCols.find(col => col !== nameMatch) || detectedCols[1] || detectedCols[0];
    setPhoneColumn(phoneMatch);
  };

  const applyExcelMapping = () => {
    if (!nameColumn || !phoneColumn) return;

    const parsedContacts = [];
    let idCounter = 1;

    for (const row of rawRows) {
      const rawName = String(row[nameColumn] || '').trim();
      const rawPhone = String(row[phoneColumn] || '').trim();

      if (!rawName && !rawPhone) continue;

      const formattedName = cleanName(rawName) || `متدرب ${idCounter}`;
      const formattedPhone = normalizePhone(rawPhone, countryCode);

      if (formattedPhone) {
        parsedContacts.push({
          id: 'contact_' + Date.now() + '_' + idCounter++,
          rawName: formattedName,
          rawPhone: formattedPhone,
          isValid: isValidPhoneNumber(formattedPhone)
        });
      }
    }

    if (parsedContacts.length === 0) {
      alert('لم يتم العثور على أرقام هواتف صالحة بناءً على الأعمدة المحددة.');
      return;
    }

    onAddContacts(parsedContacts, `تم استيراد ${parsedContacts.length} جهة اتصال من ملف الإكسيل بنجاح`);
    setRawRows([]);
    setExcelFileName('');
  };

  // Handle Smart Paste
  const handleSmartPaste = () => {
    if (!pasteText.trim()) return;

    const parsed = parseFreeText(pasteText, countryCode);
    if (parsed.length === 0) {
      alert('لم يتم العثور على جهات اتصال وأرقام هواتف في النص المدخل. يرجى التأكد من وجود أرقام تليفون في الأسطر.');
      return;
    }

    onAddContacts(parsed, `تم استخراج ${parsed.length} جهة اتصال من النص المنسوخ`);
    setPasteText('');
  };

  // Load Sample Demo Data
  const loadDemoData = () => {
    const demo = [
      '1. د. أحمد محمود عبد الرحمن - 01023456789',
      '2. د. فاطمة الزهراء إبراهيم - 01198765432',
      '3. د. مصطفى خالد الشريف - 01245678901',
      '4. د. سارة عادل عبد الله - 01555667788',
      '5. د. عمر شريف المنشاوي - 01099887766',
      '6. د. مريم حسن الخولي - 01112233445',
      '7. د. يوسف محمد القاضي - 01288776655',
      '8. د. نورهان طارق رضوان - 01533445566'
    ].join('\n');
    setPasteText(demo);
  };

  // Handle Image OCR
  const handleImageSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const imageUrl = URL.createObjectURL(file);
    setOcrImage(imageUrl);
  };

  const runOcr = async () => {
    if (!ocrImage) return;

    setIsOcrLoading(true);
    setOcrStatus('جاري تهيئة محرك التعرف الضوئي (Tesseract OCR)...');
    setOcrProgress(10);

    try {
      const worker = await createWorker('ara+eng', 1, {
        logger: (m) => {
          if (m.status === 'recognizing text') {
            setOcrStatus(`جاري قراءة وتحليل النص من الصورة: ${Math.round(m.progress * 100)}%`);
            setOcrProgress(Math.round(m.progress * 100));
          }
        }
      });

      const { data: { text } } = await worker.recognize(ocrImage);
      await worker.terminate();

      setOcrStatus('اكتملت قراءة الصورة بنجاح! جاري استخراج الأرقام...');
      const parsed = parseFreeText(text, countryCode);

      if (parsed.length === 0) {
        alert('تمت قراءة الصورة لكن لم يتم العثور على أرقام هواتف واضحة. يمكنك نسخ النص يدوياً وتعديله في تبويب "نسخ ولصق".');
        setPasteText(text);
        setActiveTab('paste');
      } else {
        onAddContacts(parsed, `تم استخراج ${parsed.length} جهة اتصال من الصورة عبر تقنية الذكاء الاصطناعي (OCR)`);
        setOcrImage(null);
      }
    } catch (err) {
      console.error(err);
      alert('حدث خطأ أثناء معالجة الصورة. يرجى التأكد من وضوح الصورة وجرب رفعها مرة أخرى أو استخدام النسخ واللصق.');
    } finally {
      setIsOcrLoading(false);
      setOcrProgress(0);
      setOcrStatus('');
    }
  };

  return (
    <div className="glass-card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
      
      {/* Tabs Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div>
          <h2 style={{ fontSize: '1.15rem', fontWeight: '700', color: 'var(--text-main)', margin: 0 }}>
            إدخال وتغذية بيانات المتدربين
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>
            اختر الطريقة الأنسب لك لإدخال قوائم الأسماء والأرقام
          </p>
        </div>

        <div className="tabs-container">
          <button 
            className={`tab-btn ${activeTab === 'excel' ? 'active' : ''}`}
            onClick={() => setActiveTab('excel')}
          >
            <FileSpreadsheet size={16} />
            <span>ملف إكسيل / CSV</span>
          </button>

          <button 
            className={`tab-btn ${activeTab === 'paste' ? 'active' : ''}`}
            onClick={() => setActiveTab('paste')}
          >
            <ClipboardPaste size={16} />
            <span>نسخ ولصق نصوص</span>
          </button>

          <button 
            className={`tab-btn ${activeTab === 'ocr' ? 'active' : ''}`}
            onClick={() => setActiveTab('ocr')}
          >
            <ImageIcon size={16} />
            <span>صورة / سكرين شوت (OCR)</span>
          </button>
        </div>
      </div>

      {/* Tab 1: Excel Import */}
      {activeTab === 'excel' && (
        <div className="fade-in">
          {!rawRows.length ? (
            <div 
              onClick={() => fileInputRef.current?.click()}
              style={{
                border: '2px dashed var(--border-subtle)',
                borderRadius: 'var(--radius-lg)',
                padding: '2.5rem 1.5rem',
                textAlign: 'center',
                cursor: 'pointer',
                background: 'rgba(0, 0, 0, 0.01)',
                transition: 'all 0.2s ease'
              }}
              onDragOver={(e) => { e.preventDefault(); e.currentTarget.style.borderColor = 'var(--accent-teal)'; }}
              onDragLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border-subtle)'; }}
              onDrop={(e) => {
                e.preventDefault();
                e.currentTarget.style.borderColor = 'var(--border-subtle)';
                if (e.dataTransfer.files?.[0]) {
                  const fakeEvent = { target: { files: e.dataTransfer.files } };
                  handleExcelUpload(fakeEvent);
                }
              }}
            >
              <input 
                ref={fileInputRef} 
                type="file" 
                accept=".xlsx, .xls, .csv" 
                style={{ display: 'none' }} 
                onChange={handleExcelUpload} 
              />
              <div style={{
                width: '60px',
                height: '60px',
                borderRadius: '16px',
                background: 'rgba(0, 191, 165, 0.1)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--accent-teal)',
                marginBottom: '1rem'
              }}>
                <Upload size={30} />
              </div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '0.4rem' }}>
                اضغط هنا لاختيار ملف الإكسيل أو اسحبه وأفلته هنا
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                يدعم صيغ <span style={{ fontWeight: '600' }}>.xlsx, .xls, .csv</span> حتى لو كان الملف يحتوي على أعمدة وترتيب مختلف
              </p>
            </div>
          ) : (
            <div style={{ background: 'rgba(0, 0, 0, 0.02)', padding: '1.25rem', borderRadius: 'var(--radius-md)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <FileSpreadsheet size={20} style={{ color: 'var(--accent-teal)' }} />
                  <span style={{ fontWeight: '700', fontSize: '0.95rem' }}>{excelFileName}</span>
                  <span className="chip" style={{ fontSize: '0.75rem' }}>{rawRows.length} صف تم قراءته</span>
                </div>
                <button 
                  onClick={() => { setRawRows([]); setExcelFileName(''); }} 
                  className="btn btn-subtle btn-sm"
                  style={{ color: '#ef4444' }}
                >
                  إلغاء واختيار ملف آخر
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem', marginBottom: '1.25rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.4rem' }}>
                    عمود الاسم (Name Column):
                  </label>
                  <select 
                    value={nameColumn} 
                    onChange={(e) => setNameColumn(e.target.value)}
                    className="select-field"
                  >
                    {columns.map(col => <option key={col} value={col}>{col}</option>)}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.4rem' }}>
                    عمود رقم الموبايل (Phone Column):
                  </label>
                  <select 
                    value={phoneColumn} 
                    onChange={(e) => setPhoneColumn(e.target.value)}
                    className="select-field"
                  >
                    {columns.map(col => <option key={col} value={col}>{col}</option>)}
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button onClick={applyExcelMapping} className="btn btn-primary">
                  <CheckCircle size={16} />
                  <span>تأكيد واستيراد المتدربين ({rawRows.length})</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Smart Paste */}
      {activeTab === 'paste' && (
        <div className="fade-in">
          <div style={{ marginBottom: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              الصق الأسماء والأرقام بأي شكل (سطر بسطر، مفصولة بشرطة، أو أرقام فقط)
            </span>
            <button 
              onClick={loadDemoData} 
              className="btn btn-secondary btn-sm"
              style={{ fontSize: '0.8rem' }}
            >
              <Sparkles size={14} style={{ color: 'var(--accent-teal)' }} />
              <span>تجربة بيانات عينة للصيادلة</span>
            </button>
          </div>

          <textarea 
            rows={6}
            value={pasteText}
            onChange={(e) => setPasteText(e.target.value)}
            placeholder="مثال:&#10;د. أحمد محمد - 01012345678&#10;د. سارة إبراهيم 01123456789&#10;د. محمود عبد الرحمن 01234567890"
            className="textarea-field"
            style={{ marginBottom: '1rem', resize: 'vertical' }}
          />

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
            {pasteText && (
              <button onClick={() => setPasteText('')} className="btn btn-subtle btn-sm">
                مسح
              </button>
            )}
            <button 
              onClick={handleSmartPaste} 
              className="btn btn-primary"
              disabled={!pasteText.trim()}
            >
              <Sparkles size={16} />
              <span>استخراج وتنسيق الأسماء والأرقام تلقائياً</span>
            </button>
          </div>
        </div>
      )}

      {/* Tab 3: Image OCR */}
      {activeTab === 'ocr' && (
        <div className="fade-in">
          {!ocrImage ? (
            <div 
              onClick={() => imageInputRef.current?.click()}
              style={{
                border: '2px dashed var(--border-subtle)',
                borderRadius: 'var(--radius-lg)',
                padding: '2.5rem 1.5rem',
                textAlign: 'center',
                cursor: 'pointer',
                background: 'rgba(0, 0, 0, 0.01)'
              }}
            >
              <input 
                ref={imageInputRef} 
                type="file" 
                accept="image/*" 
                style={{ display: 'none' }} 
                onChange={handleImageSelect} 
              />
              <div style={{
                width: '60px',
                height: '60px',
                borderRadius: '16px',
                background: 'rgba(245, 158, 11, 0.1)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--accent-orange)',
                marginBottom: '1rem'
              }}>
                <ImageIcon size={30} />
              </div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '0.4rem' }}>
                رفع سكرين شوت أو صورة تحتوي على أسماء وأرقام
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                يقوم محرك الذكاء الاصطناعي بقراءة النصوص والأرقام العربية والإنجليزية من الصورة فوراً
              </p>
            </div>
          ) : (
            <div>
              <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
                <div style={{ width: '180px', height: '130px', borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1px solid var(--border-subtle)' }}>
                  <img src={ocrImage} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: '700', fontSize: '1rem', marginBottom: '0.3rem' }}>
                    تم تحميل الصورة بنجاح
                  </div>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                    اضغط على "بدء قراءة النصوص واستخراج الأرقام" لبدء التعرف الضوئي.
                  </p>
                  <div style={{ display: 'flex', gap: '0.6rem' }}>
                    <button 
                      onClick={runOcr} 
                      className="btn btn-primary"
                      disabled={isOcrLoading}
                    >
                      <Sparkles size={16} />
                      <span>{isOcrLoading ? 'جاري المعالجة والتعرف...' : 'بدء قراءة النصوص واستخراج الأرقام'}</span>
                    </button>
                    <button 
                      onClick={() => setOcrImage(null)} 
                      className="btn btn-subtle btn-sm"
                      disabled={isOcrLoading}
                    >
                      اختيار صورة أخرى
                    </button>
                  </div>
                </div>
              </div>

              {isOcrLoading && (
                <div style={{ marginTop: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.3rem' }}>
                    <span>{ocrStatus}</span>
                    <span>{ocrProgress}%</span>
                  </div>
                  <div style={{ width: '100%', height: '8px', background: 'rgba(0,0,0,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ width: `${ocrProgress}%`, height: '100%', background: 'linear-gradient(90deg, #00bfa5, #0ea5e9)', transition: 'width 0.2s' }} />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

    </div>
  );
}
