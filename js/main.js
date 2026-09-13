/* ==========================================================================
   Main script — a few tiny, dependency-free behaviours.

   Current behaviours:
   1. Adds .is-stuck to the header the moment the page scrolls, which turns
      on the frosted sticky bar (see css/style.css).
   2. On the case-study pages the header logo starts white (it sits over a
      dark hero). Once stuck it is swapped for the dark logo so it stays
      readable over the light page beneath.
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