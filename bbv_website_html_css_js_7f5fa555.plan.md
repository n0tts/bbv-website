---
name: BBV Website HTML/CSS/JS
overview: Build a multi-page, responsive website for Borneo Beach Villas & Suites using vanilla HTML, CSS, and JavaScript, based on the Homepage.pdf layout and content from the three plan PDFs.
todos: []
isProject: false
---

# Borneo Beach Villa Website – HTML/CSS/JavaScript Plan

## Source summary (from [Plans/Homepage.pdf](Plans/Homepage.pdf) and related PDFs)

**Homepage** contains:

- **Hero**: Tagline “Where the Horizon Meets the Soul”, location (Karambunai Peninsula, Sabah), short blurb, CTA feel
- **Global nav**: Home, Information, Villas & Suites, Experiences, Location, Contact, Book Now
- **Our Residences**: Two products — (1) Pool Villa By The Beach (3 bed, private pools, kitchennette, from RM750/night), (2) Sunset Spa Suite (3 bed, private jacuzzi, from RM550/night), each with short description and “Book Now”
- **Experiences**: “View Gallery” section; copy about beachfront living, coastal escape, spacious villas
- **Newsletter / social**: “Stay Connected” with Follow Us → Facebook, Instagram, Tiktok
- **Footer**: Brand line, Quick Links (About Us, Villa & Suites, Activities, Gallery, Career), Reach Out (address, phone, email), copyright, Privacy Policy, Terms of Service

**Information page** (from [Plans/Information of Borneo Beach Villa.pdf](Plans/Information of Borneo Beach Villa.pdf) and [Plans/About Us.pdf](Plans/About Us.pdf)): Intro, How to get here, Our Facilities, Check-in/Check-out, Customer Service, General Information (house rules, beach/pool, wildlife).

---

## Recommended file structure

```
bbv-website/
├── index.html              # Homepage
├── information.html        # Information / general info page
├── css/
│   ├── reset.css           # Optional minimal reset
│   ├── variables.css       # Colors, fonts, spacing
│   └── main.css            # Global + component styles
├── js/
│   └── main.js             # Nav, mobile menu, smooth scroll, any UI
├── images/                 # Placeholder or real assets
│   ├── hero.jpg
│   ├── pool-villa.jpg
│   ├── spa-suite.jpg
│   └── ...
└── Plans/                  # Existing PDFs (unchanged)
```

Optional later: `villas.html`, `experiences.html`, `location.html`, `contact.html` as linked in nav (can start as copies of `information.html` or simple placeholders).

---

## Page-by-page implementation

### 1. Homepage (`index.html`)

- **Doctype, meta viewport, title, one shared CSS bundle** (e.g. `css/main.css`), one JS file (`js/main.js`).
- **Header**: Logo/text “Borneo Beach Villas & Suites”; nav links (Home, Information, Villas & Suites, Experiences, Location, Contact, Book Now). Use a `<header>` with inner wrapper for alignment; “Book Now” can be a button style.
- **Hero**: Full-width section with background image (or gradient + image). Headline: “Where the Horizon Meets the Soul”, subline: “Karambunai Peninsula, Sabah”, supporting line and optional CTA. Use semantic `<section>` and heading hierarchy (e.g. one `h1`, then `p` or `h2`).
- **Our Residences**: Section with two cards (Pool Villa By The Beach, Sunset Spa Suite). Each card: image, title, short description from PDF, feature tags (e.g. 3 Bedrooms, Private Pools, Kitchennette), price “From RM750/night” / “From RM550/night”, “Book Now” button. Use grid or flex for two columns; stack on small screens.
- **Experiences**: Section title “Experiences”, “View Gallery” CTA, 2–3 short value props (True Beachfront Living, Quiet Coastal Escape, Spacious Villas). Optional: 3-column grid or list with icons/illustrations.
- **Stay Connected**: Small section for “Stay Connected for Daily Inspiration and Exclusive Offers” + Follow Us (Facebook, Instagram, Tiktok) as links (href `#` or real URLs later).
- **Footer**: Same as below, shared across pages.

### 2. Information page (`information.html`)

- Same header and footer as homepage.
- Breadcrumb: Home > Information (optional but in About Us PDF).
- **Content sections** (headings + paragraphs from the Information PDF):
  - Intro (location, ownership, self-check-in, audience).
  - How to get here (airport distance, taxi costs, car rental).
  - Our Facilities: In-room entertainment, Bathroom/Toilet amenities, Food and Beverages, Shopping, Internet (bullet list or short paragraphs).
  - Check-in / Check-out times and notes.
  - Customer Service: Phone/WhatsApp, Wechat, Kakaotalk.
  - General Information: bullet list (self check-in, no visitors/pets, no strong-smelling fruit, no smoking, no parties, beach/pool safety, swimming attire, wildlife).
- Optional: “Get Direction From Airport” and “View Location Map” as buttons linking to Google Maps (URLs TBD).
- Use semantic sections (`<section>`, `<h2>`) and consistent spacing.

### 3. Shared footer (both pages)

- **Brand**: “Borneo Beach Villas & Suites” + one-line tagline (from PDF).
- **Quick Links**: About Us, Villa & Suites, Activities, Gallery, Career (anchor `#` or paths like `information.html`, `villas.html`, etc.).
- **Reach Out**: Address (Off Jalan Sepanggar Bay, Karambunai, 88993 Kota Kinabalu, Sabah, Malaysia), phone +60 88-411 111, email [reservations@borneobeachvillas.com](mailto:reservations@borneobeachvillas.com).
- **Legal**: © 2025 Borneo Beach Villas. All Rights Reserved. Privacy Policy, Terms of Service (links to `#` or future pages).
- Layout: on desktop, two or three columns (e.g. Quick Links | Reach Out); on mobile stack vertically.

---

## CSS approach

- **Variables** (`variables.css`): Primary/secondary colours (e.g. ocean blues, sand/cream, dark text), font stack (e.g. serif for headings, sans for body), spacing scale, breakpoints (e.g. 768px, 1024px).
- **Global**: Box-sizing, body font and background; container max-width and horizontal padding.
- **Header**: Sticky or static; flex between logo and nav; mobile: hamburger + overlay/dropdown menu (JS toggles class).
- **Hero**: Min-height (e.g. 70vh), background-size cover, dark overlay for text readability, centered text; typography hierarchy.
- **Cards**: Border or subtle shadow, rounded corners, image on top, padding; hover state optional.
- **Footer**: Dark or contrasting background, multi-column flex/grid, smaller font.
- **Responsive**: Breakpoints for nav (hamburger below ~768px), single-column residences and footer stacks, fluid typography (clamp or media queries).

No framework: plain CSS with variables and one main stylesheet (plus optional reset).

---

## JavaScript (minimal)

- **Mobile menu**: Toggle class on nav (e.g. `.nav-open`) when hamburger is clicked; CSS shows/hides menu and animates icon.
- **Smooth scroll**: For in-page anchors (e.g. #residences, #experiences) using `scrollBehavior: 'smooth'` or a small scroll function.
- **Optional**: Lightbox or gallery for “View Gallery” (can be phase 2); form validation for any future contact form.

All in one `main.js`; no build step.

---

## Content and assets

- **Copy**: Use the exact text from the three PDFs (already extracted above) for hero, residences, experiences, footer, and full Information page.
- **Images**: Placeholder images (e.g. Unsplash: beach, villa, spa) or client assets in `images/`; use descriptive `alt` text.
- **Links**: “Book Now” can point to `#` or a `contact.html`/booking URL; social and legal links to `#` until real URLs are provided.

---

## Implementation order

1. Create folder structure and `variables.css` + `main.css` (variables, reset, base).
2. Build shared header and footer in `index.html` and style them; add `information.html` with same header/footer and placeholder content.
3. Implement homepage: hero, residences (cards), experiences, stay-connected.
4. Implement information page: all sections with real content from PDFs.
5. Add responsive rules and mobile nav; wire up `main.js` for menu and smooth scroll.
6. Add placeholder images and finalise links (Book Now, Quick Links, footer).

---

## Optional later

- Separate pages for Villas & Suites, Experiences, Location, Contact (and wire nav).
- Simple gallery page or lightbox for “View Gallery”.
- Privacy Policy and Terms of Service pages.
- Replace placeholders with final imagery and real social/booking URLs.

