// ZabudujTO — Vercel Serverless Function
// Odbiera multipart/form-data z konfiguratora i wysyła e-mail przez Brevo (Sendinblue) API.
//
// ENV VARS (ustawić w Vercel Project Settings → Environment Variables):
//   BREVO_API_KEY          klucz API z https://app.brevo.com/settings/keys/api
//   MAIL_FROM_EMAIL        nadawca, np. poseydongroup.tech@gmail.com (musi być zweryfikowany w Brevo)
//   MAIL_FROM_NAME         np. "ZabudujTO Konfigurator"
//   MAIL_TO                kontakt@zabudujto.pl

export const config = {
  api: {
    bodyParser: false, // multipart parsujemy ręcznie
    sizeLimit: '15mb',
  },
};

import Busboy from 'busboy';

function parseForm(req) {
  return new Promise((resolve, reject) => {
    const bb = Busboy({ headers: req.headers, limits: { fileSize: 11 * 1024 * 1024, files: 6 } });
    const fields = {};
    const files = [];
    bb.on('field', (name, val) => {
      fields[name] = val;
    });
    bb.on('file', (name, stream, info) => {
      const chunks = [];
      stream.on('data', c => chunks.push(c));
      stream.on('end', () => {
        files.push({
          name: info.filename,
          mime: info.mimeType || 'application/octet-stream',
          buffer: Buffer.concat(chunks),
        });
      });
    });
    bb.on('finish', () => resolve({ fields, files }));
    bb.on('error', reject);
    req.pipe(bb);
  });
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.BREVO_API_KEY;
  const fromEmail = process.env.MAIL_FROM_EMAIL;
  const fromName = process.env.MAIL_FROM_NAME || 'ZabudujTO Konfigurator';
  const toEmail = process.env.MAIL_TO || 'kontakt@zabudujto.pl';

  if (!apiKey || !fromEmail) {
    console.error('Missing env: BREVO_API_KEY / MAIL_FROM_EMAIL');
    return res.status(500).json({ error: 'Server misconfigured' });
  }

  try {
    const { fields, files } = await parseForm(req);
    const ref = fields.ref || 'ZT-' + Date.now();
    const subject = fields.subject || `Nowe zgłoszenie ${ref}`;
    const html = fields.html || '<p>Brak treści.</p>';
    const replyTo = fields.email && /\S+@\S+\.\S+/.test(fields.email)
      ? { email: fields.email, name: fields.name || '' }
      : null;

    const attachments = (files || []).map(f => ({
      name: f.name,
      content: f.buffer.toString('base64'),
    }));

    // dodaj payload JSON jako załącznik, żeby można było zarchiwizować

    const body = {
      sender: { email: fromEmail, name: fromName },
      to: [{ email: toEmail }],
      subject,
      htmlContent: html,
      ...(replyTo ? { replyTo } : {}),
      ...(attachments.length ? { attachment: attachments } : {}),
    };

    const r = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': apiKey,
        Accept: 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!r.ok) {
      const txt = await r.text();
      console.error('Brevo error:', r.status, txt);
      return res.status(502).json({ error: 'Mail send failed', details: txt });
    }

    return res.status(200).json({ ok: true, ref });
  } catch (err) {
    console.error('Submit error:', err);
    return res.status(500).json({ error: 'Internal error' });
  }
}
