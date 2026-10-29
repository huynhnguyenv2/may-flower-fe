# Acceptance Criteria — Public MVP

## Catalog & browse

- [ ] Home loads emotional collections and featured products from API (Vietnamese UI).
- [ ] Collection page shows story and only active products with correct VND from-price.
- [ ] PDP shows variants, availability badge, and add-to-cart for available variants.

## Concierge

- [ ] Wizard completes all steps and shows Safe / Signature / Unexpected from live catalog.
- [ ] No product shown above customer budget or with zero availability.

## Checkout

- [ ] Guest can select delivery zone, date, and slot from API.
- [ ] Order submit validates recipient fields; creates one order row per idempotency key.
- [ ] Confirmation page shows order number and delivery summary.

## Cross-cutting

- [ ] Mobile layout usable at 375px width.
- [ ] API errors show friendly Vietnamese messages in UI.
- [ ] Product structured data present on PDP.

## Deferred (documented)

- [ ] Payment provider live (VNPay/MoMo/ZaloPay)—sandbox stub acceptable for MVP dev.
- [ ] Management UI parity for stock updates.
- [ ] Customer account and order history login.

## Tests

- [ ] API: catalog GET, order create, idempotency key replay.
- [ ] E2E: home → PDP → cart → checkout validation path.
