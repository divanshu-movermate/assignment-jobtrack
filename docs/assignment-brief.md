# Assignment: JobTrack — Moving Job Management API + Frontend

**Type:** Capstone assignment (backend-heavy) — pass it and you move to production work on MoverMate/Ozwide.
**Stack:** Node.js + Express + MongoDB (Mongoose) for the API, then Next.js (App Router) + TypeScript + Tailwind for the frontend consuming it.
**Why this domain:** This is a deliberately scaled-down version of what MoverMate actually is — customers, jobs, a status pipeline, staff assignment. Build this well and you've already done a rough draft of real work.

---

## 1. What you're building

**JobTrack** is a small internal ops tool for a moving company — think of it as the tool the front-desk/ops team and the crew leads would actually open every morning.

**Who uses it:**
- **Admin** (ops manager / owner) — creates staff accounts, sees everything, can assign crew to jobs, can delete records, sees the dashboard.
- **Staff** (crew lead / coordinator) — logs in, sees the jobs assigned to them (or all jobs, your call — note it in your write-up either way), can update job status and add notes, can create new customers/jobs and quotes. Can't create other users, delete anything, or reassign crew.

**The story it supports, end to end:**
1. A customer calls in wanting a quote → ops creates a **Customer** record, then a **Job** for them in `quote_requested` status with a rough pickup/dropoff and estimated price.
2. Ops firms up the price → moves the job to `quoted`.
3. Customer confirms → job moves to `confirmed`, and an admin assigns one or more **staff** as the crew for that job.
4. On moving day, the assigned crew (or ops, on their behalf) marks it `in_progress`, then `completed` once done, with the final price filled in.
5. At any point before completion, a job can be `cancelled` — customer backed out, whatever the reason.
6. Anyone working the job can leave timestamped **notes** on it (e.g. "customer asked to push pickup to 2pm").
7. Ops opens a **dashboard** each morning to see: how many jobs are in each stage, rough revenue pipeline, and which customers are repeat business.

**Feature list (plain English — the technical shape of each is in the sections below):**
- Login/logout for staff and admins, plus a two-role access system (admin/staff) gating what each can do.
- Admin-only: create new staff accounts.
- Customer records: create, view, search, edit, (admin) delete.
- Job records: create, view, edit, (admin) delete — each tied to a customer.
- Job status pipeline with enforced valid transitions (you can't mark something `completed` straight from `quote_requested`, etc.) — see Section 5.4.
- Assigning one or more staff to a job (admin only).
- Notes/activity trail on each job.
- A searchable, filterable, sortable, paginated **Jobs list** — this is the main screen of the app, with real data fetched over the network (not a static JSON file).
- A dashboard with a handful of aggregate numbers (job counts by status, pipeline revenue, top customers).

That's the whole product. It's intentionally small — the point isn't breadth, it's building each of these pieces the way you'd actually build them for MoverMate: real validated API, real DB queries doing the filtering, real role enforcement.

---

## 2. The one non-negotiable technical rule

Every list endpoint (`GET /api/jobs`, `GET /api/customers`) must filter, sort, and paginate **for real in MongoDB**, driven by query params sent from the frontend. Do not fetch the full collection and filter/sort/paginate it in JavaScript, on the backend or the frontend. That's the whole point of this assignment: proving you can build a real API that does its own querying, not one that just hands over everything and lets the client sort it out.

---

## 3. UI reference — clone this, don't design your own

**Reference:** [reference-jobtrack.html](./reference-jobtrack.html) (attached, same idea as the reference file from your last assignment) — clone the layout, spacing, states, and interactions shown in it. Colors/copy can be adjusted slightly within the palette below, but the structure should match. You are not designing these screens from scratch — the layout decisions are already made, your job is to build them.

### 3.1 Design tokens (already applied in the reference file — for when you need the raw values in code)

```
Ink:      #12161F (headings) / #333B4A (body) / #697086 (muted) / #E7E9EE (borders/tint)
Surface:  #FFFFFF   Paper (page bg): #F6F7FA   Line: #E3E6EC
Brand:    #3D4FE0  (hover: #2C3AB8, tint bg: #EEF0FD)
Radius:   8–10px on cards/inputs/buttons, full pill on status badges
Font:     Manrope for headings, Inter for body/data (Google Fonts)

Job status colors:
  quote_requested = Gray   #697086
  quoted           = Blue    #2C7BE5
  confirmed        = Purple  #6D3FD1
  in_progress       = Amber   #C67C11
  completed        = Green   #0F9D63
  cancelled        = Red     #D0453C
```

### 3.2 What's in the reference file

The file has 7 screens stacked top to bottom, each labeled — open it in a browser and scroll through before you write any frontend code:
1. **Login**
2. **Jobs list** — the main screen: sidebar, topbar, toolbar (search/filter/sort/create), table, pagination
3. **Jobs list, empty state** — same shell, what shows when search/filter yields nothing
4. **Job detail** — status track control, job info, notes list + add-note input, customer panel
5. **Create/Edit Job** — modal shown open, including an inline validation error example
6. **Dashboard** — stat cards + status breakdown + top customers panel
7. **Customers list** — deliberately plain, matches Section 8's "doesn't need full polish" note

The loading skeleton state isn't mocked in the reference file — build it as shimmer rows matching the table's column widths, same pattern as you did on the Leads assignment.

### 3.3 A couple of things not to over-index on
- The reference file is static HTML/CSS for layout reference only — it is not React, don't try to lift markup out of it directly into components.
- Icons in the reference are plain inline SVGs standing in for `lucide-react` icons — swap in the actual `lucide-react` equivalents when you build (search, bell, plus, pencil, trash, users, layout-dashboard, etc.).
- Small aesthetic calls (exact icon choice, a few px of spacing) are yours — this is a reference, not a pixel-locked spec.

---

## 4. What "done" means

A working Express + MongoDB API for managing moving jobs, with real authentication and role-based access, followed by a Next.js frontend that consumes it over HTTP (no dummy JSON, no client-side filtering). A teammate should be able to `npm install && npm run dev` both halves and understand the code without a walkthrough.

---

## 5. Domain model

### 5.1 User model + auth
```
{
  _id, name, email, passwordHash,
  role: "admin" | "staff",   // default "staff"
  createdAt
}
```
- Only an **admin** can create other users (staff accounts). There's no public self-registration — seed one admin manually (a seed script counts).
- Build the auth flow fresh for this project: login issues a JWT, an `authenticate` middleware verifies it and attaches the user to `req.user`, and a separate `authorize(...roles)` middleware (worked example in 7.1) checks `req.user.role`. You've done the core mechanics of this before (password hashing, JWT issuing/verifying) so it shouldn't take long — but write it directly in this codebase rather than trying to copy files from a different project. A clean 30–45 minute rebuild is faster and less error-prone than untangling old code to fit a new one.

### 5.2 Customer
```
{
  _id, name, email, phone,
  address: { line1, city, state, zip },
  notes: string,
  createdBy: ObjectId (User),
  createdAt, updatedAt
}
```

### 5.3 Job
```
{
  _id,
  customer: ObjectId (Customer),        // populated on read
  pickupAddress: string,
  dropoffAddress: string,
  scheduledDate: Date,
  estimatedPrice: number,
  finalPrice: number | null,
  status: "quote_requested" | "quoted" | "confirmed" | "in_progress" | "completed" | "cancelled",
  assignedCrew: ObjectId[] (User, role=staff),
  notes: [{ text: string, author: ObjectId, createdAt: Date }],
  createdBy: ObjectId (User),
  createdAt, updatedAt
}
```

### 5.4 Status pipeline rules (this is the "business logic" part — the real point of the exercise)
Valid forward path: `quote_requested → quoted → confirmed → in_progress → completed`
`cancelled` is reachable from any state **except** `completed`.
No other transitions are valid (e.g. can't jump `quote_requested → in_progress`, can't leave `completed` or `cancelled`).
This validation lives in the backend (not just the UI) — reject invalid transitions with a `400` and a clear message.

---

## 6. Required API surface

Consistent response shape everywhere, e.g. `{ success: boolean, data?: ..., error?: string }`. Use proper status codes (200/201/400/401/403/404/500).

### Auth
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/me` — current user from token
- `POST /api/auth/users` — **admin only**, creates a staff (or admin) account

### Customers
- `GET /api/customers?search=&page=&limit=`
- `POST /api/customers`
- `GET /api/customers/:id`
- `PATCH /api/customers/:id`
- `DELETE /api/customers/:id` — **admin only**

### Jobs
- `GET /api/jobs?search=&status=&assignedTo=&sort=scheduledDate:asc|desc&page=&limit=`
  - `search` matches on customer name/email (requires a `$lookup`/populate-aware query or a denormalized field — your call, document which you picked and why)
  - all filters must combine correctly (search + status + assignedTo together)
- `POST /api/jobs`
- `GET /api/jobs/:id` — populate `customer` and `assignedCrew`
- `PATCH /api/jobs/:id` — general field updates
- `PATCH /api/jobs/:id/status` — status-only, runs the transition validation from 5.4
- `POST /api/jobs/:id/notes` — appends a note (author = current user)
- `POST /api/jobs/:id/assign` — **admin only**, sets `assignedCrew`
- `DELETE /api/jobs/:id` — **admin only**

### Dashboard
- `GET /api/dashboard/stats` — one aggregation pipeline (not multiple queries stitched in JS) returning:
  - count of jobs per status
  - sum of `estimatedPrice` for jobs not `cancelled`
  - jobs created this month vs last month
  - top 3 customers by job count

This endpoint is the one place you're required to use Mongo's aggregation framework (`$match`, `$group`, `$facet` or similar) rather than fetching everything and reducing in Node.

---

## 7. Backend requirements (non-negotiable, this is what's being graded)

- **Validation:** every write endpoint validates its body with `zod` before touching the DB. Bad input → `400` with field-level errors, never a raw Mongoose error leaking to the client.
- **Auth middleware:** `authenticate` (valid JWT → `req.user`) and `authorize(...roles)` (role check), reused across routes, not duplicated per-controller.
- **Error handling:** one centralized error-handling middleware; controllers throw/`next(err)`, they don't each have their own try/catch/response boilerplate.
- **Pagination:** real `skip`/`limit` on the Mongo query, plus a `total` count returned so the frontend can compute page count.
- **Security basics:** `helmet`, `cors` configured to your frontend origin, passwords hashed with bcrypt (or similar), don't return `passwordHash` in any response.
- **Env config:** `.env` for `MONGO_URI`, `JWT_SECRET`, `PORT`, etc. — never committed, `.env.example` provided.
- **Seed script:** `npm run seed` creates one admin user + ~10 customers + ~15 jobs in varied statuses, so the app isn't empty on first run.

### 7.1 The RBAC pattern, worked example

By the time you get here you should have an `authenticate` middleware (checks the JWT, attaches `req.user`) working in this project — build it fresh here if you haven't already, per 5.1. RBAC is one small step past that: a second middleware that checks `req.user.role` against a list of roles *you pass in per-route*. The only new idea is that `authorize` isn't itself a middleware — it's a function that **returns** one. That's why you call it as `authorize('admin')` in a route definition instead of just `authorize`.

```js
// middleware/authorize.js
function authorize(...allowedRoles) {
  // this outer function runs ONCE, when the route file is loaded,
  // and just remembers which roles are allowed
  return function (req, res, next) {
    // this inner function runs on EVERY request to that route
    if (!req.user) {
      return res.status(401).json({ success: false, error: "Not authenticated" });
    }
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ success: false, error: "Not allowed to perform this action" });
    }
    next(); // role checks out, continue to the controller
  };
}

module.exports = authorize;
```

Using it in a route — this is the part that trips people up the first time, so trace through it carefully:

```js
// routes/customers.js
const authenticate = require("../middleware/authenticate");
const authorize = require("../middleware/authorize");

router.delete(
  "/:id",
  authenticate,        // sets req.user
  authorize("admin"),  // authorize("admin") RUNS NOW and returns the actual middleware function
  customerController.deleteCustomer
);
```

Walk through the sequence: `authorize("admin")` executes immediately while Express is reading the route table, and what it *returns* — the inner `function (req, res, next) {...}` — is what actually gets wired in as the middleware. So by the time a real request comes in, Express is calling that returned function, which already "remembers" `allowedRoles = ["admin"]` from when it was created. That's the whole trick: `authorize` is a middleware **factory**, not a middleware.

If a route needs to allow either role, it's just `authorize("admin", "staff")` — same function, different args, no new code.

**Don't overthink this beyond the pattern above.** No permission matrix, no DB-stored permissions, no per-resource ownership checks (e.g. "staff can only edit jobs assigned to them" — explicitly out of scope here). It's a yes/no gate per route. If you find yourself building anything more elaborate than the snippet above, you've overshot the assignment.

---

## 8. Frontend requirements

Build the Jobs page as the main screen of the app: a table with search, filter, sort, and pagination, wired to the real API (loading state comes from an actual `fetch`/`axios` call, not a `setTimeout`).

**Forms:** use `react-hook-form` + `zod` (via `@hookform/resolvers`) for the Create Customer and Create/Edit Job forms — same tooling, applied fresh to this app's fields. Define each schema in `lib/schemas/` (e.g. `customer-schema.ts`, `job-schema.ts`) and infer the form type from it (`z.infer<typeof schema>`) rather than hand-writing a separate interface. Show inline error text under each invalid field on submit. Note: these frontend schemas validate what the user typed before it's sent; they're a UX convenience, not a substitute for the backend's own `zod` validation in Section 7 — the API must still reject bad input even if a request bypasses the form entirely.

**Allowed frontend packages beyond Next/React/Tailwind:** `lucide-react`, `react-hook-form`, `zod`, `@hookform/resolvers`, and either `axios` or plain `fetch` for API calls (your call — pick one, use it consistently). Nothing else without asking first.

- `/login` — real login against `/api/auth/login`, stores token (httpOnly cookie preferred; localStorage acceptable if you note the tradeoff), redirects to `/jobs` on success.
- Route protection: unauthenticated users hitting `/jobs`, `/customers`, `/dashboard` get redirected to `/login`.
- `/jobs` — table with search, status filter, sort, pagination — all driving actual query params to the API, not filtering an in-memory array.
- Job detail view (page or modal — your call) showing notes and allowing a status change (respecting the pipeline — disable/hide invalid next-states in the UI, but remember the backend is the real gate).
- `/customers` — simple list + create form. Doesn't need the full polish of `/jobs`.
- `/dashboard` — the four stats from `GET /api/dashboard/stats` as plain cards. No charting library needed — numbers in cards is enough.
- Role-awareness: staff users shouldn't see admin-only actions (create user, delete, assign crew) in the UI. (Backend must still reject these regardless of what the UI hides — UI hiding is a courtesy, not the security boundary.)

### 8.1 What each role actually sees

Concrete checklist so there's no guessing. Same pages for both roles, same nav — the difference is which buttons/actions render.

| Page / action | Admin sees | Staff sees |
|---|---|---|
| `/jobs` list, search, filter, sort, pagination | ✅ | ✅ |
| Create job / create customer | ✅ | ✅ |
| Edit job fields, add a note | ✅ | ✅ |
| Change job status | ✅ | ✅ |
| "Assign crew" button on job detail | ✅ | ❌ hidden |
| Delete job / delete customer (trash icon) | ✅ | ❌ hidden |
| "Create staff account" (Team page) | ✅ | ❌ hidden entirely, not even a disabled button |
| `/dashboard` | ✅ full stats | your call — either hide the page from nav for staff, or show it read-only; note which you picked and why |

**How to actually implement this in the frontend** — not a new concept, same idea as the backend, just at render time:

```tsx
// after login, you already have the current user (e.g. from /api/auth/me) in context/state
const { user } = useAuth(); // however you're storing it — context, a hook, whatever

{user.role === "admin" && (
  <Button onClick={handleAssignCrew}>Assign crew</Button>
)}
```

That's it — a plain conditional render based on `user.role`, same pattern you'd use to hide any UI based on any piece of state. The only thing worth remembering: **this conditional is UX, not security.** A staff user could still hit `POST /api/jobs/:id/assign` directly with a tool like Postman if the backend didn't check `authorize("admin")` on that route — which is exactly why Section 7.1's middleware has to be real and can't be skipped just because the button is hidden.

**A useful way to test this yourself:** log in as staff, open your browser's dev tools, and try hand-crafting a fetch call to an admin-only endpoint from the console. If it succeeds, your backend RBAC isn't actually enforced yet — go fix the middleware, not the UI.

Keep the `ui/` components (Button, Input, Select, Modal, Table, Badge) small and plain — simple, generic versions are enough, this isn't where the grading weight is. If code from a previous project happens to drop in without modification, fine, but don't spend time trying to force-fit anything that doesn't — a fresh 15-line version of a Button is faster than debugging an import from a different codebase. Time saved here should go toward the backend and the Jobs table logic, not toward polishing these.

---

## 9. Folder structure (required)

```
backend/
  src/
    config/          # db connection, env loading
    models/           # User, Customer, Job (Mongoose schemas)
    schemas/          # zod schemas for request validation
    controllers/
    routes/
    middleware/       # authenticate, authorize, errorHandler, validate
    utils/
    seed.js
  server.js
  .env.example

frontend/
  app/
    login/
    jobs/
    customers/
    dashboard/
  components/
    ui/
    jobs/
    customers/
    layout/
  lib/
    api.ts            # fetch/axios wrapper, attaches auth token
    types.ts
    schemas/
      customer-schema.ts   # zod schema for the create-customer form
      job-schema.ts         # zod schema for the create/edit-job form
```

- No controller file doing DB queries directly inline with no separation — controller calls model, not raw `mongoose.connection.db.collection(...)`.
- No `any` in the frontend TS.
- Keep components under ~250 lines. If one's growing past that, it's a sign to pull out a sub-component.

---

## 10. What you do NOT need to do
- No file uploads (attachments, photos) — stretch only, don't spend budget here.
- No email/SMS notifications.
- No real-time updates (sockets) — plain refetch after mutations is fine.
- No tests required (bonus, not evaluated).
- No charts on the dashboard — numbers in cards is enough.
- No multi-tenant / company-switching logic.
- No polished visual design — Section 3 is intentionally minimal; a clean, functional layout is the bar, not something portfolio-worthy.

---

## 11. Evaluation checklist

**Backend (40%)**
- [ ] Auth + role-based access works correctly (admin-only routes actually reject staff, not just hidden in UI)
- [ ] Customers CRUD works
- [ ] Jobs CRUD works, including populate on read
- [ ] Status transition validation enforces the pipeline server-side
- [ ] `GET /api/jobs` search + status filter + sort + pagination all work and combine correctly, real Mongo queries (not fetch-all-then-filter-in-JS)
- [ ] Dashboard stats endpoint uses an aggregation pipeline, not multiple round trips reduced in Node
- [ ] Validation with zod on every write endpoint, clean 400s on bad input
- [ ] Centralized error handling, no leaking raw Mongoose/stack errors to the client
- [ ] Seed script works and leaves the app in a demoable state

**Frontend (25%)**
- [ ] Login works against the real API, protected routes redirect correctly
- [ ] Create Customer and Create/Edit Job forms use react-hook-form + zod, with inline validation errors on submit
- [ ] Jobs table search/filter/sort/pagination drive real API calls (check network tab — this is the thing I'll actually check)
- [ ] Status change UI respects the pipeline and hits `PATCH /jobs/:id/status`
- [ ] Dashboard shows real numbers from the stats endpoint
- [ ] Role-based UI differences visible between an admin and a staff login

**Design fidelity (10%)**
- [ ] Matches the reference file's layout and spacing rhythm (not pixel-identical, but clearly the same design)
- [ ] Uses the token palette from Section 3.1, including the correct status colors
- [ ] Responsive at 375 / 768 / 1440 with no horizontal overflow or broken layout

**Code quality (15%)**
- [ ] Folder structure matches Section 9
- [ ] No `any`, reasonable typing throughout
- [ ] No dead code / console.logs left in
- [ ] `.env` not committed, `.env.example` present

**Independent judgment (10%)**
- [ ] Written note (see deliverables) shows a sensible call on something underspecified here

**Passing bar:** all of Backend + Frontend checked, at least 4/5 on Code quality, at least 2/3 on Design fidelity, and the note shows real thought → move to production on MoverMate/Ozwide.

---

## 12. Deliverables
1. Work in the shared repo, `backend/` and `frontend/` folders at root as shown in Section 9.
2. Root `README.md`: how to run both halves (`npm install && npm run dev` in each), a `.env.example`, how to run the seed script, and a short list of what's implemented / known gaps.
3. A simple API reference — either a `.http` file (REST Client format) with one example request per endpoint, or a short table in the README of `METHOD /path — what it does`. Doesn't need to be Swagger-grade.
4. 3 screenshots (mobile/tablet/desktop) of the Jobs page.
5. A short written note (5–10 lines) on one underspecified decision you made and why — this is how I gauge independent judgment, not a formality.

---

## 13. Ground rules
- **Timeframe: 2 working days, hard cap at 3**, covering both backend and frontend. That's tight for this scope, on purpose — cut scope if you need to, don't cut corners on the backend fundamentals in Section 7.
- If stuck on the same thing for more than ~45 minutes, ask.
- Commit as you go (after models, after auth wiring, after jobs CRUD, after status logic, after frontend pages), straight to `main` — no branches/PRs needed for this one.

## 14. If you're running out of time — cut in this order
1. Dashboard "top 3 customers" facet — just ship status counts + revenue sum if the aggregation is eating time.
2. Customers page frontend polish — a bare list + create form is enough.
3. Notes on jobs (both API and UI) — nice to have, not core.
4. Role-based UI hiding on the frontend (backend enforcement of Section 7/`authorize` must still work regardless).
5. `.http`/API reference doc — fall back to a plain endpoint table in the README.
6. Exact responsive breakpoints — reasonable responsive behavior beats matching the reference file's breakpoints exactly.

**Never cut:** auth + role-based access on the backend, Jobs CRUD, the status pipeline validation server-side, real query-param-driven search/filter/sort/pagination on `GET /api/jobs`, and the dashboard aggregation endpoint (even if trimmed to fewer stats). Those are the whole point of this assignment.

---

## Notes for you (the mentor), not part of the intern's brief

- The hard requirement that search/filter/pagination hit Mongo for real (Section 2, checklist item under Backend) is the single most important grading signal — it's easy to fake by fetching everything and filtering in JS, so actually check his network tab / query logs, not just that the UI works.
- The status pipeline (5.4) is there specifically to force him to write real business logic on the backend instead of just CRUD — worth spending your review time here.
- The reference file (Section 3) replaces the Figma-first workflow — he builds straight from `reference-jobtrack.html` the same way he cloned `reference.html` on the Leads assignment. No design decisions are left for him to make, which keeps the tight timeframe focused on the backend.
- If he finishes early and it's clean, a good stretch goal before moving him to MoverMate: add optimistic UI updates on status change, or a basic `.http`/Postman collection with all requests — low-risk polish that's directly transferable to real work.