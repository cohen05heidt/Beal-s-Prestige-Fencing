/* Beals Prestige Fencing - all page interaction. Plain JavaScript, no libraries. */
(() => {
  'use strict';

  // ---------------------------------------------------------------------------
  // Quote form delivery
  // Paste a free Web3Forms access key here (https://web3forms.com, the key is emailed
  // to the business inbox) and quote requests arrive by email without the visitor's
  // email app. Left empty, "Request my free quote" opens the visitor's email app instead.
  const WEB3FORMS_KEY = '';
  const QUOTE_EMAIL = 'Bealspf@gmail.com';
  const PHONE = '(770) 540-6190';
  // ---------------------------------------------------------------------------

  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => [...root.querySelectorAll(s)];
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const saveData = !!(navigator.connection && navigator.connection.saveData);

  /* ======================= Top bar ======================= */
  const nav = $('#nav');
  const navToggle = $('#navToggle');
  const onScroll = () => nav.classList.toggle('is-solid', window.scrollY > 24);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  const setMenu = (open) => {
    nav.classList.toggle('is-open', open);
    navToggle.setAttribute('aria-expanded', String(open));
  };
  navToggle.addEventListener('click', () => setMenu(!nav.classList.contains('is-open')));
  $$('#navLinks a').forEach((a) => a.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setMenu(false); });

  /* ======================= Hero film ======================= */
  // The Higgsfield film is a boomerang loop: the fence builds around the empty yard in the
  // first half, then rewinds in the second. The first time the fence is finished, the
  // string line pulls tight under "Craftsmanship." and stays.
  const hero = $('.hero');
  const video = $('#heroVideo');
  const poster = $('#heroPoster');
  const playBtn = $('#heroPlay');
  const playLabel = $('.hero-play-label', playBtn);
  const tall = matchMedia('(max-width: 699px)').matches;

  const setBtn = (state) => { // 'pause' | 'paused'
    playBtn.hidden = false;
    playBtn.classList.toggle('is-paused', state === 'paused');
    playLabel.textContent = state === 'pause' ? 'Pause video' : 'Play video';
  };

  const showFinished = () => {
    const source = poster.parentElement.querySelector('source');
    if (source) source.srcset = video.dataset.endTall;
    poster.src = video.dataset.endWide;
    hero.classList.add('is-strung');
  };

  if (reduceMotion || saveData) {
    showFinished();
  } else {
    video.src = tall ? video.dataset.srcTall : video.dataset.srcWide;
    video.loop = true;
    video.muted = true;
    video.addEventListener('playing', () => {
      hero.classList.add('is-playing');
      setBtn('pause');
    });
    const stringWhenBuilt = () => { // the fence is complete just before the halfway point
      if (video.duration && video.currentTime >= video.duration / 2 - 0.35) {
        hero.classList.add('is-strung');
        video.removeEventListener('timeupdate', stringWhenBuilt);
      }
    };
    video.addEventListener('timeupdate', stringWhenBuilt);
    video.addEventListener('error', showFinished);
    let retried = false;
    const start = () => {
      const attempt = video.play();
      if (attempt && attempt.catch) attempt.catch(blocked);
    };
    const blocked = () => {
      // A tab opened in the background may refuse until it's visible: try once more then.
      if (!retried && document.visibilityState === 'hidden') {
        retried = true;
        document.addEventListener('visibilitychange', start, { once: true });
        return;
      }
      // Autoplay refused (e.g. iPhone low-power mode): show the finished fence and offer play.
      showFinished();
      setBtn('paused');
    };
    start();
  }

  playBtn.addEventListener('click', () => {
    if (video.paused) {
      video.play();
    } else {
      video.pause();
      setBtn('paused');
    }
  });

  /* ======================= Fence elevation drawings ======================= */
  // Each style is drawn as a contractor's elevation (front view) on graph paper.
  // viewBox is 320 x 170; the ground line sits at y = G; S pixels = one foot.
  const G = 146, S = 15;
  let uid = 0;
  const f = (n) => Math.round(n * 10) / 10;
  const rect = (x, y, w, h, cls, extra = '') => `<rect x="${f(x)}" y="${f(y)}" width="${f(w)}" height="${f(h)}" class="${cls}"${extra}/>`;
  const poly = (pts, cls) => `<polygon points="${pts.map((p) => p.map(f).join(',')).join(' ')}" class="${cls}"/>`;
  const line = (x1, y1, x2, y2, cls) => `<line x1="${f(x1)}" y1="${f(y1)}" x2="${f(x2)}" y2="${f(y2)}" class="${cls}"/>`;
  const postsAt = (x0, x1, bays, w) => Array.from({ length: bays + 1 }, (_, k) => x0 + k * (x1 - x0 - w) / bays);

  const ground = () => {
    let s = line(10, G, 310, G, 'e-ground');
    for (let x = 16; x <= 306; x += 9) s += line(x, G + 1.5, x - 5, G + 7, 'e-hatch');
    return s;
  };

  const dimension = (top, ft) => {
    const x = 30, mid = (top + G) / 2;
    return line(x, top, x, G, 'e-dim') +
      line(x - 5, top, x + 16, top, 'e-dim') + line(x - 5, G, x + 5, G, 'e-dim') +
      `<path d="M${x - 3} ${f(top + 7)} L${x} ${f(top)} L${x + 3} ${f(top + 7)}" class="e-dim"/>` +
      `<path d="M${x - 3} ${G - 7} L${x} ${G} L${x + 3} ${G - 7}" class="e-dim"/>` +
      `<g transform="rotate(-90 ${x} ${f(mid)})">${rect(x - 19, mid - 7, 38, 14, 'e-dim-bg')}` +
      `<text x="${x}" y="${f(mid + 4)}" text-anchor="middle" class="e-dim-text">${Math.round(ft)}'-0"</text></g>`;
  };

  const draw = {
    stockade() {
      const top = G - 6 * S, x0 = 34, x1 = 286, n = 28, bw = (x1 - x0) / n;
      let s = '';
      for (let i = 0; i < n; i++) {
        const x = x0 + i * bw;
        s += poly([[x, top + 5], [x + bw / 2, top], [x + bw, top + 5], [x + bw, G], [x, G]], i % 3 === 1 ? 'e-wood-2' : 'e-wood');
      }
      return s;
    },

    shadowbox() {
      const top = G - 6 * S, x0 = 34, x1 = 286, pw = 9, p = 13, bw = 8;
      let s = postsAt(x0, x1, 3, pw).map((px) => rect(px, top, pw, G - top, 'e-post')).join('');
      for (let x = x0 + 2 + p / 2; x + bw <= x1 - 1; x += p) s += rect(x, top + 4, bw, G - top - 7, 'e-wood-back');
      [top + 11, (top + G) / 2 - 2, G - 17].forEach((y) => { s += rect(x0, y, x1 - x0, 5, 'e-post'); });
      for (let x = x0 + 2; x + bw <= x1 - 1; x += p) s += rect(x, top + 4, bw, G - top - 7, 'e-wood');
      s += rect(x0 - 3, top - 1, x1 - x0 + 6, 5, 'e-post');
      return s;
    },

    boardonboard() {
      const top = G - 6 * S, x0 = 34, x1 = 286, pw = 10;
      const posts = postsAt(x0, x1, 3, pw);
      let s = posts.map((px) => rect(px, top - 4, pw, G - top + 4, 'e-post')).join('');
      for (let k = 0; k < 3; k++) {
        const b0 = posts[k] + pw, b1 = posts[k + 1], bwid = b1 - b0;
        s += rect(b0, top + 5, bwid, G - top - 11, 'e-wood-back');
        for (let x = b0 + 2; x + 9 <= b1 - 1; x += 13) s += rect(x, top + 5, 9, G - top - 11, 'e-wood');
        s += rect(b0, top, bwid, 6, 'e-wood-2');
        s += rect(b0, G - 6, bwid, 6, 'e-wood-back');
      }
      s += rect(x0 - 3, top - 7, x1 - x0 + 6, 4, 'e-post');
      posts.forEach((px) => { s += rect(px - 2, top - 10, pw + 4, 4, 'e-post'); });
      return s;
    },

    fourrail() {
      const top = G - 4.5 * S, x0 = 34, x1 = 286, pw = 7;
      let s = postsAt(x0, x1, 4, pw).map((px) => rect(px, top - 4, pw, G - top + 4, 'e-post')).join('');
      for (let k = 0; k < 4; k++) {
        const y = top + k * (G - 20 - top) / 3;
        s += rect(x0 - 5, y, x1 - x0 + 10, 7, k % 2 ? 'e-wood-2' : 'e-wood');
      }
      return s;
    },

    crossbuck() {
      const top = G - 4 * S, x0 = 34, x1 = 286, pw = 9, rh = 7;
      const posts = postsAt(x0, x1, 3, pw);
      let s = posts.map((px) => rect(px, top - 5, pw, G - top + 5, 'e-post')).join('');
      const yT = top + rh, yB = G - 21;
      for (let k = 0; k < 3; k++) {
        const b0 = posts[k] + pw + 1, b1 = posts[k + 1] - 1;
        s += line(b0, yT, b1, yB, 'e-brace') + line(b0, yB, b1, yT, 'e-brace');
        s += line(b0, yT, b1, yB, 'e-brace-face') + line(b0, yB, b1, yT, 'e-brace-face');
      }
      s += rect(x0 - 4, top, x1 - x0 + 8, rh, 'e-wood') + rect(x0 - 4, yB, x1 - x0 + 8, rh, 'e-wood');
      return s;
    },

    vinyl() {
      const top = G - 6 * S, x0 = 34, x1 = 286, pw = 11;
      const posts = postsAt(x0, x1, 3, pw);
      let s = '';
      for (let k = 0; k < 3; k++) {
        const b0 = posts[k] + pw, b1 = posts[k + 1], bwid = b1 - b0;
        s += rect(b0, top + 1, bwid, G - top - 2, 'e-vinyl');
        for (let x = b0 + 9; x < b1 - 3; x += 9) s += line(x, top + 8, x, G - 8, 'e-vinyl-line');
        s += rect(b0, top + 1, bwid, 7, 'e-vinyl') + rect(b0, G - 8, bwid, 7, 'e-vinyl');
      }
      posts.forEach((px) => {
        s += rect(px, top - 3, pw, G - top + 3, 'e-vinyl');
        s += poly([[px - 2, top - 3], [px + pw + 2, top - 3], [px + pw + 2, top - 7], [px + pw / 2, top - 11], [px - 2, top - 7]], 'e-vinyl');
      });
      return s;
    },

    aluminum(ft) {
      const top = G - ft * S, x0 = 52, x1 = 298, pw = 6;
      const posts = postsAt(x0, x1, 3, pw);
      let s = '';
      for (let x = x0 + 5; x < x1 - 3; x += 7) {
        if (posts.some((px) => x > px - 3 && x < px + pw + 1)) continue;
        s += rect(x, top, 1.9, G - top - 5, 'e-alu');
      }
      [top, top + 7, G - 13].forEach((y) => { s += rect(x0, y, x1 - x0, 2.8, 'e-alu'); });
      posts.forEach((px) => { s += rect(px, top - 4, pw, G - top + 4, 'e-alu') + rect(px - 1.5, top - 7, pw + 3, 3, 'e-alu'); });
      return s + dimension(top, ft);
    },

    chainlink(ft) {
      const top = G - ft * S, x0 = 52, x1 = 298, id = `mesh${++uid}`;
      let s = `<defs><pattern id="${id}" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="translate(${x0} ${f(top)})">` +
        `<path d="M0 0L7 7M7 0L0 7" class="e-mesh"/></pattern></defs>`;
      s += `<rect x="${x0}" y="${f(top + 1)}" width="${x1 - x0}" height="${f(G - top - 3)}" fill="url(#${id})"/>`;
      s += line(x0, G - 2, x1, G - 2, 'e-wire');
      s += rect(x0, top - 1, x1 - x0, 3.2, 'e-steel', ' rx="1.5"');
      postsAt(x0, x1, 3, 4).slice(1, -1).forEach((px) => { s += rect(px, top - 2, 4, G - top + 2, 'e-steel', ' rx="2"'); });
      [x0 - 3, x1 - 3].forEach((px) => { s += rect(px, top - 6, 6, G - top + 6, 'e-steel', ' rx="3"') + rect(px - 1, top - 8, 8, 3, 'e-steel', ' rx="1.5"'); });
      return s + dimension(top, ft);
    },
  };

  const render = (svg, ft) => {
    const kind = svg.dataset.fence;
    svg.setAttribute('viewBox', '0 0 320 170');
    svg.innerHTML = ground() + draw[kind](ft || Number(svg.dataset.ft) || 6);
  };

  const makeDrawing = (kind) => {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.dataset.fence = kind;
    svg.setAttribute('aria-hidden', 'true');
    render(svg);
    return svg;
  };

  $$('svg[data-fence]').forEach((svg) => render(svg));

  // 4 ft / 6 ft switch: the fence grows or shrinks on the drawing
  $$('.ht').forEach((group) => {
    const svg = $('svg[data-fence]', group.closest('.style-card'));
    const name = $('h4', group.closest('.style-card')).textContent.toLowerCase();
    group.addEventListener('click', (e) => {
      const btn = e.target.closest('button');
      if (!btn || btn.getAttribute('aria-pressed') === 'true') return;
      $$('button', group).forEach((b) => b.setAttribute('aria-pressed', String(b === btn)));
      const from = Number(svg.dataset.ft), to = Number(btn.dataset.ft);
      svg.dataset.ft = to;
      svg.setAttribute('aria-label', `Drawing of a ${name} fence, ${to} feet tall`);
      if (reduceMotion) return render(svg, to);
      const t0 = performance.now(), dur = 420;
      const step = (now) => {
        const t = Math.min(1, (now - t0) / dur);
        const e2 = t < .5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
        render(svg, from + (to - from) * e2);
        if (t < 1) requestAnimationFrame(step); else render(svg, to);
      };
      requestAnimationFrame(step);
    });
  });

  /* ======================= "Get a quote" links ======================= */
  const qStyle = $('#qStyle');
  const qHeight = $('#qHeight');
  $$('[data-quote]').forEach((a) => a.addEventListener('click', () => {
    const style = a.dataset.quote;
    if (!style) return;
    qStyle.value = style;
    const pressed = $('.ht [aria-pressed="true"]', a.closest('.style-card'));
    if (pressed) qHeight.value = `${pressed.dataset.ft} ft`;
    const field = qStyle.closest('.field');
    field.classList.remove('flash');
    void field.offsetWidth;
    field.classList.add('flash');
  }));

  /* ======================= Our work gallery ======================= */
  const viewer = $('#viewer');
  const viewerImg = $('#viewerImg');
  const viewerCap = $('#viewerCap');
  const openViewer = (img, caption) => {
    viewerImg.src = img.currentSrc || img.src;
    viewerImg.alt = img.alt;
    viewerCap.textContent = caption;
    if (viewer.showModal) viewer.showModal(); else window.open(img.src, '_blank');
  };
  $('#viewerClose').addEventListener('click', () => viewer.close());
  viewer.addEventListener('click', (e) => { if (e.target === viewer) viewer.close(); });

  $$('.work-tile').forEach((tile) => {
    const img = $('img', tile);
    const caption = $('figcaption', tile).textContent;
    const missing = () => {
      if (tile.classList.contains('is-missing')) return;
      tile.classList.add('is-missing');
      const d = makeDrawing(tile.dataset.fence);
      d.classList.add('work-draw');
      tile.prepend(d);
      tile.insertAdjacentHTML('afterbegin', '<span class="work-soon">Photo coming soon</span>');
    };
    const ready = () => {
      tile.tabIndex = 0;
      tile.setAttribute('role', 'button');
      tile.setAttribute('aria-label', `View photo: ${caption}`);
    };
    if (img.complete) { if (img.naturalWidth) ready(); else missing(); }
    img.addEventListener('error', missing);
    img.addEventListener('load', ready);
    const open = () => { if (!tile.classList.contains('is-missing') && img.naturalWidth) openViewer(img, caption); };
    tile.addEventListener('click', open);
    tile.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); } });
  });

  // About photo appears once assets/img/about.jpg exists
  const aboutFig = $('#aboutPhoto');
  if (aboutFig) {
    const probe = new Image();
    probe.onload = () => { aboutFig.hidden = false; };
    probe.src = $('img', aboutFig).getAttribute('src');
  }

  /* ======================= Reviews ======================= */
  // Sample review cards show only on previews (this computer, or the GitHub preview link),
  // never on the real domain. With no real reviews yet, the live site shows just the
  // "Leave a Google review" banner.
  const isPreview = location.protocol === 'file:' || /^(localhost|127\.0\.0\.1|\[::1\])$|\.github\.io$/.test(location.hostname);
  if (isPreview) document.documentElement.classList.add('show-samples');
  const reviewGrid = $('#reviewGrid');
  if (reviewGrid && !isPreview && !$('.review:not(.is-sample)', reviewGrid)) {
    reviewGrid.hidden = true;
    $('.reviews-head').hidden = true;
  }

  /* ======================= Phone action bar ======================= */
  const bar = $('#actionbar');
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(([entry]) => bar.classList.toggle('is-shown', !entry.isIntersecting))
      .observe($('.hero-ctas'));
  } else {
    bar.classList.add('is-shown');
  }

  /* ======================= Quote form ======================= */
  const form = $('#quoteForm');
  const status = $('#formStatus');
  const say = (msg, kind) => { status.textContent = msg; status.className = `form-status is-${kind}`; };

  form.addEventListener('reset', () => $$('[aria-invalid]', form).forEach((el) => el.removeAttribute('aria-invalid')));
  form.addEventListener('input', (e) => {
    if (e.target.getAttribute('aria-invalid') === 'true' && e.target.value.trim()) e.target.removeAttribute('aria-invalid');
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (form.botcheck.value) return;

    let firstBad = null;
    ['name', 'phone', 'address'].forEach((n) => {
      const el = form.elements[n];
      const ok = n === 'phone' ? el.value.replace(/\D/g, '').length >= 10 : el.value.trim() !== '';
      if (ok) el.removeAttribute('aria-invalid'); else { el.setAttribute('aria-invalid', 'true'); firstBad = firstBad || el; }
    });
    if (firstBad) {
      say(firstBad.name === 'phone' && firstBad.value.trim()
        ? 'Enter a 10-digit phone number so we can call you back.'
        : 'Add your name, phone number and property address so we can get back to you.', 'err');
      firstBad.focus();
      return;
    }

    const d = Object.fromEntries(new FormData(form));
    const subject = `Quote request: ${d.style} (${d.property}) - ${d.name}`;
    const body = [
      `Name: ${d.name}`, `Phone: ${d.phone}`, `Email: ${d.email || '-'}`, `Property: ${d.address}`,
      `Property type: ${d.property}`, `Needs: ${d.job}`, `Fence style: ${d.style}`, `Height: ${d.height}`,
      `Approx. length: ${d.length || '-'}`, '', d.message || '',
    ].join('\n');

    if (!WEB3FORMS_KEY) {
      window.location.href = `mailto:${QUOTE_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      say(`Your email app should open with the request filled in. Press send to finish. Nothing opened? Call or text ${PHONE}.`, 'ok');
      return;
    }

    const btn = $('button[type="submit"]', form);
    btn.disabled = true;
    say('Sending...', 'ok');
    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ access_key: WEB3FORMS_KEY, subject, from_name: 'Beals Prestige Fencing website', replyto: d.email || undefined, message: body }),
      });
      const out = await res.json();
      if (!res.ok || !out.success) throw new Error(out.message || res.status);
      form.reset();
      say(`Thanks, ${d.name.split(' ')[0]}. Your quote request was sent and we'll be in touch soon. Need it sooner? Call ${PHONE}.`, 'ok');
    } catch (err) {
      say(`Your request didn't go through. Please call or text ${PHONE}, or try again in a minute.`, 'err');
    } finally {
      btn.disabled = false;
    }
  });

  const year = $('#year');
  if (year) year.textContent = new Date().getFullYear();
})();
