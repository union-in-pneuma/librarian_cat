import { api } from '../backend.js';
import { createVillage } from '../village.js';
import { THEMES, unlocksFor } from '../villageThemes.js';
import { catSVG } from '../cat.js';
import { butlerSVG, randomLook } from '../butler.js';
import { openButlerEditor } from './butlerEditor.js';
import { bookStatus, hash } from '../owners.js';
import { INTERACTIONS, REACTION_MS, lineDuration, interactionButtons, talkLine, randomLine } from '../interactions.js';
import { esc, $ } from '../util.js';

// 테마 선택은 보는 사람 브라우저에만 기억
const THEME_KEY = 'librarian-cat-village-theme';
let theme = (() => { try { return localStorage.getItem(THEME_KEY); } catch { return null; } })();
if (!THEMES[theme]) theme = 'village';

export async function renderVillage(root) {
  const [books, progress, users] = await Promise.all([api.listBooks(), api.listAllProgress(), api.listButlers()]);
  const uid = api.me().uid;
  const byId = Object.fromEntries(books.map((b) => [b.id, b]));
  const liveProgress = progress.filter((p) => byId[p.bookId]);
  const newCatId = new URLSearchParams(location.hash.split('?')[1]).get('new');

  // 집사 목록: 등록된 집사 + (집사 문서가 없는) 진도 기록자
  const butlers = new Map(users.map((u) => [u.uid, { uid: u.uid, name: u.name, look: u.look || randomLook(hash(u.uid)) }]));
  for (const p of liveProgress) if (!butlers.has(p.uid)) butlers.set(p.uid, { uid: p.uid, name: p.name, look: randomLook(hash(p.uid)) });
  for (const b of butlers.values()) b.isMe = b.uid === uid;

  // 모든 책의 고양이가 마을에 삽니다. 읽은 집사가 있으면 가장 많이 읽은 집사를 따라다님
  const residents = books.map((b) => {
    const st = bookStatus(b.id, liveProgress);
    return {
      bookId: b.id, cat: b.cat, percent: st.best, title: b.title,
      name: b.cat?.name || '고양이', label: `${b.cat?.name || '고양이'} · ${b.title}`,
      ownerUid: st.owner?.uid || null,
      ownerName: st.owner ? butlers.get(st.owner.uid)?.name || st.owner.name : null,
      tiedCount: st.tied.length,
    };
  });
  const adults = residents.filter((r) => r.percent >= 100);
  const next = unlocksFor(theme).find((u) => u.at > adults.length);

  root.innerHTML = `
    <section class="page-head">
      <div>
        <h1>고양이 마을</h1>
        <p class="muted">책 한 권마다 고양이 한 마리가 살아요. 고양이는 자기 책을 가장 많이 읽은 집사를 따라다니고, 다 읽으면 왕관을 써요.</p>
      </div>
      <div class="row">
        <button class="btn" id="my-butler">🧑 내 집사 꾸미기</button>
        <a class="btn primary" href="#/new?from=village">＋ 고양이 데려오기</a>
      </div>
    </section>
    <div class="theme-picker" role="group" aria-label="마을 테마">
      ${Object.entries(THEMES).map(([id, t]) => `<button class="${id === theme ? 'active' : ''}" data-theme="${id}">${t.label}</button>`).join('')}
    </div>
    <div class="village-stats">
      <div class="stat"><b>${butlers.size}</b><span>집사</span></div>
      <div class="stat"><b>${residents.length}</b><span>고양이</span></div>
      <div class="stat"><b>${adults.length}</b><span>완독 고양이</span></div>
      <div class="stat wide"><span>${next ? `🔓 ${next.at - adults.length}권 더 완독하면 <b>${next.label}</b>이(가) 생겨요` : '🏆 모든 건물을 해금했어요!'}</span></div>
    </div>
    <div class="village-wrap theme-${theme} ${isNight() ? 'night' : ''}">
      <canvas id="village"></canvas>
      ${residents.length ? '' : '<div class="village-empty">아직 고양이가 없어요… ‘고양이 데려오기’로 첫 고양이를 데려와 보세요 🐾</div>'}
      <aside class="village-panel card" id="vpanel" hidden></aside>
    </div>
    <h2>마을 주민</h2>
    <div class="resident-list">${residents.sort((a, b) => b.percent - a.percent).map((r) => `
      <button class="resident" data-book="${r.bookId}">
        <div class="mini-cat">${catSVG(r.cat, { crown: r.percent >= 100 })}</div>
        <div><strong>${esc(r.name)}</strong><p class="tiny muted">${esc(r.title)}</p>
        <p class="tiny">${r.percent >= 100 ? '👑 완독 · ' : ''}${r.ownerName ? `🧑 ${esc(r.ownerName)} (${Math.round(r.percent)}%)` : '🐾 자유롭게 산책 중'}</p></div>
      </button>`).join('')}</div>`;

  root.querySelectorAll('[data-theme]').forEach((b) => b.addEventListener('click', () => {
    theme = b.dataset.theme;
    try { localStorage.setItem(THEME_KEY, theme); } catch { /* 저장 불가해도 이번 화면에는 적용 */ }
    window.dispatchEvent(new HashChangeEvent('hashchange'));
  }));


  const panel = $('#vpanel', root);
  const notesCache = {};
  let current = null; // 열린 고양이 (resident)
  let busy = false;

  const village = createVillage($('#village', root), {
    butlers: [...butlers.values()],
    residents,
    theme,
    finishedCount: adults.length,
    onSelect: (e) => (!e ? closePanel() : e.kind === 'cat' ? openCat(residents.find((r) => r.bookId === e.bookId)) : openButler(e.uid)),
  });

  // ---------- 고양이 패널 ----------
  const portrait = (r, mood) => catSVG(r.cat, { mood, crown: r.percent >= 100 });

  function openCat(r) {
    current = r;
    busy = false;
    village.select('cat', r.bookId);
    panel.innerHTML = `
      <button class="btn small ghost vp-close" aria-label="닫기">✕</button>
      <div class="vp-head">
        <div class="vp-cat cat" id="vp-cat">${portrait(r, 'normal')}</div>
        <div>
          <strong>${esc(r.name)}</strong>
          <p class="tiny muted">${esc(r.title)}</p>
          <p class="tiny">${r.ownerName
            ? `🧑 ${esc(r.ownerName)} 집사를 따라다녀요${r.tiedCount > 1 ? ` <span class="muted">(동점 ${r.tiedCount}명 중 오늘의 집사)</span>` : ''}`
            : '🐾 아직 읽는 집사가 없어 자유롭게 산책 중'}</p>
        </div>
      </div>
      <div class="interactions">${interactionButtons()}</div>
      <a class="btn small" href="#/book/${r.bookId}">📖 책 페이지로 가기</a>`;
    panel.hidden = false;
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

  // ---------- 집사 패널 ----------
  function openButler(buid) {
    current = null;
    const b = butlers.get(buid);
    if (!b) return;
    village.select('butler', buid);
    const following = residents.filter((r) => r.ownerUid === buid);
    const finished = liveProgress.filter((p) => p.uid === buid && p.percent >= 100).length;
    panel.innerHTML = `
      <button class="btn small ghost vp-close" aria-label="닫기">✕</button>
      <div class="vp-head">
        <div class="vp-cat vp-butler" id="vp-butler">${butlerSVG(b.look)}</div>
        <div>
          <strong>${esc(b.name)}${b.isMe ? ' (나)' : ''}</strong>
          <p class="tiny">📚 완독 ${finished}권 · 🐾 고양이 ${following.length}마리</p>
        </div>
      </div>
      ${following.length
        ? `<div class="vp-following">${following.map((r) => `<button class="vp-mini" data-book="${r.bookId}" title="${esc(r.label)}">${catSVG(r.cat, { crown: r.percent >= 100 })}<span>${esc(r.name)}</span></button>`).join('')}</div>`
        : '<p class="tiny muted">아직 따라다니는 고양이가 없어요. 책을 가장 많이 읽으면 고양이가 따라와요!</p>'}
      ${b.isMe ? '<button class="btn small primary" id="vp-edit">✏️ 꾸미기</button>' : ''}`;
    panel.hidden = false;
  }

  function closePanel() {
    current = null;
    village.select(null);
    panel.hidden = true;
  }

  panel.addEventListener('click', (e) => {
    if (e.target.closest('.vp-close')) return closePanel();
    if (e.target.closest('#vp-edit')) return editButler();
    const mini = e.target.closest('.vp-mini');
    if (mini) return openCat(residents.find((r) => r.bookId === mini.dataset.book));
    const btn = e.target.closest('[data-id]');
    if (btn) interact(INTERACTIONS.find((it) => it.id === btn.dataset.id));
  });

  const rerender = () => window.dispatchEvent(new HashChangeEvent('hashchange'));
  const editButler = () => openButlerEditor({ onSaved: rerender });
  $('#my-butler', root).addEventListener('click', editButler);

  // 방금 데려온 고양이: 마을 한가운데로 불러 인사
  const fresh = newCatId && residents.find((r) => r.bookId === newCatId);
  if (fresh) {
    history.replaceState(null, '', '#/village');
    village.focus(fresh.bookId);
    openCat(fresh);
    setTimeout(() => village.react(fresh.bookId, INTERACTIONS[0], `안녕! 나는 ${fresh.name}. 오늘부터 이 마을에 살아요!`, 4000), 400);
    root.querySelector('.village-wrap').scrollIntoView({ block: 'center' });
  }

  // 주민 목록에서 고르면 마을에서 해당 고양이 선택
  root.querySelector('.resident-list').addEventListener('click', (e) => {
    const item = e.target.closest('[data-book]');
    if (!item) return;
    openCat(residents.find((r) => r.bookId === item.dataset.book));
    root.querySelector('.village-wrap').scrollIntoView({ behavior: 'smooth', block: 'center' });
  });

  return village.destroy;
}

function isNight() {
  const h = new Date().getHours();
  return h < 6 || h >= 19;
}
