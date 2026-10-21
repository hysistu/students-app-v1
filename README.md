# TechLab App

Next.js 16 App Router + TypeScript + Tailwind CSS frontend for the API in `../students-api`.

## Start locally

Start MongoDB and the API first, following the API README. Then:

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open `http://localhost:3000`. `API_ORIGIN` in `.env.local` is the address of the Express server; the default is `http://localhost:4000`. Run `npm run build` to check the production app.

For a local classroom demo, `npm run seed:demo` in the API repo creates these accounts:

| Role       | Email                    | Password                         |
| ---------- | ------------------------ | -------------------------------- |
| Admin      | `admin@example.com`      | `ADMIN_PASSWORD` from API `.env` |
| Instructor | `instructor@example.com` | `ChangeMe123!`                   |
| Student    | `student@example.com`    | `ChangeMe123!`                   |

## Features and teaching points

- App Router pages, nested dynamic course route, shared layout, loading, error, and not found UI.
- Client components with React `useState` and `useEffect` for forms, fetching, filters, and feedback.
- Admin dashboard, user and student CRUD, course CRUD, search, filters, and pagination.
- Student catalog, course details, persistent cart, demo checkout, and enrolled courses.
- Instructor views limited to assigned courses and their enrolled students.
- Shared `lib/api.ts` for fetch, JSON, errors, and HTTP method examples.
- Cookie presence check in `proxy.ts`; authorization is enforced by the Express API.
- Tailwind components for cards, tables, forms, modal dialogs, badges, and responsive navigation.

The app sends browser requests to `/api/*`; `next.config.ts` rewrites them to the Express API. This keeps cookie handling simple and lets students inspect request methods, bodies, responses, and status codes in DevTools. Course quantity is fixed at one because each enrollment is unique. Image entry accepts a URL; the demo checkout records enrollment without payment.

**API errors:** A failed request displays the API's error message. A missing backend displays a connection error. The page list includes loading and empty states. The frontend hides unavailable actions, and the backend still checks every protected request.

Create students directly from the Students page with name, email, password, student number, notes, and status. You can also link an existing student account. Editing the student updates the linked account details. After checkout, enrolled courses appear in My courses and are excluded from the course catalog.
