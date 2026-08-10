// ═══════════════════════════════════════════════════════════════
//  다이어터 연금술사 — 게임 로직 & UI
// ═══════════════════════════════════════════════════════════════
const D = window.GameData;
const SAVE_KEY = 'dieter_alchemist_save_v1';

// ─── 상태 ───
const defaultState = () => ({
  inventory: {},          // { ingredientId: count }
  potions:   {},          // { potionId: count } (미사용 물약 보관)
  creatures: [],          // [creatureId, ...] (전시 중)
  stats:     { beauty: 0, charm: 0 },
  discovered: [],         // 발견한 레시피 result.id 목록
  cauldron:  [],          // 현재 가마솥에 넣은 재료 id (최대 3)
  gathered:  0,           // 총 채집 횟수 (통계)
  outfit:    { ...D.DEFAULT_OUTFIT },  // 아바타 착장 (슬롯 → 아이템 id)
  unlocked:  [],          // 해금한 커스터마이징 아이템 id 목록 (starter 외)
  energy:    D.ENERGY.cap,  // 현재 에너지 (행동력)
  energyDay: dayKey(),      // 마지막 충전 기준 로컬 날짜 키 (YYYYMMDD)
});

let S = load();

function load() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (raw) {
      const st = Object.assign(defaultState(), JSON.parse(raw));
      st.outfit = Object.assign({ ...D.DEFAULT_OUTFIT }, st.outfit || {});
      if (!Array.isArray(st.unlocked)) st.unlocked = [];
      return st;
    }
  } catch (e) { console.warn('load failed', e); }
  return defaultState();
}
function save() { localStorage.setItem(SAVE_KEY, JSON.stringify(S)); }

// ─── 유틸 ───
function invCount(id) { return S.inventory[id] || 0; }
function addInv(id, n = 1) { S.inventory[id] = invCount(id) + n; }
function removeInv(id, n = 1) {
  S.inventory[id] = Math.max(0, invCount(id) - n);
  if (S.inventory[id] === 0) delete S.inventory[id];
}
function totalCharm() {
  const creatureBonus = S.creatures.reduce((sum, cid) => {
    const r = D.RECIPES.find(x => x.result.id === cid);
    return sum + (r ? r.result.charmBonus : 0);
  }, 0);
  return S.stats.beauty + S.stats.charm + creatureBonus;
}

// 가중 랜덤 추첨
function weightedPick(spot) {
  const pool = D.SPOTS[spot].pool;
  const total = pool.reduce((s, id) => s + D.INGREDIENTS[id].weight, 0);
  let r = Math.random() * total;
  for (const id of pool) {
    r -= D.INGREDIENTS[id].weight;
    if (r <= 0) return id;
  }
  return pool[pool.length - 1];
}

// ─── 토스트 ───
let toastTimer = null;
function toast(msg) {
  const el = document.getElementById('toast');
  el.textContent = msg;
  el.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('show'), 1800);
}

// ═══════════════════════════════════════════════════════════════
//  에너지 (행동력) — 현실 24h = 게임 24h, 로컬 자정에 충전
// ═══════════════════════════════════════════════════════════════
// 로컬 날짜 키 (YYYYMMDD 정수) — 날짜가 바뀌면(자정) 값이 달라짐
function dayKey(d = new Date()) {
  return d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate();
}
// 다음 로컬 자정까지 남은 ms
function msToNextMidnight() {
  const now = new Date();
  const next = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0, 0);
  return next - now;
}
function energyCap() { return D.ENERGY.cap + (S.energyBonusCap || 0); }

// 날짜가 넘어갔으면 충전. 충전이 일어났으면 true 반환.
function refreshEnergy() {
  const today = dayKey();
  if (S.energyDay === today) return false;
  // (여러 날 지났어도) 상한까지 충전 — 현재 dailyFill == cap
  S.energy = Math.min(energyCap(), (S.energy || 0) + D.ENERGY.dailyFill);
  S.energyDay = today;
  save();
  return true;
}

// 에너지 소모 시도. 부족하면 false.
function spendEnergy(n) {
  refreshEnergy();
  if ((S.energy || 0) < n) return false;
  S.energy -= n;
  save();
  renderEnergy();
  return true;
}

function pad2(n) { return n < 10 ? '0' + n : '' + n; }

function renderEnergy() {
  const cap = energyCap();
  const cur = Math.max(0, Math.min(cap, S.energy || 0));
  const pct = cap > 0 ? (cur / cap) * 100 : 0;

  const fill = document.getElementById('enFill');
  const text = document.getElementById('enText');
  if (fill) fill.style.width = pct.toFixed(1) + '%';
  if (text) text.textContent = `${cur}/${cap}`;
}

function apHelp() { toast('AP는 하루에 한 번 오전 12시에 초기화 됩니다.'); }

// ─── 글로벌 시계 (한국 UTC+9 / UTC-7) ───
// 낮(06~18시)=☀️ 해, 밤=🌙 달 로 오전/오후를 예쁘게 표시
function zoneTime(offsetHours) {
  const now = new Date();
  const utcMs = now.getTime() + now.getTimezoneOffset() * 60000;
  const d = new Date(utcMs + offsetHours * 3600000);
  const h = d.getHours();
  const emoji = (h >= 6 && h < 18) ? '☀️' : '🌙';
  let hh = h % 12; if (hh === 0) hh = 12;
  return `${emoji} ${hh}:${pad2(d.getMinutes())}`;
}
function renderClock() {
  const a = document.getElementById('clockKST');
  if (a) a.textContent = `UTC+09:00 (한국) ${zoneTime(9)}`;
}

// 1초 틱: 카운트다운 갱신 + 자정 롤오버 자동 충전
function energyTick() {
  renderClock();
  if (refreshEnergy()) render();   // 충전되면 화면 전체 갱신(비활성 상태 등)
  else renderEnergy();
}

// ═══════════════════════════════════════════════════════════════
//  탭 전환
// ═══════════════════════════════════════════════════════════════
let currentTab = 'showcase';
function switchTab(tab) {
  currentTab = tab;
  document.querySelectorAll('.tab-btn').forEach(b =>
    b.classList.toggle('active', b.dataset.tab === tab));
  document.querySelectorAll('.screen').forEach(s =>
    s.classList.toggle('active', s.id === 'screen-' + tab));
  render();
}

// ═══════════════════════════════════════════════════════════════
//  채집 (Gather)
// ═══════════════════════════════════════════════════════════════
function gather(spotId) {
  if (!spendEnergy(D.ENERGY.cost.gather)) {
    toast('에너지가 부족해요 ⚡ 자정에 충전돼요');
    return;
  }
  const id = weightedPick(spotId);
  addInv(id, 1);
  S.gathered++;
  save();
  const ing = D.INGREDIENTS[id];
  toast(`${ing.emoji} ${ing.name} 획득!`);
  // 채집 애니메이션
  const card = document.querySelector(`.spot-card[data-spot="${spotId}"]`);
  if (card) { card.classList.remove('pop'); void card.offsetWidth; card.classList.add('pop'); }
  render();
}

// ═══════════════════════════════════════════════════════════════
//  공방 / 가마솥 (Atelier)
// ═══════════════════════════════════════════════════════════════
function addToCauldron(id) {
  if (S.cauldron.length >= 3) { toast('가마솥이 가득 찼어요 (최대 3개)'); return; }
  if (invCount(id) - S.cauldron.filter(x => x === id).length <= 0) {
    toast('재료가 부족해요'); return;
  }
  S.cauldron.push(id);
  save(); render();
}
function removeFromCauldron(idx) {
  S.cauldron.splice(idx, 1);
  save(); render();
}
function clearCauldron() { S.cauldron = []; save(); render(); }

// 채집 가방 접기/펼치기 (기본: 닫힘)
let bagOpen = false;
function toggleBag() { bagOpen = !bagOpen; applyBagState(); }
function applyBagState() {
  const bag = document.getElementById('ingredientBag');
  const chev = document.getElementById('bagChevron');
  if (bag) bag.style.display = bagOpen ? '' : 'none';
  if (chev) chev.textContent = bagOpen ? '▾' : '▸';
}

function brew() {
  if (S.cauldron.length < 2) { toast('재료를 2개 이상 넣어주세요'); return; }
  if (!spendEnergy(D.ENERGY.cost.brew)) {
    toast('에너지가 부족해요 ⚡ 자정에 충전돼요');
    return;
  }
  // 재료 소모
  for (const id of S.cauldron) removeInv(id, 1);
  const key = D.recipeKey(S.cauldron);
  const result = D.RECIPE_MAP[key];
  S.cauldron = [];

  if (!result) {
    save(); render();
    showBrewResult(D.SLUDGE, false);
    return;
  }

  const isNew = !S.discovered.includes(result.id);
  if (isNew) S.discovered.push(result.id);

  if (result.kind === 'potion') {
    S.potions[result.id] = (S.potions[result.id] || 0) + 1;
  } else if (result.kind === 'creature') {
    S.creatures.push(result.id);
  }
  save(); render();
  showBrewResult(result, isNew);
}

// ═══════════════════════════════════════════════════════════════
//  물약 사용 (Showcase)
// ═══════════════════════════════════════════════════════════════
function drinkPotion(potionId) {
  if ((S.potions[potionId] || 0) <= 0) return;
  const r = D.RECIPES.find(x => x.result.id === potionId);
  if (!r) return;
  S.potions[potionId]--;
  if (S.potions[potionId] === 0) delete S.potions[potionId];
  S.stats.beauty += r.result.beauty || 0;
  S.stats.charm  += r.result.charm  || 0;
  save();
  toast(`${r.result.emoji} ${r.result.name} 사용! ✨비주얼 +${r.result.beauty} 💖아우라 +${r.result.charm}`);
  render();
}

// ═══════════════════════════════════════════════════════════════
//  조합 결과 모달
// ═══════════════════════════════════════════════════════════════
function showBrewResult(result, isNew) {
  const modal = document.getElementById('brewModal');
  const body = document.getElementById('brewModalBody');
  const success = result.kind !== 'sludge';
  let statLine = '';
  if (result.kind === 'potion') {
    statLine = `<div class="brew-stats">✨ 비주얼 +${result.beauty}　💖 아우라 +${result.charm}</div>`;
  } else if (result.kind === 'creature') {
    statLine = `<div class="brew-stats">🌟 전시 매력 +${result.charmBonus}</div>`;
  }
  body.innerHTML = `
    ${isNew ? '<div class="brew-new">🎉 NEW! 레시피 발견</div>' : ''}
    <div class="brew-emoji ${success ? 'pop' : ''}">${result.emoji}</div>
    <div class="brew-name">${result.name}</div>
    <div class="brew-desc">${result.desc}</div>
    ${statLine}
  `;
  modal.classList.add('show');
  window.Sfx && Sfx.play(success ? 'success' : 'fail');
}
function closeBrewModal() {
  document.getElementById('brewModal').classList.remove('show');
}

// ═══════════════════════════════════════════════════════════════
//  렌더링
// ═══════════════════════════════════════════════════════════════
function render() {
  renderHeader();
  renderEnergy();
  renderClock();
  if (currentTab === 'gather') renderGather();
  if (currentTab === 'atelier') renderAtelier();
  if (currentTab === 'showcase') renderShowcase();
}

function renderHeader() {
  const total = totalCharm();
  const tier = D.getTier(total);
  document.getElementById('hdrTier').textContent = `${tier.emoji} ${tier.title}`;
  document.getElementById('hdrCharm').textContent = `🌟 ${total}`;
}

function renderGather() {
  const cost = D.ENERGY.cost.gather;
  const canGather = (S.energy || 0) >= cost;
  const el = document.getElementById('spotList');
  el.innerHTML = Object.values(D.SPOTS).map(spot => {
    const chips = spot.pool.map(id => D.INGREDIENTS[id].emoji).join(' ');
    return `
      <div class="spot-card ${canGather ? '' : 'low-energy'}" data-spot="${spot.id}" onclick="gather('${spot.id}')">
        <div class="spot-emoji">${spot.emoji}</div>
        <div class="spot-info">
          <div class="spot-name">${spot.name}</div>
          <div class="spot-desc">${spot.desc}</div>
          <div class="spot-pool">${chips}</div>
        </div>
        <div class="spot-go">채집 <span class="cost-tag">⚡${cost}</span></div>
      </div>`;
  }).join('');
}

function renderAtelier() {
  // 가마솥 슬롯
  const slots = document.getElementById('cauldronSlots');
  let slotsHtml = '';
  for (let i = 0; i < 3; i++) {
    const id = S.cauldron[i];
    if (id) {
      slotsHtml += `<div class="c-slot filled" onclick="removeFromCauldron(${i})">
        ${D.INGREDIENTS[id].emoji}<span class="c-slot-x">✕</span></div>`;
    } else {
      slotsHtml += `<div class="c-slot empty">+</div>`;
    }
  }
  slots.innerHTML = slotsHtml;

  // 조합 비용 표시
  const bc = document.getElementById('brewCost');
  if (bc) bc.textContent = `⚡${D.ENERGY.cost.brew}`;

  // 인벤토리 (재료)
  const invEl = document.getElementById('ingredientBag');
  const ids = Object.keys(S.inventory);
  if (ids.length === 0) {
    invEl.innerHTML = `<div class="empty-hint">채집으로 재료를 모아보세요 🌿</div>`;
  } else {
    invEl.innerHTML = ids.map(id => {
      const ing = D.INGREDIENTS[id];
      const inCauldron = S.cauldron.filter(x => x === id).length;
      const avail = invCount(id) - inCauldron;
      return `
        <div class="ing-chip ${avail <= 0 ? 'disabled' : ''}" onclick="addToCauldron('${id}')">
          <span class="ing-emoji">${ing.emoji}</span>
          <span class="ing-name">${ing.name}</span>
          <span class="ing-count">×${avail}</span>
        </div>`;
    }).join('');
  }

  // 채집 가방 접힘/펼침 상태 반영
  const bagCount = document.getElementById('bagCount');
  if (bagCount) bagCount.textContent = ids.length ? `${ids.length}종` : '비어있음';
  applyBagState();

  // 레시피 북
  const bookEl = document.getElementById('recipeBook');
  bookEl.innerHTML = D.RECIPES.map(r => {
    const found = S.discovered.includes(r.result.id);
    const inputs = r.inputs.map(id => D.INGREDIENTS[id].emoji).join(' + ');
    if (found) {
      return `<div class="recipe-row">
        <span class="recipe-in">${inputs}</span>
        <span class="recipe-arrow">→</span>
        <span class="recipe-out">${r.result.emoji} ${r.result.name}</span>
      </div>`;
    }
    return `<div class="recipe-row locked">
      <span class="recipe-in">? + ?</span>
      <span class="recipe-arrow">→</span>
      <span class="recipe-out">❓ ???</span>
    </div>`;
  }).join('');
  document.getElementById('recipeProgress').textContent =
    `${S.discovered.length} / ${D.RECIPES.length}`;
}

function renderShowcase() {
  const total = totalCharm();
  const tier = D.getTier(total);

  // 아바타(내 캐릭터) + 전시 크리처
  const stage = document.getElementById('charStage');
  const creatureEmojis = S.creatures.map(cid => {
    const r = D.RECIPES.find(x => x.result.id === cid);
    return r ? `<span class="stage-creature">${r.result.emoji}</span>` : '';
  }).join('');
  const avatarSvg = window.Avatar ? window.Avatar.build(S.outfit) : tier.emoji;
  const sceneSvg = window.Avatar && window.Avatar.roomScene ? window.Avatar.roomScene() : '';
  stage.innerHTML = `
    <div class="room-scene">${sceneSvg}</div>
    <div class="char-aura" style="--glow:${Math.min(total, 100)}">
      <div class="char-body">${avatarSvg}</div>
      <div class="stage-creatures">${creatureEmojis}</div>
    </div>`;

  // 옷장
  renderWardrobe();

  // 하위 탭(옷/물약/크리처) 표시 상태 반영
  updateRoomTabs();

  // 스탯
  document.getElementById('statBeauty').textContent = S.stats.beauty;
  document.getElementById('statCharm').textContent = S.stats.charm;
  document.getElementById('statTotal').textContent = total;
  document.getElementById('showcaseTier').textContent = `${tier.emoji} ${tier.title}`;

  // 보유 물약
  const potEl = document.getElementById('potionShelf');
  const pids = Object.keys(S.potions);
  const potionHint = document.getElementById('potionHint');
  if (potionHint) potionHint.style.display = pids.length === 0 ? 'none' : 'block';
  if (pids.length === 0) {
    potEl.innerHTML = `<div class="empty-hint clickable" onclick="switchTab('atelier')">아직 소유한 물약이 없어요. 공방에서 물약을 만들 수 있어요.</div>`;
  } else {
    potEl.innerHTML = pids.map(pid => {
      const r = D.RECIPES.find(x => x.result.id === pid);
      if (!r) return '';
      return `<div class="potion-card" onclick="drinkPotion('${pid}')">
        <div class="potion-emoji">${r.result.emoji}</div>
        <div class="potion-name">${r.result.name}</div>
        <div class="potion-eff">✨+${r.result.beauty} 💖+${r.result.charm}</div>
        <div class="potion-count">×${S.potions[pid]}</div>
        <div class="potion-use">마시기</div>
      </div>`;
    }).join('');
  }

  // 크리처 컬렉션
  const colEl = document.getElementById('creatureCollection');
  if (S.creatures.length === 0) {
    colEl.innerHTML = `<div class="empty-hint clickable" onclick="switchTab('atelier')">아직 소유한 크리처가 없어요. 공방에서 크리처를 만들 수 있어요.</div>`;
  } else {
    const counts = {};
    S.creatures.forEach(c => counts[c] = (counts[c] || 0) + 1);
    colEl.innerHTML = Object.keys(counts).map(cid => {
      const r = D.RECIPES.find(x => x.result.id === cid);
      if (!r) return '';
      return `<div class="creature-card">
        <div class="creature-emoji">${r.result.emoji}</div>
        <div class="creature-name">${r.result.name}</div>
        <div class="creature-eff">💖+${r.result.charmBonus}</div>
        ${counts[cid] > 1 ? `<div class="creature-count">×${counts[cid]}</div>` : ''}
      </div>`;
    }).join('');
  }
}

// ─── 나의 방 하위 탭 (옷 / 물약 / 크리처) ───
let roomTab = 'clothes';
function setRoomTab(t) { roomTab = t; updateRoomTabs(); }
function updateRoomTabs() {
  document.querySelectorAll('.room-tab').forEach(b =>
    b.classList.toggle('active', b.dataset.rtab === roomTab));
  document.querySelectorAll('.room-panel').forEach(p =>
    p.classList.toggle('active', p.id === 'roomPanel-' + roomTab));
}

// ═══════════════════════════════════════════════════════════════
//  옷장 (Wardrobe) — 아바타 착장 + 커스터마이징 잠금/해금
// ═══════════════════════════════════════════════════════════════
let wardrobeTab = 'hair';
function setWardrobeTab(slot) { wardrobeTab = slot; renderWardrobe(); }

function slotMeta(slot) { return D.WARDROBE_SLOTS.find(m => m.slot === slot); }
// 아이템 보유 여부: 잠금 슬롯이 아니거나 / '없음' / starter / 해금목록에 있으면 보유
function isOwned(slot, it) {
  if (!slotMeta(slot) || !slotMeta(slot).gated) return true;
  if (it.kind === 'none' || it.starter) return true;
  return S.unlocked.includes(it.id);
}

function equip(slot, id) {
  const it = (D.WARDROBE[slot] || []).find(x => x.id === id);
  if (!it) return;
  if (!isOwned(slot, it)) { toast('아직 잠긴 아이템이에요 🔒 계속 플레이하면 획득해요!'); return; }
  // 상·하의를 고르면 원피스는 벗고, 원피스를 고르면 그대로 (렌더에서 상하의 무시)
  if (slot === 'top' || slot === 'bottom') S.outfit.dress = 'dress_none';
  S.outfit[slot] = id;
  save();
  renderShowcase();  // 아바타 + 옷장 동시 갱신
}

// 커스터마이징 해금 (추후 진행 보상에서 호출) — 콘솔/보상 공용 API
function unlockCosmetic(id) {
  for (const m of D.WARDROBE_SLOTS) {
    const it = (D.WARDROBE[m.slot] || []).find(x => x.id === id);
    if (!it) continue;
    if (isOwned(m.slot, it)) return false;   // 이미 보유
    S.unlocked.push(id);
    save();
    wardrobeTab = m.slot;
    toast(`🎁 새 아이템 획득: ${it.name}!`);
    if (currentTab === 'showcase') renderShowcase();
    return true;
  }
  return false;
}
window.unlockCosmetic = unlockCosmetic;

// 테스트용: 잠긴 아이템 중 하나를 무작위 해금
function unlockRandom() {
  const locked = [];
  D.WARDROBE_SLOTS.filter(m => m.gated).forEach(m =>
    (D.WARDROBE[m.slot] || []).forEach(it => { if (!isOwned(m.slot, it)) locked.push(it.id); }));
  if (!locked.length) { toast('모든 커스터마이징을 획득했어요! 🎉'); return; }
  unlockCosmetic(locked[Math.floor(Math.random() * locked.length)]);
}

function renderWardrobe() {
  const el = document.getElementById('wardrobe');
  if (!el) return;
  const dressed = S.outfit.dress && S.outfit.dress !== 'dress_none';
  const meta = slotMeta(wardrobeTab);

  const tabs = D.WARDROBE_SLOTS.map(m => {
    const dimmed = dressed && (m.slot === 'top' || m.slot === 'bottom');
    return `<button class="wr-tab ${wardrobeTab === m.slot ? 'active' : ''} ${dimmed ? 'dim' : ''}"
      onclick="setWardrobeTab('${m.slot}')">${m.emoji} ${m.label}</button>`;
  }).join('');

  const list = D.WARDROBE[wardrobeTab] || [];
  const items = list.map(it => {
    const on = S.outfit[wardrobeTab] === it.id;
    const owned = isOwned(wardrobeTab, it);
    let ic;
    if (it.kind === 'none') ic = '🚫';
    else if (it.emoji) ic = it.emoji;
    else ic = `<span class="wr-swatch" style="background:${it.color || '#ccc'}"></span>`;
    const lock = owned ? '' : '<span class="wr-lock">🔒</span>';
    return `<button class="wr-item ${on ? 'on' : ''} ${owned ? '' : 'locked'}" onclick="equip('${wardrobeTab}','${it.id}')">
      <span class="wr-ic">${ic}${lock}</span><span class="wr-nm">${it.name}</span></button>`;
  }).join('');

  // 잠금 슬롯이면 보유 현황 + 획득 안내
  let foot = '';
  if (meta && meta.gated) {
    const total = list.length, have = list.filter(it => isOwned(wardrobeTab, it)).length;
    foot = `<div class="wr-foot">
      <span class="wr-count">보유 ${have} / ${total}</span>
      <button class="wr-gift" onclick="unlockRandom()">🎁 랜덤 획득 (테스트)</button>
    </div>`;
  }
  const hint = dressed && (wardrobeTab === 'top' || wardrobeTab === 'bottom')
    ? `<div class="wr-hint">원피스를 입는 중이에요. 상·하의를 고르면 원피스가 벗겨져요.</div>` : '';

  el.innerHTML = `<div class="wr-tabs">${tabs}</div>${hint}<div class="wr-items">${items}</div>${foot}`;
}

// ─── 과시(공유) ───
function flexCharm() {
  const total = totalCharm();
  const tier = D.getTier(total);
  const text = `[다이어터 연금술사] 나의 매력 총합 ${total} — ${tier.emoji} ${tier.title} 등급!`;
  if (navigator.share) {
    navigator.share({ title: '다이어터 연금술사', text }).catch(() => {});
  } else if (navigator.clipboard) {
    navigator.clipboard.writeText(text).then(() => toast('매력 총합을 복사했어요! 📋'));
  } else {
    toast(text);
  }
}

// ─── 확인 모달 (공용) ───
let _confirmCb = null;
function showConfirm(msg, cb) {
  document.getElementById('confirmText').textContent = msg;
  _confirmCb = cb;
  document.getElementById('confirmModal').classList.add('show');
}
function closeConfirm() {
  document.getElementById('confirmModal').classList.remove('show');
  _confirmCb = null;
}
function confirmYes() {
  const cb = _confirmCb;
  closeConfirm();
  if (cb) cb();
}

// ─── 외형 초기화 (착장을 기본값으로) ───
function askResetAppearance() {
  showConfirm('정말로 나의 외형을 초기화 하시겠습니까?', () => {
    S.outfit = { ...D.DEFAULT_OUTFIT };
    save();
    renderShowcase();
    toast('외형을 초기화했어요 ✨');
  });
}

// ─── 임시(출시 버전에서 제거): AP 가득 충전 ───
function fillEnergy() {
  refreshEnergy();
  S.energy = energyCap();
  S.energyDay = dayKey();
  save();
  render();
  toast('⚡ AP를 가득 채웠어요! (임시)');
}

// ─── 초기화(디버그용) ───
function resetGame() {
  if (confirm('정말 처음부터 다시 시작할까요? 모든 진행이 사라집니다.')) {
    S = defaultState();
    save();
    switchTab('gather');
    toast('새로 시작합니다 🌱');
  }
}

// ─── 부팅 ───
// (스플래시 표시/제거는 index.html 인라인 스크립트에서 처리)
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.tab-btn').forEach(b =>
    b.addEventListener('click', () => switchTab(b.dataset.tab)));
  refreshEnergy();          // 접속 시 자정 롤오버 반영
  switchTab('showcase');
  setInterval(energyTick, 1000);  // 카운트다운 + 자정 자동 충전
  // 백그라운드 → 포그라운드 복귀 시 즉시 반영
  document.addEventListener('visibilitychange', () => { if (!document.hidden) energyTick(); });
});
