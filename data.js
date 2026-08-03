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

// 조합 판정용: 재료 id 배열을 정렬해 문자열 키로
function recipeKey(ids) {
  return [...ids].sort().join('+');
}

// 레시피 빠른 조회 맵
const RECIPE_MAP = {};
for (const r of RECIPES) RECIPE_MAP[recipeKey(r.inputs)] = r.result;

window.GameData = {
  INGREDIENTS, SPOTS, RECIPES, RECIPE_MAP, SLUDGE, TIERS,
  getTier, recipeKey,
};
