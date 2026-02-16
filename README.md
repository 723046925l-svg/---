# AI Virtual Dressing Room (Iraq-first MVP)

A bilingual (Arabic/English) web MVP for virtual try-on, styling suggestions, and size recommendations.

## MVP Goals
- Virtual try-on from user-uploaded photo (or camera-ready flow for future extension).
- Styling suggestions for men, women, and kids.
- Size recommendation assistance.
- Iraq market first, individual consumer focus.
- High quality target with up to 60 seconds generation time for render.
- Strong privacy baseline: user photo is processed in-browser and is not stored.

## Key Product Requirements
- Multi-catalog support (men/women/kids) with varied products.
- Save/share generated look.
- KPIs:
  - try-ons per session
  - purchase conversion after try-on
  - session duration
  - return rate
  - size recommendation satisfaction

## Privacy & Security
- The app shows a clear notice that user photos are not persisted.
- Browser-side processing only in this MVP.
- Example in-browser encryption helper included for transient payload encryption.

## Run locally
```bash
python3 -m http.server 8080
```
Then open `http://localhost:8080`.

## Project Structure
- `index.html` - main bilingual UI
- `styles.css` - styling
- `app.js` - catalog loading, recommendations, mock try-on render flow
- `data/catalog-men.json` - men catalog
- `data/catalog-women.json` - women catalog
- `data/catalog-kids.json` - kids catalog
- `assets/products/*.svg` - local product visuals used by the catalog
