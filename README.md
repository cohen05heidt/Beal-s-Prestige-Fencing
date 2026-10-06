# Beals Prestige Fencing — website

A single-page website for **Beals Prestige Fencing**, a family-owned fence company serving all of Hall County and Jackson County, Georgia. *Your Property. Your Privacy. Our Craftsmanship.*

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
| Opening | A Higgsfield film loops behind the headline as a boomerang: posts, rails and cedar boards go up around an empty backyard (about 5 seconds), then it rewinds and builds again. The first time the fence is finished, an orange "string line" pulls tight under *Craftsmanship.* Phones get a tall crop of the same film. Pause / play button bottom right. |
| Promise strip | Family owned · 24/7 customer service · Residential & commercial · Free quotes · Hall & Jackson Counties. |
| Services | Residential, commercial, gates & repairs, complete fence overhaul, storm & emergency service. |
| Fence styles | All eight styles drawn as contractor elevation drawings: wood stockade, shadow box, board on board, 4 rail farm, cross buck farm, white vinyl, black aluminum, chain link. Aluminum and chain link have a **4 ft / 6 ft** switch that resizes the drawing. Every card has **Quote this style**, which jumps to the form with that style (and height) already picked. |
| About us | The family-owned story, plus a "Give us a call when…" list. |
| Our work | Photo gallery. Until a photo exists, each slot shows that style's drawing and "Photo coming soon". Click a photo to view it large. |
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

## Adding the photos

Drop photos into `assets/img/work/` with these exact names and they appear automatically (JPG, landscape, about 1600 px wide is plenty):

| File name | Shows as |
|---|---|
| `board-on-board.jpg` | Board on board |
| `shadow-box.jpg` | Shadow box |
| `white-vinyl.jpg` | White vinyl |
| `chain-link-and-shadow-box.jpg` | 6 ft chain link & wood shadow box |
| `wood-stockade.jpg` | Wood stockade |
| `black-aluminum.jpg` | Black aluminum |

To add more photos, copy one `<figure class="work-tile">…</figure>` block in `index.html` (search for `Our work`), then change the file name, the `alt` text and the caption.

**Family / crew photo:** save it as `assets/img/about.jpg` (landscape) and it appears in the About section.

**Logo:** the picket mark in `assets/img/mark.svg` is a stand-in. If the business has a logo, replace that file (square works best).

## Before launch

- **Remove the preview-only `noindex` line** near the top of `index.html` (marked `PREVIEW ONLY`), or search engines will ignore the site.
- Paste the Google **Ask for reviews** link into the review button.
- Optional: add the Web3Forms key so quote requests land straight in Bealspf@gmail.com.
- Upload `index.html` and the `assets` folder to the site root. All paths are relative, so it also works from a sub-folder.
- **Turn off the GitHub preview** once the real site is live: repo **Settings → Pages →** set the branch to **None** → Save.

## Editing content

- **Text** — everything is in `index.html`, in page order, with comments marking each section.
- **Colors and fonts** — the tokens at the top of `assets/css/style.css`.
- **Fence drawings** — generated by `assets/js/main.js` (search for `Fence elevation drawings`).

## Files

```
index.html                 the page
assets/css/style.css       all styling
assets/js/main.js          all interaction (vanilla JS)
assets/video/hero-wide.mp4 opening film, desktop (1912x1080, 10 s boomerang loop, 3.9 MB)
assets/video/hero-tall.mp4 opening film, phones (608x1080 centre crop, 1.2 MB)
assets/img/                film posters (first and last frame), share card, logo mark
assets/img/work/           project photos
preview-server.ps1         local preview server used by START-PREVIEW.bat
_src/                      full-size Higgsfield originals (not uploaded, ignored by git)
```

## Graphics

The opening film was generated with **Higgsfield**: GPT Image 2.5 for the "before" (empty yard) and "after" (fenced yard) stills of the same scene, then Kling 3.0 Pro animating between them as start and end frames. With ffmpeg it was sped up 2×, joined to a reversed copy of itself for the boomerang, and compressed to H.264. The house and yard are AI-generated, not a real property. Fence-style drawings are drawn in code. No stock photos and no third-party logos are used.
