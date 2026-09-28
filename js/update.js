import { CX, CY, PLANET_R, ORBIT_R, SHIP_R, GRAZE_DIST } from './config.js';
import { game, saveBest } from './state.js';
import { spawn, boom } from './spawn.js';

export function update(dt) {
  const g = game;
  for (const p of g.particles) { p.x += p.vx * dt; p.y += p.vy * dt; p.life -= dt; }
  g.particles = g.particles.filter(p => p.life > 0);
  g.shake = Math.max(0, g.shake - dt * 30);
  g.graze = Math.max(0, g.graze - dt * 4);
  g.invuln = Math.max(0, g.invuln - dt);
  for (const p of g.popups) { p.y -= 40 * dt; p.life -= dt * 1.2; }
  g.popups = g.popups.filter(p => p.life > 0);
  if (g.state !== 'play') return;

  g.elapsed += dt; g.score += dt;
  const angSpeed = 2.1 + Math.min(g.elapsed * 0.02, 1.2);
  g.angle += g.dir * angSpeed * dt;

  g.spawnT -= dt;
  if (g.spawnT <= 0) { spawn(); g.spawnT = Math.max(0.35, 1.1 - g.elapsed * 0.012); }

  const sx = CX + Math.cos(g.angle) * ORBIT_R, sy = CY + Math.sin(g.angle) * ORBIT_R;
  for (const a of g.asteroids) {
    a.x += a.vx * dt; a.y += a.vy * dt; a.rot += a.spin * dt;
    const dist = Math.hypot(a.x - sx, a.y - sy);
    if (g.invuln > 0) continue;
    if (dist < a.r + SHIP_R - 2) {
      boom(sx, sy); g.shake = 12;
      if (g.lives > 0) {
        g.lives--; g.invuln = 1.5; a.dead = true;
      } else {
        g.state = 'over';
        if (g.score > g.best) { g.best = g.score; saveBest(); }
      }
    } else if (!a.grazed && dist < a.r + SHIP_R + GRAZE_DIST) {
      // near miss: closer pass = bigger bonus
      a.grazed = true;
      const tight = 1 - (dist - (a.r + SHIP_R)) / GRAZE_DIST;
      const bonus = tight > 0.66 ? 2 : 1;
      g.score += bonus; g.graze = 1;
      g.popups.push({ x: sx, y: sy - 14, text: '+' + bonus + (bonus > 1 ? ' CLOSE!' : ''), life: 1 });
    }
  }
  // asteroids that hit the planet or leave far away vanish
  g.asteroids = g.asteroids.filter(a => !a.dead && Math.hypot(a.x - CX, a.y - CY) > PLANET_R + a.r * 0.5 && Math.hypot(a.x - CX, a.y - CY) < 700);
}
