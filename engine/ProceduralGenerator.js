export default class ProceduralGenerator {
  generate(difficulty = 'easy') {
    const pigs = Array.from({ length: difficulty === 'hard' ? 5 : difficulty === 'medium' ? 3 : 2 }, (_, i) => ({ x: 600 + i * 80, y: 400, hp: 100, ai: true }));
    const boxes = Array.from({ length: 6 }, (_, i) => ({ x: 650 + (i % 3) * 40, y: 450 - Math.floor(i / 3) * 40, type: 'box' }));
    const tnt = [{ x: 720, y: 460 }];
    const birds = ['1x', '2x', '3x'];
    return { name: `random_${Date.now()}`, pigs, boxes, tnt, birds, platforms: [{ x: 700, y: 500, width: 200, height: 20 }] };
  }
}
