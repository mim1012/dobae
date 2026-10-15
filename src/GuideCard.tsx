import { Arrow, Reveal } from './components';
import type { articles } from './data';

export default function GuideCard({ article, delay = 0 }: { article: (typeof articles)[number]; delay?: number }) {
  return <Reveal as="a" href={`/guide/${article.slug}`} className="article-card" delay={delay}>
    <div className="article-card-copy">
      <span className="article-category">{article.category}</span>
      <h3>{article.title}</h3>
      <p>{article.description}</p>
      <span className="text-link">가이드 보기 <Arrow /></span>
    </div>
  </Reveal>;
}
