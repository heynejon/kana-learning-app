import { kanaData, getRandomKana, KanaChar, KanaType } from '@/lib/kanaData';

describe('kanaData', () => {
  describe('hiragana', () => {
    it('should contain 71 hiragana characters', () => {
      expect(kanaData.hiragana.length).toBe(71);
    });

    it('should only contain hiragana characters', () => {
      const hiraganaRegex = /^[\u3040-\u309F]+$/;
      const invalidChars = kanaData.hiragana.filter(kana => !hiraganaRegex.test(kana.char));
      expect(invalidChars).toHaveLength(0);
    });

    it('should have all characters marked as hiragana type', () => {
      const nonHiraganaTypes = kanaData.hiragana.filter(kana => kana.type !== 'hiragana');
      expect(nonHiraganaTypes).toHaveLength(0);
    });

    it('should have unique characters', () => {
      const chars = kanaData.hiragana.map(kana => kana.char);
      const uniqueChars = new Set(chars);
      expect(uniqueChars.size).toBe(chars.length);
    });

    it('should have non-empty romanji for all characters', () => {
      const emptyRomanji = kanaData.hiragana.filter(kana => !kana.romanji || kana.romanji.trim() === '');
      expect(emptyRomanji).toHaveLength(0);
    });

    it('should include basic vowels', () => {
      const vowels = ['あ', 'い', 'う', 'え', 'お'];
      const chars = kanaData.hiragana.map(kana => kana.char);
      vowels.forEach(vowel => {
        expect(chars).toContain(vowel);
      });
    });
  });

  describe('katakana', () => {
    it('should contain 71 katakana characters', () => {
      expect(kanaData.katakana.length).toBe(71);
    });

    it('should only contain katakana characters', () => {
      const katakanaRegex = /^[\u30A0-\u30FF]+$/;
      const invalidChars = kanaData.katakana.filter(kana => !katakanaRegex.test(kana.char));
      expect(invalidChars).toHaveLength(0);
    });

    it('should have all characters marked as katakana type', () => {
      const nonKatakanaTypes = kanaData.katakana.filter(kana => kana.type !== 'katakana');
      expect(nonKatakanaTypes).toHaveLength(0);
    });

    it('should have unique characters', () => {
      const chars = kanaData.katakana.map(kana => kana.char);
      const uniqueChars = new Set(chars);
      expect(uniqueChars.size).toBe(chars.length);
    });

    it('should have non-empty romanji for all characters', () => {
      const emptyRomanji = kanaData.katakana.filter(kana => !kana.romanji || kana.romanji.trim() === '');
      expect(emptyRomanji).toHaveLength(0);
    });

    it('should include basic vowels', () => {
      const vowels = ['ア', 'イ', 'ウ', 'エ', 'オ'];
      const chars = kanaData.katakana.map(kana => kana.char);
      vowels.forEach(vowel => {
        expect(chars).toContain(vowel);
      });
    });
  });

  describe('all', () => {
    it('should contain both hiragana and katakana', () => {
      expect(kanaData.all.length).toBe(kanaData.hiragana.length + kanaData.katakana.length);
    });

    it('should contain 142 total characters', () => {
      expect(kanaData.all.length).toBe(142);
    });

    it('should have unique characters across both sets', () => {
      const chars = kanaData.all.map(kana => kana.char);
      const uniqueChars = new Set(chars);
      expect(uniqueChars.size).toBe(chars.length);
    });
  });

  describe('Data Integrity', () => {
    it('should have matching romanji for hiragana and katakana pairs', () => {
      // Check a few common pairs
      const hiraganaA = kanaData.hiragana.find(kana => kana.char === 'あ');
      const katakanaA = kanaData.katakana.find(kana => kana.char === 'ア');
      expect(hiraganaA?.romanji).toBe(katakanaA?.romanji);

      const hiraganaKa = kanaData.hiragana.find(kana => kana.char === 'か');
      const katakanaKa = kanaData.katakana.find(kana => kana.char === 'カ');
      expect(hiraganaKa?.romanji).toBe(katakanaKa?.romanji);
    });

    it('should have consistent romanji formatting', () => {
      const allRomanji = kanaData.all.map(kana => kana.romanji);
      const withUpperCase = allRomanji.filter(r => r !== r.toLowerCase());
      expect(withUpperCase).toHaveLength(0);
    });
  });
});

describe('getRandomKana', () => {
  describe('Basic Functionality', () => {
    it('should return a hiragana character when type is hiragana', () => {
      const kana = getRandomKana(['hiragana']);
      expect(kana).toBeDefined();
      expect(kana?.type).toBe('hiragana');
      expect(kanaData.hiragana).toContainEqual(kana);
    });

    it('should return a katakana character when type is katakana', () => {
      const kana = getRandomKana(['katakana']);
      expect(kana).toBeDefined();
      expect(kana?.type).toBe('katakana');
      expect(kanaData.katakana).toContainEqual(kana);
    });

    it('should return either hiragana or katakana when both types selected', () => {
      const kana = getRandomKana(['hiragana', 'katakana']);
      expect(kana).toBeDefined();
      expect(['hiragana', 'katakana']).toContain(kana?.type);
      expect(kanaData.all).toContainEqual(kana);
    });

    it('should return null when empty types array is provided', () => {
      const kana = getRandomKana([]);
      expect(kana).toBeNull();
    });
  });

  describe('Randomness', () => {
    it('should return different characters on multiple calls', () => {
      const chars = new Set<string>();
      for (let i = 0; i < 50; i++) {
        const kana = getRandomKana(['hiragana']);
        if (kana) {
          chars.add(kana.char);
        }
      }
      // Should get at least 10 different characters in 50 tries
      expect(chars.size).toBeGreaterThanOrEqual(10);
    });

    it('should distribute across both hiragana and katakana when mix is selected', () => {
      const types = new Set<KanaType>();
      for (let i = 0; i < 100; i++) {
        const kana = getRandomKana(['hiragana', 'katakana']);
        if (kana) {
          types.add(kana.type);
        }
      }
      // Should get both types in 100 tries
      expect(types.has('hiragana')).toBe(true);
      expect(types.has('katakana')).toBe(true);
    });
  });

  describe('Exclude Functionality', () => {
    it('should exclude specified characters', () => {
      const excludeChars = ['あ', 'い', 'う'];
      for (let i = 0; i < 20; i++) {
        const kana = getRandomKana(['hiragana'], excludeChars);
        expect(kana).toBeDefined();
        expect(excludeChars).not.toContain(kana?.char);
      }
    });

    it('should return null when all characters are excluded', () => {
      const allHiragana = kanaData.hiragana.map(kana => kana.char);
      const kana = getRandomKana(['hiragana'], allHiragana);
      expect(kana).toBeNull();
    });

    it('should still return characters not in exclude list', () => {
      const excludeChars = ['あ'];
      const kana = getRandomKana(['hiragana'], excludeChars);
      expect(kana).toBeDefined();
      expect(kana?.char).not.toBe('あ');
    });

    it('should work with empty exclude array', () => {
      const kana = getRandomKana(['hiragana'], []);
      expect(kana).toBeDefined();
      expect(kana?.type).toBe('hiragana');
    });

    it('should exclude characters from mixed pool', () => {
      const excludeChars = ['あ', 'ア'];
      for (let i = 0; i < 20; i++) {
        const kana = getRandomKana(['hiragana', 'katakana'], excludeChars);
        expect(kana).toBeDefined();
        expect(excludeChars).not.toContain(kana?.char);
      }
    });
  });

  describe('Edge Cases', () => {
    it('should handle excluding non-existent characters gracefully', () => {
      const excludeChars = ['X', 'Y', 'Z'];
      const kana = getRandomKana(['hiragana'], excludeChars);
      expect(kana).toBeDefined();
      expect(kana?.type).toBe('hiragana');
    });

    it('should work when only one character remains after exclusion', () => {
      const allButOne = kanaData.hiragana.slice(1).map(kana => kana.char);
      const kana = getRandomKana(['hiragana'], allButOne);
      expect(kana).toBeDefined();
      expect(kana?.char).toBe(kanaData.hiragana[0].char);
    });
  });
});
