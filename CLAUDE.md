# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` - Start development server at http://localhost:3000
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Architecture

This is a Next.js 16 project using the App Router pattern with TypeScript and Tailwind CSS 4.

**Key technologies:**
- Next.js 16 with App Router (all routes in `app/` directory)
- React 19
- TypeScript with strict mode
- Tailwind CSS 4 (uses `@import "tailwindcss"` syntax, not v3's `@tailwind` directives)

**Path aliases:** `@/*` maps to the project root (configured in tsconfig.json)

**Styling:** CSS variables for theming are defined in `app/globals.css` with automatic dark mode support via `prefers-color-scheme`.
