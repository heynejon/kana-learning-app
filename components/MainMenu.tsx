'use client';

type Screen = 'kana' | 'numbers';

interface MainMenuProps {
  onSelect: (screen: Screen) => void;
}

const menuItems: { screen: Screen; title: string; subtitle: string }[] = [
  { screen: 'kana', title: 'Kana', subtitle: 'Hiragana & Katakana' },
  { screen: 'numbers', title: 'Numbers', subtitle: '一、二、三...' },
];

export default function MainMenu({ onSelect }: MainMenuProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-3">
        {menuItems.map((item) => (
          <button
            key={item.screen}
            onClick={() => onSelect(item.screen)}
            className="w-full p-5 md:p-6 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg shadow-md transition-colors text-left"
          >
            <div className="font-semibold text-xl text-gray-900 dark:text-white">
              {item.title}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {item.subtitle}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
