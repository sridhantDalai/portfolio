# React Portfolio

Frontend-only portfolio rebuilt from the original Django site using React 18, Vite, and Tailwind CSS.

## Tech Stack

- React 18
- Vite
- Tailwind CSS
- Plain JavaScript

## Project Structure

```text
src/
├── components/
├── sections/
├── data/
│   └── portfolio.json
├── assets/
├── hooks/
├── pages/
├── App.jsx
└── main.jsx
```

## Setup

```bash
npm install
npm run dev
npm run build
```

## Content

All portfolio content lives in `src/data/portfolio.json`, including:

- Metadata and SEO copy
- Hero text
- About content
- Projects
- Skills
- Process steps
- Contact details
- Social links

## Deployment

The app is ready for static hosting on:

- GitHub Pages
- Netlify
- Vercel

Because the build uses relative asset paths, it works from subpaths as well as domain roots.

## Migration Notes

- Removed Django, SQLite, Python, admin, models, views, migrations, and template rendering.
- Recreated the original layout as a React component tree.
- Kept the theme toggle, section animations, and sticky sidebar behavior.
- Preserved the original metadata, social links, and visible copy from the live database.

## Validation

- `npm run build` passes
- Responsive layout preserved
- Dark/light mode preserved
- Contact form works without a backend by opening the user's email client
