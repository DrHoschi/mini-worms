# Mini-Worms – Artillery Game

Internes Entwicklungsrepository für das eigenständige Artillery-Projekt **Mini-Worms**.

## Verbindlicher Projektstand

- MW-00 bis MW-05: **FROZEN**, Stand 24.08.2026
- PRE-P000: abgeschlossen
- Aktueller Repository-Schritt: **GH-02 – Repository-Grundstruktur**
- P000-Gameplay-Implementierung: **noch nicht begonnen**
- Primäre Engine: **Unity**
- Gameplayraum: **2D**

Die FROZEN-Dokumente MW-00 bis MW-05 haben bei Scope-, Gameplay- und Architekturfragen Vorrang. GH-02 verändert diese Projektbasis nicht.

## Scope von GH-02

Dieses Repository bereitet ausschließlich die spätere Unity-Entwicklung vor:

- Unity-taugliche `.gitignore`
- klare Dokumentationsstruktur
- eigener Projektinhalt unter `Assets/Game/`
- Trennung von eigenem Projektinhalt und Drittanbieterpaketen
- vorbereitete Teststruktur
- P000-Arbeits- und Statusdokumentation

Noch **nicht** Bestandteil sind Waffen, Projektile, Explosionen, Schaden, Matchlogik, KI, Multiplayer oder andere spätere Systeme.

## Repository-Struktur

```text
.
├── Assets/
│   ├── Game/                 # eigener Projektinhalt
│   │   ├── Art/
│   │   ├── Audio/
│   │   ├── Data/
│   │   ├── Prefabs/
│   │   ├── Scenes/
│   │   ├── Scripts/
│   │   │   ├── Characters/
│   │   │   ├── GameFlow/
│   │   │   ├── Input/
│   │   │   ├── Terrain/
│   │   │   ├── Weapons/
│   │   │   ├── Camera/
│   │   │   ├── UI/
│   │   │   └── Infrastructure/
│   │   ├── Tests/
│   │   │   ├── EditMode/
│   │   │   └── PlayMode/
│   │   └── VFX/
│   └── ThirdParty/           # Drittanbieterinhalt, getrennt vom eigenen Code
└── docs/
    ├── baseline/             # Verweis auf die FROZEN-Projektbasis
    └── P000/                 # Arbeits- und Statusdokumentation
```

Die Ordner `Packages/`, `ProjectSettings/` und weitere Unity-generierte Projektdateien werden **nicht von Hand vorgetäuscht**. Sie werden erst durch die tatsächliche Unity-Projektanlage erzeugt und anschließend geprüft und versioniert.

## Ohne Unity bereits vorbereitet

- Repository- und Dokumentationsstruktur
- `Assets/Game/` als Grenze für eigenen Projektinhalt
- `Assets/ThirdParty/` als klare Fremdpaketgrenze
- EditMode-/PlayMode-Testordner
- Unity-taugliche Ignore-Regeln
- P000-Arbeits- und Statusdokumentation

## Erst im Unity Editor zu prüfen

- konkrete stabile Unity-Version festlegen
- tatsächliches Unity-Projekt anlegen und öffnen
- von Unity erzeugte `Packages/`- und `ProjectSettings/`-Dateien übernehmen
- Import der vorbereiteten `Assets/`-Struktur prüfen
- Teststruktur technisch aktivieren und validieren
- danach P000 gemäß MW-02/MW-04 mit der Unity-Projektbasis beginnen

Details: [`docs/P000/STATUS.md`](docs/P000/STATUS.md) und [`docs/P000/WORKPLAN.md`](docs/P000/WORKPLAN.md).
