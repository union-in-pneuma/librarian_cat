// 책 검색: Kakao(Daum) 책 검색 API 우선, 키가 없으면 Google Books.
// 결과는 { title, author, publisher, year, isbn, pages, coverUrl, description, thumbnail, link } 로 정규화합니다.
import { kakaoRestKey } from './kakao-config.js';

export const SEARCH_SOURCE = kakaoRestKey ? 'Kakao' : 'Google Books';

const isIsbn = (q) => /^[\d-]{10,17}$/.test(q.replace(/\s/g, ''));

// Kakao 운영정책상 제공 데이터의 영구 저장이 제한되므로, 저장되는 필드는 기본 서지 정보만 채웁니다.
// 소개(contents)와 표지(thumbnail)는 검색 결과 화면에서만 보여줍니다.
async function searchKakao(q) {
  const params = new URLSearchParams({ query: q.replace(/\s/g, isIsbn(q) ? '' : ' '), size: '8' });
  if (isIsbn(q)) params.set('target', 'isbn');
  const res = await fetch(`https://dapi.kakao.com/v3/search/book?${params}`, {
    headers: { Authorization: `KakaoAK ${kakaoRestKey}` },
  });
  if (res.status === 429) throw new Error('오늘 검색 한도를 넘었어요. 내일 다시 시도해 주세요.');
  if (!res.ok) throw new Error(`Kakao 검색 실패 (${res.status})`);
  return (await res.json()).documents.map((d) => {
    const isbns = d.isbn.split(' ').filter(Boolean);
    return {
      title: d.title,
      author: [...d.authors, ...d.translators.map((t) => `${t}(옮김)`)].join(', '),
      publisher: d.publisher,
      year: (d.datetime || '').slice(0, 4),
      isbn: isbns.find((x) => x.length === 13) || isbns[0] || '',
      pages: null,
      coverUrl: '',
      description: '',
      thumbnail: d.thumbnail,
      link: d.url,
    };
  });
}

async function searchGoogle(q) {
  const res = await fetch(`https://www.googleapis.com/books/v1/volumes?maxResults=8&q=${encodeURIComponent(isIsbn(q) ? `isbn:${q.replace(/-/g, '')}` : q)}`);
  if (!res.ok) throw new Error(`Google Books 검색 실패 (${res.status})`);
  return ((await res.json()).items || []).map(({ volumeInfo: v }) => {
    const ids = v.industryIdentifiers || [];
    const cover = (v.imageLinks?.thumbnail || '').replace(/^http:/, 'https:');
    return {
      title: v.title + (v.subtitle ? `: ${v.subtitle}` : ''),
      author: (v.authors || []).join(', '),
      publisher: v.publisher || '',
      year: (v.publishedDate || '').slice(0, 4),
      isbn: (ids.find((x) => x.type === 'ISBN_13') || ids[0])?.identifier || '',
      pages: v.pageCount || null,
      coverUrl: cover,
      description: v.description || '',
      thumbnail: cover,
      link: v.infoLink,
    };
  });
}

export const searchBooks = (q) => (kakaoRestKey ? searchKakao(q) : searchGoogle(q));
