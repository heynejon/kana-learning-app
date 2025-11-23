import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ChartsSection from '@/components/ChartsSection';

describe('ChartsSection', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render the component', () => {
      render(<ChartsSection />);

      expect(screen.getByRole('button', { name: 'Hiragana' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Katakana' })).toBeInTheDocument();
    });

    it('should start with hiragana view by default', () => {
      render(<ChartsSection />);

      const hiraganaButton = screen.getByRole('button', { name: 'Hiragana' });
      expect(hiraganaButton).toHaveClass('bg-[#BC002D]');
    });

    it('should display hiragana characters on initial load', () => {
      render(<ChartsSection />);

      // Check for basic vowels
      expect(screen.getByText('あ')).toBeInTheDocument();
      expect(screen.getByText('い')).toBeInTheDocument();
      expect(screen.getByText('う')).toBeInTheDocument();
      expect(screen.getByText('え')).toBeInTheDocument();
      expect(screen.getByText('お')).toBeInTheDocument();
    });

    it('should display romanji for each character', () => {
      render(<ChartsSection />);

      // Check for vowel romanji
      const romanjiElements = screen.getAllByText('a');
      expect(romanjiElements.length).toBeGreaterThan(0);
    });

    it('should display empty cells with dash for partial rows', () => {
      render(<ChartsSection />);

      // Y-row has empty cells, W-row has empty cells, N has empty cells
      const dashes = screen.getAllByText('—');
      expect(dashes.length).toBeGreaterThan(0);
    });
  });

  describe('View Switching', () => {
    it('should switch to katakana view when Katakana button clicked', async () => {
      const user = userEvent.setup();
      render(<ChartsSection />);

      const katakanaButton = screen.getByRole('button', { name: 'Katakana' });
      await user.click(katakanaButton);

      await waitFor(() => {
        expect(katakanaButton).toHaveClass('bg-[#BC002D]');
      });
    });

    it('should display katakana characters when switched to katakana view', async () => {
      const user = userEvent.setup();
      render(<ChartsSection />);

      const katakanaButton = screen.getByRole('button', { name: 'Katakana' });
      await user.click(katakanaButton);

      await waitFor(() => {
        // Check for basic katakana vowels
        expect(screen.getByText('ア')).toBeInTheDocument();
        expect(screen.getByText('イ')).toBeInTheDocument();
        expect(screen.getByText('ウ')).toBeInTheDocument();
        expect(screen.getByText('エ')).toBeInTheDocument();
        expect(screen.getByText('オ')).toBeInTheDocument();
      });
    });

    it('should switch back to hiragana view when Hiragana button clicked', async () => {
      const user = userEvent.setup();
      render(<ChartsSection />);

      // Switch to katakana first
      const katakanaButton = screen.getByRole('button', { name: 'Katakana' });
      await user.click(katakanaButton);

      await waitFor(() => {
        expect(screen.getByText('ア')).toBeInTheDocument();
      });

      // Switch back to hiragana
      const hiraganaButton = screen.getByRole('button', { name: 'Hiragana' });
      await user.click(hiraganaButton);

      await waitFor(() => {
        expect(hiraganaButton).toHaveClass('bg-[#BC002D]');
        expect(screen.getByText('あ')).toBeInTheDocument();
      });
    });

    it('should not display hiragana characters in katakana view', async () => {
      const user = userEvent.setup();
      render(<ChartsSection />);

      const katakanaButton = screen.getByRole('button', { name: 'Katakana' });
      await user.click(katakanaButton);

      await waitFor(() => {
        expect(screen.queryByText('あ')).not.toBeInTheDocument();
        expect(screen.queryByText('い')).not.toBeInTheDocument();
      });
    });

    it('should not display katakana characters in hiragana view', () => {
      render(<ChartsSection />);

      expect(screen.queryByText('ア')).not.toBeInTheDocument();
      expect(screen.queryByText('イ')).not.toBeInTheDocument();
    });
  });

  describe('Character Organization', () => {
    it('should display vowels in the first row', () => {
      render(<ChartsSection />);

      // All basic vowels should be present
      expect(screen.getByText('あ')).toBeInTheDocument();
      expect(screen.getByText('い')).toBeInTheDocument();
      expect(screen.getByText('う')).toBeInTheDocument();
      expect(screen.getByText('え')).toBeInTheDocument();
      expect(screen.getByText('お')).toBeInTheDocument();
    });

    it('should display k-row characters', () => {
      render(<ChartsSection />);

      expect(screen.getByText('か')).toBeInTheDocument();
      expect(screen.getByText('き')).toBeInTheDocument();
      expect(screen.getByText('く')).toBeInTheDocument();
      expect(screen.getByText('け')).toBeInTheDocument();
      expect(screen.getByText('こ')).toBeInTheDocument();
    });

    it('should display dakuten characters (g-row, z-row, d-row)', () => {
      render(<ChartsSection />);

      // G-row
      expect(screen.getByText('が')).toBeInTheDocument();
      expect(screen.getByText('ぎ')).toBeInTheDocument();

      // Z-row
      expect(screen.getByText('ざ')).toBeInTheDocument();
      expect(screen.getByText('じ')).toBeInTheDocument();

      // D-row
      expect(screen.getByText('だ')).toBeInTheDocument();
    });

    it('should display handakuten characters (p-row)', () => {
      render(<ChartsSection />);

      expect(screen.getByText('ぱ')).toBeInTheDocument();
      expect(screen.getByText('ぴ')).toBeInTheDocument();
      expect(screen.getByText('ぷ')).toBeInTheDocument();
    });

    it('should display special character ん', () => {
      render(<ChartsSection />);

      expect(screen.getByText('ん')).toBeInTheDocument();
    });

    it('should organize katakana characters correctly', async () => {
      const user = userEvent.setup();
      render(<ChartsSection />);

      const katakanaButton = screen.getByRole('button', { name: 'Katakana' });
      await user.click(katakanaButton);

      await waitFor(() => {
        // Vowels
        expect(screen.getByText('ア')).toBeInTheDocument();
        expect(screen.getByText('イ')).toBeInTheDocument();

        // K-row
        expect(screen.getByText('カ')).toBeInTheDocument();
        expect(screen.getByText('キ')).toBeInTheDocument();

        // Special character
        expect(screen.getByText('ン')).toBeInTheDocument();
      });
    });
  });

  describe('Romanji Display', () => {
    it('should display correct romanji for vowels', () => {
      render(<ChartsSection />);

      // Check for all vowel romanji (there will be multiple 'a', 'i', etc.)
      expect(screen.getAllByText('a').length).toBeGreaterThan(0);
      expect(screen.getAllByText('i').length).toBeGreaterThan(0);
      expect(screen.getAllByText('u').length).toBeGreaterThan(0);
      expect(screen.getAllByText('e').length).toBeGreaterThan(0);
      expect(screen.getAllByText('o').length).toBeGreaterThan(0);
    });

    it('should display correct romanji for k-row', () => {
      render(<ChartsSection />);

      expect(screen.getByText('ka')).toBeInTheDocument();
      expect(screen.getByText('ki')).toBeInTheDocument();
      expect(screen.getByText('ku')).toBeInTheDocument();
      expect(screen.getByText('ke')).toBeInTheDocument();
      expect(screen.getByText('ko')).toBeInTheDocument();
    });

    it('should display correct romanji for special characters', () => {
      render(<ChartsSection />);

      expect(screen.getAllByText('n').length).toBeGreaterThan(0);
      expect(screen.getByText('wo')).toBeInTheDocument();
    });

    it('should display correct romanji in katakana view', async () => {
      const user = userEvent.setup();
      render(<ChartsSection />);

      const katakanaButton = screen.getByRole('button', { name: 'Katakana' });
      await user.click(katakanaButton);

      await waitFor(() => {
        expect(screen.getByText('ka')).toBeInTheDocument();
        expect(screen.getByText('sa')).toBeInTheDocument();
        expect(screen.getByText('ta')).toBeInTheDocument();
      });
    });
  });

  describe('Table Structure', () => {
    it('should render all character rows', () => {
      render(<ChartsSection />);

      // Should render 16 rows (vowels + k,s,t,n,h,m,y,r,w,n + g,z,d,b,p)
      // Each row has 5 columns
      // We can check for the presence of characters from different rows

      // First row (vowels)
      expect(screen.getByText('あ')).toBeInTheDocument();

      // Last row (p-row)
      expect(screen.getByText('ぱ')).toBeInTheDocument();
      expect(screen.getByText('ぽ')).toBeInTheDocument();
    });

    it('should handle partial rows with empty cells', () => {
      render(<ChartsSection />);

      // Y-row has 3 characters: ya, yu, yo (with empty cells)
      expect(screen.getByText('や')).toBeInTheDocument();
      expect(screen.getByText('ゆ')).toBeInTheDocument();
      expect(screen.getByText('よ')).toBeInTheDocument();

      // W-row has 2 characters: wa, wo (with empty cells)
      expect(screen.getByText('わ')).toBeInTheDocument();
      expect(screen.getByText('を')).toBeInTheDocument();

      // Should have dashes for empty cells
      const dashes = screen.getAllByText('—');
      expect(dashes.length).toBeGreaterThan(5); // y-row (2) + w-row (3) + n-row (4) = 9
    });

    it('should render same structure for both hiragana and katakana', async () => {
      const user = userEvent.setup();
      render(<ChartsSection />);

      // Count dashes in hiragana view
      const hiraganaDashes = screen.getAllByText('—');
      const hiraganaCount = hiraganaDashes.length;

      // Switch to katakana
      const katakanaButton = screen.getByRole('button', { name: 'Katakana' });
      await user.click(katakanaButton);

      await waitFor(() => {
        const katakanaDashes = screen.getAllByText('—');
        expect(katakanaDashes.length).toBe(hiraganaCount);
      });
    });
  });

  describe('Accessibility', () => {
    it('should have properly labeled buttons', () => {
      render(<ChartsSection />);

      expect(screen.getByRole('button', { name: 'Hiragana' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Katakana' })).toBeInTheDocument();
    });

    it('should indicate active view with styling', () => {
      render(<ChartsSection />);

      const hiraganaButton = screen.getByRole('button', { name: 'Hiragana' });
      const katakanaButton = screen.getByRole('button', { name: 'Katakana' });

      expect(hiraganaButton).toHaveClass('bg-[#BC002D]');
      expect(katakanaButton).not.toHaveClass('bg-[#BC002D]');
    });

    it('should update active view styling when switched', async () => {
      const user = userEvent.setup();
      render(<ChartsSection />);

      const katakanaButton = screen.getByRole('button', { name: 'Katakana' });
      await user.click(katakanaButton);

      await waitFor(() => {
        const hiraganaButton = screen.getByRole('button', { name: 'Hiragana' });
        expect(katakanaButton).toHaveClass('bg-[#BC002D]');
        expect(hiraganaButton).not.toHaveClass('bg-[#BC002D]');
      });
    });
  });
});
