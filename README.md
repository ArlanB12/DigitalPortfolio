# Arlan Villaruel — Digital Portfolio v4

A dark/light editorial-style personal portfolio with smooth scroll navigation, ambient orbs, and project modals.

## Structure

```
/
├── index.html
├── assets/
│   ├── css/
│   │   └── style.css
│   ├── js/
│   │   ├── main.js
│   │   ├── certs.js       ← base64 certificate images
│   │   └── proj_imgs.js   ← base64 project screenshots
│   └── images/
│       └── avatar.jpeg
└── README.md
```

## Setup

1. Clone or download this repo.
2. Open `index.html` directly in a browser — no build step needed.
3. To enable the contact form, set your EmailJS credentials in `assets/js/main.js`:
   ```js
   const EMAILJS_SERVICE_ID  = 'YOUR_SERVICE_ID';
   const EMAILJS_TEMPLATE_ID = 'YOUR_TEMPLATE_ID';
   const EMAILJS_PUBLIC_KEY  = 'YOUR_PUBLIC_KEY';
   ```

## Hosting

Deploy to GitHub Pages, Netlify, or any static host by uploading the entire folder.
Make sure the folder root contains `index.html` — all asset paths are relative.

## Features

- Dark mode / Light mode toggle (persisted via localStorage)
- Continuous scroll — all sections reachable by scrolling, no page jumps
- Scroll-spy nav highlights active section automatically
- Bigger avatar with animated conic ring
- 5 stats on the home page
- Ambient gradient orbs, lighter in both modes
- Better text readability (larger font, increased line-height, higher contrast)
- Project modals with Bootstrap
- Cert lightbox viewer
- Contact form via EmailJS
- Fully responsive — mobile nav included
