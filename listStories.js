document.addEventListener('DOMContentLoaded', () => {

  const container = document.getElementById('portfolio-content');
  const bg        = document.getElementById('story-list-bg');
  const filters   = document.querySelectorAll('.filter-btn');
  let allStories     = [];
  let allDevProjects = [];

  // ── Render stories (Content tab) ──
  function renderStories(storiesToShow) {
    container.querySelectorAll('.story-item, .empty-state, .content-layout').forEach(el => el.remove());

    const layout = document.createElement('div');
    layout.className = 'content-layout';


    const groups = [
      {
        id: 'seo-geo',
        number: '01',
        title: 'SEO & Generative Engine Optimization',
        description: 'Search strategy, evergreen content and AI search visibility.',
        primary: true,
        stories: []
      },
      {
        id: 'investigative',
        number: '02',
        title: 'Investigative Reporting',
        description: 'Original research, accountability and deep-dive reporting.',
        primary: false,
        stories: []
      },
      {
        id: 'general-reporting',
        number: '03',
        title: 'General Reporting',
        description: 'News, interviews, explainers and broader editorial coverage.',
        primary: false,
        stories: []
      }
    ];

    // Keep every existing article intact and visible until the user assigns pieces to specialties.
    const unassigned = document.createElement('section');
    unassigned.className = 'content-group content-unassigned';
    unassigned.innerHTML = `
      <button class="content-group-trigger" type="button" aria-expanded="true">
        <span class="content-group-heading">
          <span class="content-group-number">—</span>
          <span class="content-group-title-wrap">
            <span class="content-group-title">All published work</span>
            <span class="content-group-description">Articles are preserved here until you decide which specialty each belongs in.</span>
          </span>
        </span>
        <span class="content-group-icon" aria-hidden="true">−</span>
      </button>
      <div class="content-group-body"></div>
    `;
    const unassignedTrigger = unassigned.querySelector('.content-group-trigger');
    const unassignedBody = unassigned.querySelector('.content-group-body');
    unassignedTrigger.addEventListener('click', () => {
      const open = unassignedTrigger.getAttribute('aria-expanded') === 'true';
      unassignedTrigger.setAttribute('aria-expanded', String(!open));
      unassignedBody.hidden = open;
      unassigned.classList.toggle('is-open', !open);
      unassigned.querySelector('.content-group-icon').textContent = open ? '+' : '−';
    });

    storiesToShow.forEach(story => {
      const a = document.createElement('a');
      a.className = 'story-item content-story';
      a.href = story.url;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      a.innerHTML = `
        <div class="story-inner">
          <div class="story-text">
            <p class="story-pub">${story.publication}</p>
            <p class="story-title"></p>
            <p class="story-excerpt"></p>
          </div>
          <span class="story-arrow" aria-hidden="true">↗</span>
        </div>
      `;
      a.querySelector('.story-title').textContent = story.title;
      a.querySelector('.story-excerpt').textContent = story.excerpt;
      unassignedBody.appendChild(a);
    });

    groups.forEach(group => {
      const section = document.createElement('section');
      section.className = `content-group${group.primary ? ' content-group-primary is-open' : ''}`;
      section.innerHTML = `
        <button class="content-group-trigger" type="button" aria-expanded="${group.primary ? 'true' : 'false'}">
          <span class="content-group-heading">
            <span class="content-group-number">${group.number}</span>
            <span class="content-group-title-wrap">
              <span class="content-group-title">${group.title}</span>
              <span class="content-group-description">${group.description}</span>
            </span>
          </span>
          <span class="content-group-icon" aria-hidden="true">${group.primary ? '−' : '+'}</span>
        </button>
        <div class="content-group-body"${group.primary ? '' : ' hidden'}>
          <p class="content-group-placeholder">We’ll add selected articles here once you decide which pieces belong in this specialty.</p>
        </div>
      `;
      const trigger = section.querySelector('.content-group-trigger');
      const body = section.querySelector('.content-group-body');
      trigger.addEventListener('click', () => {
        const open = trigger.getAttribute('aria-expanded') === 'true';
        trigger.setAttribute('aria-expanded', String(!open));
        body.hidden = open;
        section.classList.toggle('is-open', !open);
        section.querySelector('.content-group-icon').textContent = open ? '+' : '−';
      });
      layout.appendChild(section);
    });

    layout.appendChild(unassigned);
    container.appendChild(layout);
    initAnimatedList();
  }

  // ── Render dev projects (Dev tab) ──
  function renderDevProjects(projectsToShow) {
    container.querySelectorAll('.story-item, .empty-state').forEach(el => el.remove());

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
              <p class="story-title">${project.title}</p>
              <p class="story-excerpt">${project.description}</p>
              <p class="story-pub">${project.tech.join(' · ')}</p>
            </div>
            <span class="story-arrow" aria-hidden="true">＋</span>
          </div>
        </button>
        <div class="project-details" hidden>
          <p class="project-details-copy">${project.description}</p>
          <a class="project-visit-button" href="${project.url}" target="_blank" rel="noopener noreferrer">View site <span aria-hidden="true">↗</span></a>
        </div>
      `;

      const trigger = item.querySelector('.project-trigger');
      const details = item.querySelector('.project-details');
      const arrow = item.querySelector('.story-arrow');

      trigger.addEventListener('click', () => {
        const isOpen = trigger.getAttribute('aria-expanded') === 'true';
        trigger.setAttribute('aria-expanded', String(!isOpen));
        details.hidden = isOpen;
        item.classList.toggle('is-expanded', !isOpen);
        arrow.textContent = isOpen ? '＋' : '−';
      });

      container.appendChild(item);
    });

    initAnimatedList();
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

  // ── Tab click ──
  filters.forEach(filter => {
    filter.addEventListener('click', () => {
      filters.forEach(f => f.classList.remove('active'));
      filter.classList.add('active');

      if (filter.dataset.filter === 'content') {
        renderStories(allStories);
      } else {
        renderDevProjects(allDevProjects);
      }
    });
  });

  // ── Fetch both JSON files in parallel ──
  Promise.all([
    fetch('stories.json').then(res => {
      if (!res.ok) throw new Error('Could not load stories.json');
      return res.json();
    }),
    fetch('devProjects.json').then(res => {
      if (!res.ok) throw new Error('Could not load devProjects.json');
      return res.json();
    }),
  ])
    .then(([stories, devProjects]) => {
      allStories     = stories;
      allDevProjects = devProjects;
      renderStories(allStories); // default to Content tab on load
    })
    .catch(err => {
      console.error('Error fetching data:', err);
      container.innerHTML = '<p class="empty-state">Sorry, content could not be loaded at this time.</p>';
    });

});
