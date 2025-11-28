# Angry Birds–Style Phaser Game

This project is a Phaser 3 + Matter.js single-player Angry Birds–style game with a companion Express backend (auth, billing, admin, asset sync), editor, and build/deploy tooling.

## Clone
```bash
git clone https://github.com/your-org/angrybird-clone.git
cd angrybird-clone
```

## Install
```bash
npm install
```

## Run the backend API
```bash
node backend/server.js
# or
npm run backend
```
Backend defaults to http://localhost:3000 and serves authentication, billing, admin, achievements, assets, TON simulation, and anti-cheat endpoints.

## Run the frontend
### Vite dev server (recommended)
```bash
npm run dev
```
Open the printed URL (usually http://localhost:5173) to play the game and access UI scenes, level select, shop, achievements, and settings.

### Static file serving
If you prefer a lightweight approach, serve `index.html` with any static server (e.g., `npx http-server .`). Ensure the backend is running separately for API features.

## Editor
Open `editor/map_editor.html` in a browser (or via the dev server) to drag-and-drop birds, pigs, boxes, TNT, and platforms, then export/import JSON levels.

## Admin dashboard
Navigate to `/admin/index.html` to view users, ban/unban, grant items, and manage TON payouts. Authenticate with the configured admin password/environment settings described in `docs/ADMIN_DASHBOARD.md`.

## Build for CDN
```bash
node build/build.js
node build/deploy_cdn.js
```
Artifacts are emitted to `dist/` with hashed filenames for cache busting. See `docs/CDN.md` for hosting guidance.

## Environment
Set secrets (JWT secret, admin password, HMAC secret, etc.) via environment variables as documented in `docs/README.md` and `docs/PAYMENTS.md` before running in production.

