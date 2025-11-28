# Angry Birds Clone

## Quickstart (command line)
1. Clone:
   ```bash
   git clone https://github.com/your-org/angrybird-clone.git
   cd angrybird-clone
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start backend API (port 3000):
   ```bash
   node backend/server.js
   # or
   npm run backend
   ```
4. Start frontend (Vite dev server on 5173):
   ```bash
   npm run dev
   ```
5. Open the printed URL (e.g., http://localhost:5173) to play. Keep the backend running for login, billing, achievements, and admin features.

## Alternative: static serving
If you just want to inspect the build without Vite, run the backend as above and serve `index.html` with any static server such as:
```bash
npx http-server .
```

## Included features
- Phaser 3 single-player physics with slingshot, TNT, AI pigs, scoring, and multiple bird tiers.
- Map editor (`/editor/map_editor.html`) for JSON level authoring.
- Admin dashboard (`/admin/index.html`) for bans, TON payouts, and inventory grants.
- Express backend for auth (Telegram/basic), billing with fraud checks, achievements, asset sync, and anti-cheat validation.
