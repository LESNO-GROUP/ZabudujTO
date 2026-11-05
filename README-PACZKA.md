# Paczka v230 — naprawa wysyłki zapytań

## Pliki do nadpisania na GitHub
- konfigurator.html      (?v=230)
- konfigurator-app.js
- api/send.js            (do folderu api/)
  Jeśli używasz WŁASNEJ wersji send.js — zmień w niej tylko:
    name: `${ref}.json`   ->   name: `${ref}-specyfikacja.txt`
    files: 6             ->   files: 20

## Co naprawione
- Rendery jako JPEG zamiast PNG (kilka razy mniejsze)
- Instrukcja montażu bez osadzonych obrazów (wcześniej duplikowała kilka MB)
- Kontrola rozmiaru przed wysyłką (limit Vercel ~4,5 MB); w razie potrzeby odrzuca zbędne rendery
- Załączniki klienta: maks. 3 MB łącznie (było 10 MB)
- Specyfikacja JSON wysyłana jako .txt (Brevo nie przyjmuje .json)
- Komunikat błędu pokazuje przyczynę (rozmiar / kod błędu serwera)
