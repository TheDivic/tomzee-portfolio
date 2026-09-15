/* ==========================================================================
   Main script — a few tiny, dependency-free behaviours.

   Current behaviours:
   1. Sticky header: adds .is-stuck the moment the page scrolls, which turns
      on the frosted sticky bar (see css/style.css). On case-study pages the
      logo also swaps from white to dark so it stays readable.
   2. Mobile nav: the hamburger button opens and closes a fullscreen menu on
      small screens (locked to the viewport, centred links).
   3. Testimonials carousel: on the home/profile page the testimonial track
      scrolls sideways one card at a time and loops, pausing on hover/focus.
      Skips entirely if the OS asks for reduced motion.
   4. Scroll reveal enhancer: elements with data-reveal animate in as they
      enter the viewport.
   5. Scroll-scrub reveal: elements with data-reveal="scrub" fade in
      continuously tied to scroll position rather than playing once.
   6. Parallax: elements with data-parallax drift at different speeds as you
      scroll, so the page feels layered.
   7. Custom cursor: a small dot plus a trailing ring that grows over
      anything interactive. Only for precise pointers (mouse/trackpad) and
      never when the OS prefers reduced motion.
   ========================================================================== */

/* ---- Shared helpers ------------------------------------------------------ */

// Run a function on the next animation frame, but ignore additional calls
// until that frame fires. Keeps scroll/resize handlers off the main thread.
function onNextFrame(fn) {
  var ticking = false;
  return function () {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(function () {
      ticking = false;
      fn();
    });
  };
}

// True when the user has asked for reduced motion.
function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/* ==========================================================================
   1. Sticky header + logo swap
   ========================================================================== */
(function () {
  var header = document.querySelector(".site-header");
  if (!header) return;

  var isDark = header.classList.contains("site-header--on-dark");
  var logo = header.querySelector(".site-header__logo");
  var DARK_LOGO = "assets/img/logo-white.svg";
  var LIGHT_LOGO = "assets/img/logo-dark.svg";
  var lastScrollY = -1;

  function update() {
    var scrollY = window.scrollY;
    if (scrollY === lastScrollY) return;
    lastScrollY = scrollY;

    var stuck = scrollY > 0;
    header.classList.toggle("is-stuck", stuck);

    if (isDark && logo) {
      var fileName = stuck ? LIGHT_LOGO : DARK_LOGO;
      if (logo.getAttribute("src") !== fileName) {
        logo.setAttribute("src", fileName);
      }
    }
  }

  window.addEventListener("scroll", onNextFrame(update), { passive: true });
  update();
})();

/* ==========================================================================
   2. Mobile nav — the hamburger button opens a fullscreen menu over the
      page on small screens (see css/style.css). The open state is a
      .menu-open class on <body>, which also locks page scrolling. The menu
      closes on: tapping a link, pressing Escape, or clicking anywhere else.
      It only ever opens below the phone breakpoint, because the button is
      only visible there.
   ========================================================================== */
(function () {
  var toggle = document.querySelector(".nav-toggle");
  if (!toggle) return;

  function setOpen(open) {
    document.body.classList.toggle("menu-open", open);
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
  }

  toggle.addEventListener("click", function () {
    setOpen(!document.body.classList.contains("menu-open"));
  });

  // Close the menu when any link is activated (including footer/anchor links)
  // or when clicking outside the header.
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
   3. Testimonials carousel — on the home page the testimonial track is
      wider than its container, so it scrolls sideways. Every few seconds
      this advances it by one card and loops back to the start. It pauses
      while you hover over it, drag it, or focus it, and does nothing at all
      if the OS prefers reduced motion.
   ========================================================================== */
(function () {
  var track = document.querySelector(".testimonials__track");
  if (!track) return;
  if (prefersReducedMotion()) return;

  var INTERVAL = 3200;        // milliseconds between card advances
  var pauseCount = 0;         // incremented by hover/focus, so both can be active
  var timer = null;

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

  // Pause entirely when the page is hidden to avoid off-screen animation.
  document.addEventListener("visibilitychange", function () {
    if (document.hidden) {
      clearInterval(timer);
    } else {
      timer = setInterval(step, INTERVAL);
    }
  });

  timer = setInterval(step, INTERVAL);
})();

/* ==========================================================================
   4. Scroll reveal enhancer — progressive enhancement, never a gatekeeper.
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
  if (prefersReducedMotion()) return;

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
   5. Scroll-scrub reveal — elements with data-reveal="scrub" fade in
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
  if (prefersReducedMotion()) return;

  document.documentElement.classList.add("js-reveal");

  function apply() {
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

  window.addEventListener("scroll", onNextFrame(apply), { passive: true });
  window.addEventListener("resize", onNextFrame(apply), { passive: true });

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
  if (prefersReducedMotion()) return;

  function apply() {
    var y = window.scrollY;
    els.forEach(function (el) {
      var speed = parseFloat(el.getAttribute("data-parallax")) || 0.15;
      // Use the `translate` property (not transform) so it composes with any
      // transform the element already relies on (e.g. centering itself).
      el.style.translate = "0 " + (y * speed) + "px";
    });
  }

  window.addEventListener("scroll", onNextFrame(apply), { passive: true });

  apply();
})();

/* ==========================================================================
   7. Custom cursor — a small dot that follows the pointer exactly, plus a
      ring that lags behind it like an ink drop and stretches over anything
      clickable. It is purely decorative: the real cursor is never hidden,
      so this adds flavour without ever costing usability. Only mouse users
      get it, and never under prefers-reduced-motion.
   ========================================================================== */
(function () {
  if (!window.matchMedia("(pointer: fine)").matches) return;
  if (prefersReducedMotion()) return;
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
    var target = event.target;
    var hover = target.closest("a, button, [data-hover]");
    isHot = !!hover;
    document.body.classList.toggle("cursor-hot", isHot);
    // Flip the cursor to light when it crosses a dark surface (footer, case
    // study hero, etc.). Determined from the first non-transparent background
    // found on the element under the pointer or one of its ancestors.
    document.body.classList.toggle("cursor-invert", isDarkSurface(target));
  });

  // Rough luminance check: a dark surface is anything whose effective
  // background is clearly darker than mid-grey (see --c-purple and the case
  // study heroes). Translucent washes are skipped so a light parent decides.
  function isDarkSurface(el) {
    var node = el;
    while (node && node.nodeType === 1) {
      var bg = getComputedStyle(node).backgroundColor;
      var m = bg && bg.match(/rgba?\(\s*(\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\s*\)/);
      if (m) {
        var alpha = m[4] != null ? parseFloat(m[4]) : 1;
        if (alpha >= 0.5) {
          var lum = 0.2126 * +m[1] + 0.7152 * +m[2] + 0.0722 * +m[3];
          return lum < 100;
        }
      }
      node = node.parentElement;
    }
    return false;
  }

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
  // Keep animating until the ring has settled back to a circle so it never
  // freezes in a stretched state when the cursor stops.
  if (dist > 0.5 || stretch > 0.01) {
    raf = window.requestAnimationFrame(loop);
  }
}
})();




