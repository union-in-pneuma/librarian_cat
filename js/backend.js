// 데이터/인증 계층. Firebase 설정이 있으면 Firestore + Google 로그인,
// 없으면 localStorage 기반 데모 모드로 같은 API를 제공합니다.
import { firebaseConfig } from './firebase-config.js';

export const DEMO_MODE = !firebaseConfig.apiKey;
const FIREBASE_CDN = 'https://www.gstatic.com/firebasejs/10.12.2';

// ---------- 저장소 어댑터: 컬렉션 경로 문자열("books/abc/notes") 단위로 동작 ----------

async function createFirebaseStore() {
  const { initializeApp } = await import(`${FIREBASE_CDN}/firebase-app.js`);
  const A = await import(`${FIREBASE_CDN}/firebase-auth.js`);
  const F = await import(`${FIREBASE_CDN}/firebase-firestore.js`);
  const app = initializeApp(firebaseConfig);
  const auth = A.getAuth(app);
  const db = F.getFirestore(app);

  const col = (path) => F.collection(db, ...path.split('/'));
  const docs = (snap) => snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  const toUser = (u) => u && { uid: u.uid, name: u.displayName || u.email, photo: u.photoURL || '' };

  return {
    onAuth: (cb) => A.onAuthStateChanged(auth, (u) => cb(toUser(u))),
    signIn: () => A.signInWithPopup(auth, new A.GoogleAuthProvider()),
    signOut: () => A.signOut(auth),
    currentUser: () => toUser(auth.currentUser),

    list: async (path) => docs(await F.getDocs(col(path))),
    group: async (name) => docs(await F.getDocs(F.collectionGroup(db, name))),
    get: async (path, id) => {
      const s = await F.getDoc(F.doc(col(path), id));
      return s.exists() ? { id: s.id, ...s.data() } : null;
    },
    add: async (path, data) => (await F.addDoc(col(path), data)).id,
    set: (path, id, data) => F.setDoc(F.doc(col(path), id), data),
    update: (path, id, data) => F.updateDoc(F.doc(col(path), id), data),
    remove: (path, id) => F.deleteDoc(F.doc(col(path), id)),
  };
}

function createLocalStore() {
  const DB_KEY = 'librarian-cat-db';
  const USER_KEY = 'librarian-cat-demo-user';
  const load = () => JSON.parse(localStorage.getItem(DB_KEY) || '{}');
  const save = (db) => localStorage.setItem(DB_KEY, JSON.stringify(db));
  const rows = (table) => Object.entries(table || {}).map(([id, d]) => ({ id, ...structuredClone(d) }));
  const newId = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
  let user = JSON.parse(localStorage.getItem(USER_KEY) || 'null');
  let listener = () => {};

  const mutate = (fn) => { const db = load(); fn(db); save(db); };

  return {
    onAuth: (cb) => { listener = cb; cb(user); },
    signIn: async () => {
      const name = prompt('데모 모드 닉네임을 입력하세요', '책 읽는 집사') || '책 읽는 집사';
      user = { uid: 'demo-' + name, name, photo: '' };
      localStorage.setItem(USER_KEY, JSON.stringify(user));
      listener(user);
    },
    signOut: async () => { user = null; localStorage.removeItem(USER_KEY); listener(null); },
    currentUser: () => user,

    list: async (path) => rows(load()[path]),
    group: async (name) => {
      const db = load();
      return Object.keys(db).filter((p) => p.endsWith('/' + name)).flatMap((p) => rows(db[p]));
    },
    get: async (path, id) => {
      const d = load()[path]?.[id];
      return d ? { id, ...d } : null;
    },
    add: async (path, data) => {
      const id = newId();
      mutate((db) => { (db[path] ||= {})[id] = data; });
      return id;
    },
    set: async (path, id, data) => mutate((db) => { (db[path] ||= {})[id] = data; }),
    update: async (path, id, data) => mutate((db) => { Object.assign(db[path][id], data); }),
    remove: async (path, id) => mutate((db) => { delete db[path]?.[id]; }),
  };
}

const store = DEMO_MODE ? createLocalStore() : await createFirebaseStore();

// ---------- 도메인 API ----------

const byCreated = (a, b) => (a.createdAt || 0) - (b.createdAt || 0);
const me = () => store.currentUser();
const notesPath = (bookId) => `books/${bookId}/notes`;
const commentsPath = (bookId, noteId) => `books/${bookId}/notes/${noteId}/comments`;
const progressPath = (bookId) => `books/${bookId}/progress`;

export const api = {
  onAuth: store.onAuth,
  signIn: store.signIn,
  signOut: store.signOut,
  me,

  // 책
  listBooks: async () => (await store.list('books')).sort(byCreated).reverse(),
  getBook: (id) => store.get('books', id),
  createBook: (data) => store.add('books', { ...data, createdBy: me(), createdAt: Date.now() }),
  updateBook: (id, data) => store.update('books', id, { ...data, updatedAt: Date.now() }),
  async deleteBook(id) {
    for (const note of await store.list(notesPath(id))) await api.deleteNote(id, note.id);
    for (const p of await store.list(progressPath(id))) await store.remove(progressPath(id), p.id);
    await store.remove('books', id);
  },

  // 독서 진행도 (문서 id = 사용자 uid)
  listProgress: (bookId) => store.list(progressPath(bookId)),
  listAllProgress: () => store.group('progress'),
  setProgress(bookId, { page, percent }) {
    const u = me();
    return store.set(progressPath(bookId), u.uid, {
      bookId, uid: u.uid, name: u.name, photo: u.photo, page, percent, updatedAt: Date.now(),
    });
  },

  // 발제 / 토론 기록
  listNotes: async (bookId) => (await store.list(notesPath(bookId))).sort(byCreated).reverse(),
  addNote: (bookId, data) => store.add(notesPath(bookId), { ...data, author: me(), createdAt: Date.now() }),
  updateNote: (bookId, id, data) => store.update(notesPath(bookId), id, { ...data, updatedAt: Date.now() }),
  async deleteNote(bookId, id) {
    for (const c of await store.list(commentsPath(bookId, id))) await store.remove(commentsPath(bookId, id), c.id);
    await store.remove(notesPath(bookId), id);
  },

  // 댓글
  listComments: async (bookId, noteId) => (await store.list(commentsPath(bookId, noteId))).sort(byCreated),
  addComment: (bookId, noteId, text) =>
    store.add(commentsPath(bookId, noteId), { text, author: me(), createdAt: Date.now() }),
  deleteComment: (bookId, noteId, id) => store.remove(commentsPath(bookId, noteId), id),
};
