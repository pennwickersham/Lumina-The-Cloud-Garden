#!/usr/bin/env bash
# One-time local bootstrap. Needs Node 20+, JDK 21 and the Android SDK.
set -e
cd "$(dirname "$0")/.."

echo "Installing dependencies..."
npm install

if [ ! -d android ]; then
  echo "Creating the Android project..."
  npx cap add android
fi

echo "Generating icons and splash screens..."
npx capacitor-assets generate --android || echo "  (skipped — check resources/icon.png)"

echo "Copying the game into the Android project..."
npx cap sync android

chmod +x android/gradlew

echo
echo "Done. To build a test APK:"
echo "    npm run apk"
echo "It lands at android/app/build/outputs/apk/debug/app-debug.apk"
