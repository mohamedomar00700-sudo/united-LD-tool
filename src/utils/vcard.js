// vCard generation utility supporting clean vCard 3.0 and vCard 2.1
import { formatContactName } from './parser.js';

// Clean standard vCard 3.0 (RFC 2426) - No BOM, UTF-8 by default, no invalid CHARSET parameter
export function generateVCard3String(contacts, prefix = '', suffix = '') {
  const cards = [];

  for (const c of contacts) {
    const fullName = formatContactName(c.rawName, prefix, suffix).trim();
    // Normalize phone number to clean digits with optional leading +
    let phone = (c.rawPhone || '').replace(/[^\d+]/g, '');

    // In vCard 3.0:
    // N: FamilyName;GivenName;Additional;Prefix;Suffix
    // Putting full name in GivenName ensures the full display name shows identically
    const card = [
      'BEGIN:VCARD',
      'VERSION:3.0',
      `FN:${fullName}`,
      `N:;${fullName};;;`,
      `TEL;TYPE=CELL:${phone}`,
      'ORG:صيدليات المتحدة',
      `NOTE:United Pharmacy Training - ${prefix ? prefix.trim() : 'L&D'}`,
      'END:VCARD'
    ].join('\r\n');

    cards.push(card);
  }

  return cards.join('\r\n');
}

// Backward-compatible alias
export const generateVCardString = generateVCard3String;

// Helper to encode UTF-8 string to Quoted-Printable for vCard 2.1 compatibility
function encodeQuotedPrintable(str) {
  if (!str) return '';
  const utf8Bytes = new TextEncoder().encode(str);
  return Array.from(utf8Bytes)
    .map(b => {
      // Keep basic ASCII alphanumeric safe, encode everything else
      if ((b >= 48 && b <= 57) || (b >= 65 && b <= 90) || (b >= 97 && b <= 122)) {
        return String.fromCharCode(b);
      }
      return '=' + b.toString(16).toUpperCase().padStart(2, '0');
    })
    .join('');
}

// Legacy vCard 2.1 format for older Android / Samsung dialers
export function generateVCard2String(contacts, prefix = '', suffix = '') {
  const cards = [];

  for (const c of contacts) {
    const fullName = formatContactName(c.rawName, prefix, suffix).trim();
    const phone = (c.rawPhone || '').replace(/[^\d+]/g, '');
    const encodedName = encodeQuotedPrintable(fullName);

    const card = [
      'BEGIN:VCARD',
      'VERSION:2.1',
      `N;CHARSET=UTF-8;ENCODING=QUOTED-PRINTABLE:;${encodedName};;;`,
      `FN;CHARSET=UTF-8;ENCODING=QUOTED-PRINTABLE:${encodedName}`,
      `TEL;CELL:${phone}`,
      'ORG;CHARSET=UTF-8;ENCODING=QUOTED-PRINTABLE:' + encodeQuotedPrintable('صيدليات المتحدة'),
      'END:VCARD'
    ].join('\r\n');

    cards.push(card);
  }

  return cards.join('\r\n');
}

// Download or native mobile share
export async function downloadVCard(contacts, prefix = '', suffix = '', filename = 'United_Pharmacy_Wave.vcf', version = '3.0') {
  if (!contacts || contacts.length === 0) return false;

  const content = version === '2.1' 
    ? generateVCard2String(contacts, prefix, suffix)
    : generateVCard3String(contacts, prefix, suffix);

  const cleanFileName = filename.endsWith('.vcf') ? filename : `${filename}.vcf`;

  // Standard vCard MIME type without BOM to prevent Android parser syntax error
  const blob = new Blob([content], { type: 'text/x-vcard;charset=utf-8' });
  const file = new File([blob], cleanFileName, { type: 'text/x-vcard;charset=utf-8' });

  // If on mobile browser with Web Share API supporting files, offer direct share
  if (navigator.canShare && navigator.canShare({ files: [file] })) {
    try {
      await navigator.share({
        files: [file],
        title: cleanFileName,
        text: 'جهات اتصال متدربي صيدليات المتحدة (L&D)'
      });
      return true;
    } catch (err) {
      // User cancelled or share failed, fallback to direct download below
      if (err.name !== 'AbortError') {
        console.warn('Web Share failed, falling back to download:', err);
      }
    }
  }

  // Standard browser file download
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', cleanFileName);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(url), 2000);
  return true;
}
