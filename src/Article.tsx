import type { ReactNode } from 'react';
import { Check, Info, ArrowLeft } from 'lucide-react';
import { Arrow, Breadcrumb, Photo, ProcessSteps, Reveal, SectionHeading } from './components';
import { articles, blogPost, projectPhoto } from './data';
import GuideCard from './GuideCard';
import { NotFound } from './pages';

type GuideSection = { id: string; title: string; content: ReactNode };
type GuideContent = {
  sections: GuideSection[];
  notice: string;
  source?: { href: string; label: string };
};

function GuideChecks({ items }: { items: string[] }) {
  return <ul className="check-list">{items.map(text => <li key={text}><Check size={18} aria-hidden="true" />{text}</li>)}</ul>;
}

function GuideRows({ items }: { items: { title: string; text: string }[] }) {
  return <dl className="guide-detail-rows">{items.map(item => <div key={item.title}><dt>{item.title}</dt><dd>{item.text}</dd></div>)}</dl>;
}

const contentBySlug: Record<string, GuideContent> = {
  'hapji-silk': {
    sections: [
      {
        id: 'material', title: '소재 비교', content: <>
          <p>합지는 종이 바탕, 실크는 표면 코팅층이 있는 벽지입니다.</p>
          <div className="material-comparison">
            <div><Photo src={projectPhoto('daeheung-33', 5)} label="대흥 태영 현장에 사용한 개나리 광폭 합지 샘플" /><h3>합지벽지</h3><p>종이 질감 · 물과 마찰에 주의</p></div>
            <div><Photo src={projectPhoto('gongdeok-33', 5)} label="공덕 아이파크 현장에 사용한 LX 디아망 실크벽지 샘플" /><h3>실크벽지</h3><p>코팅된 표면 · 제품별 청소 방법 확인</p></div>
          </div>
        </>,
      },
      {
        id: 'finish', title: '이음매와 관리', content: <>
          <p>자재·시공 방식·조명에 따라 이음매가 보이는 정도는 달라집니다.</p>
          <div className="table-scroll"><table><caption className="visually-hidden">합지벽지와 실크벽지 비교</caption><thead><tr><th scope="col">확인할 부분</th><th scope="col">합지</th><th scope="col">실크</th></tr></thead><tbody><tr><th scope="row">표면</th><td>종이 바탕의 질감</td><td>코팅층과 다양한 표면 표현</td></tr><tr><th scope="row">이음매</th><td>겹침 방식이 일반적</td><td>맞댐 방식이 일반적</td></tr><tr><th scope="row">관리</th><td>물과 마찰에 주의</td><td>제품별 청소 지침 확인</td></tr></tbody></table></div>
        </>,
      },
      {
        id: 'check', title: '선택 전 확인', content: <GuideChecks items={['집에 들어오는 빛과 조명의 색', '바닥, 문틀, 가구와 어울리는 색상', '손이 자주 닿거나 오염되기 쉬운 공간인지', '시공 범위와 예산 안에서 가능한 제품']} />,
      },
    ],
    notice: '화면과 실물의 색상은 다를 수 있습니다. 최종 선택은 샘플북으로 확인해 주세요.',
  },
  process: {
    sections: [
      { id: 'sequence', title: '시공 순서', content: <ProcessSteps /> },
      {
        id: 'prepare', title: '시공 전 준비', content: <GuideRows items={[
          { title: '주소와 시공 범위', text: '주소, 평형, 전체·부분 도배 여부와 현장 사진' },
          { title: '자재와 밑작업', text: '벽지 종류, 천장 포함 여부, 철거·보수·보양 범위' },
          { title: '일정과 가구', text: '이사·다른 공사와 일정 조율. 작은 짐은 정리하고 큰 가구는 이동 범위를 협의합니다.' },
        ]} />,
      },
      { id: 'finish', title: '시공 후 확인', content: <GuideChecks items={['벽면과 이음매의 마감 상태', '문틀, 몰딩과 모서리 주변', '건조·환기 방법과 문의 연락처']} /> },
    ],
    notice: '온라인 희망일 입력만으로 예약이 확정되지는 않습니다. 상담 후 작업 일정을 정합니다.',
  },
  defect: {
    sections: [
      {
        id: 'drying', title: '건조 중 관리', content: <p>건조 중에는 표면이 일시적으로 달라 보일 수 있습니다. 임의로 누르거나 열을 가하지 말고, 안내받은 건조·환기 방법을 지켜주세요.</p>,
      },
      {
        id: 'condition', title: '상태 점검', content: <GuideRows items={[
          { title: '이음매 벌어짐', text: '벽 전체와 벌어진 부분을 가까이 찍어 남겨주세요.' },
          { title: '찢어짐·들뜸', text: '발견한 날짜와 위치를 기록하고, 직접 보수하기 전에 문의하세요.' },
          { title: '모서리 마감', text: '문틀·몰딩·모서리의 상태가 보이도록 사진을 찍어주세요.' },
          { title: '습기·얼룩 반복', text: '결로·누수 등 벽면 원인과 추가 점검 필요 여부를 확인하세요.' },
        ]} />,
      },
      {
        id: 'contact', title: '문의 전 준비', content: <><GuideChecks items={['시공한 주소와 시공일', '발견한 날짜와 이후의 변화', '문제가 보이는 벽 전체 사진', '조명과 각도를 바꿔 찍은 가까운 사진']} /><p>사진과 현장 상태를 확인한 뒤 필요한 점검과 처리 방법을 안내합니다.</p></>,
      },
    ],
    notice: '건조 시간은 온도, 습도, 자재와 바탕면에 따라 다릅니다. 상태가 계속된다면 시공 담당자에게 확인해 주세요.',
  },
  estimate: {
    sections: [
      {
        id: 'scope', title: '시공 범위', content: <>
          <GuideRows items={[
            { title: '시공 공간', text: '평형, 전체·부분 도배 여부' },
            { title: '벽지 종류', text: '합지·실크, 제품명과 색상' },
          ]} />
        </>,
      },
      {
        id: 'conditions', title: '작업 조건', content: <GuideRows items={[
          { title: '벽면 상태', text: '기존 벽지 철거, 균열 보수, 습기·오염 여부' },
          { title: '현장 조건', text: '거주 여부, 가구 이동, 주차와 자재 반입' },
          { title: '작업 일정', text: '희망일과 다른 공사가 겹치는 일정' },
        ]} />,
      },
      { id: 'check', title: '견적서 확인', content: <GuideChecks items={['선택한 벽지 제품과 도배 범위', '철거·보수·가구 이동 포함 여부', '천장·보양·마무리 작업 범위', '추가 비용 발생 조건과 협의 방법']} /> },
    ],
    notice: '정확한 금액은 현장 상태와 작업 범위를 확인한 뒤 안내합니다.',
    source: { href: blogPost('224413797427'), label: '블로그 견적 안내' },
  },
};

export default function ArticlePage({ slug }: { slug: string }) {
  const article = articles.find(item => item.slug === slug);
  const guide = contentBySlug[slug];
  if (!article || !guide) return <NotFound />;
  return <>
    <div className="container article-container">
      <Breadcrumb items={[{ href: '/guide', label: '도배 가이드' }, { label: article.category }]} />
      <Reveal as="header" className="article-header"><span className="page-eyebrow">{article.category}</span><h1>{article.title}</h1><p>{article.description}</p></Reveal>
      <div className="article-layout">
        <nav className="article-toc" aria-label="가이드 목차"><ol>{guide.sections.map(section => <li key={section.id}><a href={`#${section.id}`}>{section.title}</a></li>)}</ol></nav>
        <article className="article-body">
          {guide.sections.map((section, index) => <Reveal as="section" key={section.id} id={section.id} className="guide-article-section" aria-labelledby={`heading-${section.id}`}><header><span>{String(index + 1).padStart(2, '0')}</span><h2 id={`heading-${section.id}`}>{section.title}</h2></header><div className="guide-section-content">{section.content}</div></Reveal>)}
          <aside className="article-callout" aria-label="참고사항"><Info size={21} aria-hidden="true" /><p>{guide.notice}</p></aside>
          {guide.source && <a className="article-source text-link" href={guide.source.href} target="_blank" rel="noopener noreferrer">{guide.source.label}<Arrow diagonal /></a>}
        </article>
      </div>
      <div className="article-footer"><a href="/guide#articles" className="text-link"><ArrowLeft size={18} />주제별 가이드</a></div>
      <section className="related-articles"><Reveal><SectionHeading title="다른 주제 보기" /></Reveal><div className="article-grid">{articles.filter(item => item.slug !== slug).map((item, index) => <GuideCard key={item.slug} article={item} delay={index * .09} />)}</div></section>
    </div>
  </>;
}
