# O!clok Services Website (Vue 3 + Vite)

This project is the front‑end for O!clok Services: a multi‑page site that combines a smart‑commerce store, technicians directory, discovery listings, and a creative “Cyber Studio” workspace. It’s built with Vue 3 and Vite and uses local JSON data plus localStorage for lightweight persistence.

**Key Features**
- Home page with About/Mission/Vision and featured services.
- Store with product listings, product detail, cart, and checkout flow.
- Technicians directory with profiles and ratings.
- Discover page for places and Delibois errand requests.
- Robots knowledge hub and device highlights.
- Cyber Studio tools: writing canvas, mockup studio, and gallery.
- Floating chatbot for product/services/technician guidance.

**Main Routes**
- `/` Home
- `/products` Store
- `/products/:id` Product detail
- `/technicians` Technicians listing
- `/technicians/:slug` Technician detail
- `/discover` Discover listings and Delibois requests
- `/discover/:slug` Discover detail
- `/robots` Robot assistants hub
- `/cyber/creator` Canvas workspace
- `/cyber/writer` AI prompt studio
- `/cyber/mockups` Mockup studio
- `/cyber/gallery` Mockup gallery
- `/checkout` Cart checkout

**Data Sources**
- `src/data/products.json` Store catalog data
- `src/data/technicians.json` Technician profiles
- `src/data/places.json` Discover listings
- `src/data/services.json` Service highlights

**Local Persistence**
- Cart, Cyber mockups, and Delibois forms use `localStorage` via `src/lib/localStore.js` and `src/services/*.js`.

**Getting Started**
1. Install dependencies: `npm install`
2. Start dev server: `npm run dev`
3. Build for production: `npm run build`
4. Preview build: `npm run preview`

**Project Structure**
- `src/pages` Page‑level routes
- `src/components` Shared UI components
- `src/layouts` Cyber Studio layout and helpers
- `public/images` and `src/assets/images` Image assets

If you want a backend integration layer or API wiring, we can add it and document env variables here.
