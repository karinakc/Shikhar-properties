# Shikhar Properties

Run `npm install`, then `npm run dev`. Preview at http://localhost:3000.
Run `npm run build` to generate optimized assets and static output in `dist`.

Configure `buyerEndpoint` and `sellerEndpoint` in `src/config.js` with HTTPS form service endpoints accepting multipart form data, then rebuild. The seller endpoint must support file attachments. No successful submission is shown unless the endpoint returns a successful HTTP response. With no endpoint set, the site directs visitors to email the agency.

The phone number intentionally remains a placeholder. Replace it once confirmed.
