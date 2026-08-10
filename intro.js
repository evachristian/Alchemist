// ═══════════════════════════════════════════════════════════════
//  다이어터 연금술사 — 튜토리얼 인트로 (최초 진입 1회)
//  중세 배경 / 공주(통통) + 요정 대모 / 6컷 시나리오
// ═══════════════════════════════════════════════════════════════
(function () {
  const SEEN_KEY = 'dieter_alchemist_intro_seen_v1';

  // ─── 공용 파츠 ───────────────────────────────────────────────
  const SKIN = '#ffdcc4', SKIN_SH = '#f2c6a6', HAIR = '#7b5640', HAIR_SH = '#63432f';

  // 중세 실내 배경 — 9:16 세로 (400 x 711)
  function bg() {
    return `
      <rect x="0" y="0" width="400" height="711" fill="url(#iWall)"/>
      <g stroke="rgba(120,90,60,0.16)" stroke-width="2">
        <line x1="0" y1="110" x2="400" y2="110"/><line x1="0" y1="210" x2="400" y2="210"/>
        <line x1="0" y1="310" x2="400" y2="310"/><line x1="0" y1="410" x2="400" y2="410"/><line x1="0" y1="510" x2="400" y2="510"/>
        <line x1="70" y1="0" x2="70" y2="110"/><line x1="200" y1="0" x2="200" y2="110"/><line x1="320" y1="0" x2="320" y2="110"/>
        <line x1="30" y1="110" x2="30" y2="210"/><line x1="150" y1="110" x2="150" y2="210"/><line x1="270" y1="110" x2="270" y2="210"/>
        <line x1="90" y1="210" x2="90" y2="310"/><line x1="230" y1="210" x2="230" y2="310"/><line x1="350" y1="210" x2="350" y2="310"/>
        <line x1="40" y1="310" x2="40" y2="410"/><line x1="180" y1="310" x2="180" y2="410"/><line x1="310" y1="310" x2="310" y2="410"/>
      </g>
      <!-- 아치창 + 달 -->
      <path d="M262,300 L262,150 A58,58 0 0 1 378,150 L378,300 Z" fill="#5b4636"/>
      <path d="M270,294 L270,153 A50,50 0 0 1 370,153 L370,294 Z" fill="url(#iSky)"/>
      <circle cx="348" cy="150" r="17" fill="#fff3cf"/><circle cx="340" cy="145" r="13" fill="url(#iSky)" opacity="0.55"/>
      <circle cx="292" cy="146" r="2" fill="#fff"/><circle cx="308" cy="126" r="1.6" fill="#fff"/>
      <circle cx="356" cy="230" r="1.8" fill="#fff"/><circle cx="288" cy="248" r="1.5" fill="#fff"/>
      <line x1="320" y1="98" x2="320" y2="294" stroke="#5b4636" stroke-width="5"/>
      <line x1="270" y1="212" x2="370" y2="212" stroke="#5b4636" stroke-width="5"/>
      <!-- 벽 촛대 -->
      <g>
        <rect x="66" y="252" width="6" height="26" rx="2" fill="#7a5f3a"/>
        <rect x="58" y="242" width="22" height="12" rx="4" fill="#a8874f"/>
        <ellipse cx="69" cy="232" rx="5" ry="8" fill="#ffcf6a" class="i-flame"/>
        <circle cx="69" cy="234" r="22" fill="#ffd98a" opacity="0.16"/>
      </g>
      <!-- 바닥 -->
      <rect x="0" y="440" width="400" height="271" fill="url(#iFloor)"/>
      <rect x="0" y="440" width="400" height="6" fill="#8a6038"/>
      <g stroke="#8a6038" stroke-width="2" opacity="0.5">
        <line x1="130" y1="446" x2="30" y2="711"/><line x1="200" y1="446" x2="200" y2="711"/><line x1="270" y1="446" x2="370" y2="711"/>
      </g>
      <line x1="0" y1="530" x2="400" y2="530" stroke="#8a6038" stroke-width="1.6" opacity="0.45"/>`;
  }

  // 통통한 공주 — 앞모습으로 치킨 먹는 중
  function princessEating() {
    return `<g>
      <ellipse cx="150" cy="286" rx="52" ry="8" fill="rgba(80,60,40,0.18)"/>
      <!-- 드레스(넉넉한 실루엣) -->
      <path d="M104,286 C100,236 112,206 150,206 C188,206 200,236 196,286 Z" fill="#7fa06a"/>
      <path d="M112,262 L188,262" stroke="#6a8a58" stroke-width="4"/>
      <!-- 팔: 오른팔은 입으로, 왼팔은 접시로 -->
      <path d="M110,226 C104,238 112,244 124,238" stroke="#7fa06a" stroke-width="16" fill="none" stroke-linecap="round"/>
      <path d="M190,226 C200,240 198,256 190,264" stroke="#7fa06a" stroke-width="16" fill="none" stroke-linecap="round"/>
      <circle cx="192" cy="266" r="8" fill="${SKIN}"/>
      <!-- 뒷머리 -->
      <ellipse cx="150" cy="176" rx="40" ry="38" fill="${HAIR}"/>
      <path d="M112,178 C106,214 114,244 128,246 C118,222 116,198 120,184 Z" fill="${HAIR}"/>
      <path d="M188,178 C194,214 186,244 172,246 C182,222 184,198 180,184 Z" fill="${HAIR}"/>
      <!-- 얼굴 (통통) -->
      <ellipse cx="150" cy="180" rx="34" ry="33" fill="${SKIN}"/>
      <ellipse cx="150" cy="205" rx="17" ry="9" fill="${SKIN_SH}" opacity="0.5"/>
      <!-- 행복하게 먹는 표정 (^ ^) -->
      <path d="M130,178 Q137,171 144,178" stroke="#4a3a42" stroke-width="2.8" fill="none" stroke-linecap="round"/>
      <path d="M156,178 Q163,171 170,178" stroke="#4a3a42" stroke-width="2.8" fill="none" stroke-linecap="round"/>
      <ellipse cx="126" cy="188" rx="7" ry="4.6" fill="#ff9db4" opacity="0.5"/>
      <ellipse cx="174" cy="188" rx="7" ry="4.6" fill="#ff9db4" opacity="0.5"/>
      <!-- 우물우물 입 -->
      <ellipse class="i-mouth" cx="150" cy="194" rx="8" ry="6" fill="#b5566a"/>
      <!-- 앞머리 -->
      <path d="M116,174 C114,146 128,136 150,136 C172,136 186,146 184,174
        C180,160 168,152 150,152 C132,152 120,160 116,174 Z" fill="${HAIR}"/>
      <!-- 입가로 가져가는 치킨 다리 -->
      <g class="i-munch">
        <ellipse cx="126" cy="196" rx="11" ry="8.5" fill="#d99341" transform="rotate(-18 126 196)"/>
        <rect x="132" y="188" width="12" height="5" rx="2.5" fill="#f2e2c8" transform="rotate(-18 138 190)"/>
      </g>
      <!-- 치킨 접시 -->
      <ellipse cx="150" cy="284" rx="36" ry="9.5" fill="#e6dbc6"/>
      <ellipse cx="150" cy="281" rx="31" ry="8" fill="#fffaf0"/>
      <ellipse cx="139" cy="276" rx="11" ry="8" fill="#d99341"/><rect x="129" y="274" width="8" height="4" rx="2" fill="#f2e2c8"/>
      <ellipse cx="163" cy="278" rx="10" ry="7" fill="#c9853a"/><rect x="169" y="276" width="8" height="4" rx="2" fill="#f2e2c8"/>
    </g>`;
  }

  // 통통한 공주 — 앞모습 (표정 지정)
  function princessFront(mood) {
    let eyes, mouth, extra = '';
    if (mood === 'shy') {
      eyes = `<path d="M132,176 Q138,170 144,176" stroke="#4a3a42" stroke-width="2.6" fill="none" stroke-linecap="round"/>
              <path d="M156,176 Q162,170 168,176" stroke="#4a3a42" stroke-width="2.6" fill="none" stroke-linecap="round"/>`;
      mouth = `<path d="M144,190 Q150,186 156,190" stroke="#c97b86" stroke-width="2.2" fill="none" stroke-linecap="round"/>`;
      extra = `<g class="i-blush" fill="#ff9db4" opacity="0.55"><ellipse cx="128" cy="186" rx="8" ry="5"/><ellipse cx="172" cy="186" rx="8" ry="5"/></g>`;
    } else if (mood === 'ask') {
      eyes = `<ellipse cx="138" cy="176" rx="5.4" ry="6.6" fill="#4a3a42"/><ellipse cx="162" cy="176" rx="5.4" ry="6.6" fill="#4a3a42"/>
              <circle cx="140" cy="173.5" r="1.9" fill="#fff"/><circle cx="164" cy="173.5" r="1.9" fill="#fff"/>`;
      mouth = `<ellipse cx="150" cy="191" rx="4" ry="3" fill="#b5566a"/>`;
    } else { // scream
      eyes = `<path d="M132,178 L144,172 M132,172 L144,178" stroke="#4a3a42" stroke-width="2.6" stroke-linecap="round"/>
              <path d="M156,172 L168,178 M156,178 L168,172" stroke="#4a3a42" stroke-width="2.6" stroke-linecap="round"/>`;
      mouth = `<ellipse cx="150" cy="193" rx="7" ry="9" fill="#b5566a"/>`;
    }
    return `<g>
      <ellipse cx="150" cy="286" rx="52" ry="8" fill="rgba(80,60,40,0.18)"/>
      <path d="M104,286 C100,236 112,206 150,206 C188,206 200,236 196,286 Z" fill="#7fa06a"/>
      <path d="M112,262 L188,262" stroke="#6a8a58" stroke-width="4"/>
      <path d="M108,224 C96,242 96,258 102,268" stroke="#7fa06a" stroke-width="17" fill="none" stroke-linecap="round"/>
      <path d="M192,224 C204,242 204,258 198,268" stroke="#7fa06a" stroke-width="17" fill="none" stroke-linecap="round"/>
      <circle cx="100" cy="270" r="8" fill="${SKIN}"/><circle cx="200" cy="270" r="8" fill="${SKIN}"/>
      <!-- 뒷머리 -->
      <ellipse cx="150" cy="176" rx="40" ry="38" fill="${HAIR}"/>
      <path d="M112,178 C106,214 114,244 128,246 C118,222 116,198 120,184 Z" fill="${HAIR}"/>
      <path d="M188,178 C194,214 186,244 172,246 C182,222 184,198 180,184 Z" fill="${HAIR}"/>
      <!-- 얼굴 (통통) -->
      <ellipse cx="150" cy="180" rx="34" ry="33" fill="${SKIN}"/>
      <ellipse cx="150" cy="205" rx="17" ry="9" fill="${SKIN_SH}" opacity="0.5"/>
      ${extra}
      ${eyes}
      ${mouth}
      <!-- 앞머리 (부드러운 라운드 뱅) -->
      <path d="M116,174 C114,146 128,136 150,136 C172,136 186,146 184,174
        C180,160 168,152 150,152 C132,152 120,160 116,174 Z" fill="${HAIR}"/>
    </g>`;
  }

  // 요정 대모 (신데렐라풍: 하늘색 후드망토 + 지팡이)
  function fairy(pose) {
    const wand = pose === 'cast'
      ? `<g class="i-wandcast"><rect x="300" y="150" width="4" height="52" rx="2" fill="#d8c49a" transform="rotate(-28 302 176)"/>
         <path d="${star(288, 140, 11)}" fill="#fff3b0" stroke="#ffe07a" stroke-width="1.5"/></g>`
      : `<g><rect x="300" y="158" width="4" height="52" rx="2" fill="#d8c49a" transform="rotate(-12 302 184)"/>
         <path d="${star(294, 150, 9)}" fill="#fff3b0" stroke="#ffe07a" stroke-width="1.5"/></g>`;
    return `<g>
      <ellipse cx="330" cy="288" rx="42" ry="7" fill="rgba(80,60,40,0.16)"/>
      <!-- 망토(넉넉) -->
      <path d="M296,288 C292,240 306,206 330,206 C354,206 368,240 364,288 Z" fill="#8fc5e8"/>
      <path d="M330,206 C318,206 310,214 308,226 L352,226 C350,214 342,206 330,206 Z" fill="#a8d6f2"/>
      <!-- 팔 -->
      <path d="M304,232 C294,244 296,258 302,266" stroke="#8fc5e8" stroke-width="14" fill="none" stroke-linecap="round"/>
      <path d="M356,232 C366,242 366,254 360,262" stroke="#8fc5e8" stroke-width="14" fill="none" stroke-linecap="round"/>
      <circle cx="302" cy="268" r="7" fill="${SKIN}"/>
      <!-- 후드 뒤판 (얼굴보다 먼저) -->
      <path d="M330,142 C304,142 288,162 288,190 C288,204 293,216 301,224 L359,224 C367,216 372,204 372,190 C372,162 356,142 330,142 Z" fill="#7fb8de"/>
      <!-- 얼굴 -->
      <ellipse cx="330" cy="186" rx="26" ry="26" fill="${SKIN}"/>
      <ellipse cx="322" cy="185" rx="4" ry="5" fill="#4a3a42"/><ellipse cx="338" cy="185" rx="4" ry="5" fill="#4a3a42"/>
      <circle cx="323.4" cy="183" r="1.4" fill="#fff"/><circle cx="339.4" cy="183" r="1.4" fill="#fff"/>
      <ellipse cx="313" cy="194" rx="5" ry="3.4" fill="#ffb0c4" opacity="0.6"/>
      <ellipse cx="347" cy="194" rx="5" ry="3.4" fill="#ffb0c4" opacity="0.6"/>
      <path d="M324,197 Q330,201 336,197" stroke="#c97b86" stroke-width="2" fill="none" stroke-linecap="round"/>
      <!-- 백발 앞머리 -->
      <path d="M306,180 C304,160 316,152 330,152 C344,152 356,160 354,180 C348,170 340,166 330,170 C320,166 312,170 306,180 Z" fill="#eeeaf2"/>
      <!-- 후드 앞테두리 (얼굴 감싸는 띠) -->
      <path d="M330,142 C304,142 288,162 288,190 C288,199 290,207 294,214 L303,209 C300,203 299,197 299,190 C299,168 313,152 330,152 C347,152 361,168 361,190 C361,197 360,203 357,209 L366,214 C370,207 372,199 372,190 C372,162 356,142 330,142 Z" fill="#a8d6f2"/>
      ${wand}
    </g>`;
  }

  function star(cx, cy, r) {
    let d = '';
    for (let i = 0; i < 10; i++) {
      const a = -Math.PI / 2 + i * Math.PI / 5, rr = i % 2 === 0 ? r : r * 0.45;
      d += (i === 0 ? 'M' : 'L') + (cx + Math.cos(a) * rr).toFixed(1) + ',' + (cy + Math.sin(a) * rr).toFixed(1);
    }
    return d + 'Z';
  }

  // 반짝이 파티클
  function sparkles(n, seedX, seedY, spread) {
    let s = '';
    for (let i = 0; i < n; i++) {
      const x = seedX + ((i * 53) % spread) - spread / 2;
      const y = seedY + ((i * 37) % spread) - spread / 2;
      const r = 2 + (i % 3);
      s += `<path class="i-spark" style="animation-delay:${(i * 0.18).toFixed(2)}s" d="${star(x, y, r)}" fill="#fff3b0"/>`;
    }
    return s;
  }

  // ─── 배치 (9:16 캔버스 위에 캐릭터 앉히기) ───────────────────
  // 두 캐릭터의 발끝이 같은 바닥선(y=650)에 오도록 스케일/이동
  const P = s => `<g transform="translate(-90, 76) scale(1.5)">${s}</g>`;      // 공주 (왼쪽)
  const F = s => `<g transform="translate(-157, 108) scale(1.38)">${s}</g>`;   // 요정 (오른쪽)

  // ─── 씬 정의 ────────────────────────────────────────────────
  const SCENES = [
    {
      art: () => bg() + P(princessEating()),
      speaker: null,
      text: '깊은 밤, 성의 한쪽 구석…\n공주님은 오늘도 야식을 즐기고 있었다.',
    },
    {
      art: () => bg() + P(princessEating()) + F(fairy('idle')) + sparkles(7, 300, 370, 130),
      speaker: '요정 대모',
      text: '아니 대체 왜 그렇게 밤마다 야식을 드시는 거예요?',
    },
    {
      art: () => bg() + P(princessFront('shy')) + F(fairy('idle')),
      speaker: '공주',
      text: '모르겠어. 자꾸 뭔가 먹고 싶어.\n정신적인 허기일지도…?',
    },
    {
      art: () => bg() + P(princessFront('shy')) + F(fairy('idle')) + sparkles(6, 300, 380, 120),
      speaker: '요정 대모',
      text: '이대로는 안되겠어요.\n제가 마법 솥을 드릴테니 연금술을 배워보시겠어요?',
    },
    {
      art: () => bg() + P(princessFront('ask')) + F(fairy('idle')),
      speaker: '공주',
      text: '연금술? 내가 왜??',
    },
    {
      art: () => bg() + P(princessFront('ask')) + F(fairy('cast')) + sparkles(9, 285, 340, 150),
      speaker: '요정 대모',
      text: '그야, 아름다움을 위해서죠.\n연금술을 배우시면 아름다움의 의미를 깨달으실 수 있게 되실 거예요.\n제가 도와드리죠.',
    },
    {
      art: () => bg() + `<g class="i-teleport">${P(princessFront('scream'))}</g>` + F(fairy('cast')) + sparkles(14, 140, 380, 200),
      speaker: '공주',
      text: '꺄아아아─!!',
    },
  ];

  // ─── 렌더 / 진행 ─────────────────────────────────────────────
  let idx = 0, onDone = null;

  function paint() {
    const s = SCENES[idx];
    const art = document.getElementById('introArt');
    const box = document.getElementById('introText');
    const name = document.getElementById('introSpeaker');
    if (!art || !box) return;

    art.innerHTML = `<svg viewBox="0 0 400 711" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg" class="intro-svg">
      <defs>
        <linearGradient id="iWall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#e9d8bd"/><stop offset="1" stop-color="#cfae83"/>
        </linearGradient>
        <linearGradient id="iFloor" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#bb8b5a"/><stop offset="1" stop-color="#96683c"/>
        </linearGradient>
        <linearGradient id="iSky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#2c2b52"/><stop offset="1" stop-color="#584a7a"/>
        </linearGradient>
      </defs>
      ${s.art()}
    </svg>`;

    name.textContent = s.speaker || '';
    name.style.display = s.speaker ? '' : 'none';
    box.textContent = s.text;

    // 진행 표시
    const dots = document.getElementById('introDots');
    if (dots) {
      dots.innerHTML = SCENES.map((_, i) =>
        `<span class="i-dot ${i === idx ? 'on' : ''}"></span>`).join('');
    }
    // 페이드 인
    const stage = document.getElementById('introStage');
    if (stage) { stage.classList.remove('i-in'); void stage.offsetWidth; stage.classList.add('i-in'); }
  }

  function next() {
    if (idx < SCENES.length - 1) { idx++; paint(); }
    else finish();
  }

  function finish() {
    const el = document.getElementById('intro');
    if (!el) return;
    try { localStorage.setItem(SEEN_KEY, '1'); } catch (e) {}
    el.classList.add('hide');
    setTimeout(() => {
      if (el.parentNode) el.parentNode.removeChild(el);
      if (onDone) onDone();
    }, 600);
  }

  function hasSeen() {
    try { return localStorage.getItem(SEEN_KEY) === '1'; } catch (e) { return false; }
  }

  // 최초 진입일 때만 시작. 이미 봤으면 false 반환.
  function start(cb) {
    onDone = cb;
    const el = document.getElementById('intro');
    if (!el) return false;
    if (hasSeen()) { if (el.parentNode) el.parentNode.removeChild(el); return false; }
    el.style.display = 'flex';
    idx = 0;
    paint();
    return true;
  }

  window.Intro = { start, next, finish, hasSeen, SEEN_KEY };
})();
