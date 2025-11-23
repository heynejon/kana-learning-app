import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import WritingSection from '@/components/WritingSection';

// Mock the SignatureCanvas component since we don't test third-party libraries
jest.mock('react-signature-canvas', () => {
  return function SignatureCanvas() {
    return <canvas data-testid="signature-canvas" />;
  };
});

// Mock getRandomKana to have predictable results in tests
jest.mock('@/lib/kanaData', () => {
  const actual = jest.requireActual('@/lib/kanaData');
  let callCount = 0;
  const testKana = [
    { char: 'あ', romanji: 'a', type: 'hiragana' },
    { char: 'ア', romanji: 'a', type: 'katakana' },
    { char: 'か', romanji: 'ka', type: 'hiragana' },
  ];

  return {
    ...actual,
    getRandomKana: jest.fn(() => {
      const kana = testKana[callCount % testKana.length];
      callCount++;
      return kana;
    }),
  };
});

describe('WritingSection', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render the component', () => {
      render(<WritingSection />);

      expect(screen.getByText('What Kana?')).toBeInTheDocument();
      expect(screen.getByText('What Sound?')).toBeInTheDocument();
    });

    it('should display canvas for drawing', () => {
      render(<WritingSection />);

      expect(screen.getByTestId('signature-canvas')).toBeInTheDocument();
    });

    it('should start in practice mode by default', () => {
      render(<WritingSection />);

      const practiceButton = screen.getByRole('button', { name: 'What Kana?' });
      expect(practiceButton).toHaveClass('bg-[#BC002D]');
    });

    it('should display a kana character on mount', async () => {
      render(<WritingSection />);

      await waitFor(() => {
        // Should display romanji in practice mode
        expect(screen.getByText('a')).toBeInTheDocument();
      });
    });
  });

  describe('Mode Switching', () => {
    it('should switch to identify mode when What Sound button clicked', async () => {
      const user = userEvent.setup();
      render(<WritingSection />);

      const identifyButton = screen.getByRole('button', { name: 'What Sound?' });
      await user.click(identifyButton);

      await waitFor(() => {
        expect(identifyButton).toHaveClass('bg-[#BC002D]');
        expect(screen.getByText(/Draw a kana character below/i)).toBeInTheDocument();
      });
    });

    it('should switch back to practice mode when What Kana button clicked', async () => {
      const user = userEvent.setup();
      render(<WritingSection />);

      // Switch to identify first
      const identifyButton = screen.getByRole('button', { name: 'What Sound?' });
      await user.click(identifyButton);

      // Switch back to practice
      const practiceButton = screen.getByRole('button', { name: 'What Kana?' });
      await user.click(practiceButton);

      await waitFor(() => {
        expect(practiceButton).toHaveClass('bg-[#BC002D]');
        expect(screen.getByText(/Draw the/i)).toBeInTheDocument();
      });
    });

    it('should display different content in practice mode', async () => {
      render(<WritingSection />);

      await waitFor(() => {
        expect(screen.getByText(/Draw the (hiragana|katakana) for:/i)).toBeInTheDocument();
        expect(screen.getByText('a')).toBeInTheDocument();
      });
    });

    it('should display different content in identify mode', async () => {
      const user = userEvent.setup();
      render(<WritingSection />);

      const identifyButton = screen.getByRole('button', { name: 'What Sound?' });
      await user.click(identifyButton);

      await waitFor(() => {
        expect(screen.getByText(/Draw a kana character below/i)).toBeInTheDocument();
        expect(screen.getByText(/Full recognition coming soon/i)).toBeInTheDocument();
      });
    });
  });

  describe('Practice Mode Functionality', () => {
    it('should show Show Answer button in practice mode', () => {
      render(<WritingSection />);

      expect(screen.getByRole('button', { name: 'Show Answer' })).toBeInTheDocument();
    });

    it('should display answer when Show Answer button clicked', async () => {
      const user = userEvent.setup();
      render(<WritingSection />);

      const showAnswerButton = screen.getByRole('button', { name: 'Show Answer' });
      await user.click(showAnswerButton);

      await waitFor(() => {
        expect(screen.getByText('Answer:')).toBeInTheDocument();
        // Should show either hiragana or katakana character
        expect(screen.getByText(/[あア]/)).toBeInTheDocument();
        expect(screen.getByText(/\((hiragana|katakana)\)/)).toBeInTheDocument();
      });
    });

    it('should hide Show Answer button after clicking it', async () => {
      const user = userEvent.setup();
      render(<WritingSection />);

      const showAnswerButton = screen.getByRole('button', { name: 'Show Answer' });
      await user.click(showAnswerButton);

      await waitFor(() => {
        expect(screen.queryByRole('button', { name: 'Show Answer' })).not.toBeInTheDocument();
      });
    });

    it('should have Next Character button in practice mode', () => {
      render(<WritingSection />);

      expect(screen.getByRole('button', { name: 'Next Character' })).toBeInTheDocument();
    });

    it('should show new character when Next Character clicked', async () => {
      const user = userEvent.setup();
      render(<WritingSection />);

      // Initial character should be 'a' (あ or ア)
      await waitFor(() => {
        expect(screen.getByText('a')).toBeInTheDocument();
      });

      const nextButton = screen.getByRole('button', { name: 'Next Character' });
      await user.click(nextButton);

      await waitFor(() => {
        // Next call returns a new character (either hiragana or katakana)
        expect(screen.getByText(/Draw the (hiragana|katakana) for:/i)).toBeInTheDocument();
      });
    });

    it('should hide answer when Next Character clicked', async () => {
      const user = userEvent.setup();
      render(<WritingSection />);

      // Show answer first
      const showAnswerButton = screen.getByRole('button', { name: 'Show Answer' });
      await user.click(showAnswerButton);

      await waitFor(() => {
        expect(screen.getByText('Answer:')).toBeInTheDocument();
      });

      // Click next
      const nextButton = screen.getByRole('button', { name: 'Next Character' });
      await user.click(nextButton);

      await waitFor(() => {
        expect(screen.queryByText('Answer:')).not.toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Show Answer' })).toBeInTheDocument();
      });
    });
  });

  describe('Identify Mode Functionality', () => {
    it('should show Identify button in identify mode', async () => {
      const user = userEvent.setup();
      render(<WritingSection />);

      const identifyButton = screen.getByRole('button', { name: 'What Sound?' });
      await user.click(identifyButton);

      await waitFor(() => {
        expect(screen.getByRole('button', { name: 'Identify' })).toBeInTheDocument();
      });
    });

    it('should show alert when Identify button clicked', async () => {
      const user = userEvent.setup();
      const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {});
      render(<WritingSection />);

      // Switch to identify mode
      const modeButton = screen.getByRole('button', { name: 'What Sound?' });
      await user.click(modeButton);

      // Click identify button
      const identifyButton = await screen.findByRole('button', { name: 'Identify' });
      await user.click(identifyButton);

      expect(alertSpy).toHaveBeenCalledWith(
        'Character recognition will be implemented soon! Keep practicing your strokes.'
      );

      alertSpy.mockRestore();
    });

    it('should not show Show Answer button in identify mode', async () => {
      const user = userEvent.setup();
      render(<WritingSection />);

      const identifyButton = screen.getByRole('button', { name: 'What Sound?' });
      await user.click(identifyButton);

      await waitFor(() => {
        expect(screen.queryByRole('button', { name: 'Show Answer' })).not.toBeInTheDocument();
      });
    });

    it('should not show Next Character button in identify mode', async () => {
      const user = userEvent.setup();
      render(<WritingSection />);

      const identifyButton = screen.getByRole('button', { name: 'What Sound?' });
      await user.click(identifyButton);

      await waitFor(() => {
        expect(screen.queryByRole('button', { name: 'Next Character' })).not.toBeInTheDocument();
      });
    });
  });

  describe('Clear Canvas Functionality', () => {
    it('should have Clear button available', () => {
      render(<WritingSection />);

      expect(screen.getByRole('button', { name: 'Clear' })).toBeInTheDocument();
    });

    it('should hide answer when Clear button clicked in practice mode', async () => {
      const user = userEvent.setup();
      render(<WritingSection />);

      // Show answer first
      const showAnswerButton = screen.getByRole('button', { name: 'Show Answer' });
      await user.click(showAnswerButton);

      await waitFor(() => {
        expect(screen.getByText('Answer:')).toBeInTheDocument();
      });

      // Click clear
      const clearButton = screen.getByRole('button', { name: 'Clear' });
      await user.click(clearButton);

      await waitFor(() => {
        expect(screen.queryByText('Answer:')).not.toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Show Answer' })).toBeInTheDocument();
      });
    });

    it('should be available in both modes', async () => {
      const user = userEvent.setup();
      render(<WritingSection />);

      // Check in practice mode
      expect(screen.getByRole('button', { name: 'Clear' })).toBeInTheDocument();

      // Switch to identify mode
      const identifyButton = screen.getByRole('button', { name: 'What Sound?' });
      await user.click(identifyButton);

      // Check in identify mode
      await waitFor(() => {
        expect(screen.getByRole('button', { name: 'Clear' })).toBeInTheDocument();
      });
    });
  });

  describe('Integration', () => {
    it('should handle mode switching while answer is shown', async () => {
      const user = userEvent.setup();
      render(<WritingSection />);

      // Show answer in practice mode
      const showAnswerButton = screen.getByRole('button', { name: 'Show Answer' });
      await user.click(showAnswerButton);

      await waitFor(() => {
        expect(screen.getByText('Answer:')).toBeInTheDocument();
      });

      // Switch to identify mode
      const identifyButton = screen.getByRole('button', { name: 'What Sound?' });
      await user.click(identifyButton);

      // Answer should be hidden
      await waitFor(() => {
        expect(screen.queryByText('Answer:')).not.toBeInTheDocument();
      });

      // Switch back to practice mode
      const practiceButton = screen.getByRole('button', { name: 'What Kana?' });
      await user.click(practiceButton);

      // Show Answer button should be available again
      await waitFor(() => {
        expect(screen.getByRole('button', { name: 'Show Answer' })).toBeInTheDocument();
      });
    });
  });
});
