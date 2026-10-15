import { randomUUID } from 'node:crypto';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const MAX_FILE = 10 * 1024 * 1024;
const MAX_TOTAL = 25 * 1024 * 1024;
const MAX_BODY = 36 * 1024 * 1024;
const allowedTypes = new Map([['image/jpeg', 'jpg'], ['image/png', 'png'], ['image/webp', 'webp'], ['image/heic', 'heic'], ['image/heif', 'heif']]);
const limits = new Map();
export function koreaDate() { return new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Seoul', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date()); }
export function validateSubmission(body) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) throw new Error('신청 내용을 확인해 주세요.');
  const text = (key, max) => typeof body[key] === 'string' ? body[key].trim().slice(0, max) : '';
  const record = { phone: text('phone', 30), address: text('address', 300), space: text('space', 40), date: text('date', 10), area: text('area', 40), contactTime: text('contactTime', 100), material: text('material', 30), message: text('message', 3000), consent: body.consent === true };
  if (!/^(?:0\d{8,10}|\+82\d{8,10})$/.test(record.phone.replace(/[\s()-]/g, ''))) throw new Error('연락 가능한 전화번호를 확인해 주세요.');
  if (record.address.length < 2) throw new Error('시공 주소를 입력해 주세요.');
  if (!record.consent) throw new Error('개인정보 수집·이용에 동의해 주세요.');
  if (record.date && (!/^\d{4}-\d{2}-\d{2}$/.test(record.date) || Number.isNaN(Date.parse(record.date)) || new Date(record.date).toISOString().slice(0, 10) !== record.date || record.date < koreaDate())) throw new Error('오늘 이후의 올바른 날짜를 선택해 주세요.');
  const files = body.files ?? [];
  if (!Array.isArray(files) || files.length > 5) throw new Error('사진은 최대 5장까지 첨부할 수 있어요.');
  let total = 0;
  const attachments = files.map(file => {
    if (!file || !allowedTypes.has(file.type) || typeof file.data !== 'string' || !/^[A-Za-z0-9+/]*={0,2}$/.test(file.data) || file.data.length > Math.ceil(MAX_FILE / 3) * 4) throw new Error('첨부 사진의 형식이나 용량을 확인해 주세요.');
    const bytes = Buffer.from(file.data, 'base64');
    if (!bytes.length || bytes.length > MAX_FILE) throw new Error('사진은 파일당 10MB 이하로 첨부해 주세요.');
    total += bytes.length;
    if (total > MAX_TOTAL) throw new Error('첨부 사진의 총 용량은 25MB 이하로 선택해 주세요.');
    return { name: typeof file.name === 'string' ? file.name.slice(0, 200) : '사진', extension: allowedTypes.get(file.type), type: file.type, bytes };
  });
  return { record, attachments };
}
function json(res, status, body) { res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' }); res.end(JSON.stringify(body)); }
export async function handleApi(req, res, storageRoot = path.resolve('.data/consultations')) {
  const pathname = (req.url || '').split('?')[0];
  if (!pathname.startsWith('/api/')) return false;
  if (pathname === '/api/health' && req.method === 'GET') { json(res, 200, { ok: true, mode: 'local' }); return true; }
  if (pathname !== '/api/consultations' || req.method !== 'POST') { json(res, 404, { error: '요청한 기능을 찾을 수 없습니다.' }); return true; }
  const origin = req.headers.origin;
  if (origin) {
    try { if (new URL(origin).host !== req.headers.host) { json(res, 403, { error: '허용되지 않은 요청입니다.' }); return true; } }
    catch { json(res, 403, { error: '허용되지 않은 요청입니다.' }); return true; }
  }
  if (!req.headers['content-type']?.startsWith('application/json')) { json(res, 415, { error: '올바른 신청 형식이 아닙니다.' }); return true; }
  const ip = req.socket.remoteAddress || 'local';
  const now = Date.now();
  for (const [key, value] of limits) if (value.until < now) limits.delete(key);
  const limit = limits.get(ip) || { count: 0, until: now + 60000 };
  if (limit.count >= 10) { json(res, 429, { error: '잠시 후 다시 신청해 주세요.' }); return true; }
  limits.set(ip, { ...limit, count: limit.count + 1 });
  let payload;
  try {
    const chunks = []; let size = 0;
    for await (const chunk of req) { size += chunk.length; if (size > MAX_BODY) { json(res, 413, { error: '첨부 파일 용량이 너무 큽니다.' }); return true; } chunks.push(chunk); }
    payload = validateSubmission(JSON.parse(Buffer.concat(chunks).toString('utf8')));
  } catch (error) { json(res, 400, { error: error instanceof SyntaxError ? '신청 형식을 확인해 주세요.' : error.message || '입력 내용을 확인해 주세요.' }); return true; }
  const id = `WR-${koreaDate().replaceAll('-', '')}-${randomUUID().slice(0, 8).toUpperCase()}`;
  try {
    const folder = path.join(storageRoot, id);
    await mkdir(folder, { recursive: true });
    const savedFiles = [];
    for (const [index, attachment] of payload.attachments.entries()) {
      const filename = `photo-${index + 1}.${attachment.extension}`;
      await writeFile(path.join(folder, filename), attachment.bytes, { flag: 'wx' });
      savedFiles.push({ filename, originalName: attachment.name, type: attachment.type, size: attachment.bytes.length });
    }
    await writeFile(path.join(folder, 'request.json'), JSON.stringify({ id, receivedAt: new Date().toISOString(), ...payload.record, files: savedFiles, mode: 'local', status: 'received' }, null, 2), { flag: 'wx' });
    json(res, 201, { ok: true, id, mode: 'local' });
  } catch { json(res, 500, { error: '신청 내용을 저장하지 못했습니다. 잠시 후 다시 시도하거나 전화로 문의해 주세요.' }); }
  return true;
}
