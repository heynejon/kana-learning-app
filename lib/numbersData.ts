export interface NumberItem {
  digit: number;
  kanji: string;
  readings: string[]; // e.g., ['なな', 'しち'] for 7
}

// Quiz category types
export type NumberCategory = 'digit' | 'kanji' | 'reading';

export const numbersData: NumberItem[] = [
  { digit: 1, kanji: '一', readings: ['いち'] },
  { digit: 2, kanji: '二', readings: ['に'] },
  { digit: 3, kanji: '三', readings: ['さん'] },
  { digit: 4, kanji: '四', readings: ['よん', 'し'] },
  { digit: 5, kanji: '五', readings: ['ご'] },
  { digit: 6, kanji: '六', readings: ['ろく'] },
  { digit: 7, kanji: '七', readings: ['なな', 'しち'] },
  { digit: 8, kanji: '八', readings: ['はち'] },
  { digit: 9, kanji: '九', readings: ['きゅう', 'く'] },
  { digit: 10, kanji: '十', readings: ['じゅう'] },
];

// Get display text for a number item by category
export function getDisplayText(item: NumberItem, category: NumberCategory): string {
  switch (category) {
    case 'digit':
      return String(item.digit);
    case 'kanji':
      return item.kanji;
    case 'reading':
      return item.readings.join(' / ');
  }
}
