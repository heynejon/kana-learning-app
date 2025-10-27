'use client';

import { useState, useEffect, useRef } from 'react';
import * as wanakana from 'wanakana';

type WordType = 'hiragana' | 'katakana' | 'mix';

interface WordData {
  kana: string;
  kanji: string | null;
  meanings: string;
  type: string;
}

export default function WordsSection() {
  const [selectedType, setSelectedType] = useState<WordType>('hiragana');
  const [currentWord, setCurrentWord] = useState<WordData | null>(null);
  const [nextWord, setNextWord] = useState<WordData | null>(null);
  const [userInput, setUserInput] = useState('');
  const [feedback, setFeedback] = useState<{ type: 'correct' | 'incorrect' | null; message: string }>({
    type: null,
    message: '',
  });
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const initializingRef = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Helper function to fetch a single word
  const fetchWord = async (type: WordType): Promise<WordData | null> => {
    try {
      const response = await fetch(`/api/words?type=${type}`);
      if (!response.ok) {
        throw new Error('Failed to fetch word');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching word:', error);
      return null;
    }
  };

  // Initialize with two words
  const initializeWords = async () => {
    // Prevent multiple simultaneous initializations (React Strict Mode issue)
    if (initializingRef.current) {
      return;
    }

    initializingRef.current = true;

    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    setIsLoading(true);
    setUserInput('');
    setFeedback({ type: null, message: '' });

    try {
      // Fetch two words in parallel
      const [first, second] = await Promise.all([
        fetchWord(selectedType),
        fetchWord(selectedType),
      ]);

      if (first) {
        setCurrentWord(first);
        setNextWord(second);
        // Auto-focus the input after word loads
        setTimeout(() => inputRef.current?.focus(), 100);
      } else {
        setFeedback({
          type: 'incorrect',
          message: 'Failed to load word. Please try again.',
        });
      }
    } catch (error) {
      console.error('Error initializing words:', error);
      setFeedback({
        type: 'incorrect',
        message: 'Failed to load word. Please try again.',
      });
    } finally {
      setIsLoading(false);
      initializingRef.current = false;
    }
  };

  // Handle advancing to next word
  const handleNext = async () => {
    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    if (nextWord) {
      // Immediately show the pre-loaded word
      setCurrentWord(nextWord);
      setUserInput('');
      setFeedback({ type: null, message: '' });
      setTimeout(() => inputRef.current?.focus(), 100);

      // Fetch the next word in the background
      const newNext = await fetchWord(selectedType);
      setNextWord(newNext);
    } else {
      // Fallback: fetch directly if no pre-loaded word
      initializeWords();
    }
  };

  // Fetch word on mount and when type changes
  useEffect(() => {
    initializeWords();
  }, [selectedType]);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentWord || !userInput.trim()) return;

    // Convert the kana to romanji for comparison
    const correctRomanji = wanakana.toRomaji(currentWord.kana).toLowerCase();
    const userRomanji = userInput.trim().toLowerCase();

    // Also accept hiragana/katakana input
    const userAsKana = wanakana.toHiragana(userRomanji);
    const correctAsHiragana = wanakana.toHiragana(currentWord.kana);

    const isCorrect =
      userRomanji === correctRomanji ||
      userAsKana === correctAsHiragana ||
      userInput.trim() === currentWord.kana;

    setScore((prev) => ({
      correct: prev.correct + (isCorrect ? 1 : 0),
      total: prev.total + 1,
    }));

    if (isCorrect) {
      setFeedback({
        type: 'correct',
        message: `Correct! "${currentWord.kana}" = "${correctRomanji}"`,
      });
    } else {
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
        {isLoading ? (
          <div className="text-center py-8 md:py-12">
            <div className="animate-spin rounded-full h-10 w-10 md:h-12 md:w-12 border-b-2 border-[#BC002D] mx-auto"></div>
            <p className="mt-3 md:mt-4 text-sm md:text-base text-gray-600 dark:text-gray-400">Loading word...</p>
          </div>
        ) : currentWord ? (
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
                  onChange={(e) => setUserInput(e.target.value)}
                  disabled={feedback.type !== null}
                  placeholder="Type the romanji (e.g., neko, inu)"
                  className="w-full px-3 md:px-4 py-2.5 md:py-3 text-base md:text-lg border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#BC002D] focus:border-transparent dark:bg-gray-700 dark:text-white disabled:opacity-50"
                  autoComplete="off"
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
                    Meaning: {currentWord.meanings}
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
                    onClick={handleNext}
                    className="flex-1 bg-[#BC002D] hover:bg-[#a3002a] text-white font-semibold py-2.5 md:py-3 px-4 md:px-6 rounded-lg transition-colors text-sm md:text-base"
                  >
                    Next (or press Enter)
                  </button>
                )}
              </div>
            </form>
          </div>
        ) : (
          <div className="text-center text-red-500 text-sm md:text-base">
            Failed to load word. Please try again.
          </div>
        )}
      </div>
    </div>
  );
}
