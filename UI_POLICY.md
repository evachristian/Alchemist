# UI 컴포넌트 정책

컴포넌트를 새로 만들 때 지킬 규칙. 글자 색·폰트는 [TEXT_POLICY.md](TEXT_POLICY.md) 참고.

---

## 1. 카테고리 탭 (`.cat-tabs` / `.cat-tab`)

가로로 늘어놓는 탭 줄. 현재 쓰는 곳:

| 위치 | 컨테이너 | 항목 |
|---|---|---|
| 마이 룸 › 옷 › 슬롯 탭 | `.cat-tabs.wr-tabs` | 헤어 / 헤어컬러 / 표정 / 문신 / 상의 / 하의 / 원피스 / 서클렛 / 귀걸이 / 목걸이 |
| 공방 › 레시피 북 | `.cat-tabs.rb-tabs` | 하급 물약 / 중급 물약 / 상급 물약 / 크리처 |

### 규칙

1. **스크롤바를 표시하지 않는다.**
   `scrollbar-width: none` + `::-webkit-scrollbar { display: none }`.
   **마지막 버튼이 화면 끝에서 잘려 보이는 것 자체가 "더 있다"는 신호**다.
   별도의 화살표·그라데이션·스크롤바 같은 장치를 덧붙이지 않는다.

2. **버튼을 줄바꿈하지 않는다.** `flex-wrap` 금지, `.cat-tab { flex: 0 0 auto }`.
   줄바꿈하면 잘린 버튼이 안 생겨서 1번의 신호가 사라진다.

3. **스크롤 수단은 세 가지를 모두 지원한다** — `setupTabScroll()` 이 자동으로 붙여 준다.
   - 터치 드래그 (브라우저 기본 동작)
   - 마우스 휠 (세로 휠 → 가로 스크롤)
   - 마우스로 끌기 (데스크톱에는 스크롤바가 없으므로 필수)
   - 끌고 난 직후의 클릭은 탭 전환으로 치지 않는다 (6px 이상 움직였으면 무시)

4. **선택된 탭은 자동으로 보이는 위치로 당겨온다.** 스크롤 밖에 있으면 가운데 정렬.

5. 상태별 스타일
   | 상태 | 스타일 |
   |---|---|
   | 기본 | `background: var(--cream)` · `color: var(--ink-soft)` |
   | 선택 | `background: var(--pink-2)` · `color: var(--ink)` — 흰 글씨 금지 |
   | 비활성 | `.dim` — `color: var(--ink-dim)` · `opacity: 0.7` |

### 새로 만들 때

```html
<div id="myTabs" class="cat-tabs"></div>
```
```js
el.innerHTML = ITEMS.map(x =>
  `<button class="cat-tab ${cur === x.id ? 'active' : ''}" onclick="pick('${x.id}')">${x.label}</button>`
).join('');
// setupTabScroll 은 render() 끝에서 모든 .cat-tabs 에 자동으로 붙는다 — 따로 호출할 필요 없음
```

여백만 다르면 `.cat-tabs` 옆에 전용 클래스를 하나 더 붙여 margin 만 지정한다 (`.wr-tabs`, `.rb-tabs` 처럼).

> **탭이 3~4개로 항상 화면에 들어간다면** 스크롤 줄이 아니라 균등 분할 행
> (마이 룸의 `.room-tabs` — 옷/물약/크리처) 을 쓴다.

---

## 2. 확인(컨펌) 패널

- 바깥 영역(딤)을 터치하면 **취소와 동일하게** 닫힌다.
- 버튼은 `취소`(좌) / `확인`(우) 순서.

---

## 3. 토스트

- 아이콘 옆에서 뜨는 안내는 그 아이콘을 `anchor` 로 넘겨 근처에 띄운다.
- 줄바꿈이 있거나 22자를 넘으면 자동으로 여러 줄(`.toast.multi`)로 표시된다.
- 표시 시간 기본 1.8초, 긴 문구는 `toast(msg, anchor, ms)` 로 늘린다.

---

## 4. 버튼음

모든 버튼은 `sfx.js` 의 위임 리스너가 자동으로 소리를 붙인다. 개별 코드 불필요.

| 소리 | 대상 |
|---|---|
| `ui_tab` | 하단 탭 |
| `ui_confirm` | 주요 실행 버튼 (`.btn-primary`) |
| `ui_back` | 취소·닫기 (`.btn-ghost` `.set-x` `.i-skip`, 모달 딤) |
| `ui_tap` | 그 외 전부 |

개별 조정이 필요하면 `data-sfx="ui_confirm"`, 무음은 `data-nosfx`.
