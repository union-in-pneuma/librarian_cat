// 고양이 마을 테마: 바닥/물/장식/해금 건물 정의와 각 오브젝트 그리기
import { iso, lift, lerp, poly, circle, box, pyramidRoof, onFace, bookRows } from './iso.js';

export const N = 14; // 격자 크기

// 완독 수에 따라 열리는 자리 (모든 테마 공통 위치·크기)
export const SLOTS = [
  { at: 0, i: 6, j: 6, w: 2, d: 2 },
  { at: 1, i: 5, j: 9, w: 1, d: 1 },
  { at: 2, i: 9, j: 5, w: 1, d: 1 },
  { at: 3, i: 9, j: 9, w: 1, d: 1 },
  { at: 5, i: 3, j: 6, w: 1, d: 1 },
  { at: 7, i: 10, j: 2, w: 1, d: 1 },
  { at: 10, i: 2, j: 10, w: 1, d: 2 },
  { at: 15, i: 12, j: 11, w: 1, d: 1 },
];
// 테마별 기본 장식(나무/책장/야자수…) 위치
export const DECOR = [[1, 5], [2, 4], [0, 8], [4, 1], [12, 3], [11, 7], [7, 12], [13, 0], [0, 13], [5, 13], [13, 13]];

export const isPath = (i, j) =>
  i === 7 || j === 7 || (i >= 5 && i <= 9 && j >= 5 && j <= 9 && (i === 5 || i === 9 || j === 5 || j === 9));

const WOOD = { top: '#B07A4F', left: '#8C5A35', right: '#7A4C2B' };
const STONE = { top: '#C9C2B8', left: '#B3ABA0', right: '#9E978C' };

// ---------- 오브젝트 그리기: (ctx, o, t) — o는 {i, j, w, d, p(옵션)} ----------

function canopy(ctx, c, s, blobs) {
  for (const [dx, dy, r, col] of blobs) circle(ctx, c.x + dx * s, c.y + dy * s, r * s, col);
}

const DRAW = {
  // 마을
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
    box(ctx, o.i + 0.15, o.j + 0.35, 0.7, 0.3, 8, WOOD);
  },
  flowers(ctx, o) {
    const cols = o.p?.colors || ['#F28CA0', '#F4C542', '#FFFFFF', '#B58EE0'];
    for (let k = 0; k < 14; k++) {
      const p = iso(o.i + 0.15 + ((k * 37) % 70) / 100, o.j + 0.15 + ((k * 53) % 70) / 100);
      circle(ctx, p.x, p.y - 2, o.p?.r || 3, cols[k % cols.length]);
    }
  },
  fountain(ctx, o, t) {
    const pal = o.p?.pal || { top: '#7EC8E3', left: '#C9C2B8', right: '#B3ABA0' };
    box(ctx, o.i + 0.1, o.j + 0.1, 0.8, 0.8, 10, pal);
    const c = lift(iso(o.i + 0.5, o.j + 0.5), 10);
    ctx.fillStyle = o.p?.spout || '#D9D3CA';
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
    const p = o.p || {};
    const b = box(ctx, o.i, o.j, 1, 1, 30, p.walls || { left: '#FFF3E0', right: '#EADBC2' });
    onFace(ctx, b.base, 'left', 0.35, 0.65, 0, 18, '#8C5A35');
    onFace(ctx, b.base, 'right', 0.3, 0.7, 12, 22, '#9FD3E8');
    pyramidRoof(ctx, b, 24, ...(p.roof || ['#E25B45', '#B8432F']));
  },
  bookshop(ctx, o) {
    const p = o.p || {};
    const b = box(ctx, o.i, o.j, 1, 2, 34, p.walls || { left: '#DDEFE4', right: '#C3DDCD' });
    onFace(ctx, b.base, 'left', 0.1, 0.9, 6, 24, '#F7E7B4');
    onFace(ctx, b.base, 'left', 0.1, 0.9, 24, 30, p.awning || '#5DA67A');
    onFace(ctx, b.base, 'right', 0.4, 0.6, 0, 22, '#7A4E2D');
    bookRows(ctx, b.base, 'left', 2, 7, 8);
    pyramidRoof(ctx, b, 20, ...(p.roof || ['#5DA67A', '#468A63']));
  },
  lighthouse(ctx, o, t) {
    const b = box(ctx, o.i + 0.15, o.j + 0.15, 0.7, 0.7, 70, { left: '#FFFFFF', right: '#E6E6E6' });
    onFace(ctx, b.base, 'left', 0, 1, 20, 32, '#D9534F');
    onFace(ctx, b.base, 'right', 0, 1, 20, 32, '#B8432F');
    onFace(ctx, b.base, 'left', 0, 1, 46, 58, '#D9534F');
    onFace(ctx, b.base, 'right', 0, 1, 46, 58, '#B8432F');
    pyramidRoof(ctx, b, 18, '#3D4E8A', '#2E3B6B');
    const top = lift(iso(o.i + 0.5, o.j + 0.5), 76);
    circle(ctx, top.x, top.y, 7, `rgba(255,230,120,${0.5 + 0.4 * Math.sin(t / 400)})`);
  },
  tree(ctx, o) {
    const s = o.s || 1;
    const c = iso(o.i + 0.5, o.j + 0.5);
    ctx.fillStyle = '#8A5A3B';
    ctx.fillRect(c.x - 3 * s, c.y - 18 * s, 6 * s, 18 * s);
    canopy(ctx, c, s, [[0, -30, 16, '#4F9D5D'], [-8, -38, 12, '#5DB06B'], [7, -42, 11, '#6CC27A']]);
  },

  // 도서관
  shelf(ctx, o) {
    const b = box(ctx, o.i + 0.1, o.j + 0.3, 0.8, 0.4, 50, WOOD);
    bookRows(ctx, b.base, 'left', 4, 4, 11);
  },
  bigShelf(ctx, o) {
    const b = box(ctx, o.i + 0.1, o.j + 0.1, 1.8, 1.8, 58, WOOD);
    bookRows(ctx, b.base, 'left', 4, 6, 12);
    bookRows(ctx, b.base, 'right', 4, 6, 12);
    const c = lift(iso(o.i + 1, o.j + 1), 58);
    ctx.font = '18px serif';
    ctx.textAlign = 'center';
    ctx.fillText('📚', c.x, c.y + 4);
  },
  armchair(ctx, o) {
    const red = { top: '#C8553D', left: '#A23E2C', right: '#8E3424' };
    box(ctx, o.i + 0.2, o.j + 0.2, 0.6, 0.15, 26, red);
    box(ctx, o.i + 0.2, o.j + 0.35, 0.6, 0.45, 11, red);
  },
  plant(ctx, o) {
    box(ctx, o.i + 0.35, o.j + 0.35, 0.3, 0.3, 12, { top: '#6B4A2E', left: '#D9784A', right: '#BF6438' });
    const c = lift(iso(o.i + 0.5, o.j + 0.5), 12);
    canopy(ctx, c, 1, [[-6, -6, 8, '#4F9D5D'], [6, -8, 8, '#5DB06B'], [0, -16, 9, '#6CC27A']]);
  },
  globe(ctx, o) {
    const c = iso(o.i + 0.5, o.j + 0.5);
    ctx.fillStyle = '#7A4C2B';
    ctx.fillRect(c.x - 2, c.y - 18, 4, 18);
    ctx.fillRect(c.x - 9, c.y - 3, 18, 4);
    circle(ctx, c.x, c.y - 30, 13, '#5AA9E6');
    circle(ctx, c.x - 4, c.y - 33, 5, '#6DBE6A');
    circle(ctx, c.x + 5, c.y - 25, 4, '#6DBE6A');
    ctx.strokeStyle = '#C99A1E';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(c.x, c.y - 30, 16, -2.4, 0.9);
    ctx.stroke();
  },
  fireplace(ctx, o, t) {
    const b = box(ctx, o.i + 0.1, o.j + 0.3, 0.8, 0.4, 36, { top: '#8E4E3A', left: '#B5654A', right: '#9A523B' });
    onFace(ctx, b.base, 'left', 0.25, 0.75, 0, 18, '#2B1D17');
    const f = lift(lerp(b.base.D, b.base.C, 0.5), 6);
    const k = Math.sin(t / 120) * 2;
    circle(ctx, f.x, f.y, 7 + k * 0.5, '#F4A259');
    circle(ctx, f.x - 3, f.y - 3, 4 + k * 0.4, '#F7CC4A');
    circle(ctx, f.x + 3, f.y - 5 - k, 3, '#FFF1B8');
  },
  ladderShelf(ctx, o) {
    const b = box(ctx, o.i + 0.1, o.j + 0.1, 0.8, 1.8, 78, WOOD);
    bookRows(ctx, b.base, 'left', 6, 4, 12);
    bookRows(ctx, b.base, 'right', 6, 4, 12);
    const a = lift(lerp(b.base.B, b.base.C, 0.3), 0), z = lift(a, 70);
    ctx.strokeStyle = '#5A3A22';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(a.x + 6, a.y + 4);
    ctx.lineTo(z.x - 2, z.y);
    ctx.stroke();
  },
  clock(ctx, o, t) {
    const b = box(ctx, o.i + 0.3, o.j + 0.3, 0.4, 0.35, 64, WOOD);
    const c = lift(lerp(b.base.D, b.base.C, 0.5), 50);
    circle(ctx, c.x, c.y, 8, '#FFF8E8');
    const a = t / 1000;
    ctx.strokeStyle = '#4A3B35';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(c.x, c.y);
    ctx.lineTo(c.x + Math.cos(a) * 6, c.y + Math.sin(a) * 6);
    ctx.stroke();
    const sw = lift(lerp(b.base.D, b.base.C, 0.5), 22);
    circle(ctx, sw.x + Math.sin(t / 400) * 4, sw.y, 4, '#E3B23C');
  },

  // 바다
  palm(ctx, o, t) {
    const s = o.s || 1;
    const c = iso(o.i + 0.5, o.j + 0.5);
    const sway = Math.sin(t / 900 + o.i) * 2;
    const top = { x: c.x + 10 * s + sway, y: c.y - 52 * s };
    ctx.strokeStyle = '#A67C52';
    ctx.lineWidth = 6 * s;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(c.x, c.y);
    ctx.quadraticCurveTo(c.x - 4 * s, c.y - 30 * s, top.x, top.y);
    ctx.stroke();
    ctx.fillStyle = '#4FA36A';
    for (let k = 0; k < 6; k++) {
      ctx.save();
      ctx.translate(top.x, top.y);
      ctx.rotate((k / 6) * Math.PI * 2 + sway * 0.03);
      ctx.beginPath();
      ctx.ellipse(14 * s, 3 * s, 15 * s, 5 * s, 0.35, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
    circle(ctx, top.x - 3, top.y + 4, 3 * s, '#7A4C2B');
    circle(ctx, top.x + 3, top.y + 5, 3 * s, '#7A4C2B');
  },
  beachHut(ctx, o) {
    const b = box(ctx, o.i + 0.15, o.j + 0.15, 1.7, 1.7, 34, { left: '#F6E7C8', right: '#E6D2AA' });
    onFace(ctx, b.base, 'left', 0.4, 0.6, 0, 22, '#5A8FB0');
    onFace(ctx, b.base, 'right', 0.2, 0.4, 14, 26, '#9FD3E8');
    onFace(ctx, b.base, 'right', 0.6, 0.8, 14, 26, '#9FD3E8');
    pyramidRoof(ctx, b, 30, '#E3C16F', '#C9A54E');
    const sign = lift(lerp(b.base.D, b.base.C, 0.5), 30);
    ctx.font = '15px serif';
    ctx.textAlign = 'center';
    ctx.fillText('📚', sign.x, sign.y);
  },
  parasol(ctx, o) {
    const c = iso(o.i + 0.5, o.j + 0.5);
    ctx.fillStyle = '#EDEDED';
    ctx.fillRect(c.x - 1.5, c.y - 34, 3, 34);
    const cols = ['#E85D75', '#FFFFFF'];
    for (let k = 0; k < 6; k++) {
      const a0 = Math.PI + (k / 6) * Math.PI, a1 = Math.PI + ((k + 1) / 6) * Math.PI;
      poly(ctx, [{ x: c.x, y: c.y - 44 }, { x: c.x + Math.cos(a0) * 24, y: c.y - 34 - Math.sin(a0) * -4 },
        { x: c.x + Math.cos(a1) * 24, y: c.y - 34 - Math.sin(a1) * -4 }], cols[k % 2]);
    }
    box(ctx, o.i + 0.55, o.j + 0.2, 0.3, 0.6, 4, { top: '#5AA9E6', left: '#3D7FB3', right: '#2E6B99' });
  },
  sandcastle(ctx, o) {
    const sand = { top: '#F2D49B', left: '#DDB877', right: '#C9A35F' };
    box(ctx, o.i + 0.2, o.j + 0.2, 0.6, 0.6, 12, sand);
    ctx.save();
    ctx.translate(0, -12);
    box(ctx, o.i + 0.2, o.j + 0.2, 0.2, 0.2, 10, sand);
    box(ctx, o.i + 0.6, o.j + 0.6, 0.2, 0.2, 10, sand);
    box(ctx, o.i + 0.6, o.j + 0.2, 0.2, 0.2, 10, sand);
    ctx.restore();
    const f = lift(iso(o.i + 0.7, o.j + 0.3), 22);
    ctx.fillStyle = '#E85D75';
    ctx.fillRect(f.x, f.y - 14, 1.5, 14);
    poly(ctx, [{ x: f.x + 1.5, y: f.y - 14 }, { x: f.x + 10, y: f.y - 11 }, { x: f.x + 1.5, y: f.y - 8 }], '#E85D75', null);
  },
  boat(ctx, o, t) {
    const c = iso(o.i + 0.5, o.j + 0.5);
    const bob = Math.sin(t / 500) * 1.5;
    poly(ctx, [{ x: c.x - 24, y: c.y - 8 + bob }, { x: c.x + 24, y: c.y - 8 + bob }, { x: c.x + 16, y: c.y + 2 + bob }, { x: c.x - 16, y: c.y + 2 + bob }], '#B5654A');
    ctx.fillStyle = '#7A4C2B';
    ctx.fillRect(c.x - 1.5, c.y - 48 + bob, 3, 40);
    poly(ctx, [{ x: c.x + 2, y: c.y - 46 + bob }, { x: c.x + 22, y: c.y - 12 + bob }, { x: c.x + 2, y: c.y - 12 + bob }], '#FFFFFF');
  },

  // 정글
  jungleTree(ctx, o, t) {
    const s = o.s || 1;
    const c = iso(o.i + 0.5, o.j + 0.5);
    ctx.fillStyle = '#6E4A2C';
    ctx.fillRect(c.x - 4 * s, c.y - 26 * s, 8 * s, 26 * s);
    canopy(ctx, c, s, [[0, -40, 20, '#2F7A43'], [-12, -48, 14, '#3A8F4F'], [11, -52, 13, '#47A35C'], [0, -60, 11, '#56B36A']]);
    ctx.strokeStyle = '#3A8F4F';
    ctx.lineWidth = 1.5;
    for (const dx of [-10, 6]) {
      ctx.beginPath();
      ctx.moveTo(c.x + dx * s, c.y - 32 * s);
      ctx.quadraticCurveTo(c.x + (dx + 3) * s + Math.sin(t / 700 + dx) * 2, c.y - 18 * s, c.x + dx * s, c.y - 10 * s);
      ctx.stroke();
    }
  },
  treehouse(ctx, o) {
    box(ctx, o.i + 0.8, o.j + 0.8, 0.4, 0.4, 40, { top: '#6E4A2C', left: '#7A5333', right: '#654228' });
    const c = iso(o.i + 1, o.j + 1);
    canopy(ctx, c, 1.4, [[0, -58, 22, '#2F7A43'], [-16, -50, 15, '#3A8F4F'], [16, -52, 15, '#47A35C']]);
    ctx.save();
    ctx.translate(0, -40);
    box(ctx, o.i + 0.2, o.j + 0.2, 1.6, 1.6, 4, WOOD);
    ctx.translate(0, -4);
    const b = box(ctx, o.i + 0.5, o.j + 0.5, 1, 1, 24, { left: '#C9A77C', right: '#B08E64' });
    onFace(ctx, b.base, 'left', 0.35, 0.65, 0, 16, '#5A3A22');
    pyramidRoof(ctx, b, 20, '#E3C16F', '#C9A54E');
    ctx.restore();
  },
  mushroom(ctx, o) {
    for (const [dx, dy, s] of [[0, 0, 1], [-0.25, 0.2, 0.6], [0.22, 0.25, 0.5]]) {
      const c = iso(o.i + 0.5 + dx, o.j + 0.5 + dy);
      ctx.fillStyle = '#F6EAD6';
      ctx.fillRect(c.x - 3 * s, c.y - 14 * s, 6 * s, 14 * s);
      ctx.beginPath();
      ctx.ellipse(c.x, c.y - 14 * s, 13 * s, 8 * s, 0, Math.PI, 0);
      ctx.fillStyle = '#D9534F';
      ctx.fill();
      circle(ctx, c.x - 5 * s, c.y - 17 * s, 2 * s, '#fff');
      circle(ctx, c.x + 4 * s, c.y - 19 * s, 1.6 * s, '#fff');
    }
  },
  totem(ctx, o) {
    const cols = [
      { top: '#C8553D', left: '#C8553D', right: '#A23E2C' },
      { top: '#E3B23C', left: '#E3B23C', right: '#C99A1E' },
      { top: '#3D6E8A', left: '#3D6E8A', right: '#2E5A73' },
    ];
    ctx.save();
    cols.forEach((pal) => {
      const b = box(ctx, o.i + 0.3, o.j + 0.3, 0.4, 0.4, 20, pal);
      const e = lift(lerp(b.base.D, b.base.C, 0.5), 12);
      circle(ctx, e.x - 4, e.y, 2, '#222');
      circle(ctx, e.x + 4, e.y, 2, '#222');
      ctx.translate(0, -20);
    });
    ctx.restore();
  },
  ruins(ctx, o) {
    ctx.save();
    [[0, 0, 1, 2], [0.15, 0.2, 0.7, 1.6], [0.3, 0.45, 0.4, 1.1]].forEach(([di, dj, w, d]) => {
      box(ctx, o.i + di, o.j + dj, w, d, 14, STONE);
      ctx.translate(0, -14);
    });
    ctx.restore();
    const c = lift(iso(o.i + 0.5, o.j + 1), 44);
    circle(ctx, c.x, c.y, 4, '#6DBE6A');
  },
};

export function drawObject(ctx, o, t) {
  DRAW[o.type](ctx, o, t);
}

// ---------- 테마 ----------

export const THEMES = {
  village: {
    label: '🏡 마을',
    tiles: { a: '#9ED384', b: '#A8DA8E', path: '#E8D5A9', water: '#8FD0E8', water2: '#A6DBEE', edge: ['#8C6A4A', '#735538'] },
    isWater: (i, j) => i <= 2 && j <= 2 && i + j <= 3,
    decor: 'tree',
    slots: [
      { type: 'library', label: '고양이 도서관' }, { type: 'bench', label: '독서 벤치' }, { type: 'flowers', label: '꽃밭' },
      { type: 'fountain', label: '분수' }, { type: 'tower', label: '캣타워' }, { type: 'house', label: '빨간 지붕 집' },
      { type: 'bookshop', label: '책방' }, { type: 'lighthouse', label: '등대' },
    ],
  },
  library: {
    label: '📚 도서관',
    tiles: { a: '#C89B6D', b: '#BF9163', path: '#A8443A', edge: ['#6B4A2E', '#5A3D25'] },
    isWater: () => false,
    walls: { color: '#E9DCC3', shade: '#DCCDB0', trim: '#8C5A35', window: '#BFE0EE' },
    decor: 'shelf',
    slots: [
      { type: 'bigShelf', label: '중앙 서가' }, { type: 'armchair', label: '안락의자' }, { type: 'plant', label: '화분' },
      { type: 'globe', label: '지구본' }, { type: 'tower', label: '캣타워' }, { type: 'fireplace', label: '벽난로' },
      { type: 'ladderShelf', label: '사다리 서가' }, { type: 'clock', label: '괘종시계' },
    ],
  },
  sea: {
    label: '🌊 바다',
    tiles: { a: '#F2DFA7', b: '#EED79A', path: '#C9A06A', water: '#5DB7DE', water2: '#7FCBEA', edge: ['#C9A35F', '#B08C4C'] },
    isWater: (i, j) => j <= 1 || i >= 13,
    decor: 'palm',
    slots: [
      { type: 'beachHut', label: '해변 오두막 도서관' }, { type: 'parasol', label: '파라솔' }, { type: 'sandcastle', label: '모래성' },
      { type: 'fountain', label: '조개 분수', p: { pal: { top: '#7EC8E3', left: '#F5BFCD', right: '#E08AA2' }, spout: '#F5BFCD' } },
      { type: 'tower', label: '캣타워' }, { type: 'boat', label: '돛단배' },
      { type: 'bookshop', label: '바다 책방', p: { walls: { left: '#DDEBF5', right: '#C3D5E3' }, awning: '#5AA9E6', roof: ['#5AA9E6', '#3D7FB3'] } },
      { type: 'lighthouse', label: '등대' },
    ],
  },
  jungle: {
    label: '🌴 정글',
    tiles: { a: '#5E9E4E', b: '#66A855', path: '#9C7B4F', water: '#4FA3B8', water2: '#68B6C8', edge: ['#5A4128', '#4A3520'] },
    isWater: (i, j) => j === 3 && i !== 7,
    decor: 'jungleTree',
    slots: [
      { type: 'treehouse', label: '나무 위 도서관' }, { type: 'mushroom', label: '버섯' },
      { type: 'flowers', label: '열대 꽃', p: { colors: ['#E85D75', '#F4A259', '#F7CC4A', '#B58EE0'], r: 4 } },
      { type: 'fountain', label: '돌 샘물', p: { pal: { top: '#4FA3B8', left: '#8E9A86', right: '#7A8573' }, spout: '#8E9A86' } },
      { type: 'tower', label: '캣타워' },
      { type: 'house', label: '초가 오두막', p: { walls: { left: '#C9A77C', right: '#B08E64' }, roof: ['#E3C16F', '#C9A54E'] } },
      { type: 'ruins', label: '고대 유적' }, { type: 'totem', label: '토템' },
    ],
  },
};

/** 해금 목록 (UI 표시용): [{ at, label }] */
export const unlocksFor = (themeId) => SLOTS.map((s, k) => ({ at: s.at, label: THEMES[themeId].slots[k].label }));
