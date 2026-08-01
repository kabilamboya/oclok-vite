# O!clok Website

This repository contains the Vue 3 + Vite front-end for the O!clok website. The application combines e-commerce, technician discovery, media, local recommendations, creative studio tools, chatbot support, and an admin business cockpit.

## Features
- Responsive, multi-page Vue 3 application built with Vite
- Store and product catalog with a checkout flow
- Local technician directory with one shared profile layout for all users
- Technician profile overrides and edit permissions in the admin dashboard
- CV printing with name-based filenames such as `kabila-mboya-cv.pdf`
- Admin business dashboard with metrics, team access, user search, and status controls
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
- `/technicians/:slug` — Shared technician profile route for all other technicians
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
- `/account` — Account creation page
- `/admin` — Admin business dashboard and Team Access user management

## Admin Dashboard

Open the admin dashboard at:

```text
http://localhost:5173/admin
```

The admin dashboard includes:

- Business overview metrics and shop performance
- Revenue category summary and recent activity
- Team Access user directory
- Search and status filters for registered users
- Activate or suspend technician users
- Grant or block profile-detail editing permission
- Edit technician name, specialty, bio, email, phone, and location
- A `Back to Website` link in the admin sidebar

All technician records in `src/data/technicians.json` are treated as registered users. Admin user status, permissions, and profile overrides are currently stored in browser local storage. There is no backend authentication or server-side authorization yet, so this dashboard is suitable for local development and prototyping rather than production access control.

## Technician Profiles

All technician detail routes use the shared Kabila-style layout in `src/pages/TechnicianDetails.vue`. The shared page provides profile contact actions, project and capability sections, responsive cards, profile links, location information, and a Download CV action.

CV print rules exclude the profile image, footer, navigation, and interactive controls. Files use the normalized technician name plus the `-cv` suffix, such as `kabila-mboya-cv.pdf`.

Profile changes saved from Team Access are applied through `src/services/userProfiles.service.js` and appear on the public technician detail page.

## Store Cart

The cart is available as a floating control on the Store page rather than in the global navbar. Cart state is persisted through `src/services/cart.service.js` and supports quantity changes, removal, and checkout navigation.

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
- `src/services/cart.service.js` persists cart contents
- `src/services/userProfiles.service.js` persists technician profile overrides
- Admin users, permissions, statuses, and profile edits use browser local storage

## Project Structure
- `src/pages` — route pages
- `src/pages/AdminDashboard.vue` — admin business cockpit and user management
- `src/pages/TechnicianDetails.vue` — shared technician profile layout
- `src/components` — shared components
- `src/layouts` — layout helpers and Cyber Studio views
- `src/assets` — application styling and images
- `public` — static files, SEO assets, and JSON data

## Development
```bash
npm install
npm run dev
```

The Vite development server normally runs at `http://localhost:5173`.

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
- Vue Router handles public, technician, admin, checkout, and nested Cyber Studio routes.
- The public navbar includes Profile and Admin Dashboard navigation.
- The Store page owns the floating cart interaction.
- Technician profile CV downloads use the normalized technician name plus the `-cv` suffix.
- Admin authentication and server-side permissions should be added before production deployment.
- Update the sitemap and robots URLs if the production domain changes.

