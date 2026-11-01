# Security Policy & Architecture

## Security Guarantee & Principles

Occasio AI is architected with strict enterprise security practices:

### 1. Zero Credential Exposure
- The `GEMINI_API_KEY` is exclusively consumed within `server.ts` on the Node.js backend runtime.
- No client-side bundle or browser environment variable (`VITE_...`) contains any secret keys.
- Network requests from the browser communicate exclusively with internal `/api/*` endpoints.

### 2. HTTP Security & Helmet Hardening
- Express server routes are wrapped with `helmet` middleware.
- Cross-Origin Resource Policies (`cross-origin`) are enforced.
- Prevents MIME-type sniffing, clickjacking, and unauthorized resource embedding.

### 3. Input Validation & Bounds Checking
- All `/api/ai/*` endpoints validate and clamp numeric and string parameters.
- Guest counts are bounded between 5 and 5,000.
- Budgets are clamped between $500 and $10,000,000.
- Text inputs are trimmed and bounded to prevent buffer or token overflow attacks.
- JSON body size is limited to `1mb`.

### 4. Resilient 3.5s Timeout Failover Pattern
- All upstream AI requests are wrapped in a 3.5s timeout promise race.
- Guarantees that neither denial-of-service, third-party network outages, nor rate limits can lock up the server or cause client crashes.
