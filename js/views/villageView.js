import { api } from '../backend.js';
import { createVillage } from '../village.js';
import { THEMES, unlocksFor } from '../villageThemes.js';
import { catSVG } from '../cat.js';
import { INTERACTIONS, REACTION_MS, lineDuration, interactionButtons, talkLine, randomLine } from '../interactions.js';
import { esc, $ } from '../util.js';

let mode = 'club'; // 'club' | 'mine'

// 테마 선택은 보는 사람 브라우저에만 기억
const THEME_KEY = 'librarian-cat-village-theme';
let theme = (() => { try { return localStorage.getItem(THEME_KEY); } catch { return null; } })();
if (!THEMES[theme]) theme = 'village';

export async function renderVillage(root) {
  const [books, progress] = await Promise.all([api.listBooks(), api.listAllProgress()]);
  const uid = api.me().uid;
  const byId = Object.fromEntries(books.map((b) => [b.id, b]));
  const relevant = progress.filter((p) => byId[p.bookId] && (mode === 'club' || p.uid === uid));
  const myPct = Object.fromEntries(progress.filter((p) => p.uid === uid).map((p) => [p.bookId, p.percent]));

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
  const next = unlocksFor(theme).find((u) => u.at > adults.length);

  root.innerHTML = `
    <section class="page-head">
      <div>
        <h1>고양이 마을</h1>
        <p class="muted">책을 50% 읽으면 아기 고양이가, 다 읽으면 왕관 쓴 고양이가 이사와요. 고양이를 눌러 놀아 주세요!</p>
      </div>
      <div class="seg">
        <button class="${mode === 'club' ? 'active' : ''}" data-mode="club">북클럽 마을</button>
        <button class="${mode === 'mine' ? 'active' : ''}" data-mode="mine">내 마을</button>
      </div>
    </section>
    <div class="theme-picker" role="group" aria-label="마을 테마">
      ${Object.entries(THEMES).map(([id, t]) => `<button class="${id === theme ? 'active' : ''}" data-theme="${id}">${t.label}</button>`).join('')}
    </div>
    <div class="village-stats">
      <div class="stat"><b>${adults.length}</b><span>완독 고양이</span></div>
      <div class="stat"><b>${kittens.length}</b><span>아기 고양이</span></div>
      <div class="stat wide"><span>${next ? `🔓 ${next.at - adults.length}권 더 완독하면 <b>${next.label}</b>이(가) 생겨요` : '🏆 모든 건물을 해금했어요!'}</span></div>
    </div>
    <div class="village-wrap theme-${theme} ${isNight() ? 'night' : ''}">
      <canvas id="village"></canvas>
      ${residents.length ? '' : '<div class="village-empty">아직 마을이 조용해요… 책을 절반 넘게 읽으면 첫 고양이가 찾아와요 🐾</div>'}
      <aside class="village-panel card" id="vpanel" hidden></aside>
    </div>
    <h2>마을 주민</h2>
    <div class="resident-list">${residents.sort((a, b) => b.percent - a.percent).map((r) => `
      <button class="resident" data-book="${r.bookId}">
        <div class="mini-cat">${catSVG(r.cat, { crown: r.percent >= 100 })}</div>
        <div><strong>${esc(r.name)}</strong><p class="tiny muted">${esc(r.title)}</p>
        <p class="tiny">${r.percent >= 100 ? `👑 완독: ${esc(r.finishers.join(', '))}` : `🍼 아기 고양이 (${Math.round(r.percent)}%)`}</p></div>
      </button>`).join('')}</div>`;

  const rerender = () => window.dispatchEvent(new HashChangeEvent('hashchange'));
  root.querySelectorAll('[data-mode]').forEach((b) => b.addEventListener('click', () => { mode = b.dataset.mode; rerender(); }));
  root.querySelectorAll('[data-theme]').forEach((b) => b.addEventListener('click', () => {
    theme = b.dataset.theme;
    try { localStorage.setItem(THEME_KEY, theme); } catch { /* 저장 불가해도 이번 화면에는 적용 */ }
    rerender();
  }));

  const panel = $('#vpanel', root);
  const notesCache = {};
  let current = null;
  let busy = false;

  const village = createVillage($('#village', root), residents, {
    theme,
    finishedCount: adults.length,
    onCatClick: (c) => (c ? openPanel(c) : closePanel()),
  });

  function portrait(r, mood) {
    return catSVG(r.cat, { mood, crown: r.percent >= 100 });
  }

  function openPanel(r) {
    current = r;
    busy = false;
    village.select(r.bookId);
    const pct = myPct[r.bookId] || 0;
    const opened = INTERACTIONS.filter((it) => pct >= it.at).length;
    panel.innerHTML = `
      <button class="btn small ghost vp-close" aria-label="닫기">✕</button>
      <div class="vp-head">
        <div class="vp-cat cat" id="vp-cat">${portrait(r, pct < 25 ? 'sleepy' : 'normal')}</div>
        <div>
          <strong>${esc(r.name)}</strong>
          <p class="tiny muted">${esc(r.title)}</p>
          <p class="tiny">내 진도 ${Math.round(pct)}%</p>
        </div>
      </div>
      <p class="tiny muted">${opened
        ? `${opened}가지 놀이가 열려 있어요.`
        : '이 책을 25% 읽으면 쓰다듬어 줄 수 있어요.'}</p>
      <div class="interactions">${interactionButtons(pct)}</div>
      <a class="btn small" href="#/book/${r.bookId}">📖 책 페이지로 가기</a>`;
    panel.hidden = false;
  }

  function closePanel() {
    current = null;
    village.select(null);
    panel.hidden = true;
  }

  async function interact(it) {
    if (busy || !current) return;
    busy = true;
    const r = current;
    let text = randomLine(it);
    if (it.id === 'talk') {
      notesCache[r.bookId] ||= await api.listNotes(r.bookId);
      text = talkLine(notesCache[r.bookId], r.title);
    }
    village.react(r.bookId, it, text, lineDuration(it));
    const el = $('#vp-cat', panel);
    if (el) {
      el.innerHTML = portrait(r, it.mood);
      el.className = `vp-cat cat anim-${it.anim}`;
    }
    setTimeout(() => {
      busy = false;
      if (current !== r) return;
      const cat = $('#vp-cat', panel);
      if (cat) { cat.innerHTML = portrait(r, 'normal'); cat.className = 'vp-cat cat'; }
    }, REACTION_MS);
  }

  panel.addEventListener('click', (e) => {
    if (e.target.closest('.vp-close')) return closePanel();
    const btn = e.target.closest('[data-id]');
    if (btn) interact(INTERACTIONS.find((it) => it.id === btn.dataset.id));
  });

  // 주민 목록에서 고르면 마을에서 해당 고양이 선택
  root.querySelector('.resident-list').addEventListener('click', (e) => {
    const item = e.target.closest('[data-book]');
    if (!item) return;
    openPanel(residents.find((r) => r.bookId === item.dataset.book));
    root.querySelector('.village-wrap').scrollIntoView({ behavior: 'smooth', block: 'center' });
  });

  return village.destroy;
}

function isNight() {
  const h = new Date().getHours();
  return h < 6 || h >= 19;
}
