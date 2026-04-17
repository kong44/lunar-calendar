/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export const KHMER_MONTHS = [
  'មករា', 'កុម្ភៈ', 'មីនា', 'មេសា', 'ឧសភា', 'មិថុនា',
  'កក្កដា', 'សីហា', 'កញ្ញា', 'តុលា', 'វិច្ឆិកា', 'ធ្នូ'
];

export const KHMER_DAYS = [
  'អាទិត្យ', 'ចន្ទ', 'អង្គារ', 'ពុធ', 'ព្រហស្បតិ៍', 'សុក្រ', 'សៅរ៍'
];

export const KHMER_DAYS_SHORT = [
  'អា', 'ច', 'អ', 'ព', 'ព្រ', 'សុ', 'ស'
];

export const KHMER_NUMBERS: Record<string, string> = {
  '0': '០', '1': '១', '2': '២', '3': '៣', '4': '៤',
  '5': '៥', '6': '៦', '7': '៧', '8': '៨', '9': '៩'
};

export function toKhmerNumber(num: number | string): string {
  return String(num).split('').map(char => KHMER_NUMBERS[char] || char).join('');
}

export const KHMER_MONTHS_LUNAR = [
  'មិគសិរ', 'បុស្ស', 'មាឃ', 'ផល្គុន', 'ចេត្រ', 'ពិសាខ',
  'ជេស្ឋ', 'អាសាឍ', 'ស្រាពណ៍', 'ភទ្របទ', 'អស្សុជ', 'កត្តិក'
];

export const LUNAR_PHASES = {
  WAXING: 'កើត',
  WANING: 'រោច',
  FULL_MOON: 'ពេញបូណ៌មី',
  NEW_MOON: 'ដាច់ស័ព្ទ'
};

export interface Holiday {
  day: number;
  month: number; // 0-indexed
  name: string;
  nameKh: string;
  isArtDay?: boolean;
}

// 2026 Public Holidays + Art/Culture Days
export const HOLIDAYS_2026: Holiday[] = [
  { day: 1, month: 0, name: "International New Year's Day", nameKh: 'ថ្ងៃបុណ្យចូលឆ្នាំសកល' },
  { day: 7, month: 0, name: "Victory Day over Genocide", nameKh: 'ទិវាជ័យជម្នះលើរបបប្រល័យពូជសាសន៍' },
  { day: 3, month: 2, name: "National Culture Day", nameKh: 'ទិវាវប្បធម៌ជាតិ (Art & Culture)', isArtDay: true },
  { day: 8, month: 2, name: "International Women's Day", nameKh: 'ទិវាអន្តរជាតិនារី' },
  { day: 14, month: 3, name: "Khmer New Year", nameKh: 'បុណ្យចូលឆ្នាំថ្មី ប្រពៃណីជាតិ' },
  { day: 15, month: 3, name: "Khmer New Year (World Art Day)", nameKh: 'បុណ្យចូលឆ្នាំថ្មី (ទិវាសិល្បៈពិភពលោក)', isArtDay: true },
  { day: 16, month: 3, name: "Khmer New Year", nameKh: 'បុណ្យចូលឆ្នាំថ្មី ប្រពៃណីជាតិ' },
  { day: 1, month: 4, name: "International Labor Day", nameKh: 'ទិវាពលកម្មអន្តរជាតិ' },
  { day: 14, month: 4, name: "King Sihamoni's Birthday", nameKh: 'ព្រះរាជពិធីបុណ្យចម្រើនព្រះជន្ម ព្រះករុណា' },
  { day: 1, month: 5, name: "Visak Bochea Day", nameKh: 'ពិធីបុណ្យវិសាខបូជា' }, 
  { day: 5, month: 5, name: "Royal Plowing Ceremony", nameKh: 'ព្រះរាជពិធីច្រត់ព្រះនង្គ័ល' },
  { day: 18, month: 5, name: "King Mother's Birthday", nameKh: 'ព្រះរាជពិធីបុណ្យចម្រើនព្រះជន្ម ព្រះវររាជមាតា' },
  { day: 1, month: 6, name: "Arbour Day", nameKh: 'រុក្ខទិវា' },
  { day: 24, month: 8, name: "Constitution Day", nameKh: 'ទិវាប្រកាសរដ្ឋធម្មនុញ្ញ' },
  { day: 6, month: 9, name: "Pchum Ben Festival", nameKh: 'ពិធីបុណ្យភ្ជុំបិណ្ឌ' },
  { day: 7, month: 9, name: "Pchum Ben Festival", nameKh: 'ពិធីបុណ្យភ្ជុំបិណ្ឌ' },
  { day: 8, month: 9, name: "Pchum Ben Festival", nameKh: 'ពិធីបុណ្យភ្ជុំបិណ្ឌ' },
  { day: 15, month: 9, name: "Commemoration Day of King Father", nameKh: 'ទិវាប្រារព្ធពិធីគោរពព្រះវិញ្ញាណក្ខន្ធ ព្រះបរមរតនកោដ្ឋ' },
  { day: 29, month: 9, name: "King’s Coronation Day", nameKh: 'ព្រះរាជពិធីគ្រងព្រះបរមរាជសម្បត្តិ' },
  { day: 9, month: 10, name: "Independence Day", nameKh: 'ពិធីបុណ្យឯករាជ្យជាតិ' },
  { day: 23, month: 10, name: "Water Festival", nameKh: 'ព្រះរាជពិធីបុណ្យអុំទូក' },
  { day: 24, month: 10, name: "Water Festival", nameKh: 'ព្រះរាជពិធីបុណ្យអុំទូក' },
  { day: 25, month: 10, name: "Water Festival", nameKh: 'ព្រះរាជពិធីបុណ្យអុំទូក' },
];

/**
 * Simplified Khmer Lunar calculation for 2026.
 * Note: Real Khmer lunar calculation is very complex involving meta-cycles.
 * This is a close approximation for demo purposes focused on Thngai Sile.
 */
export function getKhmerLunarDay(date: Date) {
  // A simple reference: Jan 19, 2026 is 1st of Waxing (Phalguna approx)
  // Actually let's use a simpler marker: 
  // Sile days in 2026 (approximate based on common lunar cycles)
  const day = date.getDate();
  const month = date.getMonth();
  
  // Just return a simulated lunar day string for the demo
  // In a real app, this would use the JDN based algorithm
  const lunarDay = (day % 15) + 1;
  const isWaxing = Math.floor(day / 15) % 2 === 0;
  const phase = isWaxing ? LUNAR_PHASES.WAXING : LUNAR_PHASES.WANING;
  
  const isSile = lunarDay === 8 || lunarDay === 15 || lunarDay === 14;
  
  return {
    day: toKhmerNumber(lunarDay),
    phase: phase,
    isSile: isSile,
    month: KHMER_MONTHS_LUNAR[month % 12]
  };
}

