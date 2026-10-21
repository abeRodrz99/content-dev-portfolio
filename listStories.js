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
        number: '01',
        title: 'SEO & Generative Engine Optimization',
        description: 'Search-focused explainers, evergreen guides and topic-led content designed to answer real questions and help audiences discover useful information.',
        category: 'SEO & GEO',
        primary: true
      },
      {
        number: '02',
        title: 'Investigative & Accountability Reporting',
        description: 'Evidence-led reporting on public institutions and unequal outcomes, using records, data and on-the-ground reporting to examine who is affected and why.',
        category: 'Investigative & Accountability Reporting',
        primary: false
      },
      {
        number: '03',
        title: 'General & Feature Reporting',
        description: 'Profiles, community reporting and industry stories that bring people’s experiences, local context and emerging trends into focus.',
        category: 'General & Feature Reporting',
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
            <span class="content-group-number">${group.number}</span>
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
    container.querySelectorAll('.story-item, .empty-state, .content-layout').forEach(el => el.remove());

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
      renderStories(allStories);
    })
    .catch(err => {
      console.error('Error fetching data:', err);
      container.innerHTML = '<p class="empty-state">Sorry, content could not be loaded at this time.</p>';
    });

});
