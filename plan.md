# Verify Mail API – Project Plan

## 1. Introduction & Problem Statement
Disposable/temporary email addresses are increasingly used for sign‑ups, spam, and fraudulent activity. Many services need a quick way to validate whether a given email address belongs to a disposable‑mail provider without having to maintain a large and constantly‑updated list.

**Goal:** Build a lightweight, public API that receives an email address and returns a verdict (disposable / non‑disposable) together with optional metadata (mail provider, domain reputation, etc.).

## 2. High‑Level Architecture
- **API layer** — Serverless function (Vercel Edge Functions or Cloudflare Workers) exposing a REST endpoint.
- **Data store** — A key/value store or small relational DB containing a curated list of disposable domains. Updated nightly via a script pulling from public lists (e.g., `disposable-email-domains`, `mailcheck`).
- **Optional MX lookup** — For advanced checks, query DNS MX records to see if the domain resolves to a real mail server.
- **Caching** — In‑memory (edge) cache for recent look‑ups to reduce latency and cost.

```
Client → HTTP POST /check-email → Edge Function → KV lookup → (optional) MX lookup → JSON response
```

## 3. Tech Stack
- **Runtime:** Node.js 20 with TypeScript (strict mode).
- **Hosting:** Vercel (Edge Functions) *or* Cloudflare Workers (choose later based on pricing & latency).
- **Database / KV:** Vercel KV (or Cloudflare KV) for the disposable‑domain list.
- **CI/CD:** GitHub Actions — lint, type‑check, unit tests, deployment on push to `main`.
- **Testing:** Jest + supertest for API contract tests.
- **Documentation:** OpenAPI 3 specification generated from the TypeScript types, hosted via Swagger UI.

## 4. API Contract Outline (OpenAPI snippets)
- **Endpoint:** `POST /v1/check`
- **Request body:**
  ```json
  { "email": "string" }
  ```
- **Response (200):**
  ```json
  {
    "email": "string",
    "isDisposable": true|false,
    "domain": "string",
    "reason": "disposable|non-disposable|mx-failure",
    "cached": true|false
  }
  ```
- **Error codes:**
  - `400` — Invalid email format.
  - `422` — Missing `email` field.
  - `429` — Rate limit exceeded.
  - `500` — Internal server error.

## 5. Development Milestones
| Milestone | Description | Estimated effort |
|---|---|---|
| **MVP** | Scaffold repo, implement endpoint, static domain list, basic tests | 2 weeks |
| **CI/CD & linting** | GitHub Actions pipeline, ESLint/Prettier, TypeScript strictness | 3 days |
| **Automated list updates** | Nightly script pulling latest disposable domains into KV | 2 days |
| **MX lookup integration** | Optional DNS MX validation for non‑disposable detection | 4 days |
| **Rate limiting & auth** | API key handling, per‑IP limits via Vercel edge middleware | 3 days |
| **OpenAPI docs & Swagger UI** | Auto‑generated spec, hosted docs page | 2 days |
| **Load testing & scaling** | Verify latency < 100 ms, cost analysis | 2 days |
| **Beta release & feedback** | Public sandbox, collect usage metrics | 1 week |

## 6. Deployment & Hosting Plan
1. **Repository** — GitHub (public).
2. **CI** — GitHub Actions triggers on push/PR.
3. **Deploy** — Vercel CLI (`vercel deploy --prod`) on successful CI run.
4. **Domain** — `api.verify-mail.io` (CNAME to Vercel).
5. **Monitoring** — Vercel analytics + custom health‑check endpoint.

## 7. Monetisation & Pricing Model
| Tier | Free quota | Paid quota | Price | Features |
|---|---|---|---|---|
| **Free** | 100 checks/day | — | — | Basic endpoint, no auth, rate‑limited |
| **Starter** | 10k checks/month | up to 100k | $9 /month | API keys, higher rate limit, MX lookup |
| **Enterprise** | Custom | Custom | Custom | SLA, dedicated instance, webhook callbacks, bulk pricing |

Revenue collected via Stripe integration in the serverless function.

## 8. Future Enhancements
- Bulk check endpoint (`POST /v1/check-batch`).
- Webhook notification for bulk results.
- Reputation scoring (spam‑trap, catch‑all detection).
- Community‑contributed domain list submission portal.
- GraphQL wrapper for flexible queries.

---
*Prepared by the Hermes assistant. Adjust sections or add details as needed.*
