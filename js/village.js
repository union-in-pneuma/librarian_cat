// 2.5D 아이소메트릭 고양이 마을 (Canvas 2D)
import { catImage } from './cat.js';
import { REACTION_MS } from './interactions.js';
import { TW, TH, iso, lift, lerp, poly } from './iso.js';
import { N, SLOTS, DECOR, THEMES, isPath, drawObject } from './villageThemes.js';

/**
 * @param {HTMLCanvasElement} canvas
 * @param {Array<{cat, percent, label, bookId}>} residents
 * @param {{ theme: string, finishedCount: number, onCatClick: Function, onHover: Function }} opts
 * @returns {{ select, react, destroy }}
 */
export function createVillage(canvas, residents, { theme: themeId = 'village', finishedCount, onCatClick, onHover }) {
  const ctx = canvas.getContext('2d');
  const theme = THEMES[themeId] || THEMES.village;
  const isWater = theme.isWater;
  const objects = SLOTS.map((s, k) => ({ ...s, ...theme.slots[k] })).filter((o) => finishedCount >= o.at);
  DECOR.filter(([i, j]) => !isWater(i, j)).forEach(([i, j], k) =>
    objects.push({ type: theme.decor, i, j, w: 1, d: 1, s: 0.8 + (k % 3) * 0.15 }));

  const blocked = new Set();
  for (const o of objects) for (let a = 0; a < o.w; a++) for (let b = 0; b < o.d; b++) blocked.add(`${o.i + a},${o.j + b}`);
  const walkable = (i, j) => i >= 0 && j >= 0 && i < N && j < N && !isWater(i, j) && !blocked.has(`${i},${j}`);
  const freeTiles = [];
  for (let i = 0; i < N; i++) for (let j = 0; j < N; j++) if (walkable(i, j)) freeTiles.push([i, j]);
  const randTile = () => freeTiles[Math.floor(Math.random() * freeTiles.length)];

  const cats = residents.map((r) => {
    const [i, j] = randTile();
    const adult = r.percent >= 100;
    const img = catImage(r.cat, { crown: adult, mood: adult ? 'normal' : 'happy' });
    return {
      ...r,
      adult, img, baseImg: img, fx: [], anim: null, bubble: null, timer: 0,
      size: adult ? 62 : 40,
      i: i + 0.5, j: j + 0.5, tx: i + 0.5, ty: j + 0.5,
      wait: Math.random() * 2000, flip: false, phase: Math.random() * 6,
    };
  });

  let view = { scale: 1, ox: 0, oy: 0 };
  let hovered = null;
  let selected = null;
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

  function drawGround(t) {
    const g = theme.tiles;
    for (let i = 0; i < N; i++) for (let j = 0; j < N; j++) {
      const p = iso(i, j);
      const pts = [p, { x: p.x + TW / 2, y: p.y + TH / 2 }, { x: p.x, y: p.y + TH }, { x: p.x - TW / 2, y: p.y + TH / 2 }];
      const fill = isWater(i, j)
        ? (Math.sin(t / 700 + i * 0.8 + j * 0.5) > 0.6 ? g.water2 : g.water)
        : isPath(i, j) ? g.path : (i + j) % 2 ? g.a : g.b;
      poly(ctx, pts, fill, 'rgba(255,255,255,.18)');
    }
    // 땅 두께
    const L = iso(0, N), Bt = iso(N, N), R = iso(N, 0);
    poly(ctx, [L, Bt, lift(Bt, -14), lift(L, -14)], g.edge[0], null);
    poly(ctx, [Bt, R, lift(R, -14), lift(Bt, -14)], g.edge[1], null);
    if (theme.walls) drawWalls(theme.walls);
  }

  // 실내 테마: 뒤쪽 두 벽과 아치 창문
  function drawWalls(w) {
    const H = 70;
    const O = iso(0, 0);
    for (const [end, color] of [[iso(N, 0), w.color], [iso(0, N), w.shade]]) {
      poly(ctx, [O, end, lift(end, H), lift(O, H)], color);
      poly(ctx, [lift(O, H), lift(end, H), lift(end, H + 6), lift(O, H + 6)], w.trim, null);
      for (let k = 1; k < 4; k++) {
        const c = lerp(O, end, k / 4);
        const a = lerp(O, end, k / 4 - 0.05), b = lerp(O, end, k / 4 + 0.05);
        poly(ctx, [lift(a, 22), lift(b, 22), lift(b, 50), lift(a, 50)], w.window);
        ctx.beginPath();
        ctx.ellipse(c.x, c.y - 50, Math.abs(b.x - a.x) / 2, 7, 0, Math.PI, 0);
        ctx.fillStyle = w.window;
        ctx.fill();
      }
    }
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
    drawGround(t);

    const drawables = [
      ...objects.map((o) => ({ depth: o.i + o.w + o.j + o.d - 1, draw: () => drawObject(ctx, o, t) })),
      ...cats.map((c) => ({ depth: c.i + c.j, draw: () => drawCat(c, t) })),
    ].sort((a, b) => a.depth - b.depth);
    drawables.forEach((d) => d.draw());
    cats.forEach((c) => drawOverlay(c, t));
  }

  // 상호작용 중 애니메이션: 화면 오프셋/회전/세로 스케일
  function animPose(c, t) {
    if (!c.anim) return { oy: 0, rot: 0, sy: 1 };
    const e = (t - c.anim.t0) / 1000;
    switch (c.anim.type) {
      case 'jump': return { oy: -Math.abs(Math.sin((e * Math.PI) / 0.55)) * c.size * 0.5, rot: 0, sy: 1 };
      case 'purr': return { oy: 0, rot: Math.sin(e * 25) * 0.05, sy: 1 };
      case 'eat': return { oy: 0, rot: 0, sy: 1 - Math.abs(Math.sin(e * 10)) * 0.07 };
      case 'nod': return { oy: 0, rot: Math.sin(e * 12) * 0.07, sy: 1 };
      default: return { oy: 0, rot: 0, sy: 1 };
    }
  }

  function drawCat(c, t) {
    const b = catBounds(c, t);
    const p = iso(c.i, c.j);
    if (c === selected) {
      ctx.strokeStyle = '#E8915A';
      ctx.lineWidth = 2.5;
      ctx.setLineDash([5, 4]);
      ctx.beginPath();
      ctx.ellipse(p.x, p.y, c.size * 0.45, c.size * 0.18, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);
    }
    ctx.fillStyle = 'rgba(0,0,0,.15)';
    ctx.beginPath();
    ctx.ellipse(p.x, p.y, c.size * 0.32, c.size * 0.12, 0, 0, Math.PI * 2);
    ctx.fill();
    if (c.img.complete) {
      const { oy, rot, sy } = animPose(c, t);
      ctx.save();
      ctx.translate(p.x, p.y + oy);
      ctx.rotate(rot);
      ctx.scale(c.flip ? -1 : 1, sy);
      ctx.drawImage(c.img, -b.w / 2, b.y - p.y, b.w, b.h);
      ctx.restore();
    }
  }

  // 말풍선·이펙트·이름표는 건물에 가리지 않도록 마지막에 그림
  function drawOverlay(c, t) {
    const b = catBounds(c, t);
    const p = iso(c.i, c.j);
    const top = b.y + animPose(c, t).oy;

    c.fx = c.fx.filter((f) => t - f.t0 < 1600);
    ctx.font = '16px serif';
    ctx.textAlign = 'center';
    for (const f of c.fx) {
      const age = (t - f.t0) / 1600;
      if (age < 0) continue;
      ctx.globalAlpha = 1 - age;
      ctx.fillText(f.ch, p.x + f.dx, top - age * 60);
    }
    ctx.globalAlpha = 1;

    if (c.bubble && t < c.bubble.until) {
      drawBubble(c.bubble.text, p.x, top - 6);
    } else if (c === hovered || c === selected) {
      ctx.font = 'bold 11px sans-serif';
      const w = ctx.measureText(c.label).width + 12;
      ctx.fillStyle = 'rgba(255,255,255,.92)';
      ctx.fillRect(p.x - w / 2, top - 20, w, 16);
      ctx.fillStyle = '#4A3B35';
      ctx.fillText(c.label, p.x, top - 8);
    }
  }

  function drawBubble(text, x, bottom) {
    ctx.font = '12px sans-serif';
    const maxW = 170;
    const lines = [];
    let cur = '';
    for (const ch of text) {
      if (ctx.measureText(cur + ch).width > maxW) { lines.push(cur); cur = ch; } else cur += ch;
    }
    lines.push(cur);
    const w = Math.max(...lines.map((l) => ctx.measureText(l).width)) + 16;
    const h = lines.length * 15 + 10;
    const y = bottom - h - 8;
    ctx.fillStyle = '#fff';
    ctx.strokeStyle = '#4A3B35';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(x - w / 2, y, w, h, 8);
    ctx.moveTo(x - 5, y + h);
    ctx.lineTo(x, y + h + 7);
    ctx.lineTo(x + 5, y + h);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#4A3B35';
    ctx.textAlign = 'center';
    lines.forEach((l, k) => ctx.fillText(l, x, y + 17 + k * 15));
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
  const onClick = (ev) => onCatClick?.(catAt(ev));

  resize();
  window.addEventListener('resize', resize);
  canvas.addEventListener('mousemove', onMove);
  canvas.addEventListener('click', onClick);
  raf = requestAnimationFrame(frame);

  const byBook = (bookId) => cats.find((c) => c.bookId === bookId) || null;

  return {
    select(bookId) { selected = bookId ? byBook(bookId) : null; },

    /** 상호작용: 걷기를 멈추고 표정·동작·이펙트·말풍선으로 반응 */
    react(bookId, it, text, ms) {
      const c = byBook(bookId);
      if (!c) return;
      const now = performance.now();
      c.tx = c.i; c.ty = c.j;
      c.wait = Math.max(c.wait, ms + 500);
      c.img = catImage(c.cat, { crown: c.adult, mood: it.mood });
      c.anim = { type: it.anim, t0: now };
      c.bubble = { text, until: now + ms };
      for (let k = 0; k < 5; k++) c.fx.push({ ch: it.fx, t0: now + k * 120, dx: (Math.random() - 0.5) * c.size });
      clearTimeout(c.timer);
      c.timer = setTimeout(() => { c.img = c.baseImg; c.anim = null; }, REACTION_MS);
    },

    destroy,
  };

  function destroy() {
    cats.forEach((c) => clearTimeout(c.timer));
    cancelAnimationFrame(raf);
    window.removeEventListener('resize', resize);
    canvas.removeEventListener('mousemove', onMove);
    canvas.removeEventListener('click', onClick);
  }
}
