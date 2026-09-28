import { game, reset } from './state.js';

// Controls: space / click / tap reverses direction; left/right arrows set direction.
function flip() {
  if (game.state === 'play') game.dir *= -1;
  else if (game.state === 'title' || game.state === 'over') reset();
}

export function initInput(canvas) {
  addEventListener('keydown', e => {
    if (e.code === 'Space') { e.preventDefault(); flip(); }
    else if (e.code === 'ArrowLeft') { if (game.state === 'play') game.dir = -1; else flip(); }
    else if (e.code === 'ArrowRight') { if (game.state === 'play') game.dir = 1; else flip(); }
  });
  canvas.addEventListener('pointerdown', flip);
}
