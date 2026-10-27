export const $ = (sel, root = document) => root.querySelector(sel);
export const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

const ESC = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
export const esc = (s = '') => String(s ?? '').replace(/[&<>"']/g, (c) => ESC[c]);

// 사용자가 입력한 URL은 http(s)만 허용
export const safeUrl = (url) => (/^https?:\/\//i.test(url || '') ? esc(url) : '');

export const fmtDate = (ts) =>
  ts ? new Date(ts).toLocaleDateString('ko-KR', { year: 'numeric', month: 'short', day: 'numeric' }) : '';

export const MILESTONES = [25, 50, 75, 100];
/** 0~4: 도달한 마일스톤 개수 */
export const stageOf = (percent = 0) => MILESTONES.filter((m) => percent >= m).length;

export function toast(message, ms = 2600) {
  const el = document.createElement('div');
  el.className = 'toast';
  el.textContent = message;
  document.body.append(el);
  requestAnimationFrame(() => el.classList.add('show'));
  setTimeout(() => {
    el.classList.remove('show');
    setTimeout(() => el.remove(), 400);
  }, ms);
}

export function avatar(user, size = 28) {
  const url = safeUrl(user?.photo);
  const initial = esc((user?.name || '?').slice(0, 1));
  return url
    ? `<img class="avatar" src="${url}" width="${size}" height="${size}" alt="" referrerpolicy="no-referrer">`
    : `<span class="avatar avatar-fallback" style="width:${size}px;height:${size}px">${initial}</span>`;
}

export function progressBar(percent = 0) {
  const p = Math.max(0, Math.min(100, Math.round(percent)));
  const ticks = MILESTONES.slice(0, 3).map((m) => `<i style="left:${m}%"></i>`).join('');
  return `<div class="pbar"><div class="pbar-fill" style="width:${p}%"></div>${ticks}</div>`;
}
