// ========================================
// COLOR BENDS - JavaScript Vanilla (avec Three.js)
// ========================================

const MAX_COLORS = 8;

const frag = `
#define MAX_COLORS ${MAX_COLORS}
uniform vec2 uCanvas;
uniform float uTime;
uniform float uSpeed;
uniform vec2 uRot;
uniform int uColorCount;
uniform vec3 uColors[MAX_COLORS];
uniform int uTransparent;
uniform float uScale;
uniform float uFrequency;
uniform float uWarpStrength;
uniform vec2 uPointer;
uniform float uMouseInfluence;
uniform float uParallax;
uniform float uNoise;
varying vec2 vUv;

void main() {
  float t = uTime * uSpeed;
  vec2 p = vUv * 2.0 - 1.0;
  p += uPointer * uParallax * 0.1;
  vec2 rp = vec2(p.x * uRot.x - p.y * uRot.y, p.x * uRot.y + p.y * uRot.x);
  vec2 q = vec2(rp.x * (uCanvas.x / uCanvas.y), rp.y);
  q /= max(uScale, 0.0001);
  q /= 0.5 + 0.2 * dot(q, q);
  q += 0.2 * cos(t) - 7.56;
  vec2 toward = (uPointer - rp);
  q += toward * uMouseInfluence * 0.2;

    vec3 col = vec3(0.0);
    float a = 1.0;

    if (uColorCount > 0) {
      vec2 s = q;
      vec3 sumCol = vec3(0.0);
      float cover = 0.0;
      for (int i = 0; i < MAX_COLORS; ++i) {
            if (i >= uColorCount) break;
            s -= 0.01;
            vec2 r = sin(1.5 * (s.yx * uFrequency) + 2.0 * cos(s * uFrequency));
            float m0 = length(r + sin(5.0 * r.y * uFrequency - 3.0 * t + float(i)) / 4.0);
            float kBelow = clamp(uWarpStrength, 0.0, 1.0);
            float kMix = pow(kBelow, 0.3);
            float gain = 1.0 + max(uWarpStrength - 1.0, 0.0);
            vec2 disp = (r - s) * kBelow;
            vec2 warped = s + disp * gain;
            float m1 = length(warped + sin(5.0 * warped.y * uFrequency - 3.0 * t + float(i)) / 4.0);
            float m = mix(m0, m1, kMix);
            float w = 1.0 - exp(-6.0 / exp(6.0 * m));
            sumCol += uColors[i] * w;
            cover = max(cover, w);
      }
      col = clamp(sumCol, 0.0, 1.0);
      a = uTransparent > 0 ? cover : 1.0;
    } else {
        vec2 s = q;
        for (int k = 0; k < 3; ++k) {
            s -= 0.01;
            vec2 r = sin(1.5 * (s.yx * uFrequency) + 2.0 * cos(s * uFrequency));
            float m0 = length(r + sin(5.0 * r.y * uFrequency - 3.0 * t + float(k)) / 4.0);
            float kBelow = clamp(uWarpStrength, 0.0, 1.0);
            float kMix = pow(kBelow, 0.3);
            float gain = 1.0 + max(uWarpStrength - 1.0, 0.0);
            vec2 disp = (r - s) * kBelow;
            vec2 warped = s + disp * gain;
            float m1 = length(warped + sin(5.0 * warped.y * uFrequency - 3.0 * t + float(k)) / 4.0);
            float m = mix(m0, m1, kMix);
            col[k] = 1.0 - exp(-6.0 / exp(6.0 * m));
        }
        a = uTransparent > 0 ? max(max(col.r, col.g), col.b) : 1.0;
    }

    if (uNoise > 0.0001) {
      float n = fract(sin(dot(gl_FragCoord.xy + vec2(uTime), vec2(12.9898, 78.233))) * 43758.5453123);
      col += (n - 0.5) * uNoise;
      col = clamp(col, 0.0, 1.0);
    }

    vec3 rgb = (uTransparent > 0) ? col * a : col;
    gl_FragColor = vec4(rgb, a);
}
`;

const vert = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 1.0);
}
`;

// Charger Three.js depuis CDN
const loadThree = () => {
  return new Promise((resolve, reject) => {
    if (window.THREE && window.THREE.Scene) {
      console.log('Three.js already loaded');
      resolve(window.THREE);
      return;
    }
    
    console.log('Loading Three.js from CDN...');
    
    const cdnUrls = [
      'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.min.js',
      'https://unpkg.com/three@0.160.0/build/three.min.js',
      'https://cdn.skypack.dev/three@0.160.0'
    ];
    
    let attempt = 0;
    
    const tryLoad = () => {
      if (attempt >= cdnUrls.length) {
        console.error('All Three.js CDN attempts failed');
        reject(new Error('Three.js could not be loaded from any CDN'));
        return;
      }
      
      console.log(`Trying Three.js CDN ${attempt + 1}/${cdnUrls.length}: ${cdnUrls[attempt]}`);
      const script = document.createElement('script');
      script.src = cdnUrls[attempt];
      script.crossOrigin = 'anonymous';
      
      const cleanup = () => {
        if (script.parentNode) {
          script.parentNode.removeChild(script);
        }
      };
      
      script.onload = () => {
        console.log('Three.js script loaded, checking...');
        setTimeout(() => {
          if (window.THREE && window.THREE.Scene) {
            console.log('Three.js loaded successfully!');
            cleanup();
            resolve(window.THREE);
          } else {
            console.log('Three.js not found, trying next CDN...');
            cleanup();
            attempt++;
            tryLoad();
          }
        }, 100);
      };
      
      script.onerror = (e) => {
        console.error(`Failed to load from ${cdnUrls[attempt]}:`, e);
        cleanup();
        attempt++;
        tryLoad();
      };
      
      document.head.appendChild(script);
    };
    
    tryLoad();
  });
};

class ColorBends {
  constructor(options = {}) {
    this.options = {
      container: options.container,
      rotation: options.rotation || 30,
      speed: options.speed || 0.3,
      colors: options.colors || ["#ff5c7a", "#8a5cff", "#00ffd1"],
      transparent: options.transparent !== false,
      autoRotate: options.autoRotate || 0,
      scale: options.scale || 1.2,
      frequency: options.frequency || 1.4,
      warpStrength: options.warpStrength || 1.2,
      mouseInfluence: options.mouseInfluence || 0.8,
      parallax: options.parallax || 0.6,
      noise: options.noise || 0.08
    };

    this.container = null;
    this.renderer = null;
    this.raf = null;
    this.material = null;
    this.ro = null;
    this.rotationRef = this.options.rotation;
    this.autoRotateRef = this.options.autoRotate;
    this.pointerTarget = { x: 0, y: 0 };
    this.pointerCurrent = { x: 0, y: 0 };
    this.pointerSmooth = 8;
    this.handlePointerMove = null;
    this.clock = null;

    this.init();
  }

  async init() {
    if (!this.options.container) {
      console.error('ColorBends: No container provided');
      return;
    }

    console.log('ColorBends: Starting initialization...');

    try {
      console.log('ColorBends: Loading Three.js...');
      const THREE = await loadThree();
      console.log('ColorBends: Three.js loaded successfully', THREE);

      const scene = new THREE.Scene();
      // Camera orthographique pour couvrir tout l'écran
      const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

      const geometry = new THREE.PlaneGeometry(2, 2);
      const uColorsArray = Array.from({ length: MAX_COLORS }, () => new THREE.Vector3(0, 0, 0));

      const toVec3 = (hex) => {
        const h = hex.replace('#', '').trim();
        const v =
          h.length === 3
            ? [parseInt(h[0] + h[0], 16), parseInt(h[1] + h[1], 16), parseInt(h[2] + h[2], 16)]
            : [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
        return new THREE.Vector3(v[0] / 255, v[1] / 255, v[2] / 255);
      };

      const arr = (this.options.colors || []).filter(Boolean).slice(0, MAX_COLORS).map(toVec3);
      
      this.material = new THREE.ShaderMaterial({
        vertexShader: vert,
        fragmentShader: frag,
        uniforms: {
          uCanvas: { value: new THREE.Vector2(1, 1) },
          uTime: { value: 0 },
          uSpeed: { value: this.options.speed },
          uRot: { value: new THREE.Vector2(1, 0) },
          uColorCount: { value: arr.length },
          uColors: { value: uColorsArray },
          uTransparent: { value: this.options.transparent ? 1 : 0 },
          uScale: { value: this.options.scale },
          uFrequency: { value: this.options.frequency },
          uWarpStrength: { value: this.options.warpStrength },
          uPointer: { value: new THREE.Vector2(0, 0) },
          uMouseInfluence: { value: this.options.mouseInfluence },
          uParallax: { value: this.options.parallax },
          uNoise: { value: this.options.noise }
        },
        premultipliedAlpha: true,
        transparent: true
      });

      for (let i = 0; i < arr.length; i++) {
        this.material.uniforms.uColors.value[i].copy(arr[i]);
      }

      const mesh = new THREE.Mesh(geometry, this.material);
      scene.add(mesh);

      this.renderer = new THREE.WebGLRenderer({
        antialias: false,
        powerPreference: 'high-performance',
        alpha: true
      });

      this.renderer.outputColorSpace = THREE.SRGBColorSpace;
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      this.renderer.setClearColor(0x000000, this.options.transparent ? 0 : 1);
      this.renderer.domElement.style.width = '100%';
      this.renderer.domElement.style.height = '100%';
      this.renderer.domElement.style.display = 'block';
      this.renderer.domElement.style.position = 'absolute';
      this.renderer.domElement.style.top = '0';
      this.renderer.domElement.style.left = '0';
      this.renderer.domElement.style.zIndex = '0';
      this.options.container.appendChild(this.renderer.domElement);

      this.clock = new THREE.Clock();

      const handleResize = () => {
        const w = this.options.container.clientWidth || 1;
        const h = this.options.container.clientHeight || 1;
        this.renderer.setSize(w, h, false);
        this.material.uniforms.uCanvas.value.set(w, h);
      };

      handleResize();

      if ('ResizeObserver' in window) {
        this.ro = new ResizeObserver(handleResize);
        this.ro.observe(this.options.container);
      } else {
        window.addEventListener('resize', handleResize);
      }

      this.handlePointerMove = (e) => {
        const rect = this.options.container.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / (rect.width || 1)) * 2 - 1;
        const y = -(((e.clientY - rect.top) / (rect.height || 1)) * 2 - 1);
        this.pointerTarget.x = x;
        this.pointerTarget.y = y;
      };

      this.options.container.addEventListener('pointermove', this.handlePointerMove);

      const loop = () => {
        const dt = this.clock.getDelta();
        const elapsed = this.clock.elapsedTime;
        this.material.uniforms.uTime.value = elapsed;

        const deg = (this.rotationRef % 360) + this.autoRotateRef * elapsed;
        const rad = (deg * Math.PI) / 180;
        const c = Math.cos(rad);
        const s = Math.sin(rad);
        this.material.uniforms.uRot.value.set(c, s);

        const amt = Math.min(1, dt * this.pointerSmooth);
        this.pointerCurrent.x += (this.pointerTarget.x - this.pointerCurrent.x) * amt;
        this.pointerCurrent.y += (this.pointerTarget.y - this.pointerCurrent.y) * amt;
        this.material.uniforms.uPointer.value.set(this.pointerCurrent.x, this.pointerCurrent.y);

        this.renderer.render(scene, camera);
        this.raf = requestAnimationFrame(loop);
      };
      this.raf = requestAnimationFrame(loop);

      console.log('ColorBends: Initialization completed successfully');

    } catch (error) {
      console.error('Error initializing ColorBends:', error);
    }
  }

  destroy() {
    if (this.raf) {
      cancelAnimationFrame(this.raf);
    }
    if (this.ro) {
      this.ro.disconnect();
    }
    if (this.handlePointerMove && this.options.container) {
      this.options.container.removeEventListener('pointermove', this.handlePointerMove);
    }
    // Cleanup Three.js resources
    if (this.material) {
      this.material.dispose();
    }
    if (this.renderer && this.renderer.domElement && this.options.container) {
      if (this.renderer.domElement.parentElement === this.options.container) {
        this.options.container.removeChild(this.renderer.domElement);
      }
      this.renderer.dispose();
    }
  }
}

// Initialize ColorBends on hero section
function initColorBends() {
  const heroSection = document.querySelector('.section-hero-accueil');
  
  if (!heroSection) {
    return;
  }

  // Create container for color bends
  const colorBendsContainer = document.createElement('div');
  colorBendsContainer.className = 'color-bends-container';
  colorBendsContainer.style.position = 'absolute';
  colorBendsContainer.style.top = '0';
  colorBendsContainer.style.left = '0';
  colorBendsContainer.style.width = '100%';
  colorBendsContainer.style.height = '100%';
  colorBendsContainer.style.zIndex = '0';
  
  heroSection.style.position = 'relative';
  heroSection.style.background = 'transparent';
  heroSection.style.setProperty('background', 'transparent', 'important');
  heroSection.insertBefore(colorBendsContainer, heroSection.firstChild);

  // Make sure hero-content is above
  const heroContent = heroSection.querySelector('.hero-content');
  if (heroContent) {
    heroContent.style.position = 'relative';
    heroContent.style.zIndex = '1';
  }

  window.colorBends = new ColorBends({
    container: colorBendsContainer,
    colors: ["#ff5c7a", "#8a5cff", "#00ffd1"],
    rotation: 30,
    speed: 0.3,
    scale: 1.2,
    frequency: 1.4,
    warpStrength: 1.2,
    mouseInfluence: 0.8,
    parallax: 0.6,
    noise: 0.08,
    transparent: true
  });
}

// Try multiple times to ensure DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initColorBends);
} else {
  initColorBends();
}

// Also try on window load as backup
window.addEventListener('load', () => {
  if (!window.colorBends) {
    console.log('Retrying ColorBends initialization on window load...');
    initColorBends();
  }
});

