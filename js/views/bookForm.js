import { api } from '../backend.js';
import { catSVG, randomCat, DEFAULT_CAT, CAT_PARTS } from '../cat.js';
import { esc, safeUrl, $, toast } from '../util.js';
import { partsEditorHTML, bindPartsTabs, readParts, writeParts } from './partsEditor.js';
import { searchBooks, SEARCH_SOURCE } from '../bookSearch.js';

const FIELDS = [
  ['title', '제목 *', 'text'],
  ['author', '저자', 'text'],
  ['publisher', '출판사', 'text'],
  ['year', '출판년도', 'number'],
  ['pages', '전체 쪽수', 'number'],
  ['isbn', 'ISBN', 'text'],
  ['coverUrl', '표지 이미지 URL', 'url'],
];

export async function renderBookForm(root, bookId) {
  const book = bookId ? await api.getBook(bookId) : null;
  if (bookId && !book) { root.innerHTML = '<div class="empty">책을 찾을 수 없어요.</div>'; return; }
  if (book && book.createdBy?.uid !== api.me().uid) {
    root.innerHTML = '<div class="empty">책을 등록한 사람만 수정할 수 있어요.</div>';
    return;
  }
  const cat = { ...DEFAULT_CAT, ...(book?.cat || randomCat()) };
  const fromVillage = new URLSearchParams(location.hash.split('?')[1]).get('from') === 'village';

  root.innerHTML = `
    <section class="page-head"><h1>${book ? '책 정보 수정' : fromVillage ? '마을에 새 고양이 데려오기' : '새 책과 고양이 데려오기'}</h1></section>
    ${book ? '' : `
    <div class="card lookup">
      <label>책 검색으로 자동 채우기 <span class="muted tiny">(${SEARCH_SOURCE})</span></label>
      <div class="row"><input id="q" placeholder="제목 또는 ISBN"><button class="btn" id="lookup" type="button">검색</button></div>
      <div id="results" class="lookup-results"></div>
    </div>`}
    <form id="book-form" class="form-grid">
      <div class="card">
        <h2>📖 책 정보</h2>
        ${FIELDS.map(([k, label, type]) => `
          <label>${label}<input name="${k}" type="${type}" value="${esc(book?.[k] ?? '')}" ${k === 'title' ? 'required' : ''}></label>`).join('')}
        <label>소개 / 메모<textarea name="description" rows="5">${esc(book?.description || '')}</textarea></label>
      </div>
      <div class="card cat-designer">
        <h2>🐱 이 책의 고양이 꾸미기</h2>
        <div class="cat-preview" id="preview"></div>
        <label>고양이 이름<input name="catName" value="${esc(cat.name)}" placeholder="예: 데미안"></label>
        <div class="parts-editor">${partsEditorHTML(CAT_PARTS, cat)}</div>
        <button class="btn" type="button" id="random">🎲 랜덤 고양이</button>
      </div>
      <div class="form-actions">
        <a class="btn" href="${book ? `#/book/${book.id}` : fromVillage ? '#/village' : '#/'}">취소</a>
        <button class="btn primary" type="submit">${book ? '저장' : fromVillage ? '마을로 데려가기' : '서재에 추가'}</button>
      </div>
    </form>`;

  const form = $('#book-form', root);
  const readCat = () => ({ name: form.elements.catName.value.trim(), ...readParts(form, CAT_PARTS) });
  const preview = () => { $('#preview', root).innerHTML = catSVG(readCat()); };
  form.addEventListener('input', preview);
  bindPartsTabs($('.parts-editor', root));
  preview();

  $('#random', root).addEventListener('click', () => {
    writeParts(form, CAT_PARTS, randomCat());
    preview();
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const fd = new FormData(form);
    const data = Object.fromEntries(FIELDS.map(([k, , type]) => {
      const v = fd.get(k).trim();
      return [k, type === 'number' ? (v ? Number(v) : null) : v];
    }));
    data.description = fd.get('description').trim();
    data.cat = readCat();
    if (!data.cat.name) data.cat.name = `${data.title}의 고양이`;
    const btn = form.querySelector('[type=submit]');
    btn.disabled = true;
    try {
      if (book) { await api.updateBook(book.id, data); location.hash = `#/book/${book.id}`; }
      else {
        const id = await api.createBook(data);
        toast(`${data.cat.name}(이)가 ${fromVillage ? '마을에 왔어요!' : '서재에 들어왔어요!'}`);
        location.hash = fromVillage ? `#/village?new=${id}` : `#/book/${id}`;
      }
    } catch (err) {
      console.error(err);
      toast('저장하지 못했어요: ' + err.message);
      btn.disabled = false;
    }
  });

  if (!book) setupLookup(root, form, preview);
}

function setupLookup(root, form, preview) {
  const q = $('#q', root);
  const results = $('#results', root);
  let items = [];

  const search = async () => {
    if (!q.value.trim()) return;
    results.innerHTML = '<p class="muted">검색 중…</p>';
    try {
      items = await searchBooks(q.value.trim());
    } catch (err) {
      items = [];
      results.innerHTML = `<p class="muted">${esc(err.message)}</p>`;
      return;
    }
    results.innerHTML = items.length
      ? items.map((it, k) => `
        <button type="button" class="lookup-item" data-k="${k}">
          ${safeUrl(it.thumbnail) ? `<img src="${safeUrl(it.thumbnail)}" alt="" loading="lazy">` : '<span class="lookup-noimg">📕</span>'}
          <span><strong>${esc(it.title)}</strong><br>
          <span class="muted tiny">${esc(it.author)} · ${esc(it.publisher)} ${esc(it.year)}</span></span></button>`).join('')
      : '<p class="muted">결과가 없어요. 직접 입력해 주세요.</p>';
  };

  $('#lookup', root).addEventListener('click', search);
  q.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); search(); } });
  results.addEventListener('click', (e) => {
    const el = e.target.closest('.lookup-item');
    if (!el) return;
    const it = items[el.dataset.k];
    for (const key of ['title', 'author', 'publisher', 'year', 'pages', 'isbn', 'coverUrl', 'description']) {
      if (it[key]) form.elements[key].value = it[key];
    }
    results.innerHTML = '<p class="muted">채웠어요! 쪽수·소개를 확인하고 고양이를 꾸며 주세요.</p>';
    preview();
  });
}
