// Google Contacts CSV export and utility functions
import { formatContactName } from './parser.js';

export function generateGoogleContactsCsv(contacts, prefix = '', suffix = '') {
  // Google Contacts Standard CSV Headers
  const headers = [
    'Name',
    'Given Name',
    'Family Name',
    'Group Membership',
    'Phone 1 - Type',
    'Phone 1 - Value',
    'Organization 1 - Name',
    'Organization 1 - Title'
  ];

  const rows = [headers.join(',')];

  for (const c of contacts) {
    const fullName = formatContactName(c.rawName, prefix, suffix);
    const phone = c.rawPhone || '';

    const nameParts = fullName.trim().split(/\s+/);
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';

    // Escape CSV values
    const escapeCsv = (str) => `"${(str || '').replace(/"/g, '""')}"`;

    const row = [
      escapeCsv(fullName),
      escapeCsv(firstName),
      escapeCsv(lastName),
      escapeCsv(prefix ? `United Pharmacy - ${prefix}` : 'United Pharmacy L&D'),
      escapeCsv('Mobile'),
      escapeCsv(phone),
      escapeCsv('صيدليات المتحدة (United Pharmacy)'),
      escapeCsv('L&D Trainee')
    ];

    rows.push(row.join(','));
  }

  return rows.join('\r\n');
}

export function downloadGoogleCsv(contacts, prefix = '', suffix = '', filename = 'United_Pharmacy_Google_Contacts.csv') {
  if (!contacts || contacts.length === 0) return false;

  const csvContent = generateGoogleContactsCsv(contacts, prefix, suffix);
  const bom = new Uint8Array([0xEF, 0xBB, 0xBF]); // UTF-8 BOM for Excel/Google
  const blob = new Blob([bom, csvContent], { type: 'text/csv;charset=utf-8;' });

  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename.endsWith('.csv') ? filename : `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
  return true;
}

export function copyPhoneNumbersToClipboard(contacts) {
  if (!contacts || contacts.length === 0) return '';
  const numbers = contacts
    .map(c => c.rawPhone)
    .filter(Boolean)
    .join(', ');
  
  navigator.clipboard.writeText(numbers);
  return numbers;
}
