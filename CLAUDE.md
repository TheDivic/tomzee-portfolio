# CLAUDE.md — working rules for this repository

This is a personal portfolio site for Nikola Tomic ("Tom"), a product designer.
**He is not a developer and maintains this site himself by asking you for changes.**
Optimise every decision for "he can still change this in a year without help".

## Hard rules

- **No build step. No dependencies. No package.json, no node_modules, no CI.**
  The files in this repo are exactly what the browser loads. Do not introduce a
  framework, bundler, preprocessor, or npm package. If something seems to call for
  one, say so and let him decide — do not add it unilaterally.
- **All paths stay relative** (`assets/img/x.png`, never `/assets/img/x.png`).
  GitHub Pages serves this repo from a subpath, so leading slashes break every link.
  This also keeps `index.html` working when opened directly from disk.
- **The repository must stay public** or GitHub Pages stops serving it on a free plan.

## Structure

Five flat HTML pages, one stylesheet, one small vanilla script, one image folder:

```
index.html                 home (hero, bio, testimonials)
projects.html
project-qredo.html  project-hanover.html  project-lokal.html
css/style.css        all styling
js/main.js           sticky header behaviour (vanilla JS, no libraries)
assets/img/          all images
assets/cv/           CV pdf
.nojekyll            stops GitHub running Jekyll over the files
```

## The header and footer are duplicated in all five pages

This is deliberate — it is the cost of having no build step. **When you change the
header or footer, change it in all five files in the same commit.** Verify with:

```
grep -c 'site-footer__legal' *.html     # must print 1 for every page
```

Each page marks its own nav item with `aria-current="page"`. Case-study pages add
`site-header--on-dark` to the header and use the white logo, because their header
sits on top of a dark hero image.

## Styling

- **All colours, sizes and spacing are CSS custom properties** in `:root` at the top
  of `css/style.css`. Change values there rather than hard-coding hex or px further
  down. "Make the purple warmer" should be a one-line change.
- Fonts are Kaisei Decol (display serif) and Inter (everything else), both from
  Google Fonts. The original Figma specified Helvetica Neue on a few link components,
  which was inconsistent with the Inter used everywhere around them — those were
  normalised to Inter deliberately. Don't "fix" this back without asking.
- The content column is `width: min(1280px, 100% - 160px); margin-inline: auto`.
  This one rule is why the site matches the design at both 1440px and 1920px.

## Not done yet

- **Responsive layout.** The site has two breakpoints, in the "Responsive layout"
  section at the bottom of css/style.css: 1000px (tablet, two-column modules
  collapse) and 640px (phone, single column, scaled type; the hamburger opens a
  fullscreen menu of centred links). The Figma never specified these - they were
  designed pragmatically. If a breakpoint needs adjusting, change it in that one
  section. The fullscreen phone menu is keyed off a `.menu-open` class on `<body>`
  (toggled by js/main.js), and its `backdrop-filter` is disabled while open so the
  menu isn't trapped inside the sticky header.
- **3 links are `#TODO` stubs** (the "Visit website" links on the project list
  and case-study pages). They are listed in README.md.

## Verifying a change

There are no tests. Check work by looking at it:

```
python3 -m http.server 8765      # then open http://localhost:8765
```

Confirm: no horizontal scrollbar, no broken images, every nav and footer link works,
and the page still matches the Figma design at 1440px wide.

The design lives at
https://www.figma.com/design/itl1lRiuHDxlLl8PE5OmwB/Portfolio-Prep
(Tom owns it. Note the Figma MCP server is limited to 20 calls/month on a free plan.)
