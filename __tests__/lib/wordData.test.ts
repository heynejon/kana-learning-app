import { getRandomWord, hiraganaWords, katakanaWords, Word } from '@/lib/wordData';

describe('wordData', () => {
  describe('hiraganaWords', () => {
    it('should contain at least 200 words', () => {
      expect(hiraganaWords.length).toBeGreaterThanOrEqual(200);
    });

    it('should only contain hiragana characters', () => {
      const hiraganaRegex = /^[\u3040-\u309F]+$/;
      const invalidWords = hiraganaWords.filter(word => !hiraganaRegex.test(word.kana));

      expect(invalidWords).toHaveLength(0);
    });

    it('should have all required properties', () => {
      hiraganaWords.forEach(word => {
        expect(word).toHaveProperty('kana');
        expect(word).toHaveProperty('romanji');
        expect(word).toHaveProperty('meaning');
        expect(typeof word.kana).toBe('string');
        expect(typeof word.romanji).toBe('string');
        expect(typeof word.meaning).toBe('string');
        expect(word.kana.length).toBeGreaterThan(0);
        expect(word.romanji.length).toBeGreaterThan(0);
        expect(word.meaning.length).toBeGreaterThan(0);
      });
    });
  });

  describe('katakanaWords', () => {
    it('should contain at least 200 words', () => {
      expect(katakanaWords.length).toBeGreaterThanOrEqual(200);
    });

    it('should only contain katakana characters', () => {
      const katakanaRegex = /^[\u30A0-\u30FF]+$/;
      const invalidWords = katakanaWords.filter(word => !katakanaRegex.test(word.kana));

      expect(invalidWords).toHaveLength(0);
    });

    it('should have all required properties', () => {
      katakanaWords.forEach(word => {
        expect(word).toHaveProperty('kana');
        expect(word).toHaveProperty('romanji');
        expect(word).toHaveProperty('meaning');
        expect(typeof word.kana).toBe('string');
        expect(typeof word.romanji).toBe('string');
        expect(typeof word.meaning).toBe('string');
        expect(word.kana.length).toBeGreaterThan(0);
        expect(word.romanji.length).toBeGreaterThan(0);
        expect(word.meaning.length).toBeGreaterThan(0);
      });
    });
  });

  describe('getRandomWord', () => {
    it('should return a hiragana word when type is hiragana', () => {
      const word = getRandomWord('hiragana');

      expect(word).toBeDefined();
      expect(hiraganaWords).toContainEqual(word);
    });

    it('should return a katakana word when type is katakana', () => {
      const word = getRandomWord('katakana');

      expect(word).toBeDefined();
      expect(katakanaWords).toContainEqual(word);
    });

    it('should return a word from either pool when type is mix', () => {
      const word = getRandomWord('mix');

      expect(word).toBeDefined();

      const isInHiragana = hiraganaWords.some(w =>
        w.kana === word.kana && w.romanji === word.romanji
      );
      const isInKatakana = katakanaWords.some(w =>
        w.kana === word.kana && w.romanji === word.romanji
      );

      expect(isInHiragana || isInKatakana).toBe(true);
    });

    it('should return different words on multiple calls (randomness)', () => {
      const words = new Set<string>();

      // Call 50 times - should get at least 10 different words
      for (let i = 0; i < 50; i++) {
        const word = getRandomWord('hiragana');
        words.add(word.kana);
      }

      expect(words.size).toBeGreaterThanOrEqual(10);
    });

    it('should always return a valid Word object', () => {
      for (let i = 0; i < 10; i++) {
        const word = getRandomWord('mix');

        expect(word).toHaveProperty('kana');
        expect(word).toHaveProperty('romanji');
        expect(word).toHaveProperty('meaning');
        expect(typeof word.kana).toBe('string');
        expect(typeof word.romanji).toBe('string');
        expect(typeof word.meaning).toBe('string');
      }
    });
  });
});
