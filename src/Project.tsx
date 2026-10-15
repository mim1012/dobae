import { useState } from 'react';
import { ChevronLeft, ChevronRight, Check, Phone, Expand } from 'lucide-react';
import { Action, Arrow, Breadcrumb, ConsultationBanner, Modal, Photo, SectionHeading, cn } from './components';
import { blogPost, business, projects, type Project } from './data';
import { NotFound } from './pages';

function ProjectGallery({ project }: { project: Project }) {
  const [stage, setStage] = useState('전체');
  const [selected, setSelected] = useState<number | null>(null);
  const photos = project.gallery.filter(photo => stage === '전체' || photo.stage === stage);
  const current = selected === null ? null : photos[selected];
  const move = (direction: number) => setSelected(index => index === null ? null : (index + direction + photos.length) % photos.length);
  return <section className="project-gallery-section" aria-label="현장 사진">
    <div className="section-title-row"><SectionHeading title="사진으로 보는 현장" description="사진을 누르면 잘리지 않은 전체 사진을 크게 볼 수 있습니다." /><a className="underlined-link" href={blogPost(project.source)} target="_blank" rel="noopener noreferrer">블로그 원문 <Arrow diagonal /></a></div>
    <div className="filters" aria-label="시공 사진 단계">{['전체', ...new Set(project.gallery.map(photo => photo.stage))].map(item => <button key={item} className={cn('filter', stage === item && 'selected')} aria-pressed={stage === item} onClick={() => setStage(item)}>{item} <span>{item === '전체' ? project.gallery.length : project.gallery.filter(photo => photo.stage === item).length}</span></button>)}</div>
    <div className="portfolio-gallery">{photos.map((photo, index) => <figure key={photo.src}><button className="gallery-open" onClick={() => setSelected(index)} aria-label={`${photo.caption} 확대 보기`}><Photo src={photo.src} label={photo.alt} /><span className="gallery-expand"><Expand size={19} /></span></button><figcaption><span>{photo.stage}</span>{photo.caption}</figcaption></figure>)}</div>
    <p className="image-caption">사진 · 시공 정보: 우리도배 공식 블로그 / {project.date} 게시. 현장 기록의 사진 순서와 작업 범위를 기준으로 정리했습니다.</p>
    <Modal open={current !== null} onOpenChange={open => { if (!open) setSelected(null); }} title={project.title} description={current ? `${current.stage} · ${current.caption}` : '현장 사진 보기'} className="photo-dialog" onKeyDown={event => { if (event.key === 'ArrowLeft') { event.preventDefault(); move(-1); } if (event.key === 'ArrowRight') { event.preventDefault(); move(1); } }}>
      {current && <div>
        <div className="lightbox-image"><img src={current.src} alt={current.alt} /></div>
        <div className="lightbox-controls"><button onClick={() => move(-1)} className="icon-button" aria-label="이전 사진"><ChevronLeft /></button><p aria-live="polite">{(selected ?? 0) + 1} / {photos.length}</p><button onClick={() => move(1)} className="icon-button" aria-label="다음 사진"><ChevronRight /></button></div>
      </div>}
    </Modal>
  </section>;
}

export default function ProjectPage({ slug }: { slug: string }) {
  const [tab, setTab] = useState('시공 내용');
  const project = projects.find(item => item.id === slug);
  if (!project) return <NotFound />;
  const consultation = `/consult?space=${encodeURIComponent(project.space)}&message=${encodeURIComponent(`${project.title} (${project.scope}) 시공사례를 보고 문의합니다.`)}`;
  const secondPhoto = project.gallery.find(photo => photo.src !== project.cover && photo.stage === '시공 후') || project.gallery.find(photo => photo.src !== project.cover && photo.stage === '작업 과정') || project.gallery[0];
  return <>
    <div className="container"><Breadcrumb items={[{ href: '/portfolio', label: '시공사례' }, { label: project.title }]} /></div>
    <section className="project-detail-intro"><div className="container"><span className="page-eyebrow">{project.region} · {project.area}평 · {project.status}</span><h1>{project.title}</h1><p>{project.scope}</p></div></section>
    <section className="section project-detail"><div className="container">
      <div className="detail-photo-pair"><Photo src={project.cover} label={`${project.title} · ${project.scope}`} eager /><Photo src={secondPhoto.src} label={secondPhoto.caption} eager /></div>
      <div className="project-detail-grid"><div>
        <div className="detail-tabs" role="group" aria-label="시공사례 내용 선택">{['시공 내용', '진행 과정', '상담 체크'].map(item => <button key={item} aria-pressed={tab === item} className={cn(tab === item && 'selected')} onClick={() => setTab(item)}>{item}</button>)}</div>
        <div className="detail-tab-content" aria-live="polite">
          {tab === '시공 내용' ? <><h2>이 현장은 이렇게 시공했습니다.</h2><p>{project.description}</p><dl className="project-specs"><div><dt>위치</dt><dd>{project.region}</dd></div><div><dt>아파트 평형</dt><dd>{project.area}평</dd></div><div><dt>실제 작업 범위</dt><dd>{project.scope}</dd></div><div><dt>벽지</dt><dd>{project.product}</dd></div><div><dt>기록 상태</dt><dd>{project.status}</dd></div><div><dt>블로그 게시일</dt><dd>{project.date}</dd></div></dl><a href={blogPost(project.source)} target="_blank" rel="noopener noreferrer" className="text-link">우리도배 블로그에서 전체 기록 보기 <Arrow diagonal /></a>{project.related && <a className="related-post-link" href={blogPost(project.related)} target="_blank" rel="noopener noreferrer">같은 현장의 다른 시공 기록 <Arrow diagonal /></a>}</>
            : tab === '진행 과정' ? <><h2>블로그에 기록된 작업 과정</h2><ol className="detail-process-list">{project.notes.map(note => <li key={note.title}><strong>{note.title}</strong><p>{note.text}</p></li>)}</ol><a href="#project-photos" className="text-link">현장 사진 함께 보기 <Arrow /></a></>
              : <><h2>이런 내용을 함께 알려주세요.</h2><ul className="check-list">{['시공할 주소와 평형', '전체 도배인지, 일부 공간만 바꿀지', '공실 여부와 이동할 가구', '원하는 벽지와 분위기', '희망 시공일과 이사 일정'].map(item => <li key={item}><Check size={18} />{item}</li>)}</ul><Action href={consultation}>이 사례로 상담하기</Action></>}
        </div>
      </div><aside className="project-detail-aside"><span>마음에 드는 시공인가요?</span><h3>우리 집에도<br />이런 느낌으로.</h3><p>시공사례 이름과 작업 범위를<br />상담 내용에 함께 담아드릴게요.</p><Action href={consultation}>이 사례로 상담하기</Action><a href={business.telephone} className="text-link"><Phone size={17} />{business.phone}</a></aside></div>
      <div id="project-photos"><ProjectGallery project={project} /></div>
      <div className="detail-bottom"><a href="/portfolio" className="text-link"><ChevronLeft size={18} />시공사례 목록으로</a><a href={blogPost(project.source)} className="text-link" target="_blank" rel="noopener noreferrer">블로그 원문 <Arrow diagonal /></a></div>
    </div></section><ConsultationBanner />
  </>;
}
