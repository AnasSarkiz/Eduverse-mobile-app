# Eduverse Mobile App

Supporting mobile app for Eduverse, focused on the daily student and teacher workflow rather than duplicating every web feature.

## Stack

- React Native with Expo
- TypeScript
- NativeWind / Tailwind CSS
- Bun for dependency installation

## First MVP Scope

1. Auth and profile
2. Dashboard
3. Notifications
4. Courses and classes overview
5. Assignments and deadlines
6. Chat
7. Announcements
8. Settings

## Development

```sh
bun install
bun run start
```

Use the Expo CLI prompt to launch iOS, Android, or web.

## Test on Real Devices

Install Expo Go on the phone first:

- iPhone: install `Expo Go` from the App Store.
- Android: install `Expo Go` from Google Play.

Then start the project with a QR code:

```sh
bun run start:tunnel
```

Scan the QR code with the iPhone Camera app or the Expo Go scanner on Android. Use `bun run start:clear` if Metro gets stuck with old cache.

## Responsive Targets

The starter screen is tuned for:

- compact phones around 320-359 px wide
- common iPhone and Android phones around 360-430 px wide
- large phones and foldables
- tablet widths from 768 px and up

The app uses `useWindowDimensions` for runtime layout decisions and NativeWind for the visual system.
