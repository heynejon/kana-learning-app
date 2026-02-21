import { numbersData, getDisplayText, getRandomDisplayText } from '@/lib/numbersData';

describe('numbersData', () => {
  describe('Data Structure', () => {
    it('should contain 10 numbers (1-10)', () => {
      expect(numbersData.length).toBe(10);
    });

    it('should have digits 1 through 10', () => {
      const digits = numbersData.map((n) => n.digit);
      for (let i = 1; i <= 10; i++) {
        expect(digits).toContain(i);
      }
    });

    it('should have unique digits', () => {
      const digits = numbersData.map((n) => n.digit);
      const unique = new Set(digits);
      expect(unique.size).toBe(digits.length);
    });

    it('should have unique kanji', () => {
      const kanji = numbersData.map((n) => n.kanji);
      const unique = new Set(kanji);
      expect(unique.size).toBe(kanji.length);
    });

    it('should have non-empty kanji for all numbers', () => {
      numbersData.forEach((item) => {
        expect(item.kanji).toBeTruthy();
        expect(item.kanji.trim()).not.toBe('');
      });
    });

    it('should have at least one reading for each number', () => {
      numbersData.forEach((item) => {
        expect(item.readings.length).toBeGreaterThanOrEqual(1);
        item.readings.forEach((reading) => {
          expect(reading).toBeTruthy();
          expect(reading.trim()).not.toBe('');
        });
      });
    });

    it('should have at least one romanji for each number', () => {
      numbersData.forEach((item) => {
        expect(item.romanji.length).toBeGreaterThanOrEqual(1);
        item.romanji.forEach((r) => {
          expect(r).toBeTruthy();
          expect(r.trim()).not.toBe('');
        });
      });
    });

    it('should have correct kanji for known numbers', () => {
      const find = (digit: number) => numbersData.find((n) => n.digit === digit);
      expect(find(1)?.kanji).toBe('一');
      expect(find(2)?.kanji).toBe('二');
      expect(find(3)?.kanji).toBe('三');
      expect(find(7)?.kanji).toBe('七');
      expect(find(10)?.kanji).toBe('十');
    });

    it('should have multiple readings for numbers with variants', () => {
      const four = numbersData.find((n) => n.digit === 4);
      expect(four?.readings.length).toBeGreaterThanOrEqual(2); // よん, し

      const seven = numbersData.find((n) => n.digit === 7);
      expect(seven?.readings.length).toBeGreaterThanOrEqual(2); // なな, しち

      const nine = numbersData.find((n) => n.digit === 9);
      expect(nine?.readings.length).toBeGreaterThanOrEqual(2); // きゅう, く
    });

    it('should have matching count of readings and romanji for each number', () => {
      numbersData.forEach((item) => {
        expect(item.romanji.length).toBe(item.readings.length);
      });
    });

    it('should have correct romanji for known numbers', () => {
      const find = (digit: number) => numbersData.find((n) => n.digit === digit);
      expect(find(1)?.romanji).toContain('ichi');
      expect(find(4)?.romanji).toContain('yon');
      expect(find(4)?.romanji).toContain('shi');
      expect(find(7)?.romanji).toContain('nana');
      expect(find(7)?.romanji).toContain('shichi');
    });
  });
});

describe('getDisplayText', () => {
  const testItem = numbersData.find((n) => n.digit === 7)!;

  it('should return digit as string for digit category', () => {
    expect(getDisplayText(testItem, 'digit')).toBe('7');
  });

  it('should return kanji for kanji category', () => {
    expect(getDisplayText(testItem, 'kanji')).toBe('七');
  });

  it('should return readings joined with " / " for reading category', () => {
    expect(getDisplayText(testItem, 'reading')).toBe('なな / しち');
  });

  it('should return romanji joined with " / " for romanji category', () => {
    expect(getDisplayText(testItem, 'romanji')).toBe('nana / shichi');
  });

  it('should return single reading without separator', () => {
    const one = numbersData.find((n) => n.digit === 1)!;
    expect(getDisplayText(one, 'reading')).toBe('いち');
  });

  it('should return single romanji without separator', () => {
    const one = numbersData.find((n) => n.digit === 1)!;
    expect(getDisplayText(one, 'romanji')).toBe('ichi');
  });
});

describe('getRandomDisplayText', () => {
  it('should return the digit as string', () => {
    const item = numbersData.find((n) => n.digit === 5)!;
    expect(getRandomDisplayText(item, 'digit')).toBe('5');
  });

  it('should return the kanji', () => {
    const item = numbersData.find((n) => n.digit === 5)!;
    expect(getRandomDisplayText(item, 'kanji')).toBe('五');
  });

  it('should return one of the readings for multi-reading numbers', () => {
    const seven = numbersData.find((n) => n.digit === 7)!;
    const results = new Set<string>();
    for (let i = 0; i < 50; i++) {
      results.add(getRandomDisplayText(seven, 'reading'));
    }
    // Should only contain valid readings
    results.forEach((r) => {
      expect(seven.readings).toContain(r);
    });
    // Should get both values in 50 tries
    expect(results.size).toBe(2);
  });

  it('should return one of the romanji for multi-romanji numbers', () => {
    const seven = numbersData.find((n) => n.digit === 7)!;
    const results = new Set<string>();
    for (let i = 0; i < 50; i++) {
      results.add(getRandomDisplayText(seven, 'romanji'));
    }
    results.forEach((r) => {
      expect(seven.romanji).toContain(r);
    });
    expect(results.size).toBe(2);
  });

  it('should return the single reading for single-reading numbers', () => {
    const one = numbersData.find((n) => n.digit === 1)!;
    expect(getRandomDisplayText(one, 'reading')).toBe('いち');
  });

  it('should return the single romanji for single-romanji numbers', () => {
    const one = numbersData.find((n) => n.digit === 1)!;
    expect(getRandomDisplayText(one, 'romanji')).toBe('ichi');
  });
});
