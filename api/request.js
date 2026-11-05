// Vercel Serverless Function: POST /api/request
// 1) emails the request to the admin   2) emails a confirmation to the user   3) optional Telegram push
// Secrets come ONLY from Vercel Environment Variables (never put keys in the website files).

const hits = new Map(); // best-effort rate limit (per serverless instance)
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const clean = (v, max) => String(v ?? '').replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '').trim().slice(0, max);
const refId = () => 'TGR-' + Date.now().toString(36).toUpperCase().slice(-6) + Math.random().toString(36).toUpperCase().slice(2, 4);

let smtp;
async function sendMail(payload, key, idem) {
  const { SMTP_USER, SMTP_PASS, SMTP_HOST } = process.env;
  if (SMTP_USER && SMTP_PASS) { // Gmail / any SMTP (no domain verification needed)
    smtp = smtp || require('nodemailer').createTransport({ host: SMTP_HOST || 'smtp.gmail.com', port: 465, secure: true, auth: { user: SMTP_USER, pass: SMTP_PASS } });
    return smtp.sendMail({ from: payload.from, to: payload.to, replyTo: payload.reply_to, subject: payload.subject, html: payload.html, text: payload.text });
  }
  const r = await fetch('https://api.resend.com/emails', { // Resend (needs verified domain)
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json', 'Idempotency-Key': idem },
    body: JSON.stringify(payload),
  });
  if (!r.ok) throw new Error(`Resend ${r.status}: ${await r.text()}`);
  return r.json();
}

const rows = (d) => [['Reference', d.id], ['Name', d.name], ['Phone', d.phone], ['Email', d.email], ['Business', d.business], ['City', d.city],
  ['Service', d.service], ['Budget', d.budget], ['Timeline', d.timeline], ['Preferred contact', d.contactVia], ['Details', d.details]].filter((r) => r[1]);

function layout(site, title, intro, d, footer) {
  const tr = rows(d).map(([k, v]) => `<tr><td style="padding:10px 14px;color:#5a6783;width:150px;vertical-align:top;border-bottom:1px solid #e3e9f3">${esc(k)}</td><td style="padding:10px 14px;font-weight:600;border-bottom:1px solid #e3e9f3;white-space:pre-wrap">${esc(v)}</td></tr>`).join('');
  return `<!doctype html><html><body style="margin:0;background:#f3f6fb;font-family:Arial,Helvetica,sans-serif;color:#0d1830">
<table width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:24px 12px">
<table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#fff;border-radius:16px;overflow:hidden">
<tr><td style="background:#0a1630;padding:22px 28px"><img src="${site}/assets/img/logo-white.png" height="44" alt="TGR Digital Agency" style="display:block"></td></tr>
<tr><td style="padding:28px"><h1 style="margin:0 0 10px;font-size:22px">${title}</h1><p style="margin:0 0 20px;color:#5a6783;line-height:1.6">${intro}</p>
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f3f6fb;border-radius:12px;font-size:14px">${tr}</table>${footer}</td></tr>
<tr><td style="padding:16px 28px;background:#f3f6fb;color:#5a6783;font-size:12px">TGR Digital Agency · Dehradun, Uttarakhand, India · +91 89418 01033 · ${site.replace('https://', '')}</td></tr>
</table></td></tr></table></body></html>`;
}

module.exports = async (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') { res.setHeader('Allow', 'POST'); return res.status(405).json({ ok: false, error: 'Method not allowed.' }); }

  const { RESEND_API_KEY: key, ADMIN_EMAIL: admin, FROM_EMAIL: fromEnv, SMTP_USER, SMTP_PASS, SITE_URL, TELEGRAM_BOT_TOKEN: tgToken, TELEGRAM_CHAT_ID: tgChat } = process.env;
  const smtpMode = !!(SMTP_USER && SMTP_PASS);
  const from = fromEnv || (smtpMode ? `TGR Digital Agency <${SMTP_USER}>` : '');
  if (!admin || !(smtpMode || (key && from))) {
    console.error('Missing env: set ADMIN_EMAIL + (SMTP_USER & SMTP_PASS) or (RESEND_API_KEY & FROM_EMAIL) in Vercel.');
    return res.status(500).json({ ok: false, error: 'The form is not configured yet. Please WhatsApp us on +91 89418 01033.' });
  }
  const site = (SITE_URL || 'https://tgrdigitalagency.online').replace(/\/$/, '');

  // same-site check
  const origin = req.headers.origin;
  if (origin) {
    let h = ''; try { h = new URL(origin).host; } catch (_) {}
    const ok = h === req.headers.host || h === new URL(site).host || h === 'www.' + new URL(site).host;
    if (!ok) return res.status(403).json({ ok: false, error: 'Request blocked.' });
  }

  // rate limit: 5 requests / 10 min / IP
  const ip = String(req.headers['x-forwarded-for'] || '').split(',')[0].trim() || 'unknown', now = Date.now();
  const list = (hits.get(ip) || []).filter((t) => now - t < 600000);
  if (list.length >= 5) return res.status(429).json({ ok: false, error: 'Too many requests. Please try again in a few minutes.' });
  list.push(now); hits.set(ip, list);

  let b = req.body;
  if (typeof b === 'string') { try { b = JSON.parse(b); } catch (_) { b = {}; } }
  b = b || {};
  if (b.website) return res.status(200).json({ ok: true, id: refId() }); // honeypot: bots get a fake success

  const d = { name: clean(b.name, 80), phone: clean(b.phone, 20), email: clean(b.email, 120).toLowerCase(), business: clean(b.business, 100), city: clean(b.city, 60),
    service: clean(b.service, 80), budget: clean(b.budget, 40), timeline: clean(b.timeline, 40), contactVia: clean(b.contactVia, 20), details: clean(b.details, 3000) };
  const err = (m, field) => res.status(400).json({ ok: false, error: m, field });
  if (d.name.length < 2) return err('Enter your full name.', 'name');
  if (!/^[+\d][\d\s\-]{8,15}$/.test(d.phone)) return err('Enter a valid phone number.', 'phone');
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(d.email)) return err('Enter a valid email address.', 'email');
  if (!d.service) return err('Choose a service.', 'service');
  if (d.details.length < 15) return err('Tell us a little more, at least 15 characters.', 'details');
  d.id = refId();

  const to = admin.split(',').map((s) => s.trim()).filter(Boolean);

  // 1) Admin notification (must succeed)
  try {
    await sendMail({
      from, to, reply_to: d.email,
      subject: `New request ${d.id}: ${d.service} – ${d.name}`,
      html: layout(site, 'New project request', `A new request just came in from the website. Reply to this email to answer ${esc(d.name)} directly.`, d,
        `<p style="margin:22px 0 0"><a href="tel:${esc(d.phone)}" style="background:#0a5fd8;color:#fff;padding:11px 20px;border-radius:99px;text-decoration:none;font-weight:700;font-size:14px">Call ${esc(d.phone)}</a> <a href="https://wa.me/${esc(d.phone.replace(/\D/g, ''))}" style="background:#1b9d52;color:#fff;padding:11px 20px;border-radius:99px;text-decoration:none;font-weight:700;font-size:14px">WhatsApp</a></p>`),
      text: rows(d).map(([k, v]) => `${k}: ${v}`).join('\n'),
    }, key, d.id + '-admin');
  } catch (e) {
    console.error('Admin mail failed', e.message);
    return res.status(502).json({ ok: false, error: 'We could not send your request right now. Please WhatsApp us on +91 89418 01033.' });
  }

  // 2) User confirmation + 3) optional Telegram push (failures are logged, not shown to the user)
  const jobs = [sendMail({
    from, to: [d.email], reply_to: to[0],
    subject: `We received your request (${d.id}) – TGR Digital Agency`,
    html: layout(site, `Thank you, ${esc(d.name.split(' ')[0])}! Your request was submitted successfully.`,
      'We have received your details. Our team will review them and contact you shortly, usually within a few hours, with the scope, timeline and price. Your reference number is <b>' + d.id + '</b>.', d,
      `<p style="margin:22px 0 6px;color:#5a6783;font-size:14px">Need us sooner? Reach us directly:</p><p style="margin:0"><a href="tel:+918941801033" style="background:#0a5fd8;color:#fff;padding:11px 20px;border-radius:99px;text-decoration:none;font-weight:700;font-size:14px">Call +91 89418 01033</a> <a href="https://wa.me/918941801033?text=${encodeURIComponent('Hello TGR Digital Agency, my request reference is ' + d.id)}" style="background:#1b9d52;color:#fff;padding:11px 20px;border-radius:99px;text-decoration:none;font-weight:700;font-size:14px">WhatsApp us</a></p>`),
    text: `Hello ${d.name},\n\nYour request (${d.id}) was submitted successfully. We will contact you shortly.\n\nTGR Digital Agency\n+91 89418 01033`,
  }, key, d.id + '-user')];
  if (tgToken && tgChat) {
    jobs.push(fetch(`https://api.telegram.org/bot${tgToken}/sendMessage`, { method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: tgChat, text: `New request ${d.id}\n${d.service}\n${d.name} · ${d.phone}\n${d.email}\n\n${d.details.slice(0, 600)}` }) }));
  }
  const out = await Promise.allSettled(jobs);
  out.forEach((o, i) => o.status === 'rejected' && console.error(i === 0 ? 'User confirmation failed' : 'Telegram failed', o.reason && o.reason.message));

  return res.status(200).json({ ok: true, id: d.id, confirmation: out[0].status === 'fulfilled' });
};
