// 독서 진도에 따라 열리는 고양이 상호작용 (책 상세 화면과 고양이 마을에서 공용)
export const INTERACTIONS = [
  { at: 25, id: 'pet', icon: '🤲', label: '쓰다듬기', mood: 'happy', anim: 'purr', fx: '💕', lines: ['골골골…', '거기 좋다냥~', '조금만 더 쓰다듬어 줘'] },
  { at: 50, id: 'treat', icon: '🐟', label: '간식 주기', mood: 'love', anim: 'eat', fx: '🐟', lines: ['냠냠! 최고다냥', '츄르는 사랑이야', '한 개 더…?'] },
  { at: 75, id: 'play', icon: '🧶', label: '털실 놀이', mood: 'surprised', anim: 'jump', fx: '🧶', lines: ['잡았다냥!', '한 번 더!', '이번엔 안 놓쳐!'] },
  { at: 100, id: 'talk', icon: '💬', label: '책 이야기', mood: 'happy', anim: 'nod', fx: '✨', lines: [] },
];

export const REACTION_MS = 1600;
export const lineDuration = (it) => (it.id === 'talk' ? 5000 : 2200);

/** 상호작용 버튼 목록 HTML. percent = 내 진도 */
export const interactionButtons = (percent) => INTERACTIONS.map((it) => {
  const open = percent >= it.at;
  return `<button class="btn interact ${open ? '' : 'locked'}" data-id="${it.id}" ${open ? '' : 'disabled'} title="${open ? '' : `${it.at}% 읽으면 열려요`}">
    <span>${open ? it.icon : '🔒'}</span>${it.label}<small>${it.at}%</small></button>`;
}).join('');

/** 100% 보상: 이 책의 발제/토론 기록 중 한 구절을 고양이가 들려줌 */
export function talkLine(notes, bookTitle) {
  const pool = notes.flatMap((n) => [n.title, ...String(n.content || '').split(/\n+/)])
    .map((s) => s.trim()).filter((s) => s.length > 4);
  if (!pool.length) return `"${bookTitle}" 정말 재밌었다냥! 발제를 남겨주면 내가 기억해둘게.`;
  const line = pool[Math.floor(Math.random() * pool.length)];
  return `기억나냥? "${line.length > 70 ? line.slice(0, 70) + '…' : line}"`;
}

export const randomLine = (it) => it.lines[Math.floor(Math.random() * it.lines.length)];
