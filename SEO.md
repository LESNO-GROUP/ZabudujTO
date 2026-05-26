# SEO — instrukcja podpięcia ZabudujTO do wyszukiwarek

## Co już jest w kodzie

✅ Meta tagi (title, description) na każdej stronie
✅ Open Graph + Twitter Cards (preview w social media)
✅ Canonical URLs
✅ Favicony i Apple Touch Icon
✅ JSON-LD (Schema.org) — Organization + Service
✅ robots.txt
✅ sitemap.xml
✅ noindex na regulaminie i polityce prywatności (treści prawne, niepotrzebne w Google)
✅ Placeholder dla Google Analytics 4 w index.html (zakomentowany)

---

## 1. Google Search Console (musisz zrobić sam)

1. Wejdź na https://search.google.com/search-console
2. Zaloguj się Twoim Gmailem
3. Kliknij **Add property** → wybierz **Domain** (nie URL prefix)
4. Wpisz: `zabudujto.pl`
5. Google da Ci **TXT record** do dodania w DNS — coś jak `google-site-verification=ABC123XYZ`
6. Wejdź w panel home.pl → DNS dla zabudujto.pl
7. Dodaj rekord TXT:
   - Typ: TXT
   - Nazwa: @ (lub puste, lub zabudujto.pl — zależy od interfejsu)
   - Wartość: `google-site-verification=ABC123XYZ` (to co Ci Google podał)
8. W GSC kliknij **Verify** — może chwilę potrwać (do kilku godzin propagacji DNS)
9. Po weryfikacji w GSC → **Sitemaps** → wklej `https://www.zabudujto.pl/sitemap.xml` → Submit

Po 24-48h Google zacznie indeksować stronę.

---

## 2. Google Analytics 4

1. Wejdź na https://analytics.google.com
2. **Admin** → **Create property** → nazwa: ZabudujTO
3. Wybierz **Web** → URL: `https://www.zabudujto.pl`
4. Dostaniesz **Measurement ID** — wygląda tak: `G-XXXXXXXXXX`
5. W `index.html` znajdź sekcję `<!-- Google Analytics 4 -->` (linia ~60)
6. Odkomentuj (usuń `<!--` i `-->` wokół skryptu)
7. Zamień `G-XXXXXXXXXX` na Twój prawdziwy ID
8. Skopiuj ten sam blok do `konfigurator.html` w `<head>`
9. Commit + deploy

Po 24h zobaczysz pierwsze dane w panelu Analytics.

---

## 3. Bing Webmaster Tools (opcjonalnie, daje ~5% ruchu)

1. https://www.bing.com/webmasters
2. Add site → `https://www.zabudujto.pl`
3. Możesz zaimportować z Google Search Console (przycisk **Import from GSC**) — wtedy nie trzeba weryfikować ponownie
4. Submit sitemap

---

## 4. Co Google może oceniać po wgraniu

**Plusy:**
- Czas ładowania (strona jest lekka, statyczna — A+)
- Mobile-friendly (responsywna)
- HTTPS (Vercel automatyczny)
- Treść po polsku, lang="pl"
- Schema.org Organization/Service

**Co wymaga uwagi:**
- Brak tekstu z lokalizacją (Katowice/Polska) widocznego na stronie poza JSON-LD → dodaj sobie sekcję „Obsługujemy całą Polskę" lub konkretne miasta na landing
- Niewiele tekstu długiego — sekcje są krótkie. Dla SEO przydałby się 1 blog/artykuł („Jak zmierzyć wnękę", „Jakie szafy wnękowe są najlepsze") — to zwiększa szanse na ruch z fraz długiego ogona
- Brak zewnętrznych linków zwrotnych (linki z innych stron) — to się buduje czasem przez katalogi firm, fora wnętrzarskie itp.

---

## 5. Słowa kluczowe — na co celujemy

- "szafa wnękowa na wymiar"
- "garderoba na wymiar online"
- "meble wnękowe DIY"
- "konfigurator szafy"
- "szafa do samodzielnego montażu"
- "formatki meblowe na wymiar"
- "regał wnękowy na wymiar"
- "zabudowa łazienkowa"

Te frazy już występują w treści (description, h1, h2). Google sam wybiera słowa z naturalnego tekstu — meta keywords (ten stary tag) Google ignoruje od 2009 r.

---

## 6. Co zrobić po pierwszych 2 tygodniach od deploymentu

1. Sprawdź w GSC → **Coverage** czy nie ma błędów indeksowania
2. **Performance** → zobacz po jakich frazach Cię ludzie znajdują
3. **Sitemap** → status powinien być "Success"
4. **Core Web Vitals** → wyniki LCP, FID, CLS
