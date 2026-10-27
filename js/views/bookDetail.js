import { api } from '../backend.js';
import { catSVG } from '../cat.js';
import { INTERACTIONS, REACTION_MS, lineDuration, interactionButtons, talkLine, randomLine } from '../interactions.js';
import { esc, safeUrl, $, $$, fmtDate, toast, avatar, progressBar, stageOf } from '../util.js';

const NOTE_TYPES = { presentation: '발제', discussion: '토론 기록' };
const STAGE_TEXT = [
  '쿨쿨 자는 중이에요. 25%까지 읽으면 깨어나요.',
  '눈을 떴어요! 쓰다듬어 줄 수 있어요.',
  '배가 고픈가 봐요. 간식을 줄 수 있어요.',
  '놀고 싶어해요. 털실 놀이가 열렸어요.',
  '다 읽었어요! 왕관을 쓰고 고양이 마을로 이사했어요 👑',
];

export async function renderBookDetail(root, bookId) {
  const book = await api.getBook(bookId);
  if (!book) { root.innerHTML = '<div class="empty">책을 찾을 수 없어요. <a href="#/">서재로</a></div>'; return; }
  const me = api.me();
  const isOwner = book.createdBy?.uid === me.uid;
  let progress = await api.listProgress(bookId);
  let notes = await api.listNotes(bookId);
  let myPct = progress.find((p) => p.uid === me.uid)?.percent || 0;
  let noteTab = 'presentation';

  const cover = safeUrl(book.coverUrl);
  root.innerHTML = `
    <a class="back" href="#/">← 서재</a>
    <section class="detail-top">
      <div class="card cat-stage-card">
        <div class="cat-stage" id="stage">
          <div class="bubble" id="bubble" hidden></div>
          <div class="cat" id="cat"></div>
          <div class="fx" id="fx"></div>
        </div>
        <p class="cat-title">🐾 ${esc(book.cat?.name || '이름 없는 고양이')}</p>
        <p class="muted center" id="stage-text"></p>
        <div class="interactions" id="interactions"></div>
      </div>
      <div class="card book-info">
        <div class="book-info-head">
          ${cover ? `<img class="cover" src="${cover}" alt="">` : ''}
          <div>
            <h1>${esc(book.title)}</h1>
            <dl class="meta">
              ${[['저자', book.author], ['출판사', book.publisher], ['출판년도', book.year], ['쪽수', book.pages && `${book.pages}쪽`], ['ISBN', book.isbn]]
                .filter(([, v]) => v).map(([k, v]) => `<dt>${k}</dt><dd>${esc(v)}</dd>`).join('')}
            </dl>
            <p class="tiny muted">${avatar(book.createdBy, 18)} ${esc(book.createdBy?.name)} 님이 ${fmtDate(book.createdAt)}에 등록</p>
          </div>
        </div>
        ${book.description ? `<p class="desc">${esc(book.description)}</p>` : ''}
        ${isOwner ? `<div class="row end"><a class="btn small" href="#/book/${book.id}/edit">수정</a><button class="btn small danger" id="delete">삭제</button></div>` : ''}

        <h2>📈 내 독서 진도</h2>
        <form id="progress-form" class="progress-form">
          <input type="range" name="percent" min="0" max="100" step="1" value="${myPct}">
          ${book.pages ? `<label class="inline"><input type="number" name="page" min="0" max="${book.pages}" value="${progress.find((p) => p.uid === me.uid)?.page || 0}"> / ${book.pages}쪽</label>` : ''}
          <strong id="pct-label">${Math.round(myPct)}%</strong>
          <button class="btn primary small">기록</button>
        </form>
        <h3>함께 읽는 사람들</h3>
        <ul class="readers" id="readers"></ul>
      </div>
    </section>

    <section class="card notes">
      <div class="tabs">${Object.entries(NOTE_TYPES).map(([k, v]) => `<button class="tab" data-tab="${k}">${v}</button>`).join('')}</div>
      <details class="note-new" id="note-new">
        <summary>＋ 새로 쓰기</summary>
        <form id="note-form">${noteFields()}<div class="row end"><button class="btn primary">등록</button></div></form>
      </details>
      <div id="note-list"></div>
    </section>`;

  // ---------- 고양이 ----------
  const catEl = $('#cat', root);
  const bubble = $('#bubble', root);
  let busy = false;
  const baseMood = () => (stageOf(myPct) === 0 ? 'sleepy' : 'normal');
  const drawCat = (mood = baseMood()) => { catEl.innerHTML = catSVG(book.cat, { mood, crown: myPct >= 100 }); };

  function say(text, ms = 2200) {
    bubble.textContent = text;
    bubble.hidden = false;
    clearTimeout(say.t);
    say.t = setTimeout(() => { bubble.hidden = true; }, ms);
  }

  function interact(it) {
    if (busy) return;
    busy = true;
    drawCat(it.mood);
    catEl.className = `cat anim-${it.anim}`;
    const fx = $('#fx', root);
    for (let k = 0; k < 5; k++) {
      const s = document.createElement('span');
      s.textContent = it.fx;
      s.style.left = `${20 + Math.random() * 60}%`;
      s.style.animationDelay = `${k * 0.12}s`;
      fx.append(s);
      setTimeout(() => s.remove(), 1800);
    }
    say(it.id === 'talk' ? talkLine(notes, book.title) : randomLine(it), lineDuration(it));
    setTimeout(() => { drawCat(); catEl.className = 'cat'; busy = false; }, REACTION_MS);
  }

  function drawInteractions() {
    const stage = stageOf(myPct);
    $('#stage-text', root).textContent = STAGE_TEXT[stage];
    $('#interactions', root).innerHTML = interactionButtons(myPct);
  }

  $('#interactions', root).addEventListener('click', (e) => {
    const btn = e.target.closest('[data-id]');
    if (btn) interact(INTERACTIONS.find((it) => it.id === btn.dataset.id));
  });
  catEl.addEventListener('click', () => {
    if (myPct >= 25) interact(INTERACTIONS[0]);
    else say('쿨쿨… (아직 깊이 잠들어 있어요)');
  });

  // ---------- 진도 ----------
  const pform = $('#progress-form', root);
  const range = pform.elements.percent;
  const pageInput = pform.elements.page;
  range.addEventListener('input', () => {
    $('#pct-label', root).textContent = `${range.value}%`;
    if (pageInput) pageInput.value = Math.round((range.value / 100) * book.pages);
  });
  pageInput?.addEventListener('input', () => {
    const pct = Math.min(100, Math.round((Number(pageInput.value) / book.pages) * 100));
    range.value = pct;
    $('#pct-label', root).textContent = `${pct}%`;
  });
  pform.addEventListener('submit', async (e) => {
    e.preventDefault();
    const percent = Number(range.value);
    const before = stageOf(myPct);
    await api.setProgress(bookId, { percent, page: pageInput ? Number(pageInput.value) : null });
    myPct = percent;
    progress = await api.listProgress(bookId);
    const after = stageOf(myPct);
    if (after > before) {
      const unlocked = INTERACTIONS[after - 1];
      toast(after === 4 ? '🎉 완독! 고양이가 마을로 이사했어요' : `${unlocked.icon} "${unlocked.label}"이(가) 열렸어요!`);
      setTimeout(() => interact(unlocked), 300);
    } else toast('진도를 기록했어요');
    drawCat();
    drawInteractions();
    drawReaders();
  });

  function drawReaders() {
    const sorted = [...progress].sort((a, b) => b.percent - a.percent);
    $('#readers', root).innerHTML = sorted.length
      ? sorted.map((p) => `<li>${avatar(p, 24)}<span class="rname">${esc(p.name)}${p.percent >= 100 ? ' 👑' : ''}</span>${progressBar(p.percent)}<span class="tiny">${Math.round(p.percent)}%</span></li>`).join('')
      : '<li class="muted">아직 아무도 기록하지 않았어요. 첫 번째 독자가 되어 보세요!</li>';
  }

  // ---------- 발제 / 토론 ----------
  function noteFields(n = {}) {
    return `<input name="title" placeholder="제목 (예: 3장 발제 — 주인공의 선택)" value="${esc(n.title || '')}" required>
      <label class="inline">모임 날짜 <input type="date" name="meetingDate" value="${esc(n.meetingDate || '')}"></label>
      <textarea name="content" rows="6" placeholder="발제문, 질문, 토론에서 나온 이야기를 적어 주세요" required>${esc(n.content || '')}</textarea>`;
  }
  const readNote = (form) => {
    const fd = new FormData(form);
    return { title: fd.get('title').trim(), meetingDate: fd.get('meetingDate'), content: fd.get('content').trim() };
  };

  function drawNotes() {
    $$('.tab', root).forEach((t) => t.classList.toggle('active', t.dataset.tab === noteTab));
    $('#note-new summary', root).textContent = `＋ 새 ${NOTE_TYPES[noteTab]} 쓰기`;
    const list = notes.filter((n) => n.type === noteTab);
    $('#note-list', root).innerHTML = list.length ? list.map((n) => `
      <article class="note" data-id="${n.id}">
        <header>
          <h3>${esc(n.title)}</h3>
          <p class="tiny muted">${avatar(n.author, 18)} ${esc(n.author?.name)} · ${fmtDate(n.createdAt)}${n.meetingDate ? ` · 모임 ${esc(n.meetingDate)}` : ''}</p>
        </header>
        <div class="note-content">${esc(n.content)}</div>
        <div class="row">
          <button class="btn small ghost" data-act="comments">💬 댓글</button>
          ${n.author?.uid === me.uid ? '<button class="btn small ghost" data-act="edit">수정</button>' : ''}
          ${n.author?.uid === me.uid || isOwner ? '<button class="btn small ghost danger" data-act="delete">삭제</button>' : ''}
        </div>
        <div class="comments" hidden></div>
      </article>`).join('')
      : `<div class="empty small">아직 ${NOTE_TYPES[noteTab]}이(가) 없어요.</div>`;
  }

  async function drawComments(noteEl) {
    const noteId = noteEl.dataset.id;
    const box = $('.comments', noteEl);
    const comments = await api.listComments(bookId, noteId);
    box.innerHTML = `${comments.map((c) => `
      <div class="comment" data-cid="${c.id}">${avatar(c.author, 20)}<div><strong>${esc(c.author?.name)}</strong>
        <span class="tiny muted">${fmtDate(c.createdAt)}</span><p>${esc(c.text)}</p></div>
        ${c.author?.uid === me.uid || isOwner ? '<button class="btn small ghost" data-act="del-comment">✕</button>' : ''}</div>`).join('')}
      <form class="comment-form row"><input name="text" placeholder="댓글 달기" required><button class="btn small">등록</button></form>`;
    box.hidden = false;
  }

  $('.tabs', root).addEventListener('click', (e) => {
    const t = e.target.closest('.tab');
    if (t) { noteTab = t.dataset.tab; drawNotes(); }
  });

  $('#note-form', root).addEventListener('submit', async (e) => {
    e.preventDefault();
    await api.addNote(bookId, { type: noteTab, ...readNote(e.target) });
    e.target.reset();
    $('#note-new', root).open = false;
    notes = await api.listNotes(bookId);
    drawNotes();
    toast(`${NOTE_TYPES[noteTab]}을(를) 남겼어요`);
  });

  const noteList = $('#note-list', root);
  noteList.addEventListener('click', async (e) => {
    const btn = e.target.closest('[data-act]');
    if (!btn) return;
    const noteEl = btn.closest('.note');
    const note = notes.find((n) => n.id === noteEl.dataset.id);
    switch (btn.dataset.act) {
      case 'comments': {
        const box = $('.comments', noteEl);
        if (box.hidden) await drawComments(noteEl); else box.hidden = true;
        break;
      }
      case 'edit':
        noteEl.innerHTML = `<form class="note-edit">${noteFields(note)}
          <div class="row end"><button type="button" class="btn small" data-act="cancel">취소</button><button class="btn small primary">저장</button></div></form>`;
        break;
      case 'cancel':
        drawNotes();
        break;
      case 'delete':
        if (!confirm('이 글을 삭제할까요? 댓글도 함께 지워져요.')) return;
        await api.deleteNote(bookId, note.id);
        notes = notes.filter((n) => n.id !== note.id);
        drawNotes();
        break;
      case 'del-comment':
        await api.deleteComment(bookId, note.id, btn.closest('.comment').dataset.cid);
        await drawComments(noteEl);
        break;
    }
  });

  noteList.addEventListener('submit', async (e) => {
    e.preventDefault();
    const noteEl = e.target.closest('.note');
    const noteId = noteEl.dataset.id;
    if (e.target.classList.contains('comment-form')) {
      await api.addComment(bookId, noteId, e.target.elements.text.value.trim());
      await drawComments(noteEl);
    } else if (e.target.classList.contains('note-edit')) {
      await api.updateNote(bookId, noteId, readNote(e.target));
      notes = await api.listNotes(bookId);
      drawNotes();
    }
  });

  $('#delete', root)?.addEventListener('click', async () => {
    if (!confirm(`"${book.title}"과(와) 고양이, 모든 발제/토론 기록을 삭제할까요?`)) return;
    await api.deleteBook(bookId);
    toast('삭제했어요');
    location.hash = '#/';
  });

  drawCat();
  drawInteractions();
  drawReaders();
  drawNotes();
}
