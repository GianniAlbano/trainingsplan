# Changelog

Neueste Version oben. Die Version entspricht `VERSION` in `sw.js`.

## 2026-10-24-1 · Handy-Ansicht füllt den Bildschirm
- Tab-Leiste sitzt jetzt ganz unten: Der Abstand für Statusleiste und Home-Balken wurde doppelt gerechnet (Überbleibsel aus der Claude-Version am Anfang des CSS). Er wird jetzt genau einmal freigehalten.
- Die Handy-App liegt fest über dem ganzen Bildschirm (`position:fixed; inset:0`) und passt sich so jeder Bildschirmhöhe an.
- Etwas größere Bedienelemente auf größeren Handys: Ringe auf „Heute“ wachsen mit der Bildschirmgröße (bis 150 px), Tab-Symbole und -Beschriftung leicht größer.
- Webansicht unverändert.

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
