
# Verify Mail API

A lightweight serverless API that determines whether an email address belongs to a disposable/temporary email provider.

## Overview
Provides a single endpoint (`POST /v1/check`) that returns:
- `isDisposable` (true/false)
- the email’s domain
- a reason (`disposable`, `non-disposable`, `mx-failure`)
- a flag indicating whether the result was served from cache

The service is built with **Node.js 20**, **TypeScript**, and **Vercel Edge Functions** (or Cloudflare Workers).

## Quick Start
```bash
# Clone (if you haven’t already)
git clone https://github.com/Lordkro/verify-mail-api.git
cd verify-mail-api

# Install dependencies
npm install

# Run locally with Vercel dev (requires Vercel CLI)
npm run dev
# → http://localhost:3000/api/check
```

## API Usage
**Endpoint**: `POST /v1/check`

**Request body**
```json
{ "email": "user@example.com" }
```

**Successful response (200)**
```json
{
  "email": "user@example.com",
  "domain": "example.com",
  "isDisposable": false,
  "reason": "non-disposable",
  "cached": true
}
```

**Error responses**
- `400` – Invalid email format or missing body
- `405` – Method not allowed (only POST)
- `429` – Rate limit exceeded (to be added)
- `500` – Internal server error

## Development
### Running tests
```bash
npm test          # runs Jest + ts‑jest
```

### Lint / format
```bash
npm run lint      # ESLint (configured for .ts/.js files)
```

### Building
```bash
npm run build     # compiles TypeScript to ./dist
```

### Deploying
```bash
# Make sure you’re logged in to Vercel (`vercel login`)
vercel --prod     # deploys the current branch
```

## Project Structure
```
verify-mail-api/
├─ src/
│  ├─ api/check.ts        # Vercel edge function handler
│  ├─ utils/
│  │  ├─ disposableList.ts   # loads disposable domain list from JSON
│  │  └─ mxLookup.ts         # optional DNS MX lookup
│  └─ __tests__/check.test.ts # Jest test suite
├─ data/
│  └─ disposable_domains.json  # sample list of disposable domains
├─ plan.md                # full project roadmap (already in repo)
├─ package.json, tsconfig.json, jest.config.js
└─ README.md (this file)
```

## Contributing
1. Fork the repo.
2. Create a feature branch (`git checkout -b feature/xyz`).
3. Make changes and ensure tests pass (`npm test`).
4. Open a pull request.

## License
MIT – feel free to use, modify, and distribute.

---
*Prepared by the Hermes assistant. Adjust as needed.*
