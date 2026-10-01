/**
 * Aura visualizer: an audio-reactive shader, ported to plain React.
 *
 * @license
 * Originally developed for Unicorn Studio
 * https://unicorn.studio
 *
 * Licensed under the Polyform Non-Resale License 1.0.0
 * https://polyformproject.org/licenses/non-resale/1.0.0/
 *
 * © 2026 UNCRN LLC
 */
import React, { useEffect, useRef } from "react";

const SHADER = `
const float TAU = 6.283185;
vec2 randFibo(vec2 p) { p = fract(p * vec2(443.897, 441.423)); p += dot(p, p.yx + 19.19); return fract((p.xx + p.yx) * p.xy); }
vec3 Tonemap(vec3 x) { x *= 4.0; return x / (1.0 + x); }
float luma(vec3 color) { return dot(color, vec3(0.299, 0.587, 0.114)); }
vec3 rgb2hsv(vec3 c) { vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0); vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g)); vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r)); float d = q.x - min(q.w, q.y); float e = 1.0e-10; return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x); }
vec3 hsv2rgb(vec3 c) { vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0); vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www); return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y); }
float sdCircle(vec2 st, float r) { return length(st) - r; }
float sdLine(vec2 p, float r) { float halfLen = r * 2.0; vec2 a = vec2(-halfLen, 0.0); vec2 b = vec2(halfLen, 0.0); vec2 pa = p - a; vec2 ba = b - a; float h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0); return length(pa - ba * h); }
float getSdf(vec2 st) { if(uShape == 1.0) return sdCircle(st, uScale); else if(uShape == 2.0) return sdLine(st, uScale); return sdCircle(st, uScale); }
vec2 turb(vec2 pos, float t, float it) {
  mat2 rotation = mat2(0.6, -0.25, 0.25, 0.9);
  mat2 layerRotation = mat2(0.6, -0.8, 0.8, 0.6);
  float frequency = mix(2.0, 15.0, uFrequency);
  float amplitude = uAmplitude;
  float frequencyGrowth = 1.4;
  float animTime = t * 0.1 * uSpeed;
  const int LAYERS = 4;
  for(int i = 0; i < LAYERS; i++) {
    vec2 rotatedPos = pos * rotation;
    vec2 wave = sin(frequency * rotatedPos + float(i) * animTime + it);
    pos += (amplitude / frequency) * rotation[0] * wave;
    rotation *= layerRotation;
    amplitude *= mix(1.0, max(wave.x, wave.y), uVariance);
    frequency *= frequencyGrowth;
  }
  return pos;
}
const float ITERATIONS = 36.0;
void mainImage(out vec4 fragColor, in vec2 fragCoord) {
  vec2 uv = fragCoord / iResolution.xy;
  vec3 pp = vec3(0.0); vec3 bloom = vec3(0.0);
  float t = iTime * 0.5;
  vec2 pos = uv - 0.5;
  vec2 prevPos = turb(pos, t, 0.0 - 1.0 / ITERATIONS);
  float spacing = mix(1.0, TAU, uSpacing);
  for(float i = 1.0; i < ITERATIONS + 1.0; i++) {
    float iter = i / ITERATIONS;
    vec2 st = turb(pos, t, iter * spacing);
    float d = abs(getSdf(st));
    float pd = distance(st, prevPos);
    prevPos = st;
    float dynamicBlur = exp2(pd * 2.0 * 1.4426950408889634) - 1.0;
    float ds = smoothstep(0.0, uBlur * 0.05 + max(dynamicBlur * uSmoothing, 0.001), d);
    vec3 color = uColor;
    if(uColorShift > 0.01) { vec3 hsv = rgb2hsv(color); hsv.x = fract(hsv.x + (1.0 - iter) * uColorShift * 0.3); color = hsv2rgb(hsv); }
    float invd = 1.0 / max(d + dynamicBlur, 0.001);
    pp += (ds - 1.0) * color;
    bloom += clamp(invd, 0.0, 250.0) * color;
  }
  pp *= 1.0 / ITERATIONS;
  vec3 color;
  if(uMode < 0.5) {
    bloom = bloom / (bloom + 2e4);
    color = (-pp + bloom * 3.0 * uBloom) * 1.2;
    color += (randFibo(fragCoord).x - 0.5) / 255.0;
    color = Tonemap(color);
    float alpha = luma(color) * uMix;
    fragColor = vec4(color * uMix, alpha);
  } else {
    color = -pp;
    color += (randFibo(fragCoord).x - 0.5) / 255.0;
    float brightness = length(color);
    vec3 direction = brightness > 0.0 ? color / brightness : color;
    float factor = 2.0;
    float mappedBrightness = (brightness * factor) / (1.0 + brightness * factor);
    color = direction * mappedBrightness;
    float gray = dot(color, vec3(0.2, 0.5, 0.1));
    float saturationBoost = 3.0;
    color = mix(vec3(gray), color, saturationBoost);
    color = clamp(color, 0.0, 1.0);
    float alpha = mappedBrightness * clamp(uMix, 1.0, 2.0);
    fragColor = vec4(color, alpha);
  }
}`;

const PRE = `precision highp float;
uniform vec3 iResolution; uniform float iTime;
uniform float uSpeed,uBlur,uScale,uShape,uFrequency,uAmplitude,uBloom,uMix,uSpacing,uColorShift,uVariance,uSmoothing,uMode;
uniform vec3 uColor;
`;
// Ours: premultiply for page compositing, drop the dither haze, and fade out
// before the canvas edge so no square shows on the page.
const POST = `
void main() {
  vec4 c; mainImage(c, gl_FragCoord.xy);
  float edge = smoothstep(0.5, 0.32, length(gl_FragCoord.xy / iResolution.xy - 0.5));
  if (uMode < 0.5) { gl_FragColor = c * edge; return; }
  float a = clamp((c.a - 0.05) / 0.95, 0.0, 1.0) * edge;
  gl_FragColor = vec4(c.rgb * a, a);
}`;

const UNIFORMS = [
  "iResolution", "iTime", "uSpeed", "uBlur", "uScale", "uShape", "uFrequency", "uAmplitude",
  "uBloom", "uMix", "uSpacing", "uColorShift", "uVariance", "uSmoothing", "uMode", "uColor"
];

// Targets per agent state. br is [min, max] brightness (pulsed when they differ).
const TARGETS = {
  // Ours: idle breathes slowly (pp = half-period in seconds) so it invites a click.
  idle: { sp: 10, sc: 0.2, am: 1.2, fr: 0.4, br: [1.1, 1.7], pp: 1.8 },
  listening: { sp: 20, sc: 0.3, am: 1, fr: 0.7, br: [1.5, 2] },
  connecting: { sp: 30, sc: 0.3, am: 0.5, fr: 1, br: [0.5, 2.5] },
  thinking: { sp: 30, sc: 0.3, am: 0.5, fr: 1, br: [0.5, 2.5] },
  speaking: { sp: 70, sc: 0.3, am: 0.75, fr: 1.25, br: [1.5, 1.5] },
  // Ours: greyed and still.
  muted: { sp: 10, sc: 0.2, am: 1.2, fr: 0.4, br: [0.8, 0.8], grey: true },
  error: { sp: 10, sc: 0.2, am: 1.2, fr: 0.4, br: [0.6, 0.6], grey: true }
};

const BRAND = "#c44216"; // ember orange, near the site accent
const BRAND_DARK = "#ff966d"; // the site's dark-mode accent
const GREY = "#8a857e";
const COLOR_SHIFT = 0.2;

const colorFor = (g, isDark) => {
  if (g.grey) return GREY;
  return isDark ? BRAND_DARK : BRAND;
};

const toRgb = hex => [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16) / 255);

function compile(gl) {
  const make = (type, src) => {
    const s = gl.createShader(type);
    gl.shaderSource(s, src);
    gl.compileShader(s);
    return s;
  };
  const program = gl.createProgram();
  gl.attachShader(program, make(gl.VERTEX_SHADER, "attribute vec2 p; void main(){ gl_Position = vec4(p,0.,1.); }"));
  gl.attachShader(program, make(gl.FRAGMENT_SHADER, PRE + SHADER + POST));
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return null;
  gl.useProgram(program);
  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(program, "p");
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
  const u = {};
  UNIFORMS.forEach(n => {
    u[n] = gl.getUniformLocation(program, n);
  });
  return u;
}

/**
 * The layout box is the disc's size; the canvas is twice as large so the glow can bleed out.
 * `levelRef.current` is a 0..1 audio level, read every frame so audio never re-renders React.
 */
export default function Aura({ state = "idle", levelRef, dark = false, className = "" }) {
  const wrap = useRef(null);
  const canvas = useRef(null);
  const live = useRef({ state, dark });
  live.current = { state, dark };

  useEffect(() => {
    const cv = canvas.current;
    const gl = cv.getContext("webgl", { premultipliedAlpha: true, alpha: true, antialias: false });
    const u = gl && compile(gl);
    if (!u) {
      wrap.current.classList.add("aura-fallback");
      return undefined;
    }
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const cur = { sc: 0.2, am: 1.2, fr: 0.4, br: 1 };
    let last = 0;
    let raf = 0;
    let stopped = false;

    const draw = now => {
      if (stopped) return;
      const { state: st, dark: isDark } = live.current;
      const g = TARGETS[st] || TARGETS.idle;
      const css = wrap.current.clientWidth * 2;
      if (css >= 2 && now - last >= (reduce ? 250 : 32)) {
        // ~30fps is plenty for a soft glow and halves the GPU work. Reduced motion freezes
        // the shader clock and only refreshes a few times a second so state changes show.
        const dt = Math.min(0.1, (now - (last || now)) / 1000);
        last = now;
        const px = Math.round(css * (css > 300 ? 1 : Math.min(window.devicePixelRatio || 1, 2)));
        if (cv.width !== px) {
          cv.width = px;
          cv.height = px;
          gl.viewport(0, 0, px, px);
        }
        const t = now / 1000;
        const level = (levelRef && levelRef.current) || 0;
        const k = reduce ? 1 : 1 - Math.exp(-dt / 0.18);
        const pulse = g.br[0] === g.br[1] ? g.br[0] : g.br[0] + (g.br[1] - g.br[0]) * (0.5 - 0.5 * Math.cos((t * Math.PI) / (g.pp || 0.35)));
        const scaleTarget = st === "speaking" ? 0.2 + 0.2 * level : g.sc;
        cur.sc += (scaleTarget - cur.sc) * k;
        cur.am += (g.am - cur.am) * k;
        cur.fr += (g.fr - cur.fr) * k;
        cur.br += (pulse - cur.br) * (g.br[0] === g.br[1] ? k : 1);

        gl.uniform3f(u.iResolution, px, px, 1);
        gl.uniform1f(u.iTime, reduce ? 4 : t);
        gl.uniform1f(u.uSpeed, reduce ? 0 : g.sp);
        gl.uniform1f(u.uBlur, 0.2);
        gl.uniform1f(u.uScale, cur.sc);
        gl.uniform1f(u.uShape, 1);
        gl.uniform1f(u.uFrequency, cur.fr);
        gl.uniform1f(u.uAmplitude, cur.am);
        gl.uniform1f(u.uBloom, 0);
        gl.uniform1f(u.uMix, cur.br);
        gl.uniform1f(u.uSpacing, 0.5);
        gl.uniform1f(u.uColorShift, g.grey ? 0 : COLOR_SHIFT);
        gl.uniform1f(u.uVariance, 0.1);
        gl.uniform1f(u.uSmoothing, 1);
        gl.uniform1f(u.uMode, isDark ? 0 : 1);
        gl.uniform3fv(u.uColor, toRgb(colorFor(g, isDark)));
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.drawArrays(gl.TRIANGLES, 0, 3);
      }
      // Reduced motion: still re-draw so a state or theme change shows, but at a trickle.
      raf = window.requestAnimationFrame(draw);
    };
    raf = window.requestAnimationFrame(draw);
    return () => {
      stopped = true;
      window.cancelAnimationFrame(raf);
    };
  }, [levelRef]);

  return (
    <span ref={wrap} className={`aura ${className}`} aria-hidden="true">
      <canvas ref={canvas} />
    </span>
  );
}
