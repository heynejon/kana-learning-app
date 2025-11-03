'use client';

import { useState, useRef, useEffect } from 'react';
import { getRandomKana, KanaChar } from '@/lib/kanaData';
import SignaturePad from 'signature_pad';

type WritingMode = 'identify' | 'practice';

export default function WritingSection() {
  const [mode, setMode] = useState<WritingMode>('practice');
  const [currentKana, setCurrentKana] = useState<KanaChar | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const signaturePadRef = useRef<SignaturePad | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);

  useEffect(() => {
    // Generate initial kana
    setCurrentKana(getRandomKana(['hiragana', 'katakana']));
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Function to resize canvas and reinitialize SignaturePad
    function resizeCanvas() {
      const ratio = Math.max(window.devicePixelRatio || 1, 1);
      const container = canvas.parentElement;
      if (!container) return;

      // Get container width and calculate size
      const containerWidth = container.clientWidth;
      const size = Math.min(containerWidth, 400);

      // Set display size (CSS pixels)
      canvas.width = size * ratio;
      canvas.height = size * ratio;
      canvas.style.width = size + 'px';
      canvas.style.height = size + 'px';

      // Scale for high DPI displays
      const context = canvas.getContext('2d');
      if (context) {
        context.scale(ratio, ratio);
      }

      // Reinitialize SignaturePad
      if (signaturePadRef.current) {
        signaturePadRef.current.clear();
      }

      signaturePadRef.current = new SignaturePad(canvas, {
        minWidth: 2,
        maxWidth: 6,
        penColor: '#000',
      });
    }

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (signaturePadRef.current) {
        signaturePadRef.current.off();
      }
    };
  }, []);

  const clearCanvas = () => {
    if (signaturePadRef.current) {
      signaturePadRef.current.clear();
    }
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
                  style={{ touchAction: 'none' }}
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
