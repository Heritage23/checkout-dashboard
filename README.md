# checkout-dashboard
Checkout + Sales Dashboard

A responsive checkout flow and a small sales analytics dashboard, built with plain HTML, CSS and JavaScript.

Live demo: Checkout + Sales Dashboard

A responsive checkout flow and a small sales analytics dashboard, built with plain HTML, CSS and JavaScript. No frameworks, no build step, no libraries.

Live demo: https://github.com/Heritage23/checkout-dashboard.git

Screenshot: screenshot.png

What it shows

**Responsive checkout:** two columns on desktop, one on mobile with the order summary first.
**Live card preview** that updates as you type and flips to show the CVV.
**Validation:** email, name, card number (Luhn checksum), future expiry, CVV, with inline error messages and focus moved to the first error.
**Micro-animations:** total bump, button spinner, self-drawing success checkmark. All respect `prefers-reduced-motion`.
**Dashboard:** KPIs, a 14-day revenue line chart built in hand-written SVG, payment-method split and a drop-off funnel. Completing a checkout updates these numbers.
**Theming:** CSS custom properties with automatic dark mode.
**Accessibility basics:** labelled inputs, `aria-invalid`, tab roles, visible focus rings, numeric keypads on mobile.

## Try it

Open `index.html` in a browser. Test card: `4242 4242 4242 4242`, any future expiry, any 3-digit CVV.

## Structure

- `index.html`: markup
- `style.css`: tokens, layout, animations
- `app.js`: cart state, formatting, validation, payment flow, dashboard rendering

## Notes and limitations

- Payment is simulated with a timeout. There is no backend, and real card data should never be handled like this.
- Dashboard data is mock and resets on refresh.
- Not yet covered by automated tests or a full accessibility audit.
