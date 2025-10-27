# Kana Learning App

A simple, mobile-friendly web application to help learn Japanese Hiragana and Katakana characters.

## Features

### 1. Sounds Section
- Practice individual kana characters
- Toggle between Hiragana, Katakana, or both
- Type the romanji (e.g., "ka", "shi") for each character shown
- Instant feedback with score tracking
- Auto-advance to keep practice flowing

### 2. Words Section
- Practice full Japanese words
- Uses the Jisho.org API for real Japanese vocabulary
- Toggle between Hiragana, Katakana, or Mixed words
- See word meanings to aid learning
- Type the romanji translation
- Score tracking with percentage

### 3. Writing Section
- Two practice modes:
  - **What Kana?** - Given a sound, draw the corresponding kana
  - **What Sound?** - Draw a kana and identify it (coming soon)
- Canvas-based drawing with touch support
- Show/hide answer functionality
- Mobile-optimized touch drawing

## Tech Stack

- **Framework**: Next.js 16 with App Router
- **Styling**: Tailwind CSS
- **Language**: TypeScript
- **API**: unofficial-jisho-api for Japanese word data
- **Utilities**: wanakana for kana/romanji conversion

## Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

The app will be available at [http://localhost:3000](http://localhost:3000)

## Deployment to Vercel

### Option 1: Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Option 2: Vercel Dashboard

1. Push your code to a Git repository (GitHub, GitLab, or Bitbucket)
2. Go to [vercel.com](https://vercel.com)
3. Click "Add New Project"
4. Import your repository
5. Vercel will automatically detect Next.js and configure the build settings
6. Click "Deploy"

### Environment Variables

No environment variables are required for this app. All APIs used are free and don't require authentication.

## Mobile Optimization

The app is specifically optimized for mobile browsers:
- Responsive design that works on all screen sizes
- Prevents zoom on input focus (iOS Safari)
- Proper touch event handling for canvas drawing
- Bottom padding to prevent keyboard overlap
- Fixed navigation tabs for easy section switching

## Future Enhancements

- Handwriting recognition using TensorFlow.js
- Progress tracking and statistics
- Spaced repetition system
- Custom practice sets
- Audio pronunciation
- Stroke order animations

## License

MIT License - Feel free to use this for your own learning!
