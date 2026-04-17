/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Solar } from 'lunar-javascript';

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
  date: string; // ISO format
  name: string;
  nameKh?: string;
  isArtDay?: boolean;
  observed?: string;
  public?: boolean;
}

// Helper to check if a day is one of our custom Art/Culture days
export const ART_DAYS = [
  { day: 3, month: 2, name: 'National Culture Day', nameKh: 'ទិវាវប្បធម៌ជាតិ' }, // March 3
  { day: 15, month: 3, name: 'World Art Day', nameKh: 'ទិវាសិល្បៈពិភពលោក' }, // April 15
];

export function isArtDay(date: Date): boolean {
  return ART_DAYS.some(ad => ad.day === date.getDate() && ad.month === date.getMonth());
}

// Common Cambodian holiday translations for Google Calendar API
export const KHMER_HOLIDAY_NAMES: Record<string, string> = {
  "International New Year's Day": "ថ្ងៃបុណ្យចូលឆ្នាំសកល",
  "Victory Day over Genocide": "ទិវាជ័យជម្នះលើរបបប្រល័យពូជសាសន៍",
  "International Women's Day": "ទិវាអន្តរជាតិនារី",
  "Khmer New Year": "បុណ្យចូលឆ្នាំថ្មី ប្រពៃណីជាតិ",
  "International Labor Day": "ទិវាពលកម្មអន្តរជាតិ",
  "Visak Bochea Day": "ពិធីបុណ្យវិសាខបូជា",
  "Royal Plowing Ceremony": "ព្រះរាជពិធីច្រត់ព្រះនង្គ័ល",
  "King Sihamoni's Birthday": "ព្រះរាជពិធីបុណ្យចម្រើនព្រះជន្ម ព្រះករុណា",
  "King Mother's Birthday": "ព្រះរាជពិធីបុណ្យចម្រើនព្រះជន្ម ព្រះវររាជមាតា",
  "Constitution Day": "ទិវាប្រកាសរដ្ឋធម្មនុញ្ញ",
  "Pchum Ben Festival": "ពិធីបុណ្យភ្ជុំបិណ្ឌ",
  "Commemoration Day of King Father": "ទិវាវរជន",
  "King’s Coronation Day": "ព្រះរាជពិធីគ្រងព្រះបរមរាជសម្បត្តិ",
  "Independence Day": "ពិធីបុណ្យឯករាជ្យជាតិ",
  "Water Festival": "ព្រះរាជពិធីបុណ្យអុំទូក",
  "International New Year": "ថ្ងៃបុណ្យចូលឆ្នាំសកល"
};

/**
 * Accurate Khmer Lunar calculation using the lunar-javascript library.
 */
export function getKhmerLunarDay(date: Date) {
  try {
    const solar = Solar.fromDate(date);
    const lunar = solar.getLunar();
    
    let lDay = lunar.getDay();
    let phase = LUNAR_PHASES.WAXING;
    
    if (lDay > 15) {
      lDay -= 15;
      phase = LUNAR_PHASES.WANING;
    }
    
    // Sile days: 8th and 15th (Full/New Moon)
    // 14th can also be sile in some months
    const isSile = lDay === 8 || lDay === 15 || (phase === LUNAR_PHASES.WANING && lDay === 14);
    
    // In Khmer calendar, lunar months are shifted. 
    // Usually lunar month 1 (from library) is around Dec/Jan.
    // Khmer month 1 (Mikkasira) is also around Dec.
    const monthIndex = (lunar.getMonth() + 10) % 12; 
    
    return {
      day: toKhmerNumber(lDay),
      phase: phase,
      isSile: isSile,
      month: KHMER_MONTHS_LUNAR[monthIndex]
    };
  } catch (error) {
    // Fallback if library fails
    return {
      day: toKhmerNumber(1),
      phase: LUNAR_PHASES.WAXING,
      isSile: false,
      month: KHMER_MONTHS_LUNAR[0]
    };
  }
}

