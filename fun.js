/* Summerstrand Stays · playful motion layer · Njabulisto Digitals */
(() => {
  const G = window.gsap;
  const ST = window.ScrollTrigger;
  if (!G || !ST || new URLSearchParams(location.search).has("calm")) return;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const fine = matchMedia("(hover: hover) and (min-width: 901px)").matches;
  const COLORS = ["#ffb547", "#ff6b2c", "#ff4f6d", "#49c5d1", "#ffffff", "#25d366"];

  /* ---------- split helpers ---------- */
  function splitChars(el) {
    if (el.dataset.splitDone) return $$(".fc", el);
    el.dataset.splitDone = 1;
    const walk = (node) => {
      [...node.childNodes].forEach((n) => {
        if (n.nodeType === 3) {
          const frag = document.createDocumentFragment();
          n.textContent.split(/(\s+)/).forEach((word) => {
            if (!word) return;
            if (/^\s+$/.test(word)) { frag.append(document.createTextNode(word)); return; }
            const w = document.createElement("span");
            w.className = "fw";
            [...word].forEach((c) => { const s = document.createElement("span"); s.className = "fc"; s.textContent = c; w.append(s); });
            frag.append(w);
          });
          n.replaceWith(frag);
        } else if (n.nodeType === 1 && n.tagName !== "BR") walk(n);
      });
    };
    walk(el);
    return $$(".fc", el);
  }

  /* ---------- 1. headings: letters tumble in ---------- */
  $$(".scene h2, .section-head h2, .showcase-head h2, .mosaic-head h2, .call-band h2, .book-copy h2").forEach((h) => {
    h.classList.remove("reveal-up");
    const chars = splitChars(h);
    G.from(chars, {
      yPercent: 120, rotate: () => G.utils.random(-25, 25), opacity: 0, duration: 0.9, ease: "back.out(2)",
      stagger: { each: 0.025, from: "start" },
      scrollTrigger: { trigger: h, start: "top 85%", toggleActions: "play none none reverse" },
    });
  });

  /* ---------- 2. hero letters jump when you touch them ---------- */
  $$(".hero h1 .char").forEach((c) => {
    const jump = () => {
      if (G.isTweening(c)) return;
      G.timeline()
        .to(c, { yPercent: -28, rotate: G.utils.random(-12, 12), scaleY: 1.08, color: "#ffb547", duration: 0.22, ease: "power2.out" })
        .to(c, { yPercent: 0, rotate: 0, scaleY: 1, color: "", duration: 0.7, ease: "bounce.out" });
    };
    c.addEventListener("mouseenter", jump);
    c.addEventListener("touchstart", jump, { passive: true });
  });
  // "stays." keeps floating
  G.to(".hero-stays", { y: -10, rotate: -3, duration: 2.4, ease: "sine.inOut", yoyo: true, repeat: -1, delay: 3 });

  /* ---------- 3. chips, thumbs, perks pop in ---------- */
  $$(".scene").forEach((sc) => {
    const tl = G.timeline({ scrollTrigger: { trigger: sc, start: "top 60%", toggleActions: "play none none reverse" } });
    tl.from($$(".chips li", sc), { scale: 0, rotate: () => G.utils.random(-20, 20), opacity: 0, duration: 0.6, ease: "back.out(2.5)", stagger: 0.06 })
      .from($$(".scene-thumbs button", sc), { y: 40, rotate: () => G.utils.random(-15, 15), opacity: 0, duration: 0.7, ease: "back.out(2)", stagger: 0.07 }, "-=.4")
      .from($$(".scene-actions .btn", sc), { y: 30, opacity: 0, duration: 0.6, ease: "power3.out", stagger: 0.08 }, "-=.4");
  });
  G.from(".perks span", { scale: 0, opacity: 0, duration: 0.6, ease: "back.out(3)", stagger: 0.08, scrollTrigger: { trigger: ".perks", start: "top 90%" } });
  G.from(".plan li", { x: -30, opacity: 0, duration: 0.6, ease: "power3.out", stagger: 0.07, scrollTrigger: { trigger: ".plans", start: "top 75%" } });

  /* ---------- 4. images bend with scroll speed ---------- */
  const skewTargets = $$(".mosaic-col button, .card");
  const skewTo = skewTargets.map((el) => G.quickTo(el, "skewY", { duration: 0.5, ease: "power3" }));
  let lastSkew = 0;
  ST.create({
    onUpdate: (self) => {
      const v = G.utils.clamp(-8, 8, self.getVelocity() / -300);
      if (Math.abs(v - lastSkew) > 0.2) { skewTo.forEach((f) => f(v)); lastSkew = v; }
    },
  });
  ST.addEventListener("scrollEnd", () => { skewTo.forEach((f) => f(0)); lastSkew = 0; });

  /* ---------- 5. 3D tilt + shine on cards and photos ---------- */
  if (fine) {
    $$(".card, .mosaic-col button, .scene-thumbs button, .plan").forEach((el) => {
      if (!$(".shine", el)) { const s = document.createElement("i"); s.className = "shine"; el.append(s); }
      const strength = el.classList.contains("card") ? 7 : el.classList.contains("plan") ? 6 : 12;
      el.addEventListener("mousemove", (e) => {
        const r = el.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
        G.to(el, { rotateY: (x - 0.5) * strength, rotateX: (0.5 - y) * strength, transformPerspective: 900, duration: 0.5, ease: "power3.out" });
        el.style.setProperty("--mx", x * 100 + "%");
        el.style.setProperty("--my", y * 100 + "%");
      });
      el.addEventListener("mouseleave", () => G.to(el, { rotateY: 0, rotateX: 0, duration: 0.9, ease: "elastic.out(1, .5)" }));
    });

    /* ---------- 6. magnetic buttons ---------- */
    $$(".btn, .card-go, .fab a, .call-giant, .nav-links a").forEach((el) => {
      const pull = el.classList.contains("call-giant") ? 0.15 : 0.35;
      el.addEventListener("mousemove", (e) => {
        const r = el.getBoundingClientRect();
        G.to(el, { x: (e.clientX - r.left - r.width / 2) * pull, y: (e.clientY - r.top - r.height / 2) * pull, duration: 0.4, ease: "power3.out" });
      });
      el.addEventListener("mouseleave", () => G.to(el, { x: 0, y: 0, duration: 0.8, ease: "elastic.out(1, .4)" }));
    });
  }

  /* ---------- 7. floating suns in the statement ---------- */
  const st = $(".statement");
  if (st) {
    for (let i = 0; i < 7; i++) {
      const s = document.createElement("span");
      s.className = "floater";
      s.innerHTML = `<svg viewBox="0 0 40 40"><use href="#sun-ico"/></svg>`;
      s.style.left = G.utils.random(5, 92) + "%";
      s.style.top = G.utils.random(5, 85) + "%";
      s.style.width = s.style.height = G.utils.random(26, 70) + "px";
      st.append(s);
      G.to(s, { y: G.utils.random(-30, 30), x: G.utils.random(-20, 20), rotate: G.utils.random(-20, 20), duration: G.utils.random(3, 6), ease: "sine.inOut", yoyo: true, repeat: -1 });
      G.fromTo(s, { yPercent: G.utils.random(80, 200) }, { yPercent: G.utils.random(-200, -60), ease: "none", scrollTrigger: { trigger: st, start: "top bottom", end: "bottom top", scrub: true } });
    }
  }

  /* ---------- 8. ocean waves between sections ---------- */
  const waveSVG = (flip) => `<div class="waves${flip ? " flip" : ""}" aria-hidden="true">
    <svg viewBox="0 0 1440 120" preserveAspectRatio="none"><path class="wv w1" d="M0 60 C 240 110 480 10 720 60 S 1200 110 1440 60 S 1920 10 2160 60 S 2640 110 2880 60 V120 H0Z"/></svg>
    <svg viewBox="0 0 1440 120" preserveAspectRatio="none"><path class="wv w2" d="M0 70 C 240 30 480 110 720 70 S 1200 30 1440 70 S 1920 110 2160 70 S 2640 30 2880 70 V120 H0Z"/></svg>
    <svg viewBox="0 0 1440 120" preserveAspectRatio="none"><path class="wv w3" d="M0 80 C 240 120 480 50 720 80 S 1200 120 1440 80 S 1920 50 2160 80 S 2640 120 2880 80 V120 H0Z"/></svg>
  </div>`;
  const band = $(".call-band");
  if (band) { band.insertAdjacentHTML("afterbegin", waveSVG(true)); band.insertAdjacentHTML("beforeend", waveSVG(false)); }
  $$(".waves path").forEach((p, i) => G.to(p, { x: -1440, duration: 9 + (i % 3) * 4, ease: "none", repeat: -1 }));

  /* ---------- 9. sunset behind the footer word ---------- */
  const giant = $(".foot-giant");
  if (giant) {
    giant.insertAdjacentHTML("beforebegin", `<div class="sunset" aria-hidden="true"><span class="sunset-sun"></span></div>`);
    G.fromTo(".sunset-sun", { yPercent: -60, scale: 0.7 }, { yPercent: 40, scale: 1.1, ease: "none", scrollTrigger: { trigger: ".footer", start: "top bottom", end: "bottom bottom", scrub: true } });
    const word = splitChars(giant);
    G.from(word, { yPercent: 100, opacity: 0, duration: 1, ease: "expo.out", stagger: 0.04, scrollTrigger: { trigger: giant, start: "top 95%" } });
  }

  /* ---------- 10. logo spins faster when you scroll ---------- */
  const badges = $$(".nav .logo-badge");
  ST.create({ onUpdate: (self) => { const v = Math.min(Math.abs(self.getVelocity()) / 60, 40); badges.forEach((b) => G.to(b, { rotate: "+=" + v, duration: 0.4, overwrite: "auto" })); } });

  /* ---------- 11. confetti ---------- */
  const cv = document.createElement("canvas");
  cv.className = "confetti";
  document.body.append(cv);
  const ctx = cv.getContext("2d");
  let parts = [], running = false;
  const size = () => { cv.width = innerWidth * devicePixelRatio; cv.height = innerHeight * devicePixelRatio; ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0); };
  size(); addEventListener("resize", size);
  function burst(x, y, n = 90) {
    for (let i = 0; i < n; i++) {
      const a = Math.random() * Math.PI * 2, sp = 4 + Math.random() * 9;
      parts.push({ x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp - 6, r: 4 + Math.random() * 6, c: COLORS[i % COLORS.length], rot: Math.random() * 6, vr: (Math.random() - 0.5) * 0.4, life: 1, sun: i % 7 === 0 });
    }
    if (!running) { running = true; requestAnimationFrame(draw); }
  }
  function draw() {
    ctx.clearRect(0, 0, innerWidth, innerHeight);
    parts.forEach((p) => {
      p.vy += 0.28; p.vx *= 0.985; p.x += p.vx; p.y += p.vy; p.rot += p.vr; p.life -= 0.009;
      ctx.save(); ctx.globalAlpha = Math.max(p.life, 0); ctx.translate(p.x, p.y); ctx.rotate(p.rot); ctx.fillStyle = p.c;
      if (p.sun) { ctx.beginPath(); ctx.arc(0, 0, p.r * 1.2, 0, 7); ctx.fill(); }
      else ctx.fillRect(-p.r, -p.r / 2.5, p.r * 2, p.r / 1.25);
      ctx.restore();
    });
    parts = parts.filter((p) => p.life > 0 && p.y < innerHeight + 40);
    if (parts.length) requestAnimationFrame(draw); else { running = false; ctx.clearRect(0, 0, innerWidth, innerHeight); }
  }
  window.ssBurst = burst;
  const centre = (el) => { const r = el.getBoundingClientRect(); return [r.left + r.width / 2, r.top + r.height / 2]; };
  // booking sent → big celebration
  const booked = $("#booked");
  if (booked) new MutationObserver(() => { if (!booked.hidden) { const [x, y] = centre(booked); burst(x, y - 60, 160); setTimeout(() => burst(x - 150, y, 60), 250); setTimeout(() => burst(x + 150, y, 60), 450); } }).observe(booked, { attributes: true, attributeFilter: ["hidden"] });
  // small pops on plan buttons and call buttons
  document.addEventListener("click", (e) => {
    const b = e.target.closest("[data-plan], .js-call, [data-book]");
    if (b) burst(e.clientX || centre(b)[0], e.clientY || centre(b)[1], 40);
  });
  // a little sun-shower the first time someone reaches the prices
  ST.create({ trigger: ".plans", start: "top 60%", once: true, onEnter: () => { const hot = $(".plan-hot"); if (hot) { const [x, y] = centre(hot); burst(x, y - 120, 70); } } });

  /* ---------- 12. cursor leaves a trail of tiny suns ---------- */
  if (fine) {
    let last = 0;
    addEventListener("mousemove", (e) => {
      const now = performance.now();
      if (now - last < 45 || document.body.classList.contains("modal-open")) return;
      last = now;
      const d = document.createElement("span");
      d.className = "trail";
      d.style.left = e.clientX + "px";
      d.style.top = e.clientY + "px";
      d.style.background = COLORS[Math.floor(Math.random() * 4)];
      document.body.append(d);
      G.to(d, { y: G.utils.random(10, 40), x: G.utils.random(-15, 15), scale: 0, opacity: 0, duration: 0.9, ease: "power2.out", onComplete: () => d.remove() });
    });
  }

  addEventListener("load", () => ST.refresh());
})();
