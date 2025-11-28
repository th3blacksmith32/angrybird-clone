import { getLevelData, setLevelData, setMode } from './map_editor.js';

document.getElementById('entity').addEventListener('change', e => setMode(e.target.value));
document.getElementById('btn-export').addEventListener('click', () => {
  document.getElementById('json-area').value = JSON.stringify(getLevelData(), null, 2);
});
document.getElementById('btn-import').addEventListener('click', () => {
  try {
    const parsed = JSON.parse(document.getElementById('json-area').value);
    setLevelData(parsed);
  } catch (e) { alert('Invalid JSON'); }
});
document.getElementById('btn-new').addEventListener('click', () => setLevelData({ name: 'custom_level', birds: [], pigs: [], boxes: [], tnt: [], platforms: [] }));
