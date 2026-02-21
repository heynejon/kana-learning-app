export interface NumberItem {
  digit: number;
  kanji: string;
  readings: string[]; // e.g., ['なな', 'しち'] for 7
  romanji: string[];  // e.g., ['nana', 'shichi'] for 7
}

// Quiz category types
export type NumberCategory = 'digit' | 'kanji' | 'reading' | 'romanji';

export const numbersData: NumberItem[] = [
  { digit: 1, kanji: '一', readings: ['いち'], romanji: ['ichi'] },
  { digit: 2, kanji: '二', readings: ['に'], romanji: ['ni'] },
  { digit: 3, kanji: '三', readings: ['さん'], romanji: ['san'] },
  { digit: 4, kanji: '四', readings: ['よん', 'し'], romanji: ['yon', 'shi'] },
  { digit: 5, kanji: '五', readings: ['ご'], romanji: ['go'] },
  { digit: 6, kanji: '六', readings: ['ろく'], romanji: ['roku'] },
  { digit: 7, kanji: '七', readings: ['なな', 'しち'], romanji: ['nana', 'shichi'] },
  { digit: 8, kanji: '八', readings: ['はち'], romanji: ['hachi'] },
  { digit: 9, kanji: '九', readings: ['きゅう', 'く'], romanji: ['kyuu', 'ku'] },
  { digit: 10, kanji: '十', readings: ['じゅう'], romanji: ['juu'] },
];

// Get full display text for a number item (all values joined) — used by chart
export function getDisplayText(item: NumberItem, category: NumberCategory): string {
  switch (category) {
    case 'digit':
      return String(item.digit);
    case 'kanji':
      return item.kanji;
    case 'reading':
      return item.readings.join(' / ');
    case 'romanji':
      return item.romanji.join(' / ');
  }
}

// Get a random single display text — used by quiz to show one reading/romanji at a time
export function getRandomDisplayText(item: NumberItem, category: NumberCategory): string {
  switch (category) {
    case 'digit':
      return String(item.digit);
    case 'kanji':
      return item.kanji;
    case 'reading':
      return item.readings[Math.floor(Math.random() * item.readings.length)];
    case 'romanji':
      return item.romanji[Math.floor(Math.random() * item.romanji.length)];
  }
}
