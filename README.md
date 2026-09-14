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
| `index.html` | Home |
| `profile.html` | Profile |
| `projects.html` | Projects |
| `project-qredo.html` | Qredo case study |
| `project-hanover.html` | Hanover Research case study |
| `project-lokal.html` | Lokal (weRate) case study |
| `css/style.css` | How everything looks |
| `js/main.js` | Tiny script for the sticky header (no libraries) |
| `assets/img/` | All images |

---

## TO DO: six links still need real addresses

Every one of these is currently a dead placeholder. Search the project for `#TODO`
to find them all, or ask Claude: *"replace the TODO links with these addresses"*.

| Placeholder | What it should point to | Appears on |
|---|---|---|
| `#TODO-linkedin` | Your LinkedIn profile URL | Profile, every footer |
| `#TODO-cv` | Your CV — put the PDF in `assets/cv/` and link to it | Profile, every footer |
| `#TODO-visit-qredo` | The real Qredo website | Projects, Qredo case study |
| `#TODO-visit-hanover` | The real Hanover Research website | Projects, Hanover case study |
| `#TODO-visit-lokal` | The real Lokal / weRate website | Projects, Lokal case study |

## Product shots: all done

Every case-study product screen has been exported from Figma and wired in
(the circles, the main shots, and all gallery shots). No placeholders remain.

The `shot` images are the product screens, shown full-width and stacked one after
another.

---

## Changing things yourself

The easiest way is to ask Claude Code in plain English. Some examples that work:

- *"Change the headline on the home page to ..."*
- *"Make the purple a bit warmer"* — colours are all defined in one place at the top
  of `css/style.css`
- *"Add a fourth project called ..."*
- *"Swap my profile photo for the one in my Downloads folder"*
- *"The text on the Profile page is too small"*

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
