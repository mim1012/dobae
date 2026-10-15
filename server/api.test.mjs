import test from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { mkdtemp, readFile, readdir, rm } from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import { handleApi, koreaDate, validateSubmission } from './api.mjs';

const valid = { phone: '010-0000-0000', address: '테스트 시공 지역', consent: true, date: koreaDate(), message: '자동 검증용 신청' };
test('필수 값, 동의, 실제 달력 날짜를 검증한다', () => {
  assert.equal(validateSubmission(valid).record.phone, valid.phone);
  for (const patch of [{ phone: '123' }, { address: '' }, { consent: false }, { date: '2000-01-01' }, { date: '2099-02-30' }]) assert.throws(() => validateSubmission({ ...valid, ...patch }));
});
test('첨부 개수, 형식, 빈 파일과 총용량을 검증한다', () => {
  const file = { name: 'test.png', type: 'image/png', data: 'aGVsbG8=' };
  assert.equal(validateSubmission({ ...valid, files: [file] }).attachments[0].bytes.length, 5);
  assert.throws(() => validateSubmission({ ...valid, files: Array(6).fill(file) }));
  assert.throws(() => validateSubmission({ ...valid, files: [{ ...file, type: 'text/html' }] }));
  assert.throws(() => validateSubmission({ ...valid, files: [{ ...file, data: '' }] }));
  const large = { ...file, data: Buffer.alloc(9 * 1024 * 1024).toString('base64') };
  assert.throws(() => validateSubmission({ ...valid, files: [large, large, large] }));
});
test('접수 API는 파일을 비공개 폴더에 저장하고 잘못된 요청은 거절한다', async () => {
  const temporaryRoot = path.resolve(os.tmpdir());
  const folder = await mkdtemp(path.join(temporaryRoot, 'woori-api-test-'));
  const server = createServer((req, res) => { handleApi(req, res, folder).catch(() => { res.statusCode = 500; res.end(); }); });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const base = `http://127.0.0.1:${server.address().port}`;
  const post = (body, headers = {}) => fetch(`${base}/api/consultations`, { method: 'POST', headers: { 'Content-Type': 'application/json', ...headers }, body: JSON.stringify(body) });
  try {
    assert.equal((await fetch(`${base}/api/health`)).status, 200);
    assert.equal((await post({ ...valid, consent: false })).status, 400);
    assert.equal((await post(valid, { Origin: 'https://different.example' })).status, 403);
    const response = await post({ ...valid, files: [{ name: '../../test.png', type: 'image/png', data: 'aGVsbG8=' }] });
    assert.equal(response.status, 201);
    const receipt = await response.json();
    assert.match(receipt.id, /^WR-\d{8}-[A-F0-9]{8}$/);
    const saved = JSON.parse(await readFile(path.join(folder, receipt.id, 'request.json'), 'utf8'));
    assert.equal(saved.address, valid.address);
    assert.equal(saved.files[0].filename, 'photo-1.png');
    assert.deepEqual((await readdir(path.join(folder, receipt.id))).sort(), ['photo-1.png', 'request.json']);
    assert.equal((await fetch(`${base}/api/consultations/${receipt.id}`)).status, 404);
  } finally {
    await new Promise(resolve => server.close(resolve));
    const resolved = path.resolve(folder);
    if (path.dirname(resolved) !== temporaryRoot || !path.basename(resolved).startsWith('woori-api-test-')) throw new Error('Unexpected test cleanup path');
    await rm(resolved, { recursive: true, force: true });
  }
});
