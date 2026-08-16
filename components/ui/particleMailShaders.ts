export const envelopeVertexShader = /* glsl */ `
  attribute vec3 a_home;
  attribute vec3 a_scatter;
  attribute float a_size;
  attribute float a_seed;

  uniform mat4 u_view;
  uniform mat4 u_projection;
  uniform float u_assembly;
  uniform float u_dispersal;
  uniform float u_time;
  uniform vec2  u_pointer;
  uniform float u_pointerActive;
  uniform float u_rippleTime;
  uniform vec2  u_rippleOrigin;
  uniform float u_pixelRatio;

  varying float v_alpha;
  varying float v_glow;
  varying float v_flicker;

  float easeOutCubic(float t) {
    return 1.0 - pow(1.0 - t, 3.0);
  }

  float easeOutBack(float t) {
    float c1 = 1.70158;
    float c3 = c1 + 1.0;
    return 1.0 + c3 * pow(t - 1.0, 3.0) + c1 * pow(t - 1.0, 2.0);
  }

  void main() {
    float tRaw = clamp((u_assembly - a_seed * 0.42) / 0.58, 0.0, 1.0);
    float t = easeOutCubic(tRaw);
    t = mix(t, easeOutBack(tRaw), step(0.55, tRaw) * 0.35);

    vec3 pos = mix(a_scatter, a_home, t);
    pos = mix(pos, a_scatter * 1.15, u_dispersal);

    float breath = smoothstep(0.85, 1.0, t) * (1.0 - u_dispersal);
    vec3 drift = vec3(
      sin(u_time * 0.55 + a_seed * 6.28) * 0.014,
      cos(u_time * 0.48 + a_seed * 5.13) * 0.014,
      sin(u_time * 0.38 + a_seed * 4.27) * 0.01
    ) * breath;

    vec3 repel = vec3(0.0);
    if (u_pointerActive > 0.5 && t > 0.7) {
      vec2 d = pos.xy - u_pointer;
      float r2 = dot(d, d);
      float radius = 0.32;
      if (r2 < radius * radius) {
        float dist = sqrt(r2) + 1e-4;
        float falloff = 1.0 - dist / radius;
        falloff = falloff * falloff;
        repel.xy = (d / dist) * falloff * 0.28 * t;
      }
    }

    float ripple = 0.0;
    if (u_rippleTime > 0.0 && t > 0.7) {
      float age = max(0.0, u_time - u_rippleTime);
      float ringRadius = age * 1.5;
      float d = distance(pos.xy, u_rippleOrigin);
      float band = exp(-pow((d - ringRadius) * 7.0, 2.0));
      float decay = exp(-age * 1.5);
      ripple = sin(age * 12.0 - d * 20.0) * band * decay * 0.035;
    }

    vec3 displaced = pos + drift + repel + vec3(ripple, ripple * 0.55, 0.0);

    vec4 worldPos = modelMatrix * vec4(displaced, 1.0);
    vec4 mv = u_view * worldPos;
    gl_Position = u_projection * mv;

    float size = a_size * u_pixelRatio * 4.2;
    size *= mix(0.4, 1.0, t);
    gl_PointSize = clamp(size, 1.8, 6.2);

    v_alpha = mix(0.2, 1.0, smoothstep(0.0, 0.2, t));
    v_alpha *= mix(1.0, 0.0, smoothstep(0.55, 1.0, u_dispersal));
    v_glow = 0.7 + 0.3 * t;
    v_flicker = 0.92 + 0.08 * sin(u_time * 1.2 + a_seed * 7.0);
  }
`;

export const envelopePointFragmentShader = /* glsl */ `
  uniform vec3 u_core;
  uniform vec3 u_halo;

  varying float v_alpha;
  varying float v_glow;
  varying float v_flicker;

  void main() {
    vec2 uv = gl_PointCoord - vec2(0.5);
    float r = length(uv);
    float core = smoothstep(0.48, 0.0, r);
    float halo = smoothstep(0.5, 0.16, r) * 0.55;

    vec3 col = u_core * core + u_halo * halo;
    float a = (core + halo * 0.55) * v_alpha * v_flicker * v_glow;
    if (a < 0.01) discard;

    gl_FragColor = vec4(col, a);
  }
`;

export const envelopeLineFragmentShader = /* glsl */ `
  uniform float u_dispersal;
  uniform vec3 u_line;

  varying float v_alpha;
  varying float v_flicker;

  void main() {
    float a = v_alpha * v_flicker * 0.09;
    a *= pow(1.0 - u_dispersal, 1.4);
    if (a < 0.003) discard;
    gl_FragColor = vec4(u_line, a);
  }
`;
