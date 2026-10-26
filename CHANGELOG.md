# Changelog

Neueste Version oben. Die Version entspricht `VERSION` in `sw.js`.

## 2026-10-26-1 · Vollbild in der iPhone-Web-App
- iOS 26 meldet Apps vom Home-Bildschirm teils eine zu kleine Höhe (2–3 cm Lücke unten) und keinen Abstand für die Statusleiste (Inhalt rutscht unter die unscharfe Statusleiste). Neu `fitScreen()`: misst Bildschirm und sichtbare Fläche und gleicht nur in diesem Fall aus (`--app-h`, `--app-top`, `--app-bot`). Im Browser, auf Android und am Computer ändert sich nichts.
- Einstellungen → „Über die App“: Version und Anzeige-Werte (Modus, iOS-Version, Bildschirm, sichtbare Fläche, Abstände, Ausgleich) zur Fehlersuche.

## 2026-10-24-1 · Handy-Ansicht füllt den Bildschirm
- Doppelt gerechneten Abstand für Statusleiste und Home-Balken entfernt (Überbleibsel am Anfang des CSS).
- Handy-App liegt fest über dem ganzen Bildschirm (`position:fixed; inset:0`).
- Ringe auf „Heute“ und Tab-Leiste auf größeren Handys etwas größer. Webansicht unverändert.

## 2026-10-24 · Wachhalter für Supabase
- GitHub Action `.github/workflows/keepalive.yml` ruft alle 3 Tage die Datenbank-Funktion `keepalive()` auf, damit Supabase das kostenlose Projekt nicht pausiert. URL und Key liest sie aus `config.js`.
- `supabase/keepalive.sql` (neu) legt die Funktion an; dieselbe Funktion steht jetzt auch am Ende von `supabase/schema.sql`.
- Keine Änderung an der App, `VERSION` bleibt `2026-10-23-1`.

## 2026-10-24 · Dokumentation
- `ENTWICKLUNG.md`, `CHANGELOG.md` und `README.md` ergänzt (keine Änderung an der App, `VERSION` bleibt `2026-10-23-1`).

## 2026-10-23-1 · Erste eigenständige Version
- App aus der Claude-Version übernommen und eigenständig gemacht: GitHub Pages + Supabase (Frankfurt).
- Anmeldung mit E-Mail und Passwort, Daten lokal zuerst, Abgleich zwischen Geräten.
- Offline-Betrieb über Service Worker; Schriften und Bibliotheken liegen im Paket.
- Formcheck ohne KI mit festen Zielen, Rückmeldung nach jeder Einheit, Marathon-Prognose aus Wettkämpfen.
- Handy: Tab „Analyse“; Web: Einstellungen-Knopf neben dem Excel-Export.
- Einstellungen: Konto & Abgleich, Daten sichern & importieren, Puls-Obergrenze lockere Läufe.
- 220 Einheiten aus der Claude-Version per Import übernommen.

## Vorgeschichte (Claude-Version, 20.–23.10.2026)
- Wochen-, Monats- und Halbjahresansicht, eigene Handy-App-Ansicht, Pace-Zonen aus der Zielzeit, Ein-Tipp-Haken, Bouldern als Art, drei Layouts, Farben je Trainingsart, Excel-Export, automatische Doppelpunkte und Komma-Eingabe.
