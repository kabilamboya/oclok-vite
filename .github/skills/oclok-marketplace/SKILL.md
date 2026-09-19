---
name: oclok-marketplace
description: "Guide updates to the O!clok Vue/Vite app, including the storefront, technician directory, admin dashboard, creative studio, and other customer-facing features. Use when adding products, editing route data, updating cart/checkout behavior, or changing shared UI patterns."
argument-hint: "Describe the O!clok feature, page, route, or data source to update"
---

# O!clok project guide

## Purpose

This repository is a multi-page Vue 3 + Vite front-end for O!clok, not a single product catalog. It combines e-commerce, technician discovery, media, local recommendations, creative studio tools, chatbot support, and an admin dashboard.

## Current product and feature surfaces

- Store listing and product filtering: `src/pages/Store.vue`
- Product detail page: `src/pages/ProductDetail.vue`
- Product data: `src/data/products.json`
- Reusable product cards: `src/components/CardItem.vue` and `src/components/CardList.vue`
- Cart state and persistence: `src/services/cart.service.js`
- Checkout flow: `src/pages/CheckOut.vue`
- Route registration: `src/router/index.js`
- Technician profiles: `src/pages/Technicians.vue`, `src/pages/TechnicianDetails.vue`
- Admin dashboard: `src/pages/AdminDashboard.vue`
- Cyber Studio: `src/pages/Cyber.vue` and `src/pages/Creator/*`
- Shared app shell: `src/App.vue`
- Static data and SEO assets: `public/`

## Active route map

The current router includes these live sections:

- `/` — Home
- `/media` — Media
- `/technicians` — Technicians
- `/technicians/kabila-mboya` — Example technician profile
- `/technicians/hellen` — Example technician profile
- `/technicians/:slug` — Shared technician profile route
- `/products` — Store
- `/products/:id` — Product detail
- `/signin`, `/signup`, `/account` — auth/account flows
- `/admin` — admin dashboard
- `/cyber` with nested pages for writer, mockups, gallery, and prompts
- `/discover` and `/discover/:slug` — discover listings
- `/robots` — robots hub
- `/search` — search results
- `/checkout` and `/store/user/checkout` — checkout routes
- `/:pathMatch(.*)*` — not found route

Use these routes and their naming conventions when adding or redirecting features.

## Product data conventions

The live catalog is defined in `src/data/products.json` and is mapped to the store UI in `src/pages/Store.vue`.

Current product categories in use include:

- `Smart Home`
- `Kitchen`
- `Sensors`
- `Security`
- `Safety`
- `Outdoor`
- `Phones`
- `Watches`
- `Audio`
- `Sounds`
- `Accessories`
- `Learning Videos`
- `Stationery`
- `Tutors`
- `Clothing`
- `Footwear`
- `Bags`

Do not invent a new category when an existing category already matches the item. The store’s department filters are built around the same category names and department grouping used by the page logic.

Each product should generally include:

- unique numeric `id`
- `name`, `price`, `description`, `image`, `category`
- `images` array when additional product visuals exist
- `brand`, `model`, `weight`, `dimensions`, `warranty`
- `specs`, `howToUse`, `dos`, and `donts` arrays

Keep prices in Kenyan shillings as numeric values. Use specific language that explains what the customer receives. For learning content, tutors, or digital items, describe access method and delivery expectations honestly without implying functionality that is not implemented.

## Store and cart behavior

- Cart is managed in `src/services/cart.service.js` and is persisted in browser storage.
- The floating cart lives on the Store page rather than in the global navbar.
- Product cards support add-to-cart and view actions through the shared component system.
- Checkout navigation should continue to work for `/checkout` and `/store/user/checkout`.
- Do not add hardcoded store logic that bypasses the normal product catalog or cart service.

## Data and persistence rules

- Local persistence is handled through `src/lib/localStore.js`.
- Technician profile overrides are stored through `src/services/userProfiles.service.js`.
- Admin user status, permissions, and overrides are currently browser-local prototype state; there is no production authentication or server-side authorization in this repo.
- For user-facing work, prefer data-driven updates over hardcoded UI branches unless a feature truly needs custom logic.

## Tech and UI conventions

- This project uses Vue 3 Composition API patterns and dynamic route components.
- Reuse existing layout and card components before creating new ones.
- Keep search, category filters, and pagination working after adding or editing product data.
- Preserve accessibility labels for inputs, buttons, and cart actions.
- Keep file and import paths aligned with the current folder structure.
- Use real assets only; do not reference image files that do not exist in `public/`.

## Adding or editing content

1. Check the relevant feature area before changing it: store catalog, route definitions, data files, or admin/technician views.
2. Keep schema and naming consistent with the current data structure in `src/data/*.json`.
3. Preserve unique IDs and valid JSON when editing catalog data.
4. Reuse existing category names and department mappings instead of introducing a parallel taxonomy.
5. Confirm the change still works in the relevant page, route, filter, and cart flow.
6. Avoid promising payment, delivery, or access features that are not implemented in the front-end or backend.

## Validation

Run these checks after store or app changes:

```powershell
npm run build
git diff --check
```

For catalog-only updates, also verify the JSON parses correctly and that all product IDs are unique. For UI changes, manually check the relevant page, route, filter state, and any cart or checkout interaction that was affected.

## Boundaries

This skill covers the O!clok front-end app as it exists today. Do not assume production auth, payments, secure file delivery, or stock management exists unless the codebase implements it. The current project is a prototype/front-end demo with browser-local persistence and client-side routing.
