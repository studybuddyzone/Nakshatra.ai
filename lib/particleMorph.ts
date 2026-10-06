export type Shape = "core" | "female" | "male";
function rng(seed: number) { return () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296); }
type V3 = [number, number, number];
type Blob = { c: V3; r: V3 };
// Procedural bust from ellipsoids; sampled on the union's surface shell.
const bust = (female: boolean): Blob[] => [
  { c: [0, 0.62, 0], r: [female ? 0.32 : 0.35, 0.44, 0.36] },
  { c: [0, 0.2, 0.2], r: [female ? 0.18 : 0.22, 0.2, 0.2] },
  { c: [0, 0.08, -0.02], r: [female ? 0.11 : 0.17, 0.2, 0.15] },
  { c: [0, -0.5, -0.02], r: [female ? 0.6 : 0.82, 0.38, 0.32] },
  ...(female ? [{ c: [0, 0.78, -0.2] as V3, r: [0.46, 0.55, 0.3] as V3 }, { c: [0, -0.2, -0.25] as V3, r: [0.42, 0.75, 0.2] as V3 }] : []),
];
const f = (b: Blob, x: number, y: number, z: number) => ((x - b.c[0]) / b.r[0]) ** 2 + ((y - b.c[1]) / b.r[1]) ** 2 + ((z - b.c[2]) / b.r[2]) ** 2;
function sampleBlobs(blobs: Blob[], n: number, seed: number, s: number) {
  const r = rng(seed), out = new Float32Array(n * 3); let i = 0;
  while (i < n) {
    const x = (r() * 2 - 1) * 1.1, y = (r() * 2 - 1) * 1.1, z = (r() * 2 - 1) * 0.6;
    let v = Infinity; for (const b of blobs) v = Math.min(v, f(b, x, y, z));
    if (v > 0.8 && v < 1.0) { out[i * 3] = x * s; out[i * 3 + 1] = (y + 0.1) * s; out[i * 3 + 2] = z * s; i++; }
  }
  return out;
}
function sampleSphere(n: number, seed: number, s: number) {
  const r = rng(seed), out = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) {
    const u = r() * 2 - 1, t = r() * Math.PI * 2, q = Math.sqrt(1 - u * u), rad = s * (0.92 + r() * 0.1);
    out[i * 3] = q * Math.cos(t) * rad; out[i * 3 + 1] = u * rad; out[i * 3 + 2] = q * Math.sin(t) * rad;
  }
  return out;
}
export function buildTargets(n: number): Record<Shape, Float32Array> {
  const S = 1.5;
  return { core: sampleSphere(n, 11, S * 0.62), female: sampleBlobs(bust(true), n, 23, S), male: sampleBlobs(bust(false), n, 37, S) };
}
export const particleCount = (mobile: boolean, lowCores: boolean) => (mobile ? 9000 : lowCores ? 16000 : 32000);

export const vertexShader = /* glsl */ `
uniform float uTime, uMix, uSize, uReveal; uniform vec3 uMouse;
attribute vec3 aFrom; attribute vec3 aTo; attribute float aRand; varying float vA;
vec3 hash3(vec3 p){p=vec3(dot(p,vec3(127.1,311.7,74.7)),dot(p,vec3(269.5,183.3,246.1)),dot(p,vec3(113.5,271.9,124.6)));return -1.+2.*fract(sin(p)*43758.5453);}
void main(){
  float m = smoothstep(0.,1.,clamp(uMix*1.25 - aRand*0.25,0.,1.));
  vec3 p = mix(aFrom, aTo, m);
  p += normalize(hash3(vec3(aRand*50.))) * sin(m*3.14159) * 0.35;
  p += hash3(p*2.+uTime*0.15) * 0.018 + hash3(vec3(aRand*9.,uTime*0.4,aRand)) * 0.004;
  p *= 1. + sin(uTime*1.2)*0.012;
  float d = distance(p.xy, uMouse.xy); p.xy += normalize(p.xy-uMouse.xy+1e-4) * smoothstep(.6,0.,d) * .12;
  vec4 mv = modelViewMatrix * vec4(p,1.); gl_Position = projectionMatrix * mv;
  float depth = clamp(1.-(-mv.z-3.)/4.,0.,1.);
  gl_PointSize = uSize * (0.55+aRand*0.9) * (0.6+depth*0.9) * (300./-mv.z);
  vA = (0.25+depth*0.75) * (0.7+0.3*sin(uTime*2.+aRand*40.)) * uReveal;
}`;
export const fragmentShader = /* glsl */ `
varying float vA; void main(){ float d=length(gl_PointCoord-.5); if(d>.5) discard;
 float a=pow(1.-d*2.,2.)*vA; vec3 c=mix(vec3(.35,.82,1.),vec3(1.),smoothstep(.0,.35,.5-d)); gl_FragColor=vec4(c*a*1.4,a);}`;
