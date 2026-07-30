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
});

let S = load();

function load() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (raw) return Object.assign(defaultState(), JSON.parse(raw));
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
//  탭 전환
// ═══════════════════════════════════════════════════════════════
let currentTab = 'gather';
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

function brew() {
  if (S.cauldron.length < 2) { toast('재료를 2개 이상 넣어주세요'); return; }
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
  toast(`${r.result.emoji} ${r.result.name} 사용! ✨아름다움 +${r.result.beauty} 💖매력 +${r.result.charm}`);
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
    statLine = `<div class="brew-stats">✨ 아름다움 +${result.beauty}　💖 매력 +${result.charm}</div>`;
  } else if (result.kind === 'creature') {
    statLine = `<div class="brew-stats">💖 전시 매력 +${result.charmBonus}</div>`;
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
  if (currentTab === 'gather') renderGather();
  if (currentTab === 'atelier') renderAtelier();
  if (currentTab === 'showcase') renderShowcase();
}

function renderHeader() {
  const total = totalCharm();
  const tier = D.getTier(total);
  document.getElementById('hdrTier').textContent = `${tier.emoji} ${tier.title}`;
  document.getElementById('hdrCharm').textContent = `💖 ${total}`;
}

function renderGather() {
  const el = document.getElementById('spotList');
  el.innerHTML = Object.values(D.SPOTS).map(spot => {
    const chips = spot.pool.map(id => D.INGREDIENTS[id].emoji).join(' ');
    return `
      <div class="spot-card" data-spot="${spot.id}" onclick="gather('${spot.id}')">
        <div class="spot-emoji">${spot.emoji}</div>
        <div class="spot-info">
          <div class="spot-name">${spot.name}</div>
          <div class="spot-desc">${spot.desc}</div>
          <div class="spot-pool">${chips}</div>
        </div>
        <div class="spot-go">채집 →</div>
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

  // 캐릭터 + 전시 크리처
  const stage = document.getElementById('charStage');
  const creatureEmojis = S.creatures.map(cid => {
    const r = D.RECIPES.find(x => x.result.id === cid);
    return r ? `<span class="stage-creature">${r.result.emoji}</span>` : '';
  }).join('');
  stage.innerHTML = `
    <div class="char-aura" style="--glow:${Math.min(total, 100)}">
      <div class="char-body">${tier.emoji}</div>
      <div class="stage-creatures">${creatureEmojis}</div>
    </div>`;

  // 스탯
  document.getElementById('statBeauty').textContent = S.stats.beauty;
  document.getElementById('statCharm').textContent = S.stats.charm;
  document.getElementById('statTotal').textContent = total;
  document.getElementById('showcaseTier').textContent = `${tier.emoji} ${tier.title}`;

  // 보유 물약
  const potEl = document.getElementById('potionShelf');
  const pids = Object.keys(S.potions);
  if (pids.length === 0) {
    potEl.innerHTML = `<div class="empty-hint">공방에서 물약을 만들어보세요 ⚗️</div>`;
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
    colEl.innerHTML = `<div class="empty-hint">아직 전시 중인 크리처가 없어요 🦋</div>`;
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

// ─── 과시(공유) ───
function flexCharm() {
  const total = totalCharm();
  const tier = D.getTier(total);
  const text = `[다이어터 연금술사] 나의 매력 지수 ${total} — ${tier.emoji} ${tier.title} 등급!`;
  if (navigator.share) {
    navigator.share({ title: '다이어터 연금술사', text }).catch(() => {});
  } else if (navigator.clipboard) {
    navigator.clipboard.writeText(text).then(() => toast('매력 지수를 복사했어요! 📋'));
  } else {
    toast(text);
  }
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
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.tab-btn').forEach(b =>
    b.addEventListener('click', () => switchTab(b.dataset.tab)));
  switchTab('gather');
});
