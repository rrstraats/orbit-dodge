import { CX, CY, ORBIT_R } from './config.js';
import { game } from './state.js';

export function spawn() {
  const a = Math.random() * Math.PI * 2, d = 480;
  const x = CX + Math.cos(a) * d, y = CY + Math.sin(a) * d;
  // aim near the orbit ring, with some jitter so they're not perfectly predictable
  const ta = game.angle + (Math.random() - 0.5) * 2.2;
  const tx = CX + Math.cos(ta) * ORBIT_R, ty = CY + Math.sin(ta) * ORBIT_R;
  const speed = 110 + Math.min(game.elapsed * 4, 160) + Math.random() * 50;
  const len = Math.hypot(tx - x, ty - y);
  game.asteroids.push({ x, y, vx: (tx - x) / len * speed, vy: (ty - y) / len * speed, r: 10 + Math.random() * 12, rot: Math.random() * 6, spin: (Math.random() - 0.5) * 3 });
}

export function boom(x, y) {
  for (let i = 0; i < 40; i++) {
    const a = Math.random() * 6.28, s = 40 + Math.random() * 220;
    game.particles.push({ x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s, life: 1 });
  }
}
