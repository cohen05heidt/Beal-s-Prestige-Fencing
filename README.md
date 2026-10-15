# Beal’s Prestige Fencing — website

A single-page website for **Beal’s Prestige Fencing**, a family-owned fence company serving Hall County, Georgia and the surrounding counties. *Your Property. Your Privacy. Our Craftsmanship.*

Plain HTML, CSS and JavaScript. No build step, no frameworks, no dependencies. It runs on any static host (GitHub Pages, Netlify, Cloudflare Pages, Hostinger, and so on).

## Preview it

Double-click **`START-PREVIEW.bat`**. It starts a small local server (Windows PowerShell, nothing to install) and opens `http://localhost:8080/`. Leave the window open while you look around.

## Client preview link

**https://cohen05heidt.github.io/Beal-s-Prestige-Fencing/**

A preview of the work in progress, hosted free by GitHub Pages from the `main` branch of [cohen05heidt/Beal-s-Prestige-Fencing](https://github.com/cohen05heidt/Beal-s-Prestige-Fencing). It isn't the real website: it isn't on the business's domain, it carries a `noindex` tag so search engines skip it, and it updates a minute or two after each push. Anyone with the link can open it.

To switch it off: repo **Settings → Pages →** set the branch to **None** → **Save**.

## What's on the page

| Section | What it does |
|---|---|
| Opening | A Higgsfield time-lapse loops behind the headline: behind a white modern farmhouse, the fence line is staked out, posts go in, rails go on, the boards fill in and the gate is hung (about 6 seconds, no people in the shot). The finished fence holds for 3 seconds, then it rewinds quickly and builds again. The first time the fence is finished, a cream "string line" pulls tight under *Craftsmanship.* Phones and portrait tablets get a zoomed-out view: the headline sits on green at the top and a wide cut of the film (the whole house and fence) runs along the bottom. |
| Promise strip | Licensed & insured · Family owned · 24/7 customer service · Residential & commercial · Free quotes · Hall & surrounding counties. |
| Services | Residential, commercial, gates & repairs, complete fence overhaul, storm & emergency service. |
| Fence styles | Thirteen styles drawn in code as contractor elevation drawings (no photos), in four groups. Wood privacy: wood stockade, shadow box, board on board, horizontal wood. Decorative tops: scalloped privacy, arched top, lattice top (all 6 ft). Farm: 4 rail farm, 4 rail farm with wire, cross buck farm. Vinyl & metal: white vinyl, black aluminum, chain link. Aluminum and chain link have a **4 ft / 6 ft** switch that resizes the drawing. Every card has **Quote this style**, which jumps to the form with that style (and height) already picked. |
| About us | The family-owned story, plus a "Give us a call when…" list. |
| Our work | Six tiles of the company's own work, one per fence type. Click a tile to flip through its 2–3 photos. |
| Reviews | Review cards, a Google reviews badge, and a **Leave a Google review** banner. See *Reviews* below. |
| Free quote | Short quote form, plus click-to-call, **Text a photo**, email, and service area. |

On phones, a bar with **Call 24/7** and **Get a free quote** sticks to the bottom of the screen once you scroll past the opening.

Visitors with "reduce motion" or data saver turned on see the finished fence as a still instead of the film.

## Contact details

- Phone: **(770) 540-6190** (`tel:+17705406190`, also used for **Text a photo**)
- Email: **Bealspf@gmail.com**

Both appear in several places. To change one, search and replace across `index.html` and `assets/js/main.js` (the `QUOTE_EMAIL` and `PHONE` lines near the top).

## The quote button (phone vs. email)

Every **Get a free quote** button goes to the on-page quote form, and **Call 24/7** sits right next to it everywhere. That covers both kinds of customer:

- **Planned projects** (a new fence, a replacement) fill out the form. You get their name, phone, address, property type, style, height and length in writing, so you can price it or drive by before calling back.
- **Urgent jobs** (storm damage, a broken gate, a loose dog) tap **Call 24/7**. On a phone it's one tap.

**Text a photo** opens the phone's messages app addressed to the business, which is the fastest way to see a yard before quoting.

### Where form submissions go

On the live site, **Request my free quote** posts to `api/quote.php` on Hostinger, which:

1. **Saves the request to MySQL first** (table `quote_requests`, created automatically), so a lead is never lost even if email is down.
2. **Emails it to bealspf@gmail.com through Resend**, from `quotes@bealsprestigefence.com`. Replying to that email goes straight to the customer (when they gave an email).
3. Sends the customer a short confirmation email, if they gave one.

The visitor sees "sent" if either the save or the email worked. Inputs are validated and escaped, a hidden spam trap catches bots, and each visitor is limited to 5 requests per 10 minutes. Errors go to the server's PHP error log with a `[quote]` prefix; the visitor never sees technical details.

Where PHP isn't running (the GitHub preview, or opening `index.html` from disk), the form falls back to opening the visitor's email app with the request written out to Bealspf@gmail.com.

Secrets (database password, Resend API key) live only in `api/config.php` **on the server**. It is never committed; `api/config.example.php` shows the format.

## Reviews

The Google Business Profile is brand new, so there are no real reviews yet. The three review cards on the page are **samples, labeled "Sample"**, so the client can see the layout. They only show on previews (this computer and the GitHub preview link). On the real domain they hide automatically, and with no real reviews the section shows only the **Leave a Google review** banner, so the live site never shows reviews or a rating that don't exist.

When real Google reviews come in, in `index.html` (search `SAMPLE reviews`):

1. Replace a card's text, name and detail line with a real review (first name and town is plenty).
2. Remove `is-sample` from its `class` and delete its `<span class="chip-sample">Sample</span>`.
3. Delete any sample cards you don't replace.

Real cards show everywhere, including the live domain.

**Leave a Google review link:** in the Google Business Profile, choose **Ask for reviews** / **Get more reviews**, copy the short link (looks like `https://g.page/r/…/review`), and paste it as the button's `href` (search `Leave a Google review`). Until then the button opens a Google search for the business.

## Photos

The client sent 67 phone photos. The best 2–3 for each fence type are on the site; each **Our work** tile shows one cover photo, and clicking it opens that type's photos with previous / next arrows.

| Tile | Photos used (original file names) |
|---|---|
| Board on board | IMG_3309 (cover), IMG_3520, IMG_3289 |
| Shadow box | IMG_2544 (cover), IMG_3293, IMG_2547 |
| White vinyl | IMG_3373 (cover), IMG_3366, IMG_3368 |
| 6 ft chain link | IMG_3155 (cover), IMG_3157 |
| Wood stockade | IMG_4557 (cover, cropped to leave out the trash cans), IMG_4562 |
| Black aluminum | IMG_4574 (cover), IMG_4578, IMG_4577 |

None of the photos show chain link and shadow box on the same job (the dark fence next to the shadow box in IMG_3291 / IMG_3293 is black silt fence), so chain link has its own tile. Location data (GPS) was stripped from every photo.

All 67 photos, converted from iPhone HEIC to JPG, are in `_src/photos/jpg/` on this computer (not uploaded) in case you want to swap any.

**To add or swap a photo:** save it in `assets/img/work/` (about 1400 px on the long side is plenty), then add its path to the tile's `data-photos` list in `index.html` (search `Our work`). The first path in the list is the large version of the cover; the tile itself shows the `-1-sm.jpg` file.

**Family / crew photo:** save it as `assets/img/about.jpg` (landscape) and it appears in the About section.

**Logo:** the client's logo is `assets/img/logo.jpg` (original in `_src/logo-original.jpg`). It sits on its own green (#005200), so on the site's green sections it blends in with no visible box. `logo-160.jpg` is the top-bar size; `favicon-32.png`, `icon-192.png` and `apple-touch-icon.png` are the browser-tab and phone home-screen icons.

## Brand (matches the logo)

| | |
|---|---|
| Green | `#005200`, the logo's background. Top bar, dark sections, footer, and buttons on light sections. |
| Cream | `#FFFADD`, the logo's lettering. Text and buttons on green. |
| Headings and labels | **Trirong**, a classic Roman serif matching "PRESTIGE" in the logo. Headings at a light weight, small labels in spaced capitals. |
| Body text | Hanken Grotesk, a plain sans for easy reading. |

All of these are tokens at the top of `assets/css/style.css`.

## Going live: https://bealsprestigefence.com (Hostinger)

**How it's built.** `main` is the source and the GitHub Pages preview (with `noindex`). The live site is the **`deploy` branch**, produced by:

```bash
bash tools/build-deploy.sh --push
```

The script copies only what the live site needs (`index.html`, `assets/`, `api/quote.php`, `.htaccess`, `robots.txt`, `sitemap.xml`), removes the preview `noindex` tag, adds the canonical URL, and refuses to build if a placeholder, the `noindex` tag, or a `config.php` would ship. Run it after every change, then deploy in Hostinger (or let the Git webhook do it).

**One-time Hostinger setup** (Business plan, same account as the other client sites):

1. **Domain:** register `bealsprestigefence.com` (it's in the Hostinger cart: 3 years, $39.99, renews at $19.99/yr).
2. **Website:** Websites → Create site → empty PHP/HTML site on `bealsprestigefence.com`.
3. **Git deploy:** Advanced → GIT → repository `https://github.com/cohen05heidt/Beal-s-Prestige-Fencing.git`, branch **`deploy`**, install path **empty** (empty = `public_html` itself). `public_html` must be empty first (delete Hostinger's default `default.php` if present).
4. **Database:** Databases → Management → new MySQL database + user. Hostinger prefixes the names with the account id; note the database name, user and password.
5. **`api/config.php`:** File Manager → `public_html/api/` → New file `config.php`, one line:
   ```php
   <?php return ['db_host'=>'localhost','db_name'=>'DB_NAME','db_user'=>'DB_USER','db_pass'=>'DB_PASSWORD','mail_to'=>'bealspf@gmail.com','mail_from'=>"Beal's Prestige Fencing <quotes@bealsprestigefence.com>",'resend_api_key'=>'RESEND_API_KEY','business_phone'=>'(770) 540-6190','salt'=>'ANY_RANDOM_TEXT'];
   ```
6. **Resend DNS** (domain already added in Resend, region us-east-1): in Hostinger's DNS zone for the domain add
   | Type | Name | Value |
   |---|---|---|
   | TXT | `resend._domainkey` | `p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDdctqx/m8A4U+NmXPFRSfH8fdfKbL5+9zWR5p+cZ/497Wa/yQwV4AcVkzfCi/FslDFP461LbwJJRxhpnRDVdt6TT7LaudfFCh3mr67L5gMsHn/Xgyr4DY95SKhb07NyiZBQjiEWbWsMw9IMuWR75lxw8eQkO7dqJ15Jm5tr3ulLQIDAQAB` |
   | CNAME | `send` | `send.forge.rmta.net` |
   | CNAME | `rsend` | `rsend.forge.rmta.net` |
   | TXT | `_dmarc` | `v=DMARC1; p=none;` |

   Then click **Verify DNS Records** in Resend. DKIM can take 5–30 minutes. Do not add Resend's "MX @" record; that is only for receiving mail.
7. **Resend API key:** Resend → API keys → create a key with **Sending access** limited to `bealsprestigefence.com`; paste it into `config.php`.

**After launch checks:** `https://bealsprestigefence.com/api/config.php` must return 403 or 404; submit a test quote and confirm it in Resend → Emails (check the `to` address); `http://` and `www.` must redirect to `https://bealsprestigefence.com/`.

Also:
- Paste the Google **Ask for reviews** link into the review button.
- **Turn off the GitHub preview** once the real site is live: repo **Settings → Pages →** set the branch to **None** → Save.

## Editing content

- **Text** — everything is in `index.html`, in page order, with comments marking each section.
- **Colors and fonts** — the tokens at the top of `assets/css/style.css`.
- **After editing CSS or JS**, bump the `?v=` number on the `style.css` and `main.js` links at the top and bottom of `index.html` so browsers fetch the new files.
- **Fence drawings** — generated by `assets/js/main.js` (search for `Fence elevation drawings`).

## Files

```
index.html                 the page
assets/css/style.css       all styling
assets/js/main.js          all interaction (vanilla JS)
assets/video/hero-wide.mp4     opening film, desktop and landscape (1600x900, 10.5 s loop)
assets/video/hero-portrait.mp4 opening film, phones and portrait tablets (1200x1080 wide centre cut)
assets/img/                film posters (first and last frame), share card, logo mark
assets/img/work/           project photos (full size + small cover per type)
api/quote.php              quote form endpoint (MySQL + Resend); api/config.php is server-only
tools/build-deploy.sh      builds the live copy and publishes the deploy branch
preview-server.ps1         local preview server used by START-PREVIEW.bat
_src/                      full-size Higgsfield originals (not uploaded, ignored by git)
```

## Graphics

The opening film was generated with **Higgsfield** as a five-step build:

1. A base drone-style photo of an empty backyard (FLUX 3), with the house then changed to a white modern farmhouse (Nano Banana 2.1).
2. Five edits of that same photo, one per stage: layout stakes and string line, posts set in concrete, rails, boards on half the fence, finished fence with a double gate (Nano Banana 2.1). The boards copy the style of the client's real fence (IMG_3520, pressure-treated pine with dog-ear tops).
3. Kling 3.0 Pro animated each stage into the next as a clean time-lapse with no people, five 5-second clips.
4. With ffmpeg the clips were joined, trimmed where nothing moves, sped up 3.4× (6-second build), given a 3-second hold on the finished fence and a quick 1.5-second rewind, then compressed to H.264.

The stage stills are in `_src/gen2/` (`stage0-empty.png` … `stage5-finished.png`). The house and yard are AI-generated, not a real property. Fence-style drawings are drawn in code. The **Our work** photos are the client's own jobs. No stock photos and no third-party logos are used.

**Service area wording:** the site says "Hall and surrounding counties" everywhere visitors read it. The hidden business details for Google (the `application/ld+json` block in `index.html`) still list Hall County and Jackson County as service areas, which helps the business show up in local searches in both.

**Licensed & insured** appears in five places: a shield badge under the buttons in the opening (visible without scrolling), first in the promise strip, in the About text, in the line beside the quote form, and in the footer. If the business ever wants to show a license number, the badge text in `index.html` (search `hero-trust`) is the place to add it.
