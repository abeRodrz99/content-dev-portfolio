document.addEventListener('DOMContentLoaded', () => {

  const container = document.getElementById('portfolio-content');
  const bg        = document.getElementById('story-list-bg');
  const filters   = document.querySelectorAll('.filter-btn');
  let allStories     = [];
  let allDevProjects = [];

  // ── Render stories (Content tab) ──
  function renderStories(storiesToShow) {
    container.querySelectorAll('.story-item, .empty-state').forEach(el => el.remove());

    if (storiesToShow.length === 0) {
      const empty = document.createElement('p');
      empty.className = 'empty-state';
      empty.textContent = 'No stories in this category yet.';
      container.appendChild(empty);
      return;
    }

    storiesToShow.forEach(story => {
      const a = document.createElement('a');
      a.className = 'story-item';
      a.href = story.url;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      a.innerHTML = `
        <div class="story-inner">
          <img class="story-thumb" src="${story.imgUrl}" alt="${story.title}" loading="lazy" />
          <div class="story-text">
            <p class="story-pub">${story.publication}</p>
            <p class="story-title">${story.title}</p>
            <p class="story-excerpt">${story.excerpt}</p>
          </div>
          <span class="story-arrow">→</span>
        </div>
      `;
      container.appendChild(a);
    });

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
      const a = document.createElement('a');
      a.className = 'story-item';
      a.href = project.url;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      a.innerHTML = `
        <div class="story-inner">
          <div class="story-text">
            <p class="story-title">${project.title}</p>
            <p class="story-excerpt">${project.description}</p>
            <p class="story-pub">${project.tech.join(' · ')}</p>
          </div>
          <span class="story-arrow">→</span>
        </div>
      `;
      container.appendChild(a);
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
