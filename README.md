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

### Getting form submissions into the inbox

Right now **Request my free quote** opens the visitor's own email app with the request already written out to Bealspf@gmail.com; they press send. That works with no setup, but some visitors don't have an email app set up.

For submissions to arrive by email with no extra step for the visitor, use **Web3Forms** (free):

1. Go to https://web3forms.com, enter **Bealspf@gmail.com**, and copy the **access key** they email you.
2. Open `assets/js/main.js` and paste it between the quotes on the `WEB3FORMS_KEY` line near the top.

That's it. A hidden spam trap field is already in the form.

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

## Before launch

- **Remove the preview-only `noindex` line** near the top of `index.html` (marked `PREVIEW ONLY`), or search engines will ignore the site.
- Paste the Google **Ask for reviews** link into the review button.
- Optional: add the Web3Forms key so quote requests land straight in Bealspf@gmail.com.
- Upload `index.html` and the `assets` folder to the site root. All paths are relative, so it also works from a sub-folder.
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
