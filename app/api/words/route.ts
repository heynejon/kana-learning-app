import { NextResponse } from 'next/server';
import * as wanakana from 'wanakana';

// Common simple words for practice (hiragana words)
const hiraganaWords = [
  'cat', 'dog', 'water', 'fire', 'person', 'hand', 'eye', 'foot',
  'eat', 'drink', 'book', 'school', 'house', 'car', 'tree', 'flower',
  'rain', 'snow', 'sun', 'moon', 'day', 'night', 'morning', 'evening',
  'mother', 'father', 'child', 'friend', 'teacher', 'student',
  'big', 'small', 'good', 'bad', 'hot', 'cold', 'new', 'old',
  'red', 'blue', 'white', 'black', 'color', 'music', 'love', 'time'
];

// Katakana words (typically foreign loanwords)
const katakanaWords = [
  'coffee', 'tea', 'beer', 'wine', 'cake', 'ice cream', 'chocolate',
  'computer', 'internet', 'email', 'camera', 'video', 'game', 'smartphone',
  'bus', 'taxi', 'truck', 'hotel', 'restaurant', 'cafe', 'menu',
  'pen', 'notebook', 'desk', 'table', 'chair', 'door', 'window',
  'shirt', 'pants', 'dress', 'shoes', 'bag', 'hat', 'watch',
  'America', 'France', 'Italy', 'Canada', 'Australia', 'India',
  'television', 'radio', 'news', 'sports', 'tennis', 'soccer', 'baseball'
];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type') || 'hiragana'; // hiragana, katakana, or mix

  try {
    // Pick the appropriate word list based on type
    let wordList = hiraganaWords;
    if (type === 'katakana') {
      wordList = katakanaWords;
    } else if (type === 'mix') {
      wordList = [...hiraganaWords, ...katakanaWords];
    }

    // Pick a random word to search for
    const randomWord = wordList[Math.floor(Math.random() * wordList.length)];

    // Search using Jisho API directly
    const response = await fetch(`https://jisho.org/api/v1/search/words?keyword=${encodeURIComponent(randomWord)}`);

    if (!response.ok) {
      throw new Error('Jisho API request failed');
    }

    const result = await response.json();

    if (!result.data || result.data.length === 0) {
      return NextResponse.json({ error: 'No words found' }, { status: 404 });
    }

    // Filter results to find words with appropriate kana
    const filteredResults = result.data
      .filter((item: any) => {
        // Make sure we have Japanese reading and it's not just kanji
        if (!item.japanese || item.japanese.length === 0) return false;

        const hasReading = item.japanese.some((j: any) => j.reading);
        return hasReading;
      })
      .slice(0, 10); // Take up to 10 results

    if (filteredResults.length === 0) {
      return NextResponse.json({ error: 'No suitable words found' }, { status: 404 });
    }

    // Pick a random result
    const randomResult = filteredResults[Math.floor(Math.random() * filteredResults.length)];

    // Get the reading (kana)
    const japaneseEntry = randomResult.japanese[0];
    const kana = japaneseEntry.reading || japaneseEntry.word;
    const kanji = japaneseEntry.word;

    // Get English meanings
    const meanings = randomResult.senses
      ?.slice(0, 2)
      .map((sense: any) => sense.english_definitions?.join(', '))
      .filter(Boolean)
      .join('; ') || 'No definition available';

    // Check if the word is primarily hiragana or katakana
    const hasHiragana = /[\u3040-\u309F]/.test(kana);
    const hasKatakana = /[\u30A0-\u30FF]/.test(kana);

    // Check if word is ONLY one type (more strict filtering)
    const isOnlyHiragana = hasHiragana && !hasKatakana;
    const isOnlyKatakana = hasKatakana && !hasHiragana;

    // Filter based on requested type (with retry limit to prevent infinite recursion)
    const maxRetries = 10;
    const retryCount = parseInt(searchParams.get('_retry') || '0');

    if (retryCount < maxRetries) {
      // If user wants hiragana only, skip katakana-only words
      if (type === 'hiragana' && isOnlyKatakana) {
        const retryUrl = new URL(request.url);
        retryUrl.searchParams.set('_retry', (retryCount + 1).toString());
        return GET(new Request(retryUrl.toString()));
      }
      // If user wants katakana only, skip hiragana-only words
      if (type === 'katakana' && isOnlyHiragana) {
        const retryUrl = new URL(request.url);
        retryUrl.searchParams.set('_retry', (retryCount + 1).toString());
        return GET(new Request(retryUrl.toString()));
      }
    }

    // Determine primary type for display
    const primaryType = isOnlyKatakana ? 'katakana' : isOnlyHiragana ? 'hiragana' : 'mixed';

    // Return the word data
    return NextResponse.json({
      kana,
      kanji: kanji !== kana ? kanji : null,
      meanings,
      type: primaryType,
    });
  } catch (error) {
    console.error('Error fetching word:', error);
    return NextResponse.json({ error: 'Failed to fetch word' }, { status: 500 });
  }
}
