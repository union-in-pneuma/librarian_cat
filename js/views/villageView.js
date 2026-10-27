import { api } from '../backend.js';
import { createVillage, UNLOCKS } from '../village.js';
import { catSVG } from '../cat.js';
import { esc, $ } from '../util.js';

let mode = 'club'; // 'club' | 'mine'

export async function renderVillage(root) {
  const [books, progress] = await Promise.all([api.listBooks(), api.listAllProgress()]);
  const uid = api.me().uid;
  const byId = Object.fromEntries(books.map((b) => [b.id, b]));
  const relevant = progress.filter((p) => byId[p.bookId] && (mode === 'club' || p.uid === uid));

  // 책 하나당 고양이 한 마리. 북클럽 마을에서는 가장 많이 읽은 사람의 진도를 따름
  const best = {};
  const finishers = {};
  for (const p of relevant) {
    best[p.bookId] = Math.max(best[p.bookId] || 0, p.percent);
    if (p.percent >= 100) (finishers[p.bookId] ||= []).push(p.name);
  }
  const residents = Object.entries(best)
    .filter(([, pct]) => pct >= 50)
    .map(([bookId, percent]) => {
      const b = byId[bookId];
      const name = b.cat?.name || '고양이';
      return { bookId, percent, cat: b.cat, name, title: b.title, label: `${name} · ${b.title}`, finishers: finishers[bookId] || [] };
    });
  const adults = residents.filter((r) => r.percent >= 100);
  const kittens = residents.filter((r) => r.percent < 100);
  const next = UNLOCKS.find((u) => u.at > adults.length);

  root.innerHTML = `
    <section class="page-head">
      <div>
        <h1>고양이 마을</h1>
        <p class="muted">책을 50% 읽으면 아기 고양이가, 다 읽으면 왕관 쓴 고양이가 마을로 이사와요.</p>
      </div>
      <div class="seg">
        <button class="${mode === 'club' ? 'active' : ''}" data-mode="club">북클럽 마을</button>
        <button class="${mode === 'mine' ? 'active' : ''}" data-mode="mine">내 마을</button>
      </div>
    </section>
    <div class="village-stats">
      <div class="stat"><b>${adults.length}</b><span>완독 고양이</span></div>
      <div class="stat"><b>${kittens.length}</b><span>아기 고양이</span></div>
      <div class="stat wide"><span>${next ? `🔓 ${next.at - adults.length}권 더 완독하면 <b>${next.label}</b>이(가) 생겨요` : '🏆 모든 건물을 해금했어요!'}</span></div>
    </div>
    <div class="village-wrap ${isNight() ? 'night' : ''}">
      <canvas id="village"></canvas>
      ${residents.length ? '' : '<div class="village-empty">아직 마을이 조용해요… 책을 절반 넘게 읽으면 첫 고양이가 찾아와요 🐾</div>'}
    </div>
    <h2>마을 주민</h2>
    <div class="resident-list">${residents.sort((a, b) => b.percent - a.percent).map((r) => `
      <a class="resident" href="#/book/${r.bookId}">
        <div class="mini-cat">${catSVG(r.cat, { crown: r.percent >= 100 })}</div>
        <div><strong>${esc(r.name)}</strong><p class="tiny muted">${esc(r.title)}</p>
        <p class="tiny">${r.percent >= 100 ? `👑 완독: ${esc(r.finishers.join(', '))}` : `🍼 아기 고양이 (${Math.round(r.percent)}%)`}</p></div>
      </a>`).join('')}</div>`;

  root.querySelectorAll('[data-mode]').forEach((b) => b.addEventListener('click', () => {
    mode = b.dataset.mode;
    window.dispatchEvent(new HashChangeEvent('hashchange'));
  }));

  return createVillage($('#village', root), residents, {
    finishedCount: adults.length,
    onCatClick: (c) => { location.hash = `#/book/${c.bookId}`; },
  });
}

function isNight() {
  const h = new Date().getHours();
  return h < 6 || h >= 19;
}
