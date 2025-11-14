'use client';

import { useState, useEffect, useRef } from 'react';
import * as wanakana from 'wanakana';
import { hiraganaWords, katakanaWords, Word } from '@/lib/wordData';

type WordType = 'hiragana' | 'katakana' | 'mix';

export default function WordsSection() {
  const [selectedType, setSelectedType] = useState<WordType>('hiragana');
  const [currentWord, setCurrentWord] = useState<Word | null>(null);
  const [remainingWords, setRemainingWords] = useState<Word[]>([]);
  const [completedWords, setCompletedWords] = useState<Set<string>>(new Set());
  const [userInput, setUserInput] = useState('');
  const [feedback, setFeedback] = useState<{ type: 'correct' | 'incorrect' | null; message: string }>({
    type: null,
    message: '',
  });
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const inputRef = useRef<HTMLInputElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Initialize word rotation when type changes
  useEffect(() => {
    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    // Reset score and tracking when switching types
    setScore({ correct: 0, total: 0 });
    setCompletedWords(new Set());

    // Build the word pool based on selected type
    let wordPool: Word[] = [];
    if (selectedType === 'hiragana') {
      wordPool = [...hiraganaWords];
    } else if (selectedType === 'katakana') {
      wordPool = [...katakanaWords];
    } else {
      wordPool = [...hiraganaWords, ...katakanaWords];
    }

    // Initialize remaining words with full pool
    setRemainingWords(wordPool);

    // Select first random word from the pool
    const randomIndex = Math.floor(Math.random() * wordPool.length);
    setCurrentWord(wordPool[randomIndex]);
    setUserInput('');
    setFeedback({ type: null, message: '' });

    // Auto-focus the input - multiple attempts for mobile
    setTimeout(() => inputRef.current?.focus(), 100);
    setTimeout(() => inputRef.current?.focus(), 200);
    setTimeout(() => inputRef.current?.focus(), 350);
  }, [selectedType]);

  // Handle advancing to next word
  const handleNext = () => {
    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    // Check if we need to reset the rotation (all words completed)
    let wordsToUse = remainingWords;
    if (remainingWords.length === 0) {
      // Reset: rebuild the full word pool
      let wordPool: Word[] = [];
      if (selectedType === 'hiragana') {
        wordPool = [...hiraganaWords];
      } else if (selectedType === 'katakana') {
        wordPool = [...katakanaWords];
      } else {
        wordPool = [...hiraganaWords, ...katakanaWords];
      }
      setRemainingWords(wordPool);
      setCompletedWords(new Set());
      wordsToUse = wordPool;
    }

    // Select a random word from remaining words
    const randomIndex = Math.floor(Math.random() * wordsToUse.length);
    setCurrentWord(wordsToUse[randomIndex]);
    setUserInput('');
    setFeedback({ type: null, message: '' });

    // Re-focus after state updates complete
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  // Handle Enter key press to advance after feedback
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && feedback.type !== null) {
        handleNext();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [feedback.type, handleNext]);

  // Handle mobile keyboard visibility - scroll input into view
  useEffect(() => {
    const handleViewportResize = () => {
      if (inputRef.current && document.activeElement === inputRef.current) {
        // Wait for keyboard animation to complete
        setTimeout(() => {
          inputRef.current?.scrollIntoView({
            behavior: 'smooth',
            block: 'center'
          });
        }, 300);
      }
    };

    // Use visualViewport if available (better for mobile keyboard detection)
    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', handleViewportResize);
      return () => {
        window.visualViewport?.removeEventListener('resize', handleViewportResize);
      };
    }
  }, []);

  // Normalize romanization for flexible matching
  const normalizeRomanji = (text: string): string => {
    return text
      .toLowerCase()
      .replace(/['\s-]/g, '') // Remove apostrophes, spaces, and hyphens
      .replace(/ō/g, 'o')      // Replace macrons
      .replace(/ū/g, 'u')
      .replace(/ā/g, 'a')
      .replace(/ē/g, 'e')
      .replace(/ī/g, 'i')
      .replace(/ou/g, 'o')     // Handle long vowel variations
      .replace(/oo/g, 'o')
      .replace(/uu/g, 'u')
      .replace(/ei/g, 'e');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentWord || !userInput.trim()) return;

    // Convert the kana to romanji for comparison
    const correctRomanji = wanakana.toRomaji(currentWord.kana).toLowerCase();
    const userRomanji = userInput.trim().toLowerCase();

    // Also accept hiragana/katakana input
    const userAsKana = wanakana.toHiragana(userRomanji);
    const correctAsHiragana = wanakana.toHiragana(currentWord.kana);

    // Flexible matching: normalize both strings and compare
    const normalizedCorrect = normalizeRomanji(correctRomanji);
    const normalizedUser = normalizeRomanji(userRomanji);

    const isCorrect =
      userRomanji === correctRomanji ||              // Exact match
      normalizedUser === normalizedCorrect ||        // Normalized match (handles variations)
      userAsKana === correctAsHiragana ||            // Kana input match
      userInput.trim() === currentWord.kana;         // Direct kana match

    setScore((prev) => ({
      correct: prev.correct + (isCorrect ? 1 : 0),
      total: prev.total + 1,
    }));

    if (isCorrect) {
      // Remove word from rotation - it won't appear again until reset
      setCompletedWords(new Set(completedWords.add(currentWord.kana)));
      setRemainingWords(remainingWords.filter(word => word.kana !== currentWord.kana));

      setFeedback({
        type: 'correct',
        message: `Correct! "${currentWord.kana}" = "${correctRomanji}"`,
      });
    } else {
      // Word stays in rotation - can appear again
      setFeedback({
        type: 'incorrect',
        message: `Incorrect. "${currentWord.kana}" = "${correctRomanji}"`,
      });
    }

    // Auto-advance after 15 seconds
    timeoutRef.current = setTimeout(() => {
      handleNext();
    }, 15000);
  };

  const handleSkip = () => {
    handleNext();
  };

  return (
    <div className="space-y-2 md:space-y-6" ref={containerRef}>
      {/* Compact Header: Type Toggle + Score (mobile) / Separate (desktop) */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-3 md:p-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          {/* Type Toggle */}
          <div className="flex-1">
            <div className="flex gap-2">
              <button
                onClick={() => setSelectedType('hiragana')}
                className={`flex-1 py-1.5 md:py-2 px-2 md:px-3 rounded-lg font-medium transition-colors text-xs md:text-sm ${
                  selectedType === 'hiragana'
                    ? 'bg-[#BC002D] text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}
              >
                Hiragana
              </button>
              <button
                onClick={() => setSelectedType('katakana')}
                className={`flex-1 py-1.5 md:py-2 px-2 md:px-3 rounded-lg font-medium transition-colors text-xs md:text-sm ${
                  selectedType === 'katakana'
                    ? 'bg-[#BC002D] text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}
              >
                Katakana
              </button>
              <button
                onClick={() => setSelectedType('mix')}
                className={`flex-1 py-1.5 md:py-2 px-2 md:px-3 rounded-lg font-medium transition-colors text-xs md:text-sm ${
                  selectedType === 'mix'
                    ? 'bg-[#BC002D] text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}
              >
                Mix
              </button>
            </div>
          </div>

          {/* Score */}
          <div className="md:ml-4 md:min-w-[120px]">
            <div className="text-center">
              <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400">Score</p>
              <p className="text-lg md:text-2xl font-bold text-gray-900 dark:text-white">
                {score.correct} / {score.total}
                {score.total > 0 && (
                  <span className="text-xs md:text-sm ml-2 text-gray-600 dark:text-gray-400">
                    ({Math.round((score.correct / score.total) * 100)}%)
                  </span>
                )}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Card */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 md:p-8">
        {currentWord ? (
          <div className="space-y-2 md:space-y-6">
            {/* Word Display */}
            <div className="text-center">
              <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400 mb-2">
                Type the romanji for this word:
              </p>
              <div className="text-5xl md:text-7xl font-bold text-gray-900 dark:text-white my-4 md:my-6">
                {currentWord.kana}
              </div>
            </div>

            {/* Input Form */}
            <form onSubmit={handleSubmit} className="space-y-3 md:space-y-4">
              <div>
                <label htmlFor="word-answer" className="sr-only">
                  Your answer
                </label>
                <input
                  ref={inputRef}
                  id="word-answer"
                  type="text"
                  value={userInput}
                  onChange={(e) => {
                    // Only update if we haven't submitted yet
                    if (feedback.type === null) {
                      setUserInput(e.target.value);
                    }
                  }}
                  placeholder="Type the romanji (e.g., neko, inu)"
                  className="w-full px-3 md:px-4 py-2.5 md:py-3 text-base md:text-lg border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#BC002D] focus:border-transparent dark:bg-gray-700 dark:text-white"
                  autoComplete="off"
                  inputMode="text"
                  autoFocus
                />
              </div>

              {/* Feedback */}
              {feedback.type && (
                <div
                  className={`p-3 md:p-4 rounded-lg text-sm md:text-base ${
                    feedback.type === 'correct'
                      ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100'
                      : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-100'
                  }`}
                >
                  {feedback.message}
                </div>
              )}

              {/* Meaning - shown after feedback */}
              {feedback.type !== null && (
                <div className="bg-blue-50 dark:bg-blue-900/30 rounded-lg p-2.5 md:p-3">
                  <p className="text-xs md:text-sm font-medium text-blue-900 dark:text-blue-200">
                    Meaning: {currentWord.meaning}
                  </p>
                </div>
              )}

              {/* Buttons */}
              <div className="flex gap-2 md:gap-3">
                {feedback.type === null ? (
                  <>
                    <button
                      type="submit"
                      disabled={!userInput.trim()}
                      className="flex-1 bg-[#BC002D] hover:bg-[#a3002a] disabled:bg-gray-400 text-white font-semibold py-2.5 md:py-3 px-4 md:px-6 rounded-lg transition-colors disabled:cursor-not-allowed text-sm md:text-base"
                    >
                      Submit
                    </button>
                    <button
                      type="button"
                      onClick={handleSkip}
                      className="px-4 md:px-6 py-2.5 md:py-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-semibold rounded-lg transition-colors text-sm md:text-base"
                    >
                      Skip
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={(e) => {
                      // Focus input first, synchronously during click event
                      inputRef.current?.focus();
                      // Small delay to let focus settle, then advance
                      setTimeout(() => handleNext(), 10);
                    }}
                    className="flex-1 bg-[#BC002D] hover:bg-[#a3002a] text-white font-semibold py-2.5 md:py-3 px-4 md:px-6 rounded-lg transition-colors text-sm md:text-base"
                  >
                    Next (or press Enter)
                  </button>
                )}
              </div>
            </form>
          </div>
        ) : null}
      </div>
    </div>
  );
}
