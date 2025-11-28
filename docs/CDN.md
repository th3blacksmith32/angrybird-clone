# CDN Deployment
Run `node build/build.js` to bundle and hash assets into `dist`. Then run `node build/deploy_cdn.js` to simulate uploading files to a CDN with cache-busting hashes. For GitHub Pages or Netlify, deploy the `dist` directory and set Cache-Control headers to long-lived for hashed files.
