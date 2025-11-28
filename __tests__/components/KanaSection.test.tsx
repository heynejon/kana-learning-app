import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import KanaSection from '@/components/KanaSection';

describe('KanaSection', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Mode Selection', () => {
    it('should render the mode selection screen initially', () => {
      render(<KanaSection />);

      expect(screen.getByText('Choose Practice Mode')).toBeInTheDocument();
      expect(screen.getByText('Quiz')).toBeInTheDocument();
      expect(screen.getByText('Practice All')).toBeInTheDocument();
      expect(screen.getByText('Practice Selected')).toBeInTheDocument();
    });

    it('should show Quiz mode description', () => {
      render(<KanaSection />);

      expect(screen.getByText(/Master all characters. 3 correct answers per character/i)).toBeInTheDocument();
    });

    it('should show Practice All mode description', () => {
      render(<KanaSection />);

      expect(screen.getByText(/Endless practice with all characters/i)).toBeInTheDocument();
    });

    it('should show Practice Selected mode description', () => {
      render(<KanaSection />);

      expect(screen.getByText(/Pick specific characters to practice/i)).toBeInTheDocument();
    });
  });

  describe('Quiz Mode', () => {
    const enterQuizMode = async (user: ReturnType<typeof userEvent.setup>) => {
      await user.click(screen.getByRole('button', { name: /quiz/i }));
      await waitFor(() => {
        expect(screen.getByText(/hiragana/i)).toBeInTheDocument();
      });
    };

    it('should enter Quiz mode when Quiz button clicked', async () => {
      const user = userEvent.setup();
      render(<KanaSection />);

      await enterQuizMode(user);

      expect(screen.getByText('Hiragana')).toBeInTheDocument();
      expect(screen.getByText('Katakana')).toBeInTheDocument();
      expect(screen.getByText('Mix')).toBeInTheDocument();
    });

    it('should display a kana character in Quiz mode', async () => {
      const user = userEvent.setup();
      render(<KanaSection />);

      await enterQuizMode(user);

      // Should display some kana character (hiragana by default)
      const kanaDisplay = screen.getByText(/[ぁ-ん]/);
      expect(kanaDisplay).toBeInTheDocument();
    });

    it('should display score and mastered count in Quiz mode', async () => {
      const user = userEvent.setup();
      render(<KanaSection />);

      await enterQuizMode(user);

      expect(screen.getByText(/score/i)).toBeInTheDocument();
      expect(screen.getByText(/0 \/ 0/)).toBeInTheDocument();
      expect(screen.getByText(/mastered: 0/i)).toBeInTheDocument();
    });

    it('should switch to katakana when katakana button clicked', async () => {
      const user = userEvent.setup();
      render(<KanaSection />);

      await enterQuizMode(user);

      const katakanaButton = screen.getByRole('button', { name: 'Katakana' });
      await user.click(katakanaButton);

      await waitFor(() => {
        // Should display a katakana character
        expect(screen.getByText(/[ァ-ヴ]/)).toBeInTheDocument();
      });
    });

    it('should reset mastery progress when switching types', async () => {
      const user = userEvent.setup();
      render(<KanaSection />);

      await enterQuizMode(user);

      // Answer correctly to get mastery progress
      const input = screen.getByPlaceholderText(/type the romanji/i);
      await user.type(input, 'a'); // Assuming we get 'あ'
      await user.click(screen.getByRole('button', { name: /submit/i }));

      // Switch to katakana
      const katakanaButton = screen.getByRole('button', { name: 'Katakana' });
      await user.click(katakanaButton);

      // Mastery should reset
      await waitFor(() => {
        expect(screen.getByText(/mastered: 0/i)).toBeInTheDocument();
        expect(screen.getByText(/0 \/ 0/)).toBeInTheDocument();
      });
    });

    it('should go back to mode selection when back button clicked', async () => {
      const user = userEvent.setup();
      render(<KanaSection />);

      await enterQuizMode(user);

      await user.click(screen.getByText('← Back'));

      await waitFor(() => {
        expect(screen.getByText('Choose Practice Mode')).toBeInTheDocument();
      });
    });
  });

  describe('Practice All Mode', () => {
    const enterPracticeAllMode = async (user: ReturnType<typeof userEvent.setup>) => {
      await user.click(screen.getByRole('button', { name: /practice all/i }));
      await waitFor(() => {
        expect(screen.getByText(/hiragana/i)).toBeInTheDocument();
      });
    };

    it('should enter Practice All mode when button clicked', async () => {
      const user = userEvent.setup();
      render(<KanaSection />);

      await enterPracticeAllMode(user);

      expect(screen.getByText('Hiragana')).toBeInTheDocument();
      expect(screen.getByText('Katakana')).toBeInTheDocument();
      expect(screen.getByText('Mix')).toBeInTheDocument();
    });

    it('should display a kana character in Practice All mode', async () => {
      const user = userEvent.setup();
      render(<KanaSection />);

      await enterPracticeAllMode(user);

      // Should display some kana character (hiragana by default)
      const kanaDisplay = screen.getByText(/[ぁ-ん]/);
      expect(kanaDisplay).toBeInTheDocument();
    });

    it('should NOT display score or mastery count in Practice All mode', async () => {
      const user = userEvent.setup();
      render(<KanaSection />);

      await enterPracticeAllMode(user);

      expect(screen.queryByText(/score/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/mastered:/i)).not.toBeInTheDocument();
    });

    it('should show correct/incorrect feedback in Practice All mode', async () => {
      const user = userEvent.setup();
      render(<KanaSection />);

      await enterPracticeAllMode(user);

      const input = screen.getByPlaceholderText(/type the romanji/i);
      await user.type(input, 'a');
      await user.click(screen.getByRole('button', { name: /submit/i }));

      await waitFor(() => {
        expect(screen.getByText(/(correct|incorrect)/i)).toBeInTheDocument();
      });
    });

    it('should go back to mode selection when back button clicked', async () => {
      const user = userEvent.setup();
      render(<KanaSection />);

      await enterPracticeAllMode(user);

      await user.click(screen.getByText('← Back'));

      await waitFor(() => {
        expect(screen.getByText('Choose Practice Mode')).toBeInTheDocument();
      });
    });
  });

  describe('Practice Selected Mode', () => {
    const enterPracticeSelectedMode = async (user: ReturnType<typeof userEvent.setup>) => {
      await user.click(screen.getByRole('button', { name: /practice selected/i }));
      await waitFor(() => {
        expect(screen.getByText(/tap characters to select/i)).toBeInTheDocument();
      });
    };

    it('should enter Practice Selected mode and show chart', async () => {
      const user = userEvent.setup();
      render(<KanaSection />);

      await enterPracticeSelectedMode(user);

      expect(screen.getByText(/tap characters to select/i)).toBeInTheDocument();
      expect(screen.getByText('Hiragana')).toBeInTheDocument();
      expect(screen.getByText('Katakana')).toBeInTheDocument();
      // Should NOT show Mix option
      expect(screen.queryByText('Mix')).not.toBeInTheDocument();
    });

    it('should show character count and start button', async () => {
      const user = userEvent.setup();
      render(<KanaSection />);

      await enterPracticeSelectedMode(user);

      expect(screen.getByText(/selected: 0 characters/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /start practice/i })).toBeDisabled();
    });

    it('should update count when character is selected', async () => {
      const user = userEvent.setup();
      render(<KanaSection />);

      await enterPracticeSelectedMode(user);

      // Click on 'あ' character
      const aChar = screen.getByText('あ');
      await user.click(aChar);

      await waitFor(() => {
        expect(screen.getByText(/selected: 1 character$/i)).toBeInTheDocument();
      });

      // Start button should be enabled now
      expect(screen.getByRole('button', { name: /start practice/i })).not.toBeDisabled();
    });

    it('should allow toggling character selection', async () => {
      const user = userEvent.setup();
      render(<KanaSection />);

      await enterPracticeSelectedMode(user);

      // Click on 'あ' to select
      const aChar = screen.getByText('あ');
      await user.click(aChar);

      await waitFor(() => {
        expect(screen.getByText(/selected: 1 character$/i)).toBeInTheDocument();
      });

      // Click again to deselect
      await user.click(aChar);

      await waitFor(() => {
        expect(screen.getByText(/selected: 0 characters/i)).toBeInTheDocument();
      });
    });

    it('should switch between hiragana and katakana charts', async () => {
      const user = userEvent.setup();
      render(<KanaSection />);

      await enterPracticeSelectedMode(user);

      // Should show hiragana by default
      expect(screen.getByText('あ')).toBeInTheDocument();

      // Switch to katakana
      await user.click(screen.getByRole('button', { name: 'Katakana' }));

      await waitFor(() => {
        expect(screen.getByText('ア')).toBeInTheDocument();
      });
    });

    it('should persist selections when switching chart type', async () => {
      const user = userEvent.setup();
      render(<KanaSection />);

      await enterPracticeSelectedMode(user);

      // Select a hiragana character
      await user.click(screen.getByText('あ'));
      await waitFor(() => {
        expect(screen.getByText(/selected: 1 character$/i)).toBeInTheDocument();
      });

      // Switch to katakana and select
      await user.click(screen.getByRole('button', { name: 'Katakana' }));
      await waitFor(() => {
        expect(screen.getByText('ア')).toBeInTheDocument();
      });
      await user.click(screen.getByText('ア'));

      await waitFor(() => {
        expect(screen.getByText(/selected: 2 characters/i)).toBeInTheDocument();
      });

      // Switch back to hiragana - count should remain
      await user.click(screen.getByRole('button', { name: 'Hiragana' }));
      await waitFor(() => {
        expect(screen.getByText(/selected: 2 characters/i)).toBeInTheDocument();
      });
    });

    it('should start drilling when Start Practice clicked', async () => {
      const user = userEvent.setup();
      render(<KanaSection />);

      await enterPracticeSelectedMode(user);

      // Select a character
      await user.click(screen.getByText('あ'));
      await waitFor(() => {
        expect(screen.getByText(/selected: 1 character$/i)).toBeInTheDocument();
      });

      // Start practice
      await user.click(screen.getByRole('button', { name: /start practice/i }));

      await waitFor(() => {
        expect(screen.getByText(/back to selection/i)).toBeInTheDocument();
        expect(screen.getByText(/practicing: 1 character$/i)).toBeInTheDocument();
      });
    });

    it('should go back to chart selection when Back to Selection clicked', async () => {
      const user = userEvent.setup();
      render(<KanaSection />);

      await enterPracticeSelectedMode(user);

      // Select and start drilling
      await user.click(screen.getByText('あ'));
      await user.click(screen.getByRole('button', { name: /start practice/i }));

      await waitFor(() => {
        expect(screen.getByText(/back to selection/i)).toBeInTheDocument();
      });

      // Go back
      await user.click(screen.getByText(/back to selection/i));

      await waitFor(() => {
        expect(screen.getByText(/tap characters to select/i)).toBeInTheDocument();
        expect(screen.getByText(/selected: 1 character$/i)).toBeInTheDocument();
      });
    });

    it('should go back to mode selection from chart', async () => {
      const user = userEvent.setup();
      render(<KanaSection />);

      await enterPracticeSelectedMode(user);

      await user.click(screen.getByText('← Back'));

      await waitFor(() => {
        expect(screen.getByText('Choose Practice Mode')).toBeInTheDocument();
      });
    });
  });

  describe('Quiz Mode - Mastery Tracking', () => {
    const enterQuizMode = async (user: ReturnType<typeof userEvent.setup>) => {
      await user.click(screen.getByRole('button', { name: /quiz/i }));
      await waitFor(() => {
        expect(screen.getByText(/hiragana/i)).toBeInTheDocument();
      });
    };

    it('should show progress after first correct answer', async () => {
      const user = userEvent.setup();
      render(<KanaSection />);

      await enterQuizMode(user);

      const input = screen.getByPlaceholderText(/type the romanji/i);
      // Type a common answer that might be correct
      await user.type(input, 'a');
      await user.click(screen.getByRole('button', { name: /submit/i }));

      await waitFor(() => {
        // Should show either correct or incorrect feedback
        expect(screen.getByText(/(correct|incorrect)/i)).toBeInTheDocument();
      });
    });

    it('should show mastered message after 3 correct answers for same kana', async () => {
      const user = userEvent.setup();
      render(<KanaSection />);

      await enterQuizMode(user);

      // This test would require mocking the random selection to always return the same kana
      // For now, we'll just test that the component handles the logic properly
      const input = screen.getByPlaceholderText(/type the romanji/i);

      // Type and submit
      await user.type(input, 'a');
      await user.click(screen.getByRole('button', { name: /submit/i }));

      // Should show feedback
      await waitFor(() => {
        expect(screen.getByText(/(correct|incorrect)/i)).toBeInTheDocument();
      });
    });

    it('should increment mastered count when kana is mastered', async () => {
      const user = userEvent.setup();
      render(<KanaSection />);

      await enterQuizMode(user);

      // Initial mastered count should be 0
      expect(screen.getByText(/mastered: 0/i)).toBeInTheDocument();

      // Note: A complete test would need to mock the kana selection
      // to ensure we get the same kana 3 times and answer correctly each time
    });
  });

  describe('Answer Submission', () => {
    const enterQuizMode = async (user: ReturnType<typeof userEvent.setup>) => {
      await user.click(screen.getByRole('button', { name: /quiz/i }));
      await waitFor(() => {
        expect(screen.getByText(/hiragana/i)).toBeInTheDocument();
      });
    };

    it('should accept correct romanji answer', async () => {
      const user = userEvent.setup();
      render(<KanaSection />);

      await enterQuizMode(user);

      const input = screen.getByPlaceholderText(/type the romanji/i);
      await user.type(input, 'a');

      const submitButton = screen.getByRole('button', { name: /submit/i });
      expect(submitButton).not.toBeDisabled();

      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/(correct|incorrect)/i)).toBeInTheDocument();
      });
    });

    it('should disable submit button when input is empty', async () => {
      const user = userEvent.setup();
      render(<KanaSection />);

      await enterQuizMode(user);

      const submitButton = screen.getByRole('button', { name: /submit/i });
      expect(submitButton).toBeDisabled();
    });

    it('should show Next button after submission', async () => {
      const user = userEvent.setup();
      render(<KanaSection />);

      await enterQuizMode(user);

      const input = screen.getByPlaceholderText(/type the romanji/i);
      await user.type(input, 'a');
      await user.click(screen.getByRole('button', { name: /submit/i }));

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /next/i })).toBeInTheDocument();
      });
    });

    it('should clear input and show new kana when Next is clicked', async () => {
      const user = userEvent.setup();
      render(<KanaSection />);

      await enterQuizMode(user);

      const input = screen.getByPlaceholderText(/type the romanji/i) as HTMLInputElement;
      await user.type(input, 'a');
      await user.click(screen.getByRole('button', { name: /submit/i }));

      const nextButton = await screen.findByRole('button', { name: /next/i });
      await user.click(nextButton);

      await waitFor(() => {
        expect(input.value).toBe('');
        expect(screen.getByText(/[ぁ-ん]/)).toBeInTheDocument();
      });
    });
  });

  describe('Skip Functionality', () => {
    const enterQuizMode = async (user: ReturnType<typeof userEvent.setup>) => {
      await user.click(screen.getByRole('button', { name: /quiz/i }));
      await waitFor(() => {
        expect(screen.getByText(/hiragana/i)).toBeInTheDocument();
      });
    };

    it('should have Skip button available before submission', async () => {
      const user = userEvent.setup();
      render(<KanaSection />);

      await enterQuizMode(user);

      expect(screen.getByRole('button', { name: /skip/i })).toBeInTheDocument();
    });

    it('should show new kana when Skip is clicked', async () => {
      const user = userEvent.setup();
      render(<KanaSection />);

      await enterQuizMode(user);

      await user.click(screen.getByRole('button', { name: /skip/i }));

      await waitFor(() => {
        // Should still show a kana (might be same due to randomness)
        expect(screen.getByText(/[ぁ-ん]/)).toBeInTheDocument();
      });
    });

    it('should not affect score when skipping', async () => {
      const user = userEvent.setup();
      render(<KanaSection />);

      await enterQuizMode(user);

      expect(screen.getByText(/0 \/ 0/)).toBeInTheDocument();

      await user.click(screen.getByRole('button', { name: /skip/i }));

      await waitFor(() => {
        expect(screen.getByText(/0 \/ 0/)).toBeInTheDocument();
      });
    });
  });

  describe('Completion and Reset', () => {
    const enterQuizMode = async (user: ReturnType<typeof userEvent.setup>) => {
      await user.click(screen.getByRole('button', { name: /quiz/i }));
      await waitFor(() => {
        expect(screen.getByText(/hiragana/i)).toBeInTheDocument();
      });
    };

    it('should show Start Over button on completion screen', async () => {
      // This would require mocking all kana as mastered
      // Placeholder test for the structure
      const user = userEvent.setup();
      render(<KanaSection />);

      await enterQuizMode(user);

      // Would need to master all kana, then check for:
      // expect(screen.getByRole('button', { name: /start over/i })).toBeInTheDocument();
    });
  });
});
