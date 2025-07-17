# Habit Tracker Monorepo

A **full-stack Habit Tracking application** composed of a REST API built with **Node.js / Express / MongoDB** and a **cross-platform mobile client** built with **React Native**. Both code-bases live in this monorepo for a first-class DX.

---

## Contents

1. [Repository structure](#repository-structure)
2. [Prerequisites](#prerequisites)
3. [Backend ‑ API](#backend--api)
4. [Mobile ‑ React Native](#mobile--react-native)
5. [Development workflow](#development-workflow)
6. [Contributing](#contributing)
7. [License](#license)

---

## Repository structure

```
/ (repo root)
├── api/              # Node/Express REST API
│   ├── controllers/  # Route handlers
│   ├── middleware/   # Auth & other reusable middlewares
│   ├── models/       # Mongoose models (User, Habit)
│   ├── routes/       # API route definitions (auth, habits)
│   ├── server.js     # App entry-point
│   └── .env          # Environment variables (never commit secrets!)
│
└── HabitFlow/        # React Native mobile application
    ├── src/
    │   ├── components/    # Reusable UI widgets
    │   ├── navigation/    # React-Navigation navigator
    │   ├── screens/       # Screen components (Login, Home, …)
    │   ├── services/      # API wrapper utilities
    │   └── config.js      # API base-URL & helpers
    ├── android/           # Native Android project (Gradle)
    ├── ios/               # Native iOS project (CocoaPods)
    └── App.tsx            # RN root component
```

---

## Prerequisites

| Tool                  | Version           | Notes                              |
| --------------------- | ----------------- | ---------------------------------- |
| Node.js               | ≥ 18              | LTS recommended                    |
| npm / Yarn            | latest            | package managers                   |
| MongoDB               | ≥ 6               | local or Atlas cluster             |
| Watchman              | optional          | macOS file-watching (React Native) |
| Xcode 14+             | iOS build/run     |
| Android Studio + SDKs | Android build/run |

---

## Backend – API

### 1. Setup

```bash
cd api
npm install      # install deps
cp .env.example .env  # add secrets (see below)
```

`.env` keys that **must** be provided:

```
PORT=5000            # server port (optional)
MONGO_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/db
JWT_SECRET=super-secret-string
```

### 2. Development server

```bash
npm run dev   # uses nodemon for auto-reload
```

Server will start on `http://localhost:5000` (or `$PORT`).

### 3. API reference

All endpoints are prefixed with `/api`.

#### Auth

| Method | Endpoint         | Description                                      |
| ------ | ---------------- | ------------------------------------------------ |
| POST   | `/auth/register` | Register a user `{ email, password }`            |
| POST   | `/auth/login`    | Login & receive **JWT** `{ email, password }`    |
| GET    | `/auth/me`       | Get current user (JWT `Bearer <token>` required) |

#### Habits _(Protected – JWT required)_

| Method | Endpoint      | Body                                  | Description              |
| ------ | ------------- | ------------------------------------- | ------------------------ |
| POST   | `/habits`     | `{ title, description?, frequency? }` | Create a habit           |
| GET    | `/habits`     | –                                     | List all habits for user |
| GET    | `/habits/:id` | –                                     | Get single habit         |
| PUT    | `/habits/:id` | Any of the habit fields               | Update habit             |
| DELETE | `/habits/:id` | –                                     | Delete habit             |

> `frequency` can be `daily`, `weekly` or `monthly`. `completedDates` (array of dates) can also be sent on update.

### 4. Testing

Minimal integration tests live in `api/test.js`. Run:

```bash
node test.js
```

---

## Mobile – React Native

### 1. Setup

```bash
cd HabitFlow
npm install            # or yarn
```

The **API base-URL** is set in `src/config.js`:

```js
export const API_BASE_URL = "https://habit-tracker-app-tyfu.onrender.com/api";
```

If you run the API locally, change it to `http://<local-ip>:5000/api`.

### 2. Running the app

Open two terminals.

**Terminal A – Metro bundler**

```bash
npm start # or yarn start
```

**Terminal B – build & run**

• Android:

```bash
npm run android  # or yarn android
```

• iOS (macOS):

```bash
bundle install        # once – installs CocoaPods via Bundler
bundle exec pod install --project-directory=ios
npm run ios           # or yarn ios
```

### 3. App overview

- **Authentication flow** – `LoginScreen`, `RegisterScreen`, `AuthLoadingScreen`.
- **Main flow** – `HomeScreen` lists user habits and allows CRUD actions through `HabitCard` & `HabitForm` components.
- **Navigation** – implemented with _React Navigation_ (see `src/navigation/AppNavigator.js`).
- **State / API** – lightweight state managed with `useState` & `useEffect`; network via `apiRequest` helper that injects JWT from `AsyncStorage`.

---

## Development workflow

1. **Start MongoDB** locally or ensure Atlas cluster is reachable.
2. Run the **API** (`npm run dev` inside `api/`).
3. Update `API_BASE_URL` in `HabitFlow/src/config.js` if needed.
4. Run **Metro** & launch the **mobile app**.
5. Profit ✨

For an end-to-end experience you can also use an **Android/iOS simulator** or a real device in “developer mode”.

---

## Contributing

1. Fork → feature branch → PR.
2. Follow **Conventional Commits**.
3. Run `npm run lint` & ensure no ESLint/Prettier errors.

Thank you for making Habit Tracker better! 🙏

---

## License

This project is released under the **MIT License** – see [`LICENSE`](LICENSE) for details.
