'use client';

import { useState } from 'react';
import { kanaData } from '@/lib/kanaData';

type ChartView = 'hiragana' | 'katakana' | 'both';

export default function ChartsSection() {
  const [view, setView] = useState<ChartView>('hiragana');

  // Organize kana into rows for table display
  const organizeIntoRows = (type: 'hiragana' | 'katakana') => {
    const data = type === 'hiragana' ? kanaData.hiragana : kanaData.katakana;

    const rows = [
      // Basic rows (5 columns each)
      { label: 'vowels', chars: data.slice(0, 5) },      // a, i, u, e, o
      { label: 'k-row', chars: data.slice(5, 10) },      // ka, ki, ku, ke, ko
      { label: 's-row', chars: data.slice(10, 15) },     // sa, shi, su, se, so
      { label: 't-row', chars: data.slice(15, 20) },     // ta, chi, tsu, te, to
      { label: 'n-row', chars: data.slice(20, 25) },     // na, ni, nu, ne, no
      { label: 'h-row', chars: data.slice(25, 30) },     // ha, hi, fu, he, ho
      { label: 'm-row', chars: data.slice(30, 35) },     // ma, mi, mu, me, mo
      { label: 'y-row', chars: [data[35], null, data[36], null, data[37]] },  // ya, yu, yo
      { label: 'r-row', chars: data.slice(38, 43) },     // ra, ri, ru, re, ro
      { label: 'w-row', chars: [data[43], null, null, null, data[44]] },      // wa, wo
      { label: 'n', chars: [null, null, data[45], null, null] },              // n
      // Dakuten/Handakuten rows
      { label: 'g-row', chars: data.slice(46, 51) },     // ga, gi, gu, ge, go
      { label: 'z-row', chars: data.slice(51, 56) },     // za, ji, zu, ze, zo
      { label: 'd-row', chars: data.slice(56, 61) },     // da, ji, zu, de, do
      { label: 'b-row', chars: data.slice(61, 66) },     // ba, bi, bu, be, bo
      { label: 'p-row', chars: data.slice(66, 71) },     // pa, pi, pu, pe, po
    ];

    return rows;
  };

  const renderTable = (type: 'hiragana' | 'katakana') => {
    const rows = organizeIntoRows(type);

    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-3 md:p-6 mb-4">
        <h3 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white mb-3 md:mb-4 capitalize">
          {type}
        </h3>
        <div className="space-y-1 md:space-y-2">
          {rows.map((row, rowIndex) => (
            <div
              key={`${type}-${row.label}`}
              className="grid grid-cols-5 gap-1 md:gap-2"
            >
              {row.chars.map((kana, colIndex) => (
                <div
                  key={`${type}-${rowIndex}-${colIndex}`}
                  className="bg-gray-50 dark:bg-gray-700 rounded p-2 md:p-3 text-center min-h-[60px] md:min-h-[80px] flex flex-col items-center justify-center"
                >
                  {kana ? (
                    <>
                      <div className="text-2xl md:text-4xl font-bold text-gray-900 dark:text-white">
                        {kana.char}
                      </div>
                      <div className="text-xs md:text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {kana.romanji}
                      </div>
                    </>
                  ) : (
                    <div className="text-gray-300 dark:text-gray-600">—</div>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-2 md:space-y-6">
      {/* View Toggle */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-3 md:p-4">
        <div className="flex gap-2">
          <button
            onClick={() => setView('hiragana')}
            className={`flex-1 py-1.5 md:py-2 px-2 md:px-3 rounded-lg font-medium transition-colors text-xs md:text-sm ${
              view === 'hiragana'
                ? 'bg-[#BC002D] text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}
          >
            Hiragana
          </button>
          <button
            onClick={() => setView('katakana')}
            className={`flex-1 py-1.5 md:py-2 px-2 md:px-3 rounded-lg font-medium transition-colors text-xs md:text-sm ${
              view === 'katakana'
                ? 'bg-[#BC002D] text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}
          >
            Katakana
          </button>
          <button
            onClick={() => setView('both')}
            className={`flex-1 py-1.5 md:py-2 px-2 md:px-3 rounded-lg font-medium transition-colors text-xs md:text-sm ${
              view === 'both'
                ? 'bg-[#BC002D] text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}
          >
            Both
          </button>
        </div>
      </div>

      {/* Charts */}
      <div>
        {view === 'both' ? (
          <>
            {renderTable('hiragana')}
            {renderTable('katakana')}
          </>
        ) : (
          renderTable(view)
        )}
      </div>
    </div>
  );
}
