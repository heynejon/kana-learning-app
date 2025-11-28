'use client';

import { useState } from 'react';
import KanaSection from '@/components/KanaSection';
import WordsSection from '@/components/WordsSection';
import WritingSection from '@/components/WritingSection';
import ChartsSection from '@/components/ChartsSection';

type Section = 'sounds' | 'words' | 'writing' | 'charts';

export default function Home() {
  const [activeSection, setActiveSection] = useState<Section>('sounds');

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white text-center">
            かな Learning
          </h1>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex space-x-1 overflow-x-auto">
            <button
              onClick={() => setActiveSection('sounds')}
              className={`flex-1 min-w-[80px] py-3 px-4 text-center font-medium transition-colors whitespace-nowrap ${
                activeSection === 'sounds'
                  ? 'border-b-2 border-[#BC002D] text-[#BC002D]'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              Kana
            </button>
            <button
              onClick={() => setActiveSection('words')}
              className={`flex-1 min-w-[80px] py-3 px-4 text-center font-medium transition-colors whitespace-nowrap ${
                activeSection === 'words'
                  ? 'border-b-2 border-[#BC002D] text-[#BC002D]'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              Words
            </button>
            <button
              onClick={() => setActiveSection('writing')}
              className={`flex-1 min-w-[80px] py-3 px-4 text-center font-medium transition-colors whitespace-nowrap ${
                activeSection === 'writing'
                  ? 'border-b-2 border-[#BC002D] text-[#BC002D]'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              Writing
            </button>
            <button
              onClick={() => setActiveSection('charts')}
              className={`flex-1 min-w-[80px] py-3 px-4 text-center font-medium transition-colors whitespace-nowrap ${
                activeSection === 'charts'
                  ? 'border-b-2 border-[#BC002D] text-[#BC002D]'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              Charts
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-3 pb-32">
        <div className={activeSection === 'sounds' ? 'block' : 'hidden'}>
          <KanaSection />
        </div>
        <div className={activeSection === 'words' ? 'block' : 'hidden'}>
          <WordsSection />
        </div>
        <div className={activeSection === 'writing' ? 'block' : 'hidden'}>
          <WritingSection />
        </div>
        <div className={activeSection === 'charts' ? 'block' : 'hidden'}>
          <ChartsSection />
        </div>
      </main>
    </div>
  );
}
