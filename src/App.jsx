import { Fragment, useEffect, useState } from 'react';
import { AnimatePresence, motion, MotionConfig, useReducedMotion, useScroll, useSpring } from 'framer-motion';
import { ArrowDown, ArrowDownRight, ArrowUpRight, Asterisk, Menu, X } from 'lucide-react';
import { events } from './data/events.js';
import { members } from './data/members.js';
import { projects } from './data/projects.js';
import { researchAreas } from './data/researchAreas.js';
import { siteContent } from './data/siteContent.js';
import './App.css';

const navItems = siteContent.nav.links;

function EditableLines({ lines }) {
  return lines.map((line, index) => <Fragment key={`${line.text}-${index}`}>{line.emphasis ? <em>{line.text}</em> : line.text}{index < lines.length - 1 && <br />}</Fragment>);
}

function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 110, damping: 28, mass: 0.25 });
  return <motion.div className="scroll-progress" style={{ scaleX }} aria-hidden="true" />;
}

function Reveal({ children, className = '', delay = 0 }) {
  const reduceMotion = useReducedMotion();
  return <motion.div className={className} initial={reduceMotion ? false : { opacity: 0, y: 28, filter: 'blur(5px)' }} whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }} viewport={{ once: true, amount: 0.15 }} transition={{ duration: reduceMotion ? 0 : 0.62, delay, ease: [0.2, 0.7, 0.2, 1] }}>{children}</motion.div>;
}

function SectionLabel({ number, children, light = false }) {
  return <motion.div className={`section-label ${light ? 'section-label-light' : ''}`} initial={{ opacity: 0, x: -14 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.45, ease: 'easeOut' }}><span className="label-star">✳</span><span>{number} / {children}</span><i /></motion.div>;
}

function BrutalistButton({ href, children, secondary = false, onClick }) {
  return <a className={`brutalist-button ${secondary ? 'button-secondary' : ''}`} href={href} onClick={onClick}>{children}<ArrowUpRight size={18} strokeWidth={2.4} /></a>;
}

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const reduceMotion = useReducedMotion();
  useEffect(() => {
    document.body.classList.toggle('menu-open', menuOpen);
    return () => document.body.classList.remove('menu-open');
  }, [menuOpen]);
  return <>
    <motion.header className="site-header" initial={reduceMotion ? false : { y: -76 }} animate={{ y: 0 }} transition={{ duration: reduceMotion ? 0 : 0.5, ease: [0.2, 0.7, 0.2, 1] }}>
      <a href="#top" className="nav-brand" aria-label={`${siteContent.brand.name} home`}><img src={siteContent.brand.logo} alt={siteContent.brand.logoAlt} /><span>{siteContent.brand.shortName} <b>/ {siteContent.brand.fileNumber}</b></span></a>
      <nav className="desktop-nav" aria-label={siteContent.nav.aria}>{navItems.map(([label, id]) => <a key={id} href={`#${id}`}>{label}</a>)}</nav>
      <a href="#join" className="nav-join">{siteContent.nav.join} <ArrowUpRight size={15} /></a>
      <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-expanded={menuOpen} aria-controls="mobile-menu" aria-label={menuOpen ? siteContent.nav.close : siteContent.nav.menu}>{menuOpen ? <X /> : <Menu />}<span>{menuOpen ? siteContent.nav.close : siteContent.nav.menu}</span></button>
    </motion.header>
    <AnimatePresence>{menuOpen && <motion.nav id="mobile-menu" className="mobile-menu" aria-label={siteContent.nav.mobileAria} initial={reduceMotion ? false : { clipPath: 'inset(0 0 100% 0)' }} animate={{ clipPath: 'inset(0 0 0% 0)' }} exit={{ clipPath: 'inset(0 0 100% 0)' }} transition={{ duration: reduceMotion ? 0 : 0.35, ease: 'easeInOut' }}>
      <div className="mobile-menu-meta">{siteContent.nav.location}</div>
      {navItems.map(([label, id, mobileLabel = label], index) => <motion.a key={id} href={`#${id}`} onClick={() => setMenuOpen(false)} initial={reduceMotion ? false : { opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: reduceMotion ? 0 : 0.08 + index * 0.055 }}><sup>0{index + 1}</sup>{mobileLabel}<ArrowUpRight /></motion.a>)}
      <a className="mobile-menu-join" href="#join" onClick={() => setMenuOpen(false)}>{siteContent.nav.mobileJoin} <ArrowUpRight /></a>
    </motion.nav>}</AnimatePresence>
  </>;
}

function Hero() {
  const reduceMotion = useReducedMotion();
  return <section className="hero" id="top">
    <div className="hero-grid">
      <div className="hero-copy">
        <motion.p className="eyebrow hero-eyebrow" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>{siteContent.hero.eyebrow[0]} <span>·</span> {siteContent.hero.eyebrow[1]}</motion.p>
        <motion.h1 initial={{ opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: reduceMotion ? 0 : 0.7, delay: 0.2 }}><span>{siteContent.hero.title[0]}</span><span>{siteContent.hero.title[1]}<span className="hero-period">{siteContent.hero.titlePunctuation}</span></span></motion.h1>
        <motion.p className="hero-tagline" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.65 }}>{siteContent.hero.tagline.map((word, index) => <Fragment key={word}>{index > 0 && <i>·</i>}{word}</Fragment>)}</motion.p>
        <motion.div className="hero-actions" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}><BrutalistButton href="#about">{siteContent.hero.primaryCta}</BrutalistButton><a href="#projects" className="text-link">{siteContent.hero.secondaryCta} <ArrowDown size={16} /></a></motion.div>
      </div>
      <motion.div className="hero-mark-wrap" initial={{ opacity: 0, scale: 0.88, rotate: -6 }} animate={{ opacity: 1, scale: 1, rotate: 0 }} transition={{ duration: reduceMotion ? 0 : 0.9, delay: 0.25, ease: [0.2, 0.75, 0.25, 1] }}>
        <div className="hero-orbit orbit-a" /><div className="hero-orbit orbit-b" />
        <div className="hero-mark"><img src={siteContent.brand.logo} alt={siteContent.hero.artworkAlt} /></div>
        <span className="mark-caption">{siteContent.hero.figure} <i>—</i> {siteContent.hero.figureCaption}</span><span className="hero-stamp">{siteContent.hero.stampPrefix}<br />{siteContent.brand.year}</span>
      </motion.div>
      <motion.div className="hero-bottom" initial={reduceMotion ? false : { opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: reduceMotion ? 0 : 0.45, delay: 0.95 }}><span>{siteContent.hero.fileLabel}</span><span>{siteContent.hero.status} <b>✳</b> {siteContent.hero.themeLine}</span><a href="#about" aria-label={siteContent.hero.scrollLabel}><ArrowDownRight size={18} /></a></motion.div>
    </div>
  </section>;
}

function Introduction() {
  const content = siteContent.intro;
  return <section className="intro section-pad" id="about"><SectionLabel number={content.number}>{content.section}</SectionLabel>
    <div className="intro-head"><Reveal><h2><EditableLines lines={content.heading} /></h2></Reveal><Reveal delay={0.12}><div className="intro-aside"><span className="side-asterisk">✳</span><p>{content.description}</p><span className="micro">{content.asideLabel}</span></div></Reveal></div>
    <div className="pillar-grid">{content.pillars.map((pillar, index) => <Reveal key={pillar.number} delay={index * 0.08}><article className="pillar"><span className="pillar-number">{pillar.number}</span><span className="pillar-symbol">{pillar.symbol}</span><h3>{pillar.title}</h3><p>{pillar.description}</p></article></Reveal>)}</div>
  </section>;
}

function Manifesto() {
  const content = siteContent.manifesto;
  return <section className="manifesto section-pad" id="manifesto"><SectionLabel number={content.number} light>{content.section}</SectionLabel><div className="manifesto-heading"><Reveal><h2><EditableLines lines={content.heading} /></h2></Reveal><div className="manifesto-aside"><span>{content.asideTop.map((line) => <Fragment key={line}>{line}<br /></Fragment>)}</span><Asterisk size={34} /><span>{content.asideBottom.map((line) => <Fragment key={line}>{line}<br /></Fragment>)}</span></div></div>
    <div className="principles">{content.principles.map((principle, index) => <Reveal key={principle.number} delay={index * 0.07}><article className="principle"><span className="principle-index">{principle.number}</span><div><h3>{principle.title}</h3><p className="principle-line">{principle.line}</p><p className="principle-copy">{principle.description}</p></div><ArrowUpRight className="principle-arrow" /></article></Reveal>)}</div>
  </section>;
}

function ResearchSection() {
  const [active, setActive] = useState(null);
  const content = siteContent.research;
  return <section className="research section-pad" id="research"><SectionLabel number={content.number}>{content.section}</SectionLabel><div className="research-heading"><Reveal><h2><EditableLines lines={content.heading} /></h2></Reveal><Reveal delay={0.12}><div className="research-intro"><span className="research-slash">{content.eyebrow}</span><p>{content.description}</p><span className="circle-note">{content.prompt.map((line) => <Fragment key={line}>{line}<br /></Fragment>)}<ArrowDownRight size={18} /></span></div></Reveal></div>
    <div className="research-list" onMouseLeave={() => setActive(null)}>{researchAreas.map((item, index) => <motion.button key={item.name} className={`research-row ${active === index ? 'is-active' : ''}`} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: 0.35 }} transition={{ duration: 0.4, delay: index * 0.06 }} onMouseEnter={() => setActive(index)} onFocus={() => setActive(index)} onClick={() => setActive(active === index ? null : index)} aria-expanded={active === index}><span className="research-number">{String(index + 1).padStart(2, '0')}</span><span className="research-name">{item.name}</span><span className="research-detail">{active === index ? item.description : content.idleRow}</span><ArrowUpRight size={20} /></motion.button>)}</div>
    <div className="research-foot"><span>{content.footnote}</span><span>✳ {content.footnoteEnd}</span></div>
  </section>;
}

function ProjectArtwork({ project }) {
  const artwork = project.artwork || {};
  const lines = artwork.lines || [];
  const lineContent = lines.map((line, index) => <Fragment key={`${line}-${index}`}>{line}{index < lines.length - 1 && <br />}</Fragment>);
  return <div className={`project-art art-${artwork.style || 'orange'}`} aria-hidden={!project.image}>
    {project.image ? <img className="project-image" src={project.image} alt={project.imageAlt || project.name} loading="lazy" /> : <>
      <span className="art-index">{project.number}</span>
      {artwork.layout === 'orbit' && <><div className="art-rings" /><span className="art-word">{lineContent}</span><span className="art-orbit-dot" /></>}
      {artwork.layout === 'columns' && <><div className="art-columns"><i /><i /><i /><i /><i /></div><span className={`art-word ${artwork.serif ? 'serif' : ''}`}>{lineContent}</span>{artwork.stamp && <span className="art-stamp">{artwork.stamp.map((line, index) => <Fragment key={`${line}-${index}`}>{line}{index < artwork.stamp.length - 1 && <br />}</Fragment>)}</span>}</>}
      {artwork.layout === 'sun' && <><div className="art-sun"/><span className="art-word">{lineContent}</span><div className="art-lines" /></>}
    </>}
  </div>;
}

function ProjectsSection() {
  const content = siteContent.projects;
  return <section className="projects section-pad" id="projects"><SectionLabel number={content.number}>{content.section}</SectionLabel><Reveal><div className="section-heading-row"><h2><EditableLines lines={content.heading} /></h2><p>{content.description.map((line) => <Fragment key={line}>{line}<br /></Fragment>)}</p></div></Reveal>
    <div className="project-grid">{projects.map((project, index) => <Reveal key={project.number} delay={index * 0.1} className={`project-wrap project-${index + 1}`}><article className="project-card"><ProjectArtwork project={project} /><div className="project-info"><div className="project-meta"><span>{project.year} <i>/</i> {project.category}</span><span>{project.status}</span></div><h3>{project.name}</h3><p>{project.description}</p><div className="project-bottom"><div className="tech-list">{project.technologies.map((tech) => <span key={tech}>{tech}</span>)}</div><a href={project.href || '#join'} aria-label={`${project.name}: ${content.viewLabel}`} className="project-link">{content.viewLabel} <ArrowUpRight size={16} /></a></div></div></article></Reveal>)}</div><p className="editable-note"><span>✳</span> {content.placeholderNote}</p>
  </section>;
}

function EventsSection() {
  const [selected, setSelected] = useState(null);
  const content = siteContent.events;
  useEffect(() => {
    if (!selected) return;
    const opener = document.activeElement;
    const dialog = document.querySelector('[role="dialog"]');
    const focusable = dialog?.querySelectorAll('button, a[href]') || [];
    focusable[0]?.focus();
    const handleKeys = (e) => {
      if (e.key === 'Escape') setSelected(null);
      if (e.key === 'Tab' && focusable.length) {
        const first = focusable[0]; const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };
    window.addEventListener('keydown', handleKeys);
    return () => { window.removeEventListener('keydown', handleKeys); if (opener?.isConnected) opener.focus(); };
  }, [selected]);
  return <section className="events section-pad" id="events"><SectionLabel number={content.number} light>{content.section}</SectionLabel><div className="events-heading"><Reveal><h2><EditableLines lines={content.heading} /></h2></Reveal><Reveal delay={0.14}><span>{content.notice.map((line) => <Fragment key={line}>{line}<br /></Fragment>)}<Asterisk size={18} /></span></Reveal></div>
    <div className="event-grid">{events.map((event, index) => <Reveal key={event.title} delay={index * 0.1} className={`event-wrap event-wrap-${index + 1}`}><button className={`event-card event-card-${index + 1}`} onClick={() => setSelected(event)} aria-label={`${content.openLabel} ${event.title}`}><div className="event-card-top"><span>{content.posterHeader}</span><span>{event.fileNumber || String(index + 1).padStart(2, '0')} — {event.year || siteContent.brand.year}</span></div><div className="event-date">{event.day}<sup>{event.ordinalSuffix || ''}</sup><span>{event.month}</span></div><h3>{event.title}</h3><p>{event.teaser}</p><div className="event-card-bottom"><span>{event.time}</span><span>{event.venue}</span><span className="event-arrow"><ArrowUpRight /></span></div></button></Reveal>)}</div>
    <AnimatePresence>{selected && <motion.div className="modal-backdrop" role="presentation" onMouseDown={(e) => e.target === e.currentTarget && setSelected(null)} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><motion.div className="event-modal" role="dialog" aria-modal="true" aria-labelledby="event-modal-title" initial={{ y: 25, scale: 0.97 }} animate={{ y: 0, scale: 1 }} exit={{ y: 20, scale: 0.97 }}><button className="modal-close" onClick={() => setSelected(null)} aria-label={content.closeDialog}><X /></button><span className="micro">{content.dialogEyebrow}</span><h3 id="event-modal-title">{selected.title}</h3><p>{selected.description}</p><dl><div><dt>{content.dateLabel}</dt><dd>{selected.date}</dd></div><div><dt>{content.timeLabel}</dt><dd>{selected.time}</dd></div><div><dt>{content.venueLabel}</dt><dd>{selected.venue}</dd></div></dl><a href={content.registerHref} onClick={() => setSelected(null)} className="brutalist-button">{content.registerLabel} <ArrowUpRight size={18} /></a><p className="modal-note">{content.placeholderNote}</p></motion.div></motion.div>}</AnimatePresence>
  </section>;
}

function PeopleSection() {
  const content = siteContent.people;
  return <section className="people section-pad" id="people"><SectionLabel number={content.number}>{content.section}</SectionLabel><div className="people-heading"><Reveal><h2><EditableLines lines={content.heading} /></h2></Reveal><Reveal delay={0.12}><p>{content.description}</p></Reveal></div>
    <div className="people-grid">{members.map((member, index) => <Reveal key={member.archive} delay={index * 0.09}><article className="member-card"><div className="member-photo"><span className="member-frame">{member.archive}</span>{member.photo ? <img className="member-image" src={member.photo} alt={member.photoAlt || member.name} loading="lazy" /> : <div className="portrait-placeholder" aria-hidden="true"><span>✳</span><i>{member.initial}</i></div>}<span className="photo-caption">{member.photo ? member.photoCaption || '' : content.photoPlaceholder}</span></div><div className="member-details"><span className="micro">{member.archive}</span><h3>{member.name}</h3><p className="member-role">{member.role}</p><div className="member-tags">{member.categories.map((tag) => <motion.span key={tag} whileHover={{ y: -3, rotate: -2 }} transition={{ type: 'spring', stiffness: 300, damping: 14 }}>{tag}</motion.span>)}</div></div></article></Reveal>)}</div><p className="editable-note"><span>✳</span> {content.placeholderNote}</p>
  </section>;
}

function JoinSection() {
  const reduceMotion = useReducedMotion();
  const content = siteContent.join;
  return <section className="join section-pad" id="join"><SectionLabel number={content.number}>{content.section}</SectionLabel><div className="join-layout"><div className="join-copy"><Reveal><h2><EditableLines lines={content.heading} /></h2></Reveal><div className="join-second"><motion.h2 initial={reduceMotion ? false : { opacity: 0, y: 25 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: reduceMotion ? 0 : 0.55, delay: 0.1 }}><EditableLines lines={content.secondHeading} /></motion.h2><Reveal delay={0.18}><p>{content.description}</p><div className="join-actions"><BrutalistButton href={content.primaryHref}>{content.primaryCta}</BrutalistButton><a href={content.secondaryHref} className="join-follow">{content.secondaryCta} <ArrowUpRight size={17} /></a></div></Reveal></div></div><motion.div className="join-orbit" initial={reduceMotion ? false : { opacity: 0, scale: 0.85, rotate: -7 }} whileInView={{ opacity: 1, scale: 1, rotate: 0 }} viewport={{ once: true }} transition={{ duration: reduceMotion ? 0 : 0.75 }}><div className="join-orbit-one"/><div className="join-orbit-two"/><img src={siteContent.brand.logo} alt=""/><span>{content.orbitLabel.map((line) => <Fragment key={line}>{line}<br /></Fragment>)}</span></motion.div></div></section>;
}

function Footer() {
  const reduceMotion = useReducedMotion();
  const content = siteContent.footer;
  const liftIn = (delay = 0) => ({ initial: reduceMotion ? false : { opacity: 0, y: 20 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: reduceMotion ? 0 : 0.5, delay } });
  return <footer className="site-footer"><div className="footer-top"><motion.div className="footer-title" {...liftIn()}><span>{siteContent.hero.title[0]}</span><span>{siteContent.hero.title[1]}<span>{siteContent.hero.titlePunctuation}</span></span></motion.div><motion.div className="footer-motto" {...liftIn(0.1)}>{content.motto.map((line) => <Fragment key={line}>{line}<br /></Fragment>)}</motion.div><motion.div className="footer-links" {...liftIn(0.18)}><span>{content.navTitle}</span>{navItems.map(([label, id], index) => <motion.a key={id} href={`#${id}`} initial={reduceMotion ? false : { opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: reduceMotion ? 0 : .22 + index * .05 }}>{label} <ArrowUpRight size={13} /></motion.a>)}</motion.div></div><div className="footer-mid"><motion.div {...liftIn()}><span>{content.college}</span><span>{content.location}</span></motion.div><motion.div className="social-links" {...liftIn(.12)}>{content.socialLinks.map((link) => <a key={link.label} href={link.href}>{link.label} ↗</a>)}</motion.div></div><motion.div className="footer-bottom" {...liftIn()}><span>{siteContent.brand.shortName} / {siteContent.brand.year}</span><span>{content.credit}</span><a href="#top">{content.backToTop}</a></motion.div></footer>;
}

export default function App() {
  useEffect(() => {
    document.title = siteContent.seo.title;
    let description = document.querySelector('meta[name="description"]');
    if (!description) { description = document.createElement('meta'); description.name = 'description'; document.head.append(description); }
    description.content = siteContent.seo.description;
  }, []);
  return <MotionConfig reducedMotion="user"><ScrollProgress /><Navbar /><main><Hero /><Introduction /><Manifesto /><ResearchSection /><ProjectsSection /><EventsSection /><PeopleSection /><JoinSection /></main><Footer /></MotionConfig>;
}
