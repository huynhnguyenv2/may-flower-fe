# UI/UX Guidelines — Public Website

## Design principles

- **Editorial first:** Large typography, generous whitespace, restrained palette; avoid dense generic ecommerce grids.
- **Emotion-first discovery:** Collections lead with feeling titles and short stories before product SKUs.
- **Mobile-first:** Touch targets ≥ 44px; readable type at 16px base; sticky checkout summary on small screens.
- **Accessible:** WCAG 2.1 AA targets—focus rings, color contrast, form labels, keyboard navigation for Concierge steps.
- **Honest imagery:** Real product photography on PDP. Any illustrative or AI-generated visuals must be labeled—not shown as the exact delivered bouquet.

## Typography

- **Display:** Serif or high-contrast editorial face for heroes and collection titles (e.g. Playfair Display / Cormorant class).
- **UI / body:** Clean sans (e.g. DM Sans / Source Sans 3) for navigation, forms, and product metadata.
- **Scale:** Hero 2.5–4rem mobile/desktop; section titles 1.5–2rem; body 1rem; captions 0.875rem.

## Color (starter tokens)

- **Background:** `#FAF8F5` (warm paper)
- **Foreground:** `#1A1A1A`
- **Accent / brand:** `#5C4033` (deep umber) with `#C4A484` (soft gold) highlights
- **Mood swatches:** Per collection—muted rose, sage, dusk blue—for cards only, not full-page fills
- **Semantic:** Success `#2D6A4F`, Error `#9B2226`, Warning `#CA6702`

## Components

- **Emotional collection card:** Feeling title, 2-line story, mood color strip, hover subtle lift.
- **Product card:** 4:5 image, name, from-price VND, subtle availability dot (available / limited / unavailable).
- **Concierge:** Step indicator, one primary question per screen, three result tiers with clear labels.
- **Checkout:** Grouped sections—recipient, message, delivery slot, summary; inline validation messages in Vietnamese.

## Motion

- Subtle transitions (150–250ms) on hover/focus; no autoplay carousels with critical content only in slides.

## Content locale

- **Default:** Vietnamese (`vi`).
- **Optional:** English (`en`) via `next-intl`; currency always VND for MVP.

## SEO

- Unique titles/descriptions per collection and product; JSON-LD `Product` and `BreadcrumbList` on PDP and catalog pages.
