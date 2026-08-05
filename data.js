// ═══════════════════════════════════════════════════════════════
//  다이어터 연금술사 — 게임 데이터
//  (독립 신규 게임 / MVP vertical slice)
// ═══════════════════════════════════════════════════════════════

// ─── 재료 (Ingredients) ───
// rarity: 채집 시 뽑힐 가중치에 사용 (숫자가 클수록 흔함)
const INGREDIENTS = {
  herb:     { id: 'herb',     emoji: '🌿', name: '약초',   rarity: 'common',   weight: 30 },
  berry:    { id: 'berry',    emoji: '🍓', name: '산딸기', rarity: 'common',   weight: 30 },
  petal:    { id: 'petal',    emoji: '🌸', name: '꽃잎',   rarity: 'common',   weight: 26 },
  dew:      { id: 'dew',      emoji: '💧', name: '이슬',   rarity: 'uncommon', weight: 16 },
  mushroom: { id: 'mushroom', emoji: '🍄', name: '버섯',   rarity: 'uncommon', weight: 14 },
  crystal:  { id: 'crystal',  emoji: '💎', name: '수정',   rarity: 'rare',     weight: 6  },
};

// ─── 채집 장소 (Gathering Spots) ───
// pool: 이 장소에서 나올 수 있는 재료 id 목록 (해당 재료의 weight로 가중 추첨)
const SPOTS = {
  meadow: {
    id: 'meadow', emoji: '🌷', name: '꽃 들판',
    desc: '햇살 가득한 들판. 흔한 약초와 꽃이 자란다.',
    pool: ['herb', 'berry', 'petal', 'dew'],
  },
  forest: {
    id: 'forest', emoji: '🌲', name: '이끼 숲',
    desc: '축축하고 어두운 숲. 버섯과 이슬이 맺힌다.',
    pool: ['herb', 'dew', 'mushroom', 'petal'],
  },
  cave: {
    id: 'cave', emoji: '🕳️', name: '수정 동굴',
    desc: '반짝이는 광물의 동굴. 드물게 수정을 얻는다.',
    pool: ['mushroom', 'crystal', 'dew', 'herb'],
  },
};

// ─── 레시피 (Recipes) ───
// inputs: 정렬된 재료 id 배열 (조합 판정용). result: 산출물 정의.
// kind: 'potion' | 'creature'
// 물약(potion) → 마시면 스탯 영구 상승 (소모)
// 크리처(creature) → 방에 전시, 패시브 매력 보너스
const RECIPES = [
  // ── 물약 ──
  {
    inputs: ['dew', 'herb'],
    result: { id: 'vitality', kind: 'potion', emoji: '🧴', name: '생기 물약',
      desc: '피부에 생기가 도는 초록빛 물약.', beauty: 3, charm: 0 },
  },
  {
    inputs: ['berry', 'petal'],
    result: { id: 'blush', kind: 'potion', emoji: '💄', name: '홍조 물약',
      desc: '볼에 발그레한 홍조를 더한다.', beauty: 1, charm: 3 },
  },
  {
    inputs: ['dew', 'petal'],
    result: { id: 'fragrance', kind: 'potion', emoji: '🌷', name: '향기 물약',
      desc: '은은한 꽃향기를 두른다.', beauty: 1, charm: 2 },
  },
  {
    inputs: ['crystal', 'mushroom'],
    result: { id: 'mystic', kind: 'potion', emoji: '🔮', name: '신비 물약',
      desc: '신비로운 아우라를 뿜는 물약.', beauty: 4, charm: 2 },
  },
  {
    inputs: ['berry', 'herb', 'petal'],
    result: { id: 'rainbow', kind: 'potion', emoji: '🌈', name: '무지개 엘릭서',
      desc: '전설의 엘릭서. 비주얼과 아우라를 크게 끌어올린다.', beauty: 5, charm: 5 },
  },

  // ── 크리처 ──
  {
    inputs: ['crystal', 'dew'],
    result: { id: 'butterfly', kind: 'creature', emoji: '🦋', name: '반짝 나비',
      desc: '주위를 맴도는 수정빛 나비.', charmBonus: 2 },
  },
  {
    inputs: ['mushroom', 'petal'],
    result: { id: 'frog', kind: 'creature', emoji: '🐸', name: '꽃개구리',
      desc: '꽃잎을 이고 다니는 귀여운 개구리.', charmBonus: 1 },
  },
  {
    inputs: ['berry', 'crystal', 'mushroom'],
    result: { id: 'unicorn', kind: 'creature', emoji: '🦄', name: '유니콘',
      desc: '순수한 자에게만 나타난다는 전설의 유니콘.', charmBonus: 5 },
  },
];

// ─── 실패작 (Sludge) ───
// 알려지지 않은/유효하지 않은 조합의 결과물
const SLUDGE = { id: 'sludge', kind: 'sludge', emoji: '🟤', name: '수상한 진흙',
  desc: '뭔가 잘못됐다... 재료가 아까워도 다음을 노려보자.' };

// ─── 매력 등급 (Charm Tiers) ───
// 매력 총합(비주얼 + 아우라 + 크리처 보너스)에 따른 칭호
const TIERS = [
  { min: 0,   emoji: '🌱', title: '새싹' },
  { min: 15,  emoji: '🌸', title: '꽃봉오리' },
  { min: 35,  emoji: '🧚', title: '요정' },
  { min: 60,  emoji: '👑', title: '뮤즈' },
  { min: 100, emoji: '✨', title: '여신' },
];

function getTier(total) {
  let t = TIERS[0];
  for (const tier of TIERS) if (total >= tier.min) t = tier;
  return t;
}

// ─── 옷장 (Wardrobe) ───
// 아바타 장비 카탈로그. 슬롯별 목록의 첫 항목은 항상 '없음'(kind:'none').
// 옷: 상의(top)/하의(bottom)는 따로 착용, 원피스(dress)는 상하 일체.
//     원피스 착용 시 상·하의는 렌더링에서 무시됨.
// 악세사리: 서클렛(circlet)/귀걸이(earring)/목걸이(necklace) — 추후 슬롯 추가 가능.
const WARDROBE = {
  // ── 커스터마이징 (잠금/해금 대상) ──
  // starter: true → 처음부터 보유 / (없으면 잠김 → 플레이하며 획득)
  hair: [
    { id: 'hair_long',     slot: 'hair', kind: 'long',     name: '긴 생머리', emoji: '💁‍♀️', starter: true },
    { id: 'hair_bob',      slot: 'hair', kind: 'bob',      name: '단발',     emoji: '💇‍♀️', starter: true },
    { id: 'hair_twin',     slot: 'hair', kind: 'twin',     name: '양갈래',   emoji: '👧',    starter: true },
    { id: 'hair_ponytail', slot: 'hair', kind: 'ponytail', name: '포니테일', emoji: '🎠' },
    { id: 'hair_wave',     slot: 'hair', kind: 'wave',     name: '웨이브',   emoji: '🌊' },
  ],
  hairColor: [
    { id: 'hcol_brown',  slot: 'hairColor', kind: 'color', name: '브라운',   color: '#7b5640', starter: true },
    { id: 'hcol_black',  slot: 'hairColor', kind: 'color', name: '블랙',     color: '#3b2f2c', starter: true },
    { id: 'hcol_blonde', slot: 'hairColor', kind: 'color', name: '금발',     color: '#e6c37a', starter: true },
    { id: 'hcol_pink',   slot: 'hairColor', kind: 'color', name: '핑크',     color: '#ffa6cf', starter: true },
    { id: 'hcol_lav',    slot: 'hairColor', kind: 'color', name: '라벤더',   color: '#c4a9ff', starter: true },
    { id: 'hcol_mint',   slot: 'hairColor', kind: 'color', name: '민트',     color: '#8fe0c0' },
    { id: 'hcol_silver', slot: 'hairColor', kind: 'color', name: '실버',     color: '#d6d6e2' },
  ],
  expression: [
    { id: 'exp_smile',    slot: 'expression', kind: 'smile',    name: '방긋', emoji: '🙂', starter: true },
    { id: 'exp_wink',     slot: 'expression', kind: 'wink',     name: '윙크', emoji: '😉', starter: true },
    { id: 'exp_happy',    slot: 'expression', kind: 'happy',    name: '활짝', emoji: '😄', starter: true },
    { id: 'exp_surprise', slot: 'expression', kind: 'surprise', name: '놀람', emoji: '😮' },
    { id: 'exp_cool',     slot: 'expression', kind: 'cool',     name: '시크', emoji: '😎' },
  ],
  tattoo: [
    { id: 'tattoo_none', slot: 'tattoo', kind: 'none',  name: '없음' },
    { id: 'tattoo_star', slot: 'tattoo', kind: 'star',  name: '별',     color: '#c98bd6', emoji: '⭐' },
    { id: 'tattoo_tear', slot: 'tattoo', kind: 'tear',  name: '물방울', color: '#8ad0ff', emoji: '💧' },
    { id: 'tattoo_heart',slot: 'tattoo', kind: 'heart', name: '하트',   color: '#ff8fb0', emoji: '❤️' },
    { id: 'tattoo_rune', slot: 'tattoo', kind: 'rune',  name: '룬문양', color: '#a98bff', emoji: '✴️' },
  ],

  // ── 옷 / 악세사리 (기본 전부 보유) ──
  top: [
    { id: 'top_none',   slot: 'top', kind: 'none',  name: '없음' },
    { id: 'top_tee',    slot: 'top', kind: 'tee',    name: '기본 티', color: '#ffb8d9', sleeve: 'short' },
    { id: 'top_blouse', slot: 'top', kind: 'blouse', name: '블라우스', color: '#fff0b8', sleeve: 'short' },
    { id: 'top_knit',   slot: 'top', kind: 'knit',   name: '니트',   color: '#c9b6ff', sleeve: 'long' },
    { id: 'top_hoodie', slot: 'top', kind: 'hoodie', name: '후드티', color: '#9fe0c4', sleeve: 'long' },
  ],
  bottom: [
    { id: 'bottom_none',   slot: 'bottom', kind: 'none',   name: '없음' },
    { id: 'bottom_skirt',  slot: 'bottom', kind: 'skirt',  name: '주름치마', color: '#c9b6ff' },
    { id: 'bottom_shorts', slot: 'bottom', kind: 'shorts', name: '반바지',  color: '#ffc2a8' },
    { id: 'bottom_pants',  slot: 'bottom', kind: 'pants',  name: '청바지',  color: '#a8c4ec' },
  ],
  dress: [
    { id: 'dress_none',     slot: 'dress', kind: 'none',  name: '없음' },
    { id: 'dress_onepiece', slot: 'dress', kind: 'aline', name: '원피스', color: '#ffc2e2' },
    { id: 'dress_gown',     slot: 'dress', kind: 'gown',  name: '드레스', color: '#b8d4ff' },
  ],
  circlet: [
    { id: 'circlet_none',   slot: 'circlet', kind: 'none',   name: '없음' },
    { id: 'circlet_flower', slot: 'circlet', kind: 'flower', name: '꽃 서클렛', color: '#ff9ec4', emoji: '🌸' },
    { id: 'circlet_tiara',  slot: 'circlet', kind: 'tiara',  name: '티아라',    color: '#ffe08a', emoji: '👑' },
    { id: 'circlet_band',   slot: 'circlet', kind: 'band',   name: '리본밴드',  color: '#ffd0e6', emoji: '🎀' },
  ],
  earring: [
    { id: 'earring_none', slot: 'earring', kind: 'none', name: '없음' },
    { id: 'earring_drop', slot: 'earring', kind: 'drop', name: '물방울', color: '#8ad0ff', emoji: '💧' },
    { id: 'earring_hoop', slot: 'earring', kind: 'hoop', name: '링',    color: '#ffd76a', emoji: '⭕' },
    { id: 'earring_star', slot: 'earring', kind: 'star', name: '별',    color: '#ffe08a', emoji: '⭐' },
  ],
  necklace: [
    { id: 'necklace_none',    slot: 'necklace', kind: 'none',    name: '없음' },
    { id: 'necklace_pendant', slot: 'necklace', kind: 'pendant', name: '펜던트', color: '#ffd76a', emoji: '📿' },
    { id: 'necklace_pearl',   slot: 'necklace', kind: 'pearl',   name: '진주',   color: '#ffffff', emoji: '🤍' },
    { id: 'necklace_choker',  slot: 'necklace', kind: 'choker',  name: '초커',   color: '#ff9ec4', emoji: '🎀' },
  ],
};

// 옷장 슬롯 메타 (UI 탭 순서/라벨)
// gated: true → 잠금/해금 대상 (starter 아이템만 처음 보유, 나머지는 획득 필요)
const WARDROBE_SLOTS = [
  { slot: 'hair',      label: '헤어',    emoji: '💇', gated: true },
  { slot: 'hairColor', label: '헤어컬러', emoji: '🎨', gated: true },
  { slot: 'expression',label: '표정',    emoji: '😊', gated: true },
  { slot: 'tattoo',    label: '문신',    emoji: '✨', gated: true },
  { slot: 'top',       label: '상의',    emoji: '👕' },
  { slot: 'bottom',    label: '하의',    emoji: '👖' },
  { slot: 'dress',     label: '원피스',  emoji: '👗' },
  { slot: 'circlet',   label: '서클렛',  emoji: '👑' },
  { slot: 'earring',   label: '귀걸이',  emoji: '💎' },
  { slot: 'necklace',  label: '목걸이',  emoji: '📿' },
];

// ─── 에너지 (Energy / 행동력) ───
// 현실 24시간 = 게임 24시간. 로컬 자정(00:00)마다 dailyFill 만큼 충전.
// cap: 현재 상한(=하루 충전량). 추후 유료 구매 시 상한 확장 여지.
// cost: 행동별 소모량. 추후 크리처/공간 돌보기 등 추가 예정.
const ENERGY = {
  cap: 1000,
  dailyFill: 1000,
  cost: { gather: 10, brew: 25 },
};

// 새 캐릭터 기본 착장
const DEFAULT_OUTFIT = {
  hair: 'hair_long', hairColor: 'hcol_brown', expression: 'exp_smile', tattoo: 'tattoo_none',
  top: 'top_tee', bottom: 'bottom_skirt', dress: 'dress_none',
  circlet: 'circlet_none', earring: 'earring_none', necklace: 'necklace_none',
};

// 조합 판정용: 재료 id 배열을 정렬해 문자열 키로
function recipeKey(ids) {
  return [...ids].sort().join('+');
}

// 레시피 빠른 조회 맵
const RECIPE_MAP = {};
for (const r of RECIPES) RECIPE_MAP[recipeKey(r.inputs)] = r.result;

window.GameData = {
  INGREDIENTS, SPOTS, RECIPES, RECIPE_MAP, SLUDGE, TIERS,
  WARDROBE, WARDROBE_SLOTS, DEFAULT_OUTFIT, ENERGY,
  getTier, recipeKey,
};
