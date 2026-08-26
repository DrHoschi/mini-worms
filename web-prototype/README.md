# Mini-Worms – experimental web/mobile prototype

This folder is a deliberately disposable browser prototype. It is **not** the Unity implementation and it does **not** change the FROZEN MW-00…MW-05 project baseline.

## Purpose

Quickly demonstrate how the artillery loop can feel on a smartphone before the Unity project is available:

- side-view 2D playfield
- touch controls for movement and jump
- aim angle and shot power
- ballistic projectile
- circular explosions
- destructible terrain
- damage and knockback
- simple turn switching
- Sheldon as player character
- Rollridge as a lightweight CPU opponent for demonstration only

The prototype intentionally reaches beyond formal P000/P001 scope so the overall game loop can be felt. AI and mobile remain outside the frozen early Unity scope unless they are later adopted through the normal project decision process.

## Run

Open `index.html` through a static web server. The files have no external dependencies and can also be hosted with GitHub Pages or any simple static hosting.

### Touch controls

- ◀ / ▶: move
- ▲: jump
- ↙ / ↗: lower/raise aim angle
- − / ＋: shot power
- FEUER: fire

### Keyboard fallback

- A/D or arrows: move
- Space: jump
- Up/Down: aim
- Q/E: power
- Enter: fire

## Architecture note

The browser prototype keeps a binary terrain mask in memory and derives the visible terrain from it, following the same conceptual direction as MW-02. Collision in this throwaway prototype samples the mask directly instead of generating Unity Collider2D geometry. The real Unity implementation must follow MW-02 and the P000/P001 roadmap rather than copying this browser code literally.
