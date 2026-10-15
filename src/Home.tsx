import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { MessageCircle, Layers, ClipboardCheck, ChevronRight } from 'lucide-react';
import { Action, Arrow, Photo, Reveal, SectionHeading, ProcessSteps, FAQ, cn, EmptyState } from './components';
import { featuredProjects, projectPhoto, materialExamples, spaceFilters, type Project } from './data';
import ConsultationForm from './Consultation';

export function ProjectCard({ project }: { project: Project }) {
  return <a className="project-card" href={`/portfolio/${project.id}`}>
    <div className="project-photo"><Photo src={project.cover} label={`${project.title} · ${project.scope}`} /><span className="project-status">{project.status}</span><span className="project-photo-tag">{project.region} · {project.area}평</span><span className="project-photo-arrow"><Arrow /></span></div>
    <div className="project-card-copy"><div><h3>{project.title}</h3><p>{project.scope}</p></div><Arrow /></div>
  </a>;
}
export function HomePortfolio() {
  const [filter, setFilter] = useState('전체');
  const list = featuredProjects.filter(project => filter === '전체' || project.space === filter);
  return <section className="home-portfolio section"><div className="container">
    <Reveal><div className="section-title-row"><SectionHeading title="우리 집과 비슷한 시공사례" description="공간과 시공 범위를 비교하며 살펴보세요." /><a className="underlined-link" href="/portfolio">전체 시공사례 보기 <Arrow /></a></div>
      <div className="filters" aria-label="공간 유형">{spaceFilters.map(item => <button key={item} className={cn('filter', item === filter && 'selected')} aria-pressed={item === filter} onClick={() => setFilter(item)}>{item}</button>)}</div></Reveal>
    <div className="project-grid"><AnimatePresence mode="popLayout">{list.map(project => <motion.div key={project.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: .18 }}><ProjectCard project={project} /></motion.div>)}</AnimatePresence></div>
    {!list.length && <EmptyState title="등록된 시공사례를 준비하고 있습니다." description="다른 공간의 시공사례를 먼저 살펴보세요." onReset={() => setFilter('전체')} />}
    <p className="image-caption">우리도배 공식 블로그에 기록된 실제 현장입니다.</p>
    <Reveal className="case-consult-banner"><h3>마음에 드는 사례가 있나요?</h3><Action href="/consult">이런 느낌으로 상담하기</Action></Reveal>
  </div></section>;
}
export function HomeProcess() {
  const stages = [{ label: '시공 전', title: '기존 벽면 상태 확인', photo: 6 }, { label: '밑작업', title: '벽지 철거와 바탕면 정리', photo: 19 }, { label: '시공 후', title: '거실 벽면과 천장 마감', photo: 53 }];
  return <section className="home-process section soft-background"><div className="container">
    <Reveal><SectionHeading centered eyebrow="공덕 아이파크 · 실제 시공 과정" title={<>완성된 모습만큼,<br />시공 과정도 살펴보세요.</>} description="같은 현장의 시공 전 상태부터 밑작업, 마감까지 확인해 보세요." /></Reveal>
    <div className="three-columns process-preview">{stages.map((step, index) => <Reveal key={step.label} delay={index * .04}><a href="/portfolio/gongdeok-33"><Photo src={projectPhoto('gongdeok-33', step.photo)} label={`공덕 아이파크 · ${step.title}`} /><span className="stage-label">{step.label}</span><h3>{step.title}</h3></a></Reveal>)}</div>
    <Reveal className="center-action"><Action href="/portfolio/gongdeok-33">이 현장 자세히 보기</Action></Reveal>
  </div></section>;
}
export function WallpaperSection() {
  return <section className="home-wallpaper section"><div className="container wallpaper-grid">
    <Reveal className="wallpaper-copy"><h2>벽지 선택이 어렵다면,<br />취향부터 알려주세요.</h2><p>원하는 분위기와 질감을 선택하면<br />상담에 필요한 내용을 정리해 드립니다.</p><div className="finder-flow"><span>공간 선택</span><Arrow /><span>취향 확인</span><Arrow /><span>상담 연결</span></div><Action href="/finder">우리 집 벽지 찾기</Action></Reveal>
    <Reveal className="wallpaper-panel"><div className="three-columns texture-cards">{materialExamples.map(item => <a href={`/finder?texture=${encodeURIComponent(item.label)}`} key={item.label} className="texture-card"><Photo src={item.room} label={`${item.project} 시공 모습`} /><Photo src={item.sample} label={`${item.name} · 원문에 소개된 자재 샘플`} className="texture-photo" /><h3>{item.label}<small>{item.name}</small></h3></a>)}</div><p className="wallpaper-help"><MessageCircle size={19} />실제 시공에 사용한 벽지입니다. 최종 색상과 질감은 실물로 확인해 주세요.</p></Reveal>
  </div></section>;
}
export function AboutFeatures() {
  return <div className="about-features">{[{ icon: MessageCircle, title: '공간에 맞는 상담', text: '시공할 공간과 원하는 변화를 알려주세요.' }, { icon: Layers, title: '자재와 범위 확인', text: '벽지 종류와 필요한 작업 범위를 정리합니다.' }, { icon: ClipboardCheck, title: '시공 전 준비 안내', text: '일정과 현장 조건에 맞춰 준비 사항을 확인합니다.' }].map(item => <div className="about-feature" key={item.title}><span className="feature-icon"><item.icon size={32} strokeWidth={1.5} /></span><div><h3>{item.title}</h3><p>{item.text}</p></div></div>)}</div>;
}
export function HomeAbout() {
  return <section className="home-about section"><div className="container"><Reveal><SectionHeading centered eyebrow="우리도배 소개" title={<>어떤 공간인지 듣고,<br />필요한 시공을 함께 정리합니다.</>} /></Reveal><div className="about-preview-grid"><Reveal><Photo src={projectPhoto('gongdeok-33', 33)} label="공덕 아이파크 현장에서 벽지를 붙이는 작업 모습" /><p className="image-caption">공덕 아이파크 현장 · 우리도배 블로그 시공 기록</p></Reveal><Reveal><AboutFeatures /><Action href="/about" outline>우리도배 자세히 보기</Action></Reveal></div></div></section>;
}
export function GuidePreview() {
  return <><section className="home-guide section soft-background"><div className="container"><Reveal><SectionHeading centered title="상담부터 시공까지, 이렇게 진행돼요." description="처음 문의하시는 분도 쉽게 이해할 수 있도록, 시공 과정을 단계별로 안내드립니다." /></Reveal><ProcessSteps /></div></section><section className="home-faq section"><div className="container"><Reveal className="faq-box"><div><h2>자주 묻는 질문</h2><p>시공을 준비하시는 분들이<br />자주 궁금해하시는 내용을 모았습니다.</p><a className="text-link" href="/guide">도배 가이드 전체 보기 <Arrow /></a></div><FAQ /></Reveal></div></section></>;
}
export function HomeConsultation() {
  return <section className="home-consultation section soft-background"><div className="container consultation-grid"><Reveal className="home-consult-copy"><h2>시공할 공간과<br />희망 일정을 알려주세요.</h2><p>입력하신 내용을 확인한 뒤<br />견적 상담을 진행합니다.</p><span>현장 사진을 함께 보내주시면 상담에 도움이 됩니다.</span><div className="consult-photo-grid">{[{ id: 'gongdeok-33', photo: 53, label: '공덕 아이파크 거실' }, { id: 'mokdong-33', photo: 40, label: '목동 아델리체 복도' }, { id: 'guro-22', photo: 43, label: '구로 두산 침실' }, { id: 'gongdeok-33', photo: 51, label: '공덕 아이파크 벽면' }].map(item => <a key={item.label} href={`/portfolio/${item.id}`}><Photo src={projectPhoto(item.id, item.photo)} label={item.label} /></a>)}</div><p className="image-caption">사진을 누르면 해당 현장의 시공사례로 이동합니다.</p></Reveal><Reveal><ConsultationForm /></Reveal></div></section>;
}
export default function Home() {
  return <>
    <section className="home-hero" aria-label="우리도배 실제 시공 현장"><Photo src={projectPhoto('guro-22', 49)} label="우리도배 구로 두산아파트 22평 · 디아 회벽 화이트 시공 후 거실" className="hero-photo" eager /><a href="/portfolio/guro-22" className="hero-caption">구로 두산아파트 22평 · 실제 시공사례 <Arrow /></a></section>
    <section className="home-intro soft-background"><div className="container home-intro-inner"><Reveal><h1>우리 집 도배,<br />실제 시공부터 살펴보세요.</h1><p>원하는 벽지와 시공 범위를 편하게 상담하세요.</p></Reveal><div className="home-intro-buttons"><a className="button button-outline" href="/portfolio">시공사례 보기 <ChevronRight size={21} /></a><a className="button button-primary" href="/consult">견적 상담 <ChevronRight size={21} /></a></div></div></section>
    <HomePortfolio /><HomeProcess /><WallpaperSection /><HomeAbout /><GuidePreview /><HomeConsultation />
  </>;
}
