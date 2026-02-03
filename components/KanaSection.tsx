'use client';

import { useState, useEffect, useRef } from 'react';
import { getRandomKana, KanaType, KanaChar, kanaData } from '@/lib/kanaData';

type KanaSelectionType = 'hiragana' | 'katakana' | 'mix';
type Mode = 'selection' | 'quiz' | 'practiceAll' | 'practiceSelected';

export default function KanaSection() {
  // Mode state
  const [mode, setMode] = useState<Mode>('selection');

  // Practice Selected state
  const [selectedChars, setSelectedChars] = useState<Set<string>>(new Set());
  const [selectedChartType, setSelectedChartType] = useState<'hiragana' | 'katakana'>('hiragana');
  const [isDrilling, setIsDrilling] = useState(false);

  // Existing state (used by quiz and practice modes)
  const [selectedType, setSelectedType] = useState<KanaSelectionType>('hiragana');
  const [currentKana, setCurrentKana] = useState<KanaChar | null>(null);
  const [userInput, setUserInput] = useState('');
  const [feedback, setFeedback] = useState<{ type: 'correct' | 'incorrect' | null; message: string }>({
    type: null,
    message: '',
  });
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [masteryCount, setMasteryCount] = useState<Map<string, number>>(new Map());
  const [mastered, setMastered] = useState<Set<string>>(new Set());
  const inputRef = useRef<HTMLInputElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [mistakes, setMistakes] = useState<Map<string, number>>(new Map());

  // Reset practice state when entering a practice mode
  const initializePractice = (practiceMode: 'quiz' | 'practiceAll' | 'practiceSelected') => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setUserInput('');
    setFeedback({ type: null, message: '' });

    if (practiceMode === 'quiz') {
      setMasteryCount(new Map());
      setMastered(new Set());
      setMistakes(new Map());
      setScore({ correct: 0, total: 0 });
      const types: KanaType[] = selectedType === 'mix' ? ['hiragana', 'katakana'] : [selectedType];
      setCurrentKana(getRandomKana(types, []));
    } else if (practiceMode === 'practiceAll') {
      const types: KanaType[] = selectedType === 'mix' ? ['hiragana', 'katakana'] : [selectedType];
      setCurrentKana(getRandomKana(types, []));
    }

    // Auto-focus the input and scroll container into view
    setTimeout(() => {
      inputRef.current?.focus();
      if (containerRef.current?.scrollIntoView) {
        containerRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  // Handle type change for quiz and practice all modes
  useEffect(() => {
    if (mode !== 'quiz' && mode !== 'practiceAll') return;

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    if (mode === 'quiz') {
      setMasteryCount(new Map());
      setMastered(new Set());
      setScore({ correct: 0, total: 0 });
    }

    const types: KanaType[] = selectedType === 'mix' ? ['hiragana', 'katakana'] : [selectedType];
    setCurrentKana(getRandomKana(types, []));
    setUserInput('');
    setFeedback({ type: null, message: '' });

    setTimeout(() => inputRef.current?.focus(), 100);
  }, [selectedType, mode]);

  // Handle advancing to next kana
  const handleNext = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    let nextKana: KanaChar | null = null;

    if (mode === 'quiz') {
      const types: KanaType[] = selectedType === 'mix' ? ['hiragana', 'katakana'] : [selectedType];
      const excludeList = Array.from(mastered);
      nextKana = getRandomKana(types, excludeList);
    } else if (mode === 'practiceAll') {
      const types: KanaType[] = selectedType === 'mix' ? ['hiragana', 'katakana'] : [selectedType];
      nextKana = getRandomKana(types, []);
    } else if (mode === 'practiceSelected' && isDrilling) {
      nextKana = getRandomFromSelected();
    }

    setCurrentKana(nextKana);
    setUserInput('');
    setFeedback({ type: null, message: '' });

    setTimeout(() => inputRef.current?.focus(), 50);
  };

  // Get random kana from selected characters
  const getRandomFromSelected = (): KanaChar | null => {
    const selectedArray = Array.from(selectedChars);
    if (selectedArray.length === 0) return null;

    const allKana = [...kanaData.hiragana, ...kanaData.katakana];
    const pool = allKana.filter(k => selectedChars.has(k.char));

    if (pool.length === 0) return null;
    return pool[Math.floor(Math.random() * pool.length)];
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
  }, [feedback.type, mode, selectedType, mastered, selectedChars, isDrilling]);


  // Submit handler for quiz mode (with mastery tracking)
  const handleQuizSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentKana || !userInput.trim()) return;

    const isCorrect = userInput.trim().toLowerCase() === currentKana.romanji.toLowerCase();

    setScore((prev) => ({
      correct: prev.correct + (isCorrect ? 1 : 0),
      total: prev.total + 1,
    }));

    if (isCorrect) {
      const currentCount = masteryCount.get(currentKana.char) || 0;
      const newCount = currentCount + 1;

      setMasteryCount(new Map(masteryCount.set(currentKana.char, newCount)));

      if (newCount >= 3) {
        setMastered(new Set(mastered.add(currentKana.char)));
        setFeedback({
          type: 'correct',
          message: `Correct! You've mastered ${currentKana.char}!`,
        });
      } else {
        setFeedback({
          type: 'correct',
          message: `Correct! (${newCount}/3 to master)`,
        });
      }
    } else {
      // Track mistakes
      const currentMistakes = mistakes.get(currentKana.char) || 0;
      setMistakes(new Map(mistakes.set(currentKana.char, currentMistakes + 1)));

      setFeedback({
        type: 'incorrect',
        message: `Incorrect. The correct answer is "${currentKana.romanji}"`,
      });
    }

    timeoutRef.current = setTimeout(() => {
      handleNext();
    }, 10000);
  };

  // Submit handler for practice modes (no tracking)
  const handlePracticeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentKana || !userInput.trim()) return;

    const isCorrect = userInput.trim().toLowerCase() === currentKana.romanji.toLowerCase();

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

    timeoutRef.current = setTimeout(() => {
      handleNext();
    }, 10000);
  };

  // Go back to mode selection
  const handleBackToSelection = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setMode('selection');
    setIsDrilling(false);
    setCurrentKana(null);
    setUserInput('');
    setFeedback({ type: null, message: '' });
  };

  // Go back to chart selection (from drilling)
  const handleBackToChartSelection = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setIsDrilling(false);
    setCurrentKana(null);
    setUserInput('');
    setFeedback({ type: null, message: '' });
  };

  // Toggle character selection
  const toggleCharSelection = (char: string) => {
    const newSelected = new Set(selectedChars);
    if (newSelected.has(char)) {
      newSelected.delete(char);
    } else {
      newSelected.add(char);
    }
    setSelectedChars(newSelected);
  };

  // Start drilling selected characters
  const startDrilling = () => {
    if (selectedChars.size === 0) return;
    setIsDrilling(true);
    const firstKana = getRandomFromSelected();
    setCurrentKana(firstKana);
    setUserInput('');
    setFeedback({ type: null, message: '' });

    // Auto-focus the input and scroll container into view
    setTimeout(() => {
      inputRef.current?.focus();
      if (containerRef.current?.scrollIntoView) {
        containerRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  // Start practicing mistake characters from quiz
  const startPracticeMistakes = () => {
    if (mistakes.size === 0) return;

    // Set the mistake characters as selected
    const mistakeChars = new Set(mistakes.keys());
    setSelectedChars(mistakeChars);

    // Switch to practice selected mode and start drilling
    setMode('practiceSelected');
    setIsDrilling(true);

    // Get first kana from mistakes
    const allKana = [...kanaData.hiragana, ...kanaData.katakana];
    const pool = allKana.filter(k => mistakeChars.has(k.char));
    const firstKana = pool.length > 0 ? pool[Math.floor(Math.random() * pool.length)] : null;

    setCurrentKana(firstKana);
    setUserInput('');
    setFeedback({ type: null, message: '' });
    setMistakes(new Map());

    // Auto-focus the input and scroll container into view
    setTimeout(() => {
      inputRef.current?.focus();
      if (containerRef.current?.scrollIntoView) {
        containerRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  // Organize kana into rows for chart display
  const organizeIntoRows = (type: 'hiragana' | 'katakana') => {
    const data = type === 'hiragana' ? kanaData.hiragana : kanaData.katakana;

    return [
      { label: 'vowels', chars: data.slice(0, 5) },
      { label: 'k-row', chars: data.slice(5, 10) },
      { label: 's-row', chars: data.slice(10, 15) },
      { label: 't-row', chars: data.slice(15, 20) },
      { label: 'n-row', chars: data.slice(20, 25) },
      { label: 'h-row', chars: data.slice(25, 30) },
      { label: 'm-row', chars: data.slice(30, 35) },
      { label: 'y-row', chars: [data[35], null, data[36], null, data[37]] },
      { label: 'r-row', chars: data.slice(38, 43) },
      { label: 'w-row', chars: [data[43], null, null, null, data[44]] },
      { label: 'n', chars: [null, null, data[45], null, null] },
      { label: 'g-row', chars: data.slice(46, 51) },
      { label: 'z-row', chars: data.slice(51, 56) },
      { label: 'd-row', chars: data.slice(56, 61) },
      { label: 'b-row', chars: data.slice(61, 66) },
      { label: 'p-row', chars: data.slice(66, 71) },
    ];
  };

  // Render mode selection screen
  const renderModeSelection = () => (
    <div className="space-y-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 md:p-8">
        <div className="space-y-3">
          <button
            onClick={() => {
              setMode('practiceAll');
              initializePractice('practiceAll');
            }}
            className="w-full p-4 md:p-6 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors text-left"
          >
            <div className="font-semibold text-lg text-gray-900 dark:text-white">Practice All</div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Endless practice, all kana
            </div>
          </button>

          <button
            onClick={() => {
              setMode('practiceSelected');
              setIsDrilling(false);
            }}
            className="w-full p-4 md:p-6 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors text-left"
          >
            <div className="font-semibold text-lg text-gray-900 dark:text-white">Practice Selected</div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Choose characters to focus on
            </div>
          </button>

          <button
            onClick={() => {
              setMode('quiz');
              initializePractice('quiz');
            }}
            className="w-full p-4 md:p-6 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors text-left"
          >
            <div className="font-semibold text-lg text-gray-900 dark:text-white">Quiz</div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Master all characters
            </div>
          </button>
        </div>
      </div>
    </div>
  );

  // Render type toggle (Hiragana/Katakana/Mix)
  const renderTypeToggle = (includeMix: boolean = true) => (
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
      {includeMix && (
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
      )}
    </div>
  );

  // Render back button
  const renderBackButton = (onClick: () => void, label: string = '← Back') => (
    <button
      onClick={onClick}
      className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
    >
      {label}
    </button>
  );

  // Render practice input UI (shared between all practice modes)
  const renderPracticeUI = (onSubmit: (e: React.FormEvent) => void) => {
    const hasFeedback = feedback.type !== null;

    const handleButtonClick = (e: React.MouseEvent) => {
      if (hasFeedback) {
        e.preventDefault();
        handleNext();
      }
      // If no feedback, form will submit naturally
    };

    return (
      <div className="space-y-2 md:space-y-6">
        <div className="text-center">
          <div className="text-6xl md:text-9xl font-bold text-gray-900 dark:text-white my-4 md:my-8">
            {currentKana?.char}
          </div>
        </div>

        <form onSubmit={onSubmit} className="space-y-3 md:space-y-4">
          {/* Input row - always visible */}
          <div className="flex gap-2">
            <label htmlFor="answer" className="sr-only">
              Your answer
            </label>
            <input
              ref={inputRef}
              id="answer"
              type="text"
              value={userInput}
              onChange={(e) => {
                if (!hasFeedback) {
                  setUserInput(e.target.value);
                }
              }}
              readOnly={hasFeedback}
              placeholder="Type the romanji (e.g., ka, shi, n)"
              className={`flex-1 px-3 md:px-4 py-2.5 md:py-3 text-base md:text-lg border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#BC002D] focus:border-transparent dark:bg-gray-700 dark:text-white ${hasFeedback ? 'bg-gray-100 dark:bg-gray-600' : ''}`}
              autoComplete="off"
              inputMode="text"
              autoFocus
            />
            <button
              type={hasFeedback ? 'button' : 'submit'}
              onClick={handleButtonClick}
              onMouseDown={(e) => e.preventDefault()}
              onTouchStart={(e) => e.preventDefault()}
              disabled={!hasFeedback && !userInput.trim()}
              className="bg-[#BC002D] hover:bg-[#a3002a] disabled:bg-gray-400 text-white font-semibold py-2.5 md:py-3 px-4 rounded-lg transition-colors disabled:cursor-not-allowed text-sm md:text-base min-w-[70px]"
            >
              {hasFeedback ? 'Next' : 'Submit'}
            </button>
          </div>

          {/* Feedback */}
          {hasFeedback && (
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
        </form>
      </div>
    );
  };

  // Render Quiz mode
  const renderQuizMode = () => (
    <div ref={containerRef} className="space-y-2 md:space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-3 md:p-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div className="flex items-center gap-4">
            {renderBackButton(handleBackToSelection)}
            <div className="flex-1">
              {renderTypeToggle(true)}
            </div>
          </div>

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
              <p className="text-xs md:text-sm text-green-600 dark:text-green-400 mt-1">
                Mastered: {mastered.size}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 md:p-8">
        {!currentKana ? (
          <div className="text-center py-8">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Congratulations!
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              You've mastered all {selectedType === 'mix' ? 'hiragana and katakana' : selectedType} characters!
            </p>

            {/* Mistake Report - only show if there were mistakes */}
            {mistakes.size > 0 && (
              <div className="mb-6 text-left max-w-xs mx-auto">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 text-center">
                  Mistakes
                </h3>
                <div className="bg-red-50 dark:bg-red-900/30 rounded-lg p-3">
                  {Array.from(mistakes.entries())
                    .sort((a, b) => b[1] - a[1])
                    .map(([char, count]) => {
                      const kanaInfo = [...kanaData.hiragana, ...kanaData.katakana].find(k => k.char === char);
                      return (
                        <div key={char} className="flex justify-between items-center py-1 border-b border-red-200 dark:border-red-800 last:border-0">
                          <span className="text-2xl">{char}</span>
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            {kanaInfo?.romanji} - {count} mistake{count !== 1 ? 's' : ''}
                          </span>
                        </div>
                      );
                    })}
                </div>
                <button
                  onClick={startPracticeMistakes}
                  className="w-full mt-3 bg-[#BC002D] hover:bg-[#a3002a] text-white font-semibold py-2 px-4 rounded-lg transition-colors text-sm"
                >
                  Practice Mistakes
                </button>
              </div>
            )}

            <button
              onClick={() => {
                setMasteryCount(new Map());
                setMastered(new Set());
                setMistakes(new Map());
                setScore({ correct: 0, total: 0 });
                const types: KanaType[] = selectedType === 'mix' ? ['hiragana', 'katakana'] : [selectedType];
                setCurrentKana(getRandomKana(types, []));
              }}
              className="bg-[#BC002D] hover:bg-[#a3002a] text-white font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              Start Over
            </button>
          </div>
        ) : (
          renderPracticeUI(handleQuizSubmit)
        )}
      </div>
    </div>
  );

  // Render Practice All mode
  const renderPracticeAllMode = () => (
    <div ref={containerRef} className="space-y-2 md:space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-3 md:p-4">
        <div className="flex items-center gap-4">
          {renderBackButton(handleBackToSelection)}
          <div className="flex-1">
            {renderTypeToggle(true)}
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 md:p-8">
        {currentKana && renderPracticeUI(handlePracticeSubmit)}
      </div>
    </div>
  );

  // Render Practice Selected - Chart Selection
  const renderChartSelection = () => {
    const rows = organizeIntoRows(selectedChartType);

    return (
      <div className="space-y-2 md:space-y-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-3 md:p-4">
          <div className="flex items-center gap-4">
            {renderBackButton(handleBackToSelection)}
            <div className="flex-1">
              <div className="flex gap-2">
                <button
                  onClick={() => setSelectedChartType('hiragana')}
                  className={`flex-1 py-1.5 md:py-2 px-2 md:px-3 rounded-lg font-medium transition-colors text-xs md:text-sm ${
                    selectedChartType === 'hiragana'
                      ? 'bg-[#BC002D] text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  Hiragana
                </button>
                <button
                  onClick={() => setSelectedChartType('katakana')}
                  className={`flex-1 py-1.5 md:py-2 px-2 md:px-3 rounded-lg font-medium transition-colors text-xs md:text-sm ${
                    selectedChartType === 'katakana'
                      ? 'bg-[#BC002D] text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  Katakana
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-3 md:p-6">
          <p className="text-sm text-gray-600 dark:text-gray-400 text-center mb-4">
            Tap characters to select them for practice
          </p>
          <div className="space-y-1 md:space-y-2">
            {rows.map((row, rowIndex) => (
              <div
                key={`${selectedChartType}-${row.label}`}
                className="grid grid-cols-5 gap-1 md:gap-2"
              >
                {row.chars.map((kana, colIndex) => (
                  <button
                    key={`${selectedChartType}-${rowIndex}-${colIndex}`}
                    onClick={() => kana && toggleCharSelection(kana.char)}
                    disabled={!kana}
                    className={`rounded p-2 md:p-3 text-center min-h-[60px] md:min-h-[80px] flex flex-col items-center justify-center transition-colors ${
                      kana
                        ? selectedChars.has(kana.char)
                          ? 'bg-[#BC002D] text-white'
                          : 'bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600'
                        : 'bg-gray-50 dark:bg-gray-700 cursor-default'
                    }`}
                  >
                    {kana ? (
                      <>
                        <div className={`text-2xl md:text-4xl font-bold ${
                          selectedChars.has(kana.char) ? 'text-white' : 'text-gray-900 dark:text-white'
                        }`}>
                          {kana.char}
                        </div>
                        <div className={`text-xs md:text-sm mt-1 ${
                          selectedChars.has(kana.char) ? 'text-white/80' : 'text-gray-600 dark:text-gray-400'
                        }`}>
                          {kana.romanji}
                        </div>
                      </>
                    ) : (
                      <div className="text-gray-300 dark:text-gray-600">—</div>
                    )}
                  </button>
                ))}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-3 md:p-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Selected: {selectedChars.size} character{selectedChars.size !== 1 ? 's' : ''}
            </p>
            <button
              onClick={startDrilling}
              disabled={selectedChars.size === 0}
              className="bg-[#BC002D] hover:bg-[#a3002a] disabled:bg-gray-400 text-white font-semibold py-2 px-4 md:px-6 rounded-lg transition-colors disabled:cursor-not-allowed text-sm md:text-base"
            >
              Start Practice →
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Render Practice Selected - Drilling
  const renderDrilling = () => (
    <div ref={containerRef} className="space-y-2 md:space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-3 md:p-4">
        <div className="flex items-center justify-between">
          {renderBackButton(handleBackToChartSelection)}
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Practicing: {selectedChars.size} character{selectedChars.size !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 md:p-8">
        {currentKana && renderPracticeUI(handlePracticeSubmit)}
      </div>
    </div>
  );

  // Main render
  if (mode === 'selection') {
    return renderModeSelection();
  }

  if (mode === 'quiz') {
    return renderQuizMode();
  }

  if (mode === 'practiceAll') {
    return renderPracticeAllMode();
  }

  if (mode === 'practiceSelected') {
    if (isDrilling) {
      return renderDrilling();
    }
    return renderChartSelection();
  }

  return null;
}
