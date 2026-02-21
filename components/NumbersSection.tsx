'use client';

import { useState, useCallback } from 'react';
import { numbersData, getDisplayText, getRandomDisplayText, NumberCategory, NumberItem } from '@/lib/numbersData';

type Mode = 'selection' | 'chart' | 'quizSetup' | 'quiz';

const allCategories: NumberCategory[] = ['digit', 'romanji', 'kanji', 'reading'];

// Pick a random element from an array
function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

// Pick N random unique elements from an array (excluding one item)
function pickRandomOptions(
  exclude: NumberItem,
  count: number
): NumberItem[] {
  const pool = numbersData.filter((n) => n.digit !== exclude.digit);
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

// Generate a quiz question using only the selected categories
// Pre-computes all display texts so they don't change on re-render
function generateQuestion(activeCategories: NumberCategory[]): {
  item: NumberItem;
  questionCategory: NumberCategory;
  answerCategory: NumberCategory;
  questionText: string;
  options: { item: NumberItem; text: string }[];
} {
  const item = pickRandom(numbersData);
  const questionCategory = pickRandom(activeCategories);
  // Answer category must differ from question
  const remaining = activeCategories.filter((c) => c !== questionCategory);
  const answerCategory = pickRandom(remaining);

  // 1 correct + 7 wrong = 8 buttons
  const wrongOptions = pickRandomOptions(item, 7);
  const allOptions = [item, ...wrongOptions].sort(() => Math.random() - 0.5);

  // Lock display texts at generation time
  const questionText = getRandomDisplayText(item, questionCategory);
  const options = allOptions.map((opt) => ({
    item: opt,
    text: getRandomDisplayText(opt, answerCategory),
  }));

  return { item, questionCategory, answerCategory, questionText, options };
}

export default function NumbersSection({ onBack }: { onBack: () => void }) {
  const [mode, setMode] = useState<Mode>('selection');
  const [selectedCategories, setSelectedCategories] = useState<Set<NumberCategory>>(
    new Set(allCategories)
  );
  const [question, setQuestion] = useState(() => generateQuestion(allCategories));
  const [feedback, setFeedback] = useState<{
    type: 'correct' | 'incorrect' | null;
    message: string;
    correctAnswer?: string;
  }>({ type: null, message: '' });
  const [score, setScore] = useState({ correct: 0, total: 0 });

  const nextQuestion = useCallback(() => {
    setQuestion(generateQuestion(Array.from(selectedCategories)));
    setFeedback({ type: null, message: '' });
  }, [selectedCategories]);

  const handleAnswer = (selected: NumberItem) => {
    if (feedback.type !== null) return; // Already answered

    const isCorrect = selected.digit === question.item.digit;

    setScore((prev) => ({
      correct: prev.correct + (isCorrect ? 1 : 0),
      total: prev.total + 1,
    }));

    if (isCorrect) {
      setFeedback({ type: 'correct', message: 'Correct!' });
    } else {
      const correctOption = question.options.find((o) => o.item.digit === question.item.digit);
      const correctText = correctOption?.text ?? '';
      setFeedback({
        type: 'incorrect',
        message: `Incorrect. The answer is ${correctText}`,
        correctAnswer: correctText,
      });
    }
  };

  const handleBackToSelection = () => {
    setMode('selection');
    setScore({ correct: 0, total: 0 });
    setFeedback({ type: null, message: '' });
  };

  const toggleCategory = (cat: NumberCategory) => {
    const next = new Set(selectedCategories);
    if (next.has(cat)) {
      next.delete(cat);
    } else {
      next.add(cat);
    }
    setSelectedCategories(next);
  };

  // Category label for display
  const categoryLabel = (cat: NumberCategory): string => {
    switch (cat) {
      case 'digit': return 'Number';
      case 'kanji': return 'Kanji';
      case 'reading': return 'Kana';
      case 'romanji': return 'Romanji';
    }
  };

  // Example value for category (using number 1)
  const categoryExample = (cat: NumberCategory): string => {
    switch (cat) {
      case 'digit': return '1';
      case 'kanji': return '一';
      case 'reading': return 'いち';
      case 'romanji': return 'ichi';
    }
  };

  // Render mode selection
  const renderModeSelection = () => (
    <div className="space-y-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 md:p-8">
        <div className="space-y-3">
          <button
            onClick={() => setMode('chart')}
            className="w-full p-4 md:p-6 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors text-left"
          >
            <div className="font-semibold text-lg text-gray-900 dark:text-white">Chart</div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              View all numbers with kanji and readings
            </div>
          </button>

          <button
            onClick={() => setMode('quizSetup')}
            className="w-full p-4 md:p-6 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors text-left"
          >
            <div className="font-semibold text-lg text-gray-900 dark:text-white">Quiz</div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Match numbers, kanji, and readings
            </div>
          </button>
        </div>
      </div>
    </div>
  );

  // Render quiz setup (category selection)
  const renderQuizSetup = () => (
    <div className="space-y-2 md:space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-3 md:p-4">
        <button
          onClick={handleBackToSelection}
          className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
        >
          ← Back
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 md:p-6">
        <p className="text-sm text-gray-600 dark:text-gray-400 text-center mb-4">
          What do you want to be quizzed on?
        </p>

        <div className="flex gap-2">
          {allCategories.map((cat) => {
            const isSelected = selectedCategories.has(cat);
            return (
              <button
                key={cat}
                onClick={() => toggleCategory(cat)}
                className={`flex-1 p-3 md:p-4 rounded-lg font-medium transition-colors text-xs md:text-sm ${
                  isSelected
                    ? 'bg-[#BC002D] text-white'
                    : 'bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}
              >
                {categoryLabel(cat)} ({categoryExample(cat)})
              </button>
            );
          })}
        </div>

        <div className="flex items-center justify-between mt-4">
          <button
            onClick={() => {
              if (selectedCategories.size === allCategories.length) {
                setSelectedCategories(new Set());
              } else {
                setSelectedCategories(new Set(allCategories));
              }
            }}
            className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            {selectedCategories.size === allCategories.length ? 'Deselect All' : 'Select All'}
          </button>
          <button
            onClick={() => {
              const cats = Array.from(selectedCategories);
              setScore({ correct: 0, total: 0 });
              setQuestion(generateQuestion(cats));
              setFeedback({ type: null, message: '' });
              setMode('quiz');
            }}
            disabled={selectedCategories.size < 2}
            className="bg-[#BC002D] hover:bg-[#a3002a] disabled:bg-gray-400 text-white font-semibold py-2 px-6 rounded-lg transition-colors disabled:cursor-not-allowed text-sm md:text-base"
          >
            Start Quiz →
          </button>
        </div>
      </div>
    </div>
  );

  // Render chart view
  const renderChart = () => (
    <div className="space-y-2 md:space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-3 md:p-4">
        <button
          onClick={handleBackToSelection}
          className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
        >
          ← Back
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-3 md:p-6">
        {/* Header row */}
        <div className="grid grid-cols-4 gap-1 md:gap-2 mb-1 md:mb-2">
          <div className="text-xs md:text-sm font-medium text-gray-500 dark:text-gray-400 text-center py-1">
            Number
          </div>
          <div className="text-xs md:text-sm font-medium text-gray-500 dark:text-gray-400 text-center py-1">
            Kanji
          </div>
          <div className="text-xs md:text-sm font-medium text-gray-500 dark:text-gray-400 text-center py-1">
            Kana
          </div>
          <div className="text-xs md:text-sm font-medium text-gray-500 dark:text-gray-400 text-center py-1">
            Romanji
          </div>
        </div>
        {/* Data rows */}
        <div className="space-y-1 md:space-y-2">
          {numbersData.map((item) => (
            <div
              key={item.digit}
              className="grid grid-cols-4 gap-1 md:gap-2 bg-gray-50 dark:bg-gray-700 rounded-lg"
            >
              <div className="flex items-center justify-center p-2 md:p-3">
                <span className="text-xl md:text-2xl font-bold text-[#BC002D]">
                  {item.digit}
                </span>
              </div>
              <div className="flex items-center justify-center p-2 md:p-3">
                <span className="text-2xl md:text-4xl font-bold text-gray-900 dark:text-white">
                  {item.kanji}
                </span>
              </div>
              <div className="flex items-center justify-center p-2 md:p-3">
                <span className="text-sm md:text-base text-gray-700 dark:text-gray-300">
                  {item.readings.join(' / ')}
                </span>
              </div>
              <div className="flex items-center justify-center p-2 md:p-3">
                <span className="text-sm md:text-base text-gray-700 dark:text-gray-300">
                  {item.romanji.join(' / ')}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // Font size for question display based on category
  const questionFontSize = (cat: NumberCategory): string => {
    switch (cat) {
      case 'digit': return 'text-7xl md:text-9xl';
      case 'kanji': return 'text-7xl md:text-9xl';
      case 'reading': return 'text-4xl md:text-6xl';
      case 'romanji': return 'text-4xl md:text-6xl';
    }
  };

  // Font size for answer buttons based on category
  const buttonFontSize = (cat: NumberCategory): string => {
    switch (cat) {
      case 'digit': return 'text-2xl md:text-3xl';
      case 'kanji': return 'text-2xl md:text-3xl';
      case 'reading': return 'text-base md:text-xl';
      case 'romanji': return 'text-base md:text-xl';
    }
  };

  // Render quiz view
  const renderQuiz = () => {
    const hasFeedback = feedback.type !== null;

    return (
      <div className="space-y-2 md:space-y-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-3 md:p-4">
          <div className="flex items-center justify-between">
            <button
              onClick={handleBackToSelection}
              className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              ← Back
            </button>
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

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 md:p-8">
          {/* Question display */}
          <div className="text-center mb-6 md:mb-8">
            <div className={`${questionFontSize(question.questionCategory)} font-bold text-gray-900 dark:text-white my-4 md:my-6`}>
              {question.questionText}
            </div>
          </div>

          {/* Answer buttons - 4 columns x 2 rows */}
          <div className="grid grid-cols-4 gap-2 md:gap-3">
            {question.options.map((option) => {
              const isCorrectOption = option.item.digit === question.item.digit;

              let buttonStyle = 'bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-900 dark:text-white';

              if (hasFeedback) {
                if (isCorrectOption) {
                  buttonStyle = 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100 ring-2 ring-green-500';
                } else {
                  buttonStyle = 'bg-gray-50 dark:bg-gray-700 text-gray-400 dark:text-gray-600';
                }
              }

              return (
                <button
                  key={option.item.digit}
                  onClick={() => handleAnswer(option.item)}
                  disabled={hasFeedback}
                  className={`${buttonStyle} rounded-lg p-3 md:p-4 text-center transition-colors min-h-[56px] md:min-h-[64px] flex items-center justify-center ${hasFeedback ? 'cursor-default' : ''}`}
                >
                  <span className={`${buttonFontSize(question.answerCategory)} font-bold`}>
                    {option.text}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Feedback */}
          {hasFeedback && (
            <div className="mt-4 space-y-3">
              <div
                className={`p-3 md:p-4 rounded-lg text-sm md:text-base text-center ${
                  feedback.type === 'correct'
                    ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100'
                    : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-100'
                }`}
              >
                {feedback.message}
              </div>
              <button
                onClick={nextQuestion}
                className="w-full bg-[#BC002D] hover:bg-[#a3002a] text-white font-semibold py-3 px-4 rounded-lg transition-colors"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div>
      {mode === 'selection' && renderModeSelection()}
      {mode === 'chart' && renderChart()}
      {mode === 'quizSetup' && renderQuizSetup()}
      {mode === 'quiz' && renderQuiz()}
    </div>
  );
}
