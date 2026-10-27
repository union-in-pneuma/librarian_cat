import { api } from '../backend.js';
import { catSVG } from '../cat.js';
import { esc, $, stageOf, progressBar } from '../util.js';

export async function renderLibrary(root) {
  const [books, progress] = await Promise.all([api.listBooks(), api.listAllProgress()]);
  const uid = api.me().uid;
  const mine = Object.fromEntries(progress.filter((p) => p.uid === uid).map((p) => [p.bookId, p.percent]));
  const readers = {};
  progress.forEach((p) => { if (p.percent > 0) readers[p.bookId] = (readers[p.bookId] || 0) + 1; });

  root.innerHTML = `
    <section class="page-head">
      <div>
        <h1>북클럽 서재</h1>
        <p class="muted">책 한 권마다 고양이 한 마리. 읽을수록 고양이와 더 친해져요.</p>
      </div>
      <a class="btn primary" href="#/new">＋ 책 추가</a>
    </section>
    <input id="search" class="search" type="search" placeholder="제목, 저자, 고양이 이름으로 찾기">
    <div id="grid" class="book-grid"></div>`;

  const grid = $('#grid', root);
  const draw = (q = '') => {
    const list = books.filter((b) =>
      [b.title, b.author, b.cat?.name].some((v) => (v || '').toLowerCase().includes(q.toLowerCase())));
    if (!list.length) {
      grid.innerHTML = `<div class="empty">${books.length ? '찾는 책이 없어요.' : '아직 서재가 비어 있어요. 첫 책과 고양이를 데려와 볼까요?'}</div>`;
      return;
    }
    grid.innerHTML = list.map((b) => {
      const pct = mine[b.id] || 0;
      const stage = stageOf(pct);
      return `<a class="book-card" href="#/book/${b.id}">
        <div class="card-cat">${catSVG(b.cat, { mood: stage === 0 ? 'sleepy' : 'normal', crown: stage === 4 })}</div>
        <div class="card-body">
          <h3>${esc(b.title)}</h3>
          <p class="muted">${esc(b.author || '저자 미상')}${b.year ? ` · ${esc(b.year)}` : ''}</p>
          <p class="cat-name">🐾 ${esc(b.cat?.name || '이름 없는 고양이')}</p>
          ${progressBar(pct)}
          <p class="tiny muted">내 진도 ${Math.round(pct)}% · ${readers[b.id] || 0}명 읽는 중</p>
        </div></a>`;
    }).join('');
  };
  draw();
  $('#search', root).addEventListener('input', (e) => draw(e.target.value.trim()));
}
