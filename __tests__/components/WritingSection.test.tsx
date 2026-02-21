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

      expect(screen.getByTestId('signature-canvas')).toBeInTheDocument();
    });

    it('should display a kana character on mount', async () => {
      render(<WritingSection />);

      await waitFor(() => {
        expect(screen.getByText('a')).toBeInTheDocument();
        expect(screen.getByText(/Draw the (hiragana|katakana) for:/i)).toBeInTheDocument();
      });
    });
  });

  describe('Practice Functionality', () => {
    it('should show Show Answer button', () => {
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

    it('should have Next Character button', () => {
      render(<WritingSection />);

      expect(screen.getByRole('button', { name: 'Next Character' })).toBeInTheDocument();
    });

    it('should show new character when Next Character clicked', async () => {
      const user = userEvent.setup();
      render(<WritingSection />);

      await waitFor(() => {
        expect(screen.getByText('a')).toBeInTheDocument();
      });

      const nextButton = screen.getByRole('button', { name: 'Next Character' });
      await user.click(nextButton);

      await waitFor(() => {
        expect(screen.getByText(/Draw the (hiragana|katakana) for:/i)).toBeInTheDocument();
      });
    });

    it('should hide answer when Next Character clicked', async () => {
      const user = userEvent.setup();
      render(<WritingSection />);

      const showAnswerButton = screen.getByRole('button', { name: 'Show Answer' });
      await user.click(showAnswerButton);

      await waitFor(() => {
        expect(screen.getByText('Answer:')).toBeInTheDocument();
      });

      const nextButton = screen.getByRole('button', { name: 'Next Character' });
      await user.click(nextButton);

      await waitFor(() => {
        expect(screen.queryByText('Answer:')).not.toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Show Answer' })).toBeInTheDocument();
      });
    });
  });

  describe('Clear Canvas Functionality', () => {
    it('should have Clear button available', () => {
      render(<WritingSection />);

      expect(screen.getByRole('button', { name: 'Clear' })).toBeInTheDocument();
    });

    it('should hide answer when Clear button clicked', async () => {
      const user = userEvent.setup();
      render(<WritingSection />);

      const showAnswerButton = screen.getByRole('button', { name: 'Show Answer' });
      await user.click(showAnswerButton);

      await waitFor(() => {
        expect(screen.getByText('Answer:')).toBeInTheDocument();
      });

      const clearButton = screen.getByRole('button', { name: 'Clear' });
      await user.click(clearButton);

      await waitFor(() => {
        expect(screen.queryByText('Answer:')).not.toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Show Answer' })).toBeInTheDocument();
      });
    });
  });
});
