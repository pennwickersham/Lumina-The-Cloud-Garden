# Lumina: The Cloud Garden — Developer Handoff

Oct 17, 2026 · @Pendleton Brewster Wickersham

## Summary

The game overhaul, the build fix, the signing change and the store listings are all on `main`, merged on 17 October 2026 in [pull request #1](https://github.com/pennwickersham/Lumina-The-Cloud-Garden/pull/1). New store and press screenshots, merged in [pull request #2](https://github.com/pennwickersham/Lumina-The-Cloud-Garden/pull/2), are in `store/screenshots/` and `docs/press/`. The release signing password is no longer in `android/app/build.gradle`, so **release builds are unsigned until you set it up** (Next steps, items 1 and 2).

| Area | What changed | Where |
| --- | --- | --- |
| Build | The debug APK workflow uses the committed `android/` project instead of re-creating it | `.github/workflows/android.yml` |
| Signing | The signing password comes from `~/.gradle/gradle.properties` or a GitHub secret; a new manual workflow builds the signed `.aab` | `android/app/build.gradle`, `.github/workflows/android-release.yml` |
| Game | Calmer notifications, pacing over days, a distinct look for every plant, long-term goals | `www/index.html` (copied to `android/app/src/main/assets/public/`) |
| Store | Listing text for both stores, and captioned screenshots at every required size | `store/`, `docs/press/` |

Test builds: every push to `main` and every pull request produces an installable debug APK under the run's **Artifacts** (`lumina-debug-apk`) on the [Actions tab](https://github.com/pennwickersham/Lumina-The-Cloud-Garden/actions).

## Build and signing

**Debug APK workflow.** Builds failed after `android/` was committed, because `npx cap add android` refuses to run when the folder exists. The workflow now skips that step, and icon generation, when `android/build.gradle` is present, so the committed icons are kept. It then runs `npx cap sync android` and `./gradlew assembleDebug`.

**Release signing.** `android/app/build.gradle` reads four values, each from a Gradle property first and then an environment variable:

| Name | Required | Default |
| --- | --- | --- |
| `LUMINA_KEYSTORE_PASSWORD` | Yes | none: without it, release builds come out unsigned |
| `LUMINA_KEY_PASSWORD` | No | the keystore password |
| `LUMINA_KEY_ALIAS` | No | `lumina` |
| `LUMINA_KEYSTORE_FILE` | No | `android/app/lumina-release.keystore` |

For local release builds, put the password in `~/.gradle/gradle.properties` on your machine (never in the repo):

```
LUMINA_KEYSTORE_PASSWORD=your-password-here
```

**Build release bundle workflow** (`.github/workflows/android-release.yml`). Run it by hand from the Actions tab. It reads the values above from repository secrets, and can also take the keystore itself from a `LUMINA_KEYSTORE_BASE64` secret so the key can leave the repo. It uploads `lumina-release-aab`, the file for Google Play. It has not run yet, because the secret does not exist yet.

**Security.** The repo is public, and the old keystore and its password are both in its history. Treat them as exposed and replace the upload key before the first Play release (Next steps).

## Game overhaul

The overhaul answers four problems found in play: constant pop-ups, a whole garden built in under ten minutes, plants that all looked alike, and nothing to aim for.

**Notifications.**

- `toast()` is a reply to a tap: shown at once, replacing whatever is up, with no queue and no progress bar.
- `event()` is the garden speaking: it always goes to the garden log (bell icon, top bar). It shows a banner only when asked to, for four rare moments: a found seed, a new cross, a letter, and a wisp that wants a name. Banners are limited to one every 3 minutes, never over an open sheet or pastime, and never when Comfort → **Quiet garden** is on.
- `note()` writes to the log only.
- About 20 messages that narrated something already on screen were removed or moved to the log.
- The log is saved in `S.log` (last 40 entries), with an unread dot from `S.logUnread`.

**Pacing.** Players come back over days instead of finishing in one sitting.

| Setting | Before | Now |
| --- | --- | --- |
| Time to first bloom | 2.5–15 min | 40 min – 18 h (trees ×1.8, conifers ×2, bushes ×1.3) |
| Stardust from a bloom | gift every 20 s | gift ×1.5 every 2 h, holds 4 (8 with Deep roots) |
| Tending tap | +20 s of growth, unlimited | +10% of bloom time, once per plant per 3 h |
| Beds at start | 8 (Cloud), 6 (others) | 4 (Cloud), 3 (others) |
| Growth while resting | ×1.5 | ×1, same as playing |
| Rest earned | 1 per 6 s | 1 per 30 s |
| Wisp / visitor / sky drifter checks | 45 s / 90 s / 110 s | 90 s (35% chance) / 4 min / 4 min |
| Cross-pollination | 12% per hour per pair | 3% per hour per pair, one new cross at a time |

A scripted player who visits at 8am and 8pm unlocks the Orchard Shelf on day 3, the Reed Bank on day 8 and the Windmill Rise on day 13.

**Plant art.** `plantSvg()` was replaced by a drawing system: each species in `PLANT_LOOK` has a **kind** that sets how it grows (flower, bulb, fern, vine, tall, bush, ground, succulent, kelp, crystal, reed, tree or conifer), a **leaf** and a **bloom** (24 shapes).

- Sprouts already show the species' shape.
- Plants are drawn about 1.6× larger than before and keep growing after first bloom: `maturityOf()` runs over 3–7 days by kind.
- Plants with `night:"open"` open only at dusk and night.
- `glow` plants get a pulsing halo at night, and `swing`, `frost` and `steam` add animations.
- Plots are layered back to front, and the painted parts of a plant are tappable.
- `plantIcon()` and `plantSilhouette()` draw plants for the Hut, the flora book and the share picture.

**Goals.**

- **Flora book** (Pastimes → Flora): all 47 plants grouped by how they are found, with a hint for each one not yet grown.
- Gold **pollen** drifts between neighbouring blooms that can cross. Once a cross has been found, it can be bought in the Hut for its gift × 22 stardust.
- **Four new plants** turn up only under conditions: the Rain Lily (20 minutes of rest in total, or summer rain), the Dawn Crocus (open the app at dawn, 5–8am), the Snowdrop (winter snow) and the Windflower (spring blossom). Each can be bought once found.
- **Letters from M.** arrive one at a time, at least 20 hours apart.
- A soft burst of light marks a new bloom in the garden, replacing the old "has opened" pop-up.

**Saves.** Save format v3. On load, a v2 garden rescales each plant's growth, so it stays at the same point in its life under the new bloom times. Existing bed counts are kept.

## Store screenshots and listing

All screenshots were retaken from the overhauled game and are on `main`, merged in [pull request #2](https://github.com/pennwickersham/Lumina-The-Cloud-Garden/pull/2) together with this handoff as `HANDOFF.md`. Each shot is a real capture with a caption above it. All are store-ready: exact pixel sizes, no transparency.

| Store slot | Shots | Size (px) | Folder |
| --- | --- | --- | --- |
| App Store, iPhone 6.9″ | 8 | 1320 × 2868 | `store/screenshots/appstore/iphone-6.9in/` |
| App Store, iPad 13″ | 6 | 2064 × 2752 | `store/screenshots/appstore/ipad-13in/` |
| Google Play, phone | 8 | 1080 × 1920 | `store/screenshots/googleplay/phone/` |
| Google Play, 7″ tablet | 6 | 1080 × 1920 | `store/screenshots/googleplay/tablet-7in/` |
| Google Play, 10″ tablet | 6 | 1440 × 2560 | `store/screenshots/googleplay/tablet-10in/` |
| Press, iPhone 6.5″ | 6 | 1284 × 2778 | `docs/press/ios-iphone65-*.png` |
| Press, iPad 12.9″ | 6 | 2048 × 2732 | `docs/press/ios-ipad13-*.png` |

Phone order: 1 energy check-in · 2 garden at night · 3 resting in the rain · 4 Flora book · 5 Lighting the Lanterns · 6 the Orchard Shelf at dusk · 7 the Moon Garden · 8 Comfort settings. Tablets drop the check-in and the Lanterns. The press files keep their old names and sizes, so links to them still work.

**Listing text** is in `store/listing.md`: names, descriptions, keywords, promotional text, App Review notes, suggested answers for the content rating and privacy forms, and the in-app product IDs. The description now says plants bloom over hours and days and mentions the Flora book. Every field passes `python3 store/check-lengths.py`. The Play feature graphic is `docs/lumina-banner.png`, and the 512 px Play icon is `store/googleplay-icon-512.png`.

## Code map

The whole game is still one file, `www/index.html`. Search for these names to find each system. After any change, run `npx cap copy android` so the committed Android copy matches.

| To change | Look for | Notes |
| --- | --- | --- |
| Bloom times | `PACE`, `SLOW_KIND` | `PACE` maps each species' old minute-scale `bloom` value to real time; `SLOW_KIND` multiplies by kind |
| Stardust rate | `YIELD_MS`, `HOLD`, `sp.gift` | Gifts are ×1.5 in the pacing block |
| Tending | `TEND_EVERY`, `tapPlot()` |  |
| Beds and their cost | `PLACES[*].beds`, `BED_COST` |  |
| Islands and their cost | `PLACES` |  |
| Ambient events | the `setInterval` calls in `boot()`, `POI_COOL` | Wisp, visitor, sky drifter and shooting star frequency |
| Rest rate | `SESSION.restAccum` in `tick()` | 30 s per rest point |
| Crosses | `HYBRIDS`, `crossPollinate()` | Chance per hour per adjacent pair |
| Found plants | `FOUND`, `findSeed()` | Their conditions live in `tick()`, `Clock.start()` and `boot()` |
| A plant's look | `PLANT_LOOK`, `KIND_SIZE`, `MATURE_DAYS` | Kind, leaf, bloom, flags (`night`, `glow`, `swing`, `frost`, `steam`, `lean`) |
| Plant drawing | `KINDS`, `BLOOMS`, `plantArt()` | One function per growth kind and per bloom shape |
| Messages | `toast()`, `event()`, `note()`, `Notify`, `Log` | A banner needs `true` as the last argument to `event()`; the minimum gap (180000 ms) is in `Notify.event` |
| Letters | `LETTERS`, `checkLetters()` | 20 h minimum gap |
| Flora book | `openFlora()`, `floraHow()` |  |
| Save migration | `load()`, `S.v` | v2 → v3 rescales growth using `OLD_BLOOM` |
| In-game guide | the guide pages, starting `{t:"The garden"` | Already updated for the new pacing |

For debugging on a device, `window.Lumina` exposes the game state (`Lumina.state()`), the plant drawing (`Lumina.art(species, stage, progress, maturity, {night})`) and other helpers.

## Next steps

Do the first three before building any release. The rest is roughly in launch order.

- [ ] **Set the signing password locally.** Add `LUMINA_KEYSTORE_PASSWORD=...` to `~/.gradle/gradle.properties` on any machine that builds releases. Without it, `npm run apk:release` produces an unsigned build that Play rejects.
- [ ] **Add the repository secret.** In GitHub, go to Settings → Secrets and variables → Actions and add `LUMINA_KEYSTORE_PASSWORD`. Then run **Build release bundle** once from the Actions tab to confirm it produces `lumina-release-aab`.
- [ ] **Replace the exposed upload key.** If nothing has gone to Play yet, generate a new key with `keytool -genkeypair -v -keystore lumina-upload.keystore -alias lumina -keyalg RSA -keysize 2048 -validity 10000`. Store it base64-encoded as the `LUMINA_KEYSTORE_BASE64` secret, update the password secret, and delete `android/app/lumina-release.keystore` from the repo. If a build has already been uploaded, request an upload key reset in Play Console under Test and release → App integrity.
- [x] **Merge the screenshots.** Done on 17 October 2026 in [pull request #2](https://github.com/pennwickersham/Lumina-The-Cloud-Garden/pull/2).
- [ ] **Play-test on a real phone for 2–3 days.** Install `lumina-debug-apk` from the latest Actions run. Check the pacing, that night flowers open after dark, that pop-ups stay rare, and the Flora book. Tune the numbers using the code map above.
- [ ] **Build and test iOS on a Mac.** Run `npx cap sync ios`, then open `ios/App` in Xcode. On iPad, the check-in and pastime screens sit to the left with empty space on the right; consider centring them before App Review.
- [ ] **Create the in-app products.** Create the 13 one-time products in App Store Connect and Play Console, with the IDs in `store/listing.md`, and attach them to the RevenueCat offering.
- [ ] **Start Google Play closed testing early.** Personal developer accounts created after 13 November 2023 need 12 testers opted in for 14 days in a row before production access.
- [ ] **Fill in both store listings** from `store/listing.md` and `store/screenshots/`, including the content rating, Data safety (Play) and App Privacy (Apple) forms.
- [ ] **Bump the version for every upload.** `versionCode` is currently 3 in `android/app/build.gradle`; the iOS build number is set in Xcode.
- [ ] **Check the support and privacy pages.** Confirm the GitHub Pages URLs in the listing open before you submit.
