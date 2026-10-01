(() => {
  const { siteContent: c, events, members, projects, researchAreas } = window.ATHENAEUM_CONTENT;
  const $ = (selector, root = document) => root.querySelector(selector);
  const escapeHTML = (value = '') => String(value).replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
  const safeUrl = (value = '') => /^(https?:|mailto:|tel:|#|\/|\.\/)/i.test(value) ? value : '#';
  const asset = (value = '') => value.startsWith('/') && !value.startsWith('//') ? `public${value}` : value;
  const edit = (key, value = '') => `<span data-editable="${escapeHTML(key)}">${escapeHTML(value)}</span>`;
  const lines = (items, key) => items.map((item, index) => `<span class="editable-line" data-editable="${key}.${index}">${item.emphasis ? `<em>${escapeHTML(item.text)}</em>` : escapeHTML(item.text)}</span>`).join('');
  const icon = (name) => {
    const paths = {
      up: '<path d="M7 17 17 7M7 7h10v10"/>', down: '<path d="M12 4v16m0 0 7-7m-7 7-7-7"/>',
      downRight: '<path d="M7 7 17 17M7 17h10V7"/>', close: '<path d="m18 6-12 12M6 6l12 12"/>',
      menu: '<path d="M4 7h16M4 12h16M4 17h16"/>', star: '<path d="m12 2 1.7 7.2L21 12l-7.3 2.8L12 22l-1.7-7.2L3 12l7.3-2.8L12 2Z"/>'
    };
    return `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name] || paths.up}</svg>`;
  };
  const sectionLabel = (data, key, light = false) => `<div class="section-label ${light ? 'section-label-light' : ''}"><span class="label-star">✳</span><span>${edit(`${key}.number`, data.number)} / ${edit(`${key}.section`, data.section)}</span><i></i></div>`;
  const button = (href, label) => `<a class="brutalist-button" href="${escapeHTML(safeUrl(href))}">${edit('button.' + label.toLowerCase().replace(/\s+/g, '-'), label)}${icon('up')}</a>`;

  function header() {
    const nav = c.nav.links.map(([label, id]) => `<a href="#${escapeHTML(id)}">${edit(`nav.${id}`, label)}</a>`).join('');
    const mobile = c.nav.links.map(([label, id, mobileLabel = label], index) => `<a href="#${escapeHTML(id)}"><sup>0${index + 1}</sup>${edit(`mobile-nav.${id}`, mobileLabel)}${icon('up')}</a>`).join('');
    return `<header class="site-header"><a href="#top" class="nav-brand" aria-label="${escapeHTML(c.brand.name)} home"><img src="${escapeHTML(asset(c.brand.logo))}" alt="${escapeHTML(c.brand.logoAlt)}"><span>${edit('brand.shortName', c.brand.shortName)} <b>/ ${edit('brand.fileNumber', c.brand.fileNumber)}</b></span></a><nav class="desktop-nav" aria-label="${escapeHTML(c.nav.aria)}">${nav}</nav><a href="#join" class="nav-join">${edit('nav.join', c.nav.join)} ${icon('up')}</a><button class="menu-toggle" id="menu-toggle" aria-expanded="false" aria-controls="mobile-menu"><span id="menu-icon">${icon('menu')}</span><span id="menu-label">${escapeHTML(c.nav.menu)}</span></button></header><nav id="mobile-menu" class="mobile-menu" aria-label="${escapeHTML(c.nav.mobileAria)}"><div class="mobile-menu-meta">${edit('nav.location', c.nav.location)}</div>${mobile}<a class="mobile-menu-join" href="#join">${edit('nav.mobileJoin', c.nav.mobileJoin)} ${icon('up')}</a></nav>`;
  }

  function hero() {
    return `<section class="hero" id="top"><div class="hero-grid"><div class="hero-copy"><p class="eyebrow hero-eyebrow">${edit('hero.eyebrow.0', c.hero.eyebrow[0])} <span>·</span> ${edit('hero.eyebrow.1', c.hero.eyebrow[1])}</p><h1><span>${edit('hero.title.0', c.hero.title[0])}</span><span>${edit('hero.title.1', c.hero.title[1])}<span class="hero-period">${edit('hero.punctuation', c.hero.titlePunctuation)}</span></span></h1><p class="hero-tagline">${c.hero.tagline.map((word, i) => `${i ? '<i>·</i>' : ''}${edit(`hero.tagline.${i}`, word)}`).join(' ')}</p><div class="hero-actions"><a class="brutalist-button" href="#about">${edit('hero.primaryCta', c.hero.primaryCta)}${icon('up')}</a><a href="#projects" class="text-link">${edit('hero.secondaryCta', c.hero.secondaryCta)} ${icon('down')}</a></div></div><div class="hero-mark-wrap"><div class="hero-orbit orbit-a"></div><div class="hero-orbit orbit-b"></div><div class="hero-mark"><img src="${escapeHTML(asset(c.brand.logo))}" alt="${escapeHTML(c.hero.artworkAlt)}"></div><span class="mark-caption">${edit('hero.figure', c.hero.figure)} <i>—</i> ${edit('hero.figureCaption', c.hero.figureCaption)}</span><span class="hero-stamp">${edit('hero.stampPrefix', c.hero.stampPrefix)}<br>${edit('brand.year', c.brand.year)}</span></div><div class="hero-bottom"><span>${edit('hero.fileLabel', c.hero.fileLabel)}</span><span>${edit('hero.status', c.hero.status)} <b>✳</b> ${edit('hero.themeLine', c.hero.themeLine)}</span><a href="#about" aria-label="${escapeHTML(c.hero.scrollLabel)}">${icon('downRight')}</a></div></div></section>`;
  }

  function intro() {
    const d = c.intro;
    return `<section class="intro section-pad" id="about">${sectionLabel(d, 'intro')}<div class="intro-head"><div class="reveal"><h2>${lines(d.heading, 'intro.heading')}</h2></div><div class="reveal"><div class="intro-aside"><span class="side-asterisk">✳</span><p>${edit('intro.description', d.description)}</p><span class="micro">${edit('intro.asideLabel', d.asideLabel)}</span></div></div></div><div class="pillar-grid">${d.pillars.map((p, i) => `<div class="reveal"><article class="pillar"><span class="pillar-number">${edit(`intro.pillars.${i}.number`, p.number)}</span><span class="pillar-symbol">${edit(`intro.pillars.${i}.symbol`, p.symbol)}</span><h3>${edit(`intro.pillars.${i}.title`, p.title)}</h3><p>${edit(`intro.pillars.${i}.description`, p.description)}</p></article></div>`).join('')}</div></section>`;
  }

  function manifesto() {
    const d = c.manifesto;
    return `<section class="manifesto section-pad" id="manifesto">${sectionLabel(d, 'manifesto', true)}<div class="manifesto-heading"><div class="reveal"><h2>${lines(d.heading, 'manifesto.heading')}</h2></div><div class="manifesto-aside"><span>${d.asideTop.map((x, i) => `${edit(`manifesto.asideTop.${i}`, x)}<br>`).join('')}</span>${icon('star')}<span>${d.asideBottom.map((x, i) => `${edit(`manifesto.asideBottom.${i}`, x)}<br>`).join('')}</span></div></div><div class="principles">${d.principles.map((p, i) => `<div class="reveal"><article class="principle"><span class="principle-index">${edit(`manifesto.principles.${i}.number`, p.number)}</span><div><h3>${edit(`manifesto.principles.${i}.title`, p.title)}</h3><p class="principle-line">${edit(`manifesto.principles.${i}.line`, p.line)}</p><p class="principle-copy">${edit(`manifesto.principles.${i}.description`, p.description)}</p></div>${icon('up')}</article></div>`).join('')}</div></section>`;
  }

  function research() {
    const d = c.research;
    return `<section class="research section-pad" id="research">${sectionLabel(d, 'research')}<div class="research-heading"><div class="reveal"><h2>${lines(d.heading, 'research.heading')}</h2></div><div class="reveal"><div class="research-intro"><span class="research-slash">${edit('research.eyebrow', d.eyebrow)}</span><p>${edit('research.description', d.description)}</p><span class="circle-note">${d.prompt.map((x, i) => `${edit(`research.prompt.${i}`, x)}<br>`).join('')}${icon('downRight')}</span></div></div></div><div class="research-list">${researchAreas.map((item, i) => `<button class="research-row reveal" data-research="${i}" aria-expanded="false"><span class="research-number">${String(i + 1).padStart(2, '0')}</span><span class="research-name">${edit(`researchAreas.${i}.name`, item.name)}</span><span class="research-detail" data-idle="${escapeHTML(d.idleRow)}">${escapeHTML(d.idleRow)}</span>${icon('up')}</button>`).join('')}</div><div class="research-foot"><span>${edit('research.footnote', d.footnote)}</span><span>✳ ${edit('research.footnoteEnd', d.footnoteEnd)}</span></div></section>`;
  }

  function artwork(project, i) {
    const a = project.artwork || {};
    if (project.image) return `<div class="project-art art-${escapeHTML(a.style || 'orange')}"><img class="project-image" src="${escapeHTML(asset(project.image))}" alt="${escapeHTML(project.imageAlt || project.name)}" loading="lazy"></div>`;
    const linesText = (a.lines || []).map((x, j) => `${edit(`projects.${i}.artwork.lines.${j}`, x)}<br>`).join('');
    if (a.layout === 'columns') return `<div class="project-art art-${escapeHTML(a.style || 'stone')}"><span class="art-index">${edit(`projects.${i}.number`, project.number)}</span><div class="art-columns"><i></i><i></i><i></i><i></i><i></i></div><span class="art-word ${a.serif ? 'serif' : ''}">${linesText}</span><span class="art-stamp">${(a.stamp || []).map((x, j) => `${edit(`projects.${i}.artwork.stamp.${j}`, x)}<br>`).join('')}</span></div>`;
    if (a.layout === 'sun') return `<div class="project-art art-${escapeHTML(a.style || 'sage')}"><span class="art-index">${edit(`projects.${i}.number`, project.number)}</span><div class="art-sun"></div><span class="art-word">${linesText}</span><div class="art-lines"></div></div>`;
    return `<div class="project-art art-${escapeHTML(a.style || 'orange')}"><span class="art-index">${edit(`projects.${i}.number`, project.number)}</span><div class="art-rings"></div><span class="art-word">${linesText}</span><span class="art-orbit-dot"></span></div>`;
  }

  function projectSection() {
    const d = c.projects;
    return `<section class="projects section-pad" id="projects">${sectionLabel(d, 'projects')}<div class="reveal"><div class="section-heading-row"><h2>${lines(d.heading, 'projects.heading')}</h2><p>${d.description.map((x, i) => `${edit(`projects.description.${i}`, x)}<br>`).join('')}</p></div></div><div class="project-grid">${projects.map((p, i) => `<div class="reveal project-wrap project-${i + 1}"><article class="project-card">${artwork(p, i)}<div class="project-info"><div class="project-meta"><span>${edit(`projects.${i}.year`, p.year)} <i>/</i> ${edit(`projects.${i}.category`, p.category)}</span><span>${edit(`projects.${i}.status`, p.status)}</span></div><h3>${edit(`projects.${i}.name`, p.name)}</h3><p>${edit(`projects.${i}.description`, p.description)}</p><div class="project-bottom"><div class="tech-list">${p.technologies.map((tag, j) => `<span>${edit(`projects.${i}.technologies.${j}`, tag)}</span>`).join('')}</div><a href="${escapeHTML(safeUrl(p.href || '#join'))}" class="project-link">${edit('projects.viewLabel', d.viewLabel)} ${icon('up')}</a></div></div></article></div>`).join('')}</div><p class="editable-note">✳ ${edit('projects.placeholderNote', d.placeholderNote)}</p></section>`;
  }

  function eventsSection() {
    const d = c.events;
    return `<section class="events section-pad" id="events">${sectionLabel(d, 'events', true)}<div class="events-heading"><div class="reveal"><h2>${lines(d.heading, 'events.heading')}</h2></div><div class="reveal"><span>${d.notice.map((x, i) => `${edit(`events.notice.${i}`, x)}<br>`).join('')}${icon('star')}</span></div></div><div class="event-grid">${events.map((e, i) => `<div class="reveal event-wrap event-wrap-${i + 1}"><button class="event-card event-card-${i + 1}" data-event="${i}" aria-label="${escapeHTML(d.openLabel)} ${escapeHTML(e.title)}"><div class="event-card-top"><span>${edit('events.posterHeader', d.posterHeader)}</span><span>${edit(`events.${i}.fileNumber`, e.fileNumber)} — ${edit(`events.${i}.year`, e.year)}</span></div><div class="event-date">${edit(`events.${i}.day`, e.day)}<sup>${edit(`events.${i}.ordinalSuffix`, e.ordinalSuffix)}</sup><span>${edit(`events.${i}.month`, e.month)}</span></div><h3>${edit(`events.${i}.title`, e.title)}</h3><p>${edit(`events.${i}.teaser`, e.teaser)}</p><div class="event-card-bottom"><span>${edit(`events.${i}.time`, e.time)}</span><span>${edit(`events.${i}.venue`, e.venue)}</span><span class="event-arrow">${icon('up')}</span></div></button></div>`).join('')}</div><div class="modal-backdrop" id="event-backdrop" hidden><div class="event-modal" role="dialog" aria-modal="true" aria-labelledby="event-modal-title"><button class="modal-close" id="modal-close" aria-label="${escapeHTML(d.closeDialog)}">${icon('close')}</button><span class="micro">${edit('events.dialogEyebrow', d.dialogEyebrow)}</span><h3 id="event-modal-title"></h3><p id="event-modal-description"></p><dl><div><dt>${edit('events.dateLabel', d.dateLabel)}</dt><dd id="event-modal-date"></dd></div><div><dt>${edit('events.timeLabel', d.timeLabel)}</dt><dd id="event-modal-time"></dd></div><div><dt>${edit('events.venueLabel', d.venueLabel)}</dt><dd id="event-modal-venue"></dd></div></dl><a id="event-register" href="${escapeHTML(safeUrl(d.registerHref))}" class="brutalist-button">${edit('events.registerLabel', d.registerLabel)} ${icon('up')}</a><p class="modal-note">${edit('events.placeholderNote', d.placeholderNote)}</p></div></div></section>`;
  }

  function peopleSection() {
    const d = c.people;
    return `<section class="people section-pad" id="people">${sectionLabel(d, 'people')}<div class="people-heading"><div class="reveal"><h2>${lines(d.heading, 'people.heading')}</h2></div><div class="reveal"><p>${edit('people.description', d.description)}</p></div></div><div class="people-grid">${members.map((m, i) => `<div class="reveal"><article class="member-card"><div class="member-photo"><span class="member-frame">${edit(`members.${i}.archive`, m.archive)}</span>${m.photo ? `<img class="member-image" src="${escapeHTML(asset(m.photo))}" alt="${escapeHTML(m.photoAlt || m.name)}" loading="lazy">` : `<div class="portrait-placeholder"><span>✳</span><i>${edit(`members.${i}.initial`, m.initial)}</i></div>`}<span class="photo-caption">${m.photo ? '' : edit('people.photoPlaceholder', d.photoPlaceholder)}</span></div><div class="member-details"><span class="micro">${edit(`members.${i}.archive`, m.archive)}</span><h3>${edit(`members.${i}.name`, m.name)}</h3><p class="member-role">${edit(`members.${i}.role`, m.role)}</p><div class="member-tags">${m.categories.map((x, j) => `<span>${edit(`members.${i}.categories.${j}`, x)}</span>`).join('')}</div></div></article></div>`).join('')}</div><p class="editable-note">✳ ${edit('people.placeholderNote', d.placeholderNote)}</p></section>`;
  }

  function joinSection() {
    const d = c.join;
    return `<section class="join section-pad" id="join">${sectionLabel(d, 'join')}<div class="join-layout"><div class="join-copy"><div class="reveal"><h2>${lines(d.heading, 'join.heading')}</h2></div><div class="join-second"><h2>${lines(d.secondHeading, 'join.secondHeading')}</h2><div class="reveal"><p>${edit('join.description', d.description)}</p><div class="join-actions"><a class="brutalist-button" href="${escapeHTML(safeUrl(d.primaryHref))}">${edit('join.primaryCta', d.primaryCta)}${icon('up')}</a><a href="${escapeHTML(safeUrl(d.secondaryHref))}" class="join-follow">${edit('join.secondaryCta', d.secondaryCta)} ${icon('up')}</a></div></div></div></div><div class="join-orbit"><div class="join-orbit-one"></div><div class="join-orbit-two"></div><img src="${escapeHTML(asset(c.brand.logo))}" alt=""><span>${d.orbitLabel.map((x, i) => `${edit(`join.orbitLabel.${i}`, x)}<br>`).join('')}</span></div></div></section>`;
  }

  function footer() {
    const d = c.footer;
    return `<footer class="site-footer"><div class="footer-top"><div class="footer-title"><span>${edit('hero.title.0', c.hero.title[0])}</span><span>${edit('hero.title.1', c.hero.title[1])}<span>${edit('hero.punctuation', c.hero.titlePunctuation)}</span></span></div><div class="footer-motto">${d.motto.map((x, i) => `${edit(`footer.motto.${i}`, x)}<br>`).join('')}</div><div class="footer-links"><span>${edit('footer.navTitle', d.navTitle)}</span>${c.nav.links.map(([label, id]) => `<a href="#${escapeHTML(id)}">${edit(`nav.${id}`, label)} ${icon('up')}</a>`).join('')}</div></div><div class="footer-mid"><div><span>${edit('footer.college', d.college)}</span><span>${edit('footer.location', d.location)}</span></div><div class="social-links">${d.socialLinks.map((x, i) => `<a href="${escapeHTML(safeUrl(x.href))}">${edit(`footer.socialLinks.${i}.label`, x.label)} ↗</a>`).join('')}</div></div><div class="footer-bottom"><span>${edit('brand.shortName', c.brand.shortName)} / ${edit('brand.year', c.brand.year)}</span><span>${edit('footer.credit', d.credit)}</span><a href="#top">${edit('footer.backToTop', d.backToTop)}</a></div></footer>`;
  }

  $('#site').innerHTML = `${header()}<main>${hero()}${intro()}${manifesto()}${research()}${projectSection()}${eventsSection()}${peopleSection()}${joinSection()}</main>${footer()}`;
  document.title = c.seo.title;
  $('meta[name="description"]').content = c.seo.description;

  const savedKey = 'athenaeum-html-edits-v1';
  const editableNodes = [...document.querySelectorAll('[data-editable]')];
  const cleanHTML = (value) => {
    const parsed = new DOMParser().parseFromString(value, 'text/html');
    const allowed = new Set(['B', 'BR', 'EM', 'I', 'STRONG', 'SUB', 'SUP', 'SPAN', 'DIV', 'P']);
    const clean = (node) => [...node.childNodes].forEach((child) => {
      if (child.nodeType === Node.ELEMENT_NODE) {
        if (!allowed.has(child.tagName)) { child.replaceWith(document.createTextNode(child.textContent)); return; }
        [...child.attributes].forEach((attribute) => child.removeAttribute(attribute.name));
        clean(child);
      }
    });
    clean(parsed.body);
    return parsed.body.innerHTML;
  };
  let savedEdits = {};
  try { savedEdits = JSON.parse(localStorage.getItem(savedKey) || '{}'); } catch { savedEdits = {}; }
  editableNodes.forEach((node) => {
    node.dataset.originalHtml = node.innerHTML;
    if (typeof savedEdits[node.dataset.editable] === 'string') node.innerHTML = cleanHTML(savedEdits[node.dataset.editable]);
    node.addEventListener('input', () => {
      const next = cleanHTML(node.innerHTML);
      editableNodes.filter((other) => other !== node && other.dataset.editable === node.dataset.editable).forEach((other) => { other.innerHTML = next; });
    });
  });

  const editorBar = $('.editor-bar');
  const editorMessage = $('#editor-message');
  const editToggle = $('#edit-toggle');
  const saveButton = $('#save-edits');
  const cancelButton = $('#cancel-edits');
  let editing = false;
  function setEditing(value) {
    editing = value;
    document.body.classList.toggle('editing', editing);
    editableNodes.forEach((node) => { node.contentEditable = editing ? 'true' : 'false'; node.spellcheck = false; });
    editToggle.hidden = editing;
    saveButton.hidden = !editing;
    cancelButton.hidden = !editing;
    editorMessage.textContent = editing ? 'Click any text to edit it, then save your changes in this browser.' : 'Want to update the page? Turn on edit mode.';
  }
  editToggle.addEventListener('click', () => setEditing(true));
  saveButton.addEventListener('click', () => {
    const values = Object.fromEntries(editableNodes.map((node) => [node.dataset.editable, cleanHTML(node.innerHTML)]));
    localStorage.setItem(savedKey, JSON.stringify(values));
    savedEdits = values;
    setEditing(false);
    editorMessage.textContent = 'Your changes are saved in this browser.';
  });
  cancelButton.addEventListener('click', () => {
    editableNodes.forEach((node) => { node.innerHTML = savedEdits[node.dataset.editable] ?? node.dataset.originalHtml; });
    setEditing(false);
  });

  const toggle = $('#menu-toggle');
  const menu = $('#mobile-menu');
  toggle.addEventListener('click', () => {
    const open = toggle.getAttribute('aria-expanded') !== 'true';
    toggle.setAttribute('aria-expanded', String(open));
    document.body.classList.toggle('menu-open', open);
    menu.classList.toggle('is-open', open);
    $('#menu-icon').innerHTML = icon(open ? 'close' : 'menu');
    $('#menu-label').textContent = open ? c.nav.close : c.nav.menu;
  });
  menu.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
    toggle.setAttribute('aria-expanded', 'false'); document.body.classList.remove('menu-open'); menu.classList.remove('is-open');
    $('#menu-icon').innerHTML = icon('menu'); $('#menu-label').textContent = c.nav.menu;
  }));

  document.querySelectorAll('[data-research]').forEach((row) => row.addEventListener('click', () => {
    const index = Number(row.dataset.research);
    const active = row.classList.contains('is-active');
    document.querySelectorAll('[data-research]').forEach((other) => {
      other.classList.remove('is-active'); other.setAttribute('aria-expanded', 'false');
      other.querySelector('.research-detail').textContent = other.querySelector('.research-detail').dataset.idle;
    });
    if (!active) {
      row.classList.add('is-active'); row.setAttribute('aria-expanded', 'true');
      row.querySelector('.research-detail').textContent = researchAreas[index].description;
    }
  }));

  const backdrop = $('#event-backdrop');
  function closeDialog() { backdrop.hidden = true; }
  document.querySelectorAll('[data-event]').forEach((card) => card.addEventListener('click', () => {
    const event = events[Number(card.dataset.event)];
    $('#event-modal-title').textContent = event.title;
    $('#event-modal-description').textContent = event.description;
    $('#event-modal-date').textContent = event.date;
    $('#event-modal-time').textContent = event.time;
    $('#event-modal-venue').textContent = event.venue;
    backdrop.hidden = false; $('#modal-close').focus();
  }));
  $('#modal-close').addEventListener('click', closeDialog);
  backdrop.addEventListener('click', (event) => { if (event.target === backdrop) closeDialog(); });
  $('#event-register').addEventListener('click', closeDialog);
  document.addEventListener('keydown', (event) => { if (event.key === 'Escape') closeDialog(); });

  const revealObserver = new IntersectionObserver((entries, observer) => entries.forEach((entry) => {
    if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); }
  }), { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach((node) => revealObserver.observe(node));
  const progress = $('#scroll-progress');
  const updateProgress = () => {
    const range = document.documentElement.scrollHeight - innerHeight;
    progress.style.transform = `scaleX(${range > 0 ? scrollY / range : 0})`;
  };
  addEventListener('scroll', updateProgress, { passive: true });
  addEventListener('resize', updateProgress);
  updateProgress();
})();
