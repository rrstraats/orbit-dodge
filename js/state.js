import { W, H } from './config.js';

// All mutable game state lives on one object so modules can share and reassign it.
export const game = {
  state: 'title', angle: -Math.PI / 2, dir: 1,
  asteroids: [], particles: [], popups: [],
  score: 0, spawnT: 0, elapsed: 0, shake: 0,
  graze: 0, lives: 3, invuln: 0, best: 0,
};
try { game.best = +localStorage.getItem('orbitDodgeBest') || 0; } catch (e) {}

export const stars = Array.from({ length: 80 }, () => ({ x: Math.random() * W, y: Math.random() * H, s: Math.random() * 1.5 + 0.3 }));

export function reset() {
  game.angle = -Math.PI / 2; game.dir = 1; game.asteroids = []; game.particles = [];
  game.score = 0; game.spawnT = 0; game.elapsed = 0; game.shake = 0; game.popups = []; game.graze = 0; game.lives = 3; game.invuln = 0; game.state = 'play';
}

export function saveBest() {
  try { localStorage.setItem('orbitDodgeBest', game.best); } catch (e) {}
}
