// 사용자마다 하나씩 생기는 집사 캐릭터 (SVG)
// look: { skin, eyes, blush, hairStyle, hairColor, outfitStyle, outfit, bottom, hat, glasses, hold, accColor }
// 예전에 저장된 집사는 없는 항목을 DEFAULT_LOOK 값으로 채워 그립니다.

export const SKINS = [
  { id: 'porcelain', label: '뽀얀', color: '#FFE9DA' },
  { id: 'light', label: '밝은', color: '#FBE0C8' },
  { id: 'peach', label: '복숭아', color: '#F1C7A0' },
  { id: 'tan', label: '구릿빛', color: '#D9A479' },
  { id: 'caramel', label: '캐러멜', color: '#C68B5E' },
  { id: 'deep', label: '짙은', color: '#A86F4C' },
  { id: 'espresso', label: '에스프레소', color: '#7A4B33' },
];
export const EYES = [
  { id: 'dot', label: '동글' },
  { id: 'sparkle', label: '반짝' },
  { id: 'smile', label: '웃는 눈' },
  { id: 'sleepy', label: '졸린 눈' },
  { id: 'wink', label: '윙크' },
];
export const BLUSH = [
  { id: 'on', label: '볼터치' },
  { id: 'off', label: '없음' },
];
export const HAIR_STYLES = [
  { id: 'short', label: '짧은 머리' },
  { id: 'buzz', label: '스포츠' },
  { id: 'bob', label: '단발' },
  { id: 'long', label: '긴 머리' },
  { id: 'ponytail', label: '포니테일' },
  { id: 'twintail', label: '양갈래' },
  { id: 'bun', label: '똥머리' },
  { id: 'curly', label: '곱슬' },
];
export const HAIR_COLORS = [
  { id: 'black', label: '검정', color: '#2E2A2A' },
  { id: 'brown', label: '갈색', color: '#6A4528' },
  { id: 'chestnut', label: '밤색', color: '#8E5A3C' },
  { id: 'blond', label: '금발', color: '#E3B95F' },
  { id: 'red', label: '적갈색', color: '#B5513A' },
  { id: 'orange', label: '주황', color: '#E8873A' },
  { id: 'gray', label: '은발', color: '#B9B4AE' },
  { id: 'pink', label: '분홍', color: '#E89AB0' },
  { id: 'purple', label: '보라', color: '#8A5FC0' },
  { id: 'blue', label: '파랑', color: '#4A72C9' },
  { id: 'mint', label: '민트', color: '#6CC2A8' },
];
export const OUTFIT_STYLES = [
  { id: 'apron', label: '앞치마' },
  { id: 'hoodie', label: '후드티' },
  { id: 'sweater', label: '니트' },
  { id: 'suit', label: '정장' },
  { id: 'overalls', label: '멜빵바지' },
  { id: 'dress', label: '원피스' },
];
export const OUTFITS = [
  { id: 'navy', label: '남색', color: '#3D4E8A' },
  { id: 'green', label: '초록', color: '#4F8A5B' },
  { id: 'red', label: '빨강', color: '#C8553D' },
  { id: 'purple', label: '보라', color: '#7B4B94' },
  { id: 'mustard', label: '겨자', color: '#D9A43B' },
  { id: 'sky', label: '하늘', color: '#5AA9E6' },
  { id: 'pink', label: '분홍', color: '#E89AB0' },
  { id: 'mint', label: '민트', color: '#6CC2A8' },
  { id: 'beige', label: '베이지', color: '#D8C3A0' },
  { id: 'black', label: '검정', color: '#3A3A42' },
  { id: 'white', label: '하양', color: '#F5F1EA' },
];
export const BOTTOMS = [
  { id: 'dark', label: '진갈색', color: '#4A3B35' },
  { id: 'navy', label: '남색', color: '#2E3B6B' },
  { id: 'denim', label: '청바지', color: '#4A6FA5' },
  { id: 'black', label: '검정', color: '#2E2A2A' },
  { id: 'gray', label: '회색', color: '#8A8F96' },
  { id: 'beige', label: '베이지', color: '#CDB892' },
];
export const HATS = [
  { id: 'none', label: '없음' },
  { id: 'catears', label: '고양이 귀' },
  { id: 'ribbon', label: '리본' },
  { id: 'flower', label: '꽃' },
  { id: 'beret', label: '베레모' },
  { id: 'beanie', label: '털모자' },
  { id: 'straw', label: '밀짚모자' },
];
export const GLASSES = [
  { id: 'none', label: '없음' },
  { id: 'round', label: '동그란 안경' },
  { id: 'square', label: '네모 안경' },
  { id: 'sunglasses', label: '선글라스' },
];
export const HOLDS = [
  { id: 'none', label: '없음' },
  { id: 'book', label: '책' },
  { id: 'mug', label: '머그컵' },
  { id: 'flower', label: '꽃 한 송이' },
  { id: 'fishtoy', label: '낚싯대 장난감' },
];
export const ACC_COLORS = [
  { id: 'auto', label: '기본', color: '', swatch: 'conic-gradient(#E85D75, #F4C542, #5AA9E6, #7B4B94, #E85D75)' },
  { id: 'red', label: '빨강', color: '#D9534F' },
  { id: 'pink', label: '분홍', color: '#E85D75' },
  { id: 'orange', label: '주황', color: '#F4A259' },
  { id: 'yellow', label: '노랑', color: '#F4C542' },
  { id: 'green', label: '초록', color: '#5DA67A' },
  { id: 'sky', label: '하늘', color: '#5AA9E6' },
  { id: 'navy', label: '남색', color: '#3D4E8A' },
  { id: 'purple', label: '보라', color: '#7B4B94' },
  { id: 'black', label: '검정', color: '#3A3A42' },
];

// 꾸미기 화면용 항목 정의 (group 별로 탭이 나뉨)
export const BUTLER_PARTS = [
  { group: '얼굴', key: 'skin', label: '피부', type: 'color', items: SKINS },
  { group: '얼굴', key: 'eyes', label: '눈', type: 'chip', items: EYES },
  { group: '얼굴', key: 'blush', label: '볼', type: 'chip', items: BLUSH },
  { group: '머리', key: 'hairStyle', label: '머리 모양', type: 'chip', items: HAIR_STYLES },
  { group: '머리', key: 'hairColor', label: '머리색', type: 'color', items: HAIR_COLORS },
  { group: '옷', key: 'outfitStyle', label: '옷 종류', type: 'chip', items: OUTFIT_STYLES },
  { group: '옷', key: 'outfit', label: '옷 색', type: 'color', items: OUTFITS },
  { group: '옷', key: 'bottom', label: '바지 · 스타킹 색', type: 'color', items: BOTTOMS },
  { group: '소품', key: 'hat', label: '머리 장식', type: 'chip', items: HATS },
  { group: '소품', key: 'glasses', label: '안경', type: 'chip', items: GLASSES },
  { group: '소품', key: 'hold', label: '손에 든 것', type: 'chip', items: HOLDS },
  { group: '소품', key: 'accColor', label: '소품 색', type: 'color', items: ACC_COLORS },
];

export const DEFAULT_LOOK = {
  skin: 'light', eyes: 'dot', blush: 'on', hairStyle: 'short', hairColor: 'brown',
  outfitStyle: 'apron', outfit: 'navy', bottom: 'dark', hat: 'none', glasses: 'none', hold: 'none', accColor: 'auto',
};

// 시드 고정 난수 (같은 uid → 같은 모습)
function mulberry32(a) {
  return () => {
    a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function randomLook(seed = Math.floor(Math.random() * 1e9)) {
  const rnd = mulberry32(seed);
  const pick = (arr) => arr[Math.floor(rnd() * arr.length)].id;
  const maybe = (arr) => (rnd() < 0.6 ? 'none' : pick(arr.slice(1)));
  return {
    skin: pick(SKINS), eyes: pick(EYES), blush: rnd() < 0.7 ? 'on' : 'off',
    hairStyle: pick(HAIR_STYLES), hairColor: pick(HAIR_COLORS),
    outfitStyle: pick(OUTFIT_STYLES), outfit: pick(OUTFITS), bottom: pick(BOTTOMS),
    hat: maybe(HATS), glasses: maybe(GLASSES), hold: maybe(HOLDS), accColor: 'auto',
  };
}

const LINE = '#4A3B35';
const find = (arr, id) => arr.find((x) => x.id === id) || arr[0];
// 외곽선 속성 (같은 속성을 두 번 쓰면 이미지로 불러올 때 SVG가 깨지므로 굵기는 인자로)
const S = (w = 2.5) => `stroke="${LINE}" stroke-width="${w}" stroke-linejoin="round"`;
const CAP = 'M25 50 Q24 20 50 20 Q76 20 75 50 Q68 34 50 33 Q33 34 25 50 Z';

// 머리: 몸 뒤(back)와 얼굴 앞(front)으로 나눠 그림
function hair(style, c) {
  const cap = `<path d="${CAP}" fill="${c}" ${S()}/>`;
  switch (style) {
    case 'buzz':
      return { back: '', front: `<path d="M26 46 Q26 22 50 22 Q74 22 74 46 Q64 30 50 30 Q36 30 26 46 Z" fill="${c}" ${S()}/>` };
    case 'bob':
      return { back: '', front: `<path d="M26 44 Q20 70 36 72 L34 48 Z M74 44 Q80 70 64 72 L66 48 Z" fill="${c}" ${S()}/>${cap}` };
    case 'long':
      return { back: `<path d="M26 40 Q18 70 22 96 L40 94 L36 50 Z M74 40 Q82 70 78 96 L60 94 L64 50 Z" fill="${c}" ${S()}/>`, front: cap };
    case 'ponytail':
      return { back: `<path d="M68 30 Q96 36 86 80 Q80 62 66 44 Z" fill="${c}" ${S()}/>`, front: `${cap}<circle cx="72" cy="34" r="4" fill="#E85D75" ${S()}/>` };
    case 'twintail':
      return {
        back: `<ellipse cx="20" cy="66" rx="8" ry="20" fill="${c}" ${S()} transform="rotate(12 20 66)"/><ellipse cx="80" cy="66" rx="8" ry="20" fill="${c}" ${S()} transform="rotate(-12 80 66)"/>`,
        front: `${cap}<circle cx="27" cy="44" r="3.5" fill="#E85D75" ${S()}/><circle cx="73" cy="44" r="3.5" fill="#E85D75" ${S()}/>`,
      };
    case 'bun':
      return { back: `<circle cx="50" cy="16" r="10" fill="${c}" ${S()}/>`, front: cap };
    case 'curly':
      return {
        back: '',
        front: `<g fill="${c}" ${S()}>${[[27, 46, 8], [29, 34, 9], [38, 25, 9], [50, 21, 9], [62, 25, 9], [71, 34, 9], [73, 46, 8]]
          .map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}"/>`).join('')}</g><path d="M30 44 Q50 26 70 44 Q60 34 50 34 Q40 34 30 44 Z" fill="${c}"/>`,
      };
    default:
      return { back: '', front: cap };
  }
}

function torso(style, outfit, bottom, acc) {
  const T = `<path d="M30 118 Q28 80 50 74 Q72 80 70 118 Z" fill="${outfit}" ${S()}/>`;
  switch (style) {
    case 'hoodie':
      return `${T}<path d="M34 80 Q50 94 66 80 Q62 72 50 72 Q38 72 34 80 Z" fill="${outfit}" ${S()}/>
        <path d="M38 100 H62 L58 114 H42 Z" fill="rgba(0,0,0,.08)" ${S(1.5)}/>
        <path d="M46 84 V94 M54 84 V94" stroke="#fff" stroke-width="2" stroke-linecap="round"/>`;
    case 'sweater':
      return `${T}<path d="M30 98 Q50 103 70 98 L70 106 Q50 111 30 106 Z" fill="rgba(255,255,255,.75)"/>
        <path d="M42 76 Q50 82 58 76" stroke="${LINE}" stroke-width="2" fill="none"/><path d="M40 78 Q50 86 60 78" stroke="rgba(0,0,0,.2)" stroke-width="3" fill="none"/>`;
    case 'suit':
      return `<path d="M30 118 Q28 80 50 74 Q72 80 70 118 Z" fill="#FFFDF8" ${S()}/>
        <path d="M30 118 Q28 80 46 75 L50 100 L44 118 Z M70 118 Q72 80 54 75 L50 100 L56 118 Z" fill="${outfit}" ${S()}/>
        <path d="M48 78 L52 78 L54 96 L50 102 L46 96 Z" fill="${acc || '#C8553D'}" ${S(1.5)}/>`;
    case 'overalls':
      return `${T}<path d="M38 92 H62 V118 H38 Z" fill="${bottom}" ${S()}/>
        <path d="M40 92 L37 77 M60 92 L63 77" stroke="${bottom}" stroke-width="4" stroke-linecap="round"/>
        <circle cx="41" cy="95" r="2" fill="#F4C542"/><circle cx="59" cy="95" r="2" fill="#F4C542"/>
        <rect x="45" y="100" width="10" height="8" rx="1" fill="none" stroke="${LINE}" stroke-width="1.2"/>`;
    case 'dress':
      return `<path d="M26 126 Q28 80 50 74 Q72 80 74 126 Z" fill="${outfit}" ${S()}/>
        <path d="M40 76 Q50 86 60 76" stroke="${LINE}" stroke-width="2" fill="#FFFDF8"/>
        <path d="M32 96 Q50 100 68 96" stroke="${acc || 'rgba(255,255,255,.8)'}" stroke-width="4" fill="none"/>`;
    default: // apron
      return `${T}<path d="M40 86 L60 86 L63 118 L37 118 Z" fill="#FFFDF8" ${S()}/>
        <path d="M45 100 L55 100 L55 108 L45 108 Z" fill="none" ${S(1.5)}/>
        <path d="M44 79 L50 85 L56 79" stroke="${LINE}" stroke-width="2" fill="#FFFDF8" stroke-linejoin="round"/>`;
  }
}

function eyes(style) {
  const dot = (x) => `<circle cx="${x}" cy="52" r="3" fill="#2E2A2A"/>`;
  const arc = (x, up) => `<path d="M${x - 3.5} 53 Q${x} ${up ? 48 : 56} ${x + 3.5} 53" stroke="#2E2A2A" stroke-width="2" fill="none" stroke-linecap="round"/>`;
  switch (style) {
    case 'sparkle': return [41, 59].map((x) => `<circle cx="${x}" cy="52" r="4.5" fill="#2E2A2A"/><circle cx="${x + 1.6}" cy="50.4" r="1.7" fill="#fff"/>`).join('');
    case 'smile': return arc(41, true) + arc(59, true);
    case 'sleepy': return arc(41, false) + arc(59, false);
    case 'wink': return dot(41) + arc(59, true);
    default: return dot(41) + dot(59);
  }
}

function glasses(style) {
  switch (style) {
    case 'round': return `<g stroke="${LINE}" stroke-width="2" fill="rgba(255,255,255,.2)"><circle cx="41" cy="52" r="7"/><circle cx="59" cy="52" r="7"/><path d="M48 51 L52 51" fill="none"/></g>`;
    case 'square': return `<g stroke="${LINE}" stroke-width="2" fill="rgba(255,255,255,.2)"><rect x="33" y="46" width="15" height="11" rx="2"/><rect x="52" y="46" width="15" height="11" rx="2"/><path d="M48 51 L52 51" fill="none"/></g>`;
    case 'sunglasses': return `<g stroke="${LINE}" stroke-width="1.5" fill="#2E2A2A"><rect x="32" y="46" width="16" height="11" rx="5"/><rect x="52" y="46" width="16" height="11" rx="5"/><path d="M48 50 L52 50" stroke-width="2.5"/></g>`;
    default: return '';
  }
}

function hat(style, acc) {
  switch (style) {
    case 'catears': {
      const c = acc || '#3A3A42';
      return `<path d="M27 36 Q50 16 73 36" stroke="${c}" stroke-width="4" fill="none" stroke-linecap="round"/>
        <g fill="${c}" ${S()}><path d="M27 30 L29 10 L43 22 Z"/><path d="M73 30 L71 10 L57 22 Z"/></g>
        <path d="M31 25 L32 15 L39 21 Z M69 25 L68 15 L61 21 Z" fill="#F7A1B5"/>`;
    }
    case 'ribbon': {
      const c = acc || '#E85D75';
      return `<g fill="${c}" ${S(2)}><path d="M66 24 L54 16 L56 32 Z"/><path d="M66 24 L78 16 L76 32 Z"/><circle cx="66" cy="24" r="4"/></g>`;
    }
    case 'flower': {
      const c = acc || '#FFD1DC';
      return `<g transform="translate(30 30)"><g fill="${c}" stroke="${LINE}" stroke-width="1.5"><circle cx="0" cy="-6" r="4.5"/><circle cx="5.7" cy="-1.9" r="4.5"/>
        <circle cx="3.5" cy="4.9" r="4.5"/><circle cx="-3.5" cy="4.9" r="4.5"/><circle cx="-5.7" cy="-1.9" r="4.5"/></g><circle r="3.4" fill="#F4C542"/></g>`;
    }
    case 'beret': {
      const c = acc || '#7B4B94';
      return `<g ${S(2)}><ellipse cx="46" cy="24" rx="27" ry="9" fill="${c}" transform="rotate(-12 46 24)"/><circle cx="47" cy="14" r="3" fill="${c}"/></g>`;
    }
    case 'beanie': {
      const c = acc || '#5AA9E6';
      return `<g ${S(2)}><path d="M24 40 Q24 12 50 12 Q76 12 76 40 Z" fill="${c}"/><rect x="22" y="34" width="56" height="9" rx="4" fill="${c}"/><circle cx="50" cy="10" r="6" fill="#fff"/></g>`;
    }
    case 'straw': {
      const c = acc || '#D9534F';
      return `<g ${S(2)}><ellipse cx="50" cy="30" rx="38" ry="7" fill="#E9CF8E"/><path d="M32 30 Q32 8 50 8 Q68 8 68 30 Z" fill="#E9CF8E"/></g>
        <rect x="32" y="22" width="36" height="5" fill="${c}"/>`;
    }
    default: return '';
  }
}

function held(style, acc) {
  switch (style) {
    case 'book':
      return `<g ${S(2)} transform="rotate(-10 76 110)"><rect x="67" y="98" width="18" height="23" rx="2" fill="${acc || '#3D6E8A'}"/>
        <path d="M70 101 H82 V118 H70 Z" fill="#FFF8E8" stroke-width="1"/></g>`;
    case 'mug':
      return `<g ${S(2)}><rect x="68" y="102" width="14" height="14" rx="2" fill="${acc || '#FFFDF8'}"/><path d="M82 105 Q88 109 82 113" fill="none"/></g>
        <path d="M72 98 Q70 94 73 90 M77 98 Q75 94 78 90" stroke="#B9B4AE" stroke-width="1.5" fill="none" stroke-linecap="round"/>`;
    case 'flower':
      return `<path d="M73 111 L79 92" stroke="#5DA67A" stroke-width="2.5"/><g transform="translate(80 89)"><g fill="${acc || '#F28CA0'}" stroke="${LINE}" stroke-width="1.2">
        <circle cx="0" cy="-4.5" r="3.6"/><circle cx="4.3" cy="-1.4" r="3.6"/><circle cx="2.6" cy="3.7" r="3.6"/><circle cx="-2.6" cy="3.7" r="3.6"/><circle cx="-4.3" cy="-1.4" r="3.6"/></g><circle r="2.6" fill="#F4C542"/></g>`;
    case 'fishtoy':
      return `<path d="M73 111 L92 86" stroke="#8C5A35" stroke-width="2.5" stroke-linecap="round"/><path d="M92 86 Q96 96 92 104" stroke="${LINE}" stroke-width="1" fill="none"/>
        <g ${S(1.5)}><ellipse cx="92" cy="108" rx="6" ry="4" fill="${acc || '#F4A259'}"/><path d="M86 108 L81 104 L81 112 Z" fill="${acc || '#F4A259'}"/></g>`;
    default: return '';
  }
}

export function butlerSVG(look) {
  const l = { ...DEFAULT_LOOK, ...look };
  const skin = find(SKINS, l.skin).color;
  const hairColor = find(HAIR_COLORS, l.hairColor).color;
  const outfit = find(OUTFITS, l.outfit).color;
  const bottom = find(BOTTOMS, l.bottom).color;
  const acc = l.accColor === 'auto' ? null : find(ACC_COLORS, l.accColor).color;
  const h = hair(l.hairStyle, hairColor);
  return `<svg viewBox="0 0 100 140" width="100" height="140" xmlns="http://www.w3.org/2000/svg">
  ${h.back}
  <g ${S()}>
    <rect x="38" y="110" width="10" height="22" rx="3" fill="${bottom}"/>
    <rect x="52" y="110" width="10" height="22" rx="3" fill="${bottom}"/>
    <ellipse cx="42" cy="133" rx="8" ry="4" fill="#2E2A2A"/><ellipse cx="58" cy="133" rx="8" ry="4" fill="#2E2A2A"/>
    <ellipse cx="27" cy="96" rx="6.5" ry="15" fill="${outfit}"/><ellipse cx="73" cy="96" rx="6.5" ry="15" fill="${outfit}"/>
  </g>
  ${torso(l.outfitStyle, outfit, bottom, acc)}
  <g ${S()}><circle cx="27" cy="111" r="5" fill="${skin}"/><circle cx="73" cy="111" r="5" fill="${skin}"/></g>
  ${held(l.hold, acc)}
  <circle cx="50" cy="48" r="25" fill="${skin}" ${S()}/>
  ${h.front}
  ${eyes(l.eyes)}
  ${l.blush === 'off' ? '' : '<ellipse cx="35" cy="60" rx="5" ry="3" fill="#F7A1B5" opacity=".7"/><ellipse cx="65" cy="60" rx="5" ry="3" fill="#F7A1B5" opacity=".7"/>'}
  <path d="M45 61 Q50 66 55 61" stroke="${LINE}" stroke-width="2" fill="none" stroke-linecap="round"/>
  ${glasses(l.glasses)}${hat(l.hat, acc)}
</svg>`;
}

const imageCache = new Map();
export function butlerImage(look) {
  const key = JSON.stringify(look);
  if (!imageCache.has(key)) {
    const img = new Image();
    img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(butlerSVG(look));
    imageCache.set(key, img);
  }
  return imageCache.get(key);
}
