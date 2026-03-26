export const vertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const fragmentShader = /* glsl */ `
  precision mediump float;

  varying vec2 vUv;

  uniform float u_seed1;
  uniform float u_seed2;
  uniform float u_seed3;
  uniform vec3 u_color1;
  uniform vec3 u_color2;
  uniform vec3 u_color3;
  uniform vec2 u_resolution;
  uniform float u_mode; // 0 = hero, 1 = thumbnail

  // --- Simplex 2D noise ---
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec2 mod289v2(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec3 permute(vec3 x) { return mod289(((x * 34.0) + 10.0) * x); }

  float snoise(vec2 v) {
    const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                        -0.577350269189626, 0.024390243902439);
    vec2 i = floor(v + dot(v, C.yy));
    vec2 x0 = v - i + dot(i, C.xx);
    vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod289v2(i);
    vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
    vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
    m = m * m;
    m = m * m;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
    vec3 g;
    g.x = a0.x * x0.x + h.x * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }

  // --- fBm (fractal Brownian motion) ---
  float fbm(vec2 p, float seed) {
    float value = 0.0;
    float amplitude = 0.5;
    vec2 offset = vec2(seed * 17.3, seed * 31.7);
    for (int i = 0; i < 5; i++) {
      value += amplitude * snoise(p + offset);
      p *= 2.1;
      amplitude *= 0.5;
      offset *= 1.3;
    }
    return value;
  }

  // --- Domain warping ---
  float warpedFbm(vec2 p, float s1, float s2, float s3) {
    vec2 q = vec2(
      fbm(p + vec2(s1 * 5.2, s2 * 1.3), s1),
      fbm(p + vec2(s2 * 8.1, s3 * 3.7), s2)
    );
    vec2 r = vec2(
      fbm(p + 4.0 * q + vec2(s3 * 1.7, s1 * 9.2), s3),
      fbm(p + 4.0 * q + vec2(s1 * 8.3, s2 * 2.8), s1)
    );
    return fbm(p + 3.5 * r, s2);
  }

  void main() {
    vec2 uv = vUv;
    float aspect = u_resolution.x / u_resolution.y;
    vec2 p = (uv - 0.5) * vec2(aspect, 1.0) * 3.0;

    // Generate warped noise pattern
    float n = warpedFbm(p, u_seed1, u_seed2, u_seed3);

    // Map noise to 0-1 range
    float t = n * 0.5 + 0.5;

    // Three-way color blend
    vec3 color;
    if (t < 0.5) {
      color = mix(u_color1, u_color2, t * 2.0);
    } else {
      color = mix(u_color2, u_color3, (t - 0.5) * 2.0);
    }

    // Background blend — mix with dark background
    vec3 bg = vec3(0.039, 0.055, 0.102); // #0a0e1a
    color = mix(bg, color, 0.35 + 0.3 * t);

    // Radial vignette
    float vignette = 1.0 - smoothstep(0.3, 1.2, length(uv - 0.5) * 1.8);
    color *= 0.6 + 0.4 * vignette;

    // Thumbnail mode: darken center band for text readability
    if (u_mode > 0.5) {
      float centerY = smoothstep(0.25, 0.4, uv.y) * (1.0 - smoothstep(0.6, 0.75, uv.y));
      float centerX = smoothstep(0.1, 0.3, uv.x) * (1.0 - smoothstep(0.7, 0.9, uv.x));
      color *= 1.0 - 0.3 * centerX * centerY;
    }

    gl_FragColor = vec4(color, 1.0);
  }
`;
