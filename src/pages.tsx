import { useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { MapPin, Phone, Clock3, Car, TrainFront, Copy, Check, ChevronLeft, ChevronRight, Search, MessageCircle, CheckCircle2, Layers } from 'lucide-react';
import { Action, Arrow, ConsultationBanner, EmptyState, PageIntro, Photo, Reveal, SectionHeading, cn } from './components';
import { AboutFeatures, ProjectCard } from './Home';
import ConsultationForm from './Consultation';
import { areaFilters, business, projects, projectPhoto } from './data';

export function AboutPage() {
  return <><PageIntro eyebrow="ABOUT" title={<span className="text-accent">우리도배</span>} description="서울 마포구 만리재로 83 · 도배 시공 상담" />
    <section className="section about-greeting"><div className="container two-columns"><Reveal><Photo src={projectPhoto('gongdeok-33', 33)} label="공덕 아이파크 벽지 시공 현장" className="about-greeting-photo" /></Reveal><Reveal className="long-copy"><h2>전체·부분 도배</h2><p>전체 도배부터 방 한 곳의 부분 도배까지, 현장 상태와 작업 범위를 확인해 안내합니다.</p><AboutFeatures /><div className="button-group"><Action href="/portfolio" outline>시공사례</Action><Action href={business.blog} external>블로그</Action></div></Reveal></div></section>
    <section className="section soft-background"><div className="container two-columns"><Reveal><SectionHeading title="매장 · 연락처" /><dl className="contact-details"><div><dt>전화</dt><dd><a href={business.telephone}>{business.phone}</a></dd></div><div><dt>주소</dt><dd>{business.address}</dd></div><div><dt>영업시간</dt><dd>{business.hours}</dd></div></dl><a className="text-link" href="/stores">매장 위치 <Arrow /></a></Reveal><Reveal className="about-contact-card"><h3>방문 전 연락해 주세요.</h3><p>시공 중에는 매장을 비울 수 있습니다.</p><Action href="/consult">상담 신청</Action></Reveal></div></section>
  </>;
}

export function PortfolioPage() {
  const [area, setArea] = useState('전체');
  const [query, setQuery] = useState('');
  const [material, setMaterial] = useState('전체');
  const [limit, setLimit] = useState(6);
  const reduced = useReducedMotion();
  const filtered = projects.filter(project => {
    const matchesArea = area === '전체' || (area === '20평대 이하' && project.area < 30) || (area === '30평대' && project.area >= 30 && project.area < 40) || (area === '40평대' && project.area >= 40 && project.area < 50) || (area === '50평 이상' && project.area >= 50);
    return matchesArea && (material === '전체' || project.material.includes(material)) && `${project.title} ${project.region} ${project.scope}`.toLowerCase().includes(query.toLowerCase().trim());
  });
  function reset() { setArea('전체'); setQuery(''); setMaterial('전체'); setLimit(6); }
  return <><PageIntro eyebrow="PORTFOLIO" title={<span className="text-accent">시공사례</span>} description="현장별 사진, 시공 범위와 사용 벽지를 확인하세요." /><section className="section portfolio-page"><div className="container"><div className="portfolio-filters"><div className="filters" aria-label="평형별 시공사례">{areaFilters.map(item => <button className={cn('filter', area === item && 'selected')} aria-pressed={area === item} key={item} onClick={() => { setArea(item); setLimit(6); }}>{item}</button>)}</div><div className="portfolio-search-row"><div className="search-field"><Search size={18} /><input aria-label="지역 또는 아파트명 검색" value={query} onChange={event => { setQuery(event.target.value); setLimit(6); }} placeholder="지역 또는 아파트명 검색" /></div><select aria-label="벽지 종류 필터" value={material} onChange={event => { setMaterial(event.target.value); setLimit(6); }}><option value="전체">모든 벽지</option><option value="실크">실크벽지</option><option value="합지">합지벽지</option></select></div></div><div className="results-line"><p aria-live="polite">전체 <strong>{filtered.length}</strong>개의 시공사례</p><span>우리도배 공식 블로그 기준</span></div><div className="project-grid"><AnimatePresence mode="popLayout">{filtered.slice(0, limit).map((project, index) => <motion.div key={project.id} layout={!reduced} initial={false} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: .18 }}><ProjectCard project={project} delay={(index % 3) * .09} /></motion.div>)}</AnimatePresence></div>{!filtered.length && <EmptyState title="조건에 맞는 시공사례가 없습니다." description="평형이나 검색어를 바꾸어 다시 살펴보세요." onReset={reset} />}{limit < filtered.length && <div className="center-action"><button className="button button-outline" onClick={() => setLimit(previous => previous + 6)}>시공사례 더 보기 ({filtered.length - limit}) <PlusIcon /></button></div>}<p className="image-caption">사진 · 시공 정보: 우리도배 블로그</p></div></section><ConsultationBanner /></>;
}
function PlusIcon() { return <span aria-hidden="true" className="plus-text">+</span>; }

export { default as ProjectPage } from './Project';

export function StoresPage() {
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState('');
  async function copyAddress() { try { await navigator.clipboard.writeText(business.address); setCopied(true); setCopyError(''); } catch { setCopyError('주소를 선택해 복사해 주세요.'); } }
  return <><PageIntro eyebrow="VISIT" title={<span className="text-accent">매장 위치</span>} description="서울 마포구 만리재로 83. 방문 전 전화해 주세요." /><section className="section stores-section"><div className="container"><div className="store-layout"><Reveal className="store-location"><div className="map-space"><MapPin size={43} strokeWidth={1.4} /><h2>우리도배</h2><p>{business.address}</p><a href={business.map} target="_blank" rel="noopener noreferrer" className="button button-primary">네이버 지도에서 위치 보기 <Arrow diagonal /></a></div><p className="image-caption">네이버 지도로 길찾기</p></Reveal><Reveal className="store-card"><div className="store-title"><h2>우리도배</h2><span className="status-badge">매장 안내</span></div><dl className="store-details"><div><dt><MapPin size={21} />주소</dt><dd>{business.address}<button onClick={copyAddress} className="copy-button"><Copy size={14} />{copied ? '복사 완료' : '주소 복사'}</button><small aria-live="polite">{copyError}</small></dd></div><div><dt><Clock3 size={21} />영업 안내</dt><dd>{business.hours}<small>방문 전 전화 확인</small></dd></div><div><dt><Phone size={21} />전화번호</dt><dd><a href={business.telephone}>{business.phone}</a></dd></div><div><dt><TrainFront size={21} />대중교통</dt><dd>{business.directions}<small>5호선 · 6호선 · 공항철도 · 경의중앙선</small></dd></div><div><dt><Car size={21} />이용 안내</dt><dd>방문접수·출장, 예약, 주차<small>주차 및 방문 가능 시간은 전화로 확인해 주세요.</small></dd></div></dl><div className="store-map-links"><a href={business.map} target="_blank" rel="noopener noreferrer">네이버 지도 <Arrow diagonal /></a><a href={`https://map.kakao.com/?q=${encodeURIComponent(business.address)}`} target="_blank" rel="noopener noreferrer">카카오맵 <Arrow diagonal /></a></div></Reveal></div><Reveal className="visit-notice"><MessageCircle size={32} strokeWidth={1.4} /><div><h2>방문 전 연락해 주세요.</h2><p>시공 중에는 매장을 비울 수 있습니다.</p></div><Action href="/consult">방문 상담 문의</Action></Reveal></div></section><section className="visit-preparation-section"><div className="container visit-preparation-layout"><div className="visit-preparation-heading"><h2>방문 상담 준비</h2><p>상담 전에 확인해 주세요.</p></div><ul className="visit-preparation">{[{ title: '주소 · 평형', text: '전체 도배인지, 방 한 곳인지 알려주세요.' }, { title: '벽지 · 색상', text: '원하는 벽지나 참고 사진을 준비하세요.' }, { title: '현장 사진', text: '벽면 상태와 가구 배치가 보이면 됩니다.' }].map(item => <li key={item.title}><Check size={19} aria-hidden="true" /><div><h3>{item.title}</h3><p>{item.text}</p></div></li>)}</ul></div></section></>;
}

export { default as GuidePage } from './Guide';

export function ConsultPage() {
  return <><PageIntro eyebrow="CONTACT" title={<span className="text-accent">상담 신청</span>} description="시공 지역, 연락처와 희망일을 남겨주세요." /><section className="section consult-page"><div className="container"><div className="consult-contact-bar"><div><Phone size={23} /><span>전화 상담 <a href={business.telephone}>{business.phone}</a></span></div><a href="/stores">매장 위치 확인 <Arrow /></a></div><ConsultationForm full /><div className="consult-bottom-links"><p>벽지를 아직 고르지 않았다면</p><a href="/finder" className="text-link">우리 집 벽지 찾기 <Arrow /></a></div></div></section></>;
}

const finderQuestions = [
  { title: '시공할 공간', description: '시공할 공간의 유형을 선택해 주세요.', options: [{ label: '아파트', text: '전체 · 방별 도배' }, { label: '빌라 · 주택', text: '빌라 · 단독주택' }, { label: '원룸 · 오피스텔', text: '원룸 · 소형 주거 공간' }, { label: '상가 · 사무실', text: '업무 · 영업 공간' }] },
  { title: '원하는 색상', description: '가까운 색상 계열을 골라주세요.', options: [{ label: '밝고 깔끔하게', text: '화이트 계열' }, { label: '따뜻하고 포근하게', text: '크림 · 베이지 계열' }, { label: '차분하고 세련되게', text: '그레이 계열' }, { label: '함께 골라주세요', text: '상담 후 결정' }] },
  { title: '표면 질감', description: '최종 색상과 질감은 실물로 확인합니다.', options: [{ label: '깔끔한 표면', text: '매끈하고 단정한 표면' }, { label: '은은한 질감', text: '가까이서 보이는 잔잔한 결' }, { label: '입체적인 질감', text: '요철이 느껴지는 표면' }, { label: '직접 보고 고를래요', text: '실물 샘플로 결정' }] },
];
export function FinderPage() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState(['', '', new URLSearchParams(window.location.search).get('texture') || '']);
  const reduced = useReducedMotion();
  const question = finderQuestions[Math.min(step, 2)];
  return <><PageIntro eyebrow="WALLPAPER" title={<span className="text-accent">벽지 고르기</span>} description="공간, 색상, 질감을 선택하면 상담 내용에 함께 남겨드립니다." /><section className="section finder-page"><div className="container finder-layout"><aside className="finder-sidebar"><h2>우리 집 벽지 찾기</h2><ol>{['공간 선택', '분위기 선택', '질감 선택'].map((title, index) => <li key={title} className={cn(step >= index && 'active')}><span>{step > index ? <Check size={16} /> : index + 1}</span><div><strong>{title}</strong><small>{answers[index] || '선택해 주세요'}</small></div></li>)}</ol><p><MessageCircle size={19} />정하지 못한 항목은<br />상담할 때 선택하세요.</p></aside><div className="finder-content"><div className="finder-progress" aria-label={`${Math.min(step + 1, 3)} / 3단계`}>{[0, 1, 2].map(index => <span key={index} className={cn(step >= index && 'complete')} />)}</div><AnimatePresence mode="wait"><motion.div key={step} initial={reduced ? false : { opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} transition={{ duration: .15 }}>{step < 3 ? <fieldset className="finder-question"><legend>{question.title}</legend><p>{question.description}</p><div className="finder-options">{question.options.map(option => <label className={cn('finder-option', answers[step] === option.label && 'selected')} key={option.label}><input type="radio" name={`question-${step}`} value={option.label} checked={answers[step] === option.label} onChange={() => setAnswers(previous => previous.map((value, index) => index === step ? option.label : value))} /><span><strong>{option.label}</strong><small>{option.text}</small></span><span className="radio-indicator">{answers[step] === option.label && <Check size={14} />}</span></label>)}</div></fieldset> : <div className="finder-result"><CheckCircle2 size={52} strokeWidth={1.3} /><h2>선택한 조건</h2><p>아래 조건을 상담 내용에 추가합니다.</p><div className="finder-result-tags">{answers.map(answer => <span key={answer}>{answer}</span>)}</div><div className="result-guidance"><Layers size={24} /><p>최종 제품은 실물 샘플을 보고 결정해 주세요.</p></div></div>}</motion.div></AnimatePresence><div className="finder-actions">{step > 0 && <button className="button button-outline" onClick={() => setStep(previous => previous - 1)}><ChevronLeft size={18} />이전</button>}{step < 3 ? <button className="button button-primary" disabled={!answers[step]} onClick={() => setStep(previous => previous + 1)}>{step === 2 ? '결과 확인하기' : '다음으로'}<ChevronRight size={18} /></button> : <Action href={`/consult?space=${encodeURIComponent(answers[0])}&message=${encodeURIComponent(`[벽지 취향]\n${answers.join(' / ')}\n이런 분위기의 벽지를 상담하고 싶습니다.`)}`}>선택한 조건으로 상담</Action>}</div></div></div></section></>;
}

export function PrivacyPage() {
  return <><PageIntro eyebrow="PRIVACY" title="개인정보 처리 안내" description="우리도배 웹사이트의 상담 정보 처리에 대해 안내드립니다." /><section className="section"><div className="container legal-copy"><h2>1. 현재 웹사이트의 운영 상태</h2><p>현재 웹사이트는 로컬 개발 환경에서 실행됩니다. 상담 신청 내용과 첨부 사진은 실행 중인 컴퓨터의 개발 서버에 저장되며, 외부 업체로 발송되거나 실제 시공 예약이 확정되지는 않습니다.</p><h2>2. 수집하는 정보</h2><p>필수 항목은 연락처와 시공 주소입니다. 공간 유형, 희망일, 평형, 통화 가능 시간, 벽지 종류, 문의 내용, 첨부 사진은 선택 항목입니다.</p><h2>3. 이용 목적</h2><p>상담 신청 기능을 확인하고 신청 내용을 정리하는 데 사용합니다. 테스트 접수번호와 입력 내용은 신청 후 확인할 수 있습니다.</p><h2>4. 보관과 삭제</h2><p>현재 입력 정보는 사이트 관리자가 테스트를 확인하는 동안 개발 서버에 보관합니다. 검증 완료 후 관리자가 테스트 데이터를 삭제합니다. 정식 운영 전에는 실제 처리 목적과 보유기간, 관리 책임자 정보를 확정해 안내해야 합니다.</p><h2>5. 동의 거부</h2><p>개인정보 수집·이용에 동의하지 않으면 온라인 신청을 이용할 수 없습니다. 사이트의 시공사례와 가이드는 동의 여부와 관계없이 확인할 수 있으며 전화 문의도 가능합니다.</p><h2>6. 실제 상담 문의</h2><p><a href={business.telephone}>{business.phone}</a> · {business.address}</p><Action href="/consult" outline>상담 페이지로 돌아가기</Action></div></section></>;
}

export function NotFound() {
  return <section className="not-found container"><span>404</span><h1>페이지를 찾을 수 없습니다.</h1><p>주소를 다시 확인하거나 처음 화면으로 돌아가 주세요.</p><Action href="/">우리도배 홈으로</Action></section>;
}
