'use client';

import { useState, useCallback } from 'react';
import { numbersData, getDisplayText, NumberCategory, NumberItem } from '@/lib/numbersData';

type Mode = 'selection' | 'chart' | 'quiz';

const categories: NumberCategory[] = ['digit', 'kanji', 'reading'];

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

// Generate a quiz question
function generateQuestion(): {
  item: NumberItem;
  questionCategory: NumberCategory;
  answerCategory: NumberCategory;
  options: NumberItem[];
} {
  const item = pickRandom(numbersData);
  const questionCategory = pickRandom(categories);
  // Answer category must differ from question
  const remaining = categories.filter((c) => c !== questionCategory);
  const answerCategory = pickRandom(remaining);

  // 1 correct + 7 wrong = 8 buttons
  const wrongOptions = pickRandomOptions(item, 7);
  const allOptions = [item, ...wrongOptions].sort(() => Math.random() - 0.5);

  return { item, questionCategory, answerCategory, options: allOptions };
}

export default function NumbersSection({ onBack }: { onBack: () => void }) {
  const [mode, setMode] = useState<Mode>('selection');
  const [question, setQuestion] = useState(() => generateQuestion());
  const [feedback, setFeedback] = useState<{
    type: 'correct' | 'incorrect' | null;
    message: string;
    correctAnswer?: string;
  }>({ type: null, message: '' });
  const [score, setScore] = useState({ correct: 0, total: 0 });

  const nextQuestion = useCallback(() => {
    setQuestion(generateQuestion());
    setFeedback({ type: null, message: '' });
  }, []);

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
      const correctText = getDisplayText(question.item, question.answerCategory);
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

  // Category label for display
  const categoryLabel = (cat: NumberCategory): string => {
    switch (cat) {
      case 'digit': return 'Number';
      case 'kanji': return 'Kanji';
      case 'reading': return 'Reading';
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
            onClick={() => {
              setMode('quiz');
              setScore({ correct: 0, total: 0 });
              setQuestion(generateQuestion());
              setFeedback({ type: null, message: '' });
            }}
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
        <div className="grid grid-cols-3 gap-1 md:gap-2 mb-1 md:mb-2">
          <div className="text-xs md:text-sm font-medium text-gray-500 dark:text-gray-400 text-center py-1">
            Number
          </div>
          <div className="text-xs md:text-sm font-medium text-gray-500 dark:text-gray-400 text-center py-1">
            Kanji
          </div>
          <div className="text-xs md:text-sm font-medium text-gray-500 dark:text-gray-400 text-center py-1">
            Reading
          </div>
        </div>
        {/* Data rows */}
        <div className="space-y-1 md:space-y-2">
          {numbersData.map((item) => (
            <div
              key={item.digit}
              className="grid grid-cols-3 gap-1 md:gap-2 bg-gray-50 dark:bg-gray-700 rounded-lg"
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
    }
  };

  // Font size for answer buttons based on category
  const buttonFontSize = (cat: NumberCategory): string => {
    switch (cat) {
      case 'digit': return 'text-2xl md:text-3xl';
      case 'kanji': return 'text-2xl md:text-3xl';
      case 'reading': return 'text-base md:text-xl';
    }
  };

  // Render quiz view
  const renderQuiz = () => {
    const questionText = getDisplayText(question.item, question.questionCategory);
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
              {questionText}
            </div>
          </div>

          {/* Answer buttons - 4 columns x 2 rows */}
          <div className="grid grid-cols-4 gap-2 md:gap-3">
            {question.options.map((option) => {
              const optionText = getDisplayText(option, question.answerCategory);
              const isCorrectOption = option.digit === question.item.digit;
              const isWrongSelected = hasFeedback && feedback.type === 'incorrect' && !isCorrectOption;

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
                  key={option.digit}
                  onClick={() => handleAnswer(option)}
                  disabled={hasFeedback}
                  className={`${buttonStyle} rounded-lg p-3 md:p-4 text-center transition-colors min-h-[56px] md:min-h-[64px] flex items-center justify-center ${hasFeedback ? 'cursor-default' : ''}`}
                >
                  <span className={`${buttonFontSize(question.answerCategory)} font-bold`}>
                    {optionText}
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
      {mode === 'quiz' && renderQuiz()}
    </div>
  );
}
