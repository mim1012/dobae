import { handleApi } from '../server/api.mjs';

// Vercel 서버리스는 /tmp만 쓰기 가능(인스턴스 종료 시 사라짐) — 테스트 접수용.
export default async function handler(req, res) {
  await handleApi(req, res, '/tmp/consultations');
}
