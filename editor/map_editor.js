const canvas = document.getElementById('editor-canvas');
const ctx = canvas.getContext('2d');
const state = { birds: [], pigs: [], boxes: [], tnt: [], platforms: [] };
let current = 'pig';

canvas.addEventListener('click', e => {
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  if (current === 'pig') state.pigs.push({ x, y, hp: 100, ai: true });
  if (current === 'box') state.boxes.push({ x, y });
  if (current === 'tnt') state.tnt.push({ x, y });
  if (current === 'bird') {
    const tier = document.getElementById('bird-tier').value || '1x';
    state.birds.push(tier);
  }
  if (current === 'platform') state.platforms.push({ x, y, width: 120, height: 20 });
  render();
});

function render() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = '#444';
  ctx.fillRect(0, 480, canvas.width, 20);
  ctx.fillStyle = 'green';
  state.pigs.forEach(p => ctx.fillRect(p.x - 10, p.y - 10, 20, 20));
  ctx.fillStyle = 'sienna';
  state.boxes.forEach(b => ctx.fillRect(b.x - 10, b.y - 10, 20, 20));
  ctx.fillStyle = 'red';
  state.tnt.forEach(t => ctx.fillRect(t.x - 10, t.y - 10, 20, 20));
  ctx.fillStyle = 'yellow';
  state.platforms.forEach(p => ctx.fillRect(p.x - p.width / 2, p.y - 5, p.width, p.height));
  ctx.fillStyle = 'white';
  ctx.fillText(`Birds: ${state.birds.join(',')}`, 10, 20);
}

export function getLevelData() {
  return {
    name: document.getElementById('level-name').value || 'custom_level',
    difficulty: document.getElementById('difficulty').value,
    ...state
  };
}

export function setLevelData(data) {
  ['birds', 'pigs', 'boxes', 'tnt', 'platforms'].forEach(k => state[k] = data[k] || []);
  document.getElementById('level-name').value = data.name || 'custom_level';
  render();
}

export function setMode(mode) { current = mode; }
render();
