// vCard (VCF) 3.0 generation utility for Android & iOS mobile contact import
import { formatContactName } from './parser.js';

export function generateVCardString(contacts, prefix = '', suffix = '') {
  const cards = [];

  for (const c of contacts) {
    const fullName = formatContactName(c.rawName, prefix, suffix);
    const phone = c.rawPhone || '';

    // Split name for N field (Last Name; First Name)
    const nameParts = fullName.trim().split(/\s+/);
    let firstName = fullName;
    let lastName = '';
    if (nameParts.length > 1) {
      firstName = nameParts[0];
      lastName = nameParts.slice(1).join(' ');
    }

    const card = [
      'BEGIN:VCARD',
      'VERSION:3.0',
      `FN;CHARSET=UTF-8:${fullName}`,
      `N;CHARSET=UTF-8:${lastName};${firstName};;;`,
      `TEL;TYPE=CELL,VOICE:${phone}`,
      'ORG;CHARSET=UTF-8:صيدليات المتحدة;Learning & Development',
      `NOTE;CHARSET=UTF-8:United Pharmacy L&D - ${prefix || 'Training'}`,
      'END:VCARD'
    ].join('\r\n');

    cards.push(card);
  }

  return cards.join('\r\n\r\n');
}

export function downloadVCard(contacts, prefix = '', suffix = '', filename = 'United_Pharmacy_Wave.vcf') {
  if (!contacts || contacts.length === 0) return false;

  const vCardContent = generateVCardString(contacts, prefix, suffix);
  
  // Use UTF-8 BOM so all phones and apps properly detect Arabic encoding
  const bom = new Uint8Array([0xEF, 0xBB, 0xBF]);
  const blob = new Blob([bom, vCardContent], { type: 'text/vcard;charset=utf-8;' });
  
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename.endsWith('.vcf') ? filename : `${filename}.vcf`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
  return true;
}
