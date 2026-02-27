# Local Vibes Restaurant

A premium, fully responsive multi-page restaurant website built with **HTML**, **Tailwind CSS**, and **Vanilla JavaScript**. No frameworks.

## Design

- **Visual identity**: Animated gradients (Sunset Orange → Deep Purple, Gold → Burgundy, Teal → Midnight Blue), glassmorphism, soft shadows, parallax
- **Feel**: Elegant, cultural, modern, immersive, premium
- **Effects**: 3D tilt on cards, scroll reveal (Intersection Observer), smooth scroll, dark mode, loading screen with logo reveal

## Structure

```
local-vibes-restaurant/
├── index.html          # Home – hero, featured dishes, CTAs
├── about.html          # Our story, timeline
├── menu.html           # Filterable menu (Starters, Mains, Desserts, Drinks)
├── reservations.html   # Glassmorphism booking form + validation
├── gallery.html        # Image grid + lightbox
├── contact.html        # Contact form, map placeholder, social links
├── assets/
│   ├── css/custom.css   # Gradients, glass, keyframes, reveal
│   ├── js/
│   │   ├── main.js     # Nav, dark mode, scroll progress, scroll-to-top
│   │   ├── animations.js # Scroll reveal, parallax
│   │   ├── tilt.js     # 3D card tilt (mouse)
│   │   ├── menu-filter.js
│   │   ├── reservations.js
│   │   ├── lightbox.js
│   │   └── contact-form.js
│   └── images/         # Add your images here
└── components/
    ├── navbar.html     # Nav markup (inlined in each page)
    └── footer.html     # Footer markup (inlined in each page)
```

## Run locally

1. Open `index.html` in a browser (file protocol works; images load from Unsplash).
2. Or serve the folder with any static server, e.g.:
   - `npx serve .`
   - `python -m http.server 8000`
   - VS Code “Live Server” extension

## Features

- **Sticky nav** with animated underline on hover and active page
- **Dark mode** toggle (persisted in `localStorage`)
- **Scroll progress** bar at top
- **Scroll-to-top** button
- **Floating “Reserve Now”** button on home (after scroll)
- **Loader** with logo reveal on page load
- **Accessibility**: focus styles, `aria-label`, `alt` on images, semantic HTML
- **SEO**: meta description and keywords on each page
- **Lazy loading** on images where applicable

## Tech

- Tailwind CSS (CDN)
- Vanilla JS only (no React/Vue etc.)
- CSS `perspective` and `transform` for 3D tilt
- Intersection Observer for scroll reveal
- `requestAnimationFrame` in tilt.js for smooth updates

## Customization

- **Images**: Replace Unsplash URLs in the HTML with paths to files in `assets/images/` (use `loading="lazy"` where appropriate).
- **Map**: Replace the map placeholder in `contact.html` with an iframe or embed (e.g. Google Maps).
- **Colors**: Edit `assets/css/custom.css` (`:root` and gradient classes) and Tailwind classes in the HTML.

---

**Local Vibes Restaurant** – *Where local flavors meet modern elegance.*
