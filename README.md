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
- Diwali offer khatam hone par `offer.html` aur `index.html` ke offer text badlo.
- Search Console verification tag milne par har page ke `<head>` me daalo.
