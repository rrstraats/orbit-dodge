import { initInput } from './input.js';
import { update } from './update.js';
import { draw } from './render.js';

const cv = document.getElementById('c'), ctx = cv.getContext('2d');
initInput(cv);

let last = performance.now();
function loop(now) {
  const dt = Math.min((now - last) / 1000, 0.05); last = now;
  update(dt); draw(ctx); requestAnimationFrame(loop);
}
requestAnimationFrame(loop);
