'use client';

import { useState, useRef, useEffect } from 'react';
import { getRandomKana, KanaChar } from '@/lib/kanaData';
import SignatureCanvas from 'react-signature-canvas';

export default function WritingSection() {
  const [currentKana, setCurrentKana] = useState<KanaChar | null>(null);
  const sigCanvas = useRef<SignatureCanvas>(null);
  const [showAnswer, setShowAnswer] = useState(false);

  useEffect(() => {
    setCurrentKana(getRandomKana(['hiragana', 'katakana']));
  }, []);

  const clearCanvas = () => {
    if (sigCanvas.current) {
      sigCanvas.current.clear();
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
    <div className="space-y-2 md:space-y-6">
      {/* Main Card */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        {currentKana && (
          <div className="space-y-4">
            {/* Prompt */}
            <div className="text-center mb-2">
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                Draw the <span className="font-bold text-[#BC002D]">{currentKana.type}</span> for:
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

            {/* Canvas */}
            <div className="flex justify-center">
              <div className="border-4 border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden bg-white w-fit mx-auto">
                <SignatureCanvas
                  ref={sigCanvas}
                  canvasProps={{
                    width: 350,
                    height: 200,
                    className: 'signature-canvas',
                    style: { display: 'block', touchAction: 'none' }
                  }}
                  minWidth={2}
                  maxWidth={6}
                  penColor="#000"
                />
              </div>
            </div>

            {/* Buttons */}
            <div className="grid grid-cols-2 gap-3 mt-4">
              <button
                onClick={clearCanvas}
                className="py-2.5 md:py-3 px-4 md:px-6 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-semibold rounded-lg transition-colors text-sm md:text-base"
              >
                Clear
              </button>
              {!showAnswer && (
                <button
                  onClick={handleShowAnswer}
                  className="py-2.5 md:py-3 px-4 md:px-6 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold rounded-lg transition-colors text-sm md:text-base"
                >
                  Show Answer
                </button>
              )}
              <button
                onClick={handleNext}
                className={`py-2.5 md:py-3 px-4 md:px-6 bg-[#BC002D] hover:bg-[#a3002a] text-white font-semibold rounded-lg transition-colors text-sm md:text-base ${
                  !showAnswer ? 'col-span-2' : ''
                }`}
              >
                Next Character
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
