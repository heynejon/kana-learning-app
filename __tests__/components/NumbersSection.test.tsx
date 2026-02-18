import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import NumbersSection from '@/components/NumbersSection';

const mockOnBack = jest.fn();

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
        // Should show all 10 kanji
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

  describe('Quiz View', () => {
    it('should display the quiz when Quiz is clicked', async () => {
      const user = userEvent.setup();
      render(<NumbersSection onBack={mockOnBack} />);

      await user.click(screen.getByText('Quiz'));

      await waitFor(() => {
        // Should show score
        expect(screen.getByText('Score')).toBeInTheDocument();
        expect(screen.getByText('0 / 0')).toBeInTheDocument();
      });
    });

    it('should display exactly 8 answer buttons', async () => {
      const user = userEvent.setup();
      render(<NumbersSection onBack={mockOnBack} />);

      await user.click(screen.getByText('Quiz'));

      await waitFor(() => {
        // The quiz has a grid of 8 answer buttons plus back button and score area
        // Answer buttons are in a 2-column grid
        const grid = document.querySelector('.grid.grid-cols-4');
        expect(grid).toBeInTheDocument();

        const buttons = grid!.querySelectorAll('button');
        expect(buttons.length).toBe(8);
      });
    });

    it('should show a question category label', async () => {
      const user = userEvent.setup();
      render(<NumbersSection onBack={mockOnBack} />);

      await user.click(screen.getByText('Quiz'));

      await waitFor(() => {
        // Should show one of: Number, Kanji, Reading
        const labels = ['Number', 'Kanji', 'Reading'];
        const foundLabel = labels.some((label) => screen.queryByText(label));
        expect(foundLabel).toBe(true);
      });
    });

    it('should show feedback after clicking an answer', async () => {
      const user = userEvent.setup();
      render(<NumbersSection onBack={mockOnBack} />);

      await user.click(screen.getByText('Quiz'));

      await waitFor(() => {
        const grid = document.querySelector('.grid.grid-cols-4');
        expect(grid).toBeInTheDocument();
      });

      // Click the first answer button
      const grid = document.querySelector('.grid.grid-cols-4');
      const buttons = grid!.querySelectorAll('button');
      await user.click(buttons[0]);

      await waitFor(() => {
        // Should show either "Correct!" or "Incorrect..."
        const hasCorrect = screen.queryByText('Correct!');
        const hasIncorrect = screen.queryByText(/Incorrect/);
        expect(hasCorrect || hasIncorrect).toBeTruthy();
      });
    });

    it('should show Next button after answering', async () => {
      const user = userEvent.setup();
      render(<NumbersSection onBack={mockOnBack} />);

      await user.click(screen.getByText('Quiz'));

      await waitFor(() => {
        const grid = document.querySelector('.grid.grid-cols-4');
        expect(grid).toBeInTheDocument();
      });

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

      await user.click(screen.getByText('Quiz'));

      await waitFor(() => {
        expect(screen.getByText('0 / 0')).toBeInTheDocument();
      });

      const grid = document.querySelector('.grid.grid-cols-4');
      const buttons = grid!.querySelectorAll('button');
      await user.click(buttons[0]);

      await waitFor(() => {
        // Score should now show X / 1
        expect(screen.queryByText('0 / 0')).not.toBeInTheDocument();
      });
    });

    it('should advance to next question when Next is clicked', async () => {
      const user = userEvent.setup();
      render(<NumbersSection onBack={mockOnBack} />);

      await user.click(screen.getByText('Quiz'));

      await waitFor(() => {
        const grid = document.querySelector('.grid.grid-cols-4');
        expect(grid).toBeInTheDocument();
      });

      // Answer first question
      const grid = document.querySelector('.grid.grid-cols-4');
      const buttons = grid!.querySelectorAll('button');
      await user.click(buttons[0]);

      await waitFor(() => {
        expect(screen.getByText('Next')).toBeInTheDocument();
      });

      // Click Next
      await user.click(screen.getByText('Next'));

      await waitFor(() => {
        // Feedback should be gone, new question should be shown
        expect(screen.queryByText('Correct!')).not.toBeInTheDocument();
        expect(screen.queryByText(/Incorrect/)).not.toBeInTheDocument();
      });
    });

    it('should have a back button that returns to mode selection', async () => {
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
});
