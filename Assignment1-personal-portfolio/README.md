# Personal Portfolio — Assignment 1

React Environment Setup and Personal Portfolio, built with Vite + React (JSX only, external CSS).

## Components (7 total — minimum 6 required)

1. `Navbar` — sticky nav bar with a mobile hamburger toggle (uses `useState`)
2. `Header` — hero section (acts as the page header)
3. `AboutMe` — bio + photo placeholder
4. `Education` — timeline of degrees/CGPA
5. `Skills` — categorized skill bars
6. `Contact` — contact details + a controlled form (uses `useState`)
7. `Footer` — copyright + social links

All composed together in `App.jsx`.

## Design

"Field Notes" — a blueprint / engineering-notebook aesthetic: dark ink background with a
faint grid, amber corner-tick accents on cards, monospace labels for data (roll-number /
spec-sheet style), and skill bars styled like terminal loading bars.

## Run it locally

```bash
npm install
npm run dev
```

Then open the printed local URL (usually http://localhost:5173).

## Before you submit

- Swap the placeholder name (`Alex Rivera`), bio, education rows, skills, and contact details
  in each component file for your own.
- Replace the photo placeholder in `AboutMe.jsx` with an actual `<img>` tag pointing to your photo
  (put the image file in `public/` and reference it as `/your-photo.jpg`).
- Update the social links in `Contact.jsx` and `Footer.jsx`.

## Build for production

```bash
npm run build
```
