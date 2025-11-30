# eCommerce Shop (DummyJSON)

Practice project built with Next.js App Router, TypeScript, Tailwind (shadcn-style components), Redux Toolkit, and Axios talking to the DummyJSON products API.

## Features
- Product list (`/`): live fetch from DummyJSON with search, category filtering (API-backed), infinite scroll (limit/skip), favorites toggle, create/edit/delete dialogs, and toast feedback.
- Product detail (`/product/[id]`): fetch by id, gallery/summary, favorite toggle.
- Favorites (`/favorites`): Redux-powered saved items.
- Auth (mock): `/login` sets a session flag; favorites/CRUD require login.
- Dark mode: Redux-driven theme toggle in navbar.

## API usage
- List: `GET /products?limit&skip`
- Search: `GET /products/search?q=&limit&skip`
- Categories: `GET /products/categories`, `GET /products/category/:category?limit&skip`
- Detail: `GET /products/:id`
- Create: `POST /products/add`
- Update: `PUT /products/:id` *(DummyJSON may return 404/405; handled gracefully.)*
- Delete: `DELETE /products/:id` *(Same caveat as update.)*

## Getting started
```bash
npm install
npm run dev
```
Open http://localhost:3000.

## Notes / Caveats
- DummyJSON doesn’t persist new products; PUT/DELETE often return 404/405. The UI handles this without crashing.
- Infinite scroll triggers when reaching the bottom sentinel; uses limit=10.
- Favorites are stored client-side in Redux; mock login enables these actions.

## Tech
- Next.js 15 (App Router), TypeScript
- Tailwind CSS 4 (shadcn UI primitives)
- Redux Toolkit, react-redux
- Axios for API calls
- react-hot-toast for feedback
