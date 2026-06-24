# Hearthwood Studio — Woodworking Portfolio + Shop

## Original Problem Statement
> I want to make a website that showcases my woodworking projects. I want it to have a thing that says "contact here" and also you can buy stuff on the website.

## User Choices (locked, Feb 2026)
- **Payments:** Stripe (test mode, `sk_test_emergent` in `/app/backend/.env`)
- **Contact form:** Stored in MongoDB (`contact_messages` collection). No email delivery (per user).
- **Imagery:** Curated placeholder woodworking photos; user will swap with own.
- **Design:** Rustic / warm — wood tones, Playfair Display + Work Sans, asymmetric editorial.
- **Admin panel:** None for now.

## Architecture
- **Backend** (`/app/backend/server.py`): FastAPI under `/api` prefix.
  - `GET /api/products` & `GET /api/products/{id}` — server-authoritative `PRODUCTS` dict (4 pieces).
  - `POST /api/contact` — saves to `contact_messages`.
  - `POST /api/checkout/session` — creates Stripe Checkout via `emergentintegrations`, records `payment_transactions` row.
  - `GET /api/checkout/status/{session_id}` — polls and updates payment_transactions.
  - `POST /api/webhook/stripe` — webhook receiver.
- **Frontend** (React + react-router):
  - `/` Home (hero, about, asymmetric portfolio grid, process, workshop banner)
  - `/shop` Shop grid
  - `/shop/:id` Product detail with sticky image + Buy via Stripe
  - `/contact` Editorial split form
  - `/payment/return` polling success/cancel handler
- **Mongo collections:** `contact_messages`, `payment_transactions`.

## Personas
- **Visitor browsing portfolio** — wants to see craft, get a feel, find contact.
- **Buyer** — clicks a piece, hits Buy → Stripe → success page.
- **Commission inquirer** — uses contact form for custom work.

## Implementation Log
- **2026-02-24** — MVP shipped: hero/about/portfolio/process/workshop home; 4-product shop; product detail + Stripe checkout; contact form; payment return polling; rustic Playfair + Work Sans theme; full backend + frontend tested (100% pass).

## Backlog
- **P1:** Replace placeholder images with the maker's real photos. Add image gallery on product detail.
- **P1:** Resend/SendGrid email notification on new contact submission + new order.
- **P2:** Simple admin panel to add/edit products and view contact messages.
- **P2:** Filter shop by category; "Sold" state for one-of-a-kind pieces.
- **P2:** Instagram feed embed in footer; Google Analytics; sitemap.
- **P3:** Multi-image product galleries; in-progress / journal blog; customer reviews.
