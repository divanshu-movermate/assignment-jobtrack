# JobTrack

Moving job management API + frontend. See [docs/assignment-brief.md](./docs/assignment-brief.md) for the full spec.

## Stack

- **Backend:** Node.js, Express, MongoDB (Mongoose)
- **Frontend:** Next.js (App Router), TypeScript, Tailwind CSS

## Workflow — read before you start

**Do not commit to `main`.** Before writing any code:

```bash
git checkout main
git pull
git checkout -b <your-name>       # e.g. git checkout -b sahil
```

Do all your work on that branch — commit as you go (after models, after auth wiring, after jobs CRUD, after status logic, after frontend pages, per the brief's Section 13 cadence) and push the branch, not `main`:

```bash
git push -u origin <your-name>
```

`main` stays clean so multiple interns can work on this assignment in the same repo without stepping on each other.

## Getting started

### Backend

```bash
cd backend
cp .env.example .env   # already filled with local defaults, edit if needed
npm install
npm run dev             # http://localhost:5000
```

Requires a MongoDB instance reachable at `MONGO_URI` (defaults to `mongodb://127.0.0.1:27017/jobtrack`).

Once the models/seed script are built:

```bash
npm run seed
```

### Frontend

```bash
cd frontend
cp .env.local.example .env.local   # already filled with local defaults, edit if needed
npm install
npm run dev             # http://localhost:3000
```

## Project structure

```
backend/
  src/
    config/       # db connection, env loading
    models/       # Mongoose schemas
    schemas/      # zod request-validation schemas
    controllers/
    routes/
    middleware/    # authenticate, authorize, errorHandler, validate
    utils/
    seed.js
  server.js
  .env.example

frontend/
  app/
    login/ jobs/ customers/ dashboard/
  components/
    ui/ jobs/ customers/ layout/
  lib/
    api.ts    types.ts    auth-context.tsx
    schemas/   # zod schemas for forms
```

## API reference

TODO: fill in as endpoints are built — either a `.http` file or a table of `METHOD /path — what it does`.

## Implemented / known gaps

TODO: keep this current as you build.

## Notes / decisions

TODO: the 5-10 line write-up on one underspecified decision (see brief Section 12).
