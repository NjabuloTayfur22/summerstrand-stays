(() => {
  const C = window.SITE_CONFIG;
  const PHOTOS = 14;
  const desktop = matchMedia("(min-width: 901px)");
  // Motion is core to this brand, so it stays on even when the OS asks for less. Add ?calm to the URL to turn it off.
  const reduced = new URLSearchParams(location.search).has("calm");
  const G = window.gsap;
  const ST = window.ScrollTrigger;
  const hasGsap = !!(G && ST) && !reduced;
  if (!hasGsap) document.documentElement.classList.add("no-gsap");
  if (hasGsap) G.registerPlugin(ST);

  const HOMES = [
    {
      id: "admiralty-23",
      name: "The Garden House",
      street: "23 Admiralty Way",
      blurb: "A double-storey home on a big, tree-lined lawn. Two kitchens, a bath and separate shower, and a gated driveway with garage parking.",
      chips: ["Large garden", "Double-storey", "2 kitchens", "Bath & shower", "Gated parking", "Study desks"],
      bg: [1, 2, 3, 4, 7, 9, 11, 14],
      slides: [1, 2, 3, 5, 7, 9, 11, 4],
      cover: 1,
      rooms: 2,
      video: true,
    },
    {
      id: "admiralty-31",
      name: "The Fireside",
      street: "31 Admiralty Way",
      blurb: "Light, modern and freshly finished. A lounge with a fireplace, a sleek kitchen with a double-door fridge, glass bathrooms and bright rooms with ceiling fans.",
      chips: ["Fireplace lounge", "Modern kitchen", "Ceiling fans", "Glass shower & bath", "Study desks", "Secure fencing"],
      bg: [4, 2, 3, 5, 8, 13, 14],
      cover: 4,
      slides: [1, 6, 7, 9, 10, 11, 12],
      rooms: 10,
    },
    {
      id: "tilbury-4",
      name: "The Palms",
      street: "4 Tilbury Street",
      blurb: "Behind palm trees and a secure wall. A TV lounge, gas-hob kitchen with a big fridge and washing machine, and calm rooms with a desk and bar fridge.",
      chips: ["TV lounge", "Gas hob", "Washing machine", "Bar fridge in rooms", "Bath & shower", "Walled & gated"],
      bg: [2, 3, 4, 5, 10, 14, 1],
      cover: 1,
      slides: [6, 7, 8, 9, 11, 12, 13],
      rooms: 6,
    },
    {
      id: "bradley-6",
      name: "The Island House",
      street: "6 Bradley Street",
      blurb: "A roomy single-level home behind a mint-green wall. The star is a huge kitchen with a gas-hob island, plus a TV room, laundry space and a double garage.",
      chips: ["Island kitchen", "Gas hob", "TV room", "Laundry area", "Double garage", "Garden"],
      bg: [2, 1, 3, 4, 5, 6, 7, 8, 9, 10, 14],
      cover: 2,
      slides: [2, 3, 11, 12, 13, 4, 8],
      rooms: 5,
      video: true,
    },
  ];
  const HERO = [["admiralty-23", 1], ["tilbury-4", 1], ["bradley-6", 1], ["admiralty-31", 13]];

  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const img = (id, n, small) => `img/${id}/${String(n).padStart(2, "0")}${small ? "-s" : ""}.jpg`;
  const rand = (n) => "R" + Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  const pad = (n) => String(n).padStart(2, "0");
  const tel = C.phone ? `tel:${C.phone.replace(/\s/g, "").replace(/^0/, "+27")}` : "#book";
  // Every home's photo list: room photos first (r01, r02...), then the house photos (1..14).
  HOMES.forEach((h) => {
    h.roomKeys = Array.from({ length: h.rooms }, (_, i) => "r" + pad(i + 1));
    h.photos = [...h.roomKeys, ...Array.from({ length: PHOTOS }, (_, i) => i + 1)];
  });
  const photoIndex = (h, key) => h.photos.indexOf(key);
  const waUrl = (text) => `https://wa.me/${C.whatsapp}?text=${encodeURIComponent(text)}`;

  /* ---------- logo ---------- */
  const badgeHTML = `<span class="logo-inner">
      <img src="img/admiralty-23/01-s.jpg" alt=""><img src="img/tilbury-4/01-s.jpg" alt=""><img src="img/bradley-6/01-s.jpg" alt=""><img src="img/admiralty-31/13-s.jpg" alt="">
      <svg viewBox="0 0 46 46" aria-hidden="true">
        <defs><linearGradient id="lg-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ff6b2c" stop-opacity=".05"/><stop offset="1" stop-color="#ff4f6d" stop-opacity=".55"/></linearGradient></defs>
        <rect width="46" height="46" fill="url(#lg-sky)"/>
        <circle class="logo-sun" cx="23" cy="22" r="7" fill="#ffb547" stroke="#fff" stroke-width="1.2"/>
        <g class="logo-wave"><path d="M0 30 q5.75 -4 11.5 0 t11.5 0 t11.5 0 t11.5 0 t11.5 0 t11.5 0 V46 H0Z" fill="#0d1b2a" fill-opacity=".85"/></g>
        <g class="logo-wave w2"><path d="M0 35 q5.75 -3 11.5 0 t11.5 0 t11.5 0 t11.5 0 t11.5 0 t11.5 0 V46 H0Z" fill="#49c5d1" fill-opacity=".9"/></g>
      </svg></span>`;
  $$("[data-logo]").forEach((el) => { el.innerHTML = `<span class="logo-badge">${badgeHTML}</span><span class="logo-word"><b>Summerstrand</b><em>Stays</em></span>`; });
  $$("[data-badge]").forEach((el) => { el.innerHTML = badgeHTML; });

  /* ---------- slideshow helper ---------- */
  function slideshow(container, srcs, ms, onChange) {
    container.innerHTML = srcs.map((s, i) => `<img src="${s}" alt="" ${i > 1 ? 'loading="lazy"' : ""} ${i ? "" : 'class="on"'}>`).join("");
    const imgs = $$("img", container);
    let i = 0, timer = null;
    const go = (n) => {
      imgs[i].classList.remove("on");
      i = (n + imgs.length) % imgs.length;
      imgs[i].classList.add("on");
      onChange && onChange(i);
    };
    return {
      imgs, go,
      start() { if (!timer && !reduced) timer = setInterval(() => go(i + 1), ms); },
      stop() { clearInterval(timer); timer = null; },
      restart() { this.stop(); this.start(); },
    };
  }

  /* ---------- hero ---------- */
  const thumbs = $("#hero-thumbs");
  thumbs.innerHTML = HERO.map(([id, n], i) => `<button aria-label="Show ${id}" class="${i ? "" : "on"}" data-cursor="View"><img src="${img(id, n, 1)}" alt=""><i></i></button>`).join("");
  const setThumb = (i) => $$("button", thumbs).forEach((b, k) => {
    b.classList.toggle("on", k === i);
    const bar = $("i", b); bar.style.animation = "none"; void bar.offsetWidth; bar.style.animation = "";
  });
  const heroShow = slideshow($("#hero-media"), HERO.map(([id, n]) => img(id, n)), 6000, setThumb);
  thumbs.addEventListener("click", (e) => { const b = e.target.closest("button"); if (b) { heroShow.go($$("button", thumbs).indexOf(b)); heroShow.restart(); } });

  // split hero letters
  $$("[data-split]").forEach((el) => { el.innerHTML = [...el.textContent].map((c) => `<span class="char">${c}</span>`).join(""); });

  /* ---------- showcase cards ---------- */
  $("#showcase-track").innerHTML = HOMES.map((h, i) => `
    <a class="card" href="#scene-${h.id}" data-cursor="Explore">
      <div class="card-img"><img src="${img(h.id, h.cover)}" alt="${h.name}, ${h.street}" loading="lazy"></div>
      <span class="card-num">${pad(i + 1)} / ${pad(HOMES.length)}</span>
      <span class="card-tag">🛏 Rooms inside · 📷 ${h.photos.length} photos</span>
      <div class="card-body">
        <div><h3>${h.name}</h3><small>${h.street}, Summerstrand</small></div>
        <span class="card-go">→</span>
      </div>
    </a>`).join("");

  /* ---------- scenes ---------- */
  $("#scenes").innerHTML = HOMES.map((h, i) => {
    const media = `<div class="bg-slides" data-frame-slides></div>`;
    const tours = `<button class="btn btn-glass" data-gallery="${h.id}" data-cursor="All">📷 All ${h.photos.length} photos</button>` +
      (h.video ? `<a class="btn btn-glass" href="#video-${h.id}" data-cursor="Play">▶ Video tour</a>` : "");
    return `
    <section class="scene" id="scene-${h.id}">
      <div class="scene-sticky">
        <div class="scene-bg" data-scene-bg></div>
        <div class="scene-num" aria-hidden="true">${pad(i + 1)}</div>
        <div class="scene-grid">
          <div class="scene-text">
            <div class="scene-kicker">Home ${pad(i + 1)} / ${pad(HOMES.length)}</div>
            <h2>${h.name}</h2>
            <div class="addr">📍 ${h.street}, Summerstrand</div>
            <p class="blurb">${h.blurb}</p>
            <ul class="chips">${h.chips.map((c) => `<li>${c}</li>`).join("")}</ul>
            <a class="scene-rooms-label" href="#rooms" data-room-jump="${h.id}">🛏 See the rooms →</a>
            <div class="scene-thumbs">
              ${h.roomKeys.slice(0, 3).map((k, j) => `<button data-gallery="${h.id}" data-start="${j}" data-cursor="Room" aria-label="Open room photo"><img src="${img(h.id, k, 1)}" alt="Room at ${h.street}" loading="lazy"></button>`).join("")}
              <button class="more" data-gallery="${h.id}" data-cursor="All" aria-label="See all photos">+${h.photos.length - Math.min(3, h.rooms)}</button>
            </div>
            <div class="scene-price"><span><b>${rand(C.prices.weekly)}</b> /week</span><span><b>${rand(C.prices.monthly)}</b> /month</span></div>
            <div class="scene-actions">
              <a href="${tel}" class="btn btn-sun js-call"><span class="ring-ico">📞</span> Call to book</a>
              <a href="#book" class="btn btn-glass" data-book="${h.id}">Booking form</a>
              ${tours}
            </div>
          </div>
          <div class="scene-media">
            <div class="frame-glow"></div>
            <div class="frame">
              ${media}
              <span class="frame-tag"><i></i>Room tour</span>
              <span class="frame-bar"><span></span></span>
            </div>
          </div>
        </div>
      </div>
    </section>`;
  }).join("");
  /* ---------- video tours ---------- */
  const vids = HOMES.filter((h) => h.video);
  $("#video-grid").innerHTML = vids.map((h) => `
    <article class="vcard" id="video-${h.id}">
      <div class="vcard-media">
        <video src="video/${h.id}.mp4" poster="video/${h.id}.jpg" muted loop playsinline preload="none" aria-label="Video tour of ${h.street}"></video>
        <button class="vcard-full" data-full aria-label="Watch full screen" data-cursor="Watch">⛶</button>
        <span class="vcard-live"><i></i>Video tour</span>
      </div>
      <div class="vcard-body">
        <div><h3>${h.name}</h3><small>📍 ${h.street}, Summerstrand</small></div>
        <div class="vcard-actions">
          <a href="${tel}" class="btn btn-sun js-call"><span class="ring-ico">📞</span> Call to book</a>
          <a href="#scene-${h.id}" class="btn btn-glass">See the house</a>
        </div>
      </div>
    </article>`).join("");
  const vObs = new IntersectionObserver((es) => es.forEach((e) => {
    const v = e.target;
    if (e.isIntersecting) { v.preload = "auto"; if (!reduced) v.play().catch(() => {}); } else v.pause();
  }), { threshold: 0.35 });
  $$("#video-grid video").forEach((v) => vObs.observe(v));
  $("#video-grid").addEventListener("click", (e) => {
    const card = e.target.closest(".vcard-media");
    if (!card) return;
    const v = $("video", card);
    v.play().catch(() => {});
    (v.requestFullscreen || v.webkitEnterFullscreen || v.webkitRequestFullscreen || (() => {})).call(v);
  });

  /* ---------- rooms section ---------- */
  const roomTabs = $("#room-tabs"), roomGrid = $("#room-grid");
  function showRooms(id, animate) {
    const h = HOMES.find((x) => x.id === id);
    $$("button", roomTabs).forEach((b) => { const on = b.dataset.roomTab === id; b.classList.toggle("on", on); b.setAttribute("aria-selected", on); });
    roomGrid.innerHTML = h.roomKeys.map((k, j) => `
      <button class="room-card" data-gallery="${h.id}" data-start="${j}" data-cursor="Zoom" aria-label="Open room ${j + 1} at ${h.street}">
        <img src="${img(h.id, k)}" alt="Room ${j + 1} at ${h.street}, Summerstrand" loading="lazy">
        <span>🛏 Room photo ${j + 1}</span>
      </button>`).join("") + `
      <div class="room-cta">
        <small>${h.name} · ${h.street}</small>
        <b>Like this room?</b>
        <p>${rand(C.prices.weekly)} /week or ${rand(C.prices.monthly)} /month. Call to check what's free.</p>
        <a href="${tel}" class="btn btn-sun js-call"><span class="ring-ico">📞</span> Call to book</a>
        <button class="btn btn-glass" data-gallery="${h.id}" data-cursor="All">📷 All ${h.photos.length} photos</button>
      </div>`;
    roomGrid.dataset.rooms = h.rooms;
    if (animate && hasGsap) {
      G.from(roomGrid.children, { y: 40, opacity: 0, scale: 0.96, duration: 0.6, ease: "back.out(1.6)", stagger: 0.05, clearProps: "all" });
      ST.refresh();
    }
  }
  roomTabs.innerHTML = HOMES.map((h) => `<button role="tab" data-room-tab="${h.id}" data-cursor="Show">${h.street}<small>${h.rooms} room photo${h.rooms > 1 ? "s" : ""}</small></button>`).join("");
  roomTabs.addEventListener("click", (e) => { const b = e.target.closest("[data-room-tab]"); if (b) showRooms(b.dataset.roomTab, true); });
  document.addEventListener("click", (e) => { const j = e.target.closest("[data-room-jump]"); if (j) showRooms(j.dataset.roomJump, true); }, true);
  showRooms("admiralty-31", false);

  $("#foot-homes").innerHTML = HOMES.map((h) => `<li><a href="#scene-${h.id}">${h.street}</a></li>`).join("");

  /* ---------- mosaic ---------- */
  const all = [];
  const longest = Math.max(...HOMES.map((h) => h.photos.length));
  for (let n = 0; n < longest; n++) HOMES.forEach((h) => { if (h.photos[n] !== undefined) all.push([h.id, h.photos[n], n]); });
  const cols = [[], [], [], []];
  all.forEach((p, i) => cols[i % 4].push(p));
  $("#mosaic").innerHTML = cols.map((col) => `<div class="mosaic-col">${col.slice(0, 10).map(([id, key, n]) =>
    `<button data-gallery="${id}" data-start="${n}" data-cursor="View" aria-label="Open photo"><img src="${img(id, key, 1)}" alt="" loading="lazy"></button>`).join("")}</div>`).join("");

  /* ---------- statement words ---------- */
  const st = $("#statement");
  st.innerHTML = st.textContent.split(" ").map((w) => `<span class="w">${w}</span>`).join(" ");

  /* ---------- scene playback ---------- */
  const scenes = $$(".scene").map((el, k) => {
    const h = HOMES[k];
    const s = { el, h, video: $("video", el), bar: $(".frame-bar span", el), active: false };
    s.bg = slideshow($("[data-scene-bg]", el), h.bg.map((n) => img(h.id, n)), 6000);
    const fs = $("[data-frame-slides]", el);
    if (fs) {
      s.frameShow = slideshow(fs, [...h.roomKeys, ...h.slides].map((n) => img(h.id, n)), 3400, () => {
        s.bar.style.transition = "none";
        s.bar.style.width = "0";
        requestAnimationFrame(() => requestAnimationFrame(() => { s.bar.style.transition = "width 3.4s linear"; s.bar.style.width = "100%"; }));
      });
    }
    return s;
  });
  function tick(s) {
    if (!s.active || !s.video) return;
    if (s.video.duration) s.bar.style.width = (s.video.currentTime / s.video.duration) * 100 + "%";
    requestAnimationFrame(() => tick(s));
  }
  function activate(s, on) {
    if (s.active === on) return;
    s.active = on;
    if (on) { s.bg.start(); s.frameShow && s.frameShow.start(); } else { s.bg.stop(); s.frameShow && s.frameShow.stop(); }
    if (!s.video) return;
    if (on) {
      if (!s.video.getAttribute("src")) s.video.src = s.video.dataset.src;
      s.video.play().catch(() => {});
      tick(s);
    } else s.video.pause();
  }
  const preIO = new IntersectionObserver((es) => es.forEach((e) => {
    const s = scenes.find((x) => x.el === e.target);
    if (e.isIntersecting && s.video && !s.video.getAttribute("src")) { s.video.preload = "auto"; s.video.src = s.video.dataset.src; }
  }), { rootMargin: "800px 0px" });
  const playIO = new IntersectionObserver((es) => es.forEach((e) => activate(scenes.find((x) => x.el === e.target), e.isIntersecting)), { rootMargin: "-25% 0px -25% 0px" });
  scenes.forEach((s) => { preIO.observe(s.el); playIO.observe(s.el); });
  new IntersectionObserver(([e]) => (e.isIntersecting ? heroShow.start() : heroShow.stop())).observe($("#hero"));

  /* ---------- smooth scroll ---------- */
  let lenis = null;
  if (hasGsap && window.Lenis) {
    lenis = new Lenis({ lerp: 0.09, wheelMultiplier: 1 });
    lenis.on("scroll", ST.update);
    G.ticker.add((t) => lenis.raf(t * 1000));
    G.ticker.lagSmoothing(0);
  }
  const scrollToEl = (target) => {
    if (lenis) lenis.scrollTo(target, { duration: 1.6 });
    else target.scrollIntoView({ behavior: "smooth" });
  };
  document.addEventListener("click", (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (!a || a.getAttribute("href").length < 2) return;
    const t = document.querySelector(a.getAttribute("href"));
    if (t) { e.preventDefault(); scrollToEl(t); }
  });

  /* ---------- scroll basics ---------- */
  const nav = $("#nav");
  const bar = $("#progress");
  const fabEl = $(".fab");
  let lastY = 0, ticking = false;
  function onScroll() {
    ticking = false;
    const y = scrollY, vh = innerHeight;
    nav.classList.toggle("solid", y > 40);
    fabEl.classList.toggle("away", y < vh * 0.6);
    nav.classList.toggle("hide", y > lastY && y > vh * 0.8 && !document.body.classList.contains("modal-open"));
    lastY = y;
    bar.style.transform = `scaleX(${y / Math.max(1, document.documentElement.scrollHeight - vh)})`;
    if (!desktop.matches || reduced) return;
    scenes.forEach((s) => {
      const r = s.el.getBoundingClientRect();
      if (r.bottom < -vh || r.top > vh * 2) return;
      const p = Math.min(1, Math.max(0, (vh - r.top) / (r.height + vh)));
      s.el.style.setProperty("--p", p.toFixed(4));
      s.el.style.setProperty("--d", Math.abs(p - 0.5).toFixed(4));
    });
  }
  addEventListener("scroll", () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
  addEventListener("resize", onScroll);
  onScroll();

  /* ---------- preloader + intro ---------- */
  const loader = $("#loader");
  let introRan = false;
  function intro() {
    if (introRan) return;
    introRan = true;
    if (!hasGsap) { loader.classList.add("done"); return; }
    const tl = G.timeline();
    tl.to(".loader-inner", { opacity: 0, y: -30, duration: 0.5, ease: "power2.in" })
      .to(".loader-panels i", { yPercent: -100, duration: 1, ease: "expo.inOut", stagger: 0.08 }, "-=.1")
      .add(() => loader.classList.add("done"))
      .from("#hero-media", { scale: 1.25, duration: 2, ease: "expo.out" }, "-=1.1")
      .from(".hero h1 .char", { yPercent: 110, rotate: 6, duration: 1.2, ease: "expo.out", stagger: 0.035 }, "-=1.6")
      .from(".hero-top > *, .hero-bottom > *, .hero-thumbs button", { y: 30, opacity: 0, duration: 0.9, ease: "power3.out", stagger: 0.06 }, "-=1")
      .from(".nav", { opacity: 0, duration: 0.8, ease: "power2.out", clearProps: "opacity" }, "-=1");
  }
  if (hasGsap) {
    const num = $("#loader-num");
    const counter = { v: 0 };
    const first = new Image();
    let ready = false;
    first.onload = first.onerror = () => { ready = true; };
    first.src = img(HERO[0][0], HERO[0][1]);
    G.from(".loader-inner > *", { y: 20, opacity: 0, stagger: 0.1, duration: 0.6 });
    G.to(counter, {
      v: 100, duration: 1.6, ease: "power2.inOut",
      onUpdate: () => { num.textContent = Math.round(counter.v); },
      onComplete: function wait() { if (ready || document.readyState === "complete") intro(); else setTimeout(wait, 100); },
    });
    setTimeout(intro, 5000);
  } else intro();

  /* ---------- GSAP scroll animations ---------- */
  if (hasGsap) {
    // hero parallax on scroll + mouse
    G.to("#hero-media", { yPercent: 12, ease: "none", scrollTrigger: { trigger: "#hero", start: "top top", end: "bottom top", scrub: true } });
    G.to(".hero-title", { yPercent: -30, opacity: 0.2, ease: "none", scrollTrigger: { trigger: "#hero", start: "top top", end: "bottom top", scrub: true } });
    if (desktop.matches) {
      const hx = G.quickTo("#hero-media", "x", { duration: 1.2, ease: "power3" });
      const hy = G.quickTo("#hero-media", "y", { duration: 1.2, ease: "power3" });
      $("#hero").addEventListener("mousemove", (e) => { hx((e.clientX / innerWidth - 0.5) * -30); hy((e.clientY / innerHeight - 0.5) * -20); });
    }

    // velocity tickers
    $$(".ticker-row").forEach((row) => {
      const track = $(".ticker-track", row);
      track.innerHTML += track.innerHTML;
      const dir = +row.dataset.speed;
      const tween = G.fromTo(track, { xPercent: dir > 0 ? 0 : -50 }, { xPercent: dir > 0 ? -50 : 0, duration: 40, ease: "none", repeat: -1 });
      ST.create({
        trigger: ".ticker", start: "top bottom", end: "bottom top",
        onUpdate: (self) => {
          G.to(tween, { timeScale: 1 + Math.min(Math.abs(self.getVelocity()) / 250, 6), duration: 0.2, overwrite: true });
          G.to(tween, { timeScale: 1, duration: 1.2, delay: 0.2, overwrite: false });
        },
      });
    });

    // statement words light up
    G.to("#statement .w", { opacity: 1, stagger: 0.1, ease: "none", scrollTrigger: { trigger: "#statement", start: "top 80%", end: "bottom 45%", scrub: true } });

    // counters
    $$("[data-count]").forEach((el) => {
      const end = +el.dataset.count;
      const o = { v: 0 };
      ST.create({ trigger: el, start: "top 90%", once: true, onEnter: () => G.to(o, { v: end, duration: 1.8, ease: "power3.out", onUpdate: () => { el.textContent = Math.round(o.v).toLocaleString("en-ZA").replace(/\s| /g, ","); } }) });
    });

    // horizontal showcase
    const mm = G.matchMedia();
    mm.add("(min-width: 901px)", () => {
      const track = $("#showcase-track");
      const dist = () => track.scrollWidth - (innerWidth - track.getBoundingClientRect().left) + 40;
      G.to(track, { x: () => -dist(), ease: "none", scrollTrigger: { trigger: ".showcase", pin: ".showcase-pin", start: "top top", end: () => "+=" + dist(), scrub: 1, invalidateOnRefresh: true, anticipatePin: 1 } });
      $$(".card-img img").forEach((im) => G.fromTo(im, { scale: 1.3 }, { scale: 1.05, ease: "none", scrollTrigger: { trigger: ".showcase", start: "top top", end: () => "+=" + dist(), scrub: true } }));
    });
    G.from(".card", { y: 80, opacity: 0, stagger: 0.1, duration: 1, ease: "power3.out", scrollTrigger: { trigger: ".showcase", start: "top 75%" } });

    // mosaic columns
    $$(".mosaic-col").forEach((col, i) => {
      const amt = [-30, -55, -20, -45][i];
      G.fromTo(col, { yPercent: i % 2 ? -10 : 5 }, { yPercent: amt, ease: "none", scrollTrigger: { trigger: ".mosaic", start: "top bottom", end: "bottom top", scrub: true } });
    });

    // call band parallax
    G.fromTo("[data-parallax-bg]", { yPercent: -10 }, { yPercent: 10, ease: "none", scrollTrigger: { trigger: ".call-band", start: "top bottom", end: "bottom top", scrub: true } });
    G.from(".call-giant", { scale: 0.8, opacity: 0, duration: 1.2, ease: "back.out(1.6)", scrollTrigger: { trigger: ".call-giant", start: "top 85%" } });

    // generic reveals
    $$(".reveal-up, .section-head .eyebrow, .how li, .faq details, .stats div").forEach((el) => {
      G.from(el, { y: 60, opacity: 0, duration: 1.1, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 88%" } });
    });
    // giant footer word
    G.from(".foot-giant", { yPercent: 40, opacity: 0, duration: 1.4, ease: "expo.out", scrollTrigger: { trigger: ".foot-giant", start: "top 95%" } });

    addEventListener("load", () => ST.refresh());
  }

  /* ---------- custom cursor ---------- */
  const cursor = $("#cursor");
  if (hasGsap && matchMedia("(hover: hover)").matches && desktop.matches) {
    const cx = G.quickTo(cursor, "x", { duration: 0.35, ease: "power3" });
    const cy = G.quickTo(cursor, "y", { duration: 0.35, ease: "power3" });
    addEventListener("mousemove", (e) => { cursor.classList.add("on"); cx(e.clientX); cy(e.clientY); });
    document.addEventListener("mouseover", (e) => {
      const t = e.target.closest("[data-cursor]");
      cursor.classList.toggle("big", !!t);
      $("#cursor-label").textContent = t ? t.dataset.cursor : "";
    });
    document.addEventListener("mouseleave", () => cursor.classList.remove("on"));
  }

  /* ---------- 3D tilt on pricing ---------- */
  if (desktop.matches && !reduced) {
    $$(".tilt").forEach((card) => {
      card.addEventListener("mousemove", (e) => {
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        card.style.transform = `rotateY(${x * 8}deg) rotateX(${-y * 8}deg) translateY(-4px)`;
      });
      card.addEventListener("mouseleave", () => { card.style.transform = ""; });
    });
  }

  /* ---------- overlays (gallery, lightbox, tour) ---------- */
  const lockScroll = (on) => {
    document.body.classList.toggle("modal-open", on);
    document.body.style.overflow = on ? "hidden" : "";
    if (lenis) on ? lenis.stop() : lenis.start();
  };
  const modal = $("#modal");
  let current = null;
  function openGallery(id) {
    current = HOMES.find((h) => h.id === id);
    $("#m-area").textContent = `${current.street}, Summerstrand`;
    $("#m-title").textContent = current.name;
    const tile = (k) => `<button data-lb-open="${photoIndex(current, k)}"><img src="${img(current.id, k, 1)}" alt="${current.name} ${typeof k === "string" ? "room" : "photo"}" loading="lazy"></button>`;
    $("#m-gallery").innerHTML =
      `<h4 class="m-sec">🛏 The rooms <small>${current.rooms} photos</small></h4><div class="m-grid">${current.roomKeys.map(tile).join("")}</div>` +
      `<h4 class="m-sec">🏠 The house <small>${PHOTOS} photos</small></h4><div class="m-grid">${current.photos.filter((k) => typeof k === "number").map(tile).join("")}</div>`;
    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
    lockScroll(true);
    $(".modal-panel").scrollTop = 0;
  }
  function closeGallery() { modal.classList.remove("open"); modal.setAttribute("aria-hidden", "true"); lockScroll(false); }
  modal.addEventListener("click", (e) => { if (e.target.closest("[data-close]")) closeGallery(); });

  const lb = $("#lightbox");
  let lbIndex = 0;
  function showLb(i) {
    const total = current.photos.length;
    lbIndex = (i + total) % total;
    const key = current.photos[lbIndex];
    const isRoom = typeof key === "string";
    $("#lb-img").src = img(current.id, key);
    $("#lb-img").alt = `${current.name} ${isRoom ? "room" : "photo"} ${lbIndex + 1}`;
    $("#lb-count").textContent = `${current.name} · ${isRoom ? `🛏 Room photo ${lbIndex + 1} of ${current.rooms}` : `${lbIndex + 1} / ${total}`}`;
  }
  function openLb(id, i) {
    current = HOMES.find((h) => h.id === id);
    showLb(i);
    lb.classList.add("open");
    lb.setAttribute("aria-hidden", "false");
    if (!modal.classList.contains("open")) lockScroll(true);
  }
  const closeLb = () => { lb.classList.remove("open"); lb.setAttribute("aria-hidden", "true"); if (!modal.classList.contains("open")) lockScroll(false); };
  $("#m-gallery").addEventListener("click", (e) => { const b = e.target.closest("[data-lb-open]"); if (b) openLb(current.id, +b.dataset.lbOpen); });
  lb.addEventListener("click", (e) => {
    const a = e.target.closest("[data-lb]")?.dataset.lb;
    if (a === "close" || e.target === lb) closeLb();
    if (a === "prev") showLb(lbIndex - 1);
    if (a === "next") showLb(lbIndex + 1);
  });
  let touchX = null;
  lb.addEventListener("touchstart", (e) => { touchX = e.touches[0].clientX; }, { passive: true });
  lb.addEventListener("touchend", (e) => {
    if (touchX === null) return;
    const dx = e.changedTouches[0].clientX - touchX;
    if (Math.abs(dx) > 40) showLb(lbIndex + (dx < 0 ? 1 : -1));
    touchX = null;
  });

  document.addEventListener("click", (e) => {
    const g = e.target.closest("[data-gallery]");
    if (g) { if (g.dataset.start) openLb(g.dataset.gallery, +g.dataset.start); else openGallery(g.dataset.gallery); return; }
    const b = e.target.closest("[data-book]");
    if (b) { homeSel.value = b.dataset.book; update(); }
    const p = e.target.closest("[data-plan]");
    if (p) { form.elements.plan.value = p.dataset.plan; update(); }
  });
  document.addEventListener("keydown", (e) => {
    if (lb.classList.contains("open")) {
      if (e.key === "Escape") closeLb();
      if (e.key === "ArrowLeft") showLb(lbIndex - 1);
      if (e.key === "ArrowRight") showLb(lbIndex + 1);
      return;
    }
    if (modal.classList.contains("open") && e.key === "Escape") closeGallery();
  });

  /* ---------- booking form ---------- */
  const form = $("#book-form");
  const homeSel = $("#f-home");
  const dateIn = $("#f-checkin");
  const qtyIn = $("#f-qty");
  const msg = $("#form-msg");
  homeSel.innerHTML = HOMES.map((h) => `<option value="${h.id}">${h.street} · ${h.name}</option>`).join("");
  const iso = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  const parse = (s) => { const [y, m, d] = s.split("-").map(Number); return new Date(y, m - 1, d); };
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const seasonStart = parse(C.season.start);
  const seasonEnd = parse(C.season.end);
  const minDate = today > seasonStart ? today : seasonStart;
  dateIn.min = iso(minDate);
  dateIn.max = iso(seasonEnd);
  dateIn.value = iso(minDate);
  const plan = () => form.elements.plan.value;
  function addUnits(d, p, n) { const r = new Date(d); if (p === "weekly") r.setDate(r.getDate() + 7 * n); else r.setMonth(r.getMonth() + n); return r; }
  function maxQty() {
    if (!dateIn.value) return 1;
    const start = parse(dateIn.value);
    let n = 1;
    while (addUnits(start, plan(), n) <= seasonEnd && n < 20) n++;
    return n;
  }
  const fmt = (d) => d.toLocaleDateString("en-ZA", { weekday: "short", day: "numeric", month: "short", year: "numeric" });
  function update() {
    const p = plan();
    const q = Math.min(Math.max(1, +qtyIn.value || 1), maxQty());
    qtyIn.value = q;
    $("#f-qty-label").textContent = p === "weekly" ? "Weeks" : "Months";
    $("#s-stay").textContent = `${q} ${p === "weekly" ? "week" : "month"}${q > 1 ? "s" : ""} × ${rand(C.prices[p])}`;
    $("#s-out").textContent = dateIn.value ? fmt(addUnits(parse(dateIn.value), p, q)) : "—";
    $("#s-total").textContent = rand(C.prices[p] * q);
    $("#s-deposit").textContent = rand(C.prices[p] * q / 2);
    msg.textContent = "";
  }
  form.addEventListener("change", update);
  form.addEventListener("input", (e) => { if (e.target.name !== "name") update(); });
  $$("[data-step]", form).forEach((b) => b.addEventListener("click", () => { qtyIn.value = +qtyIn.value + +b.dataset.step; update(); }));
  update();
  function bookingText() {
    const p = plan(), q = +qtyIn.value;
    const h = HOMES.find((x) => x.id === homeSel.value);
    return [
      `Hi ${C.brand}! I'd like to book a room:`, ``,
      `🏠 ${h.street} (${h.name})`,
      `📅 Check-in: ${fmt(parse(dateIn.value))}`,
      `⏳ ${q} ${p === "weekly" ? "week" : "month"}${q > 1 ? "s" : ""} (${p} plan)`,
      `👤 ${$("#f-guests").value}`,
      `💰 Total: ${rand(C.prices[p] * q)}`,
      `🔐 50% deposit: ${rand(C.prices[p] * q / 2)}`,
      `✅ I agree to the booking terms & house rules`, ``,
      `Name: ${$("#f-name").value.trim()}`,
    ].join("\n");
  }
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!$("#f-name").value.trim()) { msg.textContent = "Please add your name."; $("#f-name").focus(); return; }
    if (!$("#f-agree").checked) { msg.textContent = "Please tick the box to agree to the booking terms."; $("#f-agree").focus(); return; }
    if (!dateIn.value || dateIn.value < dateIn.min || dateIn.value > dateIn.max) {
      msg.textContent = `Please pick a check-in date between ${fmt(parse(dateIn.min))} and ${fmt(seasonEnd)}.`;
      return;
    }
    if (C.whatsapp) window.open(waUrl(bookingText()), "_blank", "noopener");
    else if (C.email) location.href = `mailto:${C.email}?subject=${encodeURIComponent("Booking request")}&body=${encodeURIComponent(bookingText())}`;
    form.hidden = true;
    $("#booked").hidden = false;
    if (hasGsap) G.from("#booked > *", { y: 30, opacity: 0, stagger: 0.08, duration: 0.7, ease: "power3.out" });
  });
  $("#book-again").addEventListener("click", () => { $("#booked").hidden = true; form.hidden = false; });

  /* ---------- contact links ---------- */
  const hello = `Hi ${C.brand}! I'm interested in a summer stay.`;
  $$(".js-call").forEach((a) => { a.href = tel; });
  $$(".js-phone-text").forEach((el) => { el.textContent = C.phone || "us"; });
  $("#foot-contact").innerHTML = [
    C.phone && `<li><a href="${tel}">📞 ${C.phone}</a></li>`,
    C.whatsapp && `<li><a href="${waUrl(hello)}" target="_blank" rel="noopener">WhatsApp</a></li>`,
    C.email && `<li><a href="mailto:${C.email}">${C.email}</a></li>`,
  ].filter(Boolean).join("") || `<li><a href="#book">Booking form</a></li>`;
  const fab = $("#wa-float");
  if (C.whatsapp) { fab.href = waUrl(hello); fab.target = "_blank"; fab.rel = "noopener"; } else fab.remove();
  if (!C.phone) $(".fab-call").remove();
  $("#yr").textContent = new Date().getFullYear();
})();
