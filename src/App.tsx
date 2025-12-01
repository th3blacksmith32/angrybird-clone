// @ts-nocheck
import React, { useState, useEffect, useRef, useCallback } from 'react';

const IconWrapper = ({ children, size = 24, className = '' }) => (
  <svg
    className={className}
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {children}
  </svg>
);

const Play = (props) => (
  <IconWrapper {...props}>
    <polygon points="6 4 20 12 6 20 6 4" />
  </IconWrapper>
);

const Pause = (props) => (
  <IconWrapper {...props}>
    <rect x="6" y="4" width="4" height="16" />
    <rect x="14" y="4" width="4" height="16" />
  </IconWrapper>
);

const RefreshCw = (props) => (
  <IconWrapper {...props}>
    <polyline points="23 4 23 10 17 10" />
    <polyline points="1 20 1 14 7 14" />
    <path d="M3.51 9a9 9 0 0114.13-3.36L23 10M1 14l5.36 4.36A9 9 0 0020.49 15" />
  </IconWrapper>
);

const Zap = (props) => (
  <IconWrapper {...props}>
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </IconWrapper>
);

const Crosshair = (props) => (
  <IconWrapper {...props}>
    <circle cx="12" cy="12" r="3" />
    <line x1="12" y1="2" x2="12" y2="5" />
    <line x1="12" y1="19" x2="12" y2="22" />
    <line x1="2" y1="12" x2="5" y2="12" />
    <line x1="19" y1="12" x2="22" y2="12" />
  </IconWrapper>
);

const Hexagon = (props) => (
  <IconWrapper {...props}>
    <polygon points="21 16 12 22 3 16 3 8 12 2 21 8 21 16" />
  </IconWrapper>
);

const ChevronsUp = (props) => (
  <IconWrapper {...props}>
    <polyline points="17 11 12 6 7 11" />
    <polyline points="17 18 12 13 7 18" />
  </IconWrapper>
);

const Lock = (props) => (
  <IconWrapper {...props}>
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0110 0v4" />
  </IconWrapper>
);

const Shield = (props) => (
  <IconWrapper {...props}>
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </IconWrapper>
);

const Sword = (props) => (
  <IconWrapper {...props}>
    <path d="M14.5 17.5L3 6 6 3l11.5 11.5" />
    <path d="M13 19l2-2" />
    <path d="M16 16l3-3" />
    <path d="M19 13l2-2" />
  </IconWrapper>
);

// --- Constants & Config ---
const TILE_SIZE = 60;
const MAP_COLS = 14;
const MAP_ROWS = 10;
const FPS = 60;

// Kenney-inspired Palette
const COLORS = {
  grass: '#71aa34',
  grassLight: '#86bf45',
  path: '#dcb678',
  pathBorder: '#bfa065',
  base: '#5fcde4',
  enemy: '#e05858',
  enemyStrong: '#993333',
  enemyBoss: '#660000',
  towerBase: '#a0a0a0',
  uiBg: '#2a2a2a',
  uiText: '#ffffff',
  accent: '#ffd93f',
  castle: '#3b82f6',     // Blue for player base
  spawner: '#451a03'     // Dark for enemy spawner
};

// Tower Definitions
const TOWERS = {
  BASIC: {
    id: 'BASIC',
    name: 'Turret',
    cost: 100, // Increased cost (Harder start)
    range: 250, // Much longer range (covers more road, effectively end-to-end for shorter paths)
    damage: 15,
    cooldown: 45, 
    color: '#ffffff',
    icon: Hexagon,
    unlocksAt: 0
  },
  RAPID: {
    id: 'RAPID',
    name: 'Blaster',
    cost: 450,
    range: 130,
    damage: 8,
    cooldown: 5,
    color: '#ffcc00',
    icon: Zap,
    unlocksAt: 3 
  },
  SNIPER: {
    id: 'SNIPER',
    name: 'Sniper',
    cost: 1200,
    range: 500, // Almost full map
    damage: 200,
    cooldown: 150,
    color: '#333333',
    icon: Crosshair,
    unlocksAt: 8 
  }
};

// Map Layout (0 = Grass, 1 = Path)
const MAP_LAYOUT = [
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0],
  [0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0],
  [0, 0, 1, 1, 1, 1, 1, 0, 1, 0, 0, 0, 1, 0],
  [0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0],
  [0, 1, 1, 1, 1, 1, 1, 0, 1, 0, 0, 0, 1, 0],
  [0, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 1, 0],
  [0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0],
  [0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0],
];

// Waypoints
const WAYPOINTS = [
  { c: 0, r: 1 }, { c: 2, r: 1 }, { c: 2, r: 3 }, { c: 6, r: 3 },
  { c: 6, r: 5 }, { c: 1, r: 5 }, { c: 1, r: 7 }, { c: 3, r: 7 },
  { c: 3, r: 8 }, { c: 8, r: 8 }, { c: 8, r: 1 }, { c: 12, r: 1 },
  { c: 12, r: 9 }, { c: 13, r: 9 } 
].map(p => ({ x: p.c * TILE_SIZE + TILE_SIZE / 2, y: p.r * TILE_SIZE + TILE_SIZE / 2 }));

const SPAWN_POINT = WAYPOINTS[0];
const BASE_POINT = WAYPOINTS[WAYPOINTS.length - 1];

export default function App() {
  const canvasRef = useRef(null);
  
  // Game State
  const gameState = useRef({
    enemies: [],
    towers: [],
    projectiles: [],
    particles: [], 
    wave: 1,
    waveActive: false,
    nextWaveTimer: 0, 
    enemiesToSpawn: 0,
    spawnTimer: 0,
    frames: 0,
    bossesDefeated: 0,
    castleCooldown: 0 // For the base shooting back
  });

  // UI State
  const [money, setMoney] = useState(150); // Harder start: Only enough for 1 basic tower + upgrade
  const [wave, setWave] = useState(1);
  const [bossesDefeated, setBossesDefeated] = useState(0);
  const [selectedTowerType, setSelectedTowerType] = useState(null); 
  const [selectedTowerInstance, setSelectedTowerInstance] = useState(null); 
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [nextWaveCountdown, setNextWaveCountdown] = useState(0);

  // New Castle State
  const [castleStats, setCastleStats] = useState({
      hp: 100,
      maxHp: 100,
      level: 1,
      damage: 10,
      range: 200,
      upgradeCost: 200
  });

  // --- Rendering Helpers ---

  // *** FIXED: drawMap function definition ***
  const drawMap = useCallback((ctx) => {
    ctx.clearRect(0, 0, MAP_COLS * TILE_SIZE, MAP_ROWS * TILE_SIZE);

    for (let r = 0; r < MAP_ROWS; r++) {
      for (let c = 0; c < MAP_COLS; c++) {
        const tile = MAP_LAYOUT[r][c];
        const x = c * TILE_SIZE;
        const y = r * TILE_SIZE;

        if (tile === 1) { // Path
          ctx.fillStyle = COLORS.path;
        } else { // Grass (0)
          ctx.fillStyle = COLORS.grass;
        }
        ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);
        
        // Add subtle path borders
        if (tile === 1) {
            ctx.strokeStyle = COLORS.pathBorder;
            ctx.lineWidth = 1;
            ctx.strokeRect(x, y, TILE_SIZE, TILE_SIZE);
        }
      }
    }
  }, []);

  const drawTowers = (ctx) => {
    gameState.current.towers.forEach(tower => {
      const { x, y, type, rotation, level } = tower;
      const isSelected = selectedTowerInstance && selectedTowerInstance.id === tower.id;

      if (isSelected) {
        ctx.beginPath();
        ctx.arc(x, y, tower.range, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.fill();
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.stroke();
      }

      ctx.fillStyle = COLORS.towerBase;
      ctx.fillRect(x - 20, y - 20, 40, 40);
      
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rotation);
      
      if (type === 'BASIC') {
        ctx.fillStyle = '#eee';
        ctx.beginPath();
        ctx.roundRect(-12, -12, 24, 24, 4);
        ctx.fill();
        ctx.fillStyle = level > 3 ? '#ffaa00' : '#ccc';
        ctx.fillRect(10, -5, 20 + (level*2), 10); 
      } else if (type === 'SNIPER') {
        ctx.fillStyle = '#444';
        ctx.beginPath();
        ctx.arc(0, 0, 14, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#222'; 
        ctx.fillRect(0, -3, 35 + (level*2), 6);
      } else if (type === 'RAPID') {
        ctx.fillStyle = '#ffdb4d';
        ctx.beginPath();
        ctx.moveTo(-10, -10);
        ctx.lineTo(10, 0);
        ctx.lineTo(-10, 10);
        ctx.fill();
        ctx.fillStyle = '#e6b800';
        ctx.fillRect(5, -8, 15, 4);
        ctx.fillRect(5, 4, 15, 4);
      }
      ctx.restore();
    });
  };

  const drawEnemies = (ctx) => {
    gameState.current.enemies.forEach(enemy => {
      ctx.fillStyle = enemy.color;
      ctx.beginPath();
      ctx.arc(enemy.x, enemy.y, enemy.radius, 0, Math.PI * 2);
      ctx.fill();
      
      if (enemy.isBoss) {
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 3;
        ctx.stroke();
      }

      const hpPct = enemy.hp / enemy.maxHp;
      ctx.fillStyle = 'red';
      ctx.fillRect(enemy.x - 12, enemy.y - enemy.radius - 8, 24, 4);
      ctx.fillStyle = '#0f0';
      ctx.fillRect(enemy.x - 12, enemy.y - enemy.radius - 8, 24 * hpPct, 4);
    });
  };

  const drawProjectiles = (ctx) => {
    gameState.current.projectiles.forEach(proj => {
      ctx.fillStyle = proj.type === 'CASTLE' ? '#3b82f6' : (proj.type === 'SNIPER' ? '#ffff00' : '#fff');
      ctx.beginPath();
      ctx.arc(proj.x, proj.y, proj.type === 'CASTLE' ? 6 : 4, 0, Math.PI * 2);
      ctx.fill();
    });
  };
  
  const drawParticles = (ctx) => {
     gameState.current.particles.forEach(p => {
         ctx.globalAlpha = p.life;
         ctx.fillStyle = p.color || 'white';
         ctx.beginPath();
         ctx.arc(p.x, p.y, p.size, 0, Math.PI*2);
         ctx.fill();
         ctx.globalAlpha = 1.0;
     });
  };

  // --- Engine Logic ---

  const spawnEnemy = useCallback(() => {
    const state = gameState.current;
    const isBossWave = state.wave % 10 === 0;
    const isBossUnit = isBossWave && state.enemiesToSpawn === 1; 

    // Difficulty Scaling
    const growthWave = state.wave <= 15 ? state.wave : 15 + (state.wave - 15) * 1.5;
    const hpMultiplier = Math.pow(1.2, growthWave); // Steeper HP curve after wave 15
    
    // SLOWER ENEMIES (50% of previous speed roughly)
    let speed = 0.8 + Math.min(2.0, state.wave * 0.04);

    let radius = 12;
    let color = COLORS.enemy;
    let maxHp = 50 * hpMultiplier;
    let bounty = 10; // Less money per kill (Grind factor)

    if (isBossUnit) {
      maxHp *= 20; 
      radius = 24;
      const bossSpeedPenalty = state.wave > 15 ? Math.min(1, 0.6 + (state.wave - 15) * 0.03) : 0.6;
      speed *= bossSpeedPenalty; 
      color = COLORS.enemyBoss;
      bounty = 300;
    }

    state.enemies.push({
      x: SPAWN_POINT.x,
      y: SPAWN_POINT.y,
      wpIndex: 1,
      hp: maxHp,
      maxHp: maxHp,
      speed: speed,
      radius: radius,
      color: color,
      isBoss: isBossUnit,
      bounty: bounty,
      frozen: 0
    });
  }, []);

  const resetGame = () => {
    gameState.current = {
      enemies: [],
      towers: [],
      projectiles: [],
      particles: [],
      wave: 1,
      waveActive: false,
      nextWaveTimer: 0,
      enemiesToSpawn: 0,
      spawnTimer: 0,
      frames: 0,
      bossesDefeated: 0,
      castleCooldown: 0
    };
    setMoney(150); // Reset to low money
    setCastleStats({
        hp: 100, maxHp: 100, level: 1, damage: 10, range: 200, upgradeCost: 200
    });
    setWave(1);
    setBossesDefeated(0);
    setGameOver(false);
    setIsPlaying(true);
    setSelectedTowerType(null);
    setSelectedTowerInstance(null);
    
    startWave(1);
  };

  const startWave = (waveNum) => {
    gameState.current.wave = waveNum;
    gameState.current.waveActive = true;
    gameState.current.nextWaveTimer = 0;
    
    const isBossWave = waveNum % 10 === 0;
    gameState.current.enemiesToSpawn = isBossWave ? 5 : (6 + Math.floor(waveNum * 1.2));
    
    setWave(waveNum);
    setNextWaveCountdown(0);
  };

  // --- Upgrade Systems ---

  const upgradeCastle = () => {
      if (money >= castleStats.upgradeCost) {
          setMoney(m => m - castleStats.upgradeCost);
          setCastleStats(prev => ({
              ...prev,
              level: prev.level + 1,
              maxHp: prev.maxHp + 100,
              hp: prev.hp + 100, // Heal on upgrade
              damage: prev.damage * 1.5,
              upgradeCost: Math.floor(prev.upgradeCost * 1.8) // Steep cost curve
          }));
          
          // Particles at base
          for(let i=0; i<15; i++) {
            gameState.current.particles.push({
                x: BASE_POINT.x, y: BASE_POINT.y,
                vx: (Math.random()-0.5)*6, vy: (Math.random()-0.5)*6,
                life: 1.2, decay: 0.05, size: 5, color: '#3b82f6'
            });
          }
      }
  };

  const getUpgradeCost = (tower) => {
    const baseCost = TOWERS[tower.type].cost;
    return Math.floor(baseCost * Math.pow(1.6, tower.level)); // Higher upgrade cost
  };
  
  const upgradeTower = () => {
    if (!selectedTowerInstance || selectedTowerInstance.type === 'CASTLE') return;
    const tower = gameState.current.towers.find(t => t.id === selectedTowerInstance.id);
    if (!tower) return;

    const cost = getUpgradeCost(tower);
    if (money >= cost) {
      setMoney(m => m - cost);
      
      tower.level += 1;
      tower.damage *= 1.4; 
      tower.range *= 1.1; 
      tower.cooldown *= 0.95;
      
      for(let i=0; i<10; i++) {
        gameState.current.particles.push({
            x: tower.x, y: tower.y,
            vx: (Math.random()-0.5)*5, vy: (Math.random()-0.5)*5,
            life: 1.0, decay: 0.05, size: 4, color: '#ffff00'
        });
      }
      setSelectedTowerInstance({...tower});
    }
  };


  const sellTower = () => {
    if (!selectedTowerInstance || selectedTowerInstance.type === 'CASTLE') return;
    const towerIndex = gameState.current.towers.findIndex(t => t.id === selectedTowerInstance.id);
    if (towerIndex > -1) {
      const tower = gameState.current.towers[towerIndex];
      const refund = Math.floor(TOWERS[tower.type].cost * 0.4); // Low refund
      setMoney(m => m + refund);
      gameState.current.towers.splice(towerIndex, 1);
      setSelectedTowerInstance(null);
    }
  }

  // --- Logic Loop ---

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const loop = () => {
      if (!isPlaying || gameOver) {
        drawGame(ctx);
        if(!gameOver && isPlaying) animationFrameId = requestAnimationFrame(loop);
        return; 
      }
      updateGame();
      drawGame(ctx);
      animationFrameId = requestAnimationFrame(loop);
    };

    const updateGame = () => {
      const state = gameState.current;
      state.frames++;

      // 1. Spawning
      if (state.waveActive) {
        if (state.enemiesToSpawn > 0) {
          state.spawnTimer++;
          // Faster spawning later in game
          const spawnRate = Math.max(20, 70 - state.wave); 
          
          if (state.spawnTimer > spawnRate) { 
            spawnEnemy();
            state.enemiesToSpawn--;
            state.spawnTimer = 0;
          }
        } else if (state.enemies.length === 0) {
          state.waveActive = false;
          state.nextWaveTimer = 180; // 3 sec break
        }
      } else {
        if (state.nextWaveTimer > 0) {
            state.nextWaveTimer--;
            setNextWaveCountdown(Math.ceil(state.nextWaveTimer / 60));
        } else {
            startWave(state.wave + 1);
        }
      }

      // 2. Towers Fire
      state.towers.forEach(tower => {
        if (tower.cooldownTimer > 0) tower.cooldownTimer--;

        let target = null;
        let minDist = Infinity;

        // Target closest enemy in range
        for (const enemy of state.enemies) {
          const dx = enemy.x - tower.x;
          const dy = enemy.y - tower.y;
          const dist = Math.sqrt(dx*dx + dy*dy);
          
          if (dist <= tower.range) {
             if (dist < minDist) { minDist = dist; target = enemy; }
          }
        }

        if (target && tower.cooldownTimer <= 0) {
          const angle = Math.atan2(target.y - tower.y, target.x - tower.x);
          tower.rotation = angle;
          
          state.projectiles.push({
            x: tower.x, y: tower.y,
            targetId: target, 
            vx: Math.cos(angle) * 12,
            vy: Math.sin(angle) * 12,
            damage: tower.damage,
            life: 60,
            type: tower.type
          });
          tower.cooldownTimer = tower.cooldown;
        }
      });

      // 3. Castle Defense Logic (The "Tower that can be upgraded")
      if (state.castleCooldown > 0) state.castleCooldown--;
      
      // Find closest enemy to Castle
      let castleTarget = null;
      let closestDist = castleStats.range;

      for (const enemy of state.enemies) {
        const dx = enemy.x - BASE_POINT.x;
        const dy = enemy.y - BASE_POINT.y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        if (dist < closestDist) {
            closestDist = dist;
            castleTarget = enemy;
        }
      }

      // Castle Shoots
      if (castleTarget && state.castleCooldown <= 0) {
          state.projectiles.push({
              x: BASE_POINT.x, y: BASE_POINT.y,
              targetId: castleTarget,
              vx: (castleTarget.x - BASE_POINT.x) / 10, // Simple homing
              vy: (castleTarget.y - BASE_POINT.y) / 10,
              damage: castleStats.damage,
              life: 30,
              type: 'CASTLE'
          });
          state.castleCooldown = 30; // Fire every 0.5s
      }


      // 4. Projectiles
      for (let i = state.projectiles.length - 1; i >= 0; i--) {
        const p = state.projectiles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life--;

        let hit = false;
        for (const enemy of state.enemies) {
          const dx = p.x - enemy.x;
          const dy = p.y - enemy.y;
          const dist = Math.sqrt(dx*dx + dy*dy);
          if (dist < enemy.radius + 5) {
            enemy.hp -= p.damage;
            hit = true;
            // Particles
            for(let k=0; k<2; k++) {
                state.particles.push({
                    x: p.x, y: p.y, 
                    vx: (Math.random()-0.5)*4, vy: (Math.random()-0.5)*4, 
                    life: 0.8, decay: 0.1, size: 2, 
                    color: p.type === 'CASTLE' ? '#3b82f6' : '#ffaa00'
                });
            }
            break;
          }
        }

        if (hit || p.life <= 0) {
          state.projectiles.splice(i, 1);
        }
      }

      // 5. Enemies Move & Die
      for (let i = state.enemies.length - 1; i >= 0; i--) {
        const enemy = state.enemies[i];
        
        // Death
        if (enemy.hp <= 0) {
          setMoney(m => m + enemy.bounty);
          if (enemy.isBoss) {
              state.bossesDefeated++;
              setBossesDefeated(state.bossesDefeated);
          }
          // Explosion particles
           for(let k=0; k<8; k++) {
                state.particles.push({
                    x: enemy.x, y: enemy.y, 
                    vx: (Math.random()-0.5)*4, vy: (Math.random()-0.5)*4, 
                    life: 1.0, decay: 0.05, size: 4, color: enemy.color
                });
            }
          state.enemies.splice(i, 1);
          continue;
        }

        // Move
        const wp = WAYPOINTS[enemy.wpIndex];
        if (wp) {
          const dx = wp.x - enemy.x;
          const dy = wp.y - enemy.y;
          const dist = Math.sqrt(dx*dx + dy*dy);

          if (dist < 5) {
            enemy.wpIndex++;
            if (enemy.wpIndex >= WAYPOINTS.length) {
              // Reached Castle!
              // Damage Castle
              const damage = enemy.isBoss ? 50 : 10;
              setCastleStats(prev => {
                  const newHp = prev.hp - damage;
                  if (newHp <= 0) {
                      setGameOver(true);
                      setIsPlaying(false);
                      return { ...prev, hp: 0 };
                  }
                  return { ...prev, hp: newHp };
              });
              
              // Enemy explodes on impact
              state.enemies.splice(i, 1);
              
              // Impact particles
              for(let k=0; k<8; k++) {
                state.particles.push({
                    x: BASE_POINT.x, y: BASE_POINT.y, 
                    vx: (Math.random()-0.5)*8, vy: (Math.random()-0.5)*8, 
                    life: 1.0, decay: 0.05, size: 4, color: '#ef4444'
                });
              }
              continue;
            }
          } else {
            enemy.x += (dx / dist) * enemy.speed;
            enemy.y += (dy / dist) * enemy.speed;
          }
        }
      }
      
      // 6. Particles
      for(let i=state.particles.length-1; i>=0; i--) {
          const p = state.particles[i];
          p.x += p.vx;
          p.y += p.vy;
          p.life -= p.decay;
          if(p.life <= 0) state.particles.splice(i, 1);
      }
    };

    const drawGame = (ctx) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // 1. Draw Map (The missing function)
      drawMap(ctx);
      
      // 2. Draw Spawner (Start)
      ctx.fillStyle = COLORS.spawner;
      ctx.beginPath();
      ctx.moveTo(SPAWN_POINT.x, SPAWN_POINT.y - 25);
      ctx.lineTo(SPAWN_POINT.x + 20, SPAWN_POINT.y + 10);
      ctx.lineTo(SPAWN_POINT.x - 20, SPAWN_POINT.y + 10);
      ctx.fill();
      ctx.fillStyle = '#000'; // Dark hole
      ctx.beginPath();
      ctx.arc(SPAWN_POINT.x, SPAWN_POINT.y, 10, 0, Math.PI*2);
      ctx.fill();

      // 3. Draw Castle (End)
      ctx.fillStyle = COLORS.castle;
      ctx.fillRect(BASE_POINT.x - 20, BASE_POINT.y - 20, 40, 40);
      // Castle Turret
      ctx.fillStyle = '#60a5fa';
      ctx.beginPath();
      ctx.arc(BASE_POINT.x, BASE_POINT.y, 15, 0, Math.PI*2);
      ctx.fill();
      // HP Bar above castle
      const castleHpPct = castleStats.hp / castleStats.maxHp;
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(BASE_POINT.x - 25, BASE_POINT.y - 35, 50, 8);
      ctx.fillStyle = castleHpPct > 0.5 ? '#22c55e' : '#ef4444';
      ctx.fillRect(BASE_POINT.x - 25, BASE_POINT.y - 35, 50 * castleHpPct, 8);


      // 4. Draw game elements
      drawTowers(ctx);
      drawEnemies(ctx);
      drawProjectiles(ctx);
      drawParticles(ctx);
    };

    drawGame(ctx);

    if (isPlaying) {
      animationFrameId = requestAnimationFrame(loop);
    } else {
      drawGame(ctx); 
    }

    return () => cancelAnimationFrame(animationFrameId);
  }, [isPlaying, gameOver, spawnEnemy, castleStats, drawMap]); 

  // --- Input Handling ---

  const handleCanvasClick = (e) => {
    if (gameOver) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const col = Math.floor(x / TILE_SIZE);
    const row = Math.floor(y / TILE_SIZE);

    if (row < 0 || row >= MAP_ROWS || col < 0 || col >= MAP_COLS) return;

    // Check if clicked Castle
    const distToCastle = Math.sqrt(Math.pow(x - BASE_POINT.x, 2) + Math.pow(y - BASE_POINT.y, 2));
    if (distToCastle < 40) {
        setSelectedTowerInstance({ type: 'CASTLE', level: castleStats.level }); // Special type for selection
        setSelectedTowerType(null);
        return;
    }

    // Check towers
    const clickedTower = gameState.current.towers.find(t => 
      Math.floor(t.x / TILE_SIZE) === col && Math.floor(t.y / TILE_SIZE) === row
    );

    if (clickedTower) {
        setSelectedTowerInstance(clickedTower);
        setSelectedTowerType(null);
        return;
    }

    if (selectedTowerType) {
        if (MAP_LAYOUT[row][col] !== 0) return; 
        
        const towerInfo = TOWERS[selectedTowerType];
        if (money >= towerInfo.cost) {
            setMoney(m => m - towerInfo.cost);
            const newTower = {
                id: Date.now() + Math.random(),
                x: col * TILE_SIZE + TILE_SIZE / 2,
                y: row * TILE_SIZE + TILE_SIZE / 2,
                type: selectedTowerType,
                rotation: 0,
                cooldownTimer: 0,
                level: 1,
                damage: towerInfo.damage,
                range: towerInfo.range,
                cooldown: towerInfo.cooldown
            };
            gameState.current.towers.push(newTower);
            setSelectedTowerType(null); 
        }
    } else {
        setSelectedTowerInstance(null);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-900 text-white font-sans p-4">
      
      {/* HUD Header */}
      <div className="w-full max-w-4xl bg-slate-800 rounded-t-xl p-4 flex justify-between items-center border-b border-slate-700">
        <div className="flex gap-8">
          <div className="flex flex-col">
            <span className="text-xs text-slate-400 uppercase tracking-wider">Castle HP</span>
            <div className="flex items-center gap-2">
                <Shield size={20} className="text-blue-500"/>
                <span className="text-2xl font-bold text-blue-400">{Math.round(castleStats.hp)}/{castleStats.maxHp}</span>
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-slate-400 uppercase tracking-wider">Gold</span>
            <span className="text-2xl font-bold text-yellow-400">${money}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-slate-400 uppercase tracking-wider">Wave</span>
            <span className="text-2xl font-bold text-white">{wave}</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
           {gameState.current.nextWaveTimer > 0 && (
               <div className="bg-slate-700 px-4 py-2 rounded text-blue-300 font-bold animate-pulse">
                   Next Wave: {nextWaveCountdown}s
               </div>
           )}
           <button onClick={() => setIsPlaying(!isPlaying)} className="bg-slate-700 hover:bg-slate-600 text-white p-2 rounded-lg">
             {isPlaying ? <Pause size={20} /> : <Play size={20} />}
           </button>
           <button onClick={resetGame} className="bg-slate-700 hover:bg-slate-600 text-white p-2 rounded-lg">
             <RefreshCw size={20} />
           </button>
        </div>
      </div>

      {/* Game Board */}
      <div className="relative shadow-2xl">
        <canvas
          ref={canvasRef}
          width={MAP_COLS * TILE_SIZE}
          height={MAP_ROWS * TILE_SIZE}
          onClick={handleCanvasClick}
          className="cursor-crosshair bg-slate-800"
          style={{ maxWidth: '100%', height: 'auto' }}
        />
        
        {gameOver && (
          <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center animate-in fade-in duration-300 z-50">
            <h2 className="text-5xl font-black text-white mb-4">DEFEAT</h2>
            <p className="text-slate-300 mb-2">The Castle has fallen.</p>
            <p className="text-slate-400 mb-8 text-sm">You reached Wave {wave}</p>
            <button 
              onClick={resetGame}
              className="bg-accent hover:bg-yellow-400 text-black px-8 py-3 rounded-xl font-bold text-lg transition-transform hover:scale-105"
              style={{ backgroundColor: COLORS.accent }}
            >
              Replay for Glory
            </button>
          </div>
        )}
      </div>

      {/* Control Panel */}
      <div className="w-full max-w-4xl min-h-[150px] bg-slate-800 rounded-b-xl p-4 border-t border-slate-700">
        
        {selectedTowerInstance ? (
          // --- UPGRADE MODE (TOWER OR CASTLE) ---
          selectedTowerInstance.type === 'CASTLE' ? (
              // CASTLE UPGRADE UI
              <div className="flex justify-between items-center h-full animate-in slide-in-from-bottom-2 fade-in">
                 <div className="flex items-center gap-4">
                     <div className="p-4 bg-blue-900 rounded-lg border border-blue-500">
                        <Shield size={32} className="text-white"/>
                     </div>
                     <div>
                         <h3 className="text-xl font-bold text-white">The Keep <span className="text-blue-400 text-sm">Lvl {castleStats.level}</span></h3>
                         <div className="text-slate-400 text-sm flex gap-4 mt-1">
                             <span className="flex items-center gap-1"><Shield size={12}/> {castleStats.maxHp} HP</span>
                             <span className="flex items-center gap-1"><Sword size={12}/> {Math.round(castleStats.damage)} Dmg</span>
                         </div>
                     </div>
                 </div>
                 
                 <div className="flex gap-4">
                     <button 
                        onClick={upgradeCastle}
                        disabled={money < castleStats.upgradeCost}
                        className={`px-8 py-3 rounded-lg font-bold flex flex-col items-center min-w-[200px] transition-all
                            ${money >= castleStats.upgradeCost 
                                ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/20' 
                                : 'bg-slate-700 text-slate-500 cursor-not-allowed'}
                        `}
                     >
                         <span className="flex items-center gap-2 text-lg">
                             <ChevronsUp size={20} /> Upgrade Keep
                         </span>
                         <span className="text-xs opacity-80">${castleStats.upgradeCost} (Heals +100)</span>
                     </button>
                     <button onClick={() => setSelectedTowerInstance(null)} className="text-slate-400 hover:text-white px-2">Close</button>
                 </div>
              </div>
          ) : (
              // TOWER UPGRADE UI
              <div className="flex justify-between items-center h-full animate-in slide-in-from-bottom-2 fade-in">
                 <div className="flex items-center gap-4">
                     <div className="p-4 bg-slate-700 rounded-lg">
                        {TOWERS[selectedTowerInstance.type].icon && React.createElement(TOWERS[selectedTowerInstance.type].icon, {size: 32, className: 'text-white'})}
                     </div>
                     <div>
                         <h3 className="text-xl font-bold text-white">{TOWERS[selectedTowerInstance.type].name} <span className="text-yellow-400 text-sm">Lvl {selectedTowerInstance.level}</span></h3>
                         <div className="text-slate-400 text-sm grid grid-cols-2 gap-x-4 mt-1">
                             <span>Dmg: {Math.round(selectedTowerInstance.damage)}</span>
                             <span>Rng: {Math.round(selectedTowerInstance.range)}</span>
                         </div>
                     </div>
                 </div>
                 
                 <div className="flex gap-4">
                     <button onClick={sellTower} className="px-6 py-3 rounded-lg border border-red-500/50 text-red-400 hover:bg-red-500/10 font-bold transition-colors">Sell</button>
                     <button 
                        onClick={upgradeTower}
                        disabled={money < getUpgradeCost(selectedTowerInstance)}
                        className={`px-8 py-3 rounded-lg font-bold flex flex-col items-center min-w-[160px] transition-all
                            ${money >= getUpgradeCost(selectedTowerInstance) 
                                ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/20' 
                                : 'bg-slate-700 text-slate-500 cursor-not-allowed'}
                        `}
                     >
                         <span className="flex items-center gap-2 text-lg"><ChevronsUp size={20} /> Upgrade</span>
                         <span className="text-xs opacity-80">${getUpgradeCost(selectedTowerInstance)} Coins</span>
                     </button>
                     <button onClick={() => setSelectedTowerInstance(null)} className="text-slate-400 hover:text-white px-2">Close</button>
                 </div>
              </div>
          )
        ) : (
          // --- BUILD MODE ---
          <div className="grid grid-cols-3 gap-4 h-full">
            {Object.values(TOWERS).map((tower) => {
              const Icon = tower.icon;
              const isLocked = bossesDefeated < tower.unlocksAt;
              const isSelected = selectedTowerType === tower.id;
              const canAfford = money >= tower.cost;

              return (
                <button
                  key={tower.id}
                  onClick={() => !isLocked && setSelectedTowerType(tower.id)}
                  disabled={isLocked || !canAfford}
                  className={`
                    relative flex items-center gap-4 p-3 rounded-lg border-2 transition-all h-full
                    ${isSelected ? 'border-blue-500 bg-slate-700 scale-[1.02]' : 'border-transparent bg-slate-700/50 hover:bg-slate-700'}
                    ${(isLocked || !canAfford) ? 'opacity-60' : 'cursor-pointer'}
                  `}
                >
                  {isLocked && (
                      <div className="absolute inset-0 bg-slate-900/60 flex flex-col items-center justify-center rounded-lg z-10 backdrop-blur-[1px]">
                          <Lock size={24} className="text-slate-400 mb-1"/>
                          <span className="text-xs font-bold text-slate-300">Defeat {tower.unlocksAt} Bosses</span>
                      </div>
                  )}
                  <div className={`p-3 rounded-md`} style={{ backgroundColor: (!isLocked && canAfford) ? tower.color : '#555' }}>
                     <Icon className={tower.id === 'BASIC' ? 'text-black' : 'text-white'} size={24} />
                  </div>
                  <div className="text-left flex-1">
                    <div className="font-bold text-sm text-white">{tower.name}</div>
                    <div className={`text-xs font-mono ${canAfford ? 'text-yellow-400' : 'text-red-400'}`}>${tower.cost}</div>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
