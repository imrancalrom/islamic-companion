# Islamic Companion

A React Native (Expo) app for prayer times, adhan reminders, morning and evening adhkar, a dua library, and shareable images. Built from the Release 1 roadmap and screen designs.

## What works now

| Screen | What it does |
| --- | --- |
| **Prayer** | Today's times calculated on the phone (no internet) with a live countdown to the next prayer, a tick for each prayer prayed, and a bell to turn each reminder on or off. |
| **Adhkar** | Morning, evening and night lists. "Start with counter" steps through each dhikr with a big tap counter and vibration, then marks the session done for the day. |
| **Duas** | Categories (sleep, travel, eating, distress, illness) and search in Arabic (with or without vowel marks), Urdu or English. |
| **Create** | Turns any dhikr or dua into a post, story or square image in four colour themes and shares it. The text is always taken from the library, never typed in. |
| **Settings** | Location, 11 calculation methods (Umm al-Qura by default), Standard or Hanafi Asr, adhkar reminders. |
| **Tasbeeh** (More) | After-prayer (33·33·33 + tahlil, Muslim 597) and bedtime (33·33·34) sequences, or a free count with any phrase and target. Vibrates on each count, stronger every 33 and at the target. |
| **Prayer tracker** (More) | Last 7 days grid, current and best streak of days with all five prayers, and a qada counter per prayer. |
| **Qibla** (More) | Compass with the Kaaba direction calculated from your location; vibrates when you face it. |
| **Sunnah fasts** (More) | Mondays, Thursdays, White Days, Tasu'a, Ashura, Arafah and Shawwal from the Umm al-Qura calendar, with Eid and Tashriq days excluded, and a reminder the evening before. |
| **Jumu'ah** (More) | Friday practices with sources, a salawat counter, the last hour before Maghrib, and the full Surah Al-Kahf (Tanzil text). |
| **Hajj & Umrah** (More) | Step-by-step Umrah and Hajj al-Tamattu' guide with the duas for each step and tawaf, sa'i and jamarat counters. |

The Prayer screen also shows Duha, witr and last-third-of-the-night times, the next Sunnah fast, and a Friday banner. Optional reminders for Duha, Tahajjud, Sunnah fasts and Friday are in Settings.

Reminders: a notification at each prayer time, adhkar reminders 20 minutes after Fajr and Asr, and the optional Sunnah, fasting and Friday reminders. They are scheduled 5 days ahead (the soonest 60 at most, because iOS keeps at most 64 pending notifications) and topped up every time the app opens.

## Run it

You need Node.js 20 or newer and the **Expo Go** app on your phone (from the App Store or Google Play).

```bash
npm install
npx expo start
```

Scan the QR code with your phone's camera (iPhone) or the Expo Go app (Android). Your phone and computer must be on the same Wi-Fi.

`npx expo start --web` runs it in a browser, but location, notifications and image sharing only work on a phone.

### Checks

```bash
npm run typecheck     # TypeScript
npm run quran:check   # Quran text still matches Tanzil
npx expo-doctor       # dependency and config check
```

## Download the Android APK

Every push to `main` builds an APK on GitHub Actions (`.github/workflows/android-apk.yml`) and attaches it to a new pre-release on the repository's **Releases** page. You can also start a build from **Actions → Android APK → Run workflow**.

To install: open the release on your Android phone, download the `.apk`, open it and allow "Install unknown apps" when asked. The APK is built for 64-bit ARM phones (nearly every Android phone since 2017) and signed with a debug key, which is fine for testing but not for Google Play; for the store, build a signed `.aab` with EAS.

## Before publishing to the stores

1. **Scholar review of all content.** Every item in `src/data/adhkar.ts` and `src/data/duas.ts` is marked `reviewed: false`, and the app shows "pending scholar review" under it. Check the hadith Arabic word for word against the hadith book, and check every translation and grading. Set `reviewed: true` only after that.
2. **Quran text (done).** No Quran text is typed by hand. `npm run quran:import` builds `src/data/quran.generated.ts` from the Tanzil Project Uthmani text (v1.1, CC BY 3.0) using the passages listed in `scripts/quran-passages.json`, and `npm run quran:check` fails if the file ever differs from Tanzil. The Tanzil text in the package was cross-checked letter by letter against a second independent copy: all 6,236 ayat match. The app credits Tanzil under every Quran item and in Settings, as Tanzil's terms require. To add a Quran passage, add it to `quran-passages.json`, run the import, and use `QURAN['<id>'].text` with `script: 'quran'`.
3. **Adhan sound.** Add an adhan file (e.g. `assets/sounds/adhan.wav`, under 30 seconds for iOS) to the `expo-notifications` plugin in `app.json` under `"sounds"`, and set `sound: 'adhan.wav'` in `src/lib/notifications.ts`. On Android, rename the channel id when you change its sound, because Android locks a channel's sound once created.
4. **App identity.** Change `ios.bundleIdentifier` and `android.package` in `app.json` from `com.example.islamiccompanion` to your own, and replace the icons in `assets/`.
5. **Exact alarms on Android.** `SCHEDULE_EXACT_ALARM` is requested so the adhan fires on time. Google Play asks you to justify it; a prayer-time app qualifies as an alarm-type use.
6. **Build with EAS:** `npx eas-cli@latest build --platform all`, then `npx eas-cli@latest submit`.

## Project layout

```
src/
  app/                  Screens (Expo Router: each file is a route)
    (tabs)/             Prayer, Adhkar, Duas, Create
    dhikr/[session].tsx Adhkar counter
    dua/[id].tsx        Dua detail
    settings.tsx
  components/           Icon set and shared UI
  data/                 Adhkar and duas with sources — the only place religious text lives
    quran.generated.ts  Quran passages built from Tanzil (do not edit)
scripts/
  import-quran.mjs      Builds and checks the Quran text
  quran-passages.json   Which ayat the app uses
  lib/                  Prayer times (adhan), notifications, location, settings storage
  theme.ts              Colours and fonts
```

## Adding a dhikr or dua

Add an entry to `src/data/adhkar.ts` or `src/data/duas.ts` with its Arabic, Urdu, English, count, source and grade. For hadith, take the Arabic from the book, never from memory or an AI. For Quran, never type it: add it to `scripts/quran-passages.json` and run `npm run quran:import`. Keep `reviewed: false` until a scholar has checked it.

## Next steps (Release 1 roadmap)

- Home-screen widget with the next prayer
- Audio for each dhikr
- "Report an error" button that sends the item id to you
- Backend (Firebase or Supabase) to push content corrections without an app update
