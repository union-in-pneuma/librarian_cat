// 책(고양이)의 공용 상태: 모두에게 같은 결과가 나오도록 진도 목록만으로 계산합니다.

export function hash(str) {
  let h = 2166136261;
  for (const ch of str) {
    h ^= ch.codePointAt(0);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

// 로컬 날짜(YYYY-MM-DD). 동점자 중 따라다닐 집사가 하루 단위로 바뀝니다.
const dayKey = () => new Date().toLocaleDateString('sv-SE');

/**
 * best: 가장 많이 읽은 사람의 진도 (고양이 모습은 이 값으로 결정)
 * owner: 고양이가 따라다니는 집사의 진도 문서. 동점이면 (책 id + 날짜) 시드로 무작위 선택
 * tied: 동점자 목록
 */
export function bookStatus(bookId, progress) {
  const readers = progress.filter((p) => p.bookId === bookId && p.percent > 0);
  if (!readers.length) return { best: 0, owner: null, tied: [] };
  const best = Math.max(...readers.map((p) => p.percent));
  const tied = readers.filter((p) => p.percent === best).sort((a, b) => (a.uid < b.uid ? -1 : 1));
  return { best, owner: tied[hash(bookId + dayKey()) % tied.length], tied };
}
