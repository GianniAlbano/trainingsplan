# Changelog

Neueste Version oben. Die Version entspricht `VERSION` in `sw.js`.

## 2026-10-27-1 · Neue Heute-Seite, Ausfall, Plan anpassen
- Handy (installierte App): Unter der Statusleiste bleibt oben ein leerer Streifen (mind. 50 px + 12 px), damit keine Schrift unter der unscharfen Leiste liegt. Im Browser unverändert.
- „Heute“: Die Karten „Heute“ und „Als Nächstes“ entfallen. Neu ist „Weg zum <Rennen>“: Wochenkilometer vom Planstart bis zum Renntag (geplant nach Phase gefärbt, gelaufen in Akzentfarbe), Markierung „Heute“, Phasenband Grundlage/Marathonplan/Tapering, nächster Zwischenwettkampf und Bilanz (gelaufen gesamt, längster Lauf, Wochen in Folge im Plan).
- Ausfall eintragen (Einheit → „Fällt aus …“, Einstellungen oder Hinweis „Einheiten offen“ → „Ausfall“): Einheiten im Zeitraum werden als ausgefallen markiert (`skipped`), zählen nicht als verpasst und nicht in Plan-km/Formcheck. Optional sanfter Wiedereinstieg: so viele Tage wie der Ausfall (3–14) nur locker, Intervalle/Tempo werden lockere Läufe, Umfang 70 % dann 85 %. Original bleibt in `adj.orig` und lässt sich je Einheit wiederherstellen.
- Plan anpassen (Einstellungen bzw. Knopf unter der Wochenansicht): für einen Zeitraum Einheiten hinzufügen (jede Woche an einem Wochentag), entfernen, Art ändern, Umfang ändern oder auf einen anderen Wochentag verschieben. Vorschau vor dem Anwenden, letzte Sammeländerung rückgängig machbar. Erledigte und ausgefallene Einheiten bleiben unverändert.

## 2026-10-26-3 · Handy-Anzeige zurück auf Stand 2026-10-24-1
- `index.html` auf den Stand vor Pull Request #4 zurückgesetzt: Auf dem iPhone war unten Text abgeschnitten und oben lag der Inhalt unter der unscharfen Statusleiste. Der Ausgleich `fitScreen()` und die Anzeige „Über die App“ entfallen damit wieder.
- Neue Versionsnummer, damit die installierte App die alte Anzeige sicher neu lädt.

## 2026-10-26-2 · iPhone: unten nichts mehr abgeschnitten
- Die App wird nicht mehr auf die volle Bildschirmhöhe gezogen, wenn iOS eine kleinere Höhe meldet; dadurch lag die Tab-Leiste teils unter dem Bildschirmrand. Die untere Grenze ist wieder die, die iOS meldet.
- Fehlt der Abstand zur Statusleiste, rückt nur die oberste Zeile darunter (unabhängig von der Höhe).

## 2026-10-26-1 · Vollbild in der iPhone-Web-App
- iOS 26 meldet Apps vom Home-Bildschirm teils eine zu kleine Höhe (2–3 cm Lücke unten) und keinen Abstand für die Statusleiste (Inhalt rutscht unter die unscharfe Statusleiste). Neu `fitScreen()`: misst Bildschirm und sichtbare Fläche und gleicht nur in diesem Fall aus (`--app-h`, `--app-top`, `--app-bot`). Im Browser, auf Android und am Computer ändert sich nichts.
- Einstellungen → „Über die App“: Version und Anzeige-Werte (Modus, iOS-Version, Bildschirm, sichtbare Fläche, Abstände, Ausgleich) zur Fehlersuche.

## 2026-10-26 · Arbeitsweise über Pull Requests
- Claude arbeitet jetzt direkt im Repository und schlägt Änderungen als Pull Request vor; `main` ist geschützt, Gianni gibt jede Änderung mit *Merge* frei.
- `CLAUDE.md` (neu) verweist auf `ENTWICKLUNG.md`; das Handbuch beschreibt die neue Arbeitsweise. Die Code-Kopien im Claude-Projekt entfallen, das Repository ist die einzige Quelle.
- Keine Änderung an der App.

## 2026-10-24-1 · Handy-Ansicht füllt den Bildschirm
- Doppelt gerechneten Abstand für Statusleiste und Home-Balken entfernt (Überbleibsel am Anfang des CSS).
- Handy-App liegt fest über dem ganzen Bildschirm (`position:fixed; inset:0`), Statusleiste oben und Home-Balken unten werden genau einmal freigehalten.
- Tab-Leiste etwas größer (Symbole 24 px, Schrift 10 px), Ringe auf „Heute“ passen sich der Bildschirmhöhe an. Webansicht unverändert.

## 2026-10-24 · Wachhalter für Supabase
- GitHub Action `.github/workflows/keepalive.yml` ruft alle 3 Tage die Datenbank-Funktion `keepalive()` auf, damit Supabase das kostenlose Projekt nicht pausiert. URL und Key liest sie aus `config.js`.
- `supabase/keepalive.sql` (neu) legt die Funktion an; dieselbe Funktion steht jetzt auch am Ende von `supabase/schema.sql`.
- Korrektur 26.10.: Der Ablauf liest URL und Key nur noch aus den Zeilen `supabaseUrl:`/`supabaseKey:` (vorher griff er die Beispieladresse im Kommentar); `actions/checkout@v5`.
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
