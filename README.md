# TGR Digital Agency – Website (30 pages)

Static HTML website + Vercel serverless form API (`/api/request`) that emails **you (admin)** and the **customer** via Resend.

## Folder
- `index.html` – Home · `services.html` – all services · `services/*.html` – 20 service pages (one per service)
- `offer.html`, `our-work.html`, `about.html`, `contact.html` (map, WhatsApp, Instagram), `request.html` (form), `privacy-policy.html`, `terms-and-conditions.html`, `404.html`
- `api/request.js` – form backend · `vercel.json` – clean URLs, security + cache headers
- `sitemap.xml`, `robots.txt`, `site.webmanifest`, `assets/` (css, js, logo, images)

## 1) GitHub par upload
1. github.com par new repository banao (e.g. `tgr-digital-agency`).
2. Zip extract karo, **saari files repo ke root me** upload karo (index.html root me hi rahe). `.env` file kabhi upload mat karo.

## 2) Vercel par deploy
1. vercel.com → **Add New → Project** → GitHub repo import karo.
2. Framework Preset: **Other** · Build Command / Output Directory: khali chhodo → **Deploy**.
3. **Settings → Domains** me `tgrdigitalagency.online` add karo aur Vercel ke DNS records apne domain me daalo.

## 3) Resend (email) setup
1. resend.com → **Domains → Add Domain** → `tgrdigitalagency.online` → jo DNS records (SPF/DKIM) bataye woh domain me add karo → **Verify**.
   (Verify kiye bina Resend sirf aapke apne email par bhejta hai, customer ko confirmation nahi jayega.)
2. **API Keys → Create API Key** (Sending access).

## 4) Vercel Environment Variables
Vercel → Project → **Settings → Environment Variables** me add karo (Production + Preview), phir **Redeploy**:

| Name | Value |
|---|---|
| `RESEND_API_KEY` | `re_...` (Resend API key) |
| `ADMIN_EMAIL` | jis inbox par requests chahiye, e.g. `contact@tgrdigitalagency.online` (multiple: comma se) |
| `FROM_EMAIL` | `TGR Digital Agency <noreply@tgrdigitalagency.online>` |
| `SITE_URL` | `https://tgrdigitalagency.online` (optional) |
| `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID` | optional – phone par instant push notification |

## 5) Test
Live site par request form bharo → admin inbox me "New request TGR-XXXX" aur customer ke email par "We received your request" aana chahiye. Na aaye to Vercel → **Logs** dekho.

## SEO (har page par – 20 points)
1 unique title · 2 meta description · 3 keywords · 4 canonical · 5 robots (index, max-image-preview) · 6 Open Graph · 7 Twitter card · 8 geo tags (Dehradun) · 9 hreflang en-IN · 10 favicon/manifest/theme-color · 11 author/publisher · 12 preconnect/fast fonts · 13 LocalBusiness schema · 14 WebSite schema · 15 Breadcrumb schema · 16 Service schema (service pages) · 17 FAQ schema · 18 ek H1 + proper H2/H3 · 19 image alt/width/height/lazy + semantic HTML + skip link · 20 internal links, sitemap.xml, robots.txt, clean URLs, security/cache headers.

**Launch ke baad zaroor karo:** Google Search Console me domain add karke `https://tgrdigitalagency.online/sitemap.xml` submit karo · Google Business Profile banao (Dehradun) · Bing Webmaster · Instagram bio me site link · reviews aur backlinks lo.
Dhyan rahe: Google rank ki 100% guarantee koi nahi de sakta. Ye setup technical SEO strong karta hai; top rank content, reviews aur backlinks se time ke saath aata hai.

## Customize
- Contact details / map: `contact.html` me iframe `src` ko apne Google Maps "Embed a map" link se badal sakte ho. Exact location ke liye schema `geo` (30.3165, 78.0322 approx) har page me update karo.
- New Year offer khatam hone par `offer.html` aur `index.html` ke offer text badlo.
- Search Console verification tag milne par har page ke `<head>` me daalo.

---
## v2 update (SEO + images + logo)
- **Har page ka unique title, description aur 10 keywords** — poori list `SEO-KEYWORDS.md` me hai (Dehradun digital agency, digital marketing, app development, website development, SEO, contact, etc.).
- **Har page par**: unique content (intro + FAQs), "Popular searches" block, FAQ + Breadcrumb + Service/ContactPage/AboutPage schema, aur Organization schema me square logo (`assets/img/logo-square.png`).
- **Contact page**: "TGR Digital Agency contact details" table (phone, emails, location), FAQs, ContactPage + contactPoint schema, nayi contact image.
- **Logo/favicon**: asli TGR logo se naya favicon set (`favicon.ico`, `favicon-48/96/144`, `icon-192/512`, `apple-touch-icon`). Purana generic "TGR" text icon hata diya.
- **Images fix**: stretch/lambi image ka asli bug (HTML `height` attribute + CSS `width:100%`) CSS me fix. Phone par offer cards chhote kiye. Nayi `services-team` aur `contact-team` images (webp, phone ke liye -sm version).
- `sitemap.xml` me image entries add, `site.webmanifest` update.

### Deploy ke baad (logo Google me aane ke liye zaroori)
1. Google Search Console me domain add karo → `https://tgrdigitalagency.online/sitemap.xml` submit karo.
2. URL Inspection me `/`, `/contact`, `/services` ke liye **Request indexing** dabao (favicon/logo tabhi refresh hota hai).
3. Google Business Profile banao/verify karo (Dehradun) — "tgr digital agency" search par logo, phone aur map isi se aata hai.
4. Favicon/logo Google me aane me kuch din se kuch hafte lag sakte hain; rank ki guarantee koi nahi de sakta.
