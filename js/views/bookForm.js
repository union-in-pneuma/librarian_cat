import { api } from '../backend.js';
import { catSVG, randomCat, DEFAULT_CAT, FUR_COLORS, PATTERNS, EYE_COLORS, ACCESSORIES } from '../cat.js';
import { esc, $, $$, toast } from '../util.js';

const FIELDS = [
  ['title', '제목 *', 'text'],
  ['author', '저자', 'text'],
  ['publisher', '출판사', 'text'],
  ['year', '출판년도', 'number'],
  ['pages', '전체 쪽수', 'number'],
  ['isbn', 'ISBN', 'text'],
  ['coverUrl', '표지 이미지 URL', 'url'],
];

const swatchGroup = (name, items, current, render) =>
  `<div class="swatches">${items.map((it) => `
    <label class="swatch" title="${esc(it.label)}">
      <input type="radio" name="${name}" value="${it.id}" ${it.id === current ? 'checked' : ''}>
      ${render(it)}</label>`).join('')}</div>`;

export async function renderBookForm(root, bookId) {
  const book = bookId ? await api.getBook(bookId) : null;
  if (bookId && !book) { root.innerHTML = '<div class="empty">책을 찾을 수 없어요.</div>'; return; }
  if (book && book.createdBy?.uid !== api.me().uid) {
    root.innerHTML = '<div class="empty">책을 등록한 사람만 수정할 수 있어요.</div>';
    return;
  }
  const cat = { ...DEFAULT_CAT, ...(book?.cat || randomCat()) };

  root.innerHTML = `
    <section class="page-head"><h1>${book ? '책 정보 수정' : '새 책과 고양이 데려오기'}</h1></section>
    ${book ? '' : `
    <div class="card lookup">
      <label>책 검색으로 자동 채우기 <span class="muted tiny">(Google Books)</span></label>
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
        <fieldset><legend>털색</legend>
          ${swatchGroup('fur', FUR_COLORS, cat.fur, (f) => `<span class="dot" style="background:${f.base}"></span><small>${f.label}</small>`)}</fieldset>
        <fieldset><legend>무늬</legend>
          ${swatchGroup('pattern', PATTERNS, cat.pattern, (p) => `<span class="chip">${p.label}</span>`)}</fieldset>
        <fieldset><legend>눈 색</legend>
          ${swatchGroup('eyes', EYE_COLORS, cat.eyes, (e) => `<span class="dot" style="background:${e.color2 ? `linear-gradient(90deg,${e.color} 50%,${e.color2} 50%)` : e.color}"></span><small>${e.label}</small>`)}</fieldset>
        <fieldset><legend>소품 (여러 개 선택 가능)</legend><div class="swatches">
          ${ACCESSORIES.map((a) => `<label class="swatch"><input type="checkbox" name="acc" value="${a.id}" ${cat.accessories.includes(a.id) ? 'checked' : ''}><span class="chip">${a.label}</span></label>`).join('')}
        </div></fieldset>
        <button class="btn" type="button" id="random">🎲 랜덤 고양이</button>
      </div>
      <div class="form-actions">
        <a class="btn" href="${book ? `#/book/${book.id}` : '#/'}">취소</a>
        <button class="btn primary" type="submit">${book ? '저장' : '서재에 추가'}</button>
      </div>
    </form>`;

  const form = $('#book-form', root);
  const readCat = () => {
    const fd = new FormData(form);
    return { name: fd.get('catName').trim(), fur: fd.get('fur'), pattern: fd.get('pattern'), eyes: fd.get('eyes'), accessories: fd.getAll('acc') };
  };
  const preview = () => { $('#preview', root).innerHTML = catSVG(readCat(), { mood: 'happy' }); };
  form.addEventListener('input', preview);
  preview();

  $('#random', root).addEventListener('click', () => {
    const r = randomCat();
    for (const key of ['fur', 'pattern', 'eyes']) form.querySelector(`[name=${key}][value=${r[key]}]`).checked = true;
    $$('[name=acc]', form).forEach((el) => { el.checked = r.accessories.includes(el.value); });
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
      else { const id = await api.createBook(data); toast(`${data.cat.name}(이)가 서재에 들어왔어요!`); location.hash = `#/book/${id}`; }
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
      const res = await fetch(`https://www.googleapis.com/books/v1/volumes?maxResults=6&q=${encodeURIComponent(q.value.trim())}`);
      items = (await res.json()).items || [];
    } catch { items = []; }
    results.innerHTML = items.length
      ? items.map((it, k) => {
        const v = it.volumeInfo;
        return `<button type="button" class="lookup-item" data-k="${k}">
          <strong>${esc(v.title)}</strong> <span class="muted">${esc((v.authors || []).join(', '))} · ${esc(v.publisher || '')} ${esc((v.publishedDate || '').slice(0, 4))}</span></button>`;
      }).join('')
      : '<p class="muted">결과가 없어요. 직접 입력해 주세요.</p>';
  };

  $('#lookup', root).addEventListener('click', search);
  q.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); search(); } });
  results.addEventListener('click', (e) => {
    const el = e.target.closest('.lookup-item');
    if (!el) return;
    const v = items[el.dataset.k].volumeInfo;
    const isbn = (v.industryIdentifiers || []).find((x) => x.type === 'ISBN_13') || (v.industryIdentifiers || [])[0];
    const set = (name, value) => { if (value) form.elements[name].value = value; };
    set('title', v.title + (v.subtitle ? `: ${v.subtitle}` : ''));
    set('author', (v.authors || []).join(', '));
    set('publisher', v.publisher);
    set('year', (v.publishedDate || '').slice(0, 4));
    set('pages', v.pageCount);
    set('isbn', isbn?.identifier);
    set('coverUrl', (v.imageLinks?.thumbnail || '').replace(/^http:/, 'https:'));
    set('description', v.description);
    results.innerHTML = '<p class="muted">채웠어요! 내용을 확인하고 고양이를 꾸며 주세요.</p>';
    preview();
  });
}
