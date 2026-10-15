import { useEffect } from 'react';
import { MotionConfig } from 'motion/react';
import { SiteLayout } from './components';
import Home from './Home';
import ArticlePage from './Article';
import { AboutPage, PortfolioPage, ProjectPage, StoresPage, GuidePage, ConsultPage, FinderPage, PrivacyPage, NotFound } from './pages';

export default function Site() {
  const path = window.location.pathname.replace(/\/+$/, '') || '/';
  const titles: Record<string, string> = { '/': '우리 집에 맞는 도배', '/about': '회사소개', '/portfolio': '시공사례', '/stores': '매장위치', '/guide': '도배 가이드', '/consult': '상담신청', '/finder': '우리 집 벽지 찾기', '/privacy': '개인정보 처리 안내' };
  useEffect(() => { document.title = `${titles[path] || (path.startsWith('/portfolio/') ? '시공사례 상세' : path.startsWith('/guide/') ? '도배 가이드' : '페이지 안내')} | 우리도배`; }, [path]);
  const pages: Record<string, React.ReactNode> = { '/': <Home />, '/about': <AboutPage />, '/portfolio': <PortfolioPage />, '/stores': <StoresPage />, '/guide': <GuidePage />, '/consult': <ConsultPage />, '/finder': <FinderPage />, '/privacy': <PrivacyPage /> };
  const content = pages[path] || (path.startsWith('/portfolio/') ? <ProjectPage slug={path.slice(11)} /> : path.startsWith('/guide/') ? <ArticlePage slug={path.slice(7)} /> : <NotFound />);
  return <MotionConfig reducedMotion="user"><SiteLayout>{content}</SiteLayout></MotionConfig>;
}
