import { W, H, CX, CY, PLANET_R, ORBIT_R, SHIP_R } from './config.js';
import { game, stars } from './state.js';

export function draw(ctx) {
  const g = game;
  ctx.clearRect(0, 0, W, H);
  ctx.save();
  if (g.shake) ctx.translate((Math.random() - 0.5) * g.shake, (Math.random() - 0.5) * g.shake);

  ctx.fillStyle = '#fff';
  for (const s of stars) { ctx.globalAlpha = 0.3 + s.s / 3; ctx.fillRect(s.x, s.y, s.s, s.s); }
  ctx.globalAlpha = 1;

  // orbit ring
  ctx.strokeStyle = 'rgba(140,160,255,.18)'; ctx.setLineDash([4, 8]); ctx.lineWidth = 1;
  ctx.beginPath(); ctx.arc(CX, CY, ORBIT_R, 0, 7); ctx.stroke(); ctx.setLineDash([]);

  // planet
  const grad = ctx.createRadialGradient(CX - 15, CY - 15, 5, CX, CY, PLANET_R);
  grad.addColorStop(0, '#6fd6ff'); grad.addColorStop(1, '#2846a8');
  ctx.fillStyle = grad; ctx.beginPath(); ctx.arc(CX, CY, PLANET_R, 0, 7); ctx.fill();

  // asteroids
  for (const a of g.asteroids) {
    ctx.save(); ctx.translate(a.x, a.y); ctx.rotate(a.rot);
    ctx.fillStyle = '#8a7f74'; ctx.strokeStyle = '#c9bcae'; ctx.lineWidth = 2;
    ctx.beginPath();
    for (let i = 0; i < 7; i++) {
      const t = i / 7 * 6.283, r = a.r * (0.8 + 0.2 * Math.sin(i * 12.9 + a.r));
      ctx.lineTo(Math.cos(t) * r, Math.sin(t) * r);
    }
    ctx.closePath(); ctx.fill(); ctx.stroke(); ctx.restore();
  }

  // ship
  if (g.state === 'play' && (g.invuln <= 0 || Math.floor(g.invuln * 12) % 2 === 0)) {
    const sx = CX + Math.cos(g.angle) * ORBIT_R, sy = CY + Math.sin(g.angle) * ORBIT_R;
    ctx.save(); ctx.translate(sx, sy); ctx.rotate(g.angle + (g.dir > 0 ? Math.PI : 0));
    ctx.fillStyle = '#ffd166'; ctx.shadowColor = '#ffd166'; ctx.shadowBlur = 12;
    ctx.beginPath(); ctx.moveTo(SHIP_R, 0); ctx.lineTo(-SHIP_R, -SHIP_R * 0.8); ctx.lineTo(-SHIP_R, SHIP_R * 0.8); ctx.closePath(); ctx.fill();
    ctx.restore();
  }

  // particles
  ctx.fillStyle = '#ffb347';
  for (const p of g.particles) { ctx.globalAlpha = Math.max(p.life, 0); ctx.fillRect(p.x, p.y, 3, 3); }
  ctx.globalAlpha = 1;

  // near-miss popups and ring flash
  if (g.graze > 0) {
    ctx.strokeStyle = '#ffd166'; ctx.globalAlpha = g.graze * 0.6; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.arc(CX, CY, ORBIT_R, 0, 7); ctx.stroke(); ctx.globalAlpha = 1;
  }
  ctx.font = 'bold 20px system-ui'; ctx.textAlign = 'center'; ctx.fillStyle = '#ffd166';
  for (const p of g.popups) { ctx.globalAlpha = Math.max(p.life, 0); ctx.fillText(p.text, p.x, p.y); }
  ctx.globalAlpha = 1;
  ctx.restore();

  // HUD
  ctx.fillStyle = '#dfe6ff'; ctx.font = '20px system-ui'; ctx.textAlign = 'left';
  ctx.fillText('Score ' + g.score.toFixed(1), 20, 34);
  ctx.textAlign = 'right'; ctx.font = '16px system-ui'; ctx.fillText('Best ' + g.best.toFixed(1), W - 20, 66);
  // hearts, top right
  ctx.font = '24px system-ui';
  for (let i = 0; i < 3; i++) {
    const filled = g.state === 'title' || i < g.lives;
    ctx.fillStyle = filled ? '#ff4d6d' : 'rgba(255,255,255,.2)';
    ctx.fillText(filled ? '♥' : '♡', W - 20 - i * 30, 34);
  }
  ctx.fillStyle = '#dfe6ff';

  ctx.textAlign = 'center';
  if (g.state === 'title') {
    ctx.font = 'bold 56px system-ui'; ctx.fillText('ORBIT DODGE', CX, 190);
    ctx.font = '20px system-ui';
    ctx.fillText('Space / click reverses your orbit. Arrow keys set direction.', CX, 610);
    ctx.fillText('Skim past asteroids for bonus points!', CX, 640);
    ctx.fillText('Press Space or click to start', CX, 675);
  } else if (g.state === 'over') {
    ctx.font = 'bold 48px system-ui'; ctx.fillText('CRASHED', CX, 190);
    ctx.font = '22px system-ui'; ctx.fillText('Survived ' + g.score.toFixed(1) + 's', CX, 230);
    ctx.fillText('Press Space or click to retry', CX, 660);
  }
}
