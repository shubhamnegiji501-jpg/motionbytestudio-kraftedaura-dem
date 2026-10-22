# KRAFTED AURA storefront preview

The storefront now includes an automatically changing full-width home hero, a static all-products grid with a See more link, gifting and collection sections, studio story, and links to the official Instagram profile/highlights, plus Shop, Product, Cart, Wishlist, Login, Signup, and Checkout pages. The public Instagram profile supplied the logo image already present in `assests/logo-Photoroom.png` and the profile bio wording. Instagram's individual posts prompted a login wall, so their full-size candle photos could not be reliably accessed; the catalog and hero photos remain temporary preview imagery. This workspace did not contain the original e-commerce app, product catalog, backend, or store settings, so the sample catalog is illustrative and account, checkout, and newsletter pages do not connect to live services.

## Connecting the existing store

The homepage and shop accept `window.KRAFTED_AURA_PRODUCTS` before `app.js` or `store.js` loads. Each item should have `id`, `name`, `price` (INR amount), `image`, and a `category`; optional fields are `scent`, `moodTags` (array), and `description`. The examples in `catalog.js` are sample data and must be replaced with the live catalog before launch.

Set `window.KRAFTED_AURA_SETTINGS.announcementBar` from the store settings. The newsletter form uses `window.KRAFTED_AURA_SETTINGS.newsletterSubscribe(email)`, an async function that should call the store's existing consent-aware signup endpoint and reject on errors. Cart and wishlist are currently local preview state; replace those handlers with the existing store cart and wishlist actions. Login and signup forms are visual previews and need the existing authentication flow. Checkout validates delivery details but does not create orders or process payments; connect the store's checkout and payment providers.

The social, policy, shipping, and support links are placeholders until the store's real destinations are supplied. Product photos in this static preview are remote Unsplash images; replace them with the store's approved brand and catalog media before launch.
