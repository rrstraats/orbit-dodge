# Orbit Dodge

A tiny single-file canvas game. You pilot a ship around a planet and dodge incoming asteroids. Skim close to one for bonus points.

## Play

The game uses ES modules, which browsers block over `file://`, so serve the folder locally:

```
python -m http.server 8000
```

Then open http://localhost:8000. No build step or dependencies.

## Controls

| Input | Action |
| --- | --- |
| Space / click / tap | Reverse orbit direction (or start / retry) |
| Left / Right arrow | Set orbit direction |

## Rules

- Your score is seconds survived, plus bonuses for near misses ("grazes").
- You have 3 lives, and you're briefly invulnerable after a hit.
- Asteroids speed up and spawn faster the longer you last.
- Your best score is saved in your browser's `localStorage`.
