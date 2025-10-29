// ========================================
// FOLDER COMPONENT - JavaScript Vanilla
// ========================================

function darkenColor(hex, percent) {
  let color = hex.startsWith('#') ? hex.slice(1) : hex;
  if (color.length === 3) {
    color = color
      .split('')
      .map(c => c + c)
      .join('');
  }
  const num = parseInt(color, 16);
  let r = (num >> 16) & 0xff;
  let g = (num >> 8) & 0xff;
  let b = num & 0xff;
  r = Math.max(0, Math.min(255, Math.floor(r * (1 - percent))));
  g = Math.max(0, Math.min(255, Math.floor(g * (1 - percent))));
  b = Math.max(0, Math.min(255, Math.floor(b * (1 - percent))));
  return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();
}

class Folder {
  constructor(options = {}) {
    this.options = {
      color: options.color || '#ffffff',
      size: options.size || 1,
      items: options.items || [],
      container: options.container,
      clickable: options.clickable || false,
      href: options.href || null
    };

    this.open = false;
    this.paperOffsets = Array.from({ length: 3 }, () => ({ x: 0, y: 0 }));
    this.folderElement = null;

    this.init();
  }

  init() {
    const maxItems = 3;
    const papers = this.options.items.slice(0, maxItems);
    while (papers.length < maxItems) {
      papers.push(null);
    }

    const folderBackColor = darkenColor(this.options.color, 0.08);
    const paper1 = darkenColor('#ffffff', 0.1);
    const paper2 = darkenColor('#ffffff', 0.05);
    const paper3 = '#ffffff';

    // Create folder structure
    const folderWrapper = document.createElement('div');
    folderWrapper.style.transform = `scale(${this.options.size})`;
    folderWrapper.className = this.options.className || '';

    const folder = document.createElement('div');
    folder.className = 'folder';
    folder.style.setProperty('--folder-color', this.options.color);
    folder.style.setProperty('--folder-back-color', folderBackColor);
    folder.style.setProperty('--paper-1', paper1);
    folder.style.setProperty('--paper-2', paper2);
    folder.style.setProperty('--paper-3', paper3);

    const folderBack = document.createElement('div');
    folderBack.className = 'folder__back';

    // Create papers
    papers.forEach((item, i) => {
      const paper = document.createElement('div');
      paper.className = `paper paper-${i + 1}`;
      
      if (item) {
        if (typeof item === 'string') {
          paper.textContent = item;
        } else if (item.nodeType) {
          paper.appendChild(item);
        } else {
          paper.innerHTML = item;
        }
      }

      paper.addEventListener('mousemove', (e) => this.handlePaperMouseMove(e, i));
      paper.addEventListener('mouseleave', (e) => this.handlePaperMouseLeave(e, i));

      folderBack.appendChild(paper);
    });

    const folderFront = document.createElement('div');
    folderFront.className = 'folder__front';

    const folderFrontRight = document.createElement('div');
    folderFrontRight.className = 'folder__front right';

    folderBack.appendChild(folderFront);
    folderBack.appendChild(folderFrontRight);
    folder.appendChild(folderBack);
    folderWrapper.appendChild(folder);

    this.folderElement = folder;
    this.papers = folderBack.querySelectorAll('.paper');

    // Si cliquable, rediriger vers le lien au lieu d'ouvrir/fermer
    if (this.options.clickable && this.options.href) {
      folder.style.cursor = 'pointer';
      folderWrapper.addEventListener('click', (e) => {
        e.preventDefault();
        window.open(this.options.href, '_blank', 'noopener,noreferrer');
      });
    } else {
      folder.addEventListener('click', () => this.handleClick());
    }

    this.folderWrapper = folderWrapper;
    this.containerElement = this.options.container;

    if (this.options.container) {
      this.options.container.appendChild(folderWrapper);
    }

    return folderWrapper;
  }

  handleClick() {
    this.open = !this.open;
    const folder = this.folderElement;
    
    if (this.open) {
      folder.classList.add('open');
    } else {
      folder.classList.remove('open');
      this.paperOffsets = Array.from({ length: 3 }, () => ({ x: 0, y: 0 }));
      this.updatePaperOffsets();
    }
  }

  handlePaperMouseMove(e, index) {
    if (!this.open) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const offsetX = (e.clientX - centerX) * 0.15;
    const offsetY = (e.clientY - centerY) * 0.15;
    
    this.paperOffsets[index] = { x: offsetX, y: offsetY };
    this.updatePaperOffsets();
  }

  handlePaperMouseLeave(e, index) {
    this.paperOffsets[index] = { x: 0, y: 0 };
    this.updatePaperOffsets();
  }

  updatePaperOffsets() {
    if (!this.papers) return;
    
    this.papers.forEach((paper, i) => {
      if (this.open && this.paperOffsets[i]) {
        const x = this.paperOffsets[i].x || 0;
        const y = this.paperOffsets[i].y || 0;
        paper.style.setProperty('--magnet-x', `${x}px`);
        paper.style.setProperty('--magnet-y', `${y}px`);
      } else {
        paper.style.setProperty('--magnet-x', '0px');
        paper.style.setProperty('--magnet-y', '0px');
      }
    });
  }
}

// Initialize Portfolio Folders
document.addEventListener('DOMContentLoaded', () => {
  const portfolioGrid = document.querySelector('.portfolio-grid');
  if (!portfolioGrid) return;

  const portfolioItems = [
    {
      title: 'Site Vitrine',
      color: '#ffffff',
      items: ['Design', 'Responsive', 'SEO']
    }
  ];

  portfolioItems.forEach((item, index) => {
    const portfolioItem = document.createElement('div');
    portfolioItem.className = 'portfolio-item';

    const folderContainer = document.createElement('div');
    folderContainer.style.height = '200px';
    folderContainer.style.position = 'relative';
    folderContainer.style.display = 'flex';
    folderContainer.style.alignItems = 'center';
    folderContainer.style.justifyContent = 'center';
    
    // Rendre le dossier cliquable pour rediriger vers le site
    const folder = new Folder({
      color: item.color,
      size: 2,
      items: item.items,
      container: folderContainer,
      className: 'custom-folder',
      clickable: index === 0,
      href: index === 0 ? 'https://lestatouables.netlify.app' : null
    });

    // Ajouter le texte sous le dossier pour le premier item
    if (index === 0) {
      const description = document.createElement('div');
      description.className = 'portfolio-item-description';
      description.textContent = 'Site web pour salon de tatouage';
      portfolioItem.appendChild(description);
    }

    portfolioGrid.appendChild(portfolioItem);
    portfolioItem.appendChild(folderContainer);
  });
});

