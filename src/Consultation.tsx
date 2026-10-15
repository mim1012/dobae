import { useState, useRef, type FormEvent } from 'react';
import { ImagePlus, Plus, X, Download, CheckCircle2, Phone } from 'lucide-react';
import { Arrow, Modal, cn } from './components';
import { business } from './data';

type Fields = { phone: string; address: string; space: string; date: string; area: string; contactTime: string; material: string; message: string; consent: boolean };
const empty: Fields = { phone: '', address: '', space: '', date: '', area: '', contactTime: '', material: '미정 · 모름', message: '', consent: false };
function initialFields(): Fields {
  const params = new URLSearchParams(window.location.search);
  return { ...empty, space: params.get('space') || '', message: params.get('message')?.slice(0, 3000) || '', material: params.get('material') || empty.material };
}
export function today() { return new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Seoul', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date()); }
function readFile(file: File): Promise<{ name: string; type: string; data: string }> {
  const extension = file.name.split('.').pop()?.toLowerCase() || '';
  const types: Record<string, string> = { jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png', webp: 'image/webp', heic: 'image/heic', heif: 'image/heif' };
  return new Promise((resolve, reject) => { const reader = new FileReader(); reader.onerror = () => reject(new Error('사진을 읽지 못했습니다. 다시 선택해 주세요.')); reader.onload = () => resolve({ name: file.name, type: file.type || types[extension], data: String(reader.result).split(',')[1] }); reader.readAsDataURL(file); });
}
export default function ConsultationForm({ full = false }: { full?: boolean }) {
  const [fields, setFields] = useState<Fields>(initialFields);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [files, setFiles] = useState<File[]>([]);
  const [fileError, setFileError] = useState('');
  const [requestError, setRequestError] = useState('');
  const [pending, setPending] = useState(false);
  const [receipt, setReceipt] = useState('');
  const [privacy, setPrivacy] = useState(false);
  const [submitted, setSubmitted] = useState<Fields | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const prefix = full ? 'consult' : 'home-consult';
  const id = (key: string) => `${prefix}-${key}`;
  const update = (key: keyof Fields, value: string | boolean) => { setFields(previous => ({ ...previous, [key]: value })); setErrors(previous => { const next = { ...previous }; delete next[key]; return next; }); };
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;
    const data = new FormData(event.currentTarget);
    const values: Fields = { phone: String(data.get('phone') || '').trim(), address: String(data.get('address') || '').trim(), space: String(data.get('space') || ''), date: String(data.get('date') || ''), area: String(data.get('area') || ''), contactTime: String(data.get('contactTime') || ''), material: fields.material, message: String(data.get('message') || '').slice(0, 3000), consent: data.get('consent') === 'on' };
    setFields(values);
    const validation: Record<string, string> = {};
    if (!/^(?:0\d{8,10}|\+82\d{8,10})$/.test(values.phone.replace(/[\s()-]/g, ''))) validation.phone = '연락 가능한 전화번호를 입력해 주세요.';
    if (values.address.length < 2) validation.address = '시공할 주소를 입력해 주세요.';
    if (values.date && values.date < today()) validation.date = '오늘 이후의 날짜를 선택해 주세요.';
    if (!values.consent) validation.consent = '개인정보 수집·이용에 동의해 주세요.';
    setErrors(validation); setRequestError('');
    if (Object.keys(validation).length) { document.getElementById(id(Object.keys(validation)[0]))?.focus(); return; }
    setPending(true);
    try {
      const controller = new AbortController();
      const timer = window.setTimeout(() => controller.abort(), 45000);
      let response;
      try { response = await fetch('/api/consultations', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...values, files: await Promise.all(files.map(readFile)) }), signal: controller.signal }); }
      finally { clearTimeout(timer); }
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || '상담 신청을 완료하지 못했습니다.');
      setSubmitted(values); setReceipt(result.id);
      setFields(empty); setFiles([]); setFileError('');
    } catch (error) { setRequestError(error instanceof Error && error.name !== 'AbortError' ? error.message : '연결이 지연되고 있습니다. 전화로 접수 여부를 확인해 주세요.'); }
    finally { setPending(false); }
  }
  function download() {
    if (!submitted) return;
    const text = `우리도배 상담 신청 내용\n접수번호: ${receipt}\n\n연락처: ${submitted.phone}\n시공 주소: ${submitted.address}\n공간: ${submitted.space || '미정'}\n희망일: ${submitted.date || '협의'}\n평형: ${submitted.area || '미정'}\n벽지: ${submitted.material}\n통화 가능 시간: ${submitted.contactTime || '미정'}\n\n${submitted.message}\n\n현재는 개발 서버에 저장된 테스트 접수입니다. 실제 상담은 ${business.phone}로 연락해 주세요.`;
    const url = URL.createObjectURL(new Blob(['\uFEFF', text], { type: 'text/plain;charset=utf-8' }));
    const link = document.createElement('a'); link.href = url; link.download = `우리도배-${receipt}.txt`; link.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  const error = (key: string) => errors[key] && <p className="field-error" id={`${id(key)}-error`}>{errors[key]}</p>;
  const attrs = (key: string) => ({ 'aria-invalid': !!errors[key], 'aria-describedby': errors[key] ? `${id(key)}-error` : undefined });
  return <>
    <form className={cn('consult-form', full && 'consult-form-full')} onSubmit={submit} noValidate aria-busy={pending}>
      {full && <div className="form-introduction"><p>시공할 공간과 연락처를 알려주세요. 아래 정보를 함께 남기시면 상담 준비에 도움이 됩니다.</p><div><strong>작성 예시</strong><span>마포구 아파트 / 32평형 / 이사 전 전체 도배 / 실크벽지 / 오후 통화 가능</span></div></div>}
      <div className="form-fields">
        <div className="field field-phone"><label htmlFor={id('phone')}>연락처 <b>*</b></label><input id={id('phone')} name="phone" type="tel" inputMode="tel" autoComplete="tel" placeholder="연락 가능한 번호" value={fields.phone} onChange={event => update('phone', event.target.value)} {...attrs('phone')} required disabled={pending} />{error('phone')}</div>
        <div className="field field-address"><label htmlFor={id('address')}>{full ? '시공 주소' : '시공 지역'} <b>*</b></label><input id={id('address')} name="address" autoComplete="street-address" placeholder={full ? '주소 또는 아파트명을 입력해 주세요' : '시 · 구 · 동 입력'} value={fields.address} onChange={event => update('address', event.target.value)} {...attrs('address')} required disabled={pending} />{error('address')}</div>
        <div className="field"><label htmlFor={id('space')}>공간 유형</label><select id={id('space')} name="space" value={fields.space} onChange={event => update('space', event.target.value)} disabled={pending}><option value="">선택해 주세요</option>{['아파트', '빌라 · 주택', '원룸 · 오피스텔', '상가 · 사무실', '기타'].map(space => <option key={space}>{space}</option>)}</select></div>
        <div className="field"><label htmlFor={id('date')}>시공 희망일</label><input id={id('date')} type="date" name="date" min={today()} value={fields.date} onInput={event => update('date', event.currentTarget.value)} onChange={event => update('date', event.target.value)} {...attrs('date')} disabled={pending} />{error('date')}</div>
        {full && <><div className="field"><label htmlFor={id('area')}>공급 평수</label><input id={id('area')} name="area" placeholder="예: 32평형 (대략적으로 적어도 좋아요)" value={fields.area} onChange={event => update('area', event.target.value)} disabled={pending} /></div><div className="field"><label htmlFor={id('contactTime')}>통화 가능 시간</label><input id={id('contactTime')} name="contactTime" placeholder="예: 오후 2~5시 / 언제든 가능" value={fields.contactTime} onChange={event => update('contactTime', event.target.value)} disabled={pending} /></div><fieldset className="material-field span-full"><legend>벽지 종류</legend><div className="material-options">{['합지벽지', '실크벽지', '미정 · 모름'].map(material => <label key={material} className={cn(fields.material === material && 'selected')}><input type="radio" name="material" value={material} checked={fields.material === material} onChange={() => update('material', material)} disabled={pending} />{material}</label>)}</div></fieldset></>}
        <div className="field span-full"><label htmlFor={id('message')}>문의 내용</label><textarea id={id('message')} name="message" rows={5} maxLength={3000} placeholder="문의 내용을 입력해 주세요." value={fields.message} onChange={event => update('message', event.target.value)} disabled={pending} /><small className="character-count">{fields.message.length} / 3,000</small></div>
        <div className="field span-full"><label htmlFor={id('photos')}>현장 사진 첨부</label><input ref={inputRef} id={id('photos')} className="visually-hidden" type="file" multiple accept="image/jpeg,image/png,image/webp,image/heic,image/heif" disabled={pending} onChange={event => {
          const picked = Array.from(event.target.files || []); event.target.value = ''; if (!picked.length) return;
          if (picked.some(file => !/\.(jpe?g|png|webp|heic|heif)$/i.test(file.name) || file.size > 10 * 1024 * 1024 || !file.size)) { setFileError('JPG, PNG, WebP, HEIC 사진을 파일당 10MB 이하로 선택해 주세요.'); return; }
          const next = [...files]; picked.forEach(file => { if (!next.some(existing => existing.name === file.name && existing.size === file.size && existing.lastModified === file.lastModified)) next.push(file); });
          if (next.length > 5 || next.reduce((sum, file) => sum + file.size, 0) > 25 * 1024 * 1024) { setFileError('사진은 최대 5장, 총 25MB까지 첨부할 수 있어요.'); return; }
          setFiles(next); setFileError('');
        }} /><button type="button" className="attachment-button" onClick={() => inputRef.current?.click()} disabled={pending}><ImagePlus size={22} />현장 사진 첨부<Plus size={17} /></button><small>최대 5장 · 파일당 10MB · 전체 25MB</small>{fileError && <p className="field-error" role="alert">{fileError}</p>}{!!files.length && <ul className="file-list">{files.map((file, index) => <li key={`${file.name}-${index}`}><span>{file.name}</span><button type="button" disabled={pending} aria-label={`${file.name} 첨부 해제`} onClick={() => setFiles(previous => previous.filter((_, i) => i !== index))}><X size={15} /></button></li>)}</ul>}</div>
      </div>
      <div className="consent-line"><label><input id={id('consent')} type="checkbox" name="consent" checked={fields.consent} onChange={event => update('consent', event.target.checked)} {...attrs('consent')} disabled={pending} /><span>개인정보 수집·이용에 동의합니다.</span></label><button type="button" onClick={() => setPrivacy(true)}>내용 보기 <Arrow /></button></div>{error('consent')}
      {requestError && <div className="request-error" role="alert">{requestError}<a href={business.telephone}>전화 상담 연결 <Phone size={15} /></a></div>}
      <button className="button button-primary form-submit" type="submit" disabled={pending}>{pending ? '신청 내용을 저장하고 있습니다…' : '견적 상담 신청'}{!pending && <Arrow />}</button>
      <p className="form-footnote">※ 희망일 입력만으로 시공 예약이 확정되지는 않습니다.</p>
      <p className="development-note">현재는 테스트 접수입니다. 실제 상담은 <a href={business.telephone}>{business.phone}</a>로 문의해 주세요.</p>
    </form>
    <Modal open={privacy} onOpenChange={setPrivacy} title="개인정보 수집·이용 안내" description="상담에 필요한 정보만 입력해 주세요."><div className="privacy-copy"><h3>수집하는 정보</h3><p>필수: 연락처, 시공 주소. 선택: 공간 유형, 희망일, 평수, 통화 가능 시간, 벽지 종류, 문의 내용, 첨부 사진.</p><h3>이용 목적과 보관</h3><p>현재 개발 환경에서는 입력한 내용을 이 컴퓨터의 개발 서버에 테스트 신청으로 저장합니다. 외부 업체에 전송되거나 알림이 발송되지는 않습니다. 테스트 데이터는 사이트 관리자가 검증 후 삭제합니다.</p><h3>동의 거부</h3><p>동의를 거부할 수 있으며, 거부 시 온라인 신청을 이용할 수 없습니다. 전화 상담은 별도로 이용할 수 있습니다.</p><a className="text-link" href="/privacy">개인정보 처리방침 자세히 보기 <Arrow /></a></div><button className="button button-primary full-button" onClick={() => setPrivacy(false)}>확인했습니다</button></Modal>
    <Modal open={!!receipt} onOpenChange={open => { if (!open) setReceipt(''); }} title="상담 신청 내용이 저장되었습니다." description="현재는 개발 환경의 테스트 접수이며, 실제 상담 예약은 확정되지 않았습니다."><div className="receipt-content"><CheckCircle2 size={48} strokeWidth={1.3} /><span>접수번호</span><strong>{receipt}</strong><p>실제 상담을 원하시면 아래 번호로 연락해 주세요.</p><a href={business.telephone} className="receipt-phone"><Phone size={22} />{business.phone}</a></div><button className="button button-outline full-button" onClick={download}>신청 내용 내려받기 <Download size={18} /></button></Modal>
  </>;
}
