// ═══════════════════════════════════════════════════════════════
//  다이어터 연금술사 — 아바타 렌더러 (SVG 페이퍼돌)
//  5개 바디 파츠(머리·몸통·팔·허벅지·종아리)
//  + 헤어(스타일/컬러) · 표정 · 옷 · 악세사리 · 문신 레이어
// ═══════════════════════════════════════════════════════════════
(function () {
  const D = window.GameData;

  // ─── 기본 팔레트 ───
  const SKIN     = '#ffdcc4';
  const SKIN_SH  = '#f2c6a6';
  const HAIR_DEF = '#7b5640';

  function shade(hex, amt = 26) {
    if (!hex || hex[0] !== '#') return hex;
    const h = hex.replace('#', '');
    const n = parseInt(h.length === 3 ? h.split('').map(c => c + c).join('') : h, 16);
    let r = (n >> 16) - amt, g = ((n >> 8) & 255) - amt, b = (n & 255) - amt;
    return `rgb(${Math.max(0, r)},${Math.max(0, g)},${Math.max(0, b)})`;
  }

  function getItem(slot, id) {
    const list = (D.WARDROBE && D.WARDROBE[slot]) || [];
    return list.find(x => x.id === id) || list[0] || { kind: 'none' };
  }
  const isNone = it => !it || it.kind === 'none';

  function starPath(cx, cy, r) {
    let d = '';
    for (let i = 0; i < 10; i++) {
      const ang = -Math.PI / 2 + i * Math.PI / 5;
      const rad = i % 2 === 0 ? r : r * 0.45;
      d += (i === 0 ? 'M' : 'L') + (cx + Math.cos(ang) * rad).toFixed(1) + ',' + (cy + Math.sin(ang) * rad).toFixed(1);
    }
    return d + 'Z';
  }

  // ═══════════════════════════════════════════════════════════════
  //  바디 파츠 (피부)
  // ═══════════════════════════════════════════════════════════════
  function legs() {
    return `
      <g data-part="calf">
        <rect x="80" y="266" width="17" height="66" rx="8" fill="${SKIN}"/>
        <rect x="103" y="266" width="17" height="66" rx="8" fill="${SKIN}"/>
      </g>
      <ellipse cx="86" cy="335" rx="12" ry="7" fill="${SKIN_SH}"/>
      <ellipse cx="114" cy="335" rx="12" ry="7" fill="${SKIN_SH}"/>
      <g data-part="thigh">
        <rect x="78" y="204" width="20" height="68" rx="10" fill="${SKIN}"/>
        <rect x="102" y="204" width="20" height="68" rx="10" fill="${SKIN}"/>
      </g>`;
  }

  function torsoArms() {
    return `
      <rect x="91" y="96" width="18" height="20" rx="7" fill="${SKIN_SH}"/>
      <g data-part="torso">
        <path d="M64,126 C64,118 80,113 100,113 C120,113 136,118 136,126
          L130,196 C130,208 116,214 100,214 C84,214 70,208 70,196 Z" fill="${SKIN}"/>
      </g>
      <g data-part="arm">
        <rect x="52" y="120" width="15" height="94" rx="7.5" fill="${SKIN}" transform="rotate(7 59 130)"/>
        <rect x="133" y="120" width="15" height="94" rx="7.5" fill="${SKIN}" transform="rotate(-7 141 130)"/>
      </g>`;
  }

  // 얼굴(피부) + 귀 + 표정
  function faceAndExpression(expItem) {
    const kind = (expItem && expItem.kind) || 'smile';
    const EYE = '#4a3a42', LIP = '#c97b86';
    let eyes, mouth;
    switch (kind) {
      case 'wink':
        eyes = `<ellipse cx="87" cy="75" rx="5" ry="6.5" fill="${EYE}"/><circle cx="88.7" cy="72.4" r="1.7" fill="#fff"/>
          <path d="M108,76 Q113,71 118,76" stroke="${EYE}" stroke-width="2.6" fill="none" stroke-linecap="round"/>`;
        mouth = `<path d="M94,89 Q100,94 106,89" stroke="${LIP}" stroke-width="2.2" fill="none" stroke-linecap="round"/>`;
        break;
      case 'happy':
        eyes = `<path d="M82,77 Q87,71 92,77" stroke="${EYE}" stroke-width="2.8" fill="none" stroke-linecap="round"/>
          <path d="M108,77 Q113,71 118,77" stroke="${EYE}" stroke-width="2.8" fill="none" stroke-linecap="round"/>`;
        mouth = `<path d="M92,88 Q100,98 108,88 Z" fill="#e98a9a"/><path d="M92,88 Q100,98 108,88" stroke="${LIP}" stroke-width="2" fill="none"/>`;
        break;
      case 'surprise':
        eyes = `<circle cx="87" cy="75" r="6" fill="${EYE}"/><circle cx="89" cy="72.5" r="2" fill="#fff"/>
          <circle cx="113" cy="75" r="6" fill="${EYE}"/><circle cx="115" cy="72.5" r="2" fill="#fff"/>`;
        mouth = `<ellipse cx="100" cy="91" rx="3.6" ry="4.6" fill="#b5566a"/>`;
        break;
      case 'cool':
        eyes = `<path d="M81,76 L93,75" stroke="${EYE}" stroke-width="3" fill="none" stroke-linecap="round"/>
          <path d="M107,75 L119,76" stroke="${EYE}" stroke-width="3" fill="none" stroke-linecap="round"/>`;
        mouth = `<path d="M95,90 L105,90" stroke="${LIP}" stroke-width="2.2" fill="none" stroke-linecap="round"/>`;
        break;
      default: // smile
        eyes = `<ellipse cx="87" cy="75" rx="5" ry="6.5" fill="${EYE}"/><ellipse cx="113" cy="75" rx="5" ry="6.5" fill="${EYE}"/>
          <circle cx="88.7" cy="72.4" r="1.7" fill="#fff"/><circle cx="114.7" cy="72.4" r="1.7" fill="#fff"/>`;
        mouth = `<path d="M94,89 Q100,94 106,89" stroke="${LIP}" stroke-width="2.2" fill="none" stroke-linecap="round"/>`;
    }
    return `
      <g data-part="head">
        <ellipse cx="100" cy="70" rx="33" ry="35" fill="${SKIN}"/>
        <ellipse cx="67" cy="76" rx="6" ry="9" fill="${SKIN}"/>
        <ellipse cx="133" cy="76" rx="6" ry="9" fill="${SKIN}"/>
        <ellipse cx="77" cy="86" rx="6" ry="4" fill="#ffb0c4" opacity="0.7"/>
        <ellipse cx="123" cy="86" rx="6" ry="4" fill="#ffb0c4" opacity="0.7"/>
        ${eyes}
        ${mouth}
      </g>`;
  }

  // ═══════════════════════════════════════════════════════════════
  //  헤어 (스타일 + 컬러)
  // ═══════════════════════════════════════════════════════════════
  function hairBack(kind, c) {
    const s = shade(c, 22);
    const crown = `<ellipse cx="100" cy="63" rx="40" ry="42" fill="${c}"/>`;
    switch (kind) {
      case 'bob':
        return crown +
          `<path d="M62,66 C58,92 62,110 75,112 C68,96 68,82 72,72 Z" fill="${c}"/>
           <path d="M138,66 C142,92 138,110 125,112 C132,96 132,82 128,72 Z" fill="${c}"/>`;
      case 'twin':
        return crown +
          `<ellipse cx="52" cy="132" rx="13" ry="36" fill="${c}" transform="rotate(10 52 132)"/>
           <ellipse cx="148" cy="132" rx="13" ry="36" fill="${c}" transform="rotate(-10 148 132)"/>
           <circle cx="64" cy="92" r="5.5" fill="${s}"/><circle cx="136" cy="92" r="5.5" fill="${s}"/>`;
      case 'ponytail':
        return crown +
          `<path d="M128,72 C154,92 152,150 138,182 C132,150 120,108 120,86 Z" fill="${c}"/>
           <circle cx="126" cy="78" r="5.5" fill="${s}"/>`;
      case 'wave':
        return crown +
          `<path d="M58,70 C48,100 68,120 54,152 C72,142 66,108 74,80 Z" fill="${c}"/>
           <path d="M142,70 C152,100 132,120 146,152 C128,142 134,108 126,80 Z" fill="${c}"/>`;
      default: // long
        return crown +
          `<path d="M61,66 C56,104 60,152 75,153 C66,120 66,92 72,72 Z" fill="${c}"/>
           <path d="M139,66 C144,104 140,152 125,153 C134,120 134,92 128,72 Z" fill="${c}"/>`;
    }
  }

  function hairFront(kind, c) {
    if (kind === 'wave') {
      return `<path d="M67,61 C66,36 134,36 133,61 C126,49 112,50 100,64 C99,50 95,48 91,53 C85,45 74,49 67,61 Z" fill="${c}"/>`;
    }
    // 기본 앞머리(스트레이트 뱅)
    return `<path d="M68,60 C66,38 78,30 100,30 C122,30 134,38 132,60
      C126,52 116,50 108,58 C104,50 96,50 92,58 C84,50 74,52 68,60 Z" fill="${c}"/>`;
  }

  // ═══════════════════════════════════════════════════════════════
  //  옷 (상의 / 하의 / 원피스)
  // ═══════════════════════════════════════════════════════════════
  function renderTop(it) {
    if (isNone(it)) return '';
    const c = it.color, c2 = shade(c), sh = it.sleeve === 'long' ? 94 : 42;
    return `
      <rect x="50" y="118" width="19" height="${sh}" rx="9" fill="${c}" transform="rotate(7 59 130)"/>
      <rect x="131" y="118" width="19" height="${sh}" rx="9" fill="${c}" transform="rotate(-7 141 130)"/>
      <path d="M60,124 C60,116 80,111 100,111 C120,111 140,116 140,124
        L134,192 C134,204 118,210 100,210 C82,210 66,204 66,192 Z" fill="${c}"/>
      <path d="M88,114 Q100,125 112,114" stroke="${c2}" stroke-width="3" fill="none" stroke-linecap="round"/>`;
  }

  function renderBottom(it) {
    if (isNone(it)) return '';
    const c = it.color, c2 = shade(c);
    if (it.kind === 'skirt') {
      return `<path d="M70,196 L130,196 L146,252 C120,266 80,266 54,252 Z" fill="${c}"/>
        <path d="M70,196 L130,196 L131,210 L69,210 Z" fill="${c2}"/>`;
    }
    if (it.kind === 'shorts') {
      return `<path d="M70,196 L130,196 L127,240 L106,240 L100,214 L94,240 L73,240 Z" fill="${c}"/>`;
    }
    return `<path d="M70,198 L130,198 L127,332 L107,332 L100,222 L93,332 L73,332 Z" fill="${c}"/>`;
  }

  function renderDress(it) {
    if (isNone(it)) return '';
    const c = it.color, c2 = shade(c);
    const hemY = it.kind === 'gown' ? 320 : 270, flare = it.kind === 'gown' ? 40 : 46;
    return `
      <rect x="50" y="118" width="19" height="42" rx="9" fill="${c}" transform="rotate(7 59 130)"/>
      <rect x="131" y="118" width="19" height="42" rx="9" fill="${c}" transform="rotate(-7 141 130)"/>
      <path d="M62,122 C62,115 80,111 100,111 C120,111 138,115 138,122
        L122,198 L${100 + flare + 8},${hemY} C122,${hemY + 14} 78,${hemY + 14} ${100 - flare - 8},${hemY}
        L78,198 Z" fill="${c}"/>
      <path d="M78,196 L122,196" stroke="${c2}" stroke-width="4" stroke-linecap="round"/>`;
  }

  // ═══════════════════════════════════════════════════════════════
  //  악세사리 (서클렛 / 귀걸이 / 목걸이)
  // ═══════════════════════════════════════════════════════════════
  function renderCirclet(it) {
    if (isNone(it)) return '';
    const c = it.color || '#ffd76a', c2 = shade(c, 34);
    if (it.kind === 'tiara') {
      return `<path d="M72,55 L82,43 L91,52 L100,38 L109,52 L118,43 L128,55 Z"
        fill="${c}" stroke="${c2}" stroke-width="1.5" stroke-linejoin="round"/><circle cx="100" cy="44" r="2.6" fill="#fff"/>`;
    }
    if (it.kind === 'flower') {
      const petals = [0, 72, 144, 216, 288].map(a =>
        `<circle cx="${(100 + Math.cos(a * Math.PI / 180) * 6.5).toFixed(1)}" cy="${(46 + Math.sin(a * Math.PI / 180) * 6.5).toFixed(1)}" r="4.4" fill="${c}"/>`).join('');
      return `<path d="M70,54 Q100,44 130,54" stroke="${c}" stroke-width="3.5" fill="none"/>${petals}<circle cx="100" cy="46" r="3" fill="#fff3b0"/>`;
    }
    return `<path d="M69,54 Q100,42 131,54" stroke="${c}" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M96,42 L100,48 L104,42 Z" fill="${c}"/>`;
  }

  function renderEarring(it) {
    if (isNone(it)) return '';
    const c = it.color || '#ffd76a';
    if (it.kind === 'hoop') {
      return `<circle cx="66" cy="88" r="5" fill="none" stroke="${c}" stroke-width="2.6"/><circle cx="134" cy="88" r="5" fill="none" stroke="${c}" stroke-width="2.6"/>`;
    }
    if (it.kind === 'star') {
      return `<path d="${starPath(66, 89, 4.6)}" fill="${c}"/><path d="${starPath(134, 89, 4.6)}" fill="${c}"/>`;
    }
    return `<circle cx="66" cy="84" r="2.3" fill="${c}"/><ellipse cx="66" cy="90" rx="3" ry="4.4" fill="${c}"/>
      <circle cx="134" cy="84" r="2.3" fill="${c}"/><ellipse cx="134" cy="90" rx="3" ry="4.4" fill="${c}"/>`;
  }

  function renderNecklace(it) {
    if (isNone(it)) return '';
    const c = it.color || '#ffd76a';
    if (it.kind === 'choker') {
      return `<path d="M85,113 Q100,121 115,113" stroke="${c}" stroke-width="4" fill="none" stroke-linecap="round"/>`;
    }
    if (it.kind === 'pearl') {
      let dots = '';
      for (let i = 0; i <= 8; i++) {
        const t = i / 8;
        dots += `<circle cx="${(83 + t * 34).toFixed(1)}" cy="${(116 + Math.sin(t * Math.PI) * 11).toFixed(1)}" r="2.4" fill="#fff" stroke="#eadfd0" stroke-width="0.5"/>`;
      }
      return dots;
    }
    return `<path d="M85,114 Q100,124 115,114" stroke="${c}" stroke-width="2" fill="none"/>
      <circle cx="100" cy="129" r="4.6" fill="${c}"/><circle cx="100" cy="129" r="1.8" fill="#fff" opacity="0.6"/>`;
  }

  // ═══════════════════════════════════════════════════════════════
  //  문신 (얼굴/볼 — 헤어·옷에 가리지 않는 위치)
  // ═══════════════════════════════════════════════════════════════
  function renderTattoo(it) {
    if (isNone(it)) return '';
    const c = it.color || '#c98bd6';
    switch (it.kind) {
      case 'star':
        return `<path d="${starPath(120, 90, 3.4)}" fill="${c}"/>`;
      case 'tear':
        return `<path d="M80,84 L77.6,90 L82.4,90 Z" fill="${c}"/><circle cx="80" cy="90" r="2.5" fill="${c}"/>`;
      case 'heart':
        return `<path d="M120,88 q-2.7,-2.7 -4.3,0 q-1.5,2.6 4.3,6.2 q5.8,-3.6 4.3,-6.2 q-1.6,-2.7 -4.3,0 Z" fill="${c}"/>`;
      case 'rune':
        return `<path d="M114,85 L124,85 M119,85 L119,94 M119,94 L123,97" stroke="${c}" stroke-width="1.7" fill="none" stroke-linecap="round"/>`;
      default:
        return `<circle cx="120" cy="90" r="2.6" fill="${c}"/>`;
    }
  }

  // ═══════════════════════════════════════════════════════════════
  //  앞치마 (옷 위에 덧입힘)
  // ═══════════════════════════════════════════════════════════════
  function renderApron(it) {
    if (isNone(it)) return '';
    const c = it.color || '#b0855a', c2 = shade(c, 30);
    return `
      <path d="M86,116 L82,150" stroke="${c2}" stroke-width="5" fill="none" stroke-linecap="round"/>
      <path d="M114,116 L118,150" stroke="${c2}" stroke-width="5" fill="none" stroke-linecap="round"/>
      <path d="M80,148 L120,148 L124,205 C114,211 86,211 76,205 Z" fill="${c}"/>
      <rect x="86" y="120" width="28" height="30" rx="5" fill="${c}"/>
      <rect x="73" y="149" width="54" height="7" rx="3.5" fill="${c2}"/>
      <rect x="89" y="169" width="22" height="17" rx="3" fill="none" stroke="${c2}" stroke-width="2"/>`;
  }

  // ═══════════════════════════════════════════════════════════════
  //  손에 드는 아이템 (오른손/왼손)
  // ═══════════════════════════════════════════════════════════════
  function renderHandItem(it, cx, cy) {
    if (isNone(it)) return '';
    switch (it.kind) {
      case 'potion':
        return `<g class="av-potion">
          <circle cx="${cx}" cy="${cy}" r="16" fill="url(#avPotGlow)"/>
          <circle cx="${cx}" cy="${cy + 2}" r="9" fill="#eaf6ff" opacity="0.4"/>
          <circle cx="${cx}" cy="${cy + 3}" r="8.4" fill="url(#avPotBrew)"/>
          <ellipse cx="${cx - 3}" cy="${cy + 1}" rx="1.8" ry="3.4" fill="#fff" opacity="0.6"/>
          <rect x="${cx - 2.4}" y="${cy - 13}" width="4.8" height="8" rx="1.5" fill="#e7dcc8"/>
          <rect x="${cx - 3.2}" y="${cy - 16}" width="6.4" height="4" rx="1.6" fill="#a9764a"/>
          <path d="${starPath(cx + 9, cy - 5, 2.4)}" fill="#fff6c0"/>
        </g>`;
      case 'wand':
        return `<g transform="rotate(16 ${cx} ${cy})">
          <rect x="${cx - 1.6}" y="${cy - 18}" width="3.2" height="34" rx="1.6" fill="#7a5636"/>
          <path d="${starPath(cx, cy - 21, 6)}" fill="#ffe07a" stroke="#e0b84a" stroke-width="1"/>
        </g>`;
      case 'dumbbell':
        return `<g transform="rotate(18 ${cx} ${cy})">
          <rect x="${cx - 3}" y="${cy - 11}" width="6" height="22" rx="2" fill="#7a808a"/>
          <rect x="${cx - 9}" y="${cy - 15}" width="18" height="10" rx="3" fill="#41464e"/>
          <rect x="${cx - 9}" y="${cy + 5}" width="18" height="10" rx="3" fill="#41464e"/>
          <rect x="${cx - 11}" y="${cy - 13}" width="4" height="6" rx="2" fill="#5a5f68"/>
          <rect x="${cx - 11}" y="${cy + 7}" width="4" height="6" rx="2" fill="#5a5f68"/>
        </g>`;
      case 'book':
        return `<g transform="rotate(-8 ${cx} ${cy})">
          <rect x="${cx - 11}" y="${cy - 8}" width="22" height="17" rx="2" fill="#8a3a3a"/>
          <rect x="${cx - 11}" y="${cy - 8}" width="5" height="17" fill="#6a2a2a"/>
          <path d="${starPath(cx + 2, cy + 0.5, 3.4)}" fill="#ffe07a"/>
        </g>`;
      default:
        return '';
    }
  }

  // ═══════════════════════════════════════════════════════════════
  //  조립
  // ═══════════════════════════════════════════════════════════════
  function build(outfit) {
    outfit = outfit || {};
    const dress = getItem('dress', outfit.dress);
    const hasDress = !isNone(dress);
    const top = hasDress ? null : getItem('top', outfit.top);
    const bottom = hasDress ? null : getItem('bottom', outfit.bottom);

    const hairItem = getItem('hair', outfit.hair);
    const hairColor = getItem('hairColor', outfit.hairColor).color || HAIR_DEF;
    const hairKind = hairItem.kind === 'none' ? 'long' : hairItem.kind;
    const expItem = getItem('expression', outfit.expression);

    const layers = [
      hairBack(hairKind, hairColor),
      legs(),
      hasDress ? '' : renderBottom(bottom),
      torsoArms(),
      hasDress ? renderDress(dress) : renderTop(top),
      renderApron(getItem('apron', outfit.apron)),
      faceAndExpression(expItem),
      hairFront(hairKind, hairColor),
      renderTattoo(getItem('tattoo', outfit.tattoo)),
      renderEarring(getItem('earring', outfit.earring)),
      renderNecklace(getItem('necklace', outfit.necklace)),
      renderCirclet(getItem('circlet', outfit.circlet)),
      // 손에 드는 아이템 (앞쪽) — 오른손=관객 왼쪽, 왼손=관객 오른쪽
      renderHandItem(getItem('rightHand', outfit.rightHand), 48, 200),
      renderHandItem(getItem('leftHand', outfit.leftHand), 152, 202),
    ];

    return `<svg class="avatar-svg" viewBox="0 0 200 348" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="내 아바타">
      <defs>
        <radialGradient id="avPotGlow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stop-color="rgba(255,224,140,0.9)"/><stop offset="1" stop-color="rgba(255,224,140,0)"/>
        </radialGradient>
        <linearGradient id="avPotBrew" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#ffe07a"/><stop offset="1" stop-color="#ff6ea6"/>
        </linearGradient>
      </defs>
      <ellipse cx="100" cy="342" rx="52" ry="8" fill="rgba(120,90,110,0.14)"/>
      ${layers.join('')}
    </svg>`;
  }

  // ═══════════════════════════════════════════════════════════════
  //  마이 룸 배경 — "텅 빈 중세 방" (아뜰리에 톤)
  //  돌벽 · 아치 창문/달빛 · 나무 바닥만. 가구/소품은 추후 사용자가 배치.
  //  (viewBox를 넓게 잡고 CSS에서 전체 폭으로 슬라이스 → 네모 프레임 없이 열린 방)
  // ═══════════════════════════════════════════════════════════════
  // 벽 연금술/행성 문양 (수은☿ 계열 글리프) — 방 장식 슬롯
  function mercuryGlyph(x, y) {
    return `<g stroke="rgba(140,112,66,0.34)" stroke-width="2.4" fill="none" stroke-linecap="round">
      <circle cx="${x}" cy="${y}" r="9"/>
      <path d="M${x - 6},${y - 13} A7,7 0 0 0 ${x + 6},${y - 13}"/>
      <line x1="${x}" y1="${y + 9}" x2="${x}" y2="${y + 21}"/>
      <line x1="${x - 6}" y1="${y + 15}" x2="${x + 6}" y2="${y + 15}"/>
    </g>`;
  }
  function wallRunes() {
    return mercuryGlyph(56, 116) + mercuryGlyph(344, 116) + mercuryGlyph(56, 198) + mercuryGlyph(344, 198);
  }

  function roomScene(outfit) {
    outfit = outfit || {};
    const deco = getItem('roomDeco', outfit.roomDeco);
    const decoSvg = deco && deco.kind === 'runes' ? wallRunes() : '';
    return `<svg class="room-svg" viewBox="0 0 400 320" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMax slice" aria-hidden="true">
      <defs>
        <linearGradient id="wallG" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#e9d8bd"/><stop offset="1" stop-color="#d2b68d"/>
        </linearGradient>
        <linearGradient id="floorG" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#bb8b5a"/><stop offset="1" stop-color="#9a6d40"/>
        </linearGradient>
        <linearGradient id="skyG" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#302f5a"/><stop offset="1" stop-color="#5d4e80"/>
        </linearGradient>
        <radialGradient id="moonG" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stop-color="#fff7e0"/><stop offset="1" stop-color="#ffe6a4"/>
        </radialGradient>
        <radialGradient id="glowG" cx="0.5" cy="0.28" r="0.75">
          <stop offset="0" stop-color="rgba(255,240,200,0.45)"/><stop offset="1" stop-color="rgba(255,240,200,0)"/>
        </radialGradient>
        <linearGradient id="beamG" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="rgba(255,240,190,0.5)"/><stop offset="1" stop-color="rgba(255,240,190,0)"/>
        </linearGradient>
      </defs>

      <!-- 돌벽 -->
      <rect x="0" y="0" width="400" height="238" fill="url(#wallG)"/>
      <g stroke="rgba(120,90,60,0.14)" stroke-width="2">
        <line x1="0" y1="70" x2="400" y2="70"/><line x1="0" y1="140" x2="400" y2="140"/><line x1="0" y1="210" x2="400" y2="210"/>
        <line x1="60" y1="0" x2="60" y2="70"/><line x1="150" y1="0" x2="150" y2="70"/><line x1="250" y1="0" x2="250" y2="70"/><line x1="340" y1="0" x2="340" y2="70"/>
        <line x1="20" y1="70" x2="20" y2="140"/><line x1="110" y1="70" x2="110" y2="140"/><line x1="300" y1="70" x2="300" y2="140"/><line x1="360" y1="70" x2="360" y2="140"/>
        <line x1="70" y1="140" x2="70" y2="210"/><line x1="330" y1="140" x2="330" y2="210"/>
      </g>
      <rect x="0" y="0" width="400" height="238" fill="url(#glowG)"/>
      ${decoSvg}

      <!-- 나무 바닥 -->
      <rect x="0" y="235" width="400" height="85" fill="url(#floorG)"/>
      <rect x="0" y="235" width="400" height="6" fill="#8a6038"/>
      <g stroke="#8a6038" stroke-width="2" opacity="0.75">
        <line x1="120" y1="241" x2="70" y2="320"/><line x1="200" y1="241" x2="200" y2="320"/><line x1="280" y1="241" x2="330" y2="320"/>
        <line x1="40" y1="241" x2="-40" y2="320"/><line x1="360" y1="241" x2="440" y2="320"/>
      </g>
      <line x1="0" y1="280" x2="400" y2="280" stroke="#8a6038" stroke-width="1.5" opacity="0.55"/>

      <!-- 아치 창문 + 달 -->
      <path d="M158,150 L158,74 A42,42 0 0 1 242,74 L242,150 Z" fill="#5b4636"/>
      <path d="M164,147 L164,76 A36,36 0 0 1 236,76 L236,147 Z" fill="url(#skyG)"/>
      <circle cx="220" cy="70" r="12" fill="url(#moonG)"/>
      <circle cx="214" cy="66" r="9" fill="url(#skyG)" opacity="0.5"/>
      <circle cx="180" cy="66" r="1.5" fill="#fff"/><circle cx="192" cy="54" r="1.2" fill="#fff"/><circle cx="176" cy="118" r="1.3" fill="#fff"/>
      <line x1="200" y1="34" x2="200" y2="148" stroke="#5b4636" stroke-width="4"/>
      <line x1="164" y1="102" x2="236" y2="102" stroke="#5b4636" stroke-width="4"/>

      <!-- 달빛 줄기 (바닥 위로) -->
      <path d="M172,150 L228,150 L262,300 L138,300 Z" fill="url(#beamG)" opacity="0.55"/>
    </svg>`;
  }

  window.Avatar = { build, getItem, roomScene };
})();
