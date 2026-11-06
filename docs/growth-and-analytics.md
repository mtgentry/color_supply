# Growth, analytics, and checkout notes

Findings from an investigation on **2026-11-05** into why nobody has upgraded to a paid plan. Numbers are snapshots from that day; re-run the queries below to update them.

## Timeline

- **Dec 2024**: paid plans launched (Basic free, Hobbyist, Professional, Business) on the new Stripe account.
- **Feb 2025**: `/promo` "VIP Beta" campaign ended Feb 28, 2025. It drove most paid signups ever.
- **Mar 31, 2025**: last successful paid signup from the site checkout.
- **2026-11-05**: **color wheel added back** after years of being missing. It's rebuilt natively in Vue at `/wheel` (`pages/wheel.vue`, `components/wheel/`, `stores/wheel.js`, `lib/wheel/`), and `/app` now redirects to `/wheel` (`pages/app.vue`). On the same day, custom Amplitude events were added (see below). As of writing, these changes were uncommitted on the `app-new` branch, so check whether they've been deployed before comparing before/after numbers.

## Where the data lives

| Source | What it has | Notes |
|---|---|---|
| Amplitude, org "Color Supply", project `618519` | Page views, clicks, sessions (autocapture); custom events from 2026-11-05 | Free plan keeps **1 year** of data. Connected in Claude Code via the Amplitude MCP server (`https://mcp.amplitude.com/mcp`). |
| Stripe "Color Supply Vue" (`acct_1PCOUjIzqT7GUMtQ`) | **Current** account: plans, checkouts, subscriptions | Price IDs contain `IzqT7GUMtQ`. Webhook: `https://api.colorsupplyyy.com/stripe/webhook/<djstripe uuid>/` (enabled, all events). |
| Stripe "Color Supply" (`acct_1D1ofeCG5NgmoeWB`) | **Old** Rails-site account (2019–2021 products) | Not used by this app. Easy to log into by mistake. |
| Production DB | Users, favorites, palettes, dj-stripe tables | A local copy exists as `colorsupply_prod_copy` (Postgres, used by the local backend, so local testing writes into it). |
| Production logs | Django console logs | DigitalOcean App Platform → Runtime Logs. 500s are emailed to `ADMINS` if configured. |

**Known gap:** `users_user.last_login` is never updated (token login doesn't set it), so the DB can't show logins. Favoriting is the only activity signal in the DB.

## Findings (as of 2026-11-05)

### 1. A third of visitors hit a dead link
- In the 90 days to Nov 5, 2026, ~5,000 of 13,963 visitors (36%) landed on `/app`, mostly through direct links and backlinks (Medium, webdesign-trends.net, Facebook, Reddit, d2usign.com), not Google.
- `/app` used to redirect to `old.colorsupplyyy.com/app`, whose DNS points at an AWS load balancer that no longer exists, so those visitors got a browser error.
- Fixed by the `/app` → `/wheel` redirect (once deployed). **Watch `/wheel` traffic and retention after deploy.**

### 2. Visitors don't come back
- 4,000–7,000 visitors/month (Dec 2025–Jan 2026 ~6,300–7,000; Aug–Oct 2026 ~4,200–5,000).
- ~97% are new each month. Week-1 return: **1.1%**. Week-4: **0.3%**.
- Average session ~90 seconds.
- Top pages (unique visitors, 90 days): `/palettes` 7,763 · `/` 6,105 · `/app` ~5,000 · `/create` (→ Mix) 1,778 · `/visualize` 1,583 · `/pricing` 260 · `/signup` 78.
- Sources: no referrer 9,400 · Google 2,400 · Facebook ~400 · Bing ~370 · Medium 333.

### 3. Signups are a by-product of the favorite button
- 3,147 accounts total. Signups/month: 107–143 (Nov 2025–Mar 2026), down to 57 (Aug–Oct 2026).
- ~25% of signups ever favorite anything. 693 of 778 favoriters did so within an hour of signing up (the heart opens the signup dialog). Average 4 favorites.
- Repeat use: 81 favorited on 2+ days; 53 were still favoriting 30+ days after signup; 4–11 returning favoriters a month.
- Only 2 users have saved a palette from Mix.

### 4. Paid
- 10 subscriptions ever on the current Stripe account; **2 active** ($28/yr VIP Beta each, from Feb 2025).
- Site checkouts: Feb 2025, 7 opened / 3 paid. Mar 31, 2025, 1 paid. Apr 2025 to Nov 2026, **4 opened, 0 paid** (one card failure, two $0 checkouts for the free plan).
- 5 subscriptions were cancelled within ~2.5 minutes on 2026-06-06/07 (reason: requested), which looks like a manual cleanup. Worth confirming.
- A separate $199 Stripe Payment Link (`plink_1R7PTd…`) had ~37 checkouts Mar–May 2025, 2 paid. It isn't part of the app.

### 5. The favorites limit isn't enforced
- Plans advertise 20/50/100/500 favorites (Stripe product metadata `favorites`), but nothing checks it: `FavoritePaletteSerializer` saves without a check. The frontend handles an `Access limited` response, but the backend has never sent one.
- Only 23 free users have 20+ favorites (one has 217). Since so few reach it, the limit alone won't drive upgrades.

## Checkout code issues (not yet fixed)

In `color_supply_backend/core/plans/views.py`:
- The billing portal `return_url` is `https://example.com/account`, so paying users who click "Manage" end up at example.com afterwards.
- Checkout success/cancel URLs are built from the `Referer` header; a missing Referer raises a server error.
- Choosing the $0 Basic plan without a Stripe customer creates a $0 Stripe checkout.

In the frontend:
- No visible path to upgrading: no Pricing/Upgrade link in the nav; `/pricing` only offers free signup; plan selection is only reachable from the avatar menu ("Basic Plan" button → `/manage/plan`).
- The Basic product has no `order` metadata, so plan sorting is unreliable (the API returned Business first).

## Custom Amplitude events (added 2026-11-05)

Sent through `composables/trackEvent.js`. Every event also includes `page` (the URL path). In local dev, events are logged to the console as `[trackEvent]` instead, because Amplitude only loads in production. Keep emails and names out of event properties.

| Event | Fired from | Properties |
|---|---|---|
| Sign Up Opened | `stores/dialog.js` (`changeSignUpForm`) | `source` (favorite / promo / login), `forced`, `promo` |
| Sign Up Completed | `components/auth/SignUp.vue` | `source`, `from_favorite`, `promo` |
| Logged In | `components/auth/Login.vue` | – |
| Palette Favorited / Palette Unfavorited | `composables/favorite.js` (hearts on /palettes, /favorites, the preview, Visualize; after the server confirms); the wheel's heart, `components/wheel/SaveHeart.vue`; Mix's heart, `components/mix/Canvas.vue` | `palette_id`; `from: 'wheel'` (+ `scheme` when favorited) or `from: 'mix'` (+ `colors`, the count, when favorited); otherwise use `page` |
| Color Copied | `composables/clipboard.js` | `value` |
| Plan Selected | `components/manage/Plan.vue` | `plan`, `interval`, `price`, `current_plan`, `promo` |
| Checkout Started / Billing Portal Opened | `components/manage/Plan.vue` | same as above + `action` |
| Checkout Completed / Checkout Canceled | `pages/manage/plan.vue` (`?status=` on return from Stripe) | `plan` |
| Wheel Scheme Changed | `stores/wheel.js` | `scheme` |
| Wheel Palette Selected | `stores/wheel.js` | `scheme`, `slice`, `palette` |
| Section Time | `plugins/sectionTime.client.js`, for /palettes, /wheel, /mix, /visualize, /favorites | `section`, `seconds` (active time: tab visible, and no more than 60s past the last move, scroll, click or key), `interactions` (clicks + key presses), `ended_by` (navigate / hidden). Sent on leaving the section or hiding/closing the tab (beacon transport); a hidden tab ends the visit and coming back starts a new one. Visits under 1s (redirects) aren't sent. |
| Palettes Filtered | `stores/filter.js`, 1s after the last filter change | `style`, `qty_min`, `qty_max`, `color_tab` (color / wheel / list), `colors` (count, Color tab), `harmony` (Wheel and List tabs) |
| Mix Edited | `components/mix/Canvas.vue`, once per visit, on the first change the user makes (the intro's doesn't count) | `squares` |

Verified in local dev: Section Time, Palettes Filtered, Mix Edited (2026-11-06), Wheel Scheme Changed, Wheel Palette Selected, Color Copied, Sign Up Opened. Not yet exercised: Sign Up Completed, Logged In, favorites, plan/checkout events.

**User properties** (`plugins/amplitudeUser.client.js`, via `setUserProperties` in `composables/trackEvent.js`), updated on load and whenever the session changes: `logged_in`, `plan` (Basic / Hobbyist / Professional / Business / VIP Beta), `plan_interval` (paid plans only), `paid` (false for influencers, who get Professional free), `influencer`.

**User id:** on login the frontend calls `setAnalyticsUser`, which sets the Amplitude user id to `user-<database id>` (e.g. `user-2841`; Amplitude needs 5+ characters). To find who someone is, look up the number in `users_user` or Django admin. Emails and names are never sent. On logout the id is cleared and Amplitude's anonymous id reset, so the next person on that browser isn't counted as the same user. The backend's `UserSettingsSerializer` (the `session/` response) includes `id` for this (read-only); it shipped with this change, so production needs a backend deploy before user ids show up.

Page views are already autocaptured as `[Amplitude] Page Viewed` (property `[Amplitude] Page Path`), so there's no custom page event. They say a section was opened, not for how long: use Section Time for that (e.g. median `seconds` grouped by `section`, or the share of visits with `interactions` > 0).

## Open questions and next steps

1. Deploy `/wheel` and the `/app` redirect, then compare `/wheel` retention with the rest of the site.
2. Decide where paid conversion should happen. Visits are one-off (~90s, ~1% return), so a paywall during the first visit (export, unlimited Mix/Visualize, one-time "lifetime" price) may fit better than a monthly plan gated on favorites.
3. If keeping the favorites limit: enforce it in the backend and show an upgrade prompt. Decide what happens to the 23 users already over 20 (recommended: keep their favorites, block new ones).
4. Add an Upgrade/Pricing entry point to the nav.
5. Fix `last_login` so the DB records logins.
6. Fix the checkout issues listed above.
7. Consider emailing the ~3,100 signed-up users to test whether people return.

## Handy queries

Local DB (`psql -d colorsupply_prod_copy`):

```sql
-- Favorites per user
select user_id, count(*) from palettes_favoritepalette group by 1 order by 2 desc;

-- Signups by month
select date_trunc('month', date_joined), count(*) from users_user group by 1 order by 1;

-- Users linked to Stripe
select count(*) from users_user where customer_id is not null;
```

Amplitude: project `618519`. Useful charts are monthly `_active` vs `_new` users, retention `_new` → `_active` (weekly), and `[Amplitude] Page Viewed` grouped by `[Amplitude] Page Path` or `referring_domain`.
