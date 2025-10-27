export type KanaType = 'hiragana' | 'katakana';

export interface KanaChar {
  char: string;
  romanji: string;
  type: KanaType;
}

// Basic Hiragana
const hiragana: KanaChar[] = [
  // Vowels
  { char: 'あ', romanji: 'a', type: 'hiragana' },
  { char: 'い', romanji: 'i', type: 'hiragana' },
  { char: 'う', romanji: 'u', type: 'hiragana' },
  { char: 'え', romanji: 'e', type: 'hiragana' },
  { char: 'お', romanji: 'o', type: 'hiragana' },
  // K-row
  { char: 'か', romanji: 'ka', type: 'hiragana' },
  { char: 'き', romanji: 'ki', type: 'hiragana' },
  { char: 'く', romanji: 'ku', type: 'hiragana' },
  { char: 'け', romanji: 'ke', type: 'hiragana' },
  { char: 'こ', romanji: 'ko', type: 'hiragana' },
  // S-row
  { char: 'さ', romanji: 'sa', type: 'hiragana' },
  { char: 'し', romanji: 'shi', type: 'hiragana' },
  { char: 'す', romanji: 'su', type: 'hiragana' },
  { char: 'せ', romanji: 'se', type: 'hiragana' },
  { char: 'そ', romanji: 'so', type: 'hiragana' },
  // T-row
  { char: 'た', romanji: 'ta', type: 'hiragana' },
  { char: 'ち', romanji: 'chi', type: 'hiragana' },
  { char: 'つ', romanji: 'tsu', type: 'hiragana' },
  { char: 'て', romanji: 'te', type: 'hiragana' },
  { char: 'と', romanji: 'to', type: 'hiragana' },
  // N-row
  { char: 'な', romanji: 'na', type: 'hiragana' },
  { char: 'に', romanji: 'ni', type: 'hiragana' },
  { char: 'ぬ', romanji: 'nu', type: 'hiragana' },
  { char: 'ね', romanji: 'ne', type: 'hiragana' },
  { char: 'の', romanji: 'no', type: 'hiragana' },
  // H-row
  { char: 'は', romanji: 'ha', type: 'hiragana' },
  { char: 'ひ', romanji: 'hi', type: 'hiragana' },
  { char: 'ふ', romanji: 'fu', type: 'hiragana' },
  { char: 'へ', romanji: 'he', type: 'hiragana' },
  { char: 'ほ', romanji: 'ho', type: 'hiragana' },
  // M-row
  { char: 'ま', romanji: 'ma', type: 'hiragana' },
  { char: 'み', romanji: 'mi', type: 'hiragana' },
  { char: 'む', romanji: 'mu', type: 'hiragana' },
  { char: 'め', romanji: 'me', type: 'hiragana' },
  { char: 'も', romanji: 'mo', type: 'hiragana' },
  // Y-row
  { char: 'や', romanji: 'ya', type: 'hiragana' },
  { char: 'ゆ', romanji: 'yu', type: 'hiragana' },
  { char: 'よ', romanji: 'yo', type: 'hiragana' },
  // R-row
  { char: 'ら', romanji: 'ra', type: 'hiragana' },
  { char: 'り', romanji: 'ri', type: 'hiragana' },
  { char: 'る', romanji: 'ru', type: 'hiragana' },
  { char: 'れ', romanji: 're', type: 'hiragana' },
  { char: 'ろ', romanji: 'ro', type: 'hiragana' },
  // W-row
  { char: 'わ', romanji: 'wa', type: 'hiragana' },
  { char: 'を', romanji: 'wo', type: 'hiragana' },
  // N
  { char: 'ん', romanji: 'n', type: 'hiragana' },
  // G-row
  { char: 'が', romanji: 'ga', type: 'hiragana' },
  { char: 'ぎ', romanji: 'gi', type: 'hiragana' },
  { char: 'ぐ', romanji: 'gu', type: 'hiragana' },
  { char: 'げ', romanji: 'ge', type: 'hiragana' },
  { char: 'ご', romanji: 'go', type: 'hiragana' },
  // Z-row
  { char: 'ざ', romanji: 'za', type: 'hiragana' },
  { char: 'じ', romanji: 'ji', type: 'hiragana' },
  { char: 'ず', romanji: 'zu', type: 'hiragana' },
  { char: 'ぜ', romanji: 'ze', type: 'hiragana' },
  { char: 'ぞ', romanji: 'zo', type: 'hiragana' },
  // D-row
  { char: 'だ', romanji: 'da', type: 'hiragana' },
  { char: 'ぢ', romanji: 'ji', type: 'hiragana' },
  { char: 'づ', romanji: 'zu', type: 'hiragana' },
  { char: 'で', romanji: 'de', type: 'hiragana' },
  { char: 'ど', romanji: 'do', type: 'hiragana' },
  // B-row
  { char: 'ば', romanji: 'ba', type: 'hiragana' },
  { char: 'び', romanji: 'bi', type: 'hiragana' },
  { char: 'ぶ', romanji: 'bu', type: 'hiragana' },
  { char: 'べ', romanji: 'be', type: 'hiragana' },
  { char: 'ぼ', romanji: 'bo', type: 'hiragana' },
  // P-row
  { char: 'ぱ', romanji: 'pa', type: 'hiragana' },
  { char: 'ぴ', romanji: 'pi', type: 'hiragana' },
  { char: 'ぷ', romanji: 'pu', type: 'hiragana' },
  { char: 'ぺ', romanji: 'pe', type: 'hiragana' },
  { char: 'ぽ', romanji: 'po', type: 'hiragana' },
];

// Basic Katakana
const katakana: KanaChar[] = [
  // Vowels
  { char: 'ア', romanji: 'a', type: 'katakana' },
  { char: 'イ', romanji: 'i', type: 'katakana' },
  { char: 'ウ', romanji: 'u', type: 'katakana' },
  { char: 'エ', romanji: 'e', type: 'katakana' },
  { char: 'オ', romanji: 'o', type: 'katakana' },
  // K-row
  { char: 'カ', romanji: 'ka', type: 'katakana' },
  { char: 'キ', romanji: 'ki', type: 'katakana' },
  { char: 'ク', romanji: 'ku', type: 'katakana' },
  { char: 'ケ', romanji: 'ke', type: 'katakana' },
  { char: 'コ', romanji: 'ko', type: 'katakana' },
  // S-row
  { char: 'サ', romanji: 'sa', type: 'katakana' },
  { char: 'シ', romanji: 'shi', type: 'katakana' },
  { char: 'ス', romanji: 'su', type: 'katakana' },
  { char: 'セ', romanji: 'se', type: 'katakana' },
  { char: 'ソ', romanji: 'so', type: 'katakana' },
  // T-row
  { char: 'タ', romanji: 'ta', type: 'katakana' },
  { char: 'チ', romanji: 'chi', type: 'katakana' },
  { char: 'ツ', romanji: 'tsu', type: 'katakana' },
  { char: 'テ', romanji: 'te', type: 'katakana' },
  { char: 'ト', romanji: 'to', type: 'katakana' },
  // N-row
  { char: 'ナ', romanji: 'na', type: 'katakana' },
  { char: 'ニ', romanji: 'ni', type: 'katakana' },
  { char: 'ヌ', romanji: 'nu', type: 'katakana' },
  { char: 'ネ', romanji: 'ne', type: 'katakana' },
  { char: 'ノ', romanji: 'no', type: 'katakana' },
  // H-row
  { char: 'ハ', romanji: 'ha', type: 'katakana' },
  { char: 'ヒ', romanji: 'hi', type: 'katakana' },
  { char: 'フ', romanji: 'fu', type: 'katakana' },
  { char: 'ヘ', romanji: 'he', type: 'katakana' },
  { char: 'ホ', romanji: 'ho', type: 'katakana' },
  // M-row
  { char: 'マ', romanji: 'ma', type: 'katakana' },
  { char: 'ミ', romanji: 'mi', type: 'katakana' },
  { char: 'ム', romanji: 'mu', type: 'katakana' },
  { char: 'メ', romanji: 'me', type: 'katakana' },
  { char: 'モ', romanji: 'mo', type: 'katakana' },
  // Y-row
  { char: 'ヤ', romanji: 'ya', type: 'katakana' },
  { char: 'ユ', romanji: 'yu', type: 'katakana' },
  { char: 'ヨ', romanji: 'yo', type: 'katakana' },
  // R-row
  { char: 'ラ', romanji: 'ra', type: 'katakana' },
  { char: 'リ', romanji: 'ri', type: 'katakana' },
  { char: 'ル', romanji: 'ru', type: 'katakana' },
  { char: 'レ', romanji: 're', type: 'katakana' },
  { char: 'ロ', romanji: 'ro', type: 'katakana' },
  // W-row
  { char: 'ワ', romanji: 'wa', type: 'katakana' },
  { char: 'ヲ', romanji: 'wo', type: 'katakana' },
  // N
  { char: 'ン', romanji: 'n', type: 'katakana' },
  // G-row
  { char: 'ガ', romanji: 'ga', type: 'katakana' },
  { char: 'ギ', romanji: 'gi', type: 'katakana' },
  { char: 'グ', romanji: 'gu', type: 'katakana' },
  { char: 'ゲ', romanji: 'ge', type: 'katakana' },
  { char: 'ゴ', romanji: 'go', type: 'katakana' },
  // Z-row
  { char: 'ザ', romanji: 'za', type: 'katakana' },
  { char: 'ジ', romanji: 'ji', type: 'katakana' },
  { char: 'ズ', romanji: 'zu', type: 'katakana' },
  { char: 'ゼ', romanji: 'ze', type: 'katakana' },
  { char: 'ゾ', romanji: 'zo', type: 'katakana' },
  // D-row
  { char: 'ダ', romanji: 'da', type: 'katakana' },
  { char: 'ヂ', romanji: 'ji', type: 'katakana' },
  { char: 'ヅ', romanji: 'zu', type: 'katakana' },
  { char: 'デ', romanji: 'de', type: 'katakana' },
  { char: 'ド', romanji: 'do', type: 'katakana' },
  // B-row
  { char: 'バ', romanji: 'ba', type: 'katakana' },
  { char: 'ビ', romanji: 'bi', type: 'katakana' },
  { char: 'ブ', romanji: 'bu', type: 'katakana' },
  { char: 'ベ', romanji: 'be', type: 'katakana' },
  { char: 'ボ', romanji: 'bo', type: 'katakana' },
  // P-row
  { char: 'パ', romanji: 'pa', type: 'katakana' },
  { char: 'ピ', romanji: 'pi', type: 'katakana' },
  { char: 'プ', romanji: 'pu', type: 'katakana' },
  { char: 'ペ', romanji: 'pe', type: 'katakana' },
  { char: 'ポ', romanji: 'po', type: 'katakana' },
];

export const kanaData = {
  hiragana,
  katakana,
  all: [...hiragana, ...katakana],
};

export function getRandomKana(types: KanaType[]): KanaChar {
  let pool: KanaChar[] = [];

  if (types.includes('hiragana')) {
    pool = [...pool, ...hiragana];
  }
  if (types.includes('katakana')) {
    pool = [...pool, ...katakana];
  }

  const randomIndex = Math.floor(Math.random() * pool.length);
  return pool[randomIndex];
}
