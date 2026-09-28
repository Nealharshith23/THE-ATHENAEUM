# The Athenaeum

Neo-brutalist club website for The Athenaeum at St. Peter’s Engineering College.

## Run locally

```powershell
npm run client:dev
```

Open the Vite URL printed in the terminal. Build the production assets with:

```powershell
npm run build
```

## Edit the website

Most changes need no component edits. Update these files:

| Content | File |
| --- | --- |
| Brand, navigation, every section heading and paragraph, buttons, links, footer and SEO text | `src/data/siteContent.js` |
| Research topics and their descriptions | `src/data/researchAreas.js` |
| Project names, descriptions, technologies, artwork and image paths | `src/data/projects.js` |
| Event dates, times, venues, descriptions and poster titles | `src/data/events.js` |
| Member names, roles, categories and photo paths | `src/data/members.js` |
| Colors, fonts, spacing, layout, borders, shadows and animation styles | `src/index.css` and `src/App.css` |

Project and member images can be added to `public/`. Set their data entry’s `image` or `photo` field to a path such as `/projects/prototype.webp` or `/people/member-name.jpg`, and provide the matching alt text. To change the official mark, replace the file at `public/athenaeum-logo.png` with an approved logo asset and keep its proportions intact.

Keep navigation targets in `siteContent.nav.links` aligned with the section IDs in `src/App.jsx`. Project artwork `style` values are `orange`, `stone`, and `sage`; `layout` values are `orbit`, `columns`, and `sun`. An image path overrides the generated artwork. Edit `src/App.css` to add or change visual treatments.

Projects, events and people currently contain example placeholders. Confirm their copy, dates, links, names and photos before publishing. Social URLs and the join email are configurable in `siteContent.js`.

## Structure

`src/App.jsx` contains reusable site sections and interaction behavior. The data files provide their editable content, while the CSS files hold the visual system and responsive layouts. Framer Motion handles scroll reveals, entrance transitions, hover responses and the scroll progress indicator; reduced-motion preferences are respected.
