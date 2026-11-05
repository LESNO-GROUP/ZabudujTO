# ZabudujTO — PEŁNY STAN PROJEKTU / PRZEKAZANIE DO NOWEJ ROZMOWY

Stan na: 30.10.2026 · konfigurator **v229** · ostatnia paczka wdrożona przez Ciebie: **v227** (v228–v229 tylko w projekcie)

> **Dla nowej rozmowy:** ten plik opisuje WSZYSTKO, co jest potrzebne do dalszej pracy.
> Projekt źródłowy: **„Meble"**, ID: `afdc3db8-e58c-4eef-bd08-4dfe352385bd`
> Kopiowanie plików: `/projects/afdc3db8-e58c-4eef-bd08-4dfe352385bd/<ścieżka>`
> Następne zadanie: **przebudowa systemu rysowania mebla** (sekcja 12).

---

## 1. Biznes i ustalenia stałe

- **Marka:** ZabudujTO (wcześniej LESNO Meble). **Domena:** zabudujto.pl. **Mail:** kontakt@zabudujto.pl
- **Model:** meble na wymiar do **samodzielnego montażu** (DIY). Klient projektuje w konfiguratorze → wysyła zapytanie → Ty weryfikujesz projekt ręcznie i w ciągu **48 h** wysyłasz finalną wycenę. Płatność i proforma **poza stroną** — strona **nie jest sklepem e-commerce**.
- **Cięcie płyt robi zewnętrzna firma** — nie potrzebujesz listy cięć, tylko liczby arkuszy do wyceny.
- **VAT:** nie płacisz VAT. Cena pokazywana klientowi = dawna kwota netto. **Nigdzie nie pisać o VAT ani o zwolnieniu z VAT.** Pokazywać samą kwotę w zł.
- **Dane firmy:** ukryte (podmiot pośredniczący — nie pokazywać w stopce). Dane w regulaminie wg Twojej treści.
- **Akcesoria/okucia:** głównie **GTV**, ewentualnie **REJS**. Nie wymieniać konkretnych modeli w treściach marketingowych.
- **Transport:** ok. 500–800 zł (wyceniany osobno).
- **Pomiar:** robi klient. Nie sugerować, że przyjedziesz mierzyć.
- **Projekty specjalne / skosy / indywidualne** — wykonujesz, informacja na stronie głównej.
- **Styl współpracy:** krótko, konkretnie, po polsku. Pytać przy niejasnościach. Pokazywać realne ceny i liczby, nie zgadywać. Po każdej większej zmianie — paczka plików do wgrania na GitHub.

---

## 2. Infrastruktura

| Element | Stan |
|---|---|
| Hosting | **Vercel**, auto-deploy z **GitHub** (wgrywasz pliki ręcznie przez stronę GitHub) |
| Domena | zabudujto.pl (home.pl) → Vercel |
| Wysyłka maili | `api/send.js` — Vercel Serverless + **Brevo API**, parsowanie multipart przez **busboy** (`package.json`) |
| ENV na Vercel | `BREVO_API_KEY`, `MAIL_FROM_EMAIL` (poseydongroup.tech@gmail.com), `MAIL_FROM_NAME`, `MAIL_TO` (kontakt@zabudujto.pl) |
| Analytics | Google Analytics **G-56B7Z9955E** |
| SEO | meta, Open Graph (`assets/og-image.png`), favicony, `sitemap.xml`, `robots.txt`, opis w `SEO.md` |
| Baza danych | **brak** — zamówienia tylko w mailu (+ JSON w załączniku) |
| Zapis stanu klienta | `localStorage`, klucz `STORAGE_KEY = 'lesno_konfig_v3'` (celowo stary — nie zmieniać, bo klienci stracą projekty) |

⚠️ W projekcie leży `api/send.js` w wersji: `limits: { fileSize: 11 MB, files: 6 }`. **Używasz własnej poprawionej wersji send.js** — porównaj. Konfigurator wysyła teraz **więcej niż 6 plików** (rendery 2D, rendery 3D, szkic, instrukcja, JSON + do 5 plików klienta) → przy limicie 6 busboy **po cichu odetnie** nadmiarowe pliki. Do podniesienia.

---

## 3. Pliki

| Plik | Linie | Rola |
|---|---|---|
| `index.html` | — | Landing |
| `konfigurator.html` | ~1250 | Konfigurator: HTML + CSS (cały CSS inline w `<style>`), skrypty na końcu z `?v=229` |
| `konfigurator-data.js` | — | Dane: `TYPE_RENDERS, TYPES, ITEM_TYPES, LEGS, LEG_COLORS, FRAME_COLORS, MATERIALS (127), HINGES, SLIDING_PROFILES, SLIDING_COLORS, SLIDING_FILLS, HANDLE_COLORS, HANDLES, PRICING` |
| `konfigurator-app.js` | **4244** | Cała logika, wycena, rysowanie 2D, mail |
| `konfigurator-3d.js` | ~570 | Widok 3D (three.js 0.160 z unpkg, import dynamiczny; własna kontrola orbity) |
| `konfigurator-docs.js` | ~250 | Instrukcja montażu + potwierdzenie PDF dla klienta |
| `regulamin.html`, `polityka-prywatnosci.html` | — | Dokumenty prawne |
| `instrukcja-pomiaru.html` + `doc-page.js` | — | Instrukcja pomiaru A4 (NOWE, niepodlinkowane, nie było w paczce) |
| `api/send.js`, `package.json` | — | Backend maili |
| `robots.txt`, `sitemap.xml`, `SEO.md`, `README.md` | — | SEO / opis |
| `assets/` | — | `logo.png`, `hero-collage.png`, `og-image.png`, favicony, 6× `real_*.jpg` (realizacje) |
| `assets/decors/` | 127 jpg | Zdjęcia dekorów Kronospan |
| `assets/akcesoria/` | ~35 png | Zdjęcia: drążki, szuflady, kosze, nóżki, zawiasy, uchwyty, profile przesuwne |
| `assets/types/` | — | Grafiki typów, cokół/podłoga/wiszący, `schemat-pomiaru.png` |
| `paczka-v227/` | — | Ostatnia paczka do GitHub |
| `uploads/` | — | Pliki od Ciebie (cenniki, zdjęcia, stare wersje) |

Kolejność skryptów: `data → 3d → docs → app`. Przy każdej zmianie podbijać `?v=` we WSZYSTKICH czterech tagach w `konfigurator.html` (regex: `konfigurator-(data|3d|app|docs)\.js\?v=\d+`).

⚠️ Pułapka scope: `let STATE` i `const MATERIALS` w klasycznych skryptach **nie trafiają na `window`** — w innych plikach odwołuj się przez gołe nazwy (`STATE`, `MATERIALS`), nie `window.STATE`.

---

## 4. Model danych — STATE (`defaultState()`)

```
step, type ('szafa'|'garderoba'|'regal'|'lazienka'), typeName
dim:{w,h,d}                       — WNĘKA w mm (głębokość = cały mebel z frontem)
uneven                            — krzywe ściany
sections:[{w, items:[…], lift, frontCuts:[], frontOpen:[]}]
   items: {type:'polka'|'drazek'|'szuflada'|'kosz'|'siedzisko'|'pralka'|'otwarta', h, variant, frameColor, internal, opts}
   items[0] = GÓRA sekcji (kolejność od góry do dołu)
   w = szerokość WNĘTRZA sekcji
base ('cokol'|'podloga'|'nozki'|'wiszacy'), leg, legColor
accessories:{oswietlenie}
frontMode ('hinged'|'sliding'), sectionFronts:[bool]
material, splitFront, materialFront, matEditing, matTone
frontMat ('plyta'|'mdf'), mdf:{finish:'mat'|'polmat'|'polysk', ral, profile}
hinges ('standard'|'soft')
handle, handleColor
slidingProfile, slidingProfileColor, slidingFill, slidingSplits:{count, fills[]}
previewView ('front'|'open'|'3d')
band:{position,h,from,to} | null   — przelotowa półka
blenda:{left,right,top}            — 0–200 mm
slope:{on, side, hLow, flat}       — flat = długość prostego sufitu od ściany
notch:{on, side, from, w, h, d}    — uskok/komin
lead:{name,email,phone,city,notes,consent,regulations}
```

---

## 5. Geometria — kluczowe zasady i funkcje

- **Korpus:** `cabinetW() = wnęka − blenda L − blenda P − 6 mm`, `cabinetH() = wnęka − blenda górna − 5 mm`
- **Każda sekcja = osobna szafka** (własne 2 boki + wieniec górny + dolny + plecy HDF). Między szafkami **2 płyty (36 mm) + 1 mm luzu = 37 mm**.
- `usableInternalW()` = szerokość do rozdziału na wnętrza sekcji.
- Płyta **18 mm**. Wysokość w świetle = wys. szafki − 36 mm (2 wieńce).
- **Skos:** `cabinetHAt(x)` — zakotwiczony we WNĘCE (x korpusu + blenda.left + 3 mm), `flat` mierzony od ściany. `sectionCabinetH(si)` = wysokość w najniższym punkcie sekcji. `nicheCeilAt()`, `sideBlendaH()`.
- **Uskok:** `notchAffects(si)`, zmniejsza wysokość i głębokość formatek, NIE jest nową podłogą.
- **Limity formatek** (arkusz 2800×2070): korpus (boki, wieńce, półka przelotowa) **max 2000 mm**; przy **cokole** bok do **2780 mm**; blendy i cokół max **2750 mm**; fronty max **2780 mm**. `splitLen()`, `MAX_PIECE=2000`, `MAX_SHEET=2780`.
- **Dół + nadstawka:** `sectionSplitPlan(si)` → `{parts, joints}`. Styk zawsze **między elementami**, najchętniej **na półce** (ta półka znika — zastępuje ją wieniec). `sectionJointLoss()`, `interiorLayout()` (wspólne rozłożenie dla 2D i nakładki).
- **Drążek:** element = **strefa wieszania** (od półki pod do półki nad). Drążek wisi **100 mm pod półką** nad nim. Półki nad/pod dodawane automatycznie (`rodShelves(s,i)`), chyba że drążek jest pierwszy od góry/dołu (wtedy wieniec).
- **Siedzisko:** płyta na **450 mm**, następna na **1650 mm** (min. 1200 mm nad), pod siedziskiem wymuszona półka/szuflady. **Tylko płyta** (tapicerka wyceniana indywidualnie).
- **Pralka:** tylko łazienka, zawsze przy podłodze.
- **Lift:** sekcja podniesiona nad podłogę.
- **Fronty na część sekcji:** `frontCutCandidates`, `frontZones(si)`, `frontLeaves(si)` — podział na półce, strefy Front/Otwarte, szczelina 3 mm między skrzydłami, wymiary liczone **od dołu**.
- **Zawiasy:** `hingeCount(h)`: ≤600→2, ≤1000→3, ≤1750→4, ≤2500→5, wyżej 6 (per skrzydło).
- `normalizeShelfHeights()` — auto-wysokości półek, rebalans sekcji.

---

## 6. Wycena (`priceBreakdown()` w app.js, `PRICING` w data.js)

| Składnik | Zasada |
|---|---|
| Płyta | cena dekoru (Kronospan, zł/m²) × **pełne arkusze** z rozkroju `buildNesting()` / `nestSheets()` — arkusz 2800×2070, obcięcie 10 mm, rzaz 4 mm, słoje pilnowane (dekory `tone:'wood'`) |
| Cięcie | **2,50 zł/mb**, z realnej listy formatek `buildCutList()` |
| Obrzeże + oklejanie | **5 zł/mb**; formatki z 3 stron, fronty z 4 |
| Plecy HDF | **22 zł/m²** |
| **Robocizna** | **WYŁĄCZONA** (`laborPerSqm: 0`) — v228 |
| Projekt | **500 zł** ryczałt |
| Fronty MDF lakier | **450 zł/m²** (MDF 19 mm + lakier jednostronny), +1 tydzień |
| Cokół | +25 zł (pokazywany „+25 zł") |
| Wiszący (łazienka) | +29 zł |
| Półka z przegródką | +19 zł/szt. |
| LED | 100 zł/mb (adnotacja: wycena indywidualna) |
| Akcesoria | z `konfigurator-data.js` (drążki, szuflady, kosze, nóżki, zawiasy, uchwyty, profile) |
| **Cena końcowa** | `subtotal / 1.23` (dawne netto), **sama kwota w zł** |
| Minimum | **250 zł** |

Podsumowanie w kroku 5: 3 grupy — **Materiał / Projekt / Akcesoria** (bez nawiasów w etykietach).

### Drzwi przesuwne (cena za skrzydło; skrzydeł = liczba sekcji, min 2, max 4)
| System | Cena |
|---|---|
| NOVO 10/4 | 250 |
| CARO 18/4 | 280 |
| LOCA | 290 |
| ERGO | 310 |
| NERO 18/4 | 320 |
| **Bezramowy** | **150** (v229) |
| **System Overline** | **360** (v229, nowy; drzwi nakładane, tylko płyta) |
| Ramowy dzielony (2–3 pasy) | 400 |
Wypełnienie: płyta w cenie, szkło +180 zł/m², lustro +200 zł/m². Kolor profilu (aluminium/czarny/biały) bez dopłaty.
⚠️ Ceny systemów (poza bezramowym i Overline) **orientacyjne — nigdy niepotwierdzone**.

### Uchwyty (`HANDLES`)
Tip-on GTV (+29 zł/front, blokuje cichy domyk) · Gałka GTV SPOT (w cenie; kolory dopłata) · Gałka ATM GM-315 (+7) · HEXA 160 (+10) · BAGIO 128 (+15) · BAGIO 192 (+20). Kolory w `HANDLE_COLORS`.

### Zawiasy
Standardowe GTV — 0 zł · Cichy domyk GTV — 5 zł/szt.

---

## 7. Konfigurator — kroki

1. **Typ:** szafa / garderoba (domyślnie bez frontów) / regał (3 sekcje, półki 350 mm, bez frontów) / łazienka. Callout o projektach nietypowych.
2. **Wymiary wnęki:** w/h/d, info o głębokości z frontem, rozwijana instrukcja pomiaru + schemat, krzywe ściany, **blendy**, **skos**, **uskok**, **szkic wnęki** (siatka, PNG do maila).
3. **Układ:** osadzenie (cokół/podłoga/nóżki/wiszący), sekcje (różne szerokości, „Wyrównaj"), elementy, przelotowa półka, lift, „Wyrównaj półki", ostrzeżenia, LED.
4. **Materiały:** 127 dekorów (cena ukryta), osobny dekor frontów, MDF lakier (mat/półmat/połysk, RAL, 5 profili), fronty uchylne (zawiasy, uchwyty + kolor, fronty na część sekcji) LUB drzwi przesuwne (system, kolor, wypełnienie, podział).
5. **Kontakt:** podsumowanie, kosztorys, dane, uwagi, załączniki (do 5 plików / 10 MB), prośba o zdjęcie wnęki, zgody RODO + regulamin → wysyłka → ekran potwierdzenia (48 h) + „Pobierz potwierdzenie (PDF)".

Inne: **Link do projektu** (`#p=` w adresie, deflate+base64url, bez danych osobowych, przycisk w pasku + link w mailu), baner cookies, zapis w localStorage.

**Ostrzeżenia** (`validateProject()`): drążek >1300 mm (błąd, nie pantograf), półka >700 mm (ostrzeżenie), szuflada poza 300–900 mm (błąd), front >600 mm (ostrzeżenie), strefa wieszania <800 mm (ostrzeżenie).

---

## 8. Mail (`submitOrder()` → `/api/send`)

Pola FormData: `ref` (ZT-2026-xxxxx), `subject`, `html` (`buildSpecHTML`), `payload` (JSON `buildOrderSpec` + `project_link`), `name`, `email`, `phone`, `files` (wiele).
Treść: klient, link „Otwórz projekt", mebel, wnęka, skos/uskok/blendy/przelotowa półka, sekcje, lista formatek (cięcia mb, obrzeże mb), arkusze na dekor + % wykorzystania, akcesoria z cenami (`buildAccessoryList`), kosztorys, uwagi z walidacji.
Załączniki: rendery 2D front/wnętrze (`renderViewToPNG`), rendery 3D (izometryk z frontami, izometryk wnętrza), szkic wnęki, pliki klienta, `{ref}.json`, **instrukcja montażu** `{ref}-instrukcja-montazu.html`.

---

## 9. Widok 3D (`konfigurator-3d.js`, API `window.ZT3D`)

`show(), hide(), update(), toPNG(), isReady(), setIso(v), isIso(), debug()`. Bez frontów → perspektywa ze swobodnym obrotem; „Pokaż fronty" → izometryk, obrót zablokowany (`window.__v3dShowFronts`). Buduje z `snapshot()` (czyta STATE przez gołe nazwy). Kolory z `mat.color` → **obecnie szary fallback** (patrz 12).

## 10. Dokumenty (`konfigurator-docs.js`, `window.ZTDocs`)

`buildConfirmationHTML(ref, imgs)`, `buildInstructionHTML(ref, imgs)`, `printDoc(html)`. Instrukcja: ~10 kroków zależnych od projektu + tabela formatek z kodami (A1…). PDF przez okno drukowania.

---

## 11. Znane problemy / ryzyka / niesprawdzone

1. ⚠️ **Limit Vercel ~4,5 MB** na zapytanie — rendery + pliki klienta (do 10 MB) mogą go przekroczyć → wysyłka padnie. Przetestować z dużymi zdjęciami.
2. ⚠️ **busboy `files: 6`** w projektowym `send.js` — za mało plików (pkt 2).
3. ⚠️ Czy Brevo przyjmuje załączniki `.json` i `.html`.
4. 🟡 Pełna ścieżka wysyłki nietestowana od v218.
5. 🟡 Wydruk PDF (potwierdzenie, instrukcja) — treść sprawdzona, wydruk nie.
6. 🟡 3D na telefonach niesprawdzone.
7. 🟡 Fronty na część sekcji tylko przy uchylnych.
8. 🟡 Legacy typ `szuflady` (80 zł × szt.) może istnieć w starych zapisach.
9. 🟡 Ceny drzwi przesuwnych niepotwierdzone.
10. 🟡 Brevo DKIM / weryfikacja domeny — nadawca Gmail.
11. 🟡 `instrukcja-pomiaru.html` niepodlinkowana, nie w paczce.
12. 🟡 Zdjęcia nowych realizacji (miałeś dodać 3–4).

---

## 12. NASTĘPNE ZADANIE — przebudowa systemu rysowania

### Diagnoza (sprawdzona w kodzie)
1. **Brak koloru:** `MATERIALS` mają tylko `image` (np. `assets/decors/biel-alpejska-8685.jpg`), **bez pola `color`**. `renderPreview()` robi `const fill = matC.color || '#cdc6b4'` → wszystko szare. To samo w 3D (`hexOf(mat)`).
2. **Uchwyty niewidoczne:** `drawFront()` (app.js ~l.2778) rysuje uchwyty tylko dla `STATE.handle==='relingowe'` — taki typ nie istnieje → zmiana uchwytu nic nie zmienia.
3. **Płasko:** prostokąty z obwódką, brak szczelin, obrzeży, cieni.
4. **Drzwi przesuwne:** blok w `renderPreview()` (~l.2661, „sliding doors — front view only") — prosta ramka `rimW`, uchwyty CARO/NERO/ERGO/LOCA szkicowo.

### Miejsca w kodzie
- `renderPreview()` ~l.2411–2777 (korpus, sekcje, przelotowa półka, uskok, cokół/nóżki, drzwi przesuwne, blendy, `<defs>` z `mirrorG`/`glassG`)
- `drawFront()` ~l.2778, `drawInteriorContent()` ~l.2836, `drawBasket()` ~l.2975, `drawLegShape()` ~l.2941, `dimLabel()` ~l.3152
- `renderViewToPNG()` ~l.3732 — serializuje SVG do obrazka → **zewnętrzne URL-e obrazków w SVG się nie wyrenderują** — tekstury trzeba osadzać jako **data URL**.

### Plan (do potwierdzenia z Tobą)
- Nowy plik **`konfigurator-render.js`** (ładowany przed app.js); app.js tylko wywołuje.
- **Tekstury:** zdjęcie dekoru jako SVG `<pattern>` (data URL z cache, w skali mm, słoje pionowo na frontach); średni kolor z obrazka (canvas) jako fallback i dla 3D; MDF w kolorze RAL z połyskiem; lustro/szkło z odbiciem.
- **Fronty uchylne:** szczeliny 3 mm, obrzeże ABS, cień, fronty szuflad osobno, strona zawiasów, **uchwyty w realnych wymiarach i kolorze** (SPOT/GM-315 gałka, HEXA profil krawędziowy, BAGIO 128/192 listwa, Tip-on brak).
- **Drzwi przesuwne:** geometria profilu per system, kolor profilu, nachodzenie skrzydeł, tory.
- **Korpus/wnętrze:** grubość płyt, ciemniejsze plecy, cokół z cieniem, cień na podłodze.
- **3D:** `THREE.TextureLoader` z tym samym zdjęciem dekoru.
- **Do decyzji Twojej:** styl (realistyczny vs „architektoniczny") i czy 3D od razu, czy najpierw 2D.

---

## 13. Historia wersji (skrót)

v154–v169: upload plików + pełna specyfikacja w mailu, GA4, przelotowa półka, półka z przegródką, plecy, LED 100 zł, 3 grupy kosztorysu
v170–v185: wyrównanie półek, cięcia/obrzeże w mailu, blendy, nowe stawki, skosy, uskok, lift, pralka, siedzisko, szkicownik
v186–v204: 3D three.js, iso z frontami, blendy przy skosie, skos zakotwiczony we wnęce
v205–v212: każda sekcja = osobna szafka, oklejanie 3 stron, podwójne płyty w 2D/3D, lista akcesoriów w mailu
v213–v217: różne szerokości sekcji, wymiar wnęki na rzutach, 1 mm luzu, blendy bez minimum, limity formatek, dół+nadstawka
v218: fronty MDF · v219–v221: rozkrój, walidacja, link do projektu, instrukcja montażu, potwierdzenie PDF
v222–v223: cokół do 2780, styk na półce, drążek = strefa wieszania + półki
v224–v225: fronty na część sekcji · v226–v227: bez VAT · v228: robocizna wyłączona · v229: bezramowy 150, Overline 360

---

## 14. Do wgrania na GitHub (różnica v227 → v229)
- `konfigurator-data.js`, `konfigurator-app.js`, `konfigurator.html`
- opcjonalnie: `instrukcja-pomiaru.html` + `doc-page.js` (gdy podlinkujemy)
