import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'motion/react';
import { ArrowLeft, ArrowRight, Pause, Play } from 'lucide-react';
import { Arrow, Photo, Reveal } from './components';
import { projects, projectPhoto, type Project } from './data';

const previewPhotos: Record<string, number[]> = {
  'gongdeok-33': [36, 45],
  'guro-22': [43, 45],
  'mokdong-33': [36, 46],
  'bundang-50': [93, 97],
  'daeheung-33': [11, 12],
  'sinwol-30': [50, 65],
  'yeomchang-32': [19, 23],
};

export function ProjectCard({ project, delay = 0 }: { project: Project; delay?: number }) {
  const [selected, setSelected] = useState(0);
  const cover = project.gallery.find(photo => photo.src === project.cover) ?? project.gallery[0];
  const previewSources = previewPhotos[project.id]?.map(index => projectPhoto(project.id, index));
  const otherPhotos = project.gallery.filter(photo => photo.src !== cover.src && (previewSources ? previewSources.includes(photo.src) : photo.stage === cover.stage));
  const photos = [cover, ...otherPhotos.slice(0, 2)];
  const photo = photos[selected];
  return <Reveal as="article" className="project-card" aria-label={project.title} delay={delay}>
    <a className="project-photo" href={`/portfolio/${project.id}`} aria-label={`${project.title} 시공사례 자세히 보기`}>
      <Photo src={photo.src} label={photo.alt} />
      <span className="project-photo-tag">{project.region.replace('서울 ', '').replace('경기 ', '')} · {project.area}평</span>
      <span className="project-photo-count" aria-label={`대표 사진 ${photos.length}장 중 ${selected + 1}번째`}>{selected + 1} / {photos.length}</span>
    </a>
    <div className="project-thumbnails" role="group" aria-label={`${project.title} 대표 사진 선택`}>
      {photos.map((item, index) => <button type="button" key={item.src} aria-label={`${project.title} 사진 ${index + 1} 선택`} aria-pressed={selected === index} onClick={() => setSelected(index)}><img src={item.src} alt="" loading="lazy" decoding="async" /></button>)}
    </div>
    <div className="project-card-copy"><div><h3><a href={`/portfolio/${project.id}`}>{project.title}<Arrow /></a></h3><p>{project.product}</p><p className="project-scope">{project.scope}{project.status === '공정 기록' ? ' · 공정 기록' : ''}</p></div></div>
  </Reveal>;
}

const featuredOrder = ['gongdeok-33', 'guro-22', 'mokdong-33', 'bundang-50', 'daeheung-33', 'sinwol-30', 'yeomchang-32'];
const homeProjects = featuredOrder.map(id => projects.find(project => project.id === id)!).filter(Boolean);

function scrollProject(element: HTMLDivElement, direction: number, reduced: boolean | null, loop = false) {
  const cards = element.querySelectorAll<HTMLElement>('.project-card');
  const distance = cards.length > 1 ? cards[1].offsetLeft - cards[0].offsetLeft : element.clientWidth;
  const atEnd = element.scrollLeft + element.clientWidth >= element.scrollWidth - 4;
  if (loop && atEnd) element.scrollTo({ left: 0, behavior: 'instant' });
  else element.scrollBy({ left: direction * distance, behavior: reduced ? 'instant' : 'smooth' });
}

export function ProjectCarousel() {
  const track = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const [edges, setEdges] = useState({ first: true, last: false });
  const [paused, setPaused] = useState<boolean | null>(null);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [visible, setVisible] = useState(false);
  const [pageVisible, setPageVisible] = useState(!document.hidden);
  const autoplay = !(paused ?? reduced);
  useEffect(() => {
    const element = track.current;
    if (!element) return;
    const update = () => setEdges({ first: element.scrollLeft < 4, last: element.scrollLeft + element.clientWidth >= element.scrollWidth - 4 });
    update();
    element.addEventListener('scroll', update, { passive: true });
    const observer = new ResizeObserver(update);
    observer.observe(element);
    const intersection = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: .15 });
    intersection.observe(element);
    const onVisibility = () => setPageVisible(!document.hidden);
    document.addEventListener('visibilitychange', onVisibility);
    return () => { element.removeEventListener('scroll', update); observer.disconnect(); intersection.disconnect(); document.removeEventListener('visibilitychange', onVisibility); };
  }, []);
  useEffect(() => {
    if (!autoplay || hovered || focused || dragging || !visible || !pageVisible) return;
    const timer = window.setInterval(() => {
      if (track.current) scrollProject(track.current, 1, reduced, true);
    }, 4500);
    return () => window.clearInterval(timer);
  }, [autoplay, hovered, focused, dragging, visible, pageVisible, reduced]);
  function move(direction: number) {
    setPaused(true);
    if (track.current) scrollProject(track.current, direction, reduced);
  }
  return <section className="home-portfolio section" aria-labelledby="home-projects-title">
    <div className="container">
      <Reveal className="project-section-header">
        <div><h2 id="home-projects-title"><span className="text-accent">시공사례</span></h2><p>지역과 평형, 사용한 벽지를 확인하세요.</p></div>
        <div className="project-section-actions"><a className="text-link" href="/portfolio">전체 보기 <Arrow /></a><div className="carousel-controls"><button onClick={() => setPaused(autoplay)} aria-label={autoplay ? '시공사례 자동 넘김 일시정지' : '시공사례 자동 넘김 재생'} aria-controls="home-projects-track">{autoplay ? <Pause size={18} /> : <Play size={18} />}</button><button onClick={() => move(-1)} disabled={edges.first} aria-label="이전 시공사례" aria-controls="home-projects-track"><ArrowLeft size={22} /></button><button onClick={() => move(1)} disabled={edges.last} aria-label="다음 시공사례" aria-controls="home-projects-track"><ArrowRight size={22} /></button></div></div>
      </Reveal>
      <div id="home-projects-track" className="project-carousel" ref={track} tabIndex={0} role="region" aria-label="우리도배 시공사례 사진 슬라이드"
        onPointerEnter={event => { if (event.pointerType === 'mouse') setHovered(true); }} onPointerLeave={() => { setHovered(false); setDragging(false); }}
        onPointerDown={() => setDragging(true)} onPointerUp={() => setDragging(false)} onPointerCancel={() => setDragging(false)}
        onFocusCapture={() => setFocused(true)} onBlurCapture={event => { if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false); }}
        onKeyDown={event => {
        if (event.target !== event.currentTarget) return;
        if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') { event.preventDefault(); move(event.key === 'ArrowRight' ? 1 : -1); }
      }}>{homeProjects.map((project, index) => <ProjectCard key={project.id} project={project} delay={(index % 3) * .09} />)}</div>
    </div>
  </section>;
}
