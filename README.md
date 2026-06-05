# Eduverse Mobile App

Supporting mobile app for Eduverse, focused on the daily student and teacher workflow rather than duplicating every web feature.

## Stack

- React Native with Expo
- TypeScript
- NativeWind / Tailwind CSS
- Bun for dependency installation

The project targets Expo SDK 54 so it works with the Expo Go 54 app currently available on iOS.

## First MVP Scope

1. Auth and profile
2. Dashboard
3. Notifications
4. Courses and classes overview
5. Assignments and deadlines
6. Chat
7. Announcements
8. Settings

## Mobile Product Direction

The mobile app should be the daily companion for Eduverse, not the admin console. It focuses on fast student/teacher workflows:

- auth, signup, forgot password, profile, organization role context
- notifications for course updates, chats, deadlines, and announcements
- dashboard with upcoming tasks, enrolled classes, recent activity, and progress
- course/class overview with live session entry, materials, chat, assignments, and results shortcuts
- assignments and deadlines with submission status first, file submission later
- chats for student-teacher, class groups, and support
- announcements as a separate important-update feed
- calendar, resources/downloads, search, notification preferences, language, theme, and account security
- offline-friendly basics for dashboard, resources, and recent messages

Heavy workflows such as course creation, analytics, deep content editing, exam authoring, feature management, and organization administration stay in the web app.

## Development

Create `.env` from `.env.example` and copy the public Supabase values from the web app:

```sh
cp .env.example .env
```

Required values:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- `EXPO_PUBLIC_EDUVERSE_API_BASE_URL=https://eduverse-demo.vercel.app`

The mobile app also supports `EXPO_PUBLIC_SUPABASE_URL` and `EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, but you do not need to duplicate values if your `.env` already uses the `NEXT_PUBLIC_SUPABASE_*` names from the web app. `app.config.js` bridges those values into Expo runtime config for iOS and Android.

Do not copy server-only web secrets into the mobile app, including `SUPABASE_SECRET_KEY`, AWS keys, or LiveKit API secrets.

```sh
bun install
bun run start
```

Use the Expo CLI prompt to launch iOS, Android, or web.

Use Node 22 LTS for this project. Expo/Metro can crash or be killed on very new non-LTS Node versions.

## Test on Real Devices

Install Expo Go on the phone first:

- iPhone: install `Expo Go` from the App Store.
- Android: install `Expo Go` from Google Play.

Then start the project with a QR code:

```sh
bun run start:tunnel
```

Scan the QR code with the iPhone Camera app or the Expo Go scanner on Android. Use `bun run start:clear` if Metro gets stuck with old cache.

## Troubleshooting

If `bun run start` exits with `SIGKILL` or `zsh: killed`, check Node:

```sh
node --version
```

If it shows Node 25 or another non-LTS version, switch to Node 22 LTS, reinstall dependencies, then start again:

```sh
brew install node@22
brew link node@22 --force --overwrite
node --version
bun install
bun run start:clear
```

## Responsive Targets

The starter screen is tuned for:

- compact phones around 320-359 px wide
- common iPhone and Android phones around 360-430 px wide
- large phones and foldables
- tablet widths from 768 px and up

The app uses `useWindowDimensions` for runtime layout decisions and NativeWind for the visual system.
