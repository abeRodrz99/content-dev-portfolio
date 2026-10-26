document.addEventListener('DOMContentLoaded', () => {

  const container = document.getElementById('portfolio-content');
  const bg        = document.getElementById('story-list-bg');
  const filters   = document.querySelectorAll('.filter-btn');
  let allStories     = [];
  let allDevProjects = [];
  let faqData        = null;

  const CLEAR_SELECTOR = '.story-item, .empty-state, .content-layout, .faq-layout';

  // ── Render stories (Content tab) ──
  function renderStories(storiesToShow) {
    container.querySelectorAll(CLEAR_SELECTOR).forEach(el => el.remove());

    const layout = document.createElement('div');
    layout.className = 'content-layout';

    const groups = [
      {
        title: 'SEO Content',
        description: 'Industry roundups designed to earn search visibility. Built In clients opted into these listicles to get in front of audiences searching their market, each one structured around the queries people actually use.',
        category: 'SEO & GEO',
        primary: true
      },
      {
        title: 'General Reporting',
        description: 'Profiles, community reporting and industry stories that bring people’s experiences, local context and emerging trends into focus.',
        category: 'General & Feature Reporting',
        primary: false
      },
      {
        title: 'Investigative Reporting',
        description: 'Evidence-led reporting on public institutions and unequal outcomes, using records, data and on-the-ground reporting to examine who is affected and why.',
        category: 'Investigative & Accountability Reporting',
        primary: false
      }
    ];

    function makeStoryLink(story) {
      const a = document.createElement('a');
      a.className = 'story-item content-story';
      a.href = story.url;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';

      const image = story.imgUrl
        ? `<img class="story-thumb" src="${story.imgUrl}" alt="" loading="lazy" />`
        : '';

      a.innerHTML = `
        <div class="story-inner">
          ${image}
          <div class="story-text">
            <p class="story-pub"></p>
            <p class="story-title"></p>
            <p class="story-excerpt"></p>
          </div>

        </div>
      `;
      a.querySelector('.story-pub').textContent = story.publication;
      a.querySelector('.story-title').textContent = story.title;
      a.querySelector('.story-excerpt').textContent = story.excerpt;
      return a;
    }

    groups.forEach(group => {
      const groupStories = storiesToShow.filter(story => story.category === group.category);
      const section = document.createElement('section');
      section.className = `content-group${group.primary ? ' content-group-primary is-open' : ''}`;
      section.innerHTML = `
        <button class="content-group-trigger" type="button" aria-expanded="${group.primary ? 'true' : 'false'}">
          <span class="content-group-heading">
            <span class="content-group-title-wrap">
              <span class="content-group-title">${group.title}</span>
              <span class="content-group-description">${group.description}</span>
            </span>
          </span>
          <span class="content-group-icon" aria-hidden="true">${group.primary ? '−' : '+'}</span>
        </button>
        <div class="content-group-body"${group.primary ? '' : ' hidden'}></div>
      `;
      const trigger = section.querySelector('.content-group-trigger');
      const body = section.querySelector('.content-group-body');
      const initialCount = 4;
      let expanded = false;

      if (groupStories.length) {
        const storyList = document.createElement('div');
        storyList.className = 'content-story-list';
        groupStories.forEach((story, index) => {
          const item = makeStoryLink(story);
          if (index >= initialCount) item.hidden = true;
          storyList.appendChild(item);
        });
        body.appendChild(storyList);

        if (groupStories.length > initialCount) {
          const loadMore = document.createElement('button');
          loadMore.className = 'content-load-more';
          loadMore.type = 'button';
          loadMore.textContent = `Load more (${groupStories.length - initialCount})`;
          loadMore.setAttribute('aria-expanded', 'false');
          loadMore.addEventListener('click', event => {
            event.stopPropagation();
            expanded = !expanded;
            storyList.querySelectorAll('.content-story').forEach((item, index) => {
              item.hidden = !expanded && index >= initialCount;
            });
            loadMore.textContent = expanded ? 'Show fewer' : `Load more (${groupStories.length - initialCount})`;
            loadMore.setAttribute('aria-expanded', String(expanded));
          });
          body.appendChild(loadMore);
        }
      } else {
        const empty = document.createElement('p');
        empty.className = 'content-group-placeholder';
        empty.textContent = 'No stories in this section yet.';
        body.appendChild(empty);
      }

      trigger.addEventListener('click', () => {
        const open = trigger.getAttribute('aria-expanded') === 'true';

        // Accordion: opening one subject collapses whichever other one is open.
        layout.querySelectorAll('.content-group.is-open').forEach(other => {
          if (other === section) return;
          other.classList.remove('is-open');
          other.querySelector('.content-group-trigger').setAttribute('aria-expanded', 'false');
          other.querySelector('.content-group-body').hidden = true;
          other.querySelector('.content-group-icon').textContent = '+';
        });

        trigger.setAttribute('aria-expanded', String(!open));
        body.hidden = open;
        section.classList.toggle('is-open', !open);
        section.querySelector('.content-group-icon').textContent = open ? '+' : '−';
      });
      layout.appendChild(section);
    });

    container.appendChild(layout);
    initAnimatedList();
  }

  // ── Render dev projects (Dev tab) ──
  function renderDevProjects(projectsToShow) {
    container.querySelectorAll(CLEAR_SELECTOR).forEach(el => el.remove());

    if (projectsToShow.length === 0) {
      const empty = document.createElement('p');
      empty.className = 'empty-state';
      empty.textContent = 'Dev projects coming soon.';
      container.appendChild(empty);
      return;
    }

    projectsToShow.forEach(project => {
      const item = document.createElement('div');
      item.className = 'story-item project-item project-expandable';

      item.innerHTML = `
        <button class="project-trigger" type="button" aria-expanded="false">
          <div class="story-inner">
            <div class="story-text">
              <p class="story-title"></p>
              <p class="story-excerpt"></p>
              <p class="story-pub"></p>
            </div>
            <span class="story-arrow" aria-hidden="true">＋</span>
          </div>
        </button>
        <div class="project-details" hidden>
          <p class="project-details-copy"></p>
          <a class="project-visit-button" href="" target="_blank" rel="noopener noreferrer">View site <span aria-hidden="true">↗</span></a>
        </div>
      `;
      item.querySelector('.story-title').textContent = project.title;
      item.querySelector('.story-excerpt').textContent = project.description;
      item.querySelector('.story-pub').textContent = project.tech.join(' · ');
      item.querySelector('.project-details-copy').textContent = project.description;
      item.querySelector('.project-visit-button').href = project.url;

      const trigger = item.querySelector('.project-trigger');
      const details = item.querySelector('.project-details');
      const arrow = item.querySelector('.story-arrow');

      trigger.addEventListener('click', () => {
        const isOpen = trigger.getAttribute('aria-expanded') === 'true';

        // Keep only one project expanded at a time.
        container.querySelectorAll('.project-expandable.is-expanded').forEach(openItem => {
          if (openItem === item) return;
          openItem.classList.remove('is-expanded');
          const openTrigger = openItem.querySelector('.project-trigger');
          const openDetails = openItem.querySelector('.project-details');
          const openArrow = openItem.querySelector('.story-arrow');
          if (openTrigger) openTrigger.setAttribute('aria-expanded', 'false');
          if (openDetails) openDetails.hidden = true;
          if (openArrow) openArrow.textContent = '＋';
        });

        trigger.setAttribute('aria-expanded', String(!isOpen));
        details.hidden = isOpen;
        item.classList.toggle('is-expanded', !isOpen);
        arrow.textContent = isOpen ? '＋' : '−';
      });

      container.appendChild(item);
    });

    initAnimatedList();
  }

  // ── Render AEO FAQ project (FAQ tab) ──
  function renderFaqProject(data) {
    container.querySelectorAll(CLEAR_SELECTOR).forEach(el => el.remove());

    const layout = document.createElement('div');
    layout.className = 'faq-layout';

    const { intro, topics, companies } = data;

    const intro_el = document.createElement('div');
    intro_el.className = 'faq-intro';
    intro_el.innerHTML = `
      <p class="faq-kicker"></p>
      <h4 class="faq-heading"></h4>
      <p class="faq-summary"></p>
      <div class="faq-block">
        <p class="faq-block-label">The goal</p>
        <p class="faq-block-copy faq-goal"></p>
      </div>
      <div class="faq-block">
        <p class="faq-block-label">What I did</p>
        <ul class="faq-work-list"></ul>
      </div>
      <p class="faq-examples-label">Live examples</p>
    `;
    intro_el.querySelector('.faq-kicker').textContent = intro.kicker;
    intro_el.querySelector('.faq-heading').textContent = intro.title;
    intro_el.querySelector('.faq-summary').textContent = intro.summary;
    intro_el.querySelector('.faq-goal').textContent = intro.goal;
    const list = intro_el.querySelector('.faq-work-list');
    intro.work.forEach(point => {
      const li = document.createElement('li');
      li.textContent = point;
      list.appendChild(li);
    });
    layout.appendChild(intro_el);

    const arrowIcon = `<svg width="11" height="11" viewBox="0 0 15 15" fill="none" aria-hidden="true">
      <path d="M3.64645 11.3536C3.45118 11.1583 3.45118 10.8417 3.64645 10.6465L10.2929 4L6 4C5.72386 4 5.5 3.77614 5.5 3.5C5.5 3.22386 5.72386 3 6 3L11.5 3C11.6326 3 11.7598 3.05268 11.8536 3.14645C11.9473 3.24022 12 3.36739 12 3.5L12 9.00001C12 9.27615 11.7761 9.50001 11.5 9.50001C11.2239 9.50001 11 9.27615 11 9.00001V4.70711L4.35355 11.3536C4.15829 11.5488 3.84171 11.5488 3.64645 11.3536Z"
        fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"/>
    </svg>`;

    companies.forEach(c => {
      const item = document.createElement('div');
      item.className = 'faq-company';
      item.innerHTML = `
        <button class="faq-company-trigger" type="button" aria-expanded="false">
          <div class="faq-company-text">
            <p class="faq-company-pub"><span class="faq-company-name"></span> · <span class="faq-company-count"></span></p>
            <p class="faq-company-title"></p>
            <p class="faq-company-angle"></p>
          </div>
          <span class="faq-company-arrow" aria-hidden="true">＋</span>
        </button>
        <div class="faq-company-details" hidden>
          <p class="faq-company-copy"></p>
          <div class="faq-link-list"></div>
        </div>
      `;
      item.querySelector('.faq-company-name').textContent = c.company;
      item.querySelector('.faq-company-count').textContent =
        `${c.faqs.length} FAQ page${c.faqs.length === 1 ? '' : 's'}`;
      item.querySelector('.faq-company-title').textContent = c.title;
      item.querySelector('.faq-company-angle').textContent = c.angle;
      item.querySelector('.faq-company-copy').textContent = c.angle;

      const linkList = item.querySelector('.faq-link-list');
      c.faqs.forEach(slug => {
        const a = document.createElement('a');
        a.className = 'faq-link';
        a.href = c.base + slug;
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
        a.innerHTML = `<span class="faq-link-label"></span>${arrowIcon}`;
        a.querySelector('.faq-link-label').textContent = topics[slug] || slug;
        linkList.appendChild(a);
      });

      const trigger = item.querySelector('.faq-company-trigger');
      const details = item.querySelector('.faq-company-details');
      const arrow   = item.querySelector('.faq-company-arrow');

      trigger.addEventListener('click', () => {
        const isOpen = trigger.getAttribute('aria-expanded') === 'true';

        // Keep only one company expanded at a time.
        layout.querySelectorAll('.faq-company.is-open').forEach(other => {
          if (other === item) return;
          other.classList.remove('is-open');
          other.querySelector('.faq-company-trigger').setAttribute('aria-expanded', 'false');
          other.querySelector('.faq-company-details').hidden = true;
          other.querySelector('.faq-company-arrow').textContent = '＋';
        });

        trigger.setAttribute('aria-expanded', String(!isOpen));
        details.hidden = isOpen;
        item.classList.toggle('is-open', !isOpen);
        arrow.textContent = isOpen ? '＋' : '−';
      });

      layout.appendChild(item);
    });

    container.appendChild(layout);
  }

  // ── Animated sliding background ──
  function initAnimatedList() {
    container.querySelectorAll('.story-item').forEach(item => {
      item.addEventListener('mouseenter', () => {
        const listRect = container.getBoundingClientRect();
        const itemRect = item.getBoundingClientRect();
        bg.style.opacity = '1';
        bg.style.top     = `${itemRect.top - listRect.top}px`;
        bg.style.height  = `${itemRect.height}px`;
      });
    });
    container.addEventListener('mouseleave', () => { bg.style.opacity = '0'; });
  }

  // ── Tabs: underline indicator, click and keyboard ──
  const tabLine = document.getElementById('filter-line');
  const tabList = [...filters];

  function moveTabLine(tab) {
    tabLine.style.width = `${tab.offsetWidth}px`;
    tabLine.style.transform = `translateX(${tab.offsetLeft}px)`;
  }

  function selectTab(tab, focus) {
    tabList.forEach(t => {
      const selected = t === tab;
      t.setAttribute('aria-selected', String(selected));
      t.tabIndex = selected ? 0 : -1;
    });
    moveTabLine(tab);
    if (focus) tab.focus();

    const name = tab.dataset.filter;
    if (name === 'content') {
      renderStories(allStories);
    } else if (name === 'faq') {
      if (faqData) renderFaqProject(faqData);
    } else {
      renderDevProjects(allDevProjects);
    }
  }

  tabList.forEach((tab, i) => {
    tab.addEventListener('click', () => selectTab(tab));
    tab.addEventListener('keydown', e => {
      if (e.key === 'ArrowRight') { e.preventDefault(); selectTab(tabList[(i + 1) % tabList.length], true); }
      if (e.key === 'ArrowLeft')  { e.preventDefault(); selectTab(tabList[(i - 1 + tabList.length) % tabList.length], true); }
      if (e.key === 'Home')       { e.preventDefault(); selectTab(tabList[0], true); }
      if (e.key === 'End')        { e.preventDefault(); selectTab(tabList[tabList.length - 1], true); }
    });
  });

  // Position the underline on load, after fonts settle, and on resize.
  const currentTab = () => tabList.find(t => t.getAttribute('aria-selected') === 'true');
  moveTabLine(currentTab());
  window.addEventListener('resize', () => moveTabLine(currentTab()));
  if (document.fonts) document.fonts.ready.then(() => moveTabLine(currentTab()));

  // ── Fetch all JSON files in parallel ──
  Promise.all([
    fetch('stories.json').then(res => {
      if (!res.ok) throw new Error('Could not load stories.json');
      return res.json();
    }),
    fetch('devProjects.json').then(res => {
      if (!res.ok) throw new Error('Could not load devProjects.json');
      return res.json();
    }),
    fetch('faqProjects.json').then(res => {
      if (!res.ok) throw new Error('Could not load faqProjects.json');
      return res.json();
    }),
  ])
    .then(([stories, devProjects, faq]) => {
      allStories     = stories;
      allDevProjects = devProjects;
      faqData        = faq;
      // Render whichever tab is selected by default (first tab in index.html).
      const defaultTab = currentTab().dataset.filter;
      if (defaultTab === 'faq') renderFaqProject(faqData);
      else if (defaultTab === 'dev') renderDevProjects(allDevProjects);
      else renderStories(allStories);
    })
    .catch(err => {
      console.error('Error fetching data:', err);
      container.innerHTML = '<p class="empty-state">Sorry, content could not be loaded at this time.</p>';
    });

});
