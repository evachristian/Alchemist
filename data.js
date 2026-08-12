// ═══════════════════════════════════════════════════════════════
//  다이어터 연금술사 — 게임 데이터
//  (독립 신규 게임 / MVP vertical slice)
// ═══════════════════════════════════════════════════════════════

// ─── 재료 (Ingredients) ───
// weight: 채집 시 뽑힐 가중치 (클수록 흔함)
// rare:   맵마다 하나씩 있는 '특별한 재료'. 가중 추첨과 별개로 SPECIAL_RATE 확률로 나온다.
const INGREDIENTS = {
  // ── 뾰족 산악 지대 ──
  iron_ore:      { id: 'iron_ore', emoji: '⛏️', name: '무쇠 광석', zone: 'mountain', weight: 24 },
  crystal:       { id: 'crystal', emoji: '💎', name: '수정', zone: 'mountain', weight: 6 },
  cave_moss:     { id: 'cave_moss', emoji: '🪨', name: '동굴 이끼', zone: 'mountain', weight: 26 },
  snow_bud:      { id: 'snow_bud', emoji: '❄️', name: '설화 봉오리', zone: 'mountain', weight: 14 },
  eagle_feather: { id: 'eagle_feather', emoji: '🪶', name: '매 깃털', zone: 'mountain', weight: 12 },
  echo_stone:    { id: 'echo_stone', emoji: '🗿', name: '메아리 돌', zone: 'mountain', weight: 18 },
  pine_cone:     { id: 'pine_cone', emoji: '🌰', name: '솔방울', zone: 'mountain', weight: 28 },
  mist_drop:     { id: 'mist_drop', emoji: '💧', name: '산안개 방울', zone: 'mountain', weight: 20 },
  flint:         { id: 'flint', emoji: '🔥', name: '부싯돌', zone: 'mountain', weight: 22 },
  cloud_moss:    { id: 'cloud_moss', emoji: '☁️', name: '구름 이끼', zone: 'mountain', weight: 10 },
  // ── 포근 평야 지대 ──
  herb:          { id: 'herb', emoji: '🌿', name: '약초', zone: 'plain', weight: 30 },
  berry:         { id: 'berry', emoji: '🍓', name: '산딸기', zone: 'plain', weight: 30 },
  wheat:         { id: 'wheat', emoji: '🌾', name: '밀 이삭', zone: 'plain', weight: 28 },
  clover:        { id: 'clover', emoji: '🍀', name: '네잎 클로버', zone: 'plain', weight: 10 },
  honey:         { id: 'honey', emoji: '🍯', name: '들꿀', zone: 'plain', weight: 16 },
  thistle:       { id: 'thistle', emoji: '🌱', name: '엉겅퀴', zone: 'plain', weight: 24 },
  sun_seed:      { id: 'sun_seed', emoji: '🌻', name: '해바라기 씨', zone: 'plain', weight: 22 },
  dew:           { id: 'dew', emoji: '💧', name: '이슬', zone: 'plain', weight: 16 },
  walnut:        { id: 'walnut', emoji: '🥜', name: '호두', zone: 'plain', weight: 20 },
  butter_flower: { id: 'butter_flower', emoji: '🧈', name: '버터꽃', zone: 'plain', weight: 12 },
  // ── 울창 숲 지대 ──
  petal:         { id: 'petal', emoji: '🌸', name: '꽃잎', zone: 'forest', weight: 26 },
  mushroom:      { id: 'mushroom', emoji: '🍄', name: '버섯', zone: 'forest', weight: 14 },
  fern:          { id: 'fern', emoji: '🪴', name: '고사리', zone: 'forest', weight: 26 },
  moss_branch:   { id: 'moss_branch', emoji: '🌳', name: '이끼 가지', zone: 'forest', weight: 24 },
  firefly:       { id: 'firefly', emoji: '🐛', name: '반딧불이', zone: 'forest', weight: 12 },
  spider_silk:   { id: 'spider_silk', emoji: '🕸️', name: '거미줄 실', zone: 'forest', weight: 16 },
  owl_feather:   { id: 'owl_feather', emoji: '🦉', name: '부엉이 깃털', zone: 'forest', weight: 10 },
  tree_resin:    { id: 'tree_resin', emoji: '🟠', name: '나무 수액', zone: 'forest', weight: 20 },
  night_dew:     { id: 'night_dew', emoji: '🌙', name: '밤이슬', zone: 'forest', weight: 18 },
  wild_ivy:      { id: 'wild_ivy', emoji: '🍃', name: '들담쟁이', zone: 'forest', weight: 28 },
  // ── 황량 황무지 ──
  sand_grain:    { id: 'sand_grain', emoji: '🏖️', name: '까끌 모래', zone: 'waste', weight: 30 },
  cactus:        { id: 'cactus', emoji: '🌵', name: '가시선인장', zone: 'waste', weight: 22 },
  bone_frag:     { id: 'bone_frag', emoji: '🦴', name: '마른 뼛조각', zone: 'waste', weight: 16 },
  frog_egg:      { id: 'frog_egg', emoji: '🐸', name: '개구리 알', zone: 'waste', weight: 18 },
  rust_nail:     { id: 'rust_nail', emoji: '🔩', name: '녹슨 못', zone: 'waste', weight: 24 },
  salt_crust:    { id: 'salt_crust', emoji: '🧂', name: '소금 결정', zone: 'waste', weight: 20 },
  mirage_shard:  { id: 'mirage_shard', emoji: '🌀', name: '신기루 조각', zone: 'waste', weight: 8 },
  dry_root:      { id: 'dry_root', emoji: '🪵', name: '마른 뿌리', zone: 'waste', weight: 26 },
  lizard_scale:  { id: 'lizard_scale', emoji: '🦎', name: '도마뱀 비늘', zone: 'waste', weight: 14 },
  black_feather: { id: 'black_feather', emoji: '🖤', name: '검은 깃털', zone: 'waste', weight: 12 },
  // ── 반짝 해안 지대 ──
  shell:         { id: 'shell', emoji: '🐚', name: '조개껍데기', zone: 'shore', weight: 30 },
  seaweed:       { id: 'seaweed', emoji: '🥬', name: '미역 줄기', zone: 'shore', weight: 26 },
  pearl_bit:     { id: 'pearl_bit', emoji: '⚪', name: '작은 진주', zone: 'shore', weight: 8 },
  coral:         { id: 'coral', emoji: '🪸', name: '산호 조각', zone: 'shore', weight: 14 },
  starfish:      { id: 'starfish', emoji: '⭐', name: '불가사리', zone: 'shore', weight: 16 },
  sea_glass:     { id: 'sea_glass', emoji: '🔷', name: '파도 유리', zone: 'shore', weight: 18 },
  driftwood:     { id: 'driftwood', emoji: '🪵', name: '유목', zone: 'shore', weight: 24 },
  crab_claw:     { id: 'crab_claw', emoji: '🦀', name: '게 집게', zone: 'shore', weight: 20 },
  foam:          { id: 'foam', emoji: '🫧', name: '물거품', zone: 'shore', weight: 28 },
  sea_dew:       { id: 'sea_dew', emoji: '💦', name: '바다 이슬', zone: 'shore', weight: 12 },
  // ── 특별한 재료 (맵당 1종, 확률 0.1%) ──
  sp_starore:      { id: 'sp_starore', emoji: '🌟', name: '별빛 원석', zone: 'mountain', weight: 0, rare: true },
  sp_laketear:     { id: 'sp_laketear', emoji: '💠', name: '호수의 눈물', zone: 'mountain', weight: 0, rare: true },
  sp_rockchip:     { id: 'sp_rockchip', emoji: '🪨', name: '흔들바위 조각', zone: 'mountain', weight: 0, rare: true },
  sp_cloudwool:    { id: 'sp_cloudwool', emoji: '🧶', name: '구름 솜', zone: 'mountain', weight: 0, rare: true },
  sp_goldfeather:  { id: 'sp_goldfeather', emoji: '🥇', name: '매의 황금깃', zone: 'mountain', weight: 0, rare: true },
  sp_everfrost:    { id: 'sp_everfrost', emoji: '🌬️', name: '영원의 서리꽃', zone: 'mountain', weight: 0, rare: true },
  sp_echogem:      { id: 'sp_echogem', emoji: '🔮', name: '메아리 수정', zone: 'mountain', weight: 0, rare: true },
  sp_rustykey:     { id: 'sp_rustykey', emoji: '🗝️', name: '녹슨 열쇠', zone: 'mountain', weight: 0, rare: true },
  sp_meteor:       { id: 'sp_meteor', emoji: '☄️', name: '유성 파편', zone: 'mountain', weight: 0, rare: true },
  sp_fireheart:    { id: 'sp_fireheart', emoji: '🔥', name: '불의 심장', zone: 'mountain', weight: 0, rare: true },
  sp_sunbead:      { id: 'sp_sunbead', emoji: '🔆', name: '햇살 결정', zone: 'plain', weight: 0, rare: true },
  sp_silverspoon:  { id: 'sp_silverspoon', emoji: '🥄', name: '미식가의 은수저', zone: 'plain', weight: 0, rare: true },
  sp_mirrorbit:    { id: 'sp_mirrorbit', emoji: '🔹', name: '거울 조각', zone: 'plain', weight: 0, rare: true },
  sp_goldwalnut:   { id: 'sp_goldwalnut', emoji: '🏆', name: '황금 호두', zone: 'plain', weight: 0, rare: true },
  sp_windseed:     { id: 'sp_windseed', emoji: '🌪️', name: '바람의 씨앗', zone: 'plain', weight: 0, rare: true },
  sp_queenhoney:   { id: 'sp_queenhoney', emoji: '👑', name: '여왕벌의 꿀', zone: 'plain', weight: 0, rare: true },
  sp_duskear:      { id: 'sp_duskear', emoji: '🌆', name: '노을 이삭', zone: 'plain', weight: 0, rare: true },
  sp_fiveleaf:     { id: 'sp_fiveleaf', emoji: '🍀', name: '행운의 다섯잎', zone: 'plain', weight: 0, rare: true },
  sp_lostribbon:   { id: 'sp_lostribbon', emoji: '🎀', name: '잃어버린 리본', zone: 'plain', weight: 0, rare: true },
  sp_fallenstar:   { id: 'sp_fallenstar', emoji: '⭐', name: '떨어진 별', zone: 'plain', weight: 0, rare: true },
  sp_mistseed:     { id: 'sp_mistseed', emoji: '🫧', name: '안개의 씨앗', zone: 'forest', weight: 0, rare: true },
  sp_lostcompass:  { id: 'sp_lostcompass', emoji: '🧭', name: '길잃은 나침반', zone: 'forest', weight: 0, rare: true },
  sp_capcrown:     { id: 'sp_capcrown', emoji: '👑', name: '버섯왕관', zone: 'forest', weight: 0, rare: true },
  sp_fireflyjar:   { id: 'sp_fireflyjar', emoji: '🏮', name: '반딧불 유리병', zone: 'forest', weight: 0, rare: true },
  sp_owleye:       { id: 'sp_owleye', emoji: '👁️', name: '부엉이의 눈', zone: 'forest', weight: 0, rare: true },
  sp_silverweb:    { id: 'sp_silverweb', emoji: '🪡', name: '은실 거미줄', zone: 'forest', weight: 0, rare: true },
  sp_spiritbit:    { id: 'sp_spiritbit', emoji: '🧚', name: '정령의 조각', zone: 'forest', weight: 0, rare: true },
  sp_whisperbloom: { id: 'sp_whisperbloom', emoji: '🌺', name: '속삭임 꽃', zone: 'forest', weight: 0, rare: true },
  sp_moondust:     { id: 'sp_moondust', emoji: '💫', name: '달빛 가루', zone: 'forest', weight: 0, rare: true },
  sp_mosskey:      { id: 'sp_mosskey', emoji: '🔑', name: '이끼 낀 열쇠', zone: 'forest', weight: 0, rare: true },
  sp_frogcrown:    { id: 'sp_frogcrown', emoji: '👑', name: '청개구리 왕관', zone: 'waste', weight: 0, rare: true },
  sp_desertglass:  { id: 'sp_desertglass', emoji: '🔷', name: '사막의 유리', zone: 'waste', weight: 0, rare: true },
  sp_saltrose:     { id: 'sp_saltrose', emoji: '🌹', name: '소금 장미', zone: 'waste', weight: 0, rare: true },
  sp_brokenspoke:  { id: 'sp_brokenspoke', emoji: '⚙️', name: '부서진 바퀴살', zone: 'waste', weight: 0, rare: true },
  sp_thorncrown:   { id: 'sp_thorncrown', emoji: '🌵', name: '가시 왕관', zone: 'waste', weight: 0, rare: true },
  sp_fossil:       { id: 'sp_fossil', emoji: '🦕', name: '고대의 화석', zone: 'waste', weight: 0, rare: true },
  sp_miragevial:   { id: 'sp_miragevial', emoji: '🧪', name: '신기루 유리병', zone: 'waste', weight: 0, rare: true },
  sp_boltcore:     { id: 'sp_boltcore', emoji: '⚡', name: '번개 맞은 철심', zone: 'waste', weight: 0, rare: true },
  sp_goldscale:    { id: 'sp_goldscale', emoji: '🟡', name: '도마뱀의 금비늘', zone: 'waste', weight: 0, rare: true },
  sp_crowtreasure: { id: 'sp_crowtreasure', emoji: '💍', name: '까마귀의 보물', zone: 'waste', weight: 0, rare: true },
  sp_starsand:     { id: 'sp_starsand', emoji: '✨', name: '별모래', zone: 'shore', weight: 0, rare: true },
  sp_singingconch: { id: 'sp_singingconch', emoji: '🎺', name: '노래하는 소라', zone: 'shore', weight: 0, rare: true },
  sp_waveheart:    { id: 'sp_waveheart', emoji: '💙', name: '파도의 심장', zone: 'shore', weight: 0, rare: true },
  sp_beaconember:  { id: 'sp_beaconember', emoji: '🕯️', name: '등대의 불씨', zone: 'shore', weight: 0, rare: true },
  sp_coralcrown:   { id: 'sp_coralcrown', emoji: '👑', name: '산호 왕관', zone: 'shore', weight: 0, rare: true },
  sp_gullletter:   { id: 'sp_gullletter', emoji: '✉️', name: '갈매기의 편지', zone: 'shore', weight: 0, rare: true },
  sp_captainwatch: { id: 'sp_captainwatch', emoji: '⏱️', name: '선장의 회중시계', zone: 'shore', weight: 0, rare: true },
  sp_rainbowfoam:  { id: 'sp_rainbowfoam', emoji: '🌈', name: '무지개 거품', zone: 'shore', weight: 0, rare: true },
  sp_duskshell:    { id: 'sp_duskshell', emoji: '🌇', name: '노을 조개', zone: 'shore', weight: 0, rare: true },
  sp_mermaidscale: { id: 'sp_mermaidscale', emoji: '🧜‍♀️', name: '인어의 비늘', zone: 'shore', weight: 0, rare: true },
};

// 특별한 재료가 나올 확률 (0.001 = 0.1%)
const SPECIAL_RATE = 0.001;

// ─── 채집 지대 (Zones) ─── 채집 화면의 카테고리 탭
const ZONES = [
  { id: 'plain',    emoji: '🌾', name: '포근 평야 지대' },
  { id: 'forest',   emoji: '🌲', name: '울창 숲 지대' },
  { id: 'mountain', emoji: '⛰️', name: '뾰족 산악 지대' },
  { id: 'shore',    emoji: '🐚', name: '반짝 해안 지대' },
  { id: 'waste',    emoji: '🏜️', name: '황량 황무지' },
];

// ─── 채집 맵 (Maps) ─── 지대마다 10곳
// pool: 일반 재료 5종 (weight 로 가중 추첨) / special: 0.1% 확률의 특별 재료
const MAPS = [
  // ── 포근 평야 지대 ── (해금 0~30점)
  { id: 'p_hill', zone: 'plain', emoji: '☀️', name: '햇살 언덕',
    desc: '하루 종일 볕이 드는 언덕.',
    pool: ['herb', 'berry', 'sun_seed', 'wheat', 'dew'], unlock: 0, special: 'sp_sunbead' },
  { id: 'p_gourmet', zone: 'plain', emoji: '🍽️', name: '미식가의 들',
    desc: '맛있는 것만 자란다는 들.',
    pool: ['berry', 'honey', 'walnut', 'wheat', 'herb'], unlock: 0, special: 'sp_silverspoon' },
  { id: 'p_mirror', zone: 'plain', emoji: '🪞', name: '거울 저수지',
    desc: '하늘을 그대로 비추는 저수지.',
    pool: ['dew', 'wheat', 'thistle', 'herb', 'butter_flower'], unlock: 0, special: 'sp_mirrorbit' },
  { id: 'p_walnut', zone: 'plain', emoji: '🌰', name: '호두 마루',
    desc: '호두나무가 줄지어 선 마루.',
    pool: ['walnut', 'wheat', 'thistle', 'berry', 'herb'], unlock: 0, special: 'sp_goldwalnut' },
  { id: 'p_windmill', zone: 'plain', emoji: '🌬️', name: '바람개비 밭',
    desc: '바람개비가 끝없이 돌아가는 밭.',
    pool: ['wheat', 'sun_seed', 'thistle', 'clover', 'herb'], unlock: 4, special: 'sp_windseed' },
  { id: 'p_bee', zone: 'plain', emoji: '🐝', name: '꿀벌 목장',
    desc: '벌들이 부지런히 오가는 목장.',
    pool: ['honey', 'butter_flower', 'berry', 'thistle', 'herb'], unlock: 8, special: 'sp_queenhoney' },
  { id: 'p_sunset', zone: 'plain', emoji: '🌇', name: '노을 밀밭',
    desc: '노을에 물드는 밀밭.',
    pool: ['wheat', 'sun_seed', 'walnut', 'dew', 'berry'], unlock: 12, special: 'sp_duskear' },
  { id: 'p_clover', zone: 'plain', emoji: '🍀', name: '네잎 들판',
    desc: '네잎 클로버가 숨어 있는 들판.',
    pool: ['clover', 'herb', 'dew', 'thistle', 'butter_flower'], unlock: 18, special: 'sp_fiveleaf' },
  { id: 'p_picnic', zone: 'plain', emoji: '🧺', name: '소풍 바위',
    desc: '소풍 오기 좋은 널찍한 바위.',
    pool: ['berry', 'honey', 'walnut', 'herb', 'wheat'], unlock: 24, special: 'sp_lostribbon' },
  { id: 'p_starfield', zone: 'plain', emoji: '✨', name: '별헤는 평지',
    desc: '누워서 별을 세는 평지.',
    pool: ['dew', 'butter_flower', 'clover', 'thistle', 'sun_seed'], unlock: 30, special: 'sp_fallenstar' },
  // ── 울창 숲 지대 ── (해금 38~102점)
  { id: 'f_mist', zone: 'forest', emoji: '🌫️', name: '안개 숲 외곽',
    desc: '늘 옅은 안개가 낀 숲의 가장자리.',
    pool: ['night_dew', 'moss_branch', 'fern', 'wild_ivy', 'petal'], unlock: 38, special: 'sp_mistseed' },
  { id: 'f_path', zone: 'forest', emoji: '🚶', name: '완만한 숲길',
    desc: '걷기 좋은 완만한 숲길.',
    pool: ['wild_ivy', 'fern', 'moss_branch', 'petal', 'tree_resin'], unlock: 44, special: 'sp_lostcompass' },
  { id: 'f_mushroom', zone: 'forest', emoji: '🍄', name: '버섯 마을',
    desc: '버섯이 집처럼 솟은 자리.',
    pool: ['mushroom', 'fern', 'tree_resin', 'moss_branch', 'night_dew'], unlock: 50, special: 'sp_capcrown' },
  { id: 'f_firefly', zone: 'forest', emoji: '🐛', name: '반딧불 늪가',
    desc: '밤이면 반딧불이 가득한 늪가.',
    pool: ['firefly', 'night_dew', 'mushroom', 'moss_branch', 'wild_ivy'], unlock: 56, special: 'sp_fireflyjar' },
  { id: 'f_owl', zone: 'forest', emoji: '🦉', name: '부엉이 고목',
    desc: '부엉이가 사는 늙은 나무.',
    pool: ['owl_feather', 'spider_silk', 'moss_branch', 'tree_resin', 'wild_ivy'], unlock: 62, special: 'sp_owleye' },
  { id: 'f_spider', zone: 'forest', emoji: '🕸️', name: '거미줄 다리',
    desc: '거미줄이 다리처럼 걸린 골짜기.',
    pool: ['spider_silk', 'fern', 'tree_resin', 'moss_branch', 'firefly'], unlock: 70, special: 'sp_silverweb' },
  { id: 'f_spirit', zone: 'forest', emoji: '🌳', name: '이끼 정령터',
    desc: '정령이 머문다는 이끼 낀 터.',
    pool: ['moss_branch', 'fern', 'night_dew', 'petal', 'wild_ivy'], unlock: 78, special: 'sp_spiritbit' },
  { id: 'f_bush', zone: 'forest', emoji: '🍃', name: '속삭이는 덤불',
    desc: '바람이 지나면 속삭이는 덤불.',
    pool: ['wild_ivy', 'petal', 'fern', 'spider_silk', 'tree_resin'], unlock: 86, special: 'sp_whisperbloom' },
  { id: 'f_moon', zone: 'forest', emoji: '🌙', name: '달빛 공터',
    desc: '달빛만 내려앉는 작은 공터.',
    pool: ['night_dew', 'firefly', 'petal', 'moss_branch', 'owl_feather'], unlock: 94, special: 'sp_moondust' },
  { id: 'f_door', zone: 'forest', emoji: '🚪', name: '오래된 나무문',
    desc: '숲 한가운데 서 있는 문.',
    pool: ['tree_resin', 'spider_silk', 'fern', 'moss_branch', 'owl_feather'], unlock: 102, special: 'sp_mosskey' },
  // ── 뾰족 산악 지대 ── (해금 112~210점)
  { id: 'm_mine', zone: 'mountain', emoji: '⛏️', name: '버려진 광산',
    desc: '오래전 버려진 갱도. 광석이 굴러다닌다.',
    pool: ['iron_ore', 'crystal', 'cave_moss', 'flint', 'echo_stone'], unlock: 112, special: 'sp_starore' },
  { id: 'm_lake', zone: 'mountain', emoji: '🏞️', name: '고요 호수',
    desc: '바람 한 점 없는 산정 호수.',
    pool: ['mist_drop', 'cave_moss', 'snow_bud', 'cloud_moss', 'pine_cone'], unlock: 122, special: 'sp_laketear' },
  { id: 'm_rock', zone: 'mountain', emoji: '🗿', name: '흔들 바위산',
    desc: '건드리면 흔들리는 거대한 바위들.',
    pool: ['echo_stone', 'iron_ore', 'cave_moss', 'flint', 'pine_cone'], unlock: 132, special: 'sp_rockchip' },
  { id: 'm_cloud', zone: 'mountain', emoji: '☁️', name: '구름모자 산중턱',
    desc: '구름이 모자처럼 걸린 중턱.',
    pool: ['cloud_moss', 'mist_drop', 'snow_bud', 'eagle_feather', 'cave_moss'], unlock: 142, special: 'sp_cloudwool' },
  { id: 'm_eyrie', zone: 'mountain', emoji: '🪶', name: '매 둥지 절벽',
    desc: '매들이 둥지를 튼 아찔한 절벽.',
    pool: ['eagle_feather', 'cloud_moss', 'echo_stone', 'pine_cone', 'mist_drop'], unlock: 152, special: 'sp_goldfeather' },
  { id: 'm_frost', zone: 'mountain', emoji: '❄️', name: '서리 골짜기',
    desc: '한여름에도 서리가 남는 골짜기.',
    pool: ['snow_bud', 'mist_drop', 'cave_moss', 'cloud_moss', 'crystal'], unlock: 162, special: 'sp_everfrost' },
  { id: 'm_echo', zone: 'mountain', emoji: '📣', name: '메아리 협곡',
    desc: '소리가 몇 번이고 되돌아오는 협곡.',
    pool: ['echo_stone', 'iron_ore', 'flint', 'cave_moss', 'pine_cone'], unlock: 174, special: 'sp_echogem' },
  { id: 'm_ropeway', zone: 'mountain', emoji: '🚡', name: '낡은 삭도 터',
    desc: '광석을 나르던 삭도의 흔적.',
    pool: ['iron_ore', 'flint', 'echo_stone', 'pine_cone', 'cave_moss'], unlock: 186, special: 'sp_rustykey' },
  { id: 'm_observe', zone: 'mountain', emoji: '🔭', name: '별빛 전망대',
    desc: '밤이면 별이 쏟아지는 전망대.',
    pool: ['cloud_moss', 'snow_bud', 'eagle_feather', 'mist_drop', 'crystal'], unlock: 198, special: 'sp_meteor' },
  { id: 'm_ash', zone: 'mountain', emoji: '🌋', name: '화산재 능선',
    desc: '따뜻한 재가 쌓인 능선.',
    pool: ['flint', 'iron_ore', 'cave_moss', 'echo_stone', 'pine_cone'], unlock: 210, special: 'sp_fireheart' },
  // ── 반짝 해안 지대 ── (해금 224~350점)
  { id: 's_beach', zone: 'shore', emoji: '🏖️', name: '반짝 모래사장',
    desc: '햇빛에 모래가 반짝이는 해변.',
    pool: ['shell', 'foam', 'starfish', 'sea_glass', 'crab_claw'], unlock: 224, special: 'sp_starsand' },
  { id: 's_cave', zone: 'shore', emoji: '🐚', name: '소라 동굴',
    desc: '파도 소리가 울리는 소라 모양 동굴.',
    pool: ['shell', 'coral', 'pearl_bit', 'sea_glass', 'sea_dew'], unlock: 238, special: 'sp_singingconch' },
  { id: 's_rock', zone: 'shore', emoji: '🌊', name: '파도 바위',
    desc: '파도가 끊임없이 부딪는 바위.',
    pool: ['foam', 'crab_claw', 'driftwood', 'starfish', 'shell'], unlock: 252, special: 'sp_waveheart' },
  { id: 's_light', zone: 'shore', emoji: '🔦', name: '등대 언덕',
    desc: '밤새 불을 밝히는 등대.',
    pool: ['driftwood', 'sea_glass', 'seaweed', 'sea_dew', 'shell'], unlock: 266, special: 'sp_beaconember' },
  { id: 's_coral', zone: 'shore', emoji: '🪸', name: '산호 여울',
    desc: '산호가 자라는 얕은 여울.',
    pool: ['coral', 'pearl_bit', 'starfish', 'foam', 'seaweed'], unlock: 280, special: 'sp_coralcrown' },
  { id: 's_gull', zone: 'shore', emoji: '🕊️', name: '갈매기 절벽',
    desc: '갈매기가 줄지어 앉은 절벽.',
    pool: ['shell', 'starfish', 'crab_claw', 'seaweed', 'driftwood'], unlock: 294, special: 'sp_gullletter' },
  { id: 's_wreck', zone: 'shore', emoji: '⛵', name: '난파선 잔해',
    desc: '모래에 반쯤 묻힌 난파선.',
    pool: ['driftwood', 'crab_claw', 'sea_dew', 'pearl_bit', 'sea_glass'], unlock: 308, special: 'sp_captainwatch' },
  { id: 's_foam', zone: 'shore', emoji: '🫧', name: '물거품 웅덩이',
    desc: '물거품이 고이는 웅덩이.',
    pool: ['foam', 'sea_dew', 'sea_glass', 'coral', 'starfish'], unlock: 322, special: 'sp_rainbowfoam' },
  { id: 's_pier', zone: 'shore', emoji: '🌅', name: '해질녘 방파제',
    desc: '노을이 내려앉는 방파제.',
    pool: ['shell', 'crab_claw', 'starfish', 'seaweed', 'foam'], unlock: 336, special: 'sp_duskshell' },
  { id: 's_mermaid', zone: 'shore', emoji: '🧜', name: '인어의 바위',
    desc: '인어가 앉았다는 바위.',
    pool: ['pearl_bit', 'sea_glass', 'coral', 'sea_dew', 'shell'], unlock: 350, special: 'sp_mermaidscale' },
  // ── 황량 황무지 ── (해금 366~510점)
  { id: 'w_swamp', zone: 'waste', emoji: '🐸', name: '청개구리의 늪',
    desc: '청개구리 울음이 그치지 않는 늪.',
    pool: ['frog_egg', 'dry_root', 'black_feather', 'sand_grain', 'salt_crust'], unlock: 366, special: 'sp_frogcrown' },
  { id: 'w_dune', zone: 'waste', emoji: '🏜️', name: '까끌 모래 언덕',
    desc: '발이 푹푹 빠지는 모래 언덕.',
    pool: ['sand_grain', 'cactus', 'mirage_shard', 'lizard_scale', 'salt_crust'], unlock: 382, special: 'sp_desertglass' },
  { id: 'w_salt', zone: 'waste', emoji: '🧂', name: '소금 평원',
    desc: '하얗게 마른 소금 평원.',
    pool: ['salt_crust', 'sand_grain', 'bone_frag', 'mirage_shard', 'lizard_scale'], unlock: 398, special: 'sp_saltrose' },
  { id: 'w_cart', zone: 'waste', emoji: '🛞', name: '부서진 수레길',
    desc: '수레가 다니던 길의 잔해.',
    pool: ['rust_nail', 'sand_grain', 'dry_root', 'bone_frag', 'lizard_scale'], unlock: 414, special: 'sp_brokenspoke' },
  { id: 'w_thorn', zone: 'waste', emoji: '🌵', name: '가시덤불 협곡',
    desc: '가시덤불이 빼곡한 협곡.',
    pool: ['cactus', 'dry_root', 'sand_grain', 'lizard_scale', 'frog_egg'], unlock: 430, special: 'sp_thorncrown' },
  { id: 'w_bone', zone: 'waste', emoji: '🦴', name: '뼈의 골짜기',
    desc: '오래된 뼈가 흩어진 골짜기.',
    pool: ['bone_frag', 'dry_root', 'sand_grain', 'rust_nail', 'black_feather'], unlock: 446, special: 'sp_fossil' },
  { id: 'w_mirage', zone: 'waste', emoji: '🌀', name: '신기루 오아시스',
    desc: '다가가면 사라지는 오아시스.',
    pool: ['mirage_shard', 'salt_crust', 'sand_grain', 'frog_egg', 'bone_frag'], unlock: 462, special: 'sp_miragevial' },
  { id: 'w_tower', zone: 'waste', emoji: '🗼', name: '녹슨 철탑',
    desc: '벼락을 맞은 채 서 있는 철탑.',
    pool: ['rust_nail', 'sand_grain', 'salt_crust', 'black_feather', 'bone_frag'], unlock: 478, special: 'sp_boltcore' },
  { id: 'w_lizard', zone: 'waste', emoji: '🦎', name: '도마뱀 바위굴',
    desc: '도마뱀들이 볕을 쬐는 바위굴.',
    pool: ['lizard_scale', 'sand_grain', 'cactus', 'dry_root', 'bone_frag'], unlock: 494, special: 'sp_goldscale' },
  { id: 'w_crow', zone: 'waste', emoji: '🐦‍⬛', name: '까마귀 언덕',
    desc: '까마귀가 모이는 마른 언덕.',
    pool: ['black_feather', 'rust_nail', 'sand_grain', 'dry_root', 'bone_frag'], unlock: 510, special: 'sp_crowtreasure' },
];

// ─── 레시피 (Recipes) ───
// inputs: 정렬된 재료 id 배열 (조합 판정용). result: 산출물 정의.
// kind: 'potion' | 'creature'
// 물약(potion) → 마시면 스탯 영구 상승 (소모)
// 크리처(creature) → 방에 전시, 패시브 매력 보너스
const RECIPES = [
  // ── 물약 ──
  {
    inputs: ['dew', 'herb'],
    result: { id: 'vitality', kind: 'potion', grade: 'low', emoji: '🧴', name: '생기 물약',
      desc: '피부에 생기가 도는 초록빛 물약.', beauty: 3, charm: 0 },
  },
  {
    inputs: ['berry', 'petal'],
    result: { id: 'blush', kind: 'potion', grade: 'mid', emoji: '💄', name: '홍조 물약',
      desc: '볼에 발그레한 홍조를 더한다.', beauty: 1, charm: 3 },
  },
  {
    inputs: ['dew', 'petal'],
    result: { id: 'fragrance', kind: 'potion', grade: 'low', emoji: '🌷', name: '향기 물약',
      desc: '은은한 꽃향기를 두른다.', beauty: 1, charm: 2 },
  },
  {
    inputs: ['crystal', 'mushroom'],
    result: { id: 'mystic', kind: 'potion', grade: 'mid', emoji: '🔮', name: '신비 물약',
      desc: '신비로운 아우라를 뿜는 물약.', beauty: 4, charm: 2 },
  },
  {
    inputs: ['berry', 'herb', 'petal'],
    result: { id: 'rainbow', kind: 'potion', grade: 'high', emoji: '🌈', name: '무지개 엘릭서',
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

// ─── 레시피 북 카테고리 ───
// 물약은 등급(grade)으로, 크리처는 kind 로 분류한다.
// 등급 기준: 하급 = 효과 합 3 이하 / 중급 = 4~6 / 상급 = 7 이상
const RECIPE_CATS = [
  { id: 'low',      label: '하급 물약', match: r => r.result.kind === 'potion' && r.result.grade === 'low' },
  { id: 'mid',      label: '중급 물약', match: r => r.result.kind === 'potion' && r.result.grade === 'mid' },
  { id: 'high',     label: '상급 물약', match: r => r.result.kind === 'potion' && r.result.grade === 'high' },
  { id: 'creature', label: '크리처',   match: r => r.result.kind === 'creature' },
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

// 지대의 해금 점수 = 그 지대에서 가장 먼저 열리는 맵의 점수
function zoneUnlock(zoneId) {
  return MAPS.filter(m => m.zone === zoneId).reduce((min, m) => Math.min(min, m.unlock), Infinity);
}

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
    { id: 'dress_princess', slot: 'dress', kind: 'princess', name: '공주 드레스', color: '#7fa06a', starter: true },
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
  hair: 'hair_long', hairColor: 'hcol_brown', expression: 'exp_happy', tattoo: 'tattoo_none',
  top: 'top_tee', bottom: 'bottom_skirt', dress: 'dress_princess',
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
  INGREDIENTS, ZONES, MAPS, SPECIAL_RATE, zoneUnlock, RECIPES, RECIPE_MAP, SLUDGE, TIERS,
  WARDROBE, WARDROBE_SLOTS, DEFAULT_OUTFIT, ENERGY, RECIPE_CATS,
  getTier, recipeKey,
};
