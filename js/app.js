import { api, DEMO_MODE } from './backend.js';
import { catSVG } from './cat.js';
import { randomLook } from './butler.js';
import { $, esc, avatar, toast } from './util.js';
import { renderLibrary } from './views/library.js';
import { renderBookForm } from './views/bookForm.js';
import { renderBookDetail } from './views/bookDetail.js';
import { renderVillage } from './views/villageView.js';

const ROUTES = [
  [/^#?\/?$/, (root) => renderLibrary(root)],
  [/^#\/new$/, (root) => renderBookForm(root, null)],
  [/^#\/book\/([^/]+)\/edit$/, (root, id) => renderBookForm(root, id)],
  [/^#\/book\/([^/]+)$/, (root, id) => renderBookDetail(root, id)],
  [/^#\/village$/, (root) => renderVillage(root)],
];

const main = $('#main');
let cleanup = null;
let renderSeq = 0;

async function route() {
  if (!api.me()) return renderLogin();
  cleanup?.();
  cleanup = null;
  const seq = ++renderSeq;
  const hash = location.hash || '#/';
  document.querySelectorAll('.nav a').forEach((a) =>
    a.classList.toggle('active', a.getAttribute('href') === (hash.startsWith('#/village') ? '#/village' : '#/')));
  main.innerHTML = '<div class="loading">🐾 불러오는 중…</div>';
  for (const [re, view] of ROUTES) {
    const m = hash.match(re);
    if (!m) continue;
    try {
      const c = await view(main, ...m.slice(1).map(decodeURIComponent));
      if (seq === renderSeq) cleanup = c || null; else c?.();
    } catch (err) {
      console.error(err);
      main.innerHTML = `<div class="empty">문제가 생겼어요: ${esc(err.message)}</div>`;
    }
    window.scrollTo(0, 0);
    return;
  }
  main.innerHTML = '<div class="empty">페이지를 찾을 수 없어요. <a href="#/">서재로</a></div>';
}

function renderHeader(user) {
  $('#user').innerHTML = user
    ? `${avatar(user, 30)}<span class="uname">${esc(user.name)}</span><button class="btn small ghost" id="logout">로그아웃</button>`
    : '';
  $('#logout')?.addEventListener('click', () => api.signOut());
  $('.nav').hidden = !user;
}

function renderLogin() {
  cleanup?.();
  cleanup = null;
  main.innerHTML = `
    <section class="login">
      <div class="login-cat">${catSVG({ fur: 'cheese', pattern: 'tabby', accessories: ['glasses'] }, { mood: 'happy' })}</div>
      <h1>Librarian Cat</h1>
      <p>책 한 권마다 고양이 한 마리.<br>함께 읽고, 발제하고, 고양이 마을을 키워요.</p>
      <button class="btn primary big" id="login">${DEMO_MODE ? '데모로 시작하기' : 'Google 계정으로 로그인'}</button>
      ${DEMO_MODE ? '<p class="tiny muted">Firebase 설정 전이라 이 브라우저에만 저장되는 데모 모드예요.</p>' : ''}
    </section>`;
  $('#login').addEventListener('click', async () => {
    try { await api.signIn(); } catch (err) { toast('로그인 실패: ' + err.message); }
  });
}

if (DEMO_MODE) document.body.classList.add('demo');
window.addEventListener('hashchange', route);
api.onAuth(async (user) => {
  renderHeader(user);
  if (user) {
    try {
      const butler = await api.ensureButler(randomLook());
      if (!butler.updatedAt && butler.createdAt > Date.now() - 5000) toast(`🧑 ${butler.name} 집사가 마을에 왔어요!`);
    } catch (err) { console.error('집사 생성 실패', err); }
  }
  route();
});
