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

Six flat HTML pages, one stylesheet, one image folder:

```
index.html  profile.html  projects.html
project-qredo.html  project-hanover.html  project-lokal.html
css/style.css        all styling
assets/img/          all images
assets/cv/           CV pdf
.nojekyll            stops GitHub running Jekyll over the files
```

## The header and footer are duplicated in all six pages

This is deliberate — it is the cost of having no build step. **When you change the
header or footer, change it in all six files in the same commit.** Verify with:

```
grep -c 'site-footer__legal' *.html     # must print 1 for every page
```

Each page marks its own nav item with `aria-current="page"`. Case-study pages add
`site-header--overlay` to the header and use the white logo, because their header
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

- **No mobile or tablet layout.** The Figma only ever specified 1440px and 1920px.
  Below roughly 1000px the site is cramped but not broken. Mobile is a deliberate
  next step to design with Tom, not something to improvise.
- **22 images are still placeholders** on the case-study pages, and **6 links are
  `#TODO` stubs.** Both lists are in README.md. When replacing a placeholder, swap
  the whole `<div class="placeholder">` for an `<img>` with explicit `width` and
  `height` attributes (prevents the page jumping as images load) and `loading="lazy"`
  if it is below the fold.

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
