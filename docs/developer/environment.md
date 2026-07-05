# Environment Configuration

The Sprinter IT Hub frontend talks to a Google Apps Script Web App for
Phase 1.5 backend connectivity. The endpoint URL is provided at build time
through an environment variable so it can be rotated or swapped per
environment without changing application code.

## The variable

| Name | Scope | Purpose |
| --- | --- | --- |
| `VITE_GOOGLE_APPS_SCRIPT_URL` | Client (Vite) | Deployed Apps Script Web App endpoint that receives POST requests from the frontend. |

The `VITE_` prefix is required — Vite only exposes variables starting with
`VITE_` to browser code via `import.meta.env`.

## Deploying the Apps Script Web App

1. Open the Apps Script project in your Google account.
2. Click **Deploy → New deployment**.
3. Select type **Web app**.
4. Set:
   - **Execute as:** Me
   - **Who has access:** Anyone with the link (or restrict as required)
5. Click **Deploy** and copy the generated `/exec` URL.
6. Save the URL somewhere secure — anyone with this URL can call the
   endpoint, so treat it as a shared credential.

Any time the script is redeployed under a new version, the URL may change.
Update `.env.local` and restart the dev server after each redeploy.

## Where to place the URL

1. Copy the example file to a local override:

   ```bash
   cp .env.example .env.local
   ```

2. Paste the deployed URL:

   ```env
   VITE_GOOGLE_APPS_SCRIPT_URL=https://script.google.com/macros/s/xxxxxxxxxxxxxxxxxxxxxxxx/exec
   ```

3. Restart the dev server so Vite picks up the new value.

`.env.local` is git-ignored via the `*.local` rule in `.gitignore` and must
never be committed.

## How the frontend talks to Apps Script

All backend traffic goes through `src/services/googleAppsScript.ts`. No
component fetches the endpoint directly.

- Each request is a `POST` with `Content-Type: application/json` and
  `Accept: application/json`.
- The request body always has the shape `{ action, payload }` so a single
  Apps Script `doPost` handler can route by action name.
- Every service function returns a discriminated `ApiResult<T>`:
  - `{ success: true, data }` on success.
  - `{ success: false, message, error? }` on missing configuration,
    non-2xx responses, or network failures.
- If `VITE_GOOGLE_APPS_SCRIPT_URL` is undefined the service short-circuits
  and returns `{ success: false, message: "Google Apps Script endpoint has
  not been configured." }` — the UI never crashes.

Supported actions today:

| Function | Action string |
| --- | --- |
| `submitDocumentationRequest(data)` | `submitDocumentationRequest` |
| `getDocumentationRequests()` | `getDocumentationRequests` |
| `updateDocumentationRequestStatus(id, status)` | `updateDocumentationRequestStatus` |
| `submitArticleFeedback(data)` | `submitArticleFeedback` |

Add new actions by extending the `AppsScriptAction` union and exporting a
new wrapper function — no other files need to change.

## Security notes

- Never commit `.env.local` — the `*.local` rule already excludes it.
- Never hardcode the endpoint URL in application code or documentation.
- Treat the Web App URL as sensitive; rotate the deployment if it leaks.
- Because the variable is `VITE_`-prefixed it ships to the browser bundle.
  Do not put private API keys or service-account credentials in this
  variable — the Apps Script itself should enforce authorization.
