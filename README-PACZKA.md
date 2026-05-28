# Paczka v154 — co zmienić w repo

## Pliki do wgrania (zachowując strukturę)

- konfigurator.html             → nadpisz w root
- konfigurator-app.js           → nadpisz w root
- api/send.js                   → NOWY — utwórz folder `api/` i wrzuć
- package.json                  → NOWY — w root

## Po wgraniu na GitHub

Vercel zauważy package.json i sam zainstaluje `busboy`.

## ENV VARS w Vercel (Project Settings → Environment Variables)

| Klucz | Wartość |
|---|---|
| BREVO_API_KEY | klucz z https://app.brevo.com/settings/keys/api |
| MAIL_FROM_EMAIL | poseydongroup.tech@gmail.com (zweryfikowany sender w Brevo) |
| MAIL_FROM_NAME | ZabudujTO Konfigurator |
| MAIL_TO | kontakt@zabudujto.pl |

## Test

1. Push do GitHub → Vercel zbuduje
2. Otwórz /konfigurator.html
3. Wypełnij krok 1–5, w 5 załącz dowolny plik
4. „Wyślij projekt" → mail przyjdzie z pełną tabelą HTML + załącznikami + payload.json
