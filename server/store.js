// ═══════════════════════════════════════════════════════════════
//  세이브 저장소 — 환경에 따라 3가지 중 하나를 고른다
//
//   1) Postgres   DATABASE_URL 이 있으면 (Railway 에서 Postgres 를 붙인 경우)
//   2) 파일        DATA_DIR 이 있으면   (Railway Volume 을 붙인 경우)
//   3) 메모리      둘 다 없으면         (로컬 개발용 — 서버를 끄면 사라진다)
//
//  ⚠ Railway 의 기본 파일시스템은 재배포할 때마다 초기화된다.
//     그래서 아무것도 설정하지 않으면 '메모리' 로 동작하고,
//     서버가 다시 뜰 때 세이브가 사라진다. 실서비스에서는 1) 이나 2) 를 쓸 것.
//     (index.js 가 시작할 때 어느 모드인지 로그로 알려 준다)
// ═══════════════════════════════════════════════════════════════
const fs = require('fs');
const path = require('path');

// ─── 1) Postgres ───
function pgStore(url) {
  const { Pool } = require('pg');
  // Railway 내부 연결은 인증서가 self-signed 라 검증을 끈다 (연결 자체는 사설망)
  const pool = new Pool({
    connectionString: url,
    ssl: /localhost|127\.0\.0\.1|\.railway\.internal/.test(url)
      ? false
      : { rejectUnauthorized: false },
  });

  const ready = pool.query(`
    CREATE TABLE IF NOT EXISTS saves (
      player_id TEXT PRIMARY KEY,
      secret    TEXT        NOT NULL,
      rev       BIGINT      NOT NULL DEFAULT 0,
      saved_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
      state     JSONB       NOT NULL
    )`);

  return {
    kind: 'postgres',
    async get(playerId) {
      await ready;
      const r = await pool.query(
        'SELECT player_id, secret, rev, saved_at, state FROM saves WHERE player_id = $1', [playerId]);
      if (!r.rows.length) return null;
      const row = r.rows[0];
      return { playerId: row.player_id, secret: row.secret, rev: Number(row.rev), savedAt: row.saved_at, state: row.state };
    },
    async put(playerId, secret, rev, state) {
      await ready;
      await pool.query(
        `INSERT INTO saves (player_id, secret, rev, saved_at, state)
         VALUES ($1, $2, $3, now(), $4)
         ON CONFLICT (player_id) DO UPDATE
           SET rev = EXCLUDED.rev, saved_at = now(), state = EXCLUDED.state`,
        [playerId, secret, rev, state]);
    },
    async del(playerId) {
      await ready;
      await pool.query('DELETE FROM saves WHERE player_id = $1', [playerId]);
    },
    async count() {
      await ready;
      const r = await pool.query('SELECT count(*)::int AS n FROM saves');
      return r.rows[0].n;
    },
  };
}

// ─── 2) 파일 (Railway Volume 등) ───
function fileStore(dir) {
  fs.mkdirSync(dir, { recursive: true });
  // 파일 이름으로 그대로 쓰기 때문에 경로 문자를 막는다 (../ 로 빠져나가는 것 방지)
  const fileOf = id => path.join(dir, encodeURIComponent(id) + '.json');

  return {
    kind: 'file(' + dir + ')',
    async get(playerId) {
      try {
        return JSON.parse(fs.readFileSync(fileOf(playerId), 'utf8'));
      } catch (e) { return null; }
    },
    async put(playerId, secret, rev, state) {
      const rec = { playerId, secret, rev, savedAt: new Date().toISOString(), state };
      // 쓰는 도중 서버가 죽어도 반쪽 파일이 남지 않도록 임시 파일 → 이름 바꾸기
      const tmp = fileOf(playerId) + '.tmp';
      fs.writeFileSync(tmp, JSON.stringify(rec));
      fs.renameSync(tmp, fileOf(playerId));
    },
    async del(playerId) {
      try { fs.unlinkSync(fileOf(playerId)); } catch (e) {}
    },
    async count() {
      return fs.readdirSync(dir).filter(f => f.endsWith('.json')).length;
    },
  };
}

// ─── 3) 메모리 (개발용) ───
function memStore() {
  const m = new Map();
  return {
    kind: 'memory(휘발성)',
    async get(playerId) { return m.get(playerId) || null; },
    async put(playerId, secret, rev, state) {
      m.set(playerId, { playerId, secret, rev, savedAt: new Date().toISOString(), state });
    },
    async del(playerId) { m.delete(playerId); },
    async count() { return m.size; },
  };
}

function createStore(env) {
  env = env || process.env;
  if (env.DATABASE_URL) return pgStore(env.DATABASE_URL);
  if (env.DATA_DIR) return fileStore(env.DATA_DIR);
  return memStore();
}

module.exports = { createStore, pgStore, fileStore, memStore };
