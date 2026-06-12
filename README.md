# Eduverse Mobile App

Eduverse Mobile is the Expo companion app for the Eduverse learning platform. It is focused on daily student and teacher workflows: checking today, opening classes, tracking assignments, reading notifications, joining class conversations, and submitting lightweight assignment responses from a phone.

The mobile app is intentionally not a full administration console. Heavy workflows such as organization management, class creation, analytics, exam authoring, content editing, and feature configuration belong in the web app at `../Eduverse`.

## Product Scope

- Email/password authentication through Supabase.
- Profile and active organization context.
- Today dashboard with class, task, unread, and progress metrics.
- Course/class overview with schedule, teacher, room, materials count, progress, and chat entry.
- Assignments and deadlines with submission status and text response submission.
- Class chat with active-class message loading and send support.
- Native LiveKit session discovery, join, start, mic/camera controls, participant tiles, heartbeat, and end support.
- Announcement feed through notification records.
- Settings surface for account actions, theme, notification preferences, organization chips, and future preferences.
- Responsive layouts for compact phones, standard phones, large phones, foldables, and tablets.

## Tech Stack

- Expo SDK 54
- React Native 0.81
- React 19
- TypeScript
- NativeWind and Tailwind CSS
- Supabase JavaScript client
- AsyncStorage-backed Supabase auth sessions
- Lucide React Native icons
- Bun for dependency management and tests

## Repository Structure

```txt
App.tsx                     Root app shell, auth gate, tab state, and responsive layout
src/components/common/      Reusable buttons, inputs, sections, badges, settings rows, and controls
src/components/cards/       Dashboard, course, assignment, notification, progress, and row cards
src/components/layout/      App header and bottom tab navigation
src/config/                 Runtime environment helpers and tests
src/lib/                    Supabase client setup
src/providers/              EduverseProvider for auth, profile, classes, assignments, materials, messages, and notifications
src/screens/                Auth, dashboard, courses, tasks, chat, and more/settings screens
src/services/               API-backed Eduverse data and Supabase auth services
src/types/                  Navigation and shared UI types
```

## Prerequisites

- Node.js 22 LTS
- Bun
- Expo Go 54 on the target device for non-LiveKit flows, or a compatible Expo development build for live sessions
- Access to the same Supabase project used by the Eduverse web app

Expo and Metro can be unstable on very new non-LTS Node versions. Use Node 22 LTS for the smoothest development setup.

## Environment Setup

Create a local environment file:

```sh
cp .env.example .env
```

Required values:

```txt
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
EXPO_PUBLIC_EDUVERSE_API_BASE_URL=https://eduverse-demo.vercel.app
```

The app also supports Expo-native names:

```txt
EXPO_PUBLIC_SUPABASE_URL=
EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
```

You do not need to duplicate values if `.env` already uses the `NEXT_PUBLIC_SUPABASE_*` names copied from the web app. `app.config.js` bridges those values into Expo runtime config for iOS and Android.

Do not copy server-only web secrets into this repository. Keep these out of the mobile app:

- `SUPABASE_SECRET_KEY`
- AWS access keys
- LiveKit API secrets
- Any private service role or server credential

## Getting Started

Install dependencies:

```sh
bun install
```

Start Expo:

```sh
bun run start
```

Use the Expo CLI prompt to open iOS, Android, or web.

For a fresh Metro cache:

```sh
bun run start:clear
```

For real-device testing across networks:

```sh
bun run start:tunnel
```

Scan the QR code with the iPhone Camera app or the Expo Go scanner on Android.

LiveKit uses native WebRTC modules, so live sessions do not run inside Expo Go. Use a development build when testing live classes:

```sh
bunx expo run:ios
bunx expo run:android
```

## Available Scripts

```sh
bun run start          # Start Expo
bun run start:clear    # Start Expo with a cleared Metro cache
bun run start:tunnel   # Start Expo through a tunnel for real-device testing
bun run android        # Start Expo and open Android
bun run ios            # Start Expo and open iOS
bun run web            # Start Expo web
bun run test           # Run Bun tests
bun run typecheck      # Run TypeScript checks
```

## Runtime Data Flow

`EduverseProvider` is the main application data boundary. It keeps Supabase auth local and sends classroom data through the Eduverse web API with the active Supabase bearer token. The mobile app should not query Eduverse business tables directly.

It handles:

- Supabase session detection and auth state changes.
- Loading the user profile and active organization from `/api/me`.
- Loading organization classes, notifications, assignments, materials, and class messages from the web API.
- Loading active class live sessions from the web API.
- Polling notification updates through the web API for the active organization.
- Switching organizations and active classes.
- Sending class chat messages.
- Submitting text responses for assignments.
- Marking notifications as read.
- Requesting device notification permission and showing local device alerts for API-polled notification updates while the app is running.
- Joining native LiveKit rooms after validating access through the LiveKit token API.
- Marking teacher-started sessions live, sending heartbeats, and ending sessions through the web API.
There is still a direct Supabase client in the app, but it is used for authentication/session state rather than classroom table access. Keep future mobile data features behind `../Eduverse/app/api` routes unless they are purely local device concerns.

## Relationship To The Web App

The web app is the system of record for administration and heavier classroom workflows. The mobile app should remain a fast daily companion.

Keep these workflows in the web app:

- Organization creation and administration
- Class creation and archive management
- Deep analytics and history
- Exam authoring and management
- Feature and extension management
- Rich content editing
- Advanced file and material administration

Keep these workflows mobile-first:

- Today overview
- Notifications
- Class schedule and resource discovery
- Assignment status and simple submission
- Class chat and announcements
- Account settings and preferences

## Known MVP Limitations

- Chat message previews are currently loaded for the active class, so non-active class previews can be incomplete.
- Materials open through signed download URLs from the web API.
- Some settings toggles are local UI state and are not yet persisted to user preferences.
- Push notification settings are persisted locally, but true remote push delivery still needs a web API route/table for Expo push token registration and a server sender. Foreground notification updates are currently polled through the web API.
- Live sessions require an Expo development build because LiveKit WebRTC native modules are not available in Expo Go.
- Live sessions support audio/video room join, start, heartbeat, and end. Whiteboard and in-session chat are still web-only.
- Assignment submission supports text responses; file submission should be added through web API routes.
- The dashboard shows an offline-cache-ready label, but true offline caching is not implemented yet.

These are documented intentionally so future work can improve the mobile app without confusing MVP UI with complete production behavior.

## Recommended Next Steps

- Add mobile-specific dashboard and conversation summary endpoints.
- Add server-side Expo push token registration and delivery for background/killed-app notifications.
- Add native LiveKit whiteboard and in-session chat.
- Add chat media upload through the web API media route.
- Persist notification, language, theme, and offline preferences.
- Store messages by class id instead of using one global active-class message list.
- Add optimistic and error states for chat, assignment submission, notification reads, and organization switching.

## Troubleshooting

If Expo exits with `SIGKILL` or `zsh: killed`, check Node:

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

If environment values do not appear to update, restart Expo after changing `.env`. Expo public runtime values are read during startup.

## Project Status

Eduverse Mobile is a strong MVP foundation with real Supabase auth, domain data loading, NativeWind styling, responsive phone/tablet behavior, and a clean provider/service/screen/component structure. The next major step is moving server-sensitive workflows behind the Eduverse web API so mobile stays lightweight while the platform keeps validation and side effects centralized.
