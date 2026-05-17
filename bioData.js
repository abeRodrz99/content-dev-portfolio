const bioData = {
  name: 'Abel Rodriguez',
  taglines: [
    'Writer · Chicago, IL',
    'Built In · Forbes · CNN',
    'SEO & Digital Media',
    '5+ years of experience',
  ],
  textBody: `I'm a content writer with over 5 years of experience in SEO and digital media.
    My work has been featured in global publications like
    <strong>Built In</strong>, <strong>Forbes</strong>, and <strong>CNN</strong>.
    I specialize in crafting search-optimized content that helps brands grow their
    reach and connect with the right audiences.`,
  links: [
    { label: 'Résumé',        href: 'https://docs.google.com/document/d/1IRCud1n9bIpWrg_Cdb805QU_5mVFtTHnvhCTkAM0vdM/edit?usp=sharing' },
    { label: 'LinkedIn',      href: 'https://www.linkedin.com/in/abel-rodriguez-782b33175/' },
  ],
};

const arrowSvg = `<svg width="11" height="11" viewBox="0 0 15 15" fill="none">
  <path d="M3.64645 11.3536C3.45118 11.1583 3.45118 10.8417 3.64645 10.6465L10.2929 4L6 4C5.72386 4 5.5 3.77614 5.5 3.5C5.5 3.22386 5.72386 3 6 3L11.5 3C11.6326 3 11.7598 3.05268 11.8536 3.14645C11.9473 3.24022 12 3.36739 12 3.5L12 9.00001C12 9.27615 11.7761 9.50001 11.5 9.50001C11.2239 9.50001 11 9.27615 11 9.00001V4.70711L4.35355 11.3536C4.15829 11.5488 3.84171 11.5488 3.64645 11.3536Z"
  fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"/>
</svg>`;

// ── Header ──
const header = document.getElementById('bio-header');
header.innerHTML = `
  <span class="header-name">${bioData.name}</span>
  <div class="header-tagline">
    <div class="tagline-inner" id="tagline-inner">
      ${bioData.taglines.map(t => `<span>${t}</span>`).join('')}
    </div>
  </div>
`;

// ── Bio section ──
const bioContainer = document.getElementById('bio-container');
bioContainer.innerHTML = `
  <p class="bio-text">${bioData.textBody}</p>
  <div class="publications">
    ${bioData.links.map(l => `
      <a class="magnetic-link" href="${l.href}" target="_blank" rel="noopener">
        ${l.label} ${arrowSvg}
      </a>
    `).join('')}
  </div>
`;

// ── Tagline fade loop ──
const inner = document.getElementById('tagline-inner');
const taglineItems = [...inner.querySelectorAll('span')];
let taglineIndex = 0;
taglineItems[0].classList.add('active');

setInterval(() => {
  taglineItems[taglineIndex].classList.remove('active');
  taglineIndex = (taglineIndex + 1) % taglineItems.length;
  taglineItems[taglineIndex].classList.add('active');
}, 3000);
