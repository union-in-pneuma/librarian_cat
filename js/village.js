// 2.5D 아이소메트릭 고양이 마을 (Canvas 2D)
// 집사들은 마을을 돌아다니고, 고양이는 자기 책을 가장 많이 읽은 집사의 발자취를 따라다닙니다.
// 아직 읽은 집사가 없는 고양이는 혼자 자유롭게 돌아다닙니다.
import { catImage } from './cat.js';
import { butlerImage } from './butler.js';
import { REACTION_MS } from './interactions.js';
import { TW, TH, iso, lift, lerp, poly } from './iso.js';
import { N, SLOTS, DECOR, THEMES, isPath, drawObject } from './villageThemes.js';

const TRAIL_STEP = 0.05; // 발자취 기록 간격(타일)
const FOLLOW_GAP = 11; // 고양이 사이 간격(발자취 점 개수) ≈ 0.55타일

/**
 * @param {HTMLCanvasElement} canvas
 * @param {object} opts
 * @param {Array<{uid, name, look, isMe}>} opts.butlers
 * @param {Array<{bookId, cat, percent, label, ownerUid?}>} opts.residents
 * @param {string} opts.theme
 * @param {number} opts.finishedCount
 * @param {(entity: object|null) => void} opts.onSelect 고양이/집사 클릭 (빈 곳이면 null)
 * @returns {{ select, react, destroy }}
 */
export function createVillage(canvas, { butlers, residents, theme: themeId = 'village', finishedCount, onSelect }) {
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

  const people = butlers.map((b) => {
    const [i, j] = randTile();
    return {
      ...b, kind: 'butler', img: butlerImage(b.look), w: 40, h: 56,
      i: i + 0.5, j: j + 0.5, tx: i + 0.5, ty: j + 0.5, trail: [{ i: i + 0.5, j: j + 0.5 }],
      wait: Math.random() * 2000, flip: false, phase: Math.random() * 6, moving: false,
    };
  });
  const byUid = Object.fromEntries(people.map((p) => [p.uid, p]));

  const followCount = {};
  const cats = residents.map((r) => {
    const owner = byUid[r.ownerUid] || null;
    const order = owner ? (followCount[r.ownerUid] = (followCount[r.ownerUid] ?? -1) + 1) : 0;
    const crown = r.percent >= 100;
    const img = catImage(r.cat, { crown, mood: 'normal' });
    const [si, sj] = owner ? [owner.i + 0.3 * (order + 1), owner.j + 0.2] : randTile().map((v) => v + 0.5);
    return {
      ...r, kind: 'cat', owner, order, crown, img, baseImg: img, w: 42, h: 42,
      i: si, j: sj, tx: si, ty: sj, wait: Math.random() * 3000, flip: false, phase: Math.random() * 6, moving: false,
      offset: { i: ((order % 3) - 1) * 0.18, j: (order % 2 ? 0.15 : -0.15) },
      fx: [], anim: null, bubble: null, timer: 0, pauseUntil: 0,
    };
  });
  const entities = [...people, ...cats];

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

  // ---------- 이동 ----------

  function stepToward(e, tx, ty, speed, dt) {
    const dx = tx - e.i, dy = ty - e.j;
    const dist = Math.hypot(dx, dy);
    const step = Math.min(dist, (dt / 1000) * speed);
    e.i += (dx / dist) * step;
    e.j += (dy / dist) * step;
    e.flip = dx - dy < 0; // 화면 왼쪽으로 이동하면 좌우 반전
  }

  function updateButler(b, dt) {
    const dist = Math.hypot(b.tx - b.i, b.ty - b.j);
    b.moving = dist >= 0.05;
    if (!b.moving) {
      b.wait -= dt;
      if (b.wait <= 0) {
        const [i, j] = randTile();
        b.tx = i + 0.5; b.ty = j + 0.5;
        b.wait = 2000 + Math.random() * 4000;
      }
      return;
    }
    const pi = b.i, pj = b.j;
    stepToward(b, b.tx, b.ty, 0.8, dt);
    if (!walkable(Math.floor(b.i), Math.floor(b.j))) {
      b.i = pi; b.j = pj; b.tx = pi; b.ty = pj;
      return;
    }
    const tail = b.trail[b.trail.length - 1];
    if (Math.hypot(b.i - tail.i, b.j - tail.j) >= TRAIL_STEP) {
      b.trail.push({ i: b.i, j: b.j });
      if (b.trail.length > 300) b.trail.shift();
    }
  }

  // 주인 없는 고양이: 목적지를 골라 천천히 산책
  function wanderCat(c, dt) {
    const dist = Math.hypot(c.tx - c.i, c.ty - c.j);
    if (dist < 0.05) {
      c.wait -= dt;
      if (c.wait <= 0) {
        const [i, j] = randTile();
        c.tx = i + 0.5; c.ty = j + 0.5;
        c.wait = 2500 + Math.random() * 5000;
      }
      return;
    }
    const pi = c.i, pj = c.j;
    stepToward(c, c.tx, c.ty, 0.6, dt);
    if (!walkable(Math.floor(c.i), Math.floor(c.j))) { c.i = pi; c.j = pj; c.tx = pi; c.ty = pj; return; }
    c.moving = true;
  }

  function updateCat(c, dt, now) {
    c.moving = false;
    if (now < c.pauseUntil) return;
    if (!c.owner) return wanderCat(c, dt);
    const trail = c.owner.trail;
    const idx = trail.length - 1 - (c.order + 1) * FOLLOW_GAP;
    const p = trail[Math.max(0, idx)];
    const tx = p.i + c.offset.i, ty = p.j + c.offset.j;
    const dist = Math.hypot(tx - c.i, ty - c.j);
    if (dist < 0.08) return;
    c.moving = true;
    stepToward(c, tx, ty, Math.max(1, dist * 1.8), dt);
  }

  function update(dt) {
    const now = performance.now();
    people.forEach((b) => updateButler(b, dt));
    cats.forEach((c) => updateCat(c, dt, now));
  }

  // ---------- 그리기 ----------

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

  function bounds(e, t) {
    const p = iso(e.i, e.j);
    const bob = e.moving ? Math.abs(Math.sin(t / 160 + e.phase)) * 3 : 0;
    return { x: p.x - e.w / 2, y: p.y - e.h - bob + 4, w: e.w, h: e.h };
  }

  // 상호작용 중 애니메이션: 화면 오프셋/회전/세로 스케일
  function animPose(e, t) {
    if (!e.anim) return { oy: 0, rot: 0, sy: 1 };
    const s = (t - e.anim.t0) / 1000;
    switch (e.anim.type) {
      case 'jump': return { oy: -Math.abs(Math.sin((s * Math.PI) / 0.55)) * e.h * 0.5, rot: 0, sy: 1 };
      case 'purr': return { oy: 0, rot: Math.sin(s * 25) * 0.05, sy: 1 };
      case 'eat': return { oy: 0, rot: 0, sy: 1 - Math.abs(Math.sin(s * 10)) * 0.07 };
      case 'nod': return { oy: 0, rot: Math.sin(s * 12) * 0.07, sy: 1 };
      default: return { oy: 0, rot: 0, sy: 1 };
    }
  }

  function drawEntity(e, t) {
    const b = bounds(e, t);
    const p = iso(e.i, e.j);
    if (e === selected) {
      ctx.strokeStyle = '#E8915A';
      ctx.lineWidth = 2.5;
      ctx.setLineDash([5, 4]);
      ctx.beginPath();
      ctx.ellipse(p.x, p.y, e.w * 0.55, e.w * 0.22, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);
    }
    ctx.fillStyle = 'rgba(0,0,0,.15)';
    ctx.beginPath();
    ctx.ellipse(p.x, p.y, e.w * 0.32, e.w * 0.12, 0, 0, Math.PI * 2);
    ctx.fill();
    if (!e.img.complete) return;
    const { oy, rot, sy } = animPose(e, t);
    ctx.save();
    ctx.translate(p.x, p.y + oy);
    ctx.rotate(rot);
    ctx.scale(e.flip ? -1 : 1, sy);
    ctx.drawImage(e.img, -b.w / 2, b.y - p.y, b.w, b.h);
    ctx.restore();
  }

  function nameTag(text, x, y, highlight) {
    ctx.font = 'bold 10px sans-serif';
    ctx.textAlign = 'center';
    const w = ctx.measureText(text).width + 10;
    ctx.fillStyle = highlight ? 'rgba(232,145,90,.95)' : 'rgba(255,255,255,.88)';
    ctx.beginPath();
    ctx.roundRect(x - w / 2, y - 12, w, 15, 7);
    ctx.fill();
    ctx.fillStyle = highlight ? '#fff' : '#4A3B35';
    ctx.fillText(text, x, y - 1);
  }

  // 말풍선·이펙트·이름표는 건물에 가리지 않도록 마지막에 그림
  function drawOverlay(e, t) {
    const b = bounds(e, t);
    const p = iso(e.i, e.j);
    const top = b.y + animPose(e, t).oy;

    if (e.kind === 'butler') {
      nameTag(e.isMe ? `${e.name} (나)` : e.name, p.x, top - 2, e.isMe);
      return;
    }
    e.fx = e.fx.filter((f) => t - f.t0 < 1600);
    ctx.font = '16px serif';
    ctx.textAlign = 'center';
    for (const f of e.fx) {
      const age = (t - f.t0) / 1600;
      if (age < 0) continue;
      ctx.globalAlpha = 1 - age;
      ctx.fillText(f.ch, p.x + f.dx, top - age * 60);
    }
    ctx.globalAlpha = 1;

    if (e.bubble && t < e.bubble.until) drawBubble(e.bubble.text, p.x, top - 6);
    else if (e === hovered || e === selected) nameTag(e.label, p.x, top - 4, false);
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

  function draw(t) {
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.setTransform(view.scale, 0, 0, view.scale, view.ox, view.oy);
    drawGround(t);

    const drawables = [
      ...objects.map((o) => ({ depth: o.i + o.w + o.j + o.d - 1, draw: () => drawObject(ctx, o, t) })),
      ...entities.map((e) => ({ depth: e.i + e.j, draw: () => drawEntity(e, t) })),
    ].sort((a, b) => a.depth - b.depth);
    drawables.forEach((d) => d.draw());
    entities.forEach((e) => drawOverlay(e, t));
  }

  function frame(t) {
    update(Math.min(100, t - last));
    last = t;
    draw(t);
    raf = requestAnimationFrame(frame);
  }

  // ---------- 입력 ----------

  function entityAt(ev) {
    const r = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    const x = ((ev.clientX - r.left) * dpr - view.ox) / view.scale;
    const y = ((ev.clientY - r.top) * dpr - view.oy) / view.scale;
    const t = performance.now();
    return [...entities].sort((a, b) => b.i + b.j - (a.i + a.j))
      .find((e) => { const b = bounds(e, t); return x >= b.x && x <= b.x + b.w && y >= b.y && y <= b.y + b.h; }) || null;
  }

  const onMove = (ev) => {
    hovered = entityAt(ev);
    canvas.style.cursor = hovered ? 'pointer' : 'default';
  };
  const onClick = (ev) => onSelect?.(entityAt(ev));

  resize();
  window.addEventListener('resize', resize);
  canvas.addEventListener('mousemove', onMove);
  canvas.addEventListener('click', onClick);
  raf = requestAnimationFrame(frame);

  const catOf = (bookId) => cats.find((c) => c.bookId === bookId) || null;

  return {
    /** kind: 'cat'(id=bookId) | 'butler'(id=uid) | null */
    select(kind, id) {
      selected = kind === 'cat' ? catOf(id) : kind === 'butler' ? byUid[id] || null : null;
    },

    /** 새로 온 고양이를 마을 한가운데(도서관 앞)로 데려와 선택 */
    focus(bookId) {
      const c = catOf(bookId);
      if (!c) return;
      const [i, j] = freeTiles.reduce((a, b) =>
        Math.hypot(a[0] - 7, a[1] - 9) <= Math.hypot(b[0] - 7, b[1] - 9) ? a : b);
      const target = c.owner || c;
      target.i = target.tx = i + 0.5;
      target.j = target.ty = j + 0.5;
      if (c.owner) { c.owner.trail = [{ i: c.owner.i, j: c.owner.j }]; c.owner.wait = 6000; }
      else c.wait = 6000;
      selected = c;
    },

    /** 상호작용: 멈춰 서서 표정·동작·이펙트·말풍선으로 반응 */
    react(bookId, it, text, ms) {
      const c = catOf(bookId);
      if (!c) return;
      const now = performance.now();
      c.pauseUntil = now + ms;
      c.img = catImage(c.cat, { crown: c.crown, mood: it.mood });
      c.anim = { type: it.anim, t0: now };
      c.bubble = { text, until: now + ms };
      for (let k = 0; k < 5; k++) c.fx.push({ ch: it.fx, t0: now + k * 120, dx: (Math.random() - 0.5) * c.w });
      clearTimeout(c.timer);
      c.timer = setTimeout(() => { c.img = c.baseImg; c.anim = null; }, REACTION_MS);
    },

    destroy() {
      cats.forEach((c) => clearTimeout(c.timer));
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      canvas.removeEventListener('mousemove', onMove);
      canvas.removeEventListener('click', onClick);
    },
  };
}
