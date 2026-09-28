# Lumina: The Cloud Garden: store listings

Everything to paste into Google Play Console and App Store Connect. Character
counts were checked against each store's limit (`python3 store/check-lengths.py`).
Screenshots are in `store/screenshots/`, one folder per required size.

Links (the GitHub Pages site built from `docs/`):

- Marketing / website: https://pennwickersham.github.io/Lumina-The-Cloud-Garden/
- Support: https://pennwickersham.github.io/Lumina-The-Cloud-Garden/support.html
- Privacy policy: https://pennwickersham.github.io/Lumina-The-Cloud-Garden/privacy.html
- Contact email: info@brewsterwickershampublications.com

---

## Shared long description

Used as the Google Play "Full description" and the App Store "Description".

<!-- description:start -->
Lumina is a small island in the sky that keeps growing whether or not you show up.

Each time you open it, Lumina asks one question: how is your energy today? The game shapes itself around your answer. On better days, everything is open: planting, puzzles and exploring. On in-between days, the island gets lighter and hints stay on. On hard days, rain falls, the garden tends itself, and resting is the whole game.

There are no streaks, no daily goals and no timers. Nothing wilts while you are away, and nothing is owed when you come back.

Lumina was made for people living with chronic illness, pain, fatigue or migraine, and for anyone who wants a game that asks very little of them.

A GARDEN THAT WAITS FOR YOU
• Plant seeds and watch them bloom over minutes, not days
• Collect stardust from your flowers and rest from quiet time
• Meet visitors: a fox, an owl, a tree frog, a hummingbird, fireflies and more
• Find letters tucked around the island and keep them in Field Notes

NINE ISLANDS TO FIND
From the Orchard Shelf to the Reed Bank and the Windmill Rise. The Crystal Caverns are dark by design, for light-sensitive days. The Hot Spring Terraces are built to feel like warmth on a sore joint. The Moon Garden opens only to people who have rested.

GENTLE PASTIMES
Wind chimes, star threads, tide pools, seed sorting, stream stones, a firefly jar, cloud shapes, a mosaic laid six stones a day, stone polishing and short trail expeditions. None of them can be failed or timed out. Leave in the middle and they wait for you.

COMFORT, YOUR WAY
• Low light, screen warmth and five colour palettes, including high contrast
• Separate volume for sound, weather and music, with softened high notes
• Bigger text, bigger things to tap, and a left-handed layout

NO ADS, NO ACCOUNTS, NO TRACKING
There is no sign-up and no advertising. Your garden is backed up under an anonymous device identifier, so it survives a reinstall. Lumina is free to play, with optional one-time purchases for rare plants and island packs. There are no subscriptions, and nothing ever expires.

Lumina is a game, not a medical device, and it does not give medical advice.
<!-- description:end -->

---

## Google Play

| Field | Text |
|---|---|
| App name (30) | <!-- play:title -->Lumina: The Cloud Garden<!-- /play:title --> |
| Short description (80) | <!-- play:short -->A gentle sky garden that adapts to your energy. No streaks, no timers.<!-- /play:short --> |
| Full description (4000) | The shared long description above |
| App or game | Game |
| Category | Casual |
| Tags (pick from Play's list) | Casual, Relaxing, Simulation |
| Contact email | info@brewsterwickershampublications.com |
| Website | https://pennwickersham.github.io/Lumina-The-Cloud-Garden/ |
| Privacy policy | https://pennwickersham.github.io/Lumina-The-Cloud-Garden/privacy.html |

**Graphics**

| Asset | File |
|---|---|
| App icon, 512×512 | `store/googleplay-icon-512.png` |
| Feature graphic, 1024×500 | `docs/lumina-banner.png` |
| Phone screenshots (7) | `store/screenshots/googleplay/phone/` (1080×1920) |
| 7-inch tablet screenshots (5) | `store/screenshots/googleplay/tablet-7in/` (1080×1920) |
| 10-inch tablet screenshots (5) | `store/screenshots/googleplay/tablet-10in/` (1440×2560) |

**Release notes for the first release (500)**

<!-- play:notes -->
The first release of Lumina. Your island is waiting.
<!-- /play:notes -->

### Play Console forms

**Target audience and content.** Choose 18 and over only. The privacy policy
says Lumina is not directed at children, and picking younger age groups pulls
the app into Google's Families policy.

**Content rating (IARC questionnaire).** Category: Game. Answer "No" to
violence, fear, sexuality, language, controlled substances and gambling. There
is no user-to-user chat and no shared user content. Say "Yes" to in-app
purchases (digital goods). This should come out as Everyone / PEGI 3.

**Ads.** No, the app does not contain ads.

**Data safety.** Suggested answers, taken from the privacy policy:

| Question | Answer |
|---|---|
| Does the app collect or share user data? | Yes, it collects (see below). It shares nothing. |
| Is all data encrypted in transit? | Yes |
| Can users request deletion? | Yes, by emailing info@brewsterwickershampublications.com |
| Device or other IDs | Collected (the Android ID, used as the backup key). Purpose: App functionality. Required. |
| App activity → Other actions | Collected (game progress backup). Purpose: App functionality. Required. |
| Financial info → Purchase history | Collected (through RevenueCat, a service provider). Purpose: App functionality. Required only for buyers. |
| Everything else (location, personal info, health, contacts, photos, messages, audio, files, calendar, web history) | Not collected |

Service providers acting on your behalf (Google Firebase, RevenueCat) count as
collection, not sharing, so "shared" stays No.

**Closed testing requirement.** Personal developer accounts created after
13 November 2023 must run a closed test with at least 12 testers opted in for
14 continuous days before Production can be requested. Start this as soon as a
signed bundle is uploaded.

**In-app products** (Monetize → Products → In-app products, all one-time):
see the product table at the end.

---

## App Store

| Field | Text |
|---|---|
| Name (30) | <!-- ios:name -->Lumina: The Cloud Garden<!-- /ios:name --> |
| Subtitle (30) | <!-- ios:subtitle -->A gentle game for hard days<!-- /ios:subtitle --> |
| Keywords (100) | <!-- ios:keywords -->cozy,relaxing,calm,spoonie,chronic illness,fatigue,pain,migraine,rest,idle,plants,island,sky<!-- /ios:keywords --> |
| Description (4000) | The shared long description above |
| Primary category | Games → Casual |
| Secondary category | Games → Simulation |
| Support URL | https://pennwickersham.github.io/Lumina-The-Cloud-Garden/support.html |
| Marketing URL | https://pennwickersham.github.io/Lumina-The-Cloud-Garden/ |
| Privacy policy URL | https://pennwickersham.github.io/Lumina-The-Cloud-Garden/privacy.html |
| Copyright | 2026 Brewster Wickersham Publications LLC |
| Price | Free (with in-app purchases) |

Keywords skip the words already in the name and subtitle (Lumina, cloud, garden,
gentle, game, hard, days), because Apple indexes those anyway. Separate them with
commas only, no spaces.

**Promotional text (170).** This can be changed any time without a new build.

<!-- ios:promo -->
A small island in the sky that grows while you're away. Tell it how much energy you have, and it asks no more than that. No streaks, no timers, no ads.
<!-- /ios:promo -->

**What's New (4000)**

<!-- ios:whatsnew -->
The first release of Lumina. Your island is waiting.
<!-- /ios:whatsnew -->

**Screenshots**

| Slot | Folder |
|---|---|
| iPhone 6.9" display (7) | `store/screenshots/appstore/iphone-6.9in/` (1320×2868) |
| iPad 13" display (5) | `store/screenshots/appstore/ipad-13in/` (2064×2752) |

App Store Connect scales these down for smaller iPhones and iPads, so these two
sets cover every device. The iPad set is required because the Xcode project
targets iPhone and iPad (`TARGETED_DEVICE_FAMILY = "1,2"`).

### App Store Connect forms

**Age rating.** Answer "None" to every content question and "No" to unrestricted
web access, user-generated content and gambling. Expect 4+.

**App Privacy ("nutrition label").** Suggested answers:

| Data type | Collected? | Linked to the user? | Used for tracking? | Purpose |
|---|---|---|---|---|
| Identifiers → Device ID (identifier for vendor) | Yes | Yes | No | App Functionality |
| User Content → Gameplay Content | Yes | Yes | No | App Functionality |
| Purchases → Purchase History | Yes | Yes | No | App Functionality |
| Everything else | No | | | |

"Linked" is the safe answer, because the backup and purchase records are stored
under an identifier for the device. Nothing is used for tracking, so the app
does not need the App Tracking Transparency prompt.

**App Review notes.**

<!-- ios:review -->
Lumina needs no account or sign-in. On launch it asks "How is your energy today?"; any answer opens the island. Choose "I have some energy" to see every feature. Pastimes are under the Pastimes button, settings under Comfort, and the optional one-time purchases in the Hut (Seeds tab) and under Places. Progress is backed up to Firebase under the identifier for vendor, with no personal data.
<!-- /ios:review -->

---

## In-app products (both stores)

Create each product with exactly this ID in App Store Connect (type
Non-Consumable) and in Play Console (one-time product), then attach them to the
RevenueCat offering the app reads. The prices below are the fallbacks written into
the app; the stores' localised prices replace them once RevenueCat is live.

| Product ID | Name | Price | Description |
|---|---|---|---|
| `plants_all` | All ten rare plants | $2.99 | Every rare plant variety at once. Yours to keep. |
| `pack_farsky` | The Far Sky pack | $2.99 | The Alpine Retreat and the Crystal Caverns, with four plants between them. |
| `pack_warmwaters` | The Warm Waters pack | $2.99 | The Tidal Shallows and the Hot Spring Terraces, with four plants between them. |
| `plant_sunmantle` | Sunmantle | $0.99 | Holds a whole afternoon of light and gives it back after dark. |
| `plant_nightjasmine` | Night Jasmine | $0.99 | You will smell it before you find it. |
| `plant_cinderbell` | Cinder Bell | $0.99 | Warm to hold. It rings low, like a woodstove settling. |
| `plant_seaglass` | Seaglass Fern | $0.99 | Every frond is a slightly different green. Nobody knows why. |
| `plant_copperthistle` | Copper Thistle | $0.99 | Prickly, stubborn, and the wisps adore it anyway. |
| `plant_glacierlily` | Glacier Lily | $0.99 | Opens on the coldest morning of the year and not before. |
| `plant_foxfire` | Foxfire Moss | $0.99 | Faint green light at the base of things. Easy to miss, hard to forget. |
| `plant_bellheather` | Bell Heather | $0.99 | Grows in drifts. One is never really one. |
| `plant_starwell` | Starwell Iris | $0.99 | Deep blue, and deeper the longer you look at it. |
| `plant_emberlace` | Emberlace | $0.99 | Burns slowly all winter without ever going out. |
