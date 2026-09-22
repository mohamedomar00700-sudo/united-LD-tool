// Phone number and text parser utility for United Pharmacy L&D Coordinator Tool

// Convert Arabic-Indic numerals to standard Latin numerals
export function convertArabicDigits(str) {
  if (!str) return '';
  const arabicDigits = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  return String(str).replace(/[٠-٩]/g, (d) => arabicDigits.indexOf(d));
}

// Normalize phone number based on country code
export function normalizePhone(rawPhone, countryCode = '+20') {
  if (!rawPhone) return '';
  
  let cleaned = convertArabicDigits(rawPhone).trim();
  // Remove non-digit characters except leading plus
  let hasPlus = cleaned.startsWith('+');
  cleaned = cleaned.replace(/[^\d]/g, '');

  if (!cleaned) return '';

  if (countryCode === '+20') {
    // Egypt rules
    // If starts with 0020, 20
    if (cleaned.startsWith('0020')) {
      cleaned = cleaned.slice(4);
    } else if (cleaned.startsWith('20') && cleaned.length > 10) {
      cleaned = cleaned.slice(2);
    }

    // Now cleaned should start with 010, 011, 012, 015 or 10, 11, 12, 15
    if (cleaned.startsWith('0')) {
      cleaned = cleaned.slice(1);
    }

    if (['10', '11', '12', '15'].some(p => cleaned.startsWith(p))) {
      return '+20' + cleaned;
    }

    return hasPlus ? '+' + cleaned : '+20' + cleaned;
  } else if (countryCode === '+966') {
    // Saudi Arabia rules
    if (cleaned.startsWith('00966')) {
      cleaned = cleaned.slice(5);
    } else if (cleaned.startsWith('966') && cleaned.length > 9) {
      cleaned = cleaned.slice(3);
    }

    if (cleaned.startsWith('0')) {
      cleaned = cleaned.slice(1);
    }

    if (cleaned.startsWith('5')) {
      return '+966' + cleaned;
    }

    return hasPlus ? '+' + cleaned : '+966' + cleaned;
  } else if (countryCode === '+971') {
    // UAE rules
    if (cleaned.startsWith('00971')) {
      cleaned = cleaned.slice(5);
    } else if (cleaned.startsWith('971')) {
      cleaned = cleaned.slice(3);
    }
    if (cleaned.startsWith('0')) {
      cleaned = cleaned.slice(1);
    }
    return '+971' + cleaned;
  }

  // Generic
  if (hasPlus) return '+' + cleaned;
  if (countryCode) return countryCode + cleaned;
  return cleaned;
}

// Clean and format a contact name
export function cleanName(rawName) {
  if (!rawName) return '';
  let name = String(rawName).trim();
  // Remove leading bullet points, numbers, dashes, pipes, commas, brackets
  name = name.replace(/^[\s\d\.\-\*\#\:\,\;\(\)\[\]\|•–—]+/, '').trim();
  // Remove trailing separators, parentheses, and brackets
  name = name.replace(/[\s\-\:\,\;\|\–—\(\)\[\]]+$/, '').trim();
  return name;
}

// Parse free-form pasted text into structured contacts
export function parseFreeText(text, countryCode = '+20') {
  if (!text || !text.trim()) return [];

  const lines = text.split(/\r?\n/);
  const results = [];
  let idCounter = 1;

  for (let line of lines) {
    let trimmed = line.trim();
    if (!trimmed) continue;

    // Convert Arabic numerals
    const converted = convertArabicDigits(trimmed);

    // Look for phone numbers in the line:
    // e.g. 01012345678, +201012345678, 0501234567, 966501234567, etc.
    const phoneRegex = /(\+?[0-9]{1,4}[\s\-]?)?(0?1[0125][0-9]{8}|0?5[0-9]{8}|[0-9]{8,15})/;
    const match = converted.match(phoneRegex);

    if (match) {
      const rawPhone = match[0];
      const phoneIndex = converted.indexOf(rawPhone);
      
      // The name is whatever comes before or after the phone number
      const before = converted.substring(0, phoneIndex).trim();
      const after = converted.substring(phoneIndex + rawPhone.length).trim();
      
      let candidateName = before.length >= 2 ? before : after;
      if (!candidateName) {
        candidateName = `متدرب ${idCounter}`;
      }

      const formattedName = cleanName(candidateName);
      const formattedPhone = normalizePhone(rawPhone, countryCode);

      if (formattedPhone) {
        results.push({
          id: 'contact_' + Date.now() + '_' + idCounter++,
          rawName: formattedName || `متدرب ${idCounter}`,
          rawPhone: formattedPhone,
          isValid: isValidPhoneNumber(formattedPhone)
        });
      }
    } else {
      // Line without obvious phone number - check if it's tab-separated or comma-separated
      const parts = trimmed.split(/[\t,;]/);
      if (parts.length >= 2) {
        const p1 = parts[0].trim();
        const p2 = parts[1].trim();
        const p1Digits = convertArabicDigits(p1).replace(/[^\d]/g, '');
        const p2Digits = convertArabicDigits(p2).replace(/[^\d]/g, '');

        if (p2Digits.length >= 8) {
          results.push({
            id: 'contact_' + Date.now() + '_' + idCounter++,
            rawName: cleanName(p1),
            rawPhone: normalizePhone(p2, countryCode),
            isValid: isValidPhoneNumber(normalizePhone(p2, countryCode))
          });
        } else if (p1Digits.length >= 8) {
          results.push({
            id: 'contact_' + Date.now() + '_' + idCounter++,
            rawName: cleanName(p2),
            rawPhone: normalizePhone(p1, countryCode),
            isValid: isValidPhoneNumber(normalizePhone(p1, countryCode))
          });
        }
      }
    }
  }

  return results;
}

// Basic phone number validity checker
export function isValidPhoneNumber(phone) {
  if (!phone) return false;
  const digits = phone.replace(/[^\d]/g, '');
  return digits.length >= 9 && digits.length <= 15;
}

// Deduplicate contacts by phone number
export function deduplicateContacts(contacts) {
  const seen = new Set();
  const unique = [];
  const duplicates = [];

  for (const contact of contacts) {
    const key = contact.rawPhone.replace(/[^\d]/g, '');
    if (key && seen.has(key)) {
      duplicates.push(contact);
    } else {
      if (key) seen.add(key);
      unique.push(contact);
    }
  }

  return { unique, duplicatesCount: duplicates.length };
}

// Generate the final display/saved name applying Prefix and Suffix
export function formatContactName(rawName, prefix = '', suffix = '') {
  let name = rawName || '';
  const pre = prefix ? prefix.trim() + ' ' : '';
  const suf = suffix ? ' ' + suffix.trim() : '';
  return `${pre}${name}${suf}`.trim();
}
