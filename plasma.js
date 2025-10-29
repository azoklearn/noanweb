// ========================================
// PLASMA - JavaScript Vanilla (avec OGL)
// ========================================

// Charger OGL depuis CDN
const loadOGL = () => {
  return new Promise((resolve, reject) => {
    if (window.OGL && window.OGL.Renderer) {
      console.log('OGL already loaded');
      resolve(window.OGL);
      return;
    }
    
    console.log('Loading OGL from CDN...');
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/ogl@1.0.5/dist/index.umd.js';
    script.onload = () => {
      console.log('OGL script loaded, checking...');
      if (window.OGL && window.OGL.Renderer) {
        console.log('OGL loaded successfully!');
        resolve(window.OGL);
      } else {
        console.error('OGL not found in window object');
        reject(new Error('OGL not loaded'));
      }
    };
    script.onerror = (e) => {
      console.error('Failed to load OGL script:', e);
      reject(e);
    };
    document.head.appendChild(script);
  });
};

const hexToRgb = hex => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return [1, 0.5, 0.2];
  return [parseInt(result[1], 16) / 255, parseInt(result[2], 16) / 255, parseInt(result[3], 16) / 255];
};

// Vertex et fragment shaders adaptés pour WebGL 1 et 2
const getShaders = (useWebGL2) => {
  if (useWebGL2) {
    return {
      vertex: `#version 300 es
precision highp float;
in vec2 position;
in vec2 uv;
out vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 0.0, 1.0);
}`,
      fragment: `#version 300 es
precision highp float;
uniform vec2 iResolution;
uniform float iTime;
uniform vec3 uCustomColor;
uniform float uUseCustomColor;
uniform float uSpeed;
uniform float uDirection;
uniform float uScale;
uniform float uOpacity;
uniform vec2 uMouse;
uniform float uMouseInteractive;
out vec4 fragColor;

void mainImage(out vec4 o, vec2 C) {
  vec2 center = iResolution.xy * 0.5;
  C = (C - center) / uScale + center;
  
  vec2 mouseOffset = (uMouse - center) * 0.0002;
  C += mouseOffset * length(C - center) * step(0.5, uMouseInteractive);
  
  float i, d, z, T = iTime * uSpeed * uDirection;
  vec3 O, p, S;

  for (vec2 r = iResolution.xy, Q; ++i < 60.; O += o.w/d*o.xyz) {
    p = z*normalize(vec3(C-.5*r,r.y)); 
    p.z -= 4.; 
    S = p;
    d = p.y-T;
    
    p.x += .4*(1.+p.y)*sin(d + p.x*0.1)*cos(.34*d + p.x*0.05); 
    Q = p.xz *= mat2(cos(p.y+vec4(0,11,33,0)-T)); 
    z+= d = abs(sqrt(length(Q*Q)) - .25*(5.+S.y))/3.+8e-4; 
    o = 1.+sin(S.y+p.z*.5+S.z-length(S-p)+vec4(2,1,0,8));
  }
  
  o.xyz = tanh(O/1e4);
}

bool finite1(float x){ return !(isnan(x) || isinf(x)); }
vec3 sanitize(vec3 c){
  return vec3(
    finite1(c.r) ? c.r : 0.0,
    finite1(c.g) ? c.g : 0.0,
    finite1(c.b) ? c.b : 0.0
  );
}

void main() {
  vec4 o = vec4(0.0);
  mainImage(o, gl_FragCoord.xy);
  vec3 rgb = sanitize(o.rgb);
  
  float intensity = (rgb.r + rgb.g + rgb.b) / 3.0;
  vec3 customColor = intensity * uCustomColor;
  vec3 finalColor = mix(rgb, customColor, step(0.5, uUseCustomColor));
  
  float alpha = length(rgb) * uOpacity;
  fragColor = vec4(finalColor, alpha);
}`
    };
  } else {
    // WebGL 1 version
    return {
      vertex: `
precision highp float;
attribute vec2 position;
attribute vec2 uv;
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 0.0, 1.0);
}`,
      fragment: `
precision highp float;
uniform vec2 iResolution;
uniform float iTime;
uniform vec3 uCustomColor;
uniform float uUseCustomColor;
uniform float uSpeed;
uniform float uDirection;
uniform float uScale;
uniform float uOpacity;
uniform vec2 uMouse;
uniform float uMouseInteractive;
varying vec2 vUv;

void mainImage(out vec4 o, vec2 C) {
  vec2 center = iResolution.xy * 0.5;
  C = (C - center) / uScale + center;
  
  vec2 mouseOffset = (uMouse - center) * 0.0002;
  C += mouseOffset * length(C - center) * step(0.5, uMouseInteractive);
  
  float i, d, z, T = iTime * uSpeed * uDirection;
  vec3 O, p, S;

  for (vec2 r = iResolution.xy, Q; ++i < 60.; O += o.w/d*o.xyz) {
    p = z*normalize(vec3(C-.5*r,r.y)); 
    p.z -= 4.; 
    S = p;
    d = p.y-T;
    
    p.x += .4*(1.+p.y)*sin(d + p.x*0.1)*cos(.34*d + p.x*0.05); 
    Q = p.xz *= mat2(cos(p.y+vec4(0,11,33,0)-T)); 
    z+= d = abs(sqrt(length(Q*Q)) - .25*(5.+S.y))/3.+8e-4; 
    o = 1.+sin(S.y+p.z*.5+S.z-length(S-p)+vec4(2,1,0,8));
  }
  
  o.xyz = tanh(O/1e4);
}

bool finite1(float x){ return !(isnan(x) || isinf(x)); }
vec3 sanitize(vec3 c){
  return vec3(
    finite1(c.r) ? c.r : 0.0,
    finite1(c.g) ? c.g : 0.0,
    finite1(c.b) ? c.b : 0.0
  );
}

void main() {
  vec4 o = vec4(0.0);
  mainImage(o, gl_FragCoord.xy);
  vec3 rgb = sanitize(o.rgb);
  
  float intensity = (rgb.r + rgb.g + rgb.b) / 3.0;
  vec3 customColor = intensity * uCustomColor;
  vec3 finalColor = mix(rgb, customColor, step(0.5, uUseCustomColor));
  
  float alpha = length(rgb) * uOpacity;
  gl_FragColor = vec4(finalColor, alpha);
}`
    };
  }
};

class Plasma {
  constructor(options = {}) {
    this.options = {
      container: options.container,
      color: options.color || '#ff6b35',
      speed: options.speed || 0.6,
      direction: options.direction || 'forward',
      scale: options.scale || 1.1,
      opacity: options.opacity || 0.8,
      mouseInteractive: options.mouseInteractive !== false
    };

    this.container = null;
    this.raf = null;
    this.ro = null;
    this.mousePos = { x: 0, y: 0 };
    this.renderer = null;
    this.program = null;
    this.mesh = null;
    this.geometry = null;
    this.t0 = null;
    this.handleMouseMove = null;

    this.init();
  }

  async init() {
    if (!this.options.container) {
      console.error('Plasma: No container provided');
      return;
    }

    console.log('Plasma: Starting initialization...');

    try {
      console.log('Plasma: Loading OGL...');
      const OGL = await loadOGL();
      console.log('Plasma: OGL loaded successfully', OGL);
      const { Renderer, Program, Mesh, Triangle } = OGL;

      const useCustomColor = this.options.color ? 1.0 : 0.0;
      const customColorRgb = this.options.color ? hexToRgb(this.options.color) : [1, 1, 1];
      const directionMultiplier = this.options.direction === 'reverse' ? -1.0 : 1.0;

      // Vérifier si WebGL 2 est supporté
      const canvas = document.createElement('canvas');
      const gl2 = canvas.getContext('webgl2');
      const useWebGL2 = !!gl2;
      
      console.log('WebGL 2 supported:', useWebGL2);
      
      this.renderer = new Renderer({
        webgl: useWebGL2 ? 2 : 1,
        alpha: true,
        antialias: false,
        dpr: Math.min(window.devicePixelRatio || 1, 2)
      });
      const gl = this.renderer.gl;
      
      if (!gl) {
        throw new Error('WebGL not supported');
      }
      
      console.log('Renderer created, WebGL version:', gl.getParameter(gl.VERSION));
      
      // Obtenir les shaders selon la version WebGL
      const shaders = getShaders(useWebGL2);
      console.log('Using WebGL', useWebGL2 ? '2' : '1', 'shaders');
      
      const canvas = gl.canvas;
      
      canvas.style.display = 'block';
      canvas.style.width = '100%';
      canvas.style.height = '100%';
      canvas.style.position = 'absolute';
      canvas.style.top = '0';
      canvas.style.left = '0';
      canvas.style.zIndex = '0';
      this.options.container.appendChild(canvas);

      this.geometry = new Triangle(gl);

      this.program = new Program(gl, {
        vertex: shaders.vertex,
        fragment: shaders.fragment,
        uniforms: {
          iTime: { value: 0 },
          iResolution: { value: new Float32Array([1, 1]) },
          uCustomColor: { value: new Float32Array(customColorRgb) },
          uUseCustomColor: { value: useCustomColor },
          uSpeed: { value: this.options.speed * 0.4 },
          uDirection: { value: directionMultiplier },
          uScale: { value: this.options.scale },
          uOpacity: { value: this.options.opacity },
          uMouse: { value: new Float32Array([0, 0]) },
          uMouseInteractive: { value: this.options.mouseInteractive ? 1.0 : 0.0 }
        }
      });

      this.mesh = new Mesh(gl, { geometry: this.geometry, program: this.program });

      this.handleMouseMove = (e) => {
        if (!this.options.mouseInteractive) return;
        const rect = this.options.container.getBoundingClientRect();
        this.mousePos.x = e.clientX - rect.left;
        this.mousePos.y = e.clientY - rect.top;
        const mouseUniform = this.program.uniforms.uMouse.value;
        mouseUniform[0] = this.mousePos.x;
        mouseUniform[1] = this.mousePos.y;
      };

      if (this.options.mouseInteractive) {
        this.options.container.addEventListener('mousemove', this.handleMouseMove);
      }

      const setSize = () => {
        const rect = this.options.container.getBoundingClientRect();
        const width = Math.max(1, Math.floor(rect.width));
        const height = Math.max(1, Math.floor(rect.height));
        this.renderer.setSize(width, height);
        const res = this.program.uniforms.iResolution.value;
        res[0] = gl.drawingBufferWidth;
        res[1] = gl.drawingBufferHeight;
      };

      this.ro = new ResizeObserver(setSize);
      this.ro.observe(this.options.container);
      setSize();

      this.t0 = performance.now();
      const loop = (t) => {
        let timeValue = (t - this.t0) * 0.001;

        if (this.options.direction === 'pingpong') {
          const cycle = Math.sin(timeValue * 0.5) * directionMultiplier;
          this.program.uniforms.uDirection.value = cycle;
        }

        this.program.uniforms.iTime.value = timeValue;
        this.renderer.render({ scene: this.mesh });
        this.raf = requestAnimationFrame(loop);
      };
      this.raf = requestAnimationFrame(loop);
      console.log('Plasma: Initialization completed successfully');

    } catch (error) {
      console.error('Error initializing Plasma:', error);
      // Fallback: keep the gradient background visible
      if (this.options.container) {
        this.options.container.style.background = 'radial-gradient(circle, rgba(255,107,53,0.5) 0%, rgba(0,0,0,0.9) 100%)';
        this.options.container.style.opacity = '0.8';
      }
    }
  }

  destroy() {
    if (this.raf) {
      cancelAnimationFrame(this.raf);
    }
    if (this.ro) {
      this.ro.disconnect();
    }
    if (this.handleMouseMove && this.options.container) {
      this.options.container.removeEventListener('mousemove', this.handleMouseMove);
    }
    if (this.renderer && this.renderer.gl && this.renderer.gl.canvas && this.options.container) {
      try {
        if (this.renderer.gl.canvas.parentElement === this.options.container) {
          this.options.container.removeChild(this.renderer.gl.canvas);
        }
      } catch (e) {
        console.warn('Canvas already removed from container');
      }
    }
    this.renderer = null;
    this.program = null;
    this.mesh = null;
    this.geometry = null;
  }
}

// Initialize Plasma on hero section
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM loaded, initializing Plasma...');
  
  const heroSection = document.querySelector('.section-hero-accueil');
  console.log('Hero section found:', heroSection);
  
  if (heroSection) {
    // Create container for plasma
    const plasmaContainer = document.createElement('div');
    plasmaContainer.className = 'plasma-container';
    plasmaContainer.style.position = 'absolute';
    plasmaContainer.style.top = '0';
    plasmaContainer.style.left = '0';
    plasmaContainer.style.width = '100%';
    plasmaContainer.style.height = '100%';
    plasmaContainer.style.zIndex = '0';
    // Fallback background - visible immédiatement
    plasmaContainer.style.background = 'linear-gradient(135deg, rgba(255,107,53,0.2) 0%, rgba(0,0,0,0.9) 100%)';
    plasmaContainer.style.opacity = '1';
    
    heroSection.style.position = 'relative';
    heroSection.style.background = 'transparent';
    heroSection.appendChild(plasmaContainer);
    console.log('Plasma container added to hero section');

    // Make sure hero-content is above
    const heroContent = heroSection.querySelector('.hero-content');
    if (heroContent) {
      heroContent.style.position = 'relative';
      heroContent.style.zIndex = '1';
    }

    console.log('Creating Plasma instance...');
    window.plasma = new Plasma({
      container: plasmaContainer,
      color: '#ff6b35',
      speed: 0.6,
      direction: 'forward',
      scale: 1.1,
      opacity: 0.8,
      mouseInteractive: true
    });
    console.log('Plasma instance created:', window.plasma);
  } else {
    console.error('Hero section not found!');
  }
});

