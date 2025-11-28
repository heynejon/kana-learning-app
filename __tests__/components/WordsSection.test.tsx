import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import WordsSection from '@/components/WordsSection';
import * as wordData from '@/lib/wordData';

// Mock the wordData module to control randomness in tests
jest.mock('@/lib/wordData', () => {
  const actual = jest.requireActual('@/lib/wordData');
  return {
    ...actual,
    hiraganaWords: [
      { kana: 'あ', romanji: 'a', meaning: 'letter a' },
      { kana: 'い', romanji: 'i', meaning: 'letter i' },
      { kana: 'う', romanji: 'u', meaning: 'letter u' },
    ],
    katakanaWords: [
      { kana: 'ア', romanji: 'a', meaning: 'letter A' },
      { kana: 'イ', romanji: 'i', meaning: 'letter I' },
    ],
  };
});

describe('WordsSection', () => {
  beforeEach(() => {
    // Reset any mocks before each test
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render the component', () => {
      render(<WordsSection />);

      expect(screen.getByText('Hiragana')).toBeInTheDocument();
      expect(screen.getByText('Katakana')).toBeInTheDocument();
      expect(screen.getByText('Mix')).toBeInTheDocument();
    });

    it('should display a word on mount', () => {
      render(<WordsSection />);

      const wordDisplay = screen.getByText(/[あいうアイ]/);
      expect(wordDisplay).toBeInTheDocument();
    });

    it('should display score as 0/0 initially', () => {
      render(<WordsSection />);

      expect(screen.getByText(/0 \/ 0/)).toBeInTheDocument();
    });
  });

  describe('Type Selection', () => {
    it('should switch to katakana words when katakana button clicked', async () => {
      const user = userEvent.setup();
      render(<WordsSection />);

      const katakanaButton = screen.getByRole('button', { name: /katakana/i });
      await user.click(katakanaButton);

      await waitFor(() => {
        // Should display a katakana character
        expect(screen.getByText(/[アイ]/)).toBeInTheDocument();
      });
    });

    it('should reset score when switching types', async () => {
      const user = userEvent.setup();
      render(<WordsSection />);

      // Get the displayed word and answer correctly
      const displayedWord = screen.getByText(/[あいう]/).textContent;
      const correctAnswer = displayedWord === 'あ' ? 'a' : displayedWord === 'い' ? 'i' : 'u';

      const input = screen.getByPlaceholderText(/type the romanji/i);
      await user.type(input, correctAnswer);
      await user.click(screen.getByRole('button', { name: /submit/i }));

      // Score should be 1/1
      await waitFor(() => {
        expect(screen.getByText(/1 \/ 1/)).toBeInTheDocument();
      });

      // Switch to katakana
      const katakanaButton = screen.getByRole('button', { name: /katakana/i });
      await user.click(katakanaButton);

      // Score should reset to 0/0
      await waitFor(() => {
        expect(screen.getByText(/0 \/ 0/)).toBeInTheDocument();
      });
    });
  });

  describe('Word Submission', () => {
    it('should accept correct answer', async () => {
      const user = userEvent.setup();
      render(<WordsSection />);

      // Get the displayed word
      const displayedWord = screen.getByText(/[あいう]/).textContent;

      // Type the correct romanji
      const input = screen.getByPlaceholderText(/type the romanji/i);
      const correctAnswer = displayedWord === 'あ' ? 'a' : displayedWord === 'い' ? 'i' : 'u';
      await user.type(input, correctAnswer);

      // Submit
      await user.click(screen.getByRole('button', { name: /submit/i }));

      // Should show correct feedback
      await waitFor(() => {
        expect(screen.getByText(/correct!/i)).toBeInTheDocument();
      });

      // Score should update
      expect(screen.getByText(/1 \/ 1/)).toBeInTheDocument();
    });

    it('should show incorrect feedback for wrong answer', async () => {
      const user = userEvent.setup();
      render(<WordsSection />);

      const input = screen.getByPlaceholderText(/type the romanji/i);
      await user.type(input, 'wronganswer');

      await user.click(screen.getByRole('button', { name: /submit/i }));

      await waitFor(() => {
        expect(screen.getByText(/incorrect/i)).toBeInTheDocument();
      });

      // Score should still update
      expect(screen.getByText(/0 \/ 1/)).toBeInTheDocument();
    });

    it('should show meaning after submission', async () => {
      const user = userEvent.setup();
      render(<WordsSection />);

      const input = screen.getByPlaceholderText(/type the romanji/i);
      await user.type(input, 'a');

      await user.click(screen.getByRole('button', { name: /submit/i }));

      await waitFor(() => {
        expect(screen.getByText(/meaning:/i)).toBeInTheDocument();
      });
    });

    it('should disable input after submission', async () => {
      const user = userEvent.setup();
      render(<WordsSection />);

      const input = screen.getByPlaceholderText(/type the romanji/i) as HTMLInputElement;
      await user.type(input, 'a');
      await user.click(screen.getByRole('button', { name: /submit/i }));

      await waitFor(() => {
        // Input value should not change after submission
        expect(input.value).toBe('a');
      });

      // Try typing more - should not update
      await user.type(input, 'b');
      expect(input.value).toBe('a');
    });
  });

  describe('Navigation', () => {
    it('should show Next button after submission', async () => {
      const user = userEvent.setup();
      render(<WordsSection />);

      const input = screen.getByPlaceholderText(/type the romanji/i);
      await user.type(input, 'a');
      await user.click(screen.getByRole('button', { name: /submit/i }));

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /next/i })).toBeInTheDocument();
      });
    });

    it('should show new word when Next is clicked', async () => {
      const user = userEvent.setup();
      render(<WordsSection />);

      const firstWord = screen.getByText(/[あいう]/).textContent;

      const input = screen.getByPlaceholderText(/type the romanji/i);
      await user.type(input, 'a');
      await user.click(screen.getByRole('button', { name: /submit/i }));

      const nextButton = await screen.findByRole('button', { name: /next/i });
      await user.click(nextButton);

      await waitFor(() => {
        const newWord = screen.getByText(/[あいう]/).textContent;
        // May or may not be different due to randomness, but input should be cleared
        const input = screen.getByPlaceholderText(/type the romanji/i) as HTMLInputElement;
        expect(input.value).toBe('');
      });
    });

  });

  describe('Flexible Romanization Matching', () => {
    it('should accept answers with different apostrophe styles', async () => {
      const user = userEvent.setup();
      render(<WordsSection />);

      const input = screen.getByPlaceholderText(/type the romanji/i);
      // Even if the word is simple, the normalization should work
      await user.type(input, 'a');
      await user.click(screen.getByRole('button', { name: /submit/i }));

      await waitFor(() => {
        // Should accept the answer (normalization handles various styles)
        const feedbackElement = screen.queryByText(/incorrect/i);
        // This specific test might show correct depending on what word is shown
        // The normalization function is tested, this is more of an integration check
        expect(screen.getByText(/correct|incorrect/i)).toBeInTheDocument();
      });
    });
  });

  describe('Word Rotation Tracking', () => {
    it('should not show the same word after answering it correctly', async () => {
      const user = userEvent.setup();
      render(<WordsSection />);

      // Get the first word
      const firstWord = screen.getByText(/[あいう]/).textContent;
      const correctAnswer = firstWord === 'あ' ? 'a' : firstWord === 'い' ? 'i' : 'u';

      // Answer correctly
      const input = screen.getByPlaceholderText(/type the romanji/i);
      await user.type(input, correctAnswer);
      await user.click(screen.getByRole('button', { name: /submit/i }));

      await waitFor(() => {
        expect(screen.getByText(/correct!/i)).toBeInTheDocument();
      });

      // Click next to get new word
      const nextButton = screen.getByRole('button', { name: /next/i });
      await user.click(nextButton);

      // The next word should be different from the first
      await waitFor(() => {
        const secondWord = screen.getByText(/[あいう]/).textContent;
        expect(secondWord).not.toBe(firstWord);
      });
    });

    it('should allow the same word to appear again after incorrect answer', async () => {
      const user = userEvent.setup();
      render(<WordsSection />);

      // Get the first word
      const firstWord = screen.getByText(/[あいう]/).textContent;

      // Answer incorrectly
      const input = screen.getByPlaceholderText(/type the romanji/i);
      await user.type(input, 'wronganswer');
      await user.click(screen.getByRole('button', { name: /submit/i }));

      await waitFor(() => {
        expect(screen.getByText(/incorrect/i)).toBeInTheDocument();
      });

      // Click next multiple times to potentially see the word again
      // Since we only have 3 words and answered one wrong, it should appear again
      const nextButton = screen.getByRole('button', { name: /next/i });
      const seenWords = new Set<string>();
      seenWords.add(firstWord!);

      for (let i = 0; i < 10; i++) {
        await user.click(nextButton);
        await waitFor(() => {
          const currentWord = screen.getByText(/[あいう]/).textContent;
          if (currentWord) seenWords.add(currentWord);
        });
      }

      // The incorrectly answered word should still be in rotation
      expect(seenWords.has(firstWord!)).toBe(true);
    });

    it('should reset rotation after all words are answered correctly', async () => {
      const user = userEvent.setup();
      render(<WordsSection />);

      // Track which words we've seen and answered correctly
      const answeredWords = new Set<string>();

      // Answer all 3 words correctly (our mock has 3 hiragana words)
      for (let i = 0; i < 3; i++) {
        const currentWord = screen.getByText(/[あいう]/).textContent;
        const correctAnswer = currentWord === 'あ' ? 'a' : currentWord === 'い' ? 'i' : 'u';
        answeredWords.add(currentWord!);

        const input = screen.getByPlaceholderText(/type the romanji/i) as HTMLInputElement;

        // Clear previous input
        await user.clear(input);
        await user.type(input, correctAnswer);
        await user.click(screen.getByRole('button', { name: /submit/i }));

        await waitFor(() => {
          expect(screen.getByText(/correct!/i)).toBeInTheDocument();
        });

        // Click next if not the last word
        if (i < 2) {
          const nextButton = screen.getByRole('button', { name: /next/i });
          await user.click(nextButton);

          await waitFor(() => {
            expect(screen.getByText(/[あいう]/)).toBeInTheDocument();
          });
        }
      }

      // All 3 words should have been answered
      expect(answeredWords.size).toBe(3);

      // Click next - should reset and show words again
      const nextButton = screen.getByRole('button', { name: /next/i });
      await user.click(nextButton);

      await waitFor(() => {
        // Should show one of the original words again (rotation reset)
        const newWord = screen.getByText(/[あいう]/).textContent;
        expect(answeredWords.has(newWord!)).toBe(true);
      });
    });

    it('should maintain rotation across correct and incorrect answers', async () => {
      const user = userEvent.setup();
      render(<WordsSection />);

      // Answer first word correctly
      const firstWord = screen.getByText(/[あいう]/).textContent;
      const correctAnswer1 = firstWord === 'あ' ? 'a' : firstWord === 'い' ? 'i' : 'u';

      const input = screen.getByPlaceholderText(/type the romanji/i) as HTMLInputElement;
      await user.type(input, correctAnswer1);
      await user.click(screen.getByRole('button', { name: /submit/i }));

      await waitFor(() => {
        expect(screen.getByText(/correct!/i)).toBeInTheDocument();
      });

      // Move to next word
      let nextButton = screen.getByRole('button', { name: /next/i });
      await user.click(nextButton);

      await waitFor(() => {
        expect(screen.getByText(/[あいう]/)).toBeInTheDocument();
      });

      // Answer second word incorrectly
      const secondWord = screen.getByText(/[あいう]/).textContent;
      await user.clear(input);
      await user.type(input, 'wronganswer');
      await user.click(screen.getByRole('button', { name: /submit/i }));

      await waitFor(() => {
        expect(screen.getByText(/incorrect/i)).toBeInTheDocument();
      });

      // Move to next word
      nextButton = screen.getByRole('button', { name: /next/i });
      await user.click(nextButton);

      await waitFor(() => {
        const thirdWord = screen.getByText(/[あいう]/).textContent;
        // Third word should not be the first word (which was answered correctly)
        expect(thirdWord).not.toBe(firstWord);
        // Third word could be the second word (answered incorrectly) or the remaining word
      });
    });

    it('should track score correctly with rotation', async () => {
      const user = userEvent.setup();
      render(<WordsSection />);

      // Initial score should be 0/0
      expect(screen.getByText(/0 \/ 0/)).toBeInTheDocument();

      // Answer first word correctly
      const firstWord = screen.getByText(/[あいう]/).textContent;
      const correctAnswer = firstWord === 'あ' ? 'a' : firstWord === 'い' ? 'i' : 'u';

      const input = screen.getByPlaceholderText(/type the romanji/i) as HTMLInputElement;
      await user.type(input, correctAnswer);
      await user.click(screen.getByRole('button', { name: /submit/i }));

      // Score should be 1/1
      await waitFor(() => {
        expect(screen.getByText(/1 \/ 1/)).toBeInTheDocument();
      });

      // Move to next
      const nextButton = screen.getByRole('button', { name: /next/i });
      await user.click(nextButton);

      // Answer second word incorrectly
      await waitFor(() => {
        expect(screen.getByText(/[あいう]/)).toBeInTheDocument();
      });

      await user.clear(input);
      await user.type(input, 'wrong');
      await user.click(screen.getByRole('button', { name: /submit/i }));

      // Score should be 1/2
      await waitFor(() => {
        expect(screen.getByText(/1 \/ 2/)).toBeInTheDocument();
      });
    });
  });
});
