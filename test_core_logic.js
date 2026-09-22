import { parseFreeText, normalizePhone, formatContactName, deduplicateContacts } from './src/utils/parser.js';
import { generateVCardString } from './src/utils/vcard.js';
import { generateGoogleContactsCsv } from './src/utils/csv.js';

console.log('--- Testing Parser & Phone Normalizer ---');
const sampleRaw = `
1. د. أحمد محمود عبد الرحمن - 01023456789
د. فاطمة الزهراء إبراهيم 01198765432
د. مصطفى خالد الشريف : 01245678901
دكتور عمر المنشاوي (+201555667788)
+966501234567 د. فهد السعودي
`;

const parsed = parseFreeText(sampleRaw, '+20');
console.log(`Parsed ${parsed.length} contacts:`);
parsed.forEach(c => console.log(`  - Name: "${c.rawName}", Phone: "${c.rawPhone}", Valid: ${c.isValid}`));

console.log('\n--- Testing Wave Tagging ---');
const tagged = parsed.map(c => formatContactName(c.rawName, 'Wave 6 - ', ' (صيدليات المتحدة)'));
tagged.forEach(t => console.log(`  - Formatted: "${t}"`));

console.log('\n--- Testing vCard Generation ---');
const vcf = generateVCardString(parsed.slice(0, 2), 'Wave 6 - ', '');
console.log('Sample vCard output:\n' + vcf);

console.log('\n--- Testing Google Contacts CSV Generation ---');
const csv = generateGoogleContactsCsv(parsed.slice(0, 2), 'Wave 6 - ');
console.log('Sample CSV output:\n' + csv);

console.log('\n--- Testing Deduplication ---');
const withDuplicates = [...parsed, parsed[0]];
const { unique, duplicatesCount } = deduplicateContacts(withDuplicates);
console.log(`Total: ${withDuplicates.length}, Unique: ${unique.length}, Duplicates removed: ${duplicatesCount}`);

if (parsed.length >= 4 && duplicatesCount === 1) {
  console.log('\n✅ ALL UNIT TESTS PASSED SUCCESSFULLY!');
} else {
  console.error('\n❌ Tests failed.');
  process.exit(1);
}
