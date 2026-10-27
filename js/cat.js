// 책마다 하나씩 생기는 고양이를 SVG로 그립니다.
// cat 데이터: { name, fur, body, ears, tail, pattern, patternColor, eyes, eyeShape, nose, accessories: [], accColor }
// 예전에 저장된 고양이는 없는 항목을 DEFAULT_CAT 값으로 채워 그립니다.

export const FUR_COLORS = [
  { id: 'cheese', label: '치즈', base: '#F4A259', dark: '#D3742A' },
  { id: 'ginger', label: '진저', base: '#E58A45', dark: '#B9621F' },
  { id: 'cream', label: '크림', base: '#F3DDB3', dark: '#D2AE72' },
  { id: 'lemon', label: '레몬', base: '#F6E39A', dark: '#D9BE55' },
  { id: 'white', label: '하양', base: '#FBF9F6', dark: '#CFC8BE' },
  { id: 'silver', label: '은빛', base: '#D4D8DD', dark: '#9EA5AD' },
  { id: 'gray', label: '회색', base: '#A3ABB4', dark: '#6B737C' },
  { id: 'blue', label: '러시안블루', base: '#8494AB', dark: '#56677F' },
  { id: 'charcoal', label: '먹색', base: '#5B5B63', dark: '#38383F' },
  { id: 'black', label: '까망', base: '#3A3A42', dark: '#202026' },
  { id: 'cinnamon', label: '시나몬', base: '#C47A4A', dark: '#93542B' },
  { id: 'brown', label: '초코', base: '#9B6B43', dark: '#6A4528' },
  { id: 'cocoa', label: '코코아', base: '#6E4A3A', dark: '#4A3024' },
  { id: 'pink', label: '벚꽃', base: '#F5BFCD', dark: '#E08AA2' },
  { id: 'lavender', label: '라벤더', base: '#C9B6E4', dark: '#9C82C4' },
  { id: 'sky', label: '하늘', base: '#A9D2F0', dark: '#6FA8D6' },
  { id: 'mint', label: '민트', base: '#A8DCCB', dark: '#5FAF94' },
];

export const BODY_TYPES = [
  { id: 'normal', label: '보통', rx: 46, ry: 40, paw: 20 },
  { id: 'chubby', label: '통통', rx: 55, ry: 42, paw: 24 },
  { id: 'slim', label: '날씬', rx: 38, ry: 38, paw: 16 },
];

export const EAR_TYPES = [
  { id: 'pointy', label: '뾰족 귀' },
  { id: 'round', label: '둥근 귀' },
  { id: 'big', label: '큰 귀' },
  { id: 'fold', label: '접힌 귀' },
];

export const TAILS = [
  { id: 'long', label: '긴 꼬리', d: 'M136 168 Q184 168 176 118', w: 13 },
  { id: 'fluffy', label: '복슬 꼬리', d: 'M136 168 Q184 168 176 118', w: 21 },
  { id: 'curl', label: '말린 꼬리', d: 'M136 168 Q188 170 174 126 Q168 108 152 120', w: 12 },
  { id: 'short', label: '짧은 꼬리', d: 'M140 172 Q156 172 154 160', w: 15 },
];

export const PATTERNS = [
  { id: 'solid', label: '단색' },
  { id: 'tabby', label: '줄무늬' },
  { id: 'tuxedo', label: '턱시도' },
  { id: 'socks', label: '흰 양말' },
  { id: 'calico', label: '삼색이' },
  { id: 'bicolor', label: '얼룩' },
  { id: 'siamese', label: '샴' },
  { id: 'mask', label: '복면' },
  { id: 'spots', label: '점박이' },
];

export const PATTERN_COLORS = [
  { id: 'auto', label: '자동', color: '', swatch: 'conic-gradient(#F4A259, #8494AB, #3A3A42, #F4A259)' },
  { id: 'black', label: '검정', color: '#2E2E35' },
  { id: 'brown', label: '갈색', color: '#6A4528' },
  { id: 'orange', label: '주황', color: '#E8913F' },
  { id: 'gray', label: '회색', color: '#6B737C' },
  { id: 'cream', label: '크림', color: '#E9D3A8' },
  { id: 'white', label: '하양', color: '#FFFFFF' },
];

export const EYE_COLORS = [
  { id: 'amber', label: '호박', color: '#E8A33D' },
  { id: 'gold', label: '금색', color: '#F2C94C' },
  { id: 'green', label: '초록', color: '#6DBE6A' },
  { id: 'hazel', label: '헤이즐', color: '#A39A3E' },
  { id: 'blue', label: '파랑', color: '#5AA9E6' },
  { id: 'gray', label: '회색', color: '#9AA3AD' },
  { id: 'copper', label: '구리', color: '#C8642D' },
  { id: 'violet', label: '보라', color: '#9A7BD6' },
  { id: 'pink', label: '분홍', color: '#F28CA0' },
  { id: 'odd', label: '오드아이', color: '#5AA9E6', color2: '#E8A33D' },
  { id: 'odd2', label: '오드아이2', color: '#6DBE6A', color2: '#9A7BD6' },
];

export const EYE_SHAPES = [
  { id: 'round', label: '동글' },
  { id: 'big', label: '반짝 큰 눈' },
  { id: 'almond', label: '아몬드' },
  { id: 'button', label: '단추 눈' },
];

export const NOSE_COLORS = [
  { id: 'pink', label: '분홍', color: '#F28CA0' },
  { id: 'peach', label: '살구', color: '#F6B49A' },
  { id: 'brown', label: '갈색', color: '#8C5A35' },
  { id: 'black', label: '검정', color: '#3A3A42' },
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
  { id: 'white', label: '하양', color: '#FFFFFF' },
];

const LINE = '#4A3B35';

// 소품: def = '기본' 색, back = 몸 뒤에 그림
const ACCESSORY_DEFS = {
  ribbon: { label: '리본', def: '#E85D75', svg: (c) => `<g fill="${c}" stroke="${LINE}" stroke-width="2" stroke-linejoin="round">
    <path d="M132 44 L116 32 L118 56 Z"/><path d="M132 44 L148 32 L146 56 Z"/><circle cx="132" cy="44" r="5"/></g>` },
  flower: { label: '꽃', def: '#FFD1DC', svg: (c) => `<g transform="translate(66 50)"><g fill="${c}" stroke="${LINE}" stroke-width="1.5">
    <circle cx="0" cy="-8" r="6"/><circle cx="7.6" cy="-2.5" r="6"/><circle cx="4.7" cy="6.5" r="6"/>
    <circle cx="-4.7" cy="6.5" r="6"/><circle cx="-7.6" cy="-2.5" r="6"/></g><circle r="4.5" fill="#F4C542"/></g>` },
  flowercrown: { label: '화관', def: '#F28CA0', svg: (c) => `<path d="M64 60 Q100 36 136 60" stroke="#5DA67A" stroke-width="4" fill="none"/>
    ${[[66, 58], [77, 51], [88, 47], [100, 46], [112, 47], [123, 51], [134, 58]].map(([x, y], k) =>
    `<circle cx="${x}" cy="${y}" r="6" fill="${[c, '#FFF3C4', '#FFD1DC'][k % 3]}" stroke="${LINE}" stroke-width="1.5"/>`).join('')}` },
  starpin: { label: '별 핀', def: '#F4C542', svg: (c) => `<path d="M70 44 L73 52 L81 52 L75 57 L77 65 L70 60 L63 65 L65 57 L59 52 L67 52 Z" fill="${c}" stroke="${LINE}" stroke-width="1.8" stroke-linejoin="round"/>` },
  glasses: { label: '동그란 안경', def: LINE, svg: (c) => `<g stroke="${c}" stroke-width="3" fill="rgba(255,255,255,.18)">
    <circle cx="80" cy="90" r="14"/><circle cx="120" cy="90" r="14"/><path d="M94 89 Q100 85 106 89" fill="none"/></g>` },
  sunglasses: { label: '선글라스', def: '#2E2E35', svg: (c) => `<g stroke="${LINE}" stroke-width="2"><rect x="64" y="80" width="30" height="20" rx="8" fill="${c}"/>
    <rect x="106" y="80" width="30" height="20" rx="8" fill="${c}"/><path d="M94 88 L106 88" stroke-width="3"/></g>
    <path d="M70 85 L78 85" stroke="#fff" stroke-width="2" opacity=".6"/><path d="M112 85 L120 85" stroke="#fff" stroke-width="2" opacity=".6"/>` },
  beret: { label: '베레모', def: '#7B4B94', svg: (c) => `<g stroke="${LINE}" stroke-width="2"><ellipse cx="92" cy="52" rx="38" ry="14" fill="${c}" transform="rotate(-12 92 52)"/>
    <circle cx="94" cy="38" r="4" fill="${c}"/></g>` },
  beanie: { label: '털모자', def: '#5AA9E6', svg: (c) => `<g stroke="${LINE}" stroke-width="2" stroke-linejoin="round">
    <path d="M56 62 Q54 22 100 22 Q146 22 144 62 Z" fill="${c}"/><rect x="52" y="54" width="96" height="12" rx="6" fill="${c}"/>
    <circle cx="100" cy="20" r="8" fill="#fff"/></g><path d="M64 60 V64 M76 58 V64 M88 58 V64 M100 58 V64 M112 58 V64 M124 58 V64 M136 60 V64" stroke="rgba(0,0,0,.2)" stroke-width="2"/>` },
  wizard: { label: '마법사 모자', def: '#3D4E8A', svg: (c) => `<g stroke="${LINE}" stroke-width="2" stroke-linejoin="round"><path d="M70 54 L106 4 L132 54 Z" fill="${c}"/>
    <ellipse cx="100" cy="54" rx="46" ry="9" fill="${c}"/></g>
    <g fill="#F4C542"><circle cx="100" cy="32" r="3"/><circle cx="112" cy="44" r="2.2"/><circle cx="92" cy="45" r="2"/></g>` },
  strawhat: { label: '밀짚모자', def: '#D9534F', svg: (c) => `<g stroke="${LINE}" stroke-width="2"><ellipse cx="100" cy="54" rx="62" ry="12" fill="#E9CF8E"/>
    <path d="M70 54 Q70 20 100 20 Q130 20 130 54 Z" fill="#E9CF8E"/></g><rect x="70" y="42" width="60" height="8" fill="${c}"/>` },
  headphones: { label: '헤드폰', def: '#3A3A42', svg: (c) => `<path d="M54 84 Q52 28 100 28 Q148 28 146 84" stroke="${c}" stroke-width="7" fill="none" stroke-linecap="round"/>
    <g stroke="${LINE}" stroke-width="2" fill="${c}"><rect x="42" y="74" width="16" height="26" rx="7"/><rect x="142" y="74" width="16" height="26" rx="7"/></g>` },
  scarf: { label: '목도리', def: '#D9534F', svg: (c) => `<g fill="${c}" stroke="${LINE}" stroke-width="2" stroke-linejoin="round">
    <path d="M118 134 L134 134 L130 164 L114 161 Z"/><path d="M58 126 Q100 146 142 126 L142 138 Q100 158 58 138 Z"/></g>` },
  bell: { label: '방울 목걸이', def: '#C0392B', svg: (c) => `<path d="M62 128 Q100 146 138 128" stroke="${c}" stroke-width="7" fill="none" stroke-linecap="round"/>
    <circle cx="100" cy="143" r="8" fill="#F4C542" stroke="${LINE}" stroke-width="2"/><path d="M100 143 L100 150" stroke="${LINE}" stroke-width="2"/>` },
  bowtie: { label: '나비넥타이', def: '#3D4E8A', svg: (c) => `<g fill="${c}" stroke="${LINE}" stroke-width="2" stroke-linejoin="round">
    <path d="M100 136 L82 126 L82 146 Z"/><path d="M100 136 L118 126 L118 146 Z"/><circle cx="100" cy="136" r="5"/></g>` },
  cape: { label: '망토', def: '#7B4B94', back: true, svg: (c) => `<path d="M60 116 Q100 128 140 116 L158 188 Q100 198 42 188 Z" fill="${c}" stroke="${LINE}" stroke-width="3" stroke-linejoin="round"/>` },
  book: { label: '책 들기', def: '#3D6E8A', svg: (c) => `<g stroke="${LINE}" stroke-width="2" stroke-linejoin="round"><rect x="80" y="158" width="40" height="28" rx="3" fill="${c}"/>
    <path d="M84 162 H116 V182 H84 Z" fill="#FFF8E8" stroke-width="1.2"/><path d="M100 162 V182" stroke-width="1.5"/></g>` },
};
export const ACCESSORIES = Object.entries(ACCESSORY_DEFS).map(([id, a]) => ({ id, label: a.label }));

// 꾸미기 화면용 항목 정의 (group 별로 탭이 나뉨)
export const CAT_PARTS = [
  { group: '몸', key: 'fur', label: '털색', type: 'color', items: FUR_COLORS.map((f) => ({ ...f, color: f.base })) },
  { group: '몸', key: 'body', label: '체형', type: 'chip', items: BODY_TYPES },
  { group: '몸', key: 'ears', label: '귀', type: 'chip', items: EAR_TYPES },
  { group: '몸', key: 'tail', label: '꼬리', type: 'chip', items: TAILS },
  { group: '무늬', key: 'pattern', label: '무늬', type: 'chip', items: PATTERNS },
  { group: '무늬', key: 'patternColor', label: '무늬 색', type: 'color', items: PATTERN_COLORS },
  { group: '얼굴', key: 'eyes', label: '눈 색', type: 'color', items: EYE_COLORS.map((e) => ({ ...e, swatch: e.color2 ? `linear-gradient(90deg,${e.color} 50%,${e.color2} 50%)` : e.color })) },
  { group: '얼굴', key: 'eyeShape', label: '눈 모양', type: 'chip', items: EYE_SHAPES },
  { group: '얼굴', key: 'nose', label: '코 색', type: 'color', items: NOSE_COLORS },
  { group: '소품', key: 'accessories', label: '소품 (여러 개 선택 가능)', type: 'chip', multi: true, items: ACCESSORIES },
  { group: '소품', key: 'accColor', label: '소품 색', type: 'color', items: ACC_COLORS },
];

export const DEFAULT_CAT = {
  name: '', fur: 'cheese', body: 'normal', ears: 'pointy', tail: 'long', pattern: 'tabby', patternColor: 'auto',
  eyes: 'amber', eyeShape: 'round', nose: 'pink', accessories: [], accColor: 'auto',
};

const pick = (arr) => arr[Math.floor(Math.random() * arr.length)].id;
export function randomCat(name = '') {
  const accessories = ACCESSORIES.filter(() => Math.random() < 0.12).map((a) => a.id).slice(0, 2);
  return {
    name, fur: pick(FUR_COLORS), body: pick(BODY_TYPES), ears: pick(EAR_TYPES), tail: pick(TAILS),
    pattern: pick(PATTERNS), patternColor: Math.random() < 0.6 ? 'auto' : pick(PATTERN_COLORS),
    eyes: pick(EYE_COLORS), eyeShape: pick(EYE_SHAPES), nose: pick(NOSE_COLORS),
    accessories, accColor: Math.random() < 0.5 ? 'auto' : pick(ACC_COLORS),
  };
}

const find = (arr, id) => arr.find((x) => x.id === id) || arr[0];

function earPaths(style, flip) {
  const X = flip ? (x) => 200 - x : (x) => x;
  switch (style) {
    case 'round':
      return { outer: `M${X(54)} 72 Q${X(44)} 20 ${X(94)} 50 Z`, inner: `M${X(62)} 63 Q${X(56)} 34 ${X(86)} 51 Z` };
    case 'big':
      return { outer: `M${X(52)} 74 L${X(50)} 10 L${X(96)} 50 Z`, inner: `M${X(61)} 63 L${X(59)} 26 L${X(87)} 51 Z` };
    case 'fold':
      return { outer: `M${X(58)} 62 Q${X(60)} 36 ${X(94)} 48 Q${X(78)} 52 ${X(68)} 64 Z`, inner: `M${X(66)} 56 Q${X(67)} 44 ${X(84)} 48 Q${X(76)} 51 ${X(70)} 58 Z` };
    default:
      return { outer: `M${X(56)} 72 L${X(60)} 24 L${X(94)} 52 Z`, inner: `M${X(64)} 62 L${X(66)} 34 L${X(86)} 52 Z` };
  }
}

function patternLayer(pattern, pc, body) {
  const { rx } = body;
  const paws = `<ellipse cx="${100 - body.paw}" cy="186" rx="15" ry="10"/><ellipse cx="${100 + body.paw}" cy="186" rx="15" ry="10"/>`;
  switch (pattern) {
    case 'tabby':
      return `<g stroke="${pc}" stroke-linecap="round" fill="none">
        <path stroke-width="5" d="M88 50 Q90 60 91 67 M100 48 L100 66 M112 50 Q110 60 109 67"/>
        <path stroke-width="4" d="M50 86 L64 90 M50 97 L64 97 M150 86 L136 90 M150 97 L136 97"/>
        <path stroke-width="7" d="M${100 - rx + 2} 134 Q${100 - rx + 14} 138 ${100 - rx + 18} 150 M${100 - rx + 1} 154 Q${100 - rx + 12} 157 ${100 - rx + 16} 168
          M${100 + rx - 2} 134 Q${100 + rx - 14} 138 ${100 + rx - 18} 150 M${100 + rx - 1} 154 Q${100 + rx - 12} 157 ${100 + rx - 16} 168"/></g>`;
    case 'tuxedo':
      return `<g fill="#FFFFFF"><ellipse cx="100" cy="158" rx="22" ry="34"/><ellipse cx="100" cy="110" rx="23" ry="16"/>
        <path d="M100 68 L91 102 L109 102 Z"/>${paws}</g>`;
    case 'socks':
      return `<g fill="#FFFFFF">${paws}<ellipse cx="100" cy="160" rx="14" ry="20"/></g>`;
    case 'calico':
      return `<g><circle cx="68" cy="66" r="24" fill="#E8913F"/><circle cx="138" cy="98" r="18" fill="${pc}"/>
        <circle cx="62" cy="150" r="22" fill="${pc}"/><circle cx="136" cy="160" r="26" fill="#E8913F"/>
        <circle cx="128" cy="52" r="12" fill="#E8913F"/></g>`;
    case 'bicolor':
      return `<g fill="${pc}"><circle cx="66" cy="74" r="28"/><circle cx="140" cy="150" r="30"/><circle cx="60" cy="168" r="16"/><circle cx="124" cy="58" r="10"/></g>`;
    case 'siamese':
      return `<g fill="${pc}"><path d="M40 72 L60 10 L96 52 Z M160 72 L140 10 L104 52 Z"/>
        <ellipse cx="100" cy="106" rx="24" ry="19" opacity=".85"/>${paws}</g>`;
    case 'mask':
      return `<ellipse cx="100" cy="88" rx="48" ry="15" fill="${pc}" opacity=".9"/>`;
    case 'spots':
      return `<g fill="${pc}"><circle cx="72" cy="70" r="9"/><circle cx="130" cy="64" r="7"/><circle cx="66" cy="140" r="10"/>
        <circle cx="132" cy="150" r="12"/><circle cx="104" cy="170" r="7"/><circle cx="118" cy="122" r="6"/></g>`;
    default:
      return '';
  }
}

function eye(x, y, mood, color, shape) {
  const stroke = (d) => `<path d="${d}" stroke="${LINE}" stroke-width="4" fill="none" stroke-linecap="round"/>`;
  switch (mood) {
    case 'happy': return stroke(`M${x - 8} ${y + 3} Q${x} ${y - 8} ${x + 8} ${y + 3}`);
    case 'sleepy':
    case 'blink': return stroke(`M${x - 8} ${y} Q${x} ${y + 7} ${x + 8} ${y}`);
    case 'love':
      return `<path d="M${x} ${y + 8} C${x - 14} ${y - 2} ${x - 7} ${y - 13} ${x} ${y - 5} C${x + 7} ${y - 13} ${x + 14} ${y - 2} ${x} ${y + 8} Z" fill="#E8506E"/>`;
    case 'surprised':
      return `<circle cx="${x}" cy="${y}" r="10" fill="${color}" stroke="${LINE}" stroke-width="2"/>
        <circle cx="${x}" cy="${y}" r="6.5" fill="#222"/><circle cx="${x + 3}" cy="${y - 4}" r="2.8" fill="#fff"/>`;
  }
  switch (shape) {
    case 'big':
      return `<ellipse cx="${x}" cy="${y}" rx="10" ry="12" fill="${color}" stroke="${LINE}" stroke-width="2"/>
        <ellipse cx="${x}" cy="${y + 1}" rx="5" ry="9" fill="#222"/><circle cx="${x + 3.5}" cy="${y - 5}" r="3.2" fill="#fff"/><circle cx="${x - 3}" cy="${y + 5}" r="1.6" fill="#fff"/>`;
    case 'almond':
      return `<path d="M${x - 10} ${y + 1} Q${x} ${y - 11} ${x + 10} ${y - 1} Q${x} ${y + 9} ${x - 10} ${y + 1} Z" fill="${color}" stroke="${LINE}" stroke-width="2"/>
        <ellipse cx="${x}" cy="${y}" rx="2.5" ry="6.5" fill="#222"/><circle cx="${x + 3}" cy="${y - 3}" r="2" fill="#fff"/>`;
    case 'button':
      return `<circle cx="${x}" cy="${y + 1}" r="5.5" fill="#222"/><circle cx="${x + 2}" cy="${y - 1}" r="1.8" fill="#fff"/>`;
    default:
      return `<ellipse cx="${x}" cy="${y}" rx="8" ry="10" fill="${color}" stroke="${LINE}" stroke-width="2"/>
        <ellipse cx="${x}" cy="${y + 1}" rx="3.5" ry="7.5" fill="#222"/><circle cx="${x + 3}" cy="${y - 4}" r="2.6" fill="#fff"/>`;
  }
}

function face(mood, eyes, shape, noseColor) {
  const open = mood === 'happy' || mood === 'love';
  const mouth = open
    ? `<path d="M92 113 Q100 126 108 113 Z" fill="#C2455C" stroke="${LINE}" stroke-width="2" stroke-linejoin="round"/>`
    : `<path d="M100 110 Q100 116 93 117 M100 110 Q100 116 107 117" stroke="${LINE}" stroke-width="2.5" fill="none" stroke-linecap="round"/>`;
  const blush = mood === 'normal' || mood === 'sleepy' || mood === 'blink' ? '' :
    `<ellipse cx="66" cy="108" rx="8" ry="4.5" fill="#F7A1B5" opacity=".75"/><ellipse cx="134" cy="108" rx="8" ry="4.5" fill="#F7A1B5" opacity=".75"/>`;
  return `${eye(80, 90, mood, eyes.color, shape)}${eye(120, 90, mood, eyes.color2 || eyes.color, shape)}
    <path d="M95 104 L105 104 L100 110 Z" fill="${noseColor}"/>${mouth}${blush}
    <g stroke="${LINE}" stroke-width="1.6" opacity=".55" stroke-linecap="round">
      <path d="M70 104 L40 98 M70 109 L40 112 M130 104 L160 98 M130 109 L160 112"/></g>`;
}

const CROWN = `<g stroke="#B9871A" stroke-width="2" stroke-linejoin="round">
  <path d="M76 50 L79 24 L91 38 L100 18 L109 38 L121 24 L124 50 Z" fill="#F7CC4A"/>
  <circle cx="100" cy="40" r="4" fill="#E85D75"/><circle cx="85" cy="44" r="3" fill="#5AA9E6"/><circle cx="115" cy="44" r="3" fill="#6DBE6A"/></g>`;

/**
 * @param {object} cat 고양이 꾸미기 데이터
 * @param {object} opts mood: normal|blink|happy|sleepy|love|surprised, crown: 완독 표시
 */
export function catSVG(cat, { mood = 'normal', crown = false } = {}) {
  const c = { ...DEFAULT_CAT, ...cat };
  const fur = find(FUR_COLORS, c.fur);
  const body = find(BODY_TYPES, c.body);
  const tail = find(TAILS, c.tail);
  const eyes = find(EYE_COLORS, c.eyes);
  const pc = c.patternColor === 'auto' ? fur.dark : find(PATTERN_COLORS, c.patternColor).color;
  const accColor = c.accColor === 'auto' ? null : find(ACC_COLORS, c.accColor).color;
  const earL = earPaths(c.ears, false), earR = earPaths(c.ears, true);
  const shapes = [
    `ellipse cx="100" cy="148" rx="${body.rx}" ry="${body.ry}"`,
    `ellipse cx="${100 - body.paw}" cy="184" rx="14" ry="9"`,
    `ellipse cx="${100 + body.paw}" cy="184" rx="14" ry="9"`,
    `path d="${earL.outer}"`,
    `path d="${earR.outer}"`,
    'ellipse cx="100" cy="90" rx="50" ry="43"',
  ];
  const clipId = 'catclip-' + Math.random().toString(36).slice(2, 9);
  const tailColor = c.pattern === 'siamese' ? pc : fur.base;
  const tailStripes = c.pattern === 'tabby'
    ? `<path d="${tail.d}" stroke="${pc}" stroke-width="${tail.w}" stroke-dasharray="7 9" fill="none"/>` : '';
  const acc = (c.accessories || []).map((id) => ACCESSORY_DEFS[id]).filter(Boolean);
  const accSvg = (list) => list.map((a) => a.svg(accColor || a.def)).join('');

  return `<svg viewBox="0 0 200 200" width="200" height="200" xmlns="http://www.w3.org/2000/svg" class="cat-svg">
  <defs><clipPath id="${clipId}">${shapes.map((s) => `<${s}/>`).join('')}</clipPath></defs>
  ${accSvg(acc.filter((a) => a.back))}
  <path d="${tail.d}" stroke="${LINE}" stroke-width="${tail.w + 6}" fill="none" stroke-linecap="round"/>
  <path d="${tail.d}" stroke="${tailColor}" stroke-width="${tail.w}" fill="none" stroke-linecap="round"/>${tailStripes}
  ${shapes.map((s) => `<${s} fill="${LINE}" stroke="${LINE}" stroke-width="6" stroke-linejoin="round"/>`).join('')}
  ${shapes.map((s) => `<${s} fill="${fur.base}"/>`).join('')}
  <g clip-path="url(#${clipId})">${patternLayer(c.pattern, pc, body)}</g>
  <path d="${earL.inner} ${earR.inner}" fill="#F28CA0" opacity=".7"/>
  ${face(mood, eyes, c.eyeShape, find(NOSE_COLORS, c.nose).color)}${accSvg(acc.filter((a) => !a.back))}${crown ? CROWN : ''}
</svg>`;
}

// ---------- 애니메이션용 부위별 SVG ----------
// 정면(앉기) 부위는 정적 그림과 같은 200×200 좌표를 쓰고, 옆모습(걷기·기지개·잠)은 오른쪽을 보는 별도 좌표를 씁니다.
// 부위마다 따로 그려 두고 CatActor(catMotion.js)가 매 프레임 회전·이동시켜 조합합니다.

const ACC_SLOT = { cape: 'back', scarf: 'neck', bell: 'neck', bowtie: 'neck', book: 'held' };

function resolve(cat) {
  const c = { ...DEFAULT_CAT, ...cat };
  const fur = find(FUR_COLORS, c.fur);
  const accColor = c.accColor === 'auto' ? null : find(ACC_COLORS, c.accColor).color;
  const acc = (c.accessories || []).filter((id) => ACCESSORY_DEFS[id]);
  return {
    c, fur, accColor,
    body: find(BODY_TYPES, c.body),
    tail: find(TAILS, c.tail),
    eyes: find(EYE_COLORS, c.eyes),
    nose: find(NOSE_COLORS, c.nose).color,
    pc: c.patternColor === 'auto' ? fur.dark : find(PATTERN_COLORS, c.patternColor).color,
    tailColor: c.pattern === 'siamese' ? (c.patternColor === 'auto' ? fur.dark : find(PATTERN_COLORS, c.patternColor).color) : fur.base,
    accIn: (slot) => acc.filter((id) => (ACC_SLOT[id] || 'head') === slot),
    accSvg: (ids) => ids.map((id) => ACCESSORY_DEFS[id].svg(accColor || ACCESSORY_DEFS[id].def)).join(''),
    accColorOf: (id) => accColor || ACCESSORY_DEFS[id].def,
  };
}

// 외곽선 → 털색 → (무늬, 도형으로 잘라냄) 순서로 그린 덩어리
function blob(shapes, fill, pattern = '', id = 'c') {
  return `<defs><clipPath id="${id}">${shapes.map((s) => `<${s}/>`).join('')}</clipPath></defs>
    ${shapes.map((s) => `<${s} fill="${LINE}" stroke="${LINE}" stroke-width="6" stroke-linejoin="round"/>`).join('')}
    ${shapes.map((s) => `<${s} fill="${fill}"/>`).join('')}
    ${pattern ? `<g clip-path="url(#${id})">${pattern}</g>` : ''}`;
}

function tailStroke(d, w, color, stripes) {
  return `<path d="${d}" stroke="${LINE}" stroke-width="${w + 6}" fill="none" stroke-linecap="round"/>
    <path d="${d}" stroke="${color}" stroke-width="${w}" fill="none" stroke-linecap="round"/>
    ${stripes ? `<path d="${d}" stroke="${stripes}" stroke-width="${w}" stroke-dasharray="7 9" fill="none"/>` : ''}`;
}

const SIDE_TAILS = {
  long: 'M46 134 Q10 128 18 84',
  fluffy: 'M46 134 Q10 128 18 84',
  curl: 'M46 134 Q6 130 12 94 Q16 76 32 86',
  short: 'M46 134 Q32 130 32 118',
};

function sidePattern(pattern, pc) {
  switch (pattern) {
    case 'tabby':
      return `<path d="M62 114 Q66 126 62 140 M78 112 Q82 126 78 142 M94 112 Q98 126 94 142 M110 113 Q114 126 110 140" stroke="${pc}" stroke-width="6" fill="none" stroke-linecap="round"/>`;
    case 'tuxedo': return '<g fill="#FFFFFF"><ellipse cx="100" cy="164" rx="40" ry="12"/><ellipse cx="136" cy="144" rx="12" ry="18"/></g>';
    case 'calico': return `<circle cx="66" cy="126" r="16" fill="#E8913F"/><circle cx="108" cy="120" r="14" fill="${pc}"/><circle cx="92" cy="154" r="12" fill="#E8913F"/>`;
    case 'bicolor': return `<g fill="${pc}"><circle cx="70" cy="124" r="18"/><circle cx="118" cy="150" r="16"/></g>`;
    case 'spots': return `<g fill="${pc}"><circle cx="64" cy="128" r="6"/><circle cx="86" cy="118" r="5"/><circle cx="104" cy="140" r="7"/><circle cx="124" cy="124" r="5"/></g>`;
    default: return '';
  }
}

const FRONT_PARTS = {
  back: (r) => r.accSvg(r.accIn('back')),
  tail: (r) => tailStroke(r.tail.d, r.tail.w, r.tailColor, r.c.pattern === 'tabby' && r.pc),
  body: (r) => blob([`ellipse cx="100" cy="148" rx="${r.body.rx}" ry="${r.body.ry}"`], r.fur.base, patternLayer(r.c.pattern, r.pc, r.body))
    + r.accSvg(r.accIn('neck')),
  pawL: (r) => blob([`ellipse cx="${100 - r.body.paw}" cy="184" rx="14" ry="9"`], r.fur.base, patternLayer(r.c.pattern, r.pc, r.body)),
  pawR: (r) => blob([`ellipse cx="${100 + r.body.paw}" cy="184" rx="14" ry="9"`], r.fur.base, patternLayer(r.c.pattern, r.pc, r.body)),
  held: (r) => r.accSvg(r.accIn('held')),
};

function headPart(r, mood, crown) {
  const earL = earPaths(r.c.ears, false), earR = earPaths(r.c.ears, true);
  return blob([`path d="${earL.outer}"`, `path d="${earR.outer}"`, 'ellipse cx="100" cy="90" rx="50" ry="43"'], r.fur.base, patternLayer(r.c.pattern, r.pc, r.body))
    + `<path d="${earL.inner} ${earR.inner}" fill="#F28CA0" opacity=".7"/>`
    + face(mood, r.eyes, r.c.eyeShape, r.nose) + r.accSvg(r.accIn('head')) + (crown ? CROWN : '');
}

const SIDE_PARTS = {
  tail: (r) => tailStroke(SIDE_TAILS[r.c.tail] || SIDE_TAILS.long, r.tail.w, r.tailColor, r.c.pattern === 'tabby' && r.pc),
  body: (r) => {
    const neck = r.accIn('neck');
    const cape = r.accIn('back').includes('cape')
      ? `<path d="M54 118 Q96 98 138 116 L130 152 Q94 142 58 154 Z" fill="${r.accColorOf('cape')}" stroke="${LINE}" stroke-width="3" stroke-linejoin="round"/>` : '';
    const collar = neck.length
      ? `<path d="M134 108 Q148 128 136 152" stroke="${r.accColorOf(neck[0])}" stroke-width="9" fill="none" stroke-linecap="round"/>
        ${neck.includes('bell') ? `<circle cx="144" cy="138" r="6" fill="#F4C542" stroke="${LINE}" stroke-width="2"/>` : ''}` : '';
    return blob([`ellipse cx="96" cy="140" rx="${r.body.rx + 6}" ry="28"`], r.fur.base, sidePattern(r.c.pattern, r.pc)) + cape + collar;
  },
};

// 다리 (24×48 상자, 관절은 (12,6)). far = 반대편 다리라 조금 어둡게
function sideLeg(r, far) {
  const legPattern = r.c.pattern === 'siamese' ? `<rect x="0" y="0" width="24" height="48" fill="${r.pc}"/>`
    : ['socks', 'tuxedo'].includes(r.c.pattern) ? '<rect x="0" y="28" width="24" height="20" fill="#FFFFFF"/>' : '';
  return blob(['rect x="4" y="0" width="16" height="40" rx="8"', 'ellipse cx="12" cy="41" rx="9" ry="6"'], r.fur.base,
    legPattern + (far ? '<rect x="0" y="0" width="24" height="48" fill="#000" opacity=".16"/>' : ''));
}

/** 부위 하나의 SVG. part: front-* | head | side-* | leg-near | leg-far */
export function catPartSVG(cat, part, { mood = 'normal', crown = false } = {}) {
  const r = resolve(cat);
  const wrap = (box, w, h, inner) => `<svg viewBox="${box}" width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">${inner}</svg>`;
  if (part === 'head') return wrap('30 0 140 140', 280, 280, headPart(r, mood, crown));
  if (part === 'leg-near' || part === 'leg-far') return wrap('-4 -4 32 56', 64, 112, sideLeg(r, part === 'leg-far'));
  const [pose, name] = part.split('-');
  const inner = (pose === 'side' ? SIDE_PARTS : FRONT_PARTS)[name](r);
  return wrap('0 0 200 200', 400, 400, inner);
}

export const pawOffset = (cat) => find(BODY_TYPES, { ...DEFAULT_CAT, ...cat }.body).paw;

// 부위 크기(SVG 좌표 단위): 정면·옆모습 200×200, 머리 140×140, 다리 32×56
const PART_UNITS = (part) => (part === 'head' ? [140, 140] : part.startsWith('leg-') ? [32, 56] : [200, 200]);
const spriteCache = new Map();

/**
 * 애니메이션 부위 스프라이트 (캐시). SVG를 한 번만 비트맵으로 구워 두고 매 프레임에는 비트맵을 그립니다.
 * res = 200단위를 몇 px로 구울지 (작게 그리는 마을은 작게, 책 상세는 크게)
 * @returns {{ ready: boolean, canvas: HTMLCanvasElement|null }}
 */
export function catPartSprite(cat, part, { mood = 'normal', crown = false } = {}, res = 128) {
  const key = JSON.stringify([cat, part, mood, crown, res]);
  if (!spriteCache.has(key)) {
    const sprite = { ready: false, canvas: null };
    const [uw, uh] = PART_UNITS(part);
    const img = new Image();
    img.onload = () => {
      const c = document.createElement('canvas');
      c.width = Math.ceil((uw * res) / 200);
      c.height = Math.ceil((uh * res) / 200);
      c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
      sprite.canvas = c;
      sprite.ready = true;
    };
    img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(catPartSVG(cat, part, { mood, crown }));
    spriteCache.set(key, sprite);
  }
  return spriteCache.get(key);
}
