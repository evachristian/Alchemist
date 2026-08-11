// ═══════════════════════════════════════════════════════════════
//  텍스트 스타일 정책 검증기
//  TEXT_POLICY.md 에 정리된 규칙을 실제 화면에서 자동으로 검사한다.
//
//  사용법
//    checkTextStyle()            현재 보이는 화면 검사 → 콘솔 표 + 결과 반환
//    checkTextStyle({ all:true }) 숨겨진 화면(다른 탭/모달)까지 강제로 검사
//    URL 에 ?a11y=1 을 붙이면 로드 직후 자동 실행
// ═══════════════════════════════════════════════════════════════
(function () {
  // ─── 정책 상수 (TEXT_POLICY.md 와 반드시 일치) ───
  const POLICY = {
    // 대비 (WCAG 2.1)
    contrastNormal: 4.5,          // 일반 텍스트
    contrastLarge: 3.0,           // 큰 텍스트 (24px+ 또는 18.66px+ && bold)
    largePx: 24,
    largeBoldPx: 18.66,
    boldMin: 700,
    // 폰트
    minFontPx: 11,                // 이보다 작은 글씨 금지
    allowedWeights: [400, 500, 700, 800, 900],   // 실제로 로드한 웨이트만
    allowedFamily: 'Noto Sans KR',               // body 스택의 첫 폰트
    // 검사 제외
    //  · 장식용 그래픽/이모지 — 읽는 글자가 아님
    //  · 비활성/잠금 상태 — WCAG 도 inactive 컴포넌트는 대비 요건에서 제외한다
    //    (단 '잠김'이라는 사실 자체는 자물쇠 아이콘 등으로 따로 알려야 함)
    skipSelector: '[data-a11y-skip], .i-dot, .avatar-svg, svg, .brew-emoji, .spot-emoji,'
      + ' .wr-tab.dim, .wr-item.locked, [disabled], [aria-disabled="true"]',
  };

  // ─── 색 계산 ───
  function parseColor(str) {
    const m = String(str).match(/rgba?\(([^)]+)\)/);
    if (!m) return null;
    const p = m[1].split(',').map(s => parseFloat(s.trim()));
    return { r: p[0], g: p[1], b: p[2], a: p.length > 3 ? p[3] : 1 };
  }
  function luminance(c) {
    const f = v => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); };
    return 0.2126 * f(c.r) + 0.7152 * f(c.g) + 0.0722 * f(c.b);
  }
  function contrast(fg, bg) {
    const l1 = luminance(fg), l2 = luminance(bg);
    const hi = Math.max(l1, l2), lo = Math.min(l1, l2);
    return (hi + 0.05) / (lo + 0.05);
  }
  // 반투명 전경색을 배경 위에 합성
  function over(fg, bg) {
    if (fg.a >= 1) return fg;
    return {
      r: fg.r * fg.a + bg.r * (1 - fg.a),
      g: fg.g * fg.a + bg.g * (1 - fg.a),
      b: fg.b * fg.a + bg.b * (1 - fg.a),
      a: 1,
    };
  }
  function hexOf(c) {
    const h = v => Math.round(v).toString(16).padStart(2, '0');
    return '#' + h(c.r) + h(c.g) + h(c.b);
  }

  // 조상을 거슬러 올라가며 실제로 눈에 보이는 배경색을 합성한다.
  // 그라데이션/이미지가 깔린 경우엔 정확한 값을 알 수 없으므로 approx 로 표시.
  function effectiveBg(el) {
    let acc = null, approx = false;
    for (let n = el; n; n = n.parentElement) {
      const cs = getComputedStyle(n);
      if (cs.backgroundImage && cs.backgroundImage !== 'none') approx = true;
      const c = parseColor(cs.backgroundColor);
      if (c && c.a > 0) {
        acc = acc ? over(acc, c) : c;
        if (acc.a >= 1) return { color: acc, approx };
      }
    }
    const white = { r: 255, g: 255, b: 255, a: 1 };
    return { color: acc ? over(acc, white) : white, approx };
  }

  // 요소가 자기 자신의 텍스트를 직접 가지고 있는가 (자식 요소의 글자는 제외)
  function ownText(el) {
    let s = '';
    for (const n of el.childNodes) if (n.nodeType === 3) s += n.nodeValue;
    return s.trim();
  }
  function visible(el) {
    const cs = getComputedStyle(el);
    if (cs.display === 'none' || cs.visibility === 'hidden' || parseFloat(cs.opacity) === 0) return false;
    return el.getClientRects().length > 0;
  }
  // 조상까지 곱해진 실효 opacity (반투명하게 흐려진 글씨도 잡아내기 위함)
  function effectiveOpacity(el) {
    let o = 1;
    for (let n = el; n; n = n.parentElement) o *= parseFloat(getComputedStyle(n).opacity || 1);
    return o;
  }

  function checkTextStyle(opts) {
    opts = opts || {};
    const rows = [];
    const seen = new Set();
    const nodes = document.querySelectorAll('body *');

    for (const el of nodes) {
      if (el.closest(POLICY.skipSelector)) continue;
      const text = ownText(el);
      if (!text) continue;
      if (!opts.all && !visible(el)) continue;
      if (seen.has(el)) continue;
      seen.add(el);

      const cs = getComputedStyle(el);
      const sizePx = parseFloat(cs.fontSize);
      const weight = parseInt(cs.fontWeight, 10) || 400;
      const isLarge = sizePx >= POLICY.largePx || (sizePx >= POLICY.largeBoldPx && weight >= POLICY.boldMin);
      const need = isLarge ? POLICY.contrastLarge : POLICY.contrastNormal;

      const bgInfo = effectiveBg(el);
      let fg = parseColor(cs.color) || { r: 0, g: 0, b: 0, a: 1 };
      // 요소 자체의 opacity 로 흐려진 글씨는 배경과 섞인 것으로 계산
      const eo = effectiveOpacity(el);
      fg = over({ ...fg, a: fg.a * eo }, bgInfo.color);
      const ratio = contrast(fg, bgInfo.color);

      const issues = [];
      if (ratio < need) {
        issues.push(`대비 ${ratio.toFixed(2)}:1 (필요 ${need}:1)`);
      }
      if (sizePx < POLICY.minFontPx) {
        issues.push(`글자 ${sizePx.toFixed(1)}px (최소 ${POLICY.minFontPx}px)`);
      }
      if (POLICY.allowedWeights.indexOf(weight) < 0) {
        issues.push(`웨이트 ${weight} 미로드 (허용 ${POLICY.allowedWeights.join('/')})`);
      }
      if (cs.fontFamily.indexOf(POLICY.allowedFamily) < 0) {
        issues.push(`폰트 ${cs.fontFamily.split(',')[0]} (본문 스택 상속만 허용)`);
      }
      if (!issues.length) continue;

      rows.push({
        선택자: selectorOf(el),
        텍스트: text.length > 18 ? text.slice(0, 18) + '…' : text,
        글자색: hexOf(fg),
        배경색: hexOf(bgInfo.color) + (bgInfo.approx ? ' (추정)' : ''),
        대비: ratio.toFixed(2),
        크기: `${sizePx.toFixed(0)}px/${weight}`,
        위반: issues.join(', '),
        el,
      });
    }

    const pass = rows.length === 0;
    if (typeof console.table === 'function' && rows.length) {
      console.groupCollapsed(`[텍스트 정책] 위반 ${rows.length}건`);
      console.table(rows.map(({ el, ...r }) => r));
      console.groupEnd();
    } else if (pass) {
      console.log('[텍스트 정책] 위반 없음 ✅');
    }
    return { pass, count: rows.length, rows, policy: POLICY };
  }

  function selectorOf(el) {
    if (el.id) return '#' + el.id;
    const cls = (el.getAttribute('class') || '').trim().split(/\s+/).filter(Boolean).slice(0, 2).join('.');
    return el.tagName.toLowerCase() + (cls ? '.' + cls : '');
  }

  // ═══════════════════════════════════════════════════════════════
  //  레이아웃 검증 — 문구 길이가 달라져도 겹치거나 깨지지 않는가
  //  (언어를 추가하면 라벨 길이가 달라진다. UI_POLICY.md '가변 폭' 규칙)
  // ═══════════════════════════════════════════════════════════════
  const LAYOUT = {
    tolerance: 0.5,                       // 반올림 오차 허용 (px)
    // 검사 대상 — 눌리는 요소와 값이 바뀌는 텍스트
    targetSelector: 'button, .cat-tab, .set-opt, .room-tab, .tab-btn, .spot-card, .stat-box,'
      + ' .recipe-row, .wr-item, .ing-chip, .potion-card, .clock-item, .wr-count, .recipe-progress',
    // 넘쳐도 되는 곳 — 가로 스크롤이 설계된 컨테이너
    scrollerSelector: '.cat-tabs',
  };

  function rectOf(el) { return el.getBoundingClientRect(); }
  function overlaps(a, b, tol) {
    return a.left < b.right - tol && b.left < a.right - tol
        && a.top < b.bottom - tol && b.top < a.bottom - tol;
  }
  function positioned(el) {
    const pos = getComputedStyle(el).position;
    return pos === 'absolute' || pos === 'fixed' || pos === 'sticky';
  }

  function checkLayout(opts) {
    opts = opts || {};
    const tol = LAYOUT.tolerance;
    const found = [];
    const add = (kind, el, detail, level) =>
      found.push({ 종류: kind, 선택자: selectorOf(el), 텍스트: (ownText(el) || el.textContent || '').trim().slice(0, 16),
                   내용: detail, 수준: level || '위반', el });

    const targets = [...document.querySelectorAll(LAYOUT.targetSelector)].filter(visible);

    // ① 형제끼리 겹침 — 같은 부모 아래 나란히 놓인 요소는 절대 겹치면 안 된다
    const byParent = new Map();
    for (const el of targets) {
      if (positioned(el)) continue;
      const p = el.parentElement;
      if (!p) continue;
      if (!byParent.has(p)) byParent.set(p, []);
      byParent.get(p).push(el);
    }
    for (const [, sibs] of byParent) {
      for (let i = 0; i < sibs.length; i++) {
        for (let j = i + 1; j < sibs.length; j++) {
          if (sibs[i].contains(sibs[j]) || sibs[j].contains(sibs[i])) continue;
          const a = rectOf(sibs[i]), b = rectOf(sibs[j]);
          if (overlaps(a, b, tol)) {
            add('겹침', sibs[i], `${selectorOf(sibs[j])} 와 겹침 (${Math.round(Math.min(a.right, b.right) - Math.max(a.left, b.left))}px)`);
          }
        }
      }
    }

    // ② 부모 밖으로 삐져나감 (가로 스크롤 컨테이너 안은 설계상 정상)
    for (const el of targets) {
      if (positioned(el)) continue;
      const p = el.parentElement;
      if (!p || el.closest(LAYOUT.scrollerSelector)) continue;
      const pr = rectOf(p), r = rectOf(el);
      const ps = getComputedStyle(p);
      if (ps.overflowX === 'auto' || ps.overflowX === 'scroll') continue;
      const padL = parseFloat(ps.paddingLeft) || 0, padR = parseFloat(ps.paddingRight) || 0;
      const over = Math.max(r.right - (pr.right - padR), (pr.left + padL) - r.left);
      if (over > tol) add('넘침', el, `부모(${selectorOf(p)}) 밖으로 ${Math.round(over)}px`);
    }

    // ③ 라벨 잘림 — 말줄임으로 버티고는 있지만 글자를 다 못 읽는 상태
    for (const el of targets) {
      if (getComputedStyle(el).whiteSpace !== 'nowrap') continue;
      const cut = el.scrollWidth - el.clientWidth;
      if (cut > 1) add('잘림', el, `라벨이 ${Math.round(cut)}px 잘림`, '주의');
    }

    // ④ 페이지 자체에 가로 스크롤이 생겼는가
    const de = document.documentElement;
    if (de.scrollWidth - de.clientWidth > 1) {
      found.push({ 종류: '가로스크롤', 선택자: '(문서)', 텍스트: '',
        내용: `문서가 뷰포트보다 ${de.scrollWidth - de.clientWidth}px 넓음`, 수준: '위반', el: document.body });
    }

    const violations = found.filter(f => f.수준 === '위반');
    if (found.length && typeof console.table === 'function') {
      console.groupCollapsed(`[레이아웃] 위반 ${violations.length}건 / 주의 ${found.length - violations.length}건`);
      console.table(found.map(({ el, ...r }) => r));
      console.groupEnd();
    } else if (!found.length) {
      console.log('[레이아웃] 이상 없음 ✅');
    }
    return { pass: violations.length === 0, count: violations.length, rows: found };
  }

  // 라벨을 인위적으로 늘려 '더 긴 언어'를 흉내 낸다 (되돌리는 함수를 반환)
  function stressLabels(factor) {
    const saved = [];
    for (const el of document.querySelectorAll(LAYOUT.targetSelector)) {
      const w = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
      let n;
      while ((n = w.nextNode())) {
        const t = n.nodeValue;
        if (!t || !t.trim()) continue;
        saved.push([n, t]);
        n.nodeValue = new Array(factor).fill(t.trim()).join(' ');
      }
    }
    return () => saved.forEach(([n, t]) => { n.nodeValue = t; });
  }

  // 모든 언어 + 라벨을 늘린 상태까지 한 번에 검사
  async function checkUI(opts) {
    opts = opts || {};
    const stress = opts.stress || 2;      // 기본: 라벨 길이 2배까지 견디는지
    const frame = () => new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));
    const langs = (window.I18N ? I18N.langs().map(l => l.code) : ['ko']);
    const before = window.I18N ? I18N.getLang() : null;
    const report = [];

    for (const code of langs) {
      if (window.I18N) I18N.setLang(code);
      await frame();
      const text = checkTextStyle();
      const layout = checkLayout();
      report.push({ 언어: code, 배율: '1x', 대비위반: text.count, 레이아웃위반: layout.count });

      const restore = stressLabels(stress);
      await frame();
      const stressed = checkLayout();
      restore();
      await frame();
      report.push({ 언어: code, 배율: stress + 'x', 대비위반: '-', 레이아웃위반: stressed.count });
      if (stressed.count) report.stressRows = (report.stressRows || []).concat(stressed.rows);
    }
    if (before && window.I18N) { I18N.setLang(before); await frame(); }

    const total = report.reduce((n, r) => n + (Number(r.대비위반) || 0) + (Number(r.레이아웃위반) || 0), 0);
    console.table(report);
    console.log(total === 0 ? '[UI 정책] 전체 통과 ✅' : `[UI 정책] 총 ${total}건 확인 필요`);
    return { pass: total === 0, total, report };
  }

  window.checkTextStyle = checkTextStyle;
  window.checkLayout = checkLayout;
  window.__stress = stressLabels;   // 테스트용: 라벨 길이를 배로 늘림
  window.checkUI = checkUI;
  window.TEXT_POLICY = POLICY;
  window.LAYOUT_POLICY = LAYOUT;

  // ?a11y=1 이면 로드 후 자동 검사
  if (/[?&]a11y=1/.test(location.search)) {
    window.addEventListener('load', () => setTimeout(() => checkTextStyle(), 400));
  }
})();
