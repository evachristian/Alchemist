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

  window.checkTextStyle = checkTextStyle;
  window.TEXT_POLICY = POLICY;

  // ?a11y=1 이면 로드 후 자동 검사
  if (/[?&]a11y=1/.test(location.search)) {
    window.addEventListener('load', () => setTimeout(() => checkTextStyle(), 400));
  }
})();
