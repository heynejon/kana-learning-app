'use client';

import { useState, useRef, useEffect } from 'react';
import { getRandomKana, KanaChar } from '@/lib/kanaData';

type WritingMode = 'identify' | 'practice';

export default function WritingSection() {
  const [mode, setMode] = useState<WritingMode>('practice');
  const [currentKana, setCurrentKana] = useState<KanaChar | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [showAnswer, setShowAnswer] = useState(false);

  useEffect(() => {
    // Generate initial kana
    setCurrentKana(getRandomKana(['hiragana', 'katakana']));
  }, []);

  useEffect(() => {
    // Initialize canvas
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      const container = canvas.parentElement;
      if (!container) return;

      const size = Math.min(container.clientWidth - 32, 400);
      canvas.width = size;
      canvas.height = size;

      // Reset canvas style
      ctx.strokeStyle = '#000';
      ctx.lineWidth = 4;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    return () => window.removeEventListener('resize', resizeCanvas);
  }, []);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setShowAnswer(false);
  };

  const handleNext = () => {
    setCurrentKana(getRandomKana(['hiragana', 'katakana']));
    clearCanvas();
  };

  const handleShowAnswer = () => {
    setShowAnswer(true);
  };

  return (
    <div className="space-y-6">
      {/* Mode Toggle */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
        <h2 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">Writing Mode</h2>
        <div className="flex gap-3">
          <button
            onClick={() => {
              setMode('practice');
              clearCanvas();
            }}
            className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
              mode === 'practice'
                ? 'bg-[#BC002D] text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}
          >
            What Kana?
          </button>
          <button
            onClick={() => {
              setMode('identify');
              clearCanvas();
            }}
            className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
              mode === 'identify'
                ? 'bg-[#BC002D] text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}
          >
            What Sound?
          </button>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
          {mode === 'practice'
            ? "You'll be shown a sound - draw the corresponding kana character"
            : "Draw a kana character - the app will identify it"}
        </p>
      </div>

      {/* Main Card */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        {currentKana && (
          <div className="space-y-4">
            {/* Prompt */}
            {mode === 'practice' ? (
              <div className="text-center mb-4">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  Draw the {currentKana.type} for:
                </p>
                <div className="text-5xl font-bold text-[#BC002D]">
                  {currentKana.romanji}
                </div>
                {showAnswer && (
                  <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Answer:</p>
                    <div className="text-6xl font-bold text-gray-900 dark:text-white">
                      {currentKana.char}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      ({currentKana.type})
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center mb-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Draw a kana character below
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                  (Full recognition coming soon - practice your strokes!)
                </p>
              </div>
            )}

            {/* Canvas */}
            <div className="flex justify-center">
              <div className="border-4 border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden bg-white">
                <canvas
                  ref={canvasRef}
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                  onTouchStart={(e) => {
                    e.preventDefault();
                    startDrawing(e);
                  }}
                  onTouchMove={(e) => {
                    e.preventDefault();
                    draw(e);
                  }}
                  onTouchEnd={(e) => {
                    e.preventDefault();
                    stopDrawing();
                  }}
                  className="touch-none cursor-crosshair"
                  style={{ maxWidth: '100%', height: 'auto' }}
                />
              </div>
            </div>

            {/* Buttons */}
            <div className="grid grid-cols-2 gap-3 mt-4">
              <button
                onClick={clearCanvas}
                className="py-3 px-6 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-semibold rounded-lg transition-colors"
              >
                Clear
              </button>
              {mode === 'practice' ? (
                <>
                  {!showAnswer && (
                    <button
                      onClick={handleShowAnswer}
                      className="py-3 px-6 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold rounded-lg transition-colors"
                    >
                      Show Answer
                    </button>
                  )}
                  <button
                    onClick={handleNext}
                    className={`py-3 px-6 bg-[#BC002D] hover:bg-[#a3002a] text-white font-semibold rounded-lg transition-colors ${
                      !showAnswer ? 'col-span-2' : ''
                    }`}
                  >
                    Next Character
                  </button>
                </>
              ) : (
                <button
                  onClick={() => {
                    alert('Character recognition will be implemented soon! Keep practicing your strokes.');
                  }}
                  className="py-3 px-6 bg-[#BC002D] hover:bg-[#a3002a] text-white font-semibold rounded-lg transition-colors"
                >
                  Identify
                </button>
              )}
            </div>

            {/* Instructions */}
            <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <p className="text-sm text-gray-700 dark:text-gray-300 font-medium mb-2">
                Drawing Tips:
              </p>
              <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1 list-disc list-inside">
                <li>Draw with smooth, confident strokes</li>
                <li>Follow the correct stroke order when possible</li>
                <li>Keep the character centered in the canvas</li>
                <li>Use the "Clear" button to start over</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
