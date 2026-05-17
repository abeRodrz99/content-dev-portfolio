document.addEventListener('DOMContentLoaded', () => {

  const container = document.getElementById('portfolio-content');
  const bg        = document.getElementById('story-list-bg');
  const filters   = document.querySelectorAll('.filter-btn');
  let allStories  = [];

  // ── Render stories ──
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

  // ── Filter click ──
  filters.forEach(filter => {
    filter.addEventListener('click', () => {
      filters.forEach(f => f.classList.remove('active'));
      filter.classList.add('active');

      const category = filter.dataset.filter;
      const filtered = category === 'All'
        ? allStories
        : allStories.filter(s => s.category === category);

      renderStories(filtered);
    });
  });

  // ── Fetch stories.json ──
  fetch('stories.json')
    .then(res => {
      if (!res.ok) throw new Error('Network response was not ok');
      return res.json();
    })
    .then(stories => {
      allStories = stories;
      renderStories(allStories);
    })
    .catch(err => {
      console.error('Error fetching stories:', err);
      container.innerHTML = '<p class="empty-state">Sorry, stories could not be loaded at this time.</p>';
    });

});
