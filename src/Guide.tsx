import { useState } from 'react';
import { BookOpen } from 'lucide-react';
import { Action, Arrow, FAQ, Photo, SectionHeading, cn } from './components';
import { articles, blogPost, ownBlogGuides, projectPhoto } from './data';

const categories = ['전체', '비용 · 견적', '벽지 선택', '시공 준비', '관리 · 하자'];
export default function GuidePage() {
  const [filter, setFilter] = useState('전체');
  const shown = articles.filter(article => filter === '전체' || article.category === filter);
  return <div className="guide-layout container">
    <aside className="guide-sidebar"><span>도배 가이드</span><a href="#guide-top" onClick={() => setFilter('전체')}>전체보기</a><a href="#blog-guides" className="sidebar-group">우리도배 블로그</a><a href="#articles" className="sidebar-group">주제별 가이드</a>{categories.slice(1).map(topic => <a href="#articles" key={topic} className={cn(filter === topic && 'active')} onClick={() => setFilter(topic)}>{topic}</a>)}<a className="sidebar-group" href="#guide-faq">자주 묻는 질문</a><p>우리도배의 시공 기록과 함께<br />도배 준비를 시작해 보세요.</p></aside>
    <div className="guide-main"><header className="guide-header" id="guide-top"><span className="page-eyebrow">GUIDE</span><h1>도배, 알고 시작하면 쉽습니다.</h1><p>벽지 선택부터 밑작업, 시공 후 관리까지.<br />우리도배의 현장 기록과 안내를 확인해 보세요.</p></header>
      <a className="guide-feature" href="/portfolio/gongdeok-33"><Photo src={projectPhoto('gongdeok-33', 19)} label="공덕 아이파크 현장의 벽지 철거와 바탕면 작업" eager /><div><span>현장에서 보는 도배</span><h2>완성 전의 과정도<br />살펴보세요.</h2><p>공덕 아이파크의 벽지 철거부터<br />초배와 마감까지, 실제 현장 기록.</p><span className="text-link">시공 과정 살펴보기 <Arrow /></span></div></a>
      <section className="guide-block blog-guides" id="blog-guides"><SectionHeading eyebrow="우리도배 블로그" title="시공 전에 함께 읽어보세요." description="우리도배가 직접 정리한 시공 준비와 견적 안내입니다." /><div>{ownBlogGuides.map(guide => <a href={blogPost(guide.source)} key={guide.source} target="_blank" rel="noopener noreferrer"><span>{guide.category}</span><strong>{guide.title}</strong><Arrow diagonal /></a>)}</div></section>
      <section className="guide-block" id="articles"><SectionHeading eyebrow="READ GUIDE" title="주제별 도배 가이드" description="처음 준비하는 도배, 궁금한 것부터 차근차근 확인하세요." /><div className="filters" aria-label="글 주제">{categories.map(category => <button key={category} className={cn('filter', category === filter && 'selected')} aria-pressed={category === filter} onClick={() => setFilter(category)}>{category}</button>)}</div><p className="guide-result-count" aria-live="polite">전체 글 {shown.length}개</p><div className="article-grid">{shown.map(article => <a key={article.slug} href={`/guide/${article.slug}`} className="article-card"><div className="article-cover"><span>{article.category}</span><strong>{article.kicker}</strong><BookOpen size={27} strokeWidth={1.3} /></div><div className="article-card-copy"><span className="article-category">{article.category} · {article.duration}</span><h3>{article.title}</h3><p>{article.description}</p><span className="text-link">자세히 읽기 <Arrow /></span></div></a>)}</div></section>
      <section id="guide-faq" className="guide-block"><SectionHeading title="자주 묻는 질문" /><FAQ full /></section><div className="guide-finder-banner"><h2>우리 집에 맞는 벽지를 찾아보세요.</h2><p>원하는 분위기를 고르고 상담에 필요한 내용을 정리할 수 있습니다.</p><Action href="/finder">우리 집 벽지 찾기</Action></div>
    </div>
  </div>;
}
