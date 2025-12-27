# Notion Faces - Next.js Web App

A clean, minimal Next.js web application for browsing Notion face icons.

## Design

- **Background**: `hsl(0 0% 10%)` - Very dark gray (#1A1A1A)
- **Fonts**: 
  - Inter (primary) - Body text, UI elements
  - Newsreader (secondary) - Accent text, section headers
- **Accent Color**: Yellow (#yellow-500) for hover states
- **Typography**: Minimal, typography-driven design

## Setup

1. **Install dependencies**:
   ```bash
   cd web
   npm install
   ```

2. **Configure API URL**:
   Create `.env.local`:
   ```bash
   API_URL=http://localhost:5001
   ```
   (Change to your deployed API URL when ready)

3. **Start development server**:
   ```bash
   npm run dev
   ```

4. **Make sure Flask API is running**:
   ```bash
   cd ../api
   python server.py
   ```

Visit http://localhost:3000

## Features

- Clean, minimal design
- Real-time icon generation
- Responsive grid layout
- Hover effects with yellow accent
- Typography-focused UI

## Deployment

The Next.js app can be deployed to:
- **Vercel** (recommended for Next.js)
- **Netlify**
- **Railway**
- Any platform supporting Next.js

Make sure to set the `API_URL` environment variable to point to your Flask API.
