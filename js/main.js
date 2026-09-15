/* ==========================================================================
   Main script — a few tiny, dependency-free behaviours.

   Current behaviours:
   1. Adds .is-stuck to the header the moment the page scrolls, which turns
      on the frosted sticky bar (see css/style.css).
   2. On the case-study pages the header logo starts white (it sits over a
      dark hero). Once stuck it is swapped for the dark logo so it stays
      readable over the light page beneath.
   3. On small screens the hamburger button opens and closes the fullscreen
      nav menu (locked to the viewport, centred links).
   4. On the profile page the testimonials carousel scrolls itself — it
      advances one card at a time and loops, pausing while you hover or
      focus it. Skips entirely if the OS asks for reduced motion.
   5. Depth: elements with a data-parallax attribute drift at different
      speeds as you scroll, so the page feels layered rather than flat.
   6. Magnetic CTAs: links/buttons with data-magnetic lean gently toward
      the cursor, like they are being nudged, and settle back on leave.
   7. Custom cursor: a small dot plus a trailing ring that grows over
      anything interactive. Only for precise pointers (mouse/trackpad) and
      never when the OS prefers reduced motion.
   ========================================================================== */

(function () {
  var header = document.querySelector(".site-header");
  if (!header) return;

  var isDark = header.classList.contains("site-header--on-dark");
  var logo = header.querySelector(".site-header__logo");
  var DARK_LOGO = "assets/img/logo-white.svg";
  var LIGHT_LOGO = "assets/img/logo-dark.svg";
  var ticking = false;

  function update() {
    ticking = false;
    var stuck = window.scrollY > 0;
    header.classList.toggle("is-stuck", stuck);

    if (isDark && logo) {
      var fileName = stuck ? LIGHT_LOGO : DARK_LOGO;
      if (logo.getAttribute("src") !== fileName) {
        logo.setAttribute("src", fileName);
      }
    }
  }

  window.addEventListener("scroll", function () {
    if (!ticking) {
      ticking = true;
      window.requestAnimationFrame(update);
    }
  }, { passive: true });

  update();
})();

/* ==========================================================================
   3. Mobile nav — the hamburger button opens a fullscreen menu over the
      page on small screens (see css/style.css). The open state is a
      .menu-open class on <body>, which also locks page scrolling. The menu
      closes on: tapping a link, pressing Escape, or clicking anywhere else.
      It only ever opens below the phone breakpoint, because the button is
      only visible there.
   ========================================================================== */
(function () {
  var toggle = document.querySelector(".nav-toggle");

  function setOpen(open) {
    document.body.classList.toggle("menu-open", open);
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
  }

  toggle.addEventListener("click", function () {
    setOpen(!document.body.classList.contains("menu-open"));
  });

  document.addEventListener("click", function (event) {
    if (event.target.closest("a")) { setOpen(false); return; }
    if (!event.target.closest(".site-header__inner")) setOpen(false);
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") setOpen(false);
  });

  window.addEventListener("resize", function () {
    if (window.innerWidth > 640) setOpen(false);
  });
})();

/* ==========================================================================
   4. Testimonials carousel — on the profile page the testimonial track is
      wider than its container, so it scrolls sideways. Every few seconds
      this advances it by one card and loops back to the start. It pauses
      while you hover over it, drag it, or focus it, and does nothing at all
      if the OS prefers reduced motion.
   ========================================================================== */
(function () {
  var track = document.querySelector(".testimonials__track");
  if (!track) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  var INTERVAL = 3200;        // milliseconds between card advances
  var pauseCount = 0;         // incremented by hover/focus, so both can be active

  function step() {
    if (pauseCount > 0 || document.hidden) return;

    var overflow = track.scrollWidth - track.clientWidth;
    if (overflow <= 1) return;            // nothing to scroll on this screen

    var cards = track.children;
    if (!cards.length) return;
    var stepWidth = cards.length > 1
      ? cards[1].offsetLeft - cards[0].offsetLeft    // card + its gap
      : cards[0].offsetWidth;

    if (track.scrollLeft + stepWidth > overflow) {
      track.scrollLeft = 0;                // loop back to the first card
    } else {
      track.scrollTo({ left: track.scrollLeft + stepWidth, behavior: "smooth" });
    }
  }

  ["pointerenter", "focus"].forEach(function (eventName) {
    track.addEventListener(eventName, function () { pauseCount += 1; });
  });
  ["pointerleave", "blur"].forEach(function (eventName) {
    track.addEventListener(eventName, function () {
      pauseCount = Math.max(0, pauseCount - 1);
    });
  });

  setInterval(step, INTERVAL);
})();

/* ==========================================================================
   5. Scroll reveal enhancer — progressive enhancement, never a gatekeeper.
      Elements marked with data-reveal in the HTML are revealed as they
      scroll into view. Crucially:

      - Nothing is hidden until this script runs and adds .js-reveal to
        <html>. If JavaScript is off (or the observer is missing), every
        element simply stays visible.
      - It does nothing at all for people who prefer reduced motion — the
        CSS never applies the hidden state for them, so they just see the
        finished page.
      - Elements already above the fold when the page loads are revealed
        immediately, so the entrance plays at load rather than a beat late.
   ========================================================================== */
(function () {
  var els = Array.prototype.slice.call(document.querySelectorAll("[data-reveal]"));
  if (!els.length) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  document.documentElement.classList.add("js-reveal");

  function inInitialViewport(el) {
    var r = el.getBoundingClientRect();
    var vh = window.innerHeight || document.documentElement.clientHeight;
    // Reveal anything the user can already see, plus a comfortable buffer
    // below the fold — the first screenfuls of every page are never blank.
    return r.top < vh * 1.5 && r.bottom > 0;
  }

  if (!("IntersectionObserver" in window)) {
    els.forEach(function (el) { el.classList.add("is-inview"); });
    return;
  }

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-inview");
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0 });

  els.forEach(function (el) {
    if (inInitialViewport(el)) {
      el.classList.add("is-inview");
    } else {
      io.observe(el);
    }
  });
})();

/* ==========================================================================
   5b. Scroll-scrub reveal — elements with data-reveal="scrub" fade in
       continuously tied to scroll position (no one-shot animation). As the
       element rises into view it gains opacity and loses a slight translateY,
       so the whole page feels like a single flowing scroll. Behaves like the
       reveal enhancer: no JS → no .js-reveal → no hiding. The CSS sets the
       hidden base (opacity 0) under html.js-reveal; this behaviour writes
       opacity and translate inline each frame to override it.
   ========================================================================== */
(function () {
  var els = Array.prototype.slice.call(document.querySelectorAll('[data-reveal="scrub"]'));
  if (!els.length) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  document.documentElement.classList.add("js-reveal");

  var ticking = false;

  function apply() {
    ticking = false;
    var vh = window.innerHeight || document.documentElement.clientHeight;
    /* Travel window: element becomes visible once its top edge enters the
       bottom 65% of the viewport, and is fully revealed when it reaches
       18% from the top — a generous glide. */
    var travel = vh * 0.65;
    var done   = vh * 0.18;

    els.forEach(function (el) {
      var r    = el.getBoundingClientRect();
      /* How far (in px) the element's top is from the done line (18% down).
         0 = fully revealed, positive = still below, negative = scrolled past. */
      var dist = r.top - done;
      /* progress: 0 = just entering travel band, 1 = at the done line */
      var raw  = 1 - dist / (travel - done);
      var p    = raw < 0 ? 0 : raw > 1 ? 1 : raw;

      el.style.opacity   = String(p);
      el.style.translate = "0 " + ((1 - p) * 24) + "px";
    });
  }

  window.addEventListener("scroll", function () {
    if (!ticking) { ticking = true; window.requestAnimationFrame(apply); }
  }, { passive: true });

  window.addEventListener("resize", function () {
    if (!ticking) { ticking = true; window.requestAnimationFrame(apply); }
  }, { passive: true });

  apply();
})();

/* ==========================================================================
   6. Parallax — elements with a data-parallax="0.3" attribute drift away
      from the top of the page at that speed (larger number = faster drift).
      The hero pieces use several speeds so the composition feels deep.
      It writes the `translate` property, which composes with (rather than
      overwrites) any transform the element already has, and stays on the
      compositor thread. Skipped entirely for reduced-motion users.
   ========================================================================== */
(function () {
  var els = Array.prototype.slice.call(document.querySelectorAll("[data-parallax]"));
  if (!els.length) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  var ticking = false;
  function apply() {
    ticking = false;
    var y = window.scrollY;
    els.forEach(function (el) {
      var speed = parseFloat(el.getAttribute("data-parallax")) || 0.15;
      // Use the `translate` property (not transform) so it composes with any
      // transform the element already relies on (e.g. centering itself).
      el.style.translate = "0 " + (y * speed) + "px";
    });
  }

  window.addEventListener("scroll", function () {
    if (!ticking) { ticking = true; window.requestAnimationFrame(apply); }
  }, { passive: true });

  apply();
})();

/* ==========================================================================
   7. Magnetic CTAs — elements with data-magnetic slide a little toward the
      cursor while you hover them and settle back when you leave, which
      makes primary actions feel hand-made rather than inert. The effect is
      tiny (a few px) so it never fights the layout. Cursor-only; phones
      have no hover so they get nothing.
   ========================================================================== */
(function () {
  var els = Array.prototype.slice.call(document.querySelectorAll("[data-magnetic]"));
  if (!els.length) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  var MAX = 8; // cap so the element can never slide far from its slot

  els.forEach(function (el) {
    el.addEventListener("pointermove", function (event) {
      var r = el.getBoundingClientRect();
      var dx = event.clientX - (r.left + r.width / 2);
      var dy = event.clientY - (r.top + r.height / 2);
      var pull = Math.min(Math.abs(dx), Math.abs(dy), MAX);
      el.style.transform = "translate3d(" +
        (dx > 0 ? pull : -pull) + "px, " +
        (dy > 0 ? pull * 0.6 : -pull * 0.6) + "px, 0)";
    });

    el.addEventListener("pointerleave", function () {
      el.style.transition = "transform 0.5s var(--ease-out)";
      el.style.transform = "";
      setTimeout(function () { el.style.transition = ""; }, 500);
    });
  });
})();

/* ==========================================================================
   8. Custom cursor — a small dot that follows the pointer exactly, plus a
      ring that lags behind it like an ink drop and stretches over anything
      clickable. It is purely decorative: the real cursor is never hidden,
      so this adds flavour without ever costing usability. Only mouse users
      get it, and never under prefers-reduced-motion.
   ========================================================================== */
(function () {
  if (!window.matchMedia("(pointer: fine)").matches) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  if (!document.body) return;

  var dot = document.createElement("div");
  var ring = document.createElement("div");
  dot.className = "cursor-dot";
  ring.className = "cursor-ring";
  document.body.appendChild(dot);
  document.body.appendChild(ring);

  var x = -100, y = -100;
  var rx = -100, ry = -100;
  var raf = null;
  var shown = false;
  var isHot = false;

  function show() {
    shown = true;
    dot.classList.add("is-on");
    ring.classList.add("is-on");
  }

  function hide() {
    shown = false;
    dot.classList.remove("is-on");
    ring.classList.remove("is-on");
  }

  window.addEventListener("pointermove", function (event) {
    x = event.clientX;
    y = event.clientY;
    if (!shown) show();
    // Position via the `translate` property so the plain transform stays
    // free for the hover-scale defined in CSS (they compose, not clash).
    dot.style.translate = x + "px " + y + "px";
    if (!raf) raf = window.requestAnimationFrame(loop);
  }, { passive: true });

  window.addEventListener("pointerleave", hide);
  document.addEventListener("pointerover", function (event) {
    var hover = event.target.closest("a, button, [data-hover]");
    isHot = !!hover;
    document.body.classList.toggle("cursor-hot", isHot);
  });

  function loop() {
    raf = null;
    rx += (x - rx) * 0.22;
    ry += (y - ry) * 0.22;
    var dx = x - rx;
    var dy = y - ry;
    var dist = Math.sqrt(dx * dx + dy * dy);
    // Stretch the ring toward the cursor as it lags behind, like a teardrop.
    var stretch = Math.min(dist * 0.04, 0.9);
    var hotScale = isHot ? 1.45 : 1;
    var sx = (1 + stretch) * hotScale;
    var sy = Math.max(0.65, (1 - stretch * 0.25) * hotScale);
    ring.style.translate = rx + "px " + ry + "px";
    ring.style.rotate = Math.atan2(dy, dx) + "rad";
    ring.style.scale = sx + " " + sy;
    if (dist > 0.5) {
      raf = window.requestAnimationFrame(loop);
    }
  }
})();