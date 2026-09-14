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