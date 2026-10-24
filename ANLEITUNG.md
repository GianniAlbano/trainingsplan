# Trainingsplan als eigene App: Anleitung GitHub + Supabase

Stand: 23.10.2026. Du brauchst etwa 30 Minuten und einen Computer. Am Handy ist das Hochladen der Dateien unpraktisch, alles andere geht auch dort.

## Was am Ende steht

- Deine App liegt unter einer eigenen Adresse, z. B. `https://deinname.github.io/trainingsplan/`.
- Auf dem iPhone liegt sie mit dem 42.2-Symbol auf dem Home-Bildschirm. Sie öffnet sich im Vollbild, ohne Claude und ohne Browserleiste.
- Deine Daten liegen auf dem Gerät und verschlüsselt in einer eigenen Datenbank in Frankfurt. Nur du kommst nach der Anmeldung daran.
- Kosten: 0 €.

**Rollenverteilung:**
- **GitHub** stellt nur die App-Dateien ins Netz. Dort liegen nie Trainingsdaten.
- **Supabase** ist die Datenbank mit deinem Konto und deinen Einheiten.

## Was im Paket steckt

| Datei / Ordner | Wofür |
|---|---|
| `index.html` | die App selbst |
| `config.js` | hier trägst du deine Supabase-Zugangsdaten ein (Schritt 3) |
| `sw.js`, `manifest.webmanifest` | Offline-Betrieb und Installation auf dem Home-Bildschirm |
| `icons/`, `fonts/`, `vendor/` | Symbol, Schrift und Bibliotheken, damit alles offline funktioniert |
| `supabase/schema.sql` | richtet die Datenbank samt Zugriffsregeln ein (Schritt 2) |
| `ANLEITUNG.md` | diese Anleitung |

Getrennt davon bekommst du **`Trainingsplan-Daten.json`** mit deinem bisherigen Plan: 220 Einheiten, Zielzeit und Farben. **Diese Datei gehört nicht zu GitHub**, sie wird in Schritt 6 nur in die App eingespielt.

---

## Schritt 1: Supabase-Projekt anlegen (ca. 5 Min.)

1. Gehe auf **supabase.com** → *Start your project* und registriere dich, z. B. mit deiner E-Mail-Adresse.
2. Klicke auf **New project** und fülle aus:
   - *Name:* `trainingsplan`
   - *Database Password:* Lass dir ein starkes Passwort erzeugen und speichere es in deinem Passwort-Manager. Die App braucht es nicht, aber du brauchst es, falls du später direkt an die Datenbank willst.
   - *Region:* **Central EU (Frankfurt)**. Damit liegen deine Daten in Deutschland.
   - *Plan:* Free
3. **Create new project**. Die Einrichtung dauert 1–2 Minuten.

## Schritt 2: Datenbank einrichten (ca. 2 Min.)

1. Links im Menü auf **SQL Editor** → *New query*.
2. Öffne `supabase/schema.sql` aus dem Paket mit einem Texteditor, kopiere den gesamten Inhalt und füge ihn ein.
3. Klicke auf **Run**. Die Meldung *Success. No rows returned* ist richtig so.

Damit gibt es eine Tabelle für deine Daten mit festen Zugriffsregeln: Jede angemeldete Person sieht nur ihre eigenen Zeilen, Nicht-Angemeldete sehen gar nichts. Prüfen kannst du das unter **Table Editor → docs**: Dort steht der Hinweis, dass RLS (Row Level Security) aktiv ist.

## Schritt 3: Zugangsdaten in `config.js` eintragen (ca. 3 Min.)

1. In Supabase oben auf **Connect** klicken, oder unter **Project Settings → API Keys** nachsehen.
2. Kopiere zwei Werte:
   - die **Project URL**, sie sieht aus wie `https://abcdefghijk.supabase.co`
   - den **Publishable key**, er beginnt mit `sb_publishable_`
3. Öffne `config.js` mit einem Texteditor und trage beide Werte zwischen die Anführungszeichen ein:

```js
window.TP_CONFIG = {
  supabaseUrl: "https://abcdefghijk.supabase.co",
  supabaseKey: "sb_publishable_xxxxxxxxxxxxxxxx"
};
```

Der Publishable key darf öffentlich sein, er steckt in jeder Web-App dieser Art. Geschützt sind deine Daten durch die Zugriffsregeln aus Schritt 2 und durch dein Passwort.
**Niemals eintragen:** den *Secret key* (`sb_secret_…`) oder einen Schlüssel namens *service_role*. Die hebeln alle Regeln aus.

## Schritt 4: App auf GitHub veröffentlichen (ca. 10 Min.)

1. Lege auf **github.com** ein kostenloses Konto an. Dein Benutzername wird Teil der Adresse, also `deinname.github.io`.
2. Oben rechts **+ → New repository**:
   - *Repository name:* `trainingsplan`
   - *Public* auswählen. Der Code ist dann für alle lesbar, aber er enthält keine persönlichen Daten. Ein privates Repository kostet bei GitHub Pro etwa 4 $ im Monat; die Website selbst wäre trotzdem öffentlich erreichbar, geschützt sind deine Daten in beiden Fällen nur durch die Anmeldung.
   - **Create repository**
3. Auf der neuen Seite den Link **uploading an existing file** wählen.
4. Ziehe **den Inhalt** des Paket-Ordners in das Fenster, also `index.html`, `config.js` usw. und die Ordner `icons`, `fonts`, `vendor`, `supabase`. Ziehe nicht den Ordner selbst. Unten **Commit changes**.
   - Prüfe danach, dass `index.html` direkt auf der Startseite des Repositorys liegt, nicht in einem Unterordner.
5. **Settings → Pages** öffnen:
   - *Source:* **Deploy from a branch**
   - *Branch:* **main**, Ordner **/ (root)** → **Save**
6. Nach 1–2 Minuten steht oben auf der Pages-Seite *Your site is live at …*. Diese Adresse ist deine App.

## Schritt 5: Anmeldung absichern (ca. 3 Min.)

Zurück in Supabase:

1. **Authentication → URL Configuration**
   - *Site URL:* deine App-Adresse, z. B. `https://deinname.github.io/trainingsplan/`
   - Unter *Redirect URLs* dieselbe Adresse noch einmal hinzufügen.
   - Damit führen die Links in den Bestätigungs- und Passwort-Mails zurück in deine App.
2. Öffne deine App-Adresse am Computer und tippe auf **Noch kein Konto? Registrieren**. Gib E-Mail und ein Passwort mit mindestens 8 Zeichen ein.
3. Bestätige deine E-Mail über den Link in der Mail von Supabase. Danach meldest du dich in der App an.
4. **Wichtig:** Schalte danach neue Registrierungen ab, damit sich niemand Fremdes ein Konto anlegen kann. Das geht unter **Authentication → Sign In / Providers** (je nach Version *General configuration*): **Allow new users to sign up** ausschalten und speichern.
   - Soll später jemand mitnutzen, schaltest du es kurz wieder ein, die Person registriert sich, und du schaltest es wieder aus. Jede Person sieht nur ihre eigenen Daten.

## Schritt 6: Bisherigen Plan einspielen (ca. 2 Min.)

Am besten am Computer, angemeldet in der App:

1. **Einstellungen** öffnen: am Computer über den Knopf oben rechts neben *Excel-Export*, am Handy über das Zahnrad. Dann **Daten sichern & importieren** → **Sicherung einspielen**.
2. Wähle `Trainingsplan-Daten.json`. Am iPhone muss die Datei dafür vorher in der *Dateien*-App liegen.
3. Die Meldung lautet *220 Einheiten importiert*. Die Daten werden automatisch in deine Datenbank hochgeladen.

In der Datei ist außerdem deine Puls-Obergrenze für lockere Läufe (145) aus deinem Plan eingetragen. Ändern kannst du sie unter Zahnrad → *Wettkampf & Ziele*.

Trage ab jetzt nur noch in der neuen App ein. Die Claude-Version kannst du als Archiv behalten.

## Schritt 7: Auf dem iPhone installieren (1 Min.)

1. Öffne deine App-Adresse in **Safari**.
2. Tippe auf das Teilen-Symbol und dann auf **Zum Home-Bildschirm**. Name z. B. „Training“ → *Hinzufügen*.
3. Öffne die App über das neue 42.2-Symbol und melde dich **einmal** an. Die installierte App hat einen eigenen Speicher, getrennt von Safari.

Android: Adresse in Chrome öffnen → Drei-Punkte-Menü → **App installieren** bzw. *Zum Startbildschirm hinzufügen*.

---

## Gut zu wissen

**Offline:** Alles, was du täglich brauchst, funktioniert ohne Internet: Plan ansehen, planen, eintragen, Formcheck, Excel-Export. Änderungen werden auf dem Gerät gespeichert und gleichen sich ab, sobald du wieder online bist. Das Zahnrad zeigt dann einen kleinen Punkt. Nur das erste Anmelden und das Zurücksetzen des Passworts brauchen Internet.

**Mehrere Geräte:** Am Rechner und am Handy mit demselben Konto anmelden. Der Abgleich läuft automatisch beim Öffnen, beim Zurückkehren in die App und alle zwei Minuten.

**Pausen bei Supabase:** Kostenlose Projekte werden pausiert, wenn sie etwa 7 Tage lang nicht genutzt werden. Die Daten bleiben erhalten, und die App funktioniert auf dem Gerät weiter. Zum Wiederbeleben klickst du im Supabase-Dashboard auf **Resume project**. Solange du regelmäßig einträgst, passiert das nicht.

**Sicherung:** Zahnrad → *Daten sichern & importieren* → *Sicherung erstellen* speichert alles als Datei. Mach das ab und zu und leg die Datei z. B. in iCloud ab.

**Formcheck:** Unter *Analyse* bzw. in der Webansicht unter *Halbjahr*. Er bewertet nach festen Regeln, ohne KI, direkt auf dem Gerät:

| Ziel | Grün, wenn … |
|---|---|
| Plan erfüllt | mind. 90 % der geplanten Kilometer der letzten Woche |
| Umfang im Rahmen | höchstens 15 % über Plan |
| Locker bleibt locker | höchstens 15 s/km schneller als geplant, Puls unter deiner Grenze, Anstrengung höchstens 5/10 |
| Tempo-Einheiten | erledigt und Anstrengung unter 9/10 |
| Langer Lauf | mind. 90 % der längsten geplanten Distanz der letzten 4 Wochen |
| Kraft & Stabi | mind. 75 % der Einheiten in 14 Tagen |
| Erholung | höchstens 1 von 5 Einheiten fühlte sich schwer an |

Zusätzlich bekommst du nach jeder eingetragenen Einheit eine kurze Rückmeldung. Nach einem Wettkampf ab 5 km rechnet die App eine Marathon-Prognose hoch (Riegel-Formel).

## Die App später ändern

Der Code bleibt jederzeit änderbar:

- **Kleine Änderungen selbst:** In GitHub auf die Datei klicken, Stift-Symbol, ändern, *Commit changes*. Nach etwa einer Minute ist die neue Version online.
- **Mit Claude:** Gib Claude in einem Chat den Code (er liegt auch im Projekt „Marathon incoming“) oder verbinde GitHub mit Claude. Dann kann Claude Änderungen direkt in dein Repository schreiben.
- **Wichtig bei jeder Änderung:** In `sw.js` die Zeile `const VERSION = "…"` auf einen neuen Wert setzen, z. B. das heutige Datum. Nur dann laden die installierten Apps die neuen Dateien. Die neue Version ist beim übernächsten Öffnen aktiv.
- `config.js` und deine Daten bleiben bei Updates unverändert.

## Datenschutz kurz

- **Daten:** in deiner Supabase-Datenbank in Frankfurt (AES-256-verschlüsselt gespeichert) und auf deinen angemeldeten Geräten.
- **Zugriff:** nur mit deinem Konto. Supabase-Mitarbeitende nur im Supportfall, protokolliert.
- **GitHub:** kennt nur den App-Code, keine Trainingsdaten.
- **Keine Weitergabe:** Die App lädt keine Inhalte von fremden Servern (Schriften und Bibliotheken liegen im Paket). Es gibt kein Tracking und keine KI.

## Wenn etwas nicht klappt

| Problem | Lösung |
|---|---|
| Seite zeigt 404 | `index.html` liegt nicht direkt im Repository oder Pages ist nicht auf *main / (root)* eingestellt. 1–2 Minuten warten. |
| Keine Anmeldemaske, unten steht „Ohne Konto“ | `config.js` ist leer oder fehlerhaft. Anführungszeichen und Komma prüfen. |
| „E-Mail oder Passwort stimmt nicht“ | Passwort prüfen oder „Passwort vergessen?“ nutzen. |
| Bestätigungslink führt ins Leere | *Site URL* und *Redirect URLs* aus Schritt 5 prüfen. |
| Abgleich klappt nicht (roter Punkt am Zahnrad) | Projekt in Supabase pausiert? → *Resume project*. Sonst Schritt 2 noch einmal ausführen. |
| Neue Version kommt nicht an | `VERSION` in `sw.js` erhöht? App zweimal schließen und öffnen. |
