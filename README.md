# User Onboarding Experience

A guided onboarding flow for a music subscription product, built with **React 18**, **TypeScript**, **Redux Toolkit**, and **Vite**.  
Users create a profile, pick favourite songs, enter payment details, and land on a polished home dashboard. Onboarding state persists in `localStorage` so they can resume or restart whenever they like.

## Quick Start

```bash
# install dependencies
npm install

# run the development server (http://localhost:5173)
npm run dev

# build for production
npm run build

# preview the production build locally
npm run preview
```

## Core Features

- **Multi-step onboarding:** Profile, favourite songs, payment details, and success screens managed with guarded routes.
- **Song selection:** Users can add up to 10 custom songs; at least one input is always available to keep the flow simple.
- **Payment capture:** Card details feed into a stylised virtual card on the post-onboarding home page.
- **Home dashboard:** Summarises profile info, saved songs, and billing status inside a single viewport.
- **Account switching:** The “Add another account” action clears persisted data, resets onboarding/auth state, and sends the user back to the login screen for a fresh start.

## Project Structure

- `src/app/` – store configuration and typed hooks for Redux Toolkit.
- `src/features/onboarding/` – slice logic plus individual step pages.
- `src/features/home/HomePage.tsx` – dashboard rendered after onboarding completes.
- `src/features/auth/` – mock auth flow and logout helpers.
- `src/components/ui/` – shared UI primitives (powered by Tailwind CSS).

## Development Notes

- **State persistence:** Onboarding data is cached in `localStorage`. Use the “Add another account” button or clear storage manually to restart from scratch.
- **Styling:** Tailwind utility classes are used throughout; adjust in `src/index.css` or extend with custom components.
- **Linting:** Run `npm run lint` to apply ESLint checks across the TypeScript codebase.

## Next Steps

- Connect the onboarding flow to a real backend or API.
- Extend validation (e.g., unique song picks or payment verification).
- Add automated tests for the onboarding guard logic and slice reducers.

Enjoy building on top of this onboarding experience!
