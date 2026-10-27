// 2.5D 아이소메트릭 고양이 마을 (Canvas 2D)
import { catImage } from './cat.js';

const TW = 64; // 타일 가로
const TH = 32; // 타일 세로

// 다 읽은 책 수에 따라 마을에 생기는 건물/장식
export const UNLOCKS = [
  { at: 0, id: 'library', label: '고양이 도서관' },
  { at: 1, id: 'bench', label: '독서 벤치' },
  { at: 2, id: 'flowers', label: '꽃밭' },
  { at: 3, id: 'fountain', label: '분수' },
  { at: 5, id: 'tower', label: '캣타워' },
  { at: 7, id: 'house', label: '빨간 지붕 집' },
  { at: 10, id: 'bookshop', label: '책방' },
  { at: 15, id: 'lighthouse', label: '등대' },
];

const iso = (i, j) => ({ x: ((i - j) * TW) / 2, y: ((i + j) * TH) / 2 });
const lift = (p, h) => ({ x: p.x, y: p.y - h });
const lerp = (a, b, t) => ({ x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t });

function poly(ctx, pts, fill, stroke = 'rgba(60,40,30,.35)') {
  ctx.beginPath();
  pts.forEach((p, k) => (k ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y)));
  ctx.closePath();
  ctx.fillStyle = fill;
  ctx.fill();
  if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = 1; ctx.stroke(); }
}

// 직육면체: 바닥 (i,j)~(i+w,j+d), 높이 h. 반환값은 지붕/장식용 꼭짓점.
function box(ctx, i, j, w, d, h, { top, left, right }) {
  const A = iso(i, j), B = iso(i + w, j), C = iso(i + w, j + d), D = iso(i, j + d);
  poly(ctx, [D, C, lift(C, h), lift(D, h)], left);
  poly(ctx, [B, C, lift(C, h), lift(B, h)], right);
  if (top) poly(ctx, [A, B, C, D].map((p) => lift(p, h)), top);
  return { A: lift(A, h), B: lift(B, h), C: lift(C, h), D: lift(D, h), base: { A, B, C, D } };
}

function pyramidRoof(ctx, { A, B, C, D }, rh, light, dark) {
  const apex = lift(lerp(A, C, 0.5), rh);
  poly(ctx, [A, B, apex], dark);
  poly(ctx, [A, D, apex], light);
  poly(ctx, [D, C, apex], light);
  poly(ctx, [B, C, apex], dark);
}

// 벽면 위 사각형 (문/창문). face: 'left'(D→C) | 'right'(B→C)
function onFace(ctx, base, face, t0, t1, z0, z1, fill) {
  const [P, Q] = face === 'left' ? [base.D, base.C] : [base.B, base.C];
  const a = lerp(P, Q, t0), b = lerp(P, Q, t1);
  poly(ctx, [lift(a, z0), lift(b, z0), lift(b, z1), lift(a, z1)], fill);
}

function tree(ctx, i, j, s = 1) {
  const c = iso(i + 0.5, j + 0.5);
  ctx.fillStyle = '#8A5A3B';
  ctx.fillRect(c.x - 3 * s, c.y - 18 * s, 6 * s, 18 * s);
  for (const [dx, dy, r, col] of [[0, -30, 16, '#4F9D5D'], [-8, -38, 12, '#5DB06B'], [7, -42, 11, '#6CC27A']]) {
    ctx.beginPath();
    ctx.arc(c.x + dx * s, c.y + dy * s, r * s, 0, Math.PI * 2);
    ctx.fillStyle = col;
    ctx.fill();
  }
}

const OBJECT_DRAW = {
  library(ctx, o) {
    const b = box(ctx, o.i, o.j, 2, 2, 46, { left: '#F3E3C3', right: '#E2CCA4' });
    onFace(ctx, b.base, 'left', 0.38, 0.62, 0, 26, '#7A4E2D');
    onFace(ctx, b.base, 'left', 0.08, 0.26, 18, 34, '#9FD3E8');
    onFace(ctx, b.base, 'left', 0.74, 0.92, 18, 34, '#9FD3E8');
    onFace(ctx, b.base, 'right', 0.2, 0.45, 18, 34, '#9FD3E8');
    onFace(ctx, b.base, 'right', 0.55, 0.8, 18, 34, '#9FD3E8');
    pyramidRoof(ctx, b, 38, '#C8553D', '#A23E2C');
    const sign = lift(lerp(b.base.D, b.base.C, 0.5), 40);
    ctx.font = '16px serif';
    ctx.textAlign = 'center';
    ctx.fillText('📚', sign.x, sign.y);
  },
  bench(ctx, o) {
    box(ctx, o.i + 0.15, o.j + 0.35, 0.7, 0.3, 8, { top: '#B07A4F', left: '#8C5A35', right: '#7A4C2B' });
  },
  flowers(ctx, o) {
    const cols = ['#F28CA0', '#F4C542', '#FFFFFF', '#B58EE0'];
    for (let k = 0; k < 14; k++) {
      const p = iso(o.i + 0.15 + ((k * 37) % 70) / 100, o.j + 0.15 + ((k * 53) % 70) / 100);
      ctx.beginPath();
      ctx.arc(p.x, p.y - 2, 3, 0, Math.PI * 2);
      ctx.fillStyle = cols[k % cols.length];
      ctx.fill();
    }
  },
  fountain(ctx, o, t) {
    box(ctx, o.i + 0.1, o.j + 0.1, 0.8, 0.8, 10, { top: '#7EC8E3', left: '#C9C2B8', right: '#B3ABA0' });
    const c = lift(iso(o.i + 0.5, o.j + 0.5), 10);
    ctx.fillStyle = '#D9D3CA';
    ctx.fillRect(c.x - 3, c.y - 18, 6, 18);
    ctx.fillStyle = 'rgba(160,220,245,.9)';
    for (let k = 0; k < 6; k++) {
      const a = (k / 6) * Math.PI * 2;
      const phase = (t / 600 + k / 6) % 1;
      ctx.beginPath();
      ctx.arc(c.x + Math.cos(a) * 14 * phase, c.y - 18 + 26 * phase * phase - 10 * phase, 2, 0, Math.PI * 2);
      ctx.fill();
    }
  },
  tower(ctx, o) {
    const pal = { top: '#E9D7B9', left: '#C9A77C', right: '#B08E64' };
    box(ctx, o.i + 0.2, o.j + 0.2, 0.6, 0.6, 18, pal);
    const c = iso(o.i + 0.5, o.j + 0.5);
    ctx.fillStyle = '#C9A77C';
    ctx.fillRect(c.x - 3, c.y - 52, 6, 34);
    ctx.save();
    ctx.translate(0, -52);
    box(ctx, o.i + 0.25, o.j + 0.25, 0.5, 0.5, 6, pal);
    ctx.restore();
  },
  house(ctx, o) {
    const b = box(ctx, o.i, o.j, 1, 1, 30, { left: '#FFF3E0', right: '#EADBC2' });
    onFace(ctx, b.base, 'left', 0.35, 0.65, 0, 18, '#8C5A35');
    onFace(ctx, b.base, 'right', 0.3, 0.7, 12, 22, '#9FD3E8');
    pyramidRoof(ctx, b, 24, '#E25B45', '#B8432F');
  },
  bookshop(ctx, o) {
    const b = box(ctx, o.i, o.j, 1, 2, 34, { left: '#DDEFE4', right: '#C3DDCD' });
    onFace(ctx, b.base, 'left', 0.1, 0.9, 6, 24, '#F7E7B4');
    onFace(ctx, b.base, 'left', 0.1, 0.9, 24, 30, '#5DA67A');
    onFace(ctx, b.base, 'right', 0.4, 0.6, 0, 22, '#7A4E2D');
    pyramidRoof(ctx, b, 20, '#5DA67A', '#468A63');
  },
  lighthouse(ctx, o, t) {
    const b = box(ctx, o.i + 0.15, o.j + 0.15, 0.7, 0.7, 70, { left: '#FFFFFF', right: '#E6E6E6' });
    onFace(ctx, b.base, 'left', 0, 1, 20, 32, '#D9534F');
    onFace(ctx, b.base, 'right', 0, 1, 20, 32, '#B8432F');
    onFace(ctx, b.base, 'left', 0, 1, 46, 58, '#D9534F');
    onFace(ctx, b.base, 'right', 0, 1, 46, 58, '#B8432F');
    pyramidRoof(ctx, b, 18, '#3D4E8A', '#2E3B6B');
    const top = lift(iso(o.i + 0.5, o.j + 0.5), 76);
    ctx.fillStyle = `rgba(255,230,120,${0.5 + 0.4 * Math.sin(t / 400)})`;
    ctx.beginPath();
    ctx.arc(top.x, top.y, 7, 0, Math.PI * 2);
    ctx.fill();
  },
  tree(ctx, o) { tree(ctx, o.i, o.j, o.s || 1); },
};

// 고정 배치 (N=14 격자 기준)
const N = 14;
const LAYOUT = {
  library: { i: 6, j: 6, w: 2, d: 2 },
  bench: { i: 5, j: 9, w: 1, d: 1 },
  flowers: { i: 9, j: 5, w: 1, d: 1 },
  fountain: { i: 9, j: 9, w: 1, d: 1 },
  tower: { i: 3, j: 6, w: 1, d: 1 },
  house: { i: 10, j: 2, w: 1, d: 1 },
  bookshop: { i: 2, j: 10, w: 1, d: 2 },
  lighthouse: { i: 12, j: 11, w: 1, d: 1 },
};
const TREES = [[1, 5], [2, 4], [0, 8], [4, 1], [12, 3], [11, 7], [7, 12], [13, 0], [0, 13], [5, 13], [13, 13]];
const isPath = (i, j) => i === 7 || j === 7 || (i >= 5 && i <= 9 && j >= 5 && j <= 9 && (i === 5 || i === 9 || j === 5 || j === 9));
const isWater = (i, j) => i <= 2 && j <= 2 && i + j <= 3;

/**
 * @param {HTMLCanvasElement} canvas
 * @param {Array<{cat, percent, label, bookId}>} residents
 * @param {{ finishedCount: number, onCatClick: Function, onHover: Function }} opts
 * @returns {() => void} 정리 함수
 */
export function createVillage(canvas, residents, { finishedCount, onCatClick, onHover }) {
  const ctx = canvas.getContext('2d');
  const objects = UNLOCKS.filter((u) => finishedCount >= u.at).map((u) => ({ type: u.id, ...LAYOUT[u.id] }));
  TREES.forEach(([i, j], k) => objects.push({ type: 'tree', i, j, w: 1, d: 1, s: 0.8 + (k % 3) * 0.15 }));

  const blocked = new Set();
  for (const o of objects) for (let a = 0; a < o.w; a++) for (let b = 0; b < o.d; b++) blocked.add(`${o.i + a},${o.j + b}`);
  const walkable = (i, j) => i >= 0 && j >= 0 && i < N && j < N && !isWater(i, j) && !blocked.has(`${i},${j}`);
  const freeTiles = [];
  for (let i = 0; i < N; i++) for (let j = 0; j < N; j++) if (walkable(i, j)) freeTiles.push([i, j]);
  const randTile = () => freeTiles[Math.floor(Math.random() * freeTiles.length)];

  const cats = residents.map((r) => {
    const [i, j] = randTile();
    const adult = r.percent >= 100;
    return {
      ...r,
      img: catImage(r.cat, { crown: adult, mood: adult ? 'normal' : 'happy' }),
      size: adult ? 62 : 40,
      i: i + 0.5, j: j + 0.5, tx: i + 0.5, ty: j + 0.5,
      wait: Math.random() * 2000, flip: false, phase: Math.random() * 6,
    };
  });

  let view = { scale: 1, ox: 0, oy: 0 };
  let hovered = null;
  let raf = 0;
  let last = performance.now();

  function resize() {
    const dpr = window.devicePixelRatio || 1;
    const { width, height } = canvas.getBoundingClientRect();
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    const worldW = N * TW + 40;
    const worldH = N * TH + 140;
    const scale = Math.min(width / worldW, height / worldH);
    view = { scale: scale * dpr, ox: (width * dpr) / 2, oy: (height * dpr - N * TH * scale * dpr) / 2 + 60 * scale * dpr };
  }

  function update(dt) {
    for (const c of cats) {
      const dx = c.tx - c.i, dy = c.ty - c.j;
      const dist = Math.hypot(dx, dy);
      if (dist < 0.05) {
        c.wait -= dt;
        if (c.wait <= 0) {
          const [i, j] = randTile();
          c.tx = i + 0.5; c.ty = j + 0.5;
          c.wait = 1500 + Math.random() * 4000;
        }
        continue;
      }
      const step = Math.min(dist, (dt / 1000) * (c.size > 50 ? 0.7 : 1));
      const ni = c.i + (dx / dist) * step, nj = c.j + (dy / dist) * step;
      if (!walkable(Math.floor(ni), Math.floor(nj))) { c.tx = c.i; c.ty = c.j; continue; }
      c.i = ni; c.j = nj;
      c.flip = dx - dy < 0; // 화면 왼쪽으로 이동하면 좌우 반전
    }
  }

  function drawGround() {
    for (let i = 0; i < N; i++) for (let j = 0; j < N; j++) {
      const p = iso(i, j);
      const pts = [p, { x: p.x + TW / 2, y: p.y + TH / 2 }, { x: p.x, y: p.y + TH }, { x: p.x - TW / 2, y: p.y + TH / 2 }];
      const fill = isWater(i, j) ? '#8FD0E8' : isPath(i, j) ? '#E8D5A9' : (i + j) % 2 ? '#9ED384' : '#A8DA8E';
      poly(ctx, pts, fill, 'rgba(255,255,255,.18)');
    }
    // 땅 두께
    const L = iso(0, N), Bt = iso(N, N), R = iso(N, 0);
    poly(ctx, [L, Bt, lift(Bt, -14), lift(L, -14)], '#8C6A4A', null);
    poly(ctx, [Bt, R, lift(R, -14), lift(Bt, -14)], '#735538', null);
  }

  function catBounds(c, t) {
    const p = iso(c.i, c.j);
    const bob = Math.abs(Math.sin(t / 180 + c.phase)) * (Math.hypot(c.tx - c.i, c.ty - c.j) > 0.05 ? 3 : 0);
    return { x: p.x - c.size / 2, y: p.y - c.size - bob + 4, w: c.size, h: c.size };
  }

  function draw(t) {
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.setTransform(view.scale, 0, 0, view.scale, view.ox, view.oy);
    drawGround();

    const drawables = [
      ...objects.map((o) => ({ depth: o.i + o.w + o.j + o.d - 1, draw: () => OBJECT_DRAW[o.type](ctx, o, t) })),
      ...cats.map((c) => ({ depth: c.i + c.j, draw: () => drawCat(c, t) })),
    ].sort((a, b) => a.depth - b.depth);
    drawables.forEach((d) => d.draw());
  }

  function drawCat(c, t) {
    const b = catBounds(c, t);
    const p = iso(c.i, c.j);
    ctx.fillStyle = 'rgba(0,0,0,.15)';
    ctx.beginPath();
    ctx.ellipse(p.x, p.y, c.size * 0.32, c.size * 0.12, 0, 0, Math.PI * 2);
    ctx.fill();
    if (c.img.complete) {
      ctx.save();
      if (c.flip) { ctx.translate(p.x * 2, 0); ctx.scale(-1, 1); }
      ctx.drawImage(c.img, b.x, b.y, b.w, b.h);
      ctx.restore();
    }
    if (c === hovered) {
      ctx.font = 'bold 11px sans-serif';
      ctx.textAlign = 'center';
      const w = ctx.measureText(c.label).width + 12;
      ctx.fillStyle = 'rgba(255,255,255,.92)';
      ctx.fillRect(p.x - w / 2, b.y - 20, w, 16);
      ctx.fillStyle = '#4A3B35';
      ctx.fillText(c.label, p.x, b.y - 8);
    }
  }

  function frame(t) {
    update(Math.min(100, t - last));
    last = t;
    draw(t);
    raf = requestAnimationFrame(frame);
  }

  function catAt(ev) {
    const r = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    const x = ((ev.clientX - r.left) * dpr - view.ox) / view.scale;
    const y = ((ev.clientY - r.top) * dpr - view.oy) / view.scale;
    const t = performance.now();
    return [...cats].sort((a, b) => b.i + b.j - (a.i + a.j))
      .find((c) => { const b = catBounds(c, t); return x >= b.x && x <= b.x + b.w && y >= b.y && y <= b.y + b.h; }) || null;
  }

  const onMove = (ev) => {
    hovered = catAt(ev);
    canvas.style.cursor = hovered ? 'pointer' : 'default';
    onHover?.(hovered);
  };
  const onClick = (ev) => { const c = catAt(ev); if (c) onCatClick?.(c); };

  resize();
  window.addEventListener('resize', resize);
  canvas.addEventListener('mousemove', onMove);
  canvas.addEventListener('click', onClick);
  raf = requestAnimationFrame(frame);

  return () => {
    cancelAnimationFrame(raf);
    window.removeEventListener('resize', resize);
    canvas.removeEventListener('mousemove', onMove);
    canvas.removeEventListener('click', onClick);
  };
}
