# Bartr

Bartr is an on-demand local services and artisan marketplace web application to find, chat with, and hire trusted nearby repairers, mechanics, and beauty professionals in Lagos, Nigeria.

## Features

- **Hyper-Local Map & Discovery**: Interactive Lagos (Ikeja) map with live geolocation beacon, nearby artisan pins, category filters, and real-time vendor selection.
- **AI Voice Assistant (3.8 Live)**: Hands-free voice commands powered by Gemini and speech recognition. Supports continuous conversation, Google Maps grounding, audio visualizer, and autonomous action execution (booking, searching, map navigation, promo application).
- **Instant Request Flow**: Plain-language service intake ("What do you need?") with simulated or live voice input, intelligent parsing into categories and urgency tags, and fair-price market benchmarks.
- **Artisan Ranking & Dispatch**: Real-time artisan matching, verified customer reviews, transparent pricing, and instant dispatch request.
- **Live Job Tracking**: Live courier tracking with animated transit polyline and estimated arrival countdown.
- **In-App Messaging & Safety**: In-app vendor messaging thread with automated quick responses, verified badges, and safety hotline integration.
- **Account & Preferences**: Past requests history grouped by month, saved favorite artisans, promo code management, referral program, and comprehensive help center with FAQs.

## Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS, Leaflet, Lucide Icons
- **Backend & AI**: Node.js, Express, `@google/genai` (Gemini 2.5/3.8 Flash)
- **Dev Server**: Vite with Express middleware integration on port 3000

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```
