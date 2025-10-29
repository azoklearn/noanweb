// ========================================
// BUBBLE MENU - JavaScript Vanilla
// ========================================

class BubbleMenu {
  constructor(options = {}) {
    this.options = {
      logo: options.logo || '<span style="font-weight: 700;">NOANWEB</span>',
      items: options.items || this.getDefaultItems(),
      menuAriaLabel: options.menuAriaLabel || 'Toggle navigation',
      menuBg: options.menuBg || '#ffffff',
      menuContentColor: options.menuContentColor || '#111111',
      useFixedPosition: options.useFixedPosition !== undefined ? options.useFixedPosition : false,
      animationEase: options.animationEase || 'back.out(1.5)',
      animationDuration: options.animationDuration || 0.5,
      staggerDelay: options.staggerDelay || 0.12,
      onMenuClick: options.onMenuClick || null
    };

    this.isMenuOpen = false;
    this.showOverlay = false;
    this.bubblesRef = [];
    this.labelRefs = [];
    
    this.container = null;
    this.overlay = null;
    
    this.init();
  }

  getDefaultItems() {
    return [
      {
        label: 'accueil',
        href: '#hero',
        ariaLabel: 'Accueil',
        rotation: -8,
        hoverStyles: { bgColor: '#3b82f6', textColor: '#ffffff' }
      },
      {
        label: 'pourquoi',
        href: '#pourquoi',
        ariaLabel: 'Pourquoi un site web',
        rotation: 8,
        hoverStyles: { bgColor: '#10b981', textColor: '#ffffff' }
      },
      {
        label: 'services',
        href: '#services',
        ariaLabel: 'Services',
        rotation: 8,
        hoverStyles: { bgColor: '#f59e0b', textColor: '#ffffff' }
      },
      {
        label: 'contact',
        href: '#contact',
        ariaLabel: 'Contact',
        rotation: -8,
        hoverStyles: { bgColor: '#8b5cf6', textColor: '#ffffff' }
      }
    ];
  }

  init() {
    this.createMenu();
    this.attachEvents();
  }

  createMenu() {
    // Create container
    this.container = document.createElement('nav');
    this.container.className = `bubble-menu ${this.options.useFixedPosition ? 'fixed' : 'absolute'}`;
    this.container.setAttribute('aria-label', 'Main navigation');

    // Create logo bubble
    const logoBubble = document.createElement('div');
    logoBubble.className = 'bubble logo-bubble';
    logoBubble.setAttribute('aria-label', 'Logo');
    logoBubble.style.background = this.options.menuBg;
    
    const logoContent = document.createElement('span');
    logoContent.className = 'logo-content';
    logoContent.innerHTML = this.options.logo;
    logoBubble.appendChild(logoContent);
    this.container.appendChild(logoBubble);

    // Create toggle button
    const toggleBtn = document.createElement('button');
    toggleBtn.type = 'button';
    toggleBtn.className = 'bubble toggle-bubble menu-btn';
    toggleBtn.setAttribute('aria-label', this.options.menuAriaLabel);
    toggleBtn.setAttribute('aria-pressed', 'false');
    toggleBtn.style.background = this.options.menuBg;
    
    const line1 = document.createElement('span');
    line1.className = 'menu-line';
    line1.style.background = this.options.menuContentColor;
    
    const line2 = document.createElement('span');
    line2.className = 'menu-line short';
    line2.style.background = this.options.menuContentColor;
    
    toggleBtn.appendChild(line1);
    toggleBtn.appendChild(line2);
    this.container.appendChild(toggleBtn);

    // Create overlay
    this.overlay = document.createElement('div');
    this.overlay.className = `bubble-menu-items ${this.options.useFixedPosition ? 'fixed' : 'absolute'}`;
    this.overlay.setAttribute('aria-hidden', 'true');
    this.overlay.style.display = 'none';

    const pillList = document.createElement('ul');
    pillList.className = 'pill-list';
    pillList.setAttribute('role', 'menu');
    pillList.setAttribute('aria-label', 'Menu links');

    this.options.items.forEach((item, idx) => {
      const listItem = document.createElement('li');
      listItem.className = 'pill-col';
      listItem.setAttribute('role', 'none');

      const link = document.createElement('a');
      link.setAttribute('role', 'menuitem');
      link.href = item.href;
      link.setAttribute('aria-label', item.ariaLabel || item.label);
      link.className = 'pill-link';
      link.style.setProperty('--item-rot', `${item.rotation ?? 0}deg`);
      link.style.setProperty('--pill-bg', this.options.menuBg);
      link.style.setProperty('--pill-color', this.options.menuContentColor);
      link.style.setProperty('--hover-bg', item.hoverStyles?.bgColor || '#f3f4f6');
      link.style.setProperty('--hover-color', item.hoverStyles?.textColor || this.options.menuContentColor);

      const label = document.createElement('span');
      label.className = 'pill-label';
      label.textContent = item.label;
      
      link.appendChild(label);
      listItem.appendChild(link);
      pillList.appendChild(listItem);

      // Store refs
      this.bubblesRef.push(link);
      this.labelRefs.push(label);

      // Close menu on link click
      link.addEventListener('click', () => {
        this.handleToggle();
      });
    });

    this.overlay.appendChild(pillList);
    // Intégrer dans le header au lieu du body
    const header = document.querySelector('.header-container');
    if (header) {
      header.insertBefore(this.container, header.firstChild);
    } else {
      document.body.appendChild(this.container);
    }
    document.body.appendChild(this.overlay);
  }

  attachEvents() {
    const toggleBtn = this.container.querySelector('.menu-btn');
    if (toggleBtn) {
      toggleBtn.addEventListener('click', () => this.handleToggle());
    }

    // Handle resize for rotation
    window.addEventListener('resize', () => {
      if (this.isMenuOpen) {
        this.updateRotations();
      }
    });
  }

  handleToggle() {
    this.isMenuOpen = !this.isMenuOpen;
    const toggleBtn = this.container.querySelector('.menu-btn');
    
    if (toggleBtn) {
      toggleBtn.setAttribute('aria-pressed', this.isMenuOpen.toString());
      if (this.isMenuOpen) {
        toggleBtn.classList.add('open');
      } else {
        toggleBtn.classList.remove('open');
      }
    }

    if (this.isMenuOpen) {
      this.showOverlay = true;
    }

    if (this.options.onMenuClick) {
      this.options.onMenuClick(this.isMenuOpen);
    }

    this.animateMenu();
  }

  animateMenu() {
    const bubbles = this.bubblesRef.filter(Boolean);
    const labels = this.labelRefs.filter(Boolean);

    if (!this.overlay || !bubbles.length) return;

    if (this.isMenuOpen) {
      gsap.set(this.overlay, { display: 'flex' });
      gsap.killTweensOf([...bubbles, ...labels]);
      gsap.set(bubbles, { scale: 0, transformOrigin: '50% 50%' });
      gsap.set(labels, { y: 24, autoAlpha: 0 });

      bubbles.forEach((bubble, i) => {
        const delay = i * this.options.staggerDelay + gsap.utils.random(-0.05, 0.05);
        const tl = gsap.timeline({ delay });

        tl.to(bubble, {
          scale: 1,
          duration: this.options.animationDuration,
          ease: this.options.animationEase
        });
        
        if (labels[i]) {
          tl.to(
            labels[i],
            {
              y: 0,
              autoAlpha: 1,
              duration: this.options.animationDuration,
              ease: 'power3.out'
            },
            `-=${this.options.animationDuration * 0.9}`
          );
        }
      });
    } else if (this.showOverlay) {
      gsap.killTweensOf([...bubbles, ...labels]);
      gsap.to(labels, {
        y: 24,
        autoAlpha: 0,
        duration: 0.2,
        ease: 'power3.in'
      });
      gsap.to(bubbles, {
        scale: 0,
        duration: 0.2,
        ease: 'power3.in',
        onComplete: () => {
          gsap.set(this.overlay, { display: 'none' });
          this.showOverlay = false;
        }
      });
    }
  }

  updateRotations() {
    const bubbles = this.bubblesRef.filter(Boolean);
    const isDesktop = window.innerWidth >= 900;

    bubbles.forEach((bubble, i) => {
      const item = this.options.items[i];
      if (bubble && item) {
        const rotation = isDesktop ? (item.rotation ?? 0) : 0;
        gsap.set(bubble, { rotation });
      }
    });
  }

  destroy() {
    if (this.container) {
      this.container.remove();
    }
    if (this.overlay) {
      this.overlay.remove();
    }
  }
}

// Initialize Bubble Menu when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  if (typeof gsap !== 'undefined') {
    const bubbleMenu = new BubbleMenu({
      logo: '<span style="font-weight: 700; font-family: \'Rubik 80s Fade\', cursive; color: #fff; font-size: 1rem;">NOANWEB</span>',
      items: [
        {
          label: 'accueil',
          href: '#hero',
          ariaLabel: 'Accueil',
          rotation: -8,
          hoverStyles: { bgColor: '#000000', textColor: '#ffffff' }
        },
        {
          label: 'pourquoi',
          href: '#pourquoi',
          ariaLabel: 'Pourquoi un site web',
          rotation: 8,
          hoverStyles: { bgColor: '#333333', textColor: '#ffffff' }
        },
        {
          label: 'services',
          href: '#services',
          ariaLabel: 'Services',
          rotation: 8,
          hoverStyles: { bgColor: '#666666', textColor: '#ffffff' }
        },
        {
          label: 'contact',
          href: '#contact',
          ariaLabel: 'Contact',
          rotation: -8,
          hoverStyles: { bgColor: '#000000', textColor: '#ffffff' }
        }
      ],
      menuBg: '#ffffff',
      menuContentColor: '#000000',
      useFixedPosition: true,
      animationEase: 'back.out(1.5)',
      animationDuration: 0.5,
      staggerDelay: 0.12
    });

    // Store globally for potential access
    window.bubbleMenu = bubbleMenu;
  }
});

