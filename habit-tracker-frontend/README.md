# Habit Tracker Monorepo

A **full-stack, cross-platform Habit Tracker** application — including:

- 🚀 **REST API** (Node.js + Express + MongoDB)
- 📱 **Mobile app** (React Native — HabitFlow)
- 🌐 **Web frontend** (Next.js 15, TypeScript, Tailwind)

All code in a unified monorepo for fast, streamlined development and shared contracts.

## ✨ Features at a Glance

- **User Auth**: Secure JWT-based registration and login.
- **Habit CRUD**: Track habits (daily, weekly, monthly); create, edit, delete, mark complete.
- **Cross-Platform Clients**: Web UI (Next.js) \& mobile app (React Native).
- **REST API**: Node.js/Express, backed by MongoDB.
- **Modern UI**: Tailwind CSS, theming (dark/light), polished UX.
- **Single source of truth**: All clients use the same backend and data model.
- **Easy local dev**: Run all or just the part you want.

## Repository Structure

```
/
├── api/                   # Node.js/Express REST API backend
│   ├── controllers/       # Route handlers
│   ├── middleware/        # Auth and middleware
│   ├── models/            # User/Habit Mongoose schemas
│   ├── routes/            # API route definitions
│   ├── server.js          # Main entrypoint
│   └── .env               # (private) environment variables
│
├── HabitFlow/             # React Native mobile app
│   ├── components/        # UI Components
│   ├── navigation/        # Navigation setup
│   ├── screens/           # Screens (Login, Home, etc)
│   ├── services/          # API helpers
│   └── config.js          # API URL & settings
│
└── habit-tracker-frontend/     # Next.js web frontend
    ├── src/
    │   ├── app/            # App Router pages (login, register, dashboard, etc)
    │   ├── components/     # Reusable form component
    │   └── lib/            # Typed API/auth helpers
    ├── tailwind.config.js  # Tailwind config
    └── ...                 # Usual Next.js structure
```

## Prerequisites

| Tool                    | Version       | Notes                            |
| :---------------------- | :------------ | :------------------------------- |
| Node.js                 | ≥ 18          | (LTS recommended)                |
| npm / yarn              | latest        |                                  |
| MongoDB                 | ≥ 6           | Use Atlas or local               |
| Watchman                | optional      | For React Native Dev, macOS only |
| Xcode \& Android Studio | needed for RN | for iOS/Android builds           |

## Quick Start Overview

1. **Clone repo \& install dependencies**

```bash
git clone <your-repo-url>
cd <repo>
npm install
```

2. **Set up your backend**

```bash
cd api
cp .env.example .env    # Provide required config
npm install
npm run dev             # Starts API on http://localhost:5000
```

> **`.env` should include:** > `> PORT=5000 > MONGO_URI=mongodb+srv://... or mongodb://localhost:27017/yourdb > JWT_SECRET=super-secret-key >`

3. **Launch the mobile app (React Native)**

```bash
cd HabitFlow
npm install
# Update API_BASE_URL in src/config.js if needed
npm start               # Metro bundler
npm run android         # or: npm run ios (on macOS, with pods installed)
```

4. **Launch the web frontend (Next.js)**

```bash
cd habit-tracker-frontend
npm install
# Configure .env.local:
# NEXT_PUBLIC_API_URL=http://localhost:5000         # or your deployed API
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000).

## 📦 Package Breakdown

### 1. Backend: `api/` (Node.js + Express)

- **Endpoints:**
  - `POST /api/auth/register` — register ({ email, password })
  - `POST /api/auth/login` — login, receives JWT ({ email, password })
  - `GET /api/auth/me` — get user (must send JWT)
  - **Habits CRUD** (Protected):
    - `GET /api/habits` — list user habits
    - `POST /api/habits` — create habit
    - `GET /api/habits/:id` — get single habit
    - `PUT /api/habits/:id` — update
    - `DELETE /api/habits/:id` — delete
- **Models:** User (email, password hash), Habit (user, title, desc, frequency, completedDates)
- **Security:** All habit routes require JWT.
- **Dev scripts:** `npm run dev` (nodemon reloads)

### 2. Mobile App: `HabitFlow/` (React Native)

- **Features**
  - Auth flow: login/register, session persisted via `AsyncStorage`
  - Habit list with tabs (daily, weekly, monthly)
  - Animated habit cards: complete, edit, delete
  - Add/edit habits (forms)
  - Backend API consumed via `config.js`/`services/api.js`
  - Navigation via `@react-navigation/native`
- **Quickstart**
  - `npm install`
  - `npm start` (Metro)
  - `npm run android` or `npm run ios`

### 3. Web Frontend: `habit-tracker-frontend/` (Next.js)

- **Features**
  - Next.js 15 App Router (pages are React components under `src/app/`)
  - JWT auth handled in localStorage
  - Responsive Tailwind UI (dark/light, pretty!)
  - CRUD: `/dashboard` (list), `/dashboard/new` (create), `/dashboard/[id]` (edit/delete)
  - Typed forms, axios with interceptors for auth
- **Quickstart**
  - `npm install`
  - Add `.env.local` with `NEXT_PUBLIC_API_URL=http://localhost:5000`
  - `npm run dev`

## Example `.env` Configuration

**api/.env**

```ini
PORT=5000
MONGO_URI=mongodb://localhost:27017/habittracker
JWT_SECRET=YOUR_SUPER_SECRET_KEY
```

**habit-tracker-frontend/.env.local**

```ini
NEXT_PUBLIC_API_URL=http://localhost:5000
```

## Development Tips

- All clients point at the same API base URL (update as needed for local/remote/dev/prod).
- You can run web and mobile apps at the same time, using the same user accounts/data.
- Designed for fast local development and easy transition to cloud deployment (Heroku, Vercel, Render, etc).

## Contributing

1. Fork → feature branch → PR.
2. Please use **Conventional Commits**.
3. Run `npm run lint` in web/mobile before pushing.

## License

This project is released under the **MIT License** — see [`LICENSE`](LICENSE) for details.

**Made with ❤️ by [Your Name or Organization]**

## Links

- [Backend: api/](./api)
- [Mobile App: HabitFlow/](./HabitFlow)
- [Web Frontend: habit-tracker-frontend/](./habit-tracker-frontend)

Let me know if you want a **contributing guide** template, **deployment instructions**, or a "features roadmap" section!
