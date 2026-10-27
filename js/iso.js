// 아이소메트릭 그리기 기본 도구
export const TW = 64; // 타일 가로
export const TH = 32; // 타일 세로

export const iso = (i, j) => ({ x: ((i - j) * TW) / 2, y: ((i + j) * TH) / 2 });
export const lift = (p, h) => ({ x: p.x, y: p.y - h });
export const lerp = (a, b, t) => ({ x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t });

export function poly(ctx, pts, fill, stroke = 'rgba(60,40,30,.35)') {
  ctx.beginPath();
  pts.forEach((p, k) => (k ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y)));
  ctx.closePath();
  ctx.fillStyle = fill;
  ctx.fill();
  if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = 1; ctx.stroke(); }
}

export function circle(ctx, x, y, r, fill) {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fillStyle = fill;
  ctx.fill();
}

// 직육면체: 바닥 (i,j)~(i+w,j+d), 높이 h. 반환값은 지붕/장식용 꼭짓점.
export function box(ctx, i, j, w, d, h, { top, left, right }) {
  const A = iso(i, j), B = iso(i + w, j), C = iso(i + w, j + d), D = iso(i, j + d);
  poly(ctx, [D, C, lift(C, h), lift(D, h)], left);
  poly(ctx, [B, C, lift(C, h), lift(B, h)], right);
  if (top) poly(ctx, [A, B, C, D].map((p) => lift(p, h)), top);
  return { A: lift(A, h), B: lift(B, h), C: lift(C, h), D: lift(D, h), base: { A, B, C, D } };
}

export function pyramidRoof(ctx, { A, B, C, D }, rh, light, dark) {
  const apex = lift(lerp(A, C, 0.5), rh);
  poly(ctx, [A, B, apex], dark);
  poly(ctx, [A, D, apex], light);
  poly(ctx, [D, C, apex], light);
  poly(ctx, [B, C, apex], dark);
}

// 벽면 위 사각형 (문/창문). face: 'left'(D→C) | 'right'(B→C)
export function onFace(ctx, base, face, t0, t1, z0, z1, fill) {
  const [P, Q] = face === 'left' ? [base.D, base.C] : [base.B, base.C];
  const a = lerp(P, Q, t0), b = lerp(P, Q, t1);
  poly(ctx, [lift(a, z0), lift(b, z0), lift(b, z1), lift(a, z1)], fill);
}

const BOOK_COLORS = ['#C8553D', '#3D6E8A', '#E3B23C', '#5DA67A', '#8C5A9E', '#E8915A', '#4A6B3A'];
// 벽면에 책이 꽂힌 선반 줄무늬
export function bookRows(ctx, base, face, rows, z0, rowH) {
  for (let r = 0; r < rows; r++) {
    const z = z0 + r * rowH;
    let t = 0.06;
    let k = r * 3;
    while (t < 0.94) {
      const w = 0.05 + ((k * 37) % 5) / 100;
      onFace(ctx, base, face, t, Math.min(0.94, t + w), z, z + rowH * (0.6 + ((k * 13) % 4) / 10), BOOK_COLORS[k % BOOK_COLORS.length]);
      t += w + 0.01;
      k++;
    }
  }
}
