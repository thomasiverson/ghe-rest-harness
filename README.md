# GitHub REST API Harness

A browser-based test harness for exploring and executing GitHub REST API endpoints against GitHub Enterprise EMU (or any GitHub instance). Built for developers and admins who need to discover, test, and debug API calls without leaving the browser.

**1,107 endpoints** auto-imported from GitHub's official OpenAPI spec across 47 categories — every REST API endpoint available out of the box.

## Features

- **Three-panel workspace** — sidebar explorer, request builder, response viewer (all resizable)
- **Full API catalog** — auto-imported from GitHub's OpenAPI spec with search (`⌘K`) across all endpoints
- **Auto-populated parameters** — `{org}`, `{owner}`, `{enterprise}` fill from your environment config
- **Endpoint documentation** — summary, description, required scopes, callouts, and doc links inline
- **Dual auth** — Personal Access Token (PAT) or GitHub App (JWT + installation token)
- **Response viewer** — collapsible JSON tree, headers, raw, and **Preview** tab with clickable URLs
- **Pagination** — "Load More" button for paginated responses (parses `Link` header)
- **Rate limit monitoring** — live bar in the top nav
- **Request history** — searchable log with replay
- **Collections** — save and organize requests into reusable groups
- **Multi-environment** — switch between customers/instances without reconfiguring
- **Dark/light theme** — GitHub Primer design language, dark mode default
- **SSRF protection** — all API calls proxied through the backend, validated against configured base URL
- **Encrypted credentials** — PATs and app keys encrypted at rest in local SQLite

## Quick Start

### Prerequisites

- **Node.js** 18+ and **npm**
- A GitHub **Personal Access Token** (classic or fine-grained) with appropriate scopes
- Python build tools for `better-sqlite3` native module (usually already present)

### Install & Run

```bash
# Clone the repo
git clone https://github.com/ThomasIverson/ghe-rest-harness.git
cd ghe-rest-harness

# Install dependencies
npm install

# Import the GitHub REST API catalog (~1,100 endpoints)
npm run import-api

# Start the dev server
npm run dev
```

Open **http://localhost:3000** in your browser.

### First-Time Setup

1. Go to **Settings** (top nav) → click **+ New Environment**
2. Fill in:
   - **Name**: e.g. `My EMU`
   - **API Base URL**: `https://api.github.com` (for cloud EMU) or your GHES URL
   - **Enterprise Slug**: your enterprise slug (e.g. `tpitest`)
   - **Organization Login**: the org's URL slug — find it at `github.com/orgs/<this-value>` (not the display name)
   - **Auth Method**: `Personal Access Token`
   - **Token**: paste your PAT (`ghp_...` or `github_pat_...`)
3. Click **Save** → click **Test** to verify the connection
4. Go back to the home page → start exploring APIs!

### Finding Your Org Login

If you're not sure what your org login is, configure your PAT first, then hit the `GET /user/orgs` endpoint in the harness. The `login` field in the response is what you need.

## Usage

### Exploring Endpoints

- **Browse** — expand categories in the left sidebar (actions, copilot, repos, orgs, etc.)
- **Search** — press `⌘K` (or `Ctrl+K`) and type endpoint names, paths, or descriptions
- **Select** — click any endpoint to load it into the request builder

### Sending Requests

1. Select an endpoint from the sidebar
2. Fill in path parameters (auto-populated where possible)
3. Check/uncheck query parameters and set values
4. For POST/PUT/PATCH, edit the JSON body (pre-populated from the OpenAPI schema)
5. Click **Send**
6. View the response in the right panel — switch between Body, Headers, Raw, and Preview tabs

### Response Tabs

| Tab | Description |
|-----|-------------|
| **Body** | Collapsible JSON tree with syntax highlighting |
| **Headers** | Response headers with rate limit info |
| **Raw** | Pretty-printed JSON text |
| **Preview** | URLs rendered as clickable links, image thumbnails, values with type coloring |

### Pagination

When a response includes pagination (`Link` header), a **"Load More →"** button appears at the bottom of the Body tab. Click it to fetch the next page — results are appended to the current view.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run import-api` | Import/refresh the API catalog from GitHub's OpenAPI spec (cloud) |
| `npm run import-api:ghes ghes-3.12` | Import a GHES-versioned API catalog |

## Configuration

### Environment Variables (`.env.local`)

Created automatically on first run. Contains:

| Variable | Description |
|----------|-------------|
| `ENCRYPTION_KEY` | Auto-generated AES-256 key for encrypting credentials at rest |
| `GITHUB_API_BASE_URL` | Default API base URL (overridden per-environment in the UI) |

### Multi-Environment Support

You can configure multiple environments in Settings — each with its own base URL, enterprise slug, org, and credentials. Switch between them using the dropdown in the top bar. This makes it easy to test across different customer EMU instances.

## Architecture

```
src/
├── app/
│   ├── api/
│   │   ├── endpoints/    # Endpoint catalog queries
│   │   ├── environments/ # Environment CRUD + auth validation
│   │   ├── execute/      # Request proxy (SSRF-protected)
│   │   ├── history/      # Request history CRUD
│   │   └── import/       # OpenAPI spec re-import
│   ├── collections/      # Collections page
│   ├── history/          # History page
│   ├── settings/         # Environment & auth config
│   └── page.tsx          # Main three-panel workspace
├── components/
│   ├── AppContext.tsx     # Global state (environment, endpoint, response)
│   ├── TopBar.tsx         # Nav bar, env selector, auth status, rate limit
│   ├── Sidebar.tsx        # API explorer with category tree + search
│   ├── RequestBuilder.tsx # URL bar, params, body editor, endpoint docs
│   ├── ResponseViewer.tsx # JSON tree, headers, raw, preview tabs
│   └── ResizablePanels.tsx# Drag-to-resize panel layout
├── lib/
│   ├── auth.ts           # Octokit factory (PAT + GitHub App)
│   ├── db.ts             # SQLite schema, CRUD, encryption
│   ├── openapi-import.ts # OpenAPI spec parser
│   └── types.ts          # TypeScript interfaces
scripts/
└── import-openapi.ts     # CLI for importing the API catalog
data/
└── harness.db            # Local SQLite database (gitignored)
```

### Tech Stack

- **Next.js 16** (App Router) — unified frontend + backend
- **TypeScript** — end-to-end type safety
- **Tailwind CSS** — GitHub Primer dark theme tokens
- **@octokit/rest** + **@octokit/auth-app** — GitHub API SDK with auth strategies
- **better-sqlite3** — local database, zero external dependencies
- **OpenAPI 3.0** — auto-generated endpoint catalog from `github/rest-api-description`

## Security

- **Credentials encrypted at rest** — AES-256-CBC with a locally generated key
- **SSRF protection** — the execute endpoint validates request URLs against the configured API base
- **Backend proxy** — tokens never leave the server; browser never sees raw credentials
- **`.env.local` and `data/` are gitignored** — no secrets in source control
