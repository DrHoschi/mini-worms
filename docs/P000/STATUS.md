# P000 – Status

**Meilenstein:** P000 – Core Movement & Terrain  
**Status Gameplay-Implementierung:** NOT STARTED  
**Repository-Vorbereitung:** GH-02 PREPARED  
**Unity-Version:** TBD – erst beim tatsächlichen Entwicklungsstart festlegen  
**Stand:** 24.08.2026

## Bereits ohne Unity vorbereitet

- Repository-Grundstruktur
- Unity-taugliche `.gitignore`
- eigener Projektbereich unter `Assets/Game/`
- getrennte Drittanbieterstruktur unter `Assets/ThirdParty/`
- Testordner für EditMode und PlayMode
- P000-Arbeitsdokumentation

## Erst im Unity Editor verifizierbar

- geeignete stabile Unity-Version auswählen und dokumentieren
- Unity-Projekt technisch anlegen
- Projekt ohne Import-/Projektfehler öffnen
- Unity-generierte `Packages/`- und `ProjectSettings/`-Dateien versionieren
- vorbereitete `Assets/`-Ordner korrekt importieren lassen
- EditMode-/PlayMode-Teststruktur technisch aktivieren

## Scope-Sperre

Bis GH-02 abgeschlossen und die Unity-Projektbasis tatsächlich angelegt ist, wird keine P000-Gameplay-Implementierung begonnen.

P000 enthält später nur Figur + Terrain + Bewegung + grundlegende Physikinteraktion. Waffen, Projektile, Explosionen, Schaden, Teams, Turn-/Matchlogik, KI und Multiplayer bleiben außerhalb von P000.
