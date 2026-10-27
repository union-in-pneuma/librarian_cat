// 책마다 하나씩 생기는 고양이를 SVG로 그립니다.
// cat 데이터: { name, fur, pattern, eyes, accessories: [] }

export const FUR_COLORS = [
  { id: 'cheese', label: '치즈', base: '#F4A259', dark: '#D3742A' },
  { id: 'cream', label: '크림', base: '#F3DDB3', dark: '#D2AE72' },
  { id: 'gray', label: '회색', base: '#A3ABB4', dark: '#6B737C' },
  { id: 'black', label: '까망', base: '#3A3A42', dark: '#202026' },
  { id: 'white', label: '하양', base: '#FBF9F6', dark: '#CFC8BE' },
  { id: 'brown', label: '초코', base: '#9B6B43', dark: '#6A4528' },
  { id: 'blue', label: '러시안블루', base: '#8494AB', dark: '#56677F' },
  { id: 'pink', label: '벚꽃', base: '#F5BFCD', dark: '#E08AA2' },
  { id: 'mint', label: '민트', base: '#A8DCCB', dark: '#5FAF94' },
];

export const PATTERNS = [
  { id: 'solid', label: '단색' },
  { id: 'tabby', label: '줄무늬' },
  { id: 'tuxedo', label: '턱시도' },
  { id: 'calico', label: '삼색이' },
  { id: 'siamese', label: '샴' },
  { id: 'spots', label: '점박이' },
];

export const EYE_COLORS = [
  { id: 'amber', label: '호박', color: '#E8A33D' },
  { id: 'green', label: '초록', color: '#6DBE6A' },
  { id: 'blue', label: '파랑', color: '#5AA9E6' },
  { id: 'copper', label: '구리', color: '#C8642D' },
  { id: 'odd', label: '오드아이', color: '#5AA9E6', color2: '#E8A33D' },
];

export const ACCESSORIES = [
  { id: 'ribbon', label: '리본' },
  { id: 'flower', label: '꽃' },
  { id: 'glasses', label: '동그란 안경' },
  { id: 'beret', label: '베레모' },
  { id: 'wizard', label: '마법사 모자' },
  { id: 'scarf', label: '목도리' },
  { id: 'bell', label: '방울 목걸이' },
];

export const DEFAULT_CAT = { name: '', fur: 'cheese', pattern: 'tabby', eyes: 'amber', accessories: [] };

const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
export function randomCat(name = '') {
  const accessories = ACCESSORIES.filter(() => Math.random() < 0.2).map((a) => a.id).slice(0, 2);
  return { name, fur: pick(FUR_COLORS).id, pattern: pick(PATTERNS).id, eyes: pick(EYE_COLORS).id, accessories };
}

const LINE = '#4A3B35';
const PINK = '#F28CA0';

// 실루엣 도형 — 외곽선(1차) → 채우기(2차) 두 번 그려서 내부 선이 보이지 않게 합니다.
const SHAPES = [
  'ellipse cx="100" cy="148" rx="46" ry="40"',
  'ellipse cx="80" cy="184" rx="14" ry="9"',
  'ellipse cx="120" cy="184" rx="14" ry="9"',
  'path d="M56 72 L60 24 L94 52 Z"',
  'path d="M144 72 L140 24 L106 52 Z"',
  'ellipse cx="100" cy="90" rx="50" ry="43"',
];
const TAIL = 'M136 168 Q184 168 176 118';

function patternLayer(pattern, fur) {
  const d = fur.dark;
  switch (pattern) {
    case 'tabby':
      return `<g stroke="${d}" stroke-linecap="round" fill="none">
        <path stroke-width="5" d="M88 50 Q90 60 91 67 M100 48 L100 66 M112 50 Q110 60 109 67"/>
        <path stroke-width="4" d="M50 86 L64 90 M50 97 L64 97 M150 86 L136 90 M150 97 L136 97"/>
        <path stroke-width="7" d="M56 134 Q68 138 72 150 M55 154 Q66 157 70 168 M144 134 Q132 138 128 150 M145 154 Q134 157 130 168"/></g>`;
    case 'tuxedo':
      return `<g fill="#FFFFFF"><ellipse cx="100" cy="158" rx="22" ry="34"/><ellipse cx="100" cy="110" rx="23" ry="16"/>
        <path d="M100 68 L91 102 L109 102 Z"/><ellipse cx="80" cy="186" rx="14" ry="9"/><ellipse cx="120" cy="186" rx="14" ry="9"/></g>`;
    case 'calico':
      return `<g><circle cx="68" cy="66" r="24" fill="#E8913F"/><circle cx="138" cy="98" r="18" fill="#3A3A42"/>
        <circle cx="62" cy="150" r="22" fill="#3A3A42"/><circle cx="136" cy="160" r="26" fill="#E8913F"/>
        <circle cx="128" cy="52" r="12" fill="#E8913F"/></g>`;
    case 'siamese':
      return `<g fill="${d}"><path d="M56 72 L60 24 L94 52 Z M144 72 L140 24 L106 52 Z"/>
        <ellipse cx="100" cy="106" rx="24" ry="19" opacity=".85"/><ellipse cx="80" cy="186" rx="14" ry="10"/><ellipse cx="120" cy="186" rx="14" ry="10"/></g>`;
    case 'spots':
      return `<g fill="${d}"><circle cx="72" cy="70" r="9"/><circle cx="130" cy="64" r="7"/><circle cx="66" cy="140" r="10"/>
        <circle cx="132" cy="150" r="12"/><circle cx="104" cy="170" r="7"/><circle cx="118" cy="122" r="6"/></g>`;
    default:
      return '';
  }
}

function eye(x, y, mood, color) {
  switch (mood) {
    case 'happy':
      return `<path d="M${x - 8} ${y + 3} Q${x} ${y - 8} ${x + 8} ${y + 3}" stroke="${LINE}" stroke-width="4" fill="none" stroke-linecap="round"/>`;
    case 'sleepy':
      return `<path d="M${x - 8} ${y} Q${x} ${y + 7} ${x + 8} ${y}" stroke="${LINE}" stroke-width="4" fill="none" stroke-linecap="round"/>`;
    case 'love':
      return `<path d="M${x} ${y + 8} C${x - 14} ${y - 2} ${x - 7} ${y - 13} ${x} ${y - 5} C${x + 7} ${y - 13} ${x + 14} ${y - 2} ${x} ${y + 8} Z" fill="#E8506E"/>`;
    case 'surprised':
      return `<circle cx="${x}" cy="${y}" r="10" fill="${color}" stroke="${LINE}" stroke-width="2"/>
        <circle cx="${x}" cy="${y}" r="6.5" fill="#222"/><circle cx="${x + 3}" cy="${y - 4}" r="2.8" fill="#fff"/>`;
    default:
      return `<ellipse cx="${x}" cy="${y}" rx="8" ry="10" fill="${color}" stroke="${LINE}" stroke-width="2"/>
        <ellipse cx="${x}" cy="${y + 1}" rx="3.5" ry="7.5" fill="#222"/><circle cx="${x + 3}" cy="${y - 4}" r="2.6" fill="#fff"/>`;
  }
}

function face(mood, eyes) {
  const open = mood === 'happy' || mood === 'love';
  const mouth = open
    ? `<path d="M92 113 Q100 126 108 113 Z" fill="#C2455C" stroke="${LINE}" stroke-width="2" stroke-linejoin="round"/>`
    : `<path d="M100 110 Q100 116 93 117 M100 110 Q100 116 107 117" stroke="${LINE}" stroke-width="2.5" fill="none" stroke-linecap="round"/>`;
  const blush = mood === 'normal' || mood === 'sleepy' ? '' :
    `<ellipse cx="66" cy="108" rx="8" ry="4.5" fill="#F7A1B5" opacity=".75"/><ellipse cx="134" cy="108" rx="8" ry="4.5" fill="#F7A1B5" opacity=".75"/>`;
  return `${eye(80, 90, mood, eyes.color)}${eye(120, 90, mood, eyes.color2 || eyes.color)}
    <path d="M95 104 L105 104 L100 110 Z" fill="${PINK}"/>${mouth}${blush}
    <g stroke="${LINE}" stroke-width="1.6" opacity=".55" stroke-linecap="round">
      <path d="M70 104 L40 98 M70 109 L40 112 M130 104 L160 98 M130 109 L160 112"/></g>`;
}

const ACCESSORY_SVG = {
  ribbon: `<g fill="#E85D75" stroke="${LINE}" stroke-width="2" stroke-linejoin="round">
    <path d="M132 44 L116 32 L118 56 Z"/><path d="M132 44 L148 32 L146 56 Z"/><circle cx="132" cy="44" r="5"/></g>`,
  flower: `<g transform="translate(66 50)"><g fill="#FFD1DC" stroke="${LINE}" stroke-width="1.5">
    <circle cx="0" cy="-8" r="6"/><circle cx="7.6" cy="-2.5" r="6"/><circle cx="4.7" cy="6.5" r="6"/>
    <circle cx="-4.7" cy="6.5" r="6"/><circle cx="-7.6" cy="-2.5" r="6"/></g><circle r="4.5" fill="#F4C542"/></g>`,
  glasses: `<g stroke="${LINE}" stroke-width="3" fill="rgba(255,255,255,.18)">
    <circle cx="80" cy="90" r="14"/><circle cx="120" cy="90" r="14"/><path d="M94 89 Q100 85 106 89" fill="none"/></g>`,
  beret: `<g stroke="${LINE}" stroke-width="2"><ellipse cx="92" cy="52" rx="38" ry="14" fill="#7B4B94" transform="rotate(-12 92 52)"/>
    <circle cx="94" cy="38" r="4" fill="#7B4B94"/></g>`,
  wizard: `<g stroke="${LINE}" stroke-width="2" stroke-linejoin="round"><path d="M70 54 L106 4 L132 54 Z" fill="#3D4E8A"/>
    <ellipse cx="100" cy="54" rx="46" ry="9" fill="#2E3B6B"/></g>
    <g fill="#F4C542"><circle cx="100" cy="32" r="3"/><circle cx="112" cy="44" r="2.2"/><circle cx="92" cy="45" r="2"/></g>`,
  scarf: `<g fill="#D9534F" stroke="${LINE}" stroke-width="2" stroke-linejoin="round">
    <path d="M118 134 L134 134 L130 164 L114 161 Z"/><path d="M58 126 Q100 146 142 126 L142 138 Q100 158 58 138 Z"/></g>`,
  bell: `<path d="M62 128 Q100 146 138 128" stroke="#C0392B" stroke-width="7" fill="none" stroke-linecap="round"/>
    <circle cx="100" cy="143" r="8" fill="#F4C542" stroke="${LINE}" stroke-width="2"/><path d="M100 143 L100 150" stroke="${LINE}" stroke-width="2"/>`,
};

const CROWN = `<g stroke="#B9871A" stroke-width="2" stroke-linejoin="round">
  <path d="M76 50 L79 24 L91 38 L100 18 L109 38 L121 24 L124 50 Z" fill="#F7CC4A"/>
  <circle cx="100" cy="40" r="4" fill="#E85D75"/><circle cx="85" cy="44" r="3" fill="#5AA9E6"/><circle cx="115" cy="44" r="3" fill="#6DBE6A"/></g>`;

/**
 * @param {object} cat 고양이 꾸미기 데이터
 * @param {object} opts mood: normal|happy|sleepy|love|surprised, crown: 100% 보상
 */
export function catSVG(cat, { mood = 'normal', crown = false } = {}) {
  const c = { ...DEFAULT_CAT, ...cat };
  const fur = FUR_COLORS.find((f) => f.id === c.fur) || FUR_COLORS[0];
  const eyes = EYE_COLORS.find((e) => e.id === c.eyes) || EYE_COLORS[0];
  const clipId = 'catclip-' + Math.random().toString(36).slice(2, 9);
  const tailColor = c.pattern === 'siamese' ? fur.dark : fur.base;
  const tailStripes = c.pattern === 'tabby'
    ? `<path d="${TAIL}" stroke="${fur.dark}" stroke-width="13" stroke-dasharray="7 9" fill="none"/>` : '';
  const accessories = (c.accessories || []).map((a) => ACCESSORY_SVG[a] || '').join('');

  return `<svg viewBox="0 0 200 200" width="200" height="200" xmlns="http://www.w3.org/2000/svg" class="cat-svg">
  <defs><clipPath id="${clipId}">${SHAPES.map((s) => `<${s}/>`).join('')}</clipPath></defs>
  <path d="${TAIL}" stroke="${LINE}" stroke-width="19" fill="none" stroke-linecap="round"/>
  <path d="${TAIL}" stroke="${tailColor}" stroke-width="13" fill="none" stroke-linecap="round"/>${tailStripes}
  ${SHAPES.map((s) => `<${s} fill="${LINE}" stroke="${LINE}" stroke-width="6" stroke-linejoin="round"/>`).join('')}
  ${SHAPES.map((s) => `<${s} fill="${fur.base}"/>`).join('')}
  <g clip-path="url(#${clipId})">${patternLayer(c.pattern, fur)}</g>
  <path d="M64 62 L66 34 L86 52 Z M136 62 L134 34 L114 52 Z" fill="${PINK}" opacity=".7"/>
  ${face(mood, eyes)}${accessories}${crown ? CROWN : ''}
</svg>`;
}

// 마을 캔버스용 이미지 (캐시)
const imageCache = new Map();
export function catImage(cat, opts = {}) {
  const key = JSON.stringify([cat, opts]);
  if (!imageCache.has(key)) {
    const img = new Image();
    img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(catSVG(cat, opts));
    imageCache.set(key, img);
  }
  return imageCache.get(key);
}
