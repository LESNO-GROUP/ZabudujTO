# ZabudujTO

Konfigurator mebli wnękowych na wymiar do samodzielnego montażu (DIY).

**Live:** https://www.zabudujto.pl

## Struktura projektu

```
.
├── index.html                    # Landing page
├── konfigurator.html             # Konfigurator 5-krokowy
├── konfigurator-data.js          # Dane: typy, dekory, akcesoria, ceny
├── konfigurator-app.js           # Logika + render SVG
├── regulamin.html                # Regulamin sklepu
├── polityka-prywatnosci.html     # Polityka prywatności (RODO + cookies)
├── api/
│   └── send.js                   # Endpoint Vercel — Brevo przez SMTP
├── assets/
│   ├── logo.png                  # Logo brand
│   ├── hero-collage.png          # Hero
│   ├── decors/                   # 127 dekorów Kronospan
│   ├── akcesoria/                # PNG-i akcesoriów (zawiasy, uchwyty, ...)
│   └── types/                    # Ikony typów mebli
└── STAN_PROJEKTU.md              # Notatka robocza
```

## Deployment

### Vercel
1. Połącz repo z Vercel
2. Framework preset: **Other** (static)
3. Add domain: `zabudujto.pl` + `www.zabudujto.pl`
4. Zmienne środowiskowe (w razie potrzeby):
   - `BREVO_API_KEY` — klucz API Brevo dla `api/send.js`
   - `MAIL_TO=kontakt@zabudujto.pl`

### DNS (home.pl)
- A record `@` → `76.76.21.21` (Vercel)
- CNAME `www` → `cname.vercel-dns.com`

### Email (home.pl Poczta Standard 5)
- Założyć skrzynkę `kontakt@zabudujto.pl`
- W przyszłości — DKIM/SPF dla Brevo (po wpięciu domeny)

## Lokalnie

Strona statyczna — wystarczy otworzyć `index.html` w przeglądarce, lub:
```bash
python3 -m http.server 8000
# albo
npx serve
```

## Wersjonowanie

Konfigurator ma parametr `?v=` przy tagach `<script>` — przy każdej zmianie
`konfigurator-data.js` lub `konfigurator-app.js` zwiększ wersję, żeby ominąć cache.

## Licencja

Wszystkie prawa zastrzeżone © 2026
`;
