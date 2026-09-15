# Design by Tom — portfolio website

This is the website for **designbytom** (Nikola Tomic), built from the Figma design.

**Live site:** https://thedivic.github.io/tomzee-portfolio/

---

## How this site works (the short version)

It is six plain HTML files, one stylesheet, a small vanilla-JavaScript file
(the sticky header), and a folder of images. That's it.

There is **no build step**, **no dependencies**, and **nothing to install**. The files
in this repository are exactly the files the browser downloads. That means the site
cannot "fail to build" — if the page looks right on your computer, it will look right
online.

**Pushing a change to GitHub publishes it.** Give it about a minute, then refresh.

| File | The page it makes |
|---|---|
| `index.html` | Home (hero + bio + testimonials) |
| `projects.html` | Projects |
| `project-qredo.html` | Qredo case study |
| `project-hanover.html` | Hanover Research case study |
| `project-lokal.html` | Lokal (weRate) case study |
| `css/style.css` | How everything looks |
| `js/main.js` | Tiny script: sticky header, scroll reveals (no libraries) |
| `assets/img/` | All images |

---

## TO DO: three links still need real addresses

Every one of these is currently a dead placeholder. Search the project for `#TODO`
to find them all, or ask Claude: *"replace the TODO links with these addresses"*.

| Placeholder | What it should point to | Appears on |
|---|---|---|
| `#TODO-visit-qredo` | The real Qredo website | Projects, Qredo case study |
| `#TODO-visit-hanover` | The real Hanover Research website | Projects, Hanover case study |
| `#TODO-visit-lokal` | The real Lokal / weRate website | Projects, Lokal case study |

## Product shots: all done

Every case-study product screen has been exported from Figma and wired in
(the circles, the main shots, and all gallery shots). No placeholders remain.

The `shot` images are the product screens, shown full-width and stacked one after
another.

## Motion and reveals (since 2026-09)

The site has a deliberate motion plan. Three speeds, defined once at the top of
`css/style.css`:

| Variable | Speed | Used for |
|---|---|---|
| `--t-fast` | 220ms | Hover and focus, buttons, nav underline |
| `--t-base` | 400ms | Standard transitions (cards, header bar) |
| `--t-slow` / `--t-load` | 700 / 900ms | Big reveals and hero entrances |

Two important rules to remember:

- **Animate `transform` and `opacity` only.** Never animate `width`, `height`,
  `left`/`top`, or `margin` — that forces the browser to re-layout every frame
  and makes the page feel slow.
- **Nothing is hidden without JavaScript.** Elements reveal as they scroll into
  view, but if you remove the script or it never loads, the page still shows
  everything. Content is never held up by the animation.

**To mark something as "reveal on scroll":** add `data-reveal` to its tag in the
HTML (e.g. `<div data-reveal>`). Use `data-reveal="fade"` for a fade-only version.
A `data-reveal` element is only hidden when `<html>` has the `js-reveal` class,
which `js/main.js` adds — so a broken script can't hide anything.

**Please do not remove the `prefers-reduced-motion` block** at the end of
`css/style.css` — it lets people who get motion sickness reduce the animation.

## Depth, motion and micro-interactions (since 2026-09)

Besides the reveals above, the site has a few designed touches. They are all
optional and all respect reduced motion:

- **Parallax depth.** Elements with a `data-parallax="0.3"` attribute drift at
  that speed (bigger number = faster) as you scroll, so the page feels layered.
  It's used on the home hero pieces and the case-study titles. Set to whole
  numbers on purpose so you can tweak by feel.
- **Magnetic buttons.** Links or buttons with `data-magnetic` slide a couple of
  pixels toward your cursor on hover and settle back on leave. Applied to the
  main CTAs ("View project", "Book a call").
- **Custom cursor.** A small dot plus a trailing ring replaces nothing — the
  real cursor stays visible. It's built for precise pointers (mouse/trackpad)
  and never appears on touch screens or under reduced motion.
- **Film grain.** A very faint fixed texture over the whole page (see
  `body::after` in `css/style.css`). It's a tiny repeating SVG tile, so it costs
  nothing.
- **The abstract mark.** On the home hero, a slow-rotating cluster of
  thin lines that behaves like a watermark/stamp. It's `aria-hidden`
  decoration — if it ever becomes annoying, delete the `.home-hero__stamp`
  div from `index.html`.
- **Catalog numerals.** Project cards (`01`), profile sections (`01`, `02`,
  `03`) and case-study entries are numbered automatically by CSS counters — no
  markup to maintain. If a numeral ever looks wrong, the rules live next to the
  matching card/section styles in `css/style.css`.

**Tweaks that never need a designer:** changing a numeral's size or colour is a
one-property change in the relevant `::before` rule; the stamp's size, colour and
rotation speed are set in the `.home-hero__stamp` rule in `css/style.css`.

---

## Changing things yourself

The easiest way is to ask Claude Code in plain English. Some examples that work:

- *"Change the headline on the home page to ..."*
- *"Make the purple a bit warmer"* — colours are all defined in one place at the top
  of `css/style.css`
- *"Add a fourth project called ..."*
- *"Swap my profile photo for the one in my Downloads folder"*
- *"The text on the home page is too small"*

**Changing text without any tools:** open the file on github.com, click the pencil
icon, edit, and press *Commit changes*. The site updates by itself. Text lives
between tags like `<p>` and `</p>` — change the words, leave the tags alone.

## Seeing the site on your computer before publishing

Double-click `index.html`. It opens in your browser and works offline.

---

## Two things that will break the site if changed

1. **The repository must stay public.** GitHub only publishes free websites from
   public repositories. If it is made private, the site goes offline.
2. **Renaming the repository changes the web address.** Any link you have shared
   will stop working.
