# Trainingsplan-App – Entwicklerhandbuch

Stand: 27.10.2026 · App-Version `2026-10-27-2`

Diese Datei ist der Einstieg für jeden Chat, der am Code arbeitet. Sie liegt im Repository; das Claude-Projekt „Marathon incoming“ verweist nur noch hierher.

## Wo was liegt

| Was | Wo |
|---|---|
| App (live) | https://giannialbano.github.io/trainingsplan/ |
| Code (offizieller Stand) | GitHub-Repository `GianniAlbano/trainingsplan`, Branch `main`, GitHub Pages aus `/ (root)` |
| Datenbank und Anmeldung | Supabase-Projekt `zrrrhbvhmwkfdduucnoh` (Region Frankfurt) |
| Trainingsplan (Inhalt) | Projekt-Dokument „Marathon-Trainingsplan Berlin 2027“ |
| Alte Claude-Version (Archiv) | https://claude.ai/artifact/R6pHAXAfQam3NCy1ihKBWb – wird nicht mehr weiterentwickelt |

Trainingsdaten liegen nur in Supabase und auf den Geräten, nie im Repository und nie im Projekt.

## Arbeitsweise (Pull Requests)

Claude ist über die GitHub-App nur mit diesem Repository verbunden. `main` ist durch eine Regel geschützt: Änderungen kommen nur über einen Pull Request hinein, und den gibt Gianni frei.

1. **Start:** Claude holt den aktuellen Stand von `main` und liest dieses Handbuch und den CHANGELOG. Das Repository ist die einzige Quelle – es gibt keine Code-Kopien im Claude-Projekt mehr.
2. **Änderung:** auf einem neuen Zweig `claude/<kurzer-name>`. Nur ändern, was gewünscht ist; im Browser testen (Handy- und Webansicht, ohne Skriptfehler).
3. **Bei jeder App-Änderung** `VERSION` in `sw.js` erhöhen (Format `JJJJ-MM-TT-n`) und den CHANGELOG ergänzen; dieses Handbuch anpassen, wenn sich Aufbau oder Regeln ändern.
4. **Pull Request** mit kurzer Beschreibung auf Deutsch: was, warum, wie getestet. Claude schickt Gianni den Link.
5. **Freigabe:** Gianni prüft unter *Files changed* und klickt *Merge pull request* → *Confirm merge* (danach *Delete branch*). Nach 1–2 Minuten ist die Version live, auf dem Handy aktiv beim übernächsten Öffnen der App.

Ändert Gianni selbst etwas direkt in GitHub, ist das in Ordnung – Claude startet ohnehin immer vom aktuellen `main`.

Nie ins Repository: `Trainingsplan-Daten.json` oder andere Sicherungen, Supabase-*Secret keys* (`sb_secret_…`, `service_role`). Der *Publishable key* in `config.js` ist öffentlich und darf dort stehen.

## Dateien im Repository

| Datei | Inhalt | Ändert sich |
|---|---|---|
| `index.html` | die ganze App: CSS, HTML, JavaScript in einer Datei | fast immer |
| `sw.js` | Service Worker (Offline-Speicher), Konstante `VERSION` | bei jeder Änderung |
| `config.js` | Supabase-URL und Publishable key | nie (enthält Giannis Werte) |
| `manifest.webmanifest` | Name, Farben, Symbole für die Installation | selten |
| `supabase/schema.sql` | Tabelle `docs` mit Zugriffsregeln, Funktion `keepalive()` | selten; neue Version im SQL Editor ausführen |
| `supabase/keepalive.sql` | nur die Funktion `keepalive()` (für bestehende Projekte) | nie |
| `.github/workflows/keepalive.yml` | GitHub Action „Supabase wach halten“, alle 3 Tage | selten |
| `icons/`, `fonts/`, `vendor/` | Symbole, Lato-Schrift, supabase-js 2.117.3, SheetJS 0.18.5 | praktisch nie |
| `ANLEITUNG.md`, `ENTWICKLUNG.md`, `CHANGELOG.md`, `README.md`, `CLAUDE.md` | Dokumentation | bei Bedarf |

Neue Dateien, die offline verfügbar sein sollen, müssen in die Liste `FILES` in `sw.js`.

## Aufbau von index.html

Die Datei ist in Abschnitte mit Kommentar-Überschriften gegliedert (`/* ---------- … ---------- */`).

**CSS**
- Design-Tokens in `:root` (Layout „Dunkel“, Standard), dazu `:root[data-look="light"]` (Hell) und `:root[data-look="sunrise"]` (Morgenlauf). Farben der Trainingsarten als `--t-<typ>`; eigene Farben setzt `applyColors()` als Inline-Variablen.
- Web- und Handyansicht sind getrennt: Unter **640 px** wird `.wrap` ausgeblendet und `.app` (Handy-App) gezeigt. Änderungen am Handy dürfen die Webansicht nicht verändern und umgekehrt.
- Die Handy-App liegt über dem ganzen Bildschirm und hält Statusleiste und Home-Balken selbst frei; Größen auf „Heute“ richten sich mit `min(…, dvh)` nach der Bildschirmhöhe. Details unter *Gestaltungsregeln*.

**JavaScript** (alles in einer IIFE)
- Konstanten: `TYPES` (Trainingsarten), `NONRUN` (Arten ohne Strecke: Kraft, Bouldern, Ruhetag), `FEELS`, `ZONES` (Pace-Zonen relativ zum Marathontempo), Hilfsfunktionen für Datum, Zeit, Pace.
- **Speicher** (`store`, `put`, `syncNow`, `init`): lokal zuerst in `localStorage` (`tp.v2.<user-id>`, ohne Konto `tp.v2.local`) mit `docs`, `outbox` (wartende Änderungen) und `lastSync`. Abgleich mit Supabase: erst `outbox` hochladen (upsert), dann Änderungen seit `lastSync` holen. Anmeldung, Registrierung, Passwort zurücksetzen in derselben Sektion.
- **Rendering Web:** `render()`, `renderHero`, `renderWeek`, `renderMonth`, `renderHalf` (oben Formzeit, Einzelfaktoren, Bereitschaft, Prognose, Fitness, Formcheck).
- **Handy-App:** `renderMobile()` mit `mToday` (Ringe, Formcheck, „Weg zum Rennen“ über `pathWeeks`/`pathHtml`), `mWeek`, `mMonth`, `mHalf` (Tab „Analyse“: Formzeit, Woher sie kommt, Bereitschaft, Prognose, Fitness, Formcheck, dann Wochen-km, Monate, Arten); Zustand in `M`.
- **Ausfall & Plan anpassen** (Dialog `#toolDlg`): `openPause`/`pausePlan` (Ausfall mit Wiedereinstieg), `openPlanTool`/`planChanges` (Sammeländerungen), gemeinsam `applyBulk`/`undoBulk`.
- **Dialoge:** Einheit (`openSession`, Formular `#form`), Wettkampf & Ziele (`openRace`), Einstellungen (`renderMore`, Ansichten `main`, `design`, `colors`, `data`, `account`), Schnellbewertung nach dem Haken (`renderQuick`).
- **Formcheck** (`formcheck()`, `formcheckHtml()`, `sessionFeedback()`, `showFeedback()`): regelbasiert, ohne KI, Grenzwerte in `GOALS`.
- **Weiteres:** Excel-Export (`exportExcel`, SheetJS lokal), Sicherung/Import als JSON (`exportJson`, Import über `#importFile`), Ziehen von Einheiten (Maus und Gedrückthalten am Handy), Wischen zum Schließen von Blättern (`sheetSwipe`), Eingabemasken für Zeiten (`data-mask`) und Kommazahlen (`data-dec`), Registrierung des Service Workers.

## Supabase wach halten

Kostenlose Supabase-Projekte werden nach etwa 7 Tagen ohne Nutzung pausiert (Daten bleiben erhalten, *Resume project* im Dashboard). Dagegen ruft die GitHub Action `.github/workflows/keepalive.yml` alle 3 Tage um 06:17 UTC `POST /rest/v1/rpc/keepalive` mit dem Publishable key aus `config.js` auf. Die Funktion gibt nur `ok` zurück und liest keine Daten; der Rolle `anon` bleibt die Tabelle `docs` verschlossen.

- Kontrolle: Repository → **Actions** → „Supabase wach halten“ (grüner Haken = ok). Von Hand starten mit **Run workflow**.
- GitHub schaltet geplante Abläufe in öffentlichen Repositorys nach 60 Tagen ohne Commit ab und schickt eine Mail. Dann unter **Actions** wieder einschalten (*Enable workflow*).

## Datenmodell

Supabase-Tabelle `public.docs`, eine Zeile pro Dokument:

| Spalte | Bedeutung |
|---|---|
| `user_id` | Besitzer (RLS: jede Person sieht und ändert nur eigene Zeilen) |
| `collection` | `sessions`, `settings` oder `templates` |
| `id` | Dokument-ID |
| `data` | Inhalt als JSON |
| `deleted` | `true` = gelöscht (damit andere Geräte es mitbekommen) |
| `updated_at` | per Trigger bei jeder Änderung gesetzt, Grundlage des Abgleichs |

**`sessions/<id>`** (eine Einheit): `date` (JJJJ-MM-TT), `type`, `title`, `planKm`, `planMin`, `planZone`, `planPace` (Sekunden pro km), `planReps`, `planRepDist` (m), `desc`, `example`, `created`, `actual` (`null` oder `{km, sec, hr, rpe, feel, notes, half, loggedAt}`; `half` = Halbzeit in Sekunden, nur bei Wettkämpfen), `skipped` (`null` oder `{reason: sick|injury|other, from, to, at}` – ausgefallen, zählt nicht als geplant), `adj` (`null` oder `{reason, orig}` – nach Ausfall angepasst, `orig` = ursprüngliche Planfelder).

**`settings/main`:** `raceName`, `raceDate`, `goal` (h:mm:ss), `easyHrMax` (Puls-Obergrenze lockere Läufe), `look` (`dark` | `light` | `sunrise`), `colors` (eigene Farben je Art).

## Formcheck: feste Ziele (`GOALS`)

| Ziel | Grün, wenn … |
|---|---|
| Plan erfüllt | ≥ 90 % der geplanten km der letzten Woche (70–90 % gelb) |
| Umfang im Rahmen | höchstens 15 % über Plan |
| Locker bleibt locker | max. 15 s/km schneller als Plan-Pace, Puls ≤ `easyHrMax`, RPE ≤ 5 |
| Tempo-Einheiten | erledigt, RPE < 9 |
| Langer Lauf | ≥ 90 % der längsten geplanten Distanz der letzten 4 Wochen |
| Kraft & Stabi | ≥ 75 % der Einheiten in 14 Tagen |
| Erholung | höchstens 1 von 5 Einheiten „Schwer“ oder „Zäh“ |

Gesamturteil: „Auf Kurs“, „Achtung“ (1 rot oder ≥ 2 gelb), „Gegensteuern“ (≥ 2 rot), „Noch zu wenig Daten“ (< 3 Läufe). Die Prognose kommt aus der Analyse (`analysis().fc`).

## Analyse: Vergleich mit Referenzdaten (`REF`)

Abschnitt „Analyse“ im JavaScript, nach dem Formcheck. Herleitung und Quellen: Projekt-Dokument „Analyse – Referenzdaten“. Neue Studienwerte nur in `REF` ändern. Ausgefallene Einheiten (`skipped`) zählen nirgends mit.

| Funktion | Aufgabe |
|---|---|
| `trainMetrics(from, to, src)` | Ø km/Woche, Anteil locker, Qualitätseinheiten/Woche (Intervalle + Tempo), Lauftage/Woche, längster Lauf, Ø Laufdistanz, Spitzenwoche; `src` = `actual` oder `plan`. Wettkämpfe zählen nicht mit. |
| `equivalent(m)` | Interpoliert jede Kennzahl zwischen den Bändern in `REF.bands` zu einer Marathonzeit (`bandTime`), gewichtet nach `REF.weights`, ± `REF.spread` min. `bandValue` ist die Umkehrung: typischer Wert für eine Zielzeit. |
| `raceToMarathon(sec, km, kmWeek)` | Riegel (k 1,06) auf den Halbmarathon, × 2,19, plus `REF.volAdj`; ab 40 km direkt. |
| `analysis(ref)` | Stichtag `ref` (Standard heute), Ergebnis je Datenstand zwischengespeichert. Fenster: 12 abgeschlossene Wochen vor `ref` (frühestens ab erstem Lauf) bzw. 12 Wochen vor der Rennwoche. Prognose `fc`: 70 % Wettkampf + 30 % Training, ± 15 min; nur Training ± 20 min. Ab 3 Wochen und 6 Läufen. |
| `formzeitSeries()` | Formzeit je Woche ab Planstart: gelaufen (`analysis(ref).fc.mid`) bis heute, Plan (gleiche Rechnung mit Planwerten) bis zur Rennwoche. |
| `anaFormzeitHtml`, `formzeitChart` | Übersicht: Formzeit, Änderung zu vor 4 Wochen, Wert laut Plan, Verlauf mit Zielband, Sprung-Warnungen der nächsten 14 Tage, Plantreue / Bereit / Puls-Fitness. |
| `anaFactorsHtml` | Einzelfaktoren als Balken (dein Wert) mit Strich (typisch für die Zielzeit), Planwert, größter Hebel (Gewicht × Abstand zur Zielzeit). |
| `readinessRows`, `anaReadyHtml` | Bereitschaft: Segmentleiste und Liste; bis 8 Wochen vor dem Rennen „Noch Zeit“ statt rot. |
| `spikeOf(s)` | Lauf im Vergleich zum längsten Lauf der 30 Tage davor (vergangene Tage: gelaufen, ab heute: geplant). > 10 % gelb, > 30 % rot. |
| `fitnessTrend()` | Meter pro Herzschlag bei lockeren Läufen ≥ 3 km mit Puls, 16 Wochen; letzte 4 Wochen gegen die 4 davor. |
| `splitOf(s)` | Zweite gegen erste Hälfte aus `actual.half`; ≤ 3 % grün, ≤ 10,7 % gelb. |

## Gestaltungsregeln

- Minimalistisch nach Giannis Vorlage: dunkler Schiefergrund, dünne Lato-Schrift, Großbuchstaben-Labels mit Laufweite, farbige Haarlinien statt Kästen und Schatten.
- Handy: kein Scrollen der ganzen Seite; Inhalte passen auf den Bildschirm (sonst kompakter machen oder Nebensachen ausblenden). Fenster als Blätter von unten, nach unten wegwischbar.
- Installierte App: `html.standalone` (gesetzt im `<head>`) hält oben mindestens `--top-gap` + 12 px frei, auch wenn iOS keinen Abstand meldet.
- Handy-Rahmen: `.app` liegt mit `position:fixed; inset:0` über dem ganzen Bildschirm. Die Statusleiste hält `.app` frei (`padding-top`), den Home-Balken nur die Tab-Leiste `.mtabs`. Diese Abstände nie zusätzlich auf `html`/`:root` legen, sonst werden sie doppelt gerechnet.
- Texte auf Deutsch, Du-Form, kurz und konkret. Zahlen mit deutschem Format (Komma).

## Offene Ideen

- Import von Garmin-Daten (Strava-Anbindung oder Datei-Upload .fit/.gpx).
- Plan-Generator.
- Vickers-Vertosick-Modell mit Originalkoeffizienten (Zusatzdatei der Studie), sobald verfügbar.
- Optional: Puls und Notizen im Browser verschlüsseln, bevor sie hochgeladen werden.
