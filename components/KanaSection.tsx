'use client';

import { useState, useEffect, useRef } from 'react';
import { getRandomKana, KanaType, KanaChar } from '@/lib/kanaData';

type KanaSelectionType = 'hiragana' | 'katakana' | 'mix';

export default function KanaSection() {
  const [selectedType, setSelectedType] = useState<KanaSelectionType>('hiragana');
  const [currentKana, setCurrentKana] = useState<KanaChar | null>(null);
  const [userInput, setUserInput] = useState('');
  const [feedback, setFeedback] = useState<{ type: 'correct' | 'incorrect' | null; message: string }>({
    type: null,
    message: '',
  });
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const inputRef = useRef<HTMLInputElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Generate new kana when component mounts or types change
  useEffect(() => {
    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    const types: KanaType[] = selectedType === 'mix' ? ['hiragana', 'katakana'] : [selectedType];
    setCurrentKana(getRandomKana(types));
    setUserInput('');
    setFeedback({ type: null, message: '' });

    // Auto-focus the input
    setTimeout(() => inputRef.current?.focus(), 100);
  }, [selectedType]);

  // Handle advancing to next kana
  const handleNext = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    const types: KanaType[] = selectedType === 'mix' ? ['hiragana', 'katakana'] : [selectedType];
    setCurrentKana(getRandomKana(types));
    setUserInput('');
    setFeedback({ type: null, message: '' });
    // Delay focus to allow React to re-render and enable the input
    setTimeout(() => inputRef.current?.focus(), 100);
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
  }, [feedback.type]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentKana || !userInput.trim()) return;

    const isCorrect = userInput.trim().toLowerCase() === currentKana.romanji.toLowerCase();

    setScore((prev) => ({
      correct: prev.correct + (isCorrect ? 1 : 0),
      total: prev.total + 1,
    }));

    if (isCorrect) {
      setFeedback({
        type: 'correct',
        message: 'Correct!',
      });
    } else {
      setFeedback({
        type: 'incorrect',
        message: `Incorrect. The correct answer is "${currentKana.romanji}"`,
      });
    }

    // Auto-advance after 10 seconds
    timeoutRef.current = setTimeout(() => {
      handleNext();
    }, 10000);
  };

  const handleSkip = () => {
    handleNext();
  };

  return (
    <div className="space-y-6">
      {/* Type Toggle */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
        <h2 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">Character Type</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setSelectedType('hiragana')}
            className={`flex-1 py-2 px-3 rounded-lg font-medium transition-colors text-sm ${
              selectedType === 'hiragana'
                ? 'bg-[#BC002D] text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}
          >
            Hiragana
          </button>
          <button
            onClick={() => setSelectedType('katakana')}
            className={`flex-1 py-2 px-3 rounded-lg font-medium transition-colors text-sm ${
              selectedType === 'katakana'
                ? 'bg-[#BC002D] text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}
          >
            Katakana
          </button>
          <button
            onClick={() => setSelectedType('mix')}
            className={`flex-1 py-2 px-3 rounded-lg font-medium transition-colors text-sm ${
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
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
        <div className="text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">Score</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {score.correct} / {score.total}
            {score.total > 0 && (
              <span className="text-sm ml-2 text-gray-600 dark:text-gray-400">
                ({Math.round((score.correct / score.total) * 100)}%)
              </span>
            )}
          </p>
        </div>
      </div>

      {/* Main Card */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
        {currentKana ? (
          <div className="space-y-6">
            {/* Kana Display */}
            <div className="text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                What sound does this make?
              </p>
              <div className="text-9xl font-bold text-gray-900 dark:text-white my-8">
                {currentKana.char}
              </div>
            </div>

            {/* Input Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="answer" className="sr-only">
                  Your answer
                </label>
                <input
                  ref={inputRef}
                  id="answer"
                  type="text"
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  disabled={feedback.type !== null}
                  placeholder="Type the romanji (e.g., ka, shi, n)"
                  className="w-full px-4 py-3 text-lg border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#BC002D] focus:border-transparent dark:bg-gray-700 dark:text-white disabled:opacity-50"
                  autoComplete="off"
                  autoFocus
                />
              </div>

              {/* Feedback */}
              {feedback.type && (
                <div
                  className={`p-4 rounded-lg ${
                    feedback.type === 'correct'
                      ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100'
                      : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-100'
                  }`}
                >
                  {feedback.message}
                </div>
              )}

              {/* Buttons */}
              <div className="flex gap-3">
                {feedback.type === null ? (
                  <>
                    <button
                      type="submit"
                      disabled={!userInput.trim()}
                      className="flex-1 bg-[#BC002D] hover:bg-[#a3002a] disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors disabled:cursor-not-allowed"
                    >
                      Submit
                    </button>
                    <button
                      type="button"
                      onClick={handleSkip}
                      className="px-6 py-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-semibold rounded-lg transition-colors"
                    >
                      Skip
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="flex-1 bg-[#BC002D] hover:bg-[#a3002a] text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                  >
                    Next (or press Enter)
                  </button>
                )}
              </div>
            </form>
          </div>
        ) : (
          <div className="text-center text-gray-500">
            Please select at least one character type
          </div>
        )}
      </div>
    </div>
  );
}
