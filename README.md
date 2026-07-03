# O!clok Website (In Development)

This repo contains the Vue 3 + Vite front-end for the O!clok website, hosted at `https://www.oclok.co.ke`.

The site is under active development and blends commerce, local service discovery, creative studio tools, and an interactive chatbot experience.

## Features
- Responsive, multi-page Vue 3 application built with Vite
- Store and product catalog with a checkout flow
- Local technician directory with profile pages
- Discover listings for places and local recommendations
- Cyber Studio workspace with writer, mockups, gallery, and prompt tools
- Floating chatbot assistant for quick guidance
- SEO support via `public/robots.txt` and `public/sitemap.xml`

## Live Host
- `https://www.oclok.co.ke`

## Main Routes
- `/` — Home
- `/media` — Media
- `/technicians` — Technicians
- `/technicians/kabila-mboya` — Example technician profile
- `/technicians/hellen` — Example technician profile
- `/products` — Store
- `/products/:id` — Product detail page
- `/cyber` — Cyber Studio home
- `/cyber/writer` — Writer studio
- `/cyber/mockups` — Mockup studio
- `/cyber/gallery` — Gallery
- `/cyber/prompts` — Prompt tools
- `/discover` — Discover listings
- `/discover/:slug` — Discover detail
- `/robots` — Robots hub
- `/checkout` — Checkout page
- `/store/user/checkout` — Alternate checkout route
- `/search` — Search results

## SEO & Indexing
- `public/robots.txt` — Robots rules for crawlers
- `public/sitemap.xml` — Sitemap with top pages and sample dynamic URLs
- `index.html` includes meta description, Open Graph, and Twitter card tags

## Chatbot Data
- `src/data/chatbot.json` — chatbot knowledge base and quick prompt configuration
- `src/components/FloatingChatbot.vue` — chatbot UI and response logic

## Data Sources
- `src/data/products.json` — product catalog
- `src/data/technicians.json` — technician profiles
- `src/data/places.json` — discovery listings
- `src/data/services.json` — service categories

## Local Persistence
- `src/lib/localStore.js` handles client-side storage
- `src/services/*.js` persist cart, mockups, and form state

## Project Structure
- `src/pages` — route pages
- `src/components` — shared components
- `src/layouts` — layout helpers and Cyber Studio views
- `src/assets` — application styling and images
- `public` — static files, SEO assets, and JSON data

## Development
```bash
npm install
npm run dev
```

## Build
```bash
npm run build
npm run preview
```

## Contributing
1. Create a branch for your changes:
   ```bash
git checkout -b feature/your-change
```
2. Make your edits and add files:
   ```bash
git add .
```
3. Commit with a concise message:
   ```bash
git commit -m "Describe the change"
```
4. Push to GitHub:
   ```bash
git push origin feature/your-change
```

If you are ready to merge to `main`, push directly to `main` or create a pull request.

## Notes
- The repo uses Vue Router for nested Cyber Studio routes
- The project is currently configured for client-side rendering with Vite
- Update the sitemap and robots URLs if the production domain changes

