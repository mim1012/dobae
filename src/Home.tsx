import { Action, Arrow, Photo, Reveal, SectionHeading, ProcessSteps, FAQ } from './components';
import { projectPhoto, materialExamples } from './data';
import { ProjectCarousel } from './ProjectCards';
import ConsultationForm from './Consultation';

export { ProjectCard } from './ProjectCards';

export function HomeProcess() {
  const stages = [{ label: '시공 전', title: '기존 벽면', photo: 6 }, { label: '밑작업', title: '벽지 철거 · 바탕면 정리', photo: 19 }, { label: '시공 후', title: '거실 도배 마감', photo: 53 }];
  return <section className="home-process section soft-background"><div className="container">
    <Reveal className="section-title-row"><SectionHeading title={<>시공 <span className="text-accent">전·후</span></>} description="공덕 아이파크 33평 · 디아망 실크 도배" /><a className="text-link" href="/portfolio/gongdeok-33">현장 전체 보기 <Arrow /></a></Reveal>
    <div className="three-columns process-preview">{stages.map((step, index) => <Reveal key={step.label} delay={index * .09}><a href="/portfolio/gongdeok-33"><Photo src={projectPhoto('gongdeok-33', step.photo)} label={'공덕 아이파크 · ' + step.title} /><span className="stage-label">{step.label}</span><h3>{step.title}</h3></a></Reveal>)}</div>
  </div></section>;
}

export function WallpaperSection() {
  return <section className="home-wallpaper section"><div className="container">
    <Reveal className="section-title-row wallpaper-heading"><SectionHeading title={<>우리 집 <span className="text-accent">벽지 고르기</span></>} description="실제 시공에 사용한 벽지의 질감을 비교해 보세요." /><Action href="/finder" outline>벽지 선택하기</Action></Reveal>
    <div className="three-columns texture-cards">{materialExamples.map((item, index) => <Reveal key={item.label} delay={index * .09}><a href={'/finder?texture=' + encodeURIComponent(item.label)} className="texture-card"><Photo src={item.room} label={item.project + ' 시공 모습'} /><div className="texture-card-info"><Photo src={item.sample} label={item.name + ' 샘플'} className="texture-photo" /><div><h3>{item.label}</h3><p>{item.name}</p></div><Arrow /></div></a></Reveal>)}</div>
    <p className="image-caption">색상과 질감은 실물 샘플로 확인해 주세요.</p>
  </div></section>;
}

export function AboutFeatures() {
  return <dl className="about-features">{[{ title: '시공 상담', text: '주소, 평형, 전체·부분 시공 여부 확인' }, { title: '벽지 선택', text: '합지·실크, 색상과 질감 상담' }, { title: '시공 준비', text: '작업 일정, 가구 이동과 보양 범위 협의' }].map(item => <div className="about-feature" key={item.title}><dt>{item.title}</dt><dd>{item.text}</dd></div>)}</dl>;
}

export function HomeAbout() {
  return <section className="home-about section"><div className="container about-preview-grid">
    <Reveal><Photo src={projectPhoto('gongdeok-33', 33)} label="공덕 아이파크 현장의 벽지 시공" /></Reveal>
    <Reveal delay={.12}><SectionHeading title={<span className="text-accent">우리도배</span>} description="서울 마포구 만리재로 83" /><AboutFeatures /><Action href="/about" outline>회사소개</Action></Reveal>
  </div></section>;
}

export function GuidePreview() {
  return <><section className="home-guide section"><div className="container"><Reveal className="section-title-row"><SectionHeading title={<span className="text-accent">시공 순서</span>} /><a className="text-link" href="/guide/process">준비사항 보기 <Arrow /></a></Reveal><ProcessSteps compact /></div></section>
    <section className="home-faq section"><div className="container"><Reveal className="faq-box"><div><h2>자주 묻는 질문</h2><a className="text-link" href="/guide">도배 가이드 <Arrow /></a></div><FAQ /></Reveal></div></section></>;
}

export function HomeConsultation() {
  return <section className="home-consultation section soft-background"><div className="container consultation-grid"><Reveal className="home-consult-copy"><h2><span className="text-accent">견적 상담</span></h2><p>시공 지역과 희망일을 남겨주세요.</p><div className="consult-photo-grid">{[{ id: 'gongdeok-33', photo: 53, label: '공덕 아이파크 거실' }, { id: 'mokdong-33', photo: 40, label: '목동 아델리체 복도' }, { id: 'guro-22', photo: 43, label: '구로 두산 침실' }, { id: 'gongdeok-33', photo: 51, label: '공덕 아이파크 벽면' }].map(item => <a key={item.label} href={'/portfolio/' + item.id}><Photo src={projectPhoto(item.id, item.photo)} label={item.label} /></a>)}</div></Reveal><Reveal><ConsultationForm /></Reveal></div></section>;
}

export default function Home() {
  return <>
    <section className="home-hero" aria-label="우리도배 실제 시공 현장"><h1 className="visually-hidden">우리도배</h1><Photo src={projectPhoto('guro-22', 49)} label="구로 두산아파트 22평 · 도배 후 거실" className="hero-photo" eager /><a href="/portfolio/guro-22" className="hero-caption">구로 두산아파트 · 22평 <Arrow /></a></section>
    <ProjectCarousel /><HomeProcess /><WallpaperSection /><HomeAbout /><GuidePreview /><HomeConsultation />
  </>;
}
