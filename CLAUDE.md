# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

YouTube Analytics Pro is a Next.js 14 application providing advanced YouTube analytics and SEO tools NOT available in YouTube Studio. The app offers trending analysis, keyword research, competitor analysis, SEO optimization, and more - all powered by the YouTube Data API v3.

**Key Technologies:**
- Next.js 14 (App Router)
- TypeScript (compiled to ES5)
- Tailwind CSS + Custom animations
- Recharts for data visualization
- YouTube Data API v3

## Development Commands

```bash
# Development
npm run dev          # Start dev server on http://localhost:3000

# Production
npm run build        # Build for production
npm run start        # Start production server

# Code Quality
npm run lint         # Run ESLint
```

## Architecture & Code Structure

### API Layer Architecture

The app uses a **dual API approach** for YouTube Data API calls:

1. **API Route Proxy** (`app/api/youtube/route.ts`):
   - Next.js API route that proxies requests to YouTube API
   - Keeps API key server-side in production
   - Handles all YouTube API endpoints dynamically via query params

2. **Client Library** (`lib/youtube.ts`):
   - Centralized YouTube API functions
   - **Automatic fallback**: Tries API route first, falls back to direct API calls
   - Contains all TypeScript interfaces for API responses
   - Utility functions: `formatDuration()`, `formatNumber()`, `calculateEngagementRate()`, `extractIdFromUrl()`

**Key API Functions:**
- `getChannelStats()` - Channel information and statistics
- `getVideoStats()` - Video metrics and metadata
- `getTrendingVideos()` - Trending videos by region
- `searchYouTube()` - Search videos/channels
- `searchVideosWithStats()` - Search with detailed statistics (two-step API call)
- `getChannelIdByHandle()` - Convert @handle to channel ID

### Component Architecture

**Main Layout:**
- `app/page.tsx` - Homepage with tab-based navigation
- 8 feature tabs: Trending, Video Search, Keyword Explorer, Competitor, SEO Studio, Best Time, A/B Test, Tags

**Feature Components** (`components/`):
All components follow the same pattern:
- Self-contained with their own state management
- Direct API calls via `lib/youtube.ts`
- Loading states with skeleton loaders
- Error handling with user-friendly messages
- Responsive design with Tailwind CSS

**Component List:**
- `TrendingVideos.tsx` - Multi-region trending analysis with sorting
- `KeywordAnalysis.tsx` - Video search by keyword
- `KeywordExplorer.tsx` - Advanced keyword metrics and related keywords
- `CompetitorAnalysis.tsx` - Channel comparison and analysis
- `TagGenerator.tsx` - Tag suggestions and optimization
- `SEOStudio.tsx` - SEO analysis and recommendations
- `BestTimeToPost.tsx` - Publishing time optimization
- `ABTesting.tsx` - Title/thumbnail A/B test simulator

### TypeScript Configuration

**IMPORTANT:** The project compiles to ES5 (`tsconfig.json` target: "es5"):
- Use ES5-compatible regex (no `u` flag)
- Example: Use `[\\s\\S]` instead of dotall mode for multiline matching
- Avoid modern JavaScript features not supported in ES5

### Styling System

**Global Styles** (`app/globals.css`):
- Custom animations: `fade-in`, `slide-in`, `card-hover`
- Dark gradient theme: purple-pink gradients
- Glass morphism effects
- Custom scrollbar styling

**Tailwind Pattern:**
- Consistent card styling: `bg-black/20 backdrop-blur-sm rounded-xl border border-white/10`
- Gradient buttons: `bg-gradient-to-r from-red-500 to-pink-500`
- Responsive grid layouts with mobile-first approach

### Environment Variables

Required in `.env.local`:
```
NEXT_PUBLIC_YOUTUBE_API_KEY=your_api_key_here
```

**Note:** There are hardcoded API keys in `lib/youtube.ts` and `app/api/youtube/route.ts` for fallback. In production, ensure `.env.local` is properly configured.

## Common Development Patterns

### Adding a New Feature Component

1. Create component in `components/` directory
2. Import YouTube API functions from `@/lib/youtube`
3. Use existing component patterns for consistency
4. Add tab navigation in `app/page.tsx`
5. Follow the existing UI pattern (glass cards, loading states, error handling)

### Working with YouTube API

- Always handle null returns from API functions
- Use the provided TypeScript interfaces from `lib/youtube.ts`
- For search + stats, use `searchVideosWithStats()` (more efficient than separate calls)
- Handle rate limiting gracefully with user feedback

### Styling New Components

- Use existing Tailwind classes from other components
- Follow the dark purple-pink gradient theme
- Include hover animations on interactive elements
- Ensure mobile responsiveness (test at breakpoints: sm, md, lg)

## Recent Development Context

Recent commits focused on:
- Fixing TypeScript errors for ES5 compatibility
- Adding exclusive features similar to TubeBuddy
- Improving trending videos and keyword search
- Removing redundant features to focus on exclusive tools
- Adding API route proxy for secure API key handling

## Deployment

The app is configured for Vercel deployment:
- Uses Next.js 14 App Router (Vercel-optimized)
- Image optimization configured for YouTube domains
- Environment variables must be set in Vercel dashboard
- See `DEPLOY.md`, `DEPLOY_VERCEL_MANUAL.md` for deployment guides

## Important Notes

- All components are client-side (`'use client'`) for interactivity
- Path aliases use `@/` for imports (maps to project root)
- YouTube API quota limits apply (10,000 units/day default)
- App focuses on features NOT available in YouTube Studio
- UI emphasizes "100% FREE" and "Exclusive Tools" branding
