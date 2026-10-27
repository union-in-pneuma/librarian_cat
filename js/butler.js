// 사용자마다 하나씩 생기는 집사 캐릭터 (SVG)
// look: { skin, hairColor, hairStyle, outfit }

export const SKINS = [
  { id: 'light', label: '밝은', color: '#FBE0C8' },
  { id: 'peach', label: '복숭아', color: '#F1C7A0' },
  { id: 'tan', label: '구릿빛', color: '#D9A479' },
  { id: 'deep', label: '짙은', color: '#A86F4C' },
];
export const HAIR_COLORS = [
  { id: 'black', label: '검정', color: '#2E2A2A' },
  { id: 'brown', label: '갈색', color: '#6A4528' },
  { id: 'blond', label: '금발', color: '#E3B95F' },
  { id: 'red', label: '적갈색', color: '#B5513A' },
  { id: 'gray', label: '은발', color: '#B9B4AE' },
  { id: 'pink', label: '분홍', color: '#E89AB0' },
];
export const HAIR_STYLES = [
  { id: 'short', label: '짧은 머리' },
  { id: 'bob', label: '단발' },
  { id: 'long', label: '긴 머리' },
  { id: 'bun', label: '똥머리' },
];
export const OUTFITS = [
  { id: 'navy', label: '남색', color: '#3D4E8A' },
  { id: 'green', label: '초록', color: '#4F8A5B' },
  { id: 'red', label: '빨강', color: '#C8553D' },
  { id: 'purple', label: '보라', color: '#7B4B94' },
  { id: 'mustard', label: '겨자', color: '#D9A43B' },
  { id: 'sky', label: '하늘', color: '#5AA9E6' },
];

const pickBy = (arr, n) => arr[n % arr.length].id;

export function randomLook(seed = Math.floor(Math.random() * 1e9)) {
  return {
    skin: pickBy(SKINS, seed),
    hairColor: pickBy(HAIR_COLORS, seed >>> 3),
    hairStyle: pickBy(HAIR_STYLES, seed >>> 7),
    outfit: pickBy(OUTFITS, seed >>> 11),
  };
}

const LINE = '#4A3B35';
const find = (arr, id) => arr.find((x) => x.id === id) || arr[0];

function hair(style, color) {
  const cap = `<path d="M25 50 Q24 20 50 20 Q76 20 75 50 Q68 34 50 33 Q33 34 25 50 Z" fill="${color}" stroke="${LINE}" stroke-width="2.5" stroke-linejoin="round"/>`;
  switch (style) {
    case 'long':
      return `<path d="M26 46 L22 92 L36 90 L33 50 Z M74 46 L78 92 L64 90 L67 50 Z" fill="${color}" stroke="${LINE}" stroke-width="2.5" stroke-linejoin="round"/>${cap}`;
    case 'bob':
      return `<path d="M26 44 Q20 70 36 72 L34 48 Z M74 44 Q80 70 64 72 L66 48 Z" fill="${color}" stroke="${LINE}" stroke-width="2.5" stroke-linejoin="round"/>${cap}`;
    case 'bun':
      return `<circle cx="50" cy="16" r="10" fill="${color}" stroke="${LINE}" stroke-width="2.5"/>${cap}`;
    default:
      return cap;
  }
}

export function butlerSVG(look) {
  const skin = find(SKINS, look?.skin).color;
  const hairColor = find(HAIR_COLORS, look?.hairColor).color;
  const outfit = find(OUTFITS, look?.outfit).color;
  // 긴 머리는 몸 뒤로 넘어가도록 먼저 그림
  const backHair = look?.hairStyle === 'long' ? hair('long', hairColor) : '';
  const frontHair = look?.hairStyle === 'long' ? '' : hair(look?.hairStyle, hairColor);
  return `<svg viewBox="0 0 100 140" width="100" height="140" xmlns="http://www.w3.org/2000/svg">
  ${backHair}
  <g stroke="${LINE}" stroke-width="2.5" stroke-linejoin="round">
    <rect x="38" y="110" width="10" height="22" rx="3" fill="#4A3B35"/>
    <rect x="52" y="110" width="10" height="22" rx="3" fill="#4A3B35"/>
    <ellipse cx="42" cy="133" rx="8" ry="4" fill="#2E2A2A"/><ellipse cx="58" cy="133" rx="8" ry="4" fill="#2E2A2A"/>
    <ellipse cx="27" cy="96" rx="6.5" ry="15" fill="${outfit}"/><ellipse cx="73" cy="96" rx="6.5" ry="15" fill="${outfit}"/>
    <circle cx="27" cy="111" r="5" fill="${skin}"/><circle cx="73" cy="111" r="5" fill="${skin}"/>
    <path d="M30 118 Q28 80 50 74 Q72 80 70 118 Z" fill="${outfit}"/>
    <path d="M40 86 L60 86 L63 118 L37 118 Z" fill="#FFFDF8"/>
    <path d="M45 100 L55 100 L55 108 L45 108 Z" fill="none" stroke-width="1.5"/>
    <circle cx="50" cy="48" r="25" fill="${skin}"/>
  </g>
  ${frontHair}
  <circle cx="41" cy="52" r="3" fill="#2E2A2A"/><circle cx="59" cy="52" r="3" fill="#2E2A2A"/>
  <ellipse cx="35" cy="60" rx="5" ry="3" fill="#F7A1B5" opacity=".7"/><ellipse cx="65" cy="60" rx="5" ry="3" fill="#F7A1B5" opacity=".7"/>
  <path d="M45 61 Q50 66 55 61" stroke="${LINE}" stroke-width="2" fill="none" stroke-linecap="round"/>
  <path d="M44 79 L50 85 L56 79" stroke="${LINE}" stroke-width="2" fill="#FFFDF8" stroke-linejoin="round"/>
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
