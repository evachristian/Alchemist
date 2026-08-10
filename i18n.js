// ═══════════════════════════════════════════════════════════════
//  다이어터 연금술사 — 다국어 (i18n)
//  언어 추가 시 STRINGS 에 코드 하나만 더 넣으면 됨.
//  데이터(재료/장소/레시피/옷장) 이름은 NAMES 에서 id → 번역.
// ═══════════════════════════════════════════════════════════════
(function () {
  const LANG_KEY = 'dieter_alchemist_lang_v1';

  const LANGS = [
    { code: 'ko', label: '한국어' },
    { code: 'en', label: 'English' },
  ];

  // ─── UI 문자열 ───
  const STRINGS = {
    ko: {
      // 탭 / 화면
      tab_showcase: '마이 룸', tab_atelier: '공방', tab_gather: '채집',
      screen_gather: '🌿 채집', screen_gather_sub: '장소를 눌러 연금술 재료를 모으세요.',
      screen_atelier: '⚗️ 공방', screen_atelier_sub: '재료를 가마솥에 넣고 조합해 새 레시피를 발견하세요.',
      screen_room: '✨ 마이 룸',
      // 스탯
      stat_visual: '✨ 비주얼', stat_aura: '💖 아우라', stat_total: '매력 총합',
      flex_btn: '📢 매력 과시',
      // 공방
      bag_title: '🎒 채집 가방', bag_empty: '비어있음', bag_kinds: '{n}종',
      recipe_book: '📖 레시피 북', btn_clear: '비우기', btn_brew: '✨ 조합하기',
      gather_go: '채집',
      // 마이 룸 하위 탭
      room_clothes: '👗 옷', room_potions: '🧴 물약', room_creatures: '🦋 크리처',
      hint_dress: '👆 눌러서 갈아입기', hint_drink: '👆 눌러서 마시기',
      // 옷장
      wr_owned: '보유 {have} / {total}', wr_gift: '🎁 랜덤 획득 (테스트)',
      // 빈 상태
      empty_potions: '아직 소유한 물약이 없어요. 공방에서 물약을 만들 수 있어요.',
      empty_creatures: '아직 소유한 크리처가 없어요. 공방에서 크리처를 만들 수 있어요.',
      // 토스트 / 안내
      ap_help: 'AP는 하루에 한 번 오전 12시에 초기화 됩니다.',
      tier_stage: '{tier} 단계',
      no_energy: '에너지가 부족해요 ⚡ 자정에 충전돼요',
      got_item: '{emoji} {name} 획득!',
      cauldron_full: '가마솥이 가득 찼어요 (최대 3개)',
      not_enough_mat: '재료가 부족해요',
      need_two: '재료를 2개 이상 넣어주세요',
      drank: '{emoji} {name} 사용! ✨비주얼 +{b} 💖아우라 +{c}',
      locked_item: '아직 잠긴 아이템이에요 🔒 계속 플레이하면 획득해요!',
      unlocked: '🎁 새 아이템 획득: {name}!',
      all_unlocked: '모든 커스터마이징을 획득했어요! 🎉',
      copied: '매력 총합을 복사했어요! 📋',
      appearance_reset: '외형을 초기화했어요 ✨',
      ap_filled: '⚡ AP를 가득 채웠어요! (임시)',
      restarted: '새로 시작합니다 🌱',
      dress_hint: '원피스를 입는 중이에요. 상·하의를 고르면 원피스가 벗겨져요.',
      // 조합 결과
      brew_new: '🎉 NEW! 레시피 발견',
      brew_stat: '✨ 비주얼 +{b}　💖 아우라 +{c}',
      brew_creature: '🌟 전시 매력 +{n}',
      // 모달
      confirm_reset_look: '정말로 나의 외형을 초기화 하시겠습니까?',
      confirm_restart: '정말로 처음부터 다시 시작할까요? 모든 진행이 사라집니다.',
      btn_ok: '확인', btn_cancel: '취소',
      // 설정
      settings: '⚙️ 설정', setting_lang: '언어 설정',
      setting_intro_replay: '튜토리얼 인트로 다시보기', setting_temp: '(임시)',
      // 임시
      dev_fill_ap: '⚡ AP 1000 충전 (임시)',
      // 공유
      share_text: '[다이어터 연금술사] 나의 매력 총합 {total} — {emoji} {tier} 등급!',
      // 인트로
      intro_skip: '건너뛰기 ✕', intro_next: '다음 ▸',
      sp_narrator: '', sp_fairy: '요정 대모', sp_princess: '공주',
      intro_1: '깊은 밤, 성의 한쪽 구석…\n공주님은 오늘도 야식을 즐기고 있었다.',
      intro_2: '아니 대체 왜 그렇게 밤마다 야식을 드시는 거예요?',
      intro_3: '모르겠어. 자꾸 뭔가 먹고 싶어.\n정신적인 허기일지도…?',
      intro_4: '이대로는 안되겠어요.\n제가 마법 솥을 드릴테니 연금술을 배워보시겠어요?',
      intro_5: '연금술? 내가 왜??',
      intro_6: '그야, 아름다움을 위해서죠.\n연금술을 배우시면 아름다움의 의미를 깨달으실 수 있게 되실 거예요.\n제가 도와드리죠.',
      intro_7: '꺄아아아─!!',
      tz_kr: '한국',
      intro_auto: '자동', auto_on: '자동 재생 켬', auto_off: '자동 재생 끔',
      intro_8: '',
      intro_9: '이제부터 여기서 연금술을 배울 거예요.',
      intro_10: '대체 여기가 어디야? 연금술, 그게 뭔데?',
      intro_11: '이제 알게 되실 거예요.',
    },
    en: {
      tab_showcase: 'My Room', tab_atelier: 'Atelier', tab_gather: 'Gather',
      screen_gather: '🌿 Gather', screen_gather_sub: 'Tap a place to collect alchemy ingredients.',
      screen_atelier: '⚗️ Atelier', screen_atelier_sub: 'Put ingredients in the cauldron and brew to discover recipes.',
      screen_room: '✨ My Room',
      stat_visual: '✨ Visual', stat_aura: '💖 Aura', stat_total: 'Total Charm',
      flex_btn: '📢 Show Off',
      bag_title: '🎒 Gathering Bag', bag_empty: 'Empty', bag_kinds: '{n} kinds',
      recipe_book: '📖 Recipe Book', btn_clear: 'Clear', btn_brew: '✨ Brew',
      gather_go: 'Gather',
      room_clothes: '👗 Outfit', room_potions: '🧴 Potions', room_creatures: '🦋 Creatures',
      hint_dress: '👆 Tap to change', hint_drink: '👆 Tap to drink',
      wr_owned: 'Owned {have} / {total}', wr_gift: '🎁 Random Unlock (test)',
      empty_potions: 'No potions yet. You can brew potions in the Atelier.',
      empty_creatures: 'No creatures yet. You can create creatures in the Atelier.',
      ap_help: 'AP is refilled once a day at 12:00 AM.',
      tier_stage: '{tier} stage',
      no_energy: 'Not enough AP ⚡ Refills at midnight',
      got_item: '{emoji} Got {name}!',
      cauldron_full: 'The cauldron is full (max 3)',
      not_enough_mat: 'Not enough ingredients',
      need_two: 'Add at least 2 ingredients',
      drank: '{emoji} Used {name}! ✨Visual +{b} 💖Aura +{c}',
      locked_item: 'This item is still locked 🔒 Keep playing to unlock it!',
      unlocked: '🎁 New item unlocked: {name}!',
      all_unlocked: 'All customizations unlocked! 🎉',
      copied: 'Total Charm copied! 📋',
      appearance_reset: 'Appearance reset ✨',
      ap_filled: '⚡ AP fully refilled! (temp)',
      restarted: 'Starting over 🌱',
      dress_hint: "You're wearing a dress. Choosing a top or bottom will remove it.",
      brew_new: '🎉 NEW! Recipe discovered',
      brew_stat: '✨ Visual +{b}　💖 Aura +{c}',
      brew_creature: '🌟 Display Charm +{n}',
      confirm_reset_look: 'Reset your appearance?',
      confirm_restart: 'Start over from the beginning? All progress will be lost.',
      btn_ok: 'OK', btn_cancel: 'Cancel',
      settings: '⚙️ Settings', setting_lang: 'Language',
      setting_intro_replay: 'Replay Tutorial Intro', setting_temp: '(temp)',
      dev_fill_ap: '⚡ Refill 1000 AP (temp)',
      share_text: '[Dieter Alchemist] My Total Charm {total} — {emoji} {tier}!',
      intro_skip: 'Skip ✕', intro_next: 'Next ▸',
      sp_narrator: '', sp_fairy: 'Fairy Godmother', sp_princess: 'Princess',
      intro_1: 'Late at night, in a corner of the castle…\nthe princess was enjoying a midnight snack again.',
      intro_2: 'Why on earth do you keep eating late at night?',
      intro_3: "I don't know. I just keep wanting to eat.\nMaybe it's emotional hunger…?",
      intro_4: 'This cannot go on.\nI shall give you a magic cauldron — will you learn alchemy?',
      intro_5: 'Alchemy? Why me??',
      intro_6: 'For beauty, of course.\nLearn alchemy and you will discover what beauty truly means.\nI shall help you.',
      intro_7: 'Aaaaah─!!',
      tz_kr: 'Korea',
      intro_auto: 'Auto', auto_on: 'Auto-play ON', auto_off: 'Auto-play OFF',
      intro_8: '',
      intro_9: "From now on, you'll learn alchemy here.",
      intro_10: 'Where on earth am I? And what even is alchemy?',
      intro_11: "You'll find out soon enough.",
    },
  };

  // ─── 데이터 이름 (id → 언어별) ───
  const NAMES = {
    en: {
      // 재료
      herb: 'Herb', berry: 'Berry', petal: 'Petal', dew: 'Dew', mushroom: 'Mushroom', crystal: 'Crystal',
      // 장소
      meadow: 'Flower Meadow', forest: 'Mossy Forest', cave: 'Crystal Cave',
      meadow_desc: 'A sunny meadow where common herbs and flowers grow.',
      forest_desc: 'A damp, dark forest with mushrooms and morning dew.',
      cave_desc: 'A cave of glittering minerals. Crystals are rare finds.',
      // 물약 / 크리처
      vitality: 'Vitality Potion', blush: 'Blush Potion', fragrance: 'Fragrance Potion',
      mystic: 'Mystic Potion', rainbow: 'Rainbow Elixir',
      butterfly: 'Glimmer Butterfly', frog: 'Flower Frog', unicorn: 'Unicorn', sludge: 'Strange Sludge',
      vitality_desc: 'A green potion that brings life to your skin.',
      blush_desc: 'Adds a rosy blush to your cheeks.',
      fragrance_desc: 'Wraps you in a subtle floral scent.',
      mystic_desc: 'A potion radiating a mysterious aura.',
      rainbow_desc: 'The legendary elixir. Greatly boosts Visual and Aura.',
      butterfly_desc: 'A crystal-winged butterfly fluttering around you.',
      frog_desc: 'A cute frog carrying a flower petal.',
      unicorn_desc: 'A legendary unicorn said to appear only to the pure.',
      sludge_desc: 'Something went wrong… Ingredients wasted, but try again!',
      // 등급
      '새싹': 'Sprout', '꽃봉오리': 'Bud', '요정': 'Fairy', '뮤즈': 'Muse', '여신': 'Goddess',
      // 옷장 슬롯
      hair: 'Hair', hairColor: 'Hair Color', expression: 'Expression', tattoo: 'Tattoo',
      top: 'Top', bottom: 'Bottom', dress: 'Dress', circlet: 'Circlet', earring: 'Earring', necklace: 'Necklace',
      // 옷장 아이템
      hair_long: 'Long', hair_bob: 'Bob', hair_twin: 'Twin Tails', hair_ponytail: 'Ponytail', hair_wave: 'Wavy',
      hcol_brown: 'Brown', hcol_black: 'Black', hcol_blonde: 'Blonde', hcol_pink: 'Pink',
      hcol_lav: 'Lavender', hcol_mint: 'Mint', hcol_silver: 'Silver',
      exp_smile: 'Smile', exp_wink: 'Wink', exp_happy: 'Beaming', exp_surprise: 'Surprised', exp_cool: 'Cool',
      tattoo_none: 'None', tattoo_star: 'Star', tattoo_tear: 'Teardrop', tattoo_heart: 'Heart', tattoo_rune: 'Rune',
      top_none: 'None', top_tee: 'Basic Tee', top_blouse: 'Blouse', top_knit: 'Knit', top_hoodie: 'Hoodie',
      bottom_none: 'None', bottom_skirt: 'Pleated Skirt', bottom_shorts: 'Shorts', bottom_pants: 'Jeans',
      dress_none: 'None', dress_onepiece: 'One-piece', dress_gown: 'Gown',
      circlet_none: 'None', circlet_flower: 'Flower Circlet', circlet_tiara: 'Tiara', circlet_band: 'Ribbon Band',
      earring_none: 'None', earring_drop: 'Drop', earring_hoop: 'Hoop', earring_star: 'Star',
      necklace_none: 'None', necklace_pendant: 'Pendant', necklace_pearl: 'Pearl', necklace_choker: 'Choker',
    },
  };

  let current = 'ko';
  try {
    const saved = localStorage.getItem(LANG_KEY);
    if (saved && STRINGS[saved]) current = saved;
  } catch (e) {}

  // 문자열 조회 (+ {키} 치환)
  function t(key, vars) {
    const dict = STRINGS[current] || STRINGS.ko;
    let s = (dict[key] !== undefined) ? dict[key] : (STRINGS.ko[key] !== undefined ? STRINGS.ko[key] : key);
    if (vars) for (const k in vars) s = s.split('{' + k + '}').join(vars[k]);
    return s;
  }

  // 데이터 이름 (기본값 = 한국어 원문)
  function n(id, koText) {
    if (current === 'ko') return koText;
    const map = NAMES[current];
    return (map && map[id] !== undefined) ? map[id] : koText;
  }

  function getLang() { return current; }
  function langs() { return LANGS.slice(); }

  function setLang(code) {
    if (!STRINGS[code] || code === current) return;
    current = code;
    try { localStorage.setItem(LANG_KEY, code); } catch (e) {}
    apply();
    if (typeof window.render === 'function') window.render();
  }

  // data-i18n 속성이 붙은 정적 요소를 현재 언어로 교체
  function apply() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
      el.textContent = t(el.getAttribute('data-i18n'));
    });
    document.documentElement.setAttribute('lang', current);
  }

  window.I18N = { t, n, apply, setLang, getLang, langs, LANG_KEY };
})();
