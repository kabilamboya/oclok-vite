---
name: oclok-marketplace
description: "Manage the O!clok marketplace in this Vue/Vite project. Use when adding or editing educational videos, stationery, tutor services, smart electronics, branded clothing, products, categories, product details, cart behavior, or store UI."
argument-hint: "Describe the marketplace product, category, or store workflow to update"
---

# O!clok Marketplace

## Purpose

Keep the O!clok store coherent as it grows from a smart-electronics catalog into a marketplace for learning, services, stationery, electronics, and branded apparel.

## Store Surfaces

- Store listing: `src/pages/Store.vue`
- Product detail: `src/pages/ProductDetail.vue`
- Product catalog: `src/data/products.json`
- Reusable product cards: `src/components/CardItem.vue` and `src/components/CardList.vue`
- Cart behavior: `src/services/cart.service.js`
- Checkout: `src/pages/CheckOut.vue`
- Product routes: `src/router/index.js`

## Product Categories

Use clear, customer-facing categories. Current marketplace groups include:

- `Learning Videos` for courses, tutorials, and other digital learning content
- `Stationery` for notebooks, study kits, writing tools, and project supplies
- `Tutors` for bookable educational or technical sessions
- Existing smart-electronics categories such as `Smart Home`, `Sounds`, `Accessories`, `Watches`, `Safety`, `Sensors`, and `Security`
- `Clothing` for hoodies, caps, t-shirts, and branded items

Do not create a new category when an existing category accurately describes the item.

## Product Data Contract

Every product in `src/data/products.json` should include:

- A unique numeric `id` that does not duplicate another product ID
- `name`, `price`, `description`, `image`, and `category`
- An `images` array when more than one product image is available
- `brand`, `model`, `weight`, `dimensions`, and `warranty`
- `specs`, `howToUse`, `dos`, and `donts` arrays

Use numeric prices in Kenyan shillings. Keep descriptions specific about what the customer receives. For digital products, describe access and lesson format. For tutors, describe session length and delivery method. For clothing, include sizes, material, care, and exchange information.

## Adding A Product

1. Inspect the existing catalog and choose a new, unique numeric ID.
2. Add the product to `src/data/products.json` using the existing field shape.
3. Use an image that exists under `public/images/`, or add a real asset before referencing it.
4. Confirm the item works with the existing product listing, detail route, cart, and checkout without special-case code.
5. Add special UI logic only when the product type genuinely needs behavior that generic products cannot provide.
6. For clothing, expose size selection requirements clearly before payment. For tutor services, make scheduling or contact requirements clear. For digital content, do not imply instant access unless delivery is implemented.

## Store UI Guidelines

- Preserve the existing Vue 3 Composition API patterns and reusable card components.
- Keep category filtering and search working for every new category.
- Keep product cards scannable: name, category, price, image, and concise description.
- Use accessible labels for search, category controls, cart actions, and product images.
- Do not break `/products/:id`, cart persistence, or checkout navigation.
- Avoid hardcoding a category list in multiple places when it can be derived from product data.

## Validation

Run these commands after marketplace changes:

```powershell
npm run build
git diff --check
```

For catalog-only changes, also verify that the JSON parses and that all product IDs are unique. For UI changes, manually check the store, one new product detail page, category filtering, add-to-cart, and checkout navigation.

## Boundaries

This skill guides the storefront and catalog. Do not invent payment processing, digital-content access control, tutor availability, stock management, or delivery promises without an implementation or an explicit product requirement.
