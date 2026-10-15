import { useState } from 'react';
import GuideCard from './GuideCard';
import { Arrow, FAQ, Photo, Reveal, SectionHeading, cn } from './components';
import { articles, blogPost, ownBlogGuides, projectPhoto } from './data';

const categories = ['전체', '비용 · 견적', '벽지 선택', '시공 준비', '관리 · 하자'];
export default function GuidePage() {
  const [filter, setFilter] = useState('전체');
  const shown = articles.filter(article => filter === '전체' || article.category === filter);
  return <div className="guide-layout container">
    <aside className="guide-sidebar"><span>도배 가이드</span><a href="#guide-top" onClick={() => setFilter('전체')}>전체보기</a><a href="#blog-guides" className="sidebar-group">우리도배 블로그</a><a href="#articles" className="sidebar-group">주제별 가이드</a>{categories.slice(1).map(topic => <a href="#articles" key={topic} className={cn(filter === topic && 'active')} onClick={() => setFilter(topic)}>{topic}</a>)}<a className="sidebar-group" href="#guide-faq">자주 묻는 질문</a></aside>
    <div className="guide-main"><Reveal as="header" className="guide-header" id="guide-top"><span className="page-eyebrow">GUIDE</span><h1><span className="text-accent">도배 가이드</span></h1><p>벽지 선택, 시공 준비와 관리 방법.</p></Reveal>
      <Reveal as="a" className="guide-feature" href="/portfolio/gongdeok-33"><Photo src={projectPhoto('gongdeok-33', 19)} label="공덕 아이파크 현장의 벽지 철거와 바탕면 작업" eager /><div><span>공덕 아이파크 · 33평</span><h2>철거부터 마감까지</h2><p>같은 현장의 시공 전·후 사진을 확인하세요.</p><span className="text-link">현장 보기 <Arrow /></span></div></Reveal>
      <Reveal as="section" className="guide-block blog-guides" id="blog-guides"><SectionHeading title="우리도배 블로그" /><div>{ownBlogGuides.map(guide => <a href={blogPost(guide.source)} key={guide.source} target="_blank" rel="noopener noreferrer"><span>{guide.category}</span><strong>{guide.title}</strong><Arrow diagonal /></a>)}</div></Reveal>
      <section className="guide-block" id="articles"><Reveal><SectionHeading title="주제별 가이드" /></Reveal><div className="filters" aria-label="글 주제">{categories.map(category => <button key={category} className={cn('filter', category === filter && 'selected')} aria-pressed={category === filter} onClick={() => setFilter(category)}>{category}</button>)}</div><p className="guide-result-count" aria-live="polite">전체 글 {shown.length}개</p><div className="article-grid">{shown.map((article, index) => <GuideCard key={article.slug} article={article} delay={(index % 3) * .09} />)}</div></section>
      <Reveal as="section" id="guide-faq" className="guide-block"><SectionHeading title="자주 묻는 질문" /><FAQ full /></Reveal>
    </div>
  </div>;
}
