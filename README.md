# eCommerce Shop (DummyJSON)

Practice project built with Next.js App Router, TypeScript, Tailwind (shadcn-style components), Redux Toolkit, Axios, and the DummyJSON products API.

## Features
- Product list (`/`): live fetch with search, category dropdown, price filters, infinite scroll (limit/skip), favorites toggle, create dialog, and toasts.
- Product detail (`/product/[id]`): gallery/summary, favorite toggle, and edit/delete actions (UI completes even if API is flaky).
- Favorites (`/favorites`): Redux-powered saved items with persistence.
- Auth (mock/local): `/login` supports signup/login/logout; favorites/CRUD actions require login.
- Dark mode toggle in navbar.
- Persistence: auth, products cache, and favorites hydrate from `localStorage` for faster reloads.

## API usage
- List: `GET /products?limit&skip`
- Search: `GET /products/search?q=&limit&skip`
- Categories: `GET /products/categories`, `GET /products/category/:category?limit&skip`
- Detail: `GET /products/:id`
- Create: `POST /products/add`
- Update: `PUT /products/:id` *(DummyJSON often 404/405s; UI simulates success if needed.)*
- Delete: `DELETE /products/:id` *(Same caveat as update.)*

## Getting started
```bash
npm install
npm run dev
```
Open http://localhost:3000.

## Mock auth defaults
- Default user: `demo@example.com` / `password123`
- Signup creates local users; sessions persist via `localStorage`.
- Favorites and CRUD redirect to `/login` when unauthenticated.

## Persistence
- `localStorage`: auth user, favorites, products cache, theme.
- Products and favorites rehydrate on load; list refetches as you search/filter.

## Known limitations
- DummyJSON does not persist new products; PUT/DELETE frequently fail. The UI shows network/validation toasts and still updates locally (optimistic experience).
- Edit/delete “success” is simulated when the API rejects.
- Infinite scroll uses a bottom sentinel with `limit=10`.

## Tech stack
- Next.js 15 (App Router), TypeScript
- Tailwind CSS 4 (shadcn UI primitives)
- Redux Toolkit, react-redux
- Axios for API calls
- react-hot-toast for feedback
