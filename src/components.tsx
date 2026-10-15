import { useState, type ReactNode, type KeyboardEventHandler } from 'react';
import { motion, useReducedMotion, useScroll, useSpring, useMotionValueEvent } from 'motion/react';
import * as Dialog from '@radix-ui/react-dialog';
import { ArrowRight, ArrowUpRight, ArrowUp, ChevronRight, MessageCircle, Layers, ClipboardCheck, CalendarDays, House, Menu, X, Plus, Phone } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { business, navigation, steps, faqs } from './data';

export const cn = (...values: ClassValue[]) => twMerge(clsx(values));
export function Arrow({ diagonal = false }: { diagonal?: boolean }) { return diagonal ? <ArrowUpRight aria-hidden="true" size={21} /> : <ArrowRight aria-hidden="true" size={21} />; }
export function Reveal({ children, className = '', delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const reduced = useReducedMotion();
  return <motion.div className={className} initial={reduced ? false : { opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.04 }} transition={{ duration: .2, delay, ease: 'easeOut' }}>{children}</motion.div>;
}
export function Photo({ src, label, className = '', eager = false }: { src: string; label: string; className?: string; eager?: boolean }) {
  return <div className={cn('photo-space', className)}><img src={src} alt={label} loading={eager ? 'eager' : 'lazy'} decoding="async" fetchPriority={eager ? 'high' : undefined} /></div>;
}
export function Action({ href, children, outline = false, className = '', external = false }: { href: string; children: ReactNode; outline?: boolean; className?: string; external?: boolean }) {
  return <a href={href} className={cn('button', outline ? 'button-outline' : 'button-primary', className)} {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>{children}<Arrow /></a>;
}
export function Modal({ open, onOpenChange, title, description, children, className, onKeyDown }: { open: boolean; onOpenChange: (open: boolean) => void; title: string; description: string; children: ReactNode; className?: string; onKeyDown?: KeyboardEventHandler<HTMLDivElement> }) {
  return <Dialog.Root open={open} onOpenChange={onOpenChange}><Dialog.Portal><Dialog.Overlay className="dialog-overlay" /><Dialog.Content className={cn('dialog-content', className)} onKeyDown={onKeyDown}><div className="dialog-heading"><div><Dialog.Title>{title}</Dialog.Title><Dialog.Description>{description}</Dialog.Description></div><Dialog.Close className="icon-button" aria-label="창 닫기"><X /></Dialog.Close></div>{children}</Dialog.Content></Dialog.Portal></Dialog.Root>;
}
export function SiteLayout({ children }: { children: ReactNode }) {
  const path = window.location.pathname;
  const [menu, setMenu] = useState(false);
  const [showTop, setShowTop] = useState(false);
  const { scrollY, scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 160, damping: 30 });
  const reduced = useReducedMotion();
  useMotionValueEvent(scrollY, 'change', value => setShowTop(value > 500));
  return <>
    <a className="skip-link" href="#main">본문 바로가기</a>
    <header className="site-header"><div className="container header-inner"><a className="brand" href="/" aria-label="우리도배 홈">우리도배</a><nav className="desktop-nav" aria-label="주 메뉴">{navigation.map(item => <a key={item.href} href={item.href} aria-current={path.startsWith(item.href) ? 'page' : undefined}>{item.label}</a>)}</nav><div className="header-actions"><a className="header-finder" href="/finder">벽지 찾기</a><a className="button button-primary header-cta" href="/consult">견적 상담</a><button className="icon-button menu-toggle" aria-label="메뉴 열기" onClick={() => setMenu(true)}><Menu /></button></div></div><motion.div className="scroll-progress" style={{ scaleX: reduced ? scrollYProgress : progress }} /></header>
    <main id="main">{children}</main>
    <footer className="site-footer"><div className="container"><div className="footer-main"><a href="/" className="brand">우리도배</a><nav aria-label="하단 메뉴">{navigation.map(item => <a key={item.href} href={item.href}>{item.label}</a>)}<a href="/privacy">개인정보 처리방침</a></nav><a className="text-link" href={business.blog} target="_blank" rel="noopener noreferrer">네이버 블로그 <Arrow diagonal /></a></div><div className="footer-business"><div><p>우리 집에 맞는 벽지와 시공을 함께 고민합니다.</p><p>{business.address}<span className="footer-divider">|</span>문의 <a href={business.telephone}>{business.phone}</a></p></div><span>© {new Date().getFullYear()} 우리도배. All rights reserved.</span></div></div></footer>
    <div className="floating-actions"><a href={business.telephone} aria-label="우리도배 전화 상담" className="floating-call"><Phone size={20} /><span>전화 상담</span></a>{showTop && <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="back-top" aria-label="맨 위로 이동" onClick={() => window.scrollTo({ top: 0, behavior: reduced ? 'instant' : 'smooth' })}><ArrowUp size={20} /></motion.button>}</div>
    <Modal open={menu} onOpenChange={setMenu} title="우리도배" description="시공부터 상담까지, 필요한 정보를 찾아보세요."><nav className="mobile-nav" aria-label="모바일 메뉴">{navigation.map(item => <a href={item.href} key={item.href}>{item.label}<ChevronRight size={20} /></a>)}<Action href="/finder" outline>우리 집 벽지 찾기</Action></nav></Modal>
  </>;
}
export function SectionHeading({ eyebrow, title, description, centered = false }: { eyebrow?: string; title: ReactNode; description?: ReactNode; centered?: boolean }) {
  return <div className={cn('section-heading', centered && 'centered')}>{eyebrow && <div className="section-eyebrow">{eyebrow}</div>}<h2>{title}</h2>{description && <p>{description}</p>}</div>;
}
export function PageIntro({ eyebrow, title, description }: { eyebrow: string; title: ReactNode; description: ReactNode }) {
  return <section className="page-intro"><div className="container"><Reveal><span className="page-eyebrow">{eyebrow}</span><h1>{title}</h1><p>{description}</p></Reveal></div></section>;
}
export function Breadcrumb({ items }: { items: { href?: string; label: string }[] }) {
  return <nav className="breadcrumb" aria-label="현재 위치"><a href="/">홈</a>{items.map((item, index) => <span key={index}><ChevronRight size={13} />{item.href ? <a href={item.href}>{item.label}</a> : <span aria-current="page">{item.label}</span>}</span>)}</nav>;
}
export function ProcessSteps() {
  const icons = [MessageCircle, ClipboardCheck, Layers, CalendarDays, House];
  return <div className="process-steps">{steps.map((step, index) => { const Icon = icons[index]; return <Reveal className="process-step" key={step.title} delay={index * .025}><div className="step-number"><span>{index + 1}</span></div><div className="step-icon"><Icon size={33} strokeWidth={1.6} /></div><h3>{step.title}</h3><p>{step.text}</p></Reveal>; })}</div>;
}
export function FAQ({ full = false }: { full?: boolean }) {
  const [opened, setOpened] = useState<number | null>(0);
  return <div className="faq-list">{faqs.slice(0, full ? faqs.length : 4).map((item, index) => <div key={item.question} className={cn('faq-item', opened === index && 'opened')}><h3><button aria-expanded={opened === index} aria-controls={`faq-${index}`} onClick={() => setOpened(opened === index ? null : index)}><span>{item.question}</span><Plus size={22} /></button></h3><div id={`faq-${index}`} hidden={opened !== index}><p>{item.answer}</p></div></div>)}</div>;
}
export function ConsultationBanner({ title = '우리 집은 어떻게 달라질까요?', text = '원하는 공간과 분위기부터 편하게 이야기해 주세요.' }: { title?: string; text?: string }) {
  return <section className="consult-banner"><div className="container"><Reveal className="consult-banner-inner"><div><h2>{title}</h2><p>{text}</p></div><div className="button-group"><Action href="/consult">견적 상담 신청</Action><Action href="/finder" outline>벽지 찾기</Action></div></Reveal></div></section>;
}
export function EmptyState({ title, description, onReset }: { title: string; description: string; onReset: () => void }) {
  return <div className="empty-state"><Layers size={32} strokeWidth={1.3} /><h3>{title}</h3><p>{description}</p><button className="button button-outline" onClick={onReset}>전체 보기 <Arrow /></button></div>;
}
