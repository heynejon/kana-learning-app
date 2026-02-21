import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import NumbersSection from '@/components/NumbersSection';

const mockOnBack = jest.fn();

// Helper to navigate from mode selection through quiz setup to the quiz
async function navigateToQuiz(user: ReturnType<typeof userEvent.setup>) {
  await user.click(screen.getByText('Quiz'));

  await waitFor(() => {
    expect(screen.getByText('Start Quiz →')).toBeInTheDocument();
  });

  await user.click(screen.getByText('Start Quiz →'));

  await waitFor(() => {
    expect(screen.getByText('Score')).toBeInTheDocument();
  });
}

describe('NumbersSection', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Mode Selection', () => {
    it('should render the mode selection screen', () => {
      render(<NumbersSection onBack={mockOnBack} />);

      expect(screen.getByText('Chart')).toBeInTheDocument();
      expect(screen.getByText('Quiz')).toBeInTheDocument();
    });

    it('should show chart description', () => {
      render(<NumbersSection onBack={mockOnBack} />);

      expect(screen.getByText('View all numbers with kanji and readings')).toBeInTheDocument();
    });

    it('should show quiz description', () => {
      render(<NumbersSection onBack={mockOnBack} />);

      expect(screen.getByText('Match numbers, kanji, and readings')).toBeInTheDocument();
    });
  });

  describe('Chart View', () => {
    it('should display the chart when Chart is clicked', async () => {
      const user = userEvent.setup();
      render(<NumbersSection onBack={mockOnBack} />);

      await user.click(screen.getByText('Chart'));

      await waitFor(() => {
        expect(screen.getByText('一')).toBeInTheDocument();
        expect(screen.getByText('二')).toBeInTheDocument();
        expect(screen.getByText('三')).toBeInTheDocument();
        expect(screen.getByText('十')).toBeInTheDocument();
      });
    });

    it('should display digits in the chart', async () => {
      const user = userEvent.setup();
      render(<NumbersSection onBack={mockOnBack} />);

      await user.click(screen.getByText('Chart'));

      await waitFor(() => {
        expect(screen.getByText('1')).toBeInTheDocument();
        expect(screen.getByText('10')).toBeInTheDocument();
      });
    });

    it('should display readings in the chart', async () => {
      const user = userEvent.setup();
      render(<NumbersSection onBack={mockOnBack} />);

      await user.click(screen.getByText('Chart'));

      await waitFor(() => {
        expect(screen.getByText('いち')).toBeInTheDocument();
        expect(screen.getByText('なな / しち')).toBeInTheDocument();
      });
    });

    it('should display romanji in the chart', async () => {
      const user = userEvent.setup();
      render(<NumbersSection onBack={mockOnBack} />);

      await user.click(screen.getByText('Chart'));

      await waitFor(() => {
        expect(screen.getByText('ichi')).toBeInTheDocument();
        expect(screen.getByText('nana / shichi')).toBeInTheDocument();
      });
    });

    it('should have a back button that returns to mode selection', async () => {
      const user = userEvent.setup();
      render(<NumbersSection onBack={mockOnBack} />);

      await user.click(screen.getByText('Chart'));

      await waitFor(() => {
        expect(screen.getByText('← Back')).toBeInTheDocument();
      });

      await user.click(screen.getByText('← Back'));

      await waitFor(() => {
        expect(screen.getByText('Chart')).toBeInTheDocument();
        expect(screen.getByText('Quiz')).toBeInTheDocument();
      });
    });
  });

  describe('Quiz Setup', () => {
    it('should show category selection when Quiz is clicked', async () => {
      const user = userEvent.setup();
      render(<NumbersSection onBack={mockOnBack} />);

      await user.click(screen.getByText('Quiz'));

      await waitFor(() => {
        expect(screen.getByText('Number (1)')).toBeInTheDocument();
        expect(screen.getByText('Kanji (一)')).toBeInTheDocument();
        expect(screen.getByText('Kana (いち)')).toBeInTheDocument();
        expect(screen.getByText('Romanji (ichi)')).toBeInTheDocument();
        expect(screen.getByText('Start Quiz →')).toBeInTheDocument();
      });
    });

    it('should start with all 4 categories selected', async () => {
      const user = userEvent.setup();
      render(<NumbersSection onBack={mockOnBack} />);

      await user.click(screen.getByText('Quiz'));

      await waitFor(() => {
        const numberBtn = screen.getByText('Number (1)');
        const kanjiBtn = screen.getByText('Kanji (一)');
        const readingBtn = screen.getByText('Kana (いち)');
        const romanjiBtn = screen.getByText('Romanji (ichi)');

        expect(numberBtn).toHaveClass('bg-[#BC002D]');
        expect(kanjiBtn).toHaveClass('bg-[#BC002D]');
        expect(readingBtn).toHaveClass('bg-[#BC002D]');
        expect(romanjiBtn).toHaveClass('bg-[#BC002D]');
      });
    });

    it('should toggle category selection on click', async () => {
      const user = userEvent.setup();
      render(<NumbersSection onBack={mockOnBack} />);

      await user.click(screen.getByText('Quiz'));

      await waitFor(() => {
        expect(screen.getByText('Kana (いち)')).toHaveClass('bg-[#BC002D]');
      });

      await user.click(screen.getByText('Kana (いち)'));

      await waitFor(() => {
        expect(screen.getByText('Kana (いち)')).not.toHaveClass('bg-[#BC002D]');
      });
    });

    it('should disable Start Quiz when fewer than 2 categories selected', async () => {
      const user = userEvent.setup();
      render(<NumbersSection onBack={mockOnBack} />);

      await user.click(screen.getByText('Quiz'));

      // Deselect 3 categories, leaving only 1
      await user.click(screen.getByText('Kanji (一)'));
      await user.click(screen.getByText('Kana (いち)'));
      await user.click(screen.getByText('Romanji (ichi)'));

      await waitFor(() => {
        expect(screen.getByText('Start Quiz →')).toBeDisabled();
      });
    });

    it('should have a Select All / Deselect All toggle', async () => {
      const user = userEvent.setup();
      render(<NumbersSection onBack={mockOnBack} />);

      await user.click(screen.getByText('Quiz'));

      await waitFor(() => {
        // All selected, so should show Deselect All
        expect(screen.getByText('Deselect All')).toBeInTheDocument();
      });

      await user.click(screen.getByText('Deselect All'));

      await waitFor(() => {
        expect(screen.getByText('Select All')).toBeInTheDocument();
        expect(screen.getByText('Number (1)')).not.toHaveClass('bg-[#BC002D]');
      });
    });

    it('should navigate back to mode selection', async () => {
      const user = userEvent.setup();
      render(<NumbersSection onBack={mockOnBack} />);

      await user.click(screen.getByText('Quiz'));

      await waitFor(() => {
        expect(screen.getByText('← Back')).toBeInTheDocument();
      });

      await user.click(screen.getByText('← Back'));

      await waitFor(() => {
        expect(screen.getByText('Chart')).toBeInTheDocument();
        expect(screen.getByText('Quiz')).toBeInTheDocument();
      });
    });
  });

  describe('Quiz View', () => {
    it('should display the quiz after setup', async () => {
      const user = userEvent.setup();
      render(<NumbersSection onBack={mockOnBack} />);

      await navigateToQuiz(user);

      expect(screen.getByText('0 / 0')).toBeInTheDocument();
    });

    it('should display exactly 8 answer buttons', async () => {
      const user = userEvent.setup();
      render(<NumbersSection onBack={mockOnBack} />);

      await navigateToQuiz(user);

      const grid = document.querySelector('.grid.grid-cols-4');
      expect(grid).toBeInTheDocument();

      const buttons = grid!.querySelectorAll('button');
      expect(buttons.length).toBe(8);
    });

    it('should show feedback after clicking an answer', async () => {
      const user = userEvent.setup();
      render(<NumbersSection onBack={mockOnBack} />);

      await navigateToQuiz(user);

      const grid = document.querySelector('.grid.grid-cols-4');
      const buttons = grid!.querySelectorAll('button');
      await user.click(buttons[0]);

      await waitFor(() => {
        const hasCorrect = screen.queryByText('Correct!');
        const hasIncorrect = screen.queryByText(/Incorrect/);
        expect(hasCorrect || hasIncorrect).toBeTruthy();
      });
    });

    it('should show Next button after answering', async () => {
      const user = userEvent.setup();
      render(<NumbersSection onBack={mockOnBack} />);

      await navigateToQuiz(user);

      const grid = document.querySelector('.grid.grid-cols-4');
      const buttons = grid!.querySelectorAll('button');
      await user.click(buttons[0]);

      await waitFor(() => {
        expect(screen.getByText('Next')).toBeInTheDocument();
      });
    });

    it('should update score after answering', async () => {
      const user = userEvent.setup();
      render(<NumbersSection onBack={mockOnBack} />);

      await navigateToQuiz(user);

      expect(screen.getByText('0 / 0')).toBeInTheDocument();

      const grid = document.querySelector('.grid.grid-cols-4');
      const buttons = grid!.querySelectorAll('button');
      await user.click(buttons[0]);

      await waitFor(() => {
        expect(screen.queryByText('0 / 0')).not.toBeInTheDocument();
      });
    });

    it('should advance to next question when Next is clicked', async () => {
      const user = userEvent.setup();
      render(<NumbersSection onBack={mockOnBack} />);

      await navigateToQuiz(user);

      const grid = document.querySelector('.grid.grid-cols-4');
      const buttons = grid!.querySelectorAll('button');
      await user.click(buttons[0]);

      await waitFor(() => {
        expect(screen.getByText('Next')).toBeInTheDocument();
      });

      await user.click(screen.getByText('Next'));

      await waitFor(() => {
        expect(screen.queryByText('Correct!')).not.toBeInTheDocument();
        expect(screen.queryByText(/Incorrect/)).not.toBeInTheDocument();
      });
    });

    it('should have a back button that returns to mode selection', async () => {
      const user = userEvent.setup();
      render(<NumbersSection onBack={mockOnBack} />);

      await navigateToQuiz(user);

      await user.click(screen.getByText('← Back'));

      await waitFor(() => {
        expect(screen.getByText('Chart')).toBeInTheDocument();
        expect(screen.getByText('Quiz')).toBeInTheDocument();
      });
    });
  });
});
