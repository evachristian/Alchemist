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
    const EYE = '#4a3540', LIP = '#e58a9a';
    // 큰 반짝이는 눈 (기본형) — 하이라이트 2개
    const bigEye = (x) => `
      <ellipse cx="${x}" cy="79" rx="7.6" ry="9.6" fill="${EYE}"/>
      <ellipse cx="${x}" cy="80" rx="6" ry="7.8" fill="#6a4a58"/>
      <circle cx="${x + 3}" cy="75" r="3.3" fill="#fff"/>
      <circle cx="${x - 3.2}" cy="83" r="1.8" fill="#fff" opacity="0.9"/>`;
    const lash = (x, dir) => `<path d="M${x - 8 * dir},74 Q${x - 3 * dir},70 ${x + 2 * dir},72" stroke="${EYE}" stroke-width="2" fill="none" stroke-linecap="round"/>`;
    let eyes, mouth;
    switch (kind) {
      case 'wink':
        eyes = `${bigEye(84)}${lash(84, 1)}
          <path d="M108,80 Q116,72 124,80" stroke="${EYE}" stroke-width="3.4" fill="none" stroke-linecap="round"/>`;
        mouth = `<path d="M94,92 Q100,97 106,92" stroke="${LIP}" stroke-width="2.4" fill="none" stroke-linecap="round"/>`;
        break;
      case 'happy':
        eyes = `<path d="M76,81 Q84,72 92,81" stroke="${EYE}" stroke-width="3.6" fill="none" stroke-linecap="round"/>
          <path d="M108,81 Q116,72 124,81" stroke="${EYE}" stroke-width="3.6" fill="none" stroke-linecap="round"/>`;
        mouth = `<path d="M91,90 Q100,102 109,90 Z" fill="#ee8ea0"/><path d="M94,93 Q100,98 106,93" fill="#ff9db0"/>
          <path d="M91,90 Q100,102 109,90" stroke="${LIP}" stroke-width="2" fill="none" stroke-linecap="round"/>`;
        break;
      case 'surprise':
        eyes = `<circle cx="84" cy="79" r="7.8" fill="${EYE}"/><circle cx="87" cy="75.5" r="2.8" fill="#fff"/><circle cx="81.5" cy="82" r="1.5" fill="#fff" opacity="0.9"/>
          <circle cx="116" cy="79" r="7.8" fill="${EYE}"/><circle cx="119" cy="75.5" r="2.8" fill="#fff"/><circle cx="113.5" cy="82" r="1.5" fill="#fff" opacity="0.9"/>`;
        mouth = `<ellipse cx="100" cy="94" rx="4.2" ry="5.2" fill="#c96a7e"/>`;
        break;
      case 'cool':
        eyes = `<path d="M76,79 Q84,76 92,79" stroke="${EYE}" stroke-width="3.6" fill="none" stroke-linecap="round"/>
          <path d="M108,79 Q116,76 124,79" stroke="${EYE}" stroke-width="3.6" fill="none" stroke-linecap="round"/>`;
        mouth = `<path d="M95,92 Q100,95 105,92" stroke="${LIP}" stroke-width="2.4" fill="none" stroke-linecap="round"/>`;
        break;
      default: // smile
        eyes = `${bigEye(84)}${bigEye(116)}${lash(84, 1)}${lash(116, -1)}`;
        mouth = `<path d="M94,92 Q100,97 106,92" stroke="${LIP}" stroke-width="2.4" fill="none" stroke-linecap="round"/>`;
    }
    return `
      <g data-part="head">
        <ellipse cx="100" cy="70" rx="36" ry="37.5" fill="${SKIN}"/>
        <ellipse cx="64" cy="80" rx="6" ry="8.5" fill="${SKIN}"/>
        <ellipse cx="136" cy="80" rx="6" ry="8.5" fill="${SKIN}"/>
        <ellipse cx="72" cy="91" rx="8.5" ry="5.4" fill="#ffa6c0" opacity="0.7"/>
        <ellipse cx="128" cy="91" rx="8.5" ry="5.4" fill="#ffa6c0" opacity="0.7"/>
        ${eyes}
        ${mouth}
      </g>`;
  }

  // ═══════════════════════════════════════════════════════════════
  //  헤어 (스타일 + 컬러)
  // ═══════════════════════════════════════════════════════════════
  function hairBack(kind, c) {
    const s = shade(c, 22);
    // 얼굴을 넉넉히 감싸는 크라운 (옆머리-얼굴 사이 틈 방지)
    const crown = `<ellipse cx="100" cy="68" rx="44" ry="46" fill="${c}"/>`;
    switch (kind) {
      case 'bob':
        return crown +
          `<path d="M62,64 C57,92 61,112 78,114 C86,100 82,84 82,68 Z" fill="${c}"/>
           <path d="M138,64 C143,92 139,112 122,114 C114,100 118,84 118,68 Z" fill="${c}"/>`;
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
          `<path d="M58,68 C48,100 68,120 54,152 C80,142 76,106 80,78 Z" fill="${c}"/>
           <path d="M142,68 C152,100 132,120 146,152 C120,142 124,106 120,78 Z" fill="${c}"/>`;
      default: // long
        return crown +
          `<path d="M61,64 C56,104 60,152 76,153 C84,130 82,95 80,66 Z" fill="${c}"/>
           <path d="M139,64 C144,104 140,152 124,153 C116,130 118,95 120,66 Z" fill="${c}"/>`;
    }
  }

  function hairFront(kind, c) {
    if (kind === 'wave') {
      return `<path d="M62,60 C60,28 140,28 138,60 C130,46 113,47 100,62 C99,47 94,45 90,50 C83,42 70,46 62,60 Z" fill="${c}"/>`;
    }
    // 기본 앞머리(스트레이트 뱅) — 정수리 크라운을 완전히 덮음
    return `<path d="M62,59 C60,31 75,20 100,20 C125,20 140,31 138,59
      C131,50 118,48 109,56 C105,48 95,48 91,56 C82,48 69,50 62,59 Z" fill="${c}"/>`;
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
      return `<circle cx="63" cy="93" r="5" fill="none" stroke="${c}" stroke-width="2.6"/><circle cx="137" cy="93" r="5" fill="none" stroke="${c}" stroke-width="2.6"/>`;
    }
    if (it.kind === 'star') {
      return `<path d="${starPath(63, 94, 4.6)}" fill="${c}"/><path d="${starPath(137, 94, 4.6)}" fill="${c}"/>`;
    }
    return `<circle cx="63" cy="89" r="2.3" fill="${c}"/><ellipse cx="63" cy="95" rx="3" ry="4.4" fill="${c}"/>
      <circle cx="137" cy="89" r="2.3" fill="${c}"/><ellipse cx="137" cy="95" rx="3" ry="4.4" fill="${c}"/>`;
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

    // 몸(옷 포함)은 치비 비율로 압축 — 머리는 크게, 몸은 짧고 아담하게
    const body = `<g transform="translate(100,106) scale(0.88,0.72) translate(-100,-106)">
      ${legs()}
      ${hasDress ? '' : renderBottom(bottom)}
      ${torsoArms()}
      ${hasDress ? renderDress(dress) : renderTop(top)}
      ${renderNecklace(getItem('necklace', outfit.necklace))}
    </g>`;

    const layers = [
      hairBack(hairKind, hairColor),
      body,
      faceAndExpression(expItem),
      hairFront(hairKind, hairColor),
      renderTattoo(getItem('tattoo', outfit.tattoo)),
      renderEarring(getItem('earring', outfit.earring)),
      renderCirclet(getItem('circlet', outfit.circlet)),
    ];

    return `<svg class="avatar-svg" viewBox="0 0 200 300" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="내 아바타">
      <ellipse cx="100" cy="284" rx="46" ry="7" fill="rgba(120,90,110,0.14)"/>
      ${layers.join('')}
    </svg>`;
  }

  // ═══════════════════════════════════════════════════════════════
  //  마이 룸 배경 — "텅 빈 중세 방" (아뜰리에 톤)
  //  돌벽 · 아치 창문/달빛 · 나무 바닥만. 가구/소품은 추후 사용자가 배치.
  //  (viewBox를 넓게 잡고 CSS에서 전체 폭으로 슬라이스 → 네모 프레임 없이 열린 방)
  // ═══════════════════════════════════════════════════════════════
  function roomScene() {
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
