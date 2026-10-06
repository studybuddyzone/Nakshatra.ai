"use client";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { buildTargets, particleCount, vertexShader, fragmentShader, Shape } from "@/lib/particleMorph";
import { easeInOutCubic, hasWebGL, prefersReducedMotion } from "@/lib/animation";

export default function ParticleCharacter({ shape }: { shape: Shape }) {
  const host = useRef<HTMLDivElement>(null);
  const api = useRef<{ morph: (s: Shape) => void } | null>(null);
  const [ok, setOk] = useState(true);

  useEffect(() => {
    const el = host.current; if (!el) return;
    if (!hasWebGL()) { setOk(false); return; }
    const reduced = prefersReducedMotion();
    const mobile = window.innerWidth < 768, N = particleCount(mobile, (navigator.hardwareConcurrency || 8) <= 4);
    const renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true, powerPreference: "high-performance" });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, mobile ? 1.5 : 2)); el.appendChild(renderer.domElement);
    renderer.domElement.setAttribute("aria-hidden", "true");
    const scene = new THREE.Scene(), cam = new THREE.PerspectiveCamera(35, 1, 0.1, 50); cam.position.set(0, 0.1, 6);
    const targets = buildTargets(N), geo = new THREE.BufferGeometry();
    const from = new Float32Array(targets.core), to = new Float32Array(targets.core), rand = new Float32Array(N);
    for (let i = 0; i < N; i++) rand[i] = Math.random();
    geo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(N * 3), 3));
    const aFrom = new THREE.BufferAttribute(from, 3), aTo = new THREE.BufferAttribute(to, 3);
    geo.setAttribute("aFrom", aFrom); geo.setAttribute("aTo", aTo); geo.setAttribute("aRand", new THREE.BufferAttribute(rand, 1));
    const mat = new THREE.ShaderMaterial({ vertexShader, fragmentShader, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
      uniforms: { uTime: { value: 0 }, uMix: { value: 1 }, uSize: { value: mobile ? 2.2 : 1.6 }, uReveal: { value: 0 }, uMouse: { value: new THREE.Vector3(9, 9, 0) } } });
    const pts = new THREE.Points(geo, mat); pts.frustumCulled = false; scene.add(pts);

    const resize = () => { const w = el.clientWidth, h = el.clientHeight; renderer.setSize(w, h); cam.aspect = w / h; cam.updateProjectionMatrix(); };
    resize(); const ro = new ResizeObserver(resize); ro.observe(el);
    const mouse = { x: 0, y: 0, sx: 0, sy: 0 };
    const onMove = (e: PointerEvent) => { const r = el.getBoundingClientRect(); mouse.x = ((e.clientX - r.left) / r.width) * 2 - 1; mouse.y = -(((e.clientY - r.top) / r.height) * 2 - 1); };
    window.addEventListener("pointermove", onMove);

    let current: Shape = "core", t0 = 1, dur = 2.1, last = performance.now(), raf = 0, visible = true;
    api.current = { morph: (s) => {
      if (s === current) return;
      const m = easeInOutCubic(t0); // bake the in-flight state into "from" so interrupted morphs stay smooth
      for (let i = 0; i < N * 3; i++) from[i] = from[i] + (to[i] - from[i]) * m;
      to.set(targets[s]); aFrom.needsUpdate = aTo.needsUpdate = true; current = s; t0 = 0; mat.uniforms.uMix.value = 0; dur = reduced ? 0.01 : 2.1;
    } };
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting)); io.observe(el);

    const tick = (now: number) => {
      raf = requestAnimationFrame(tick); if (!visible) { last = now; return; }
      const dt = Math.min((now - last) / 1000, 0.05); last = now;
      mat.uniforms.uTime.value += reduced ? 0 : dt;
      mat.uniforms.uReveal.value = Math.min(1, mat.uniforms.uReveal.value + dt * 0.45);
      if (t0 < 1) { t0 = Math.min(1, t0 + dt / dur); mat.uniforms.uMix.value = easeInOutCubic(t0); }
      mouse.sx += (mouse.x - mouse.sx) * 0.05; mouse.sy += (mouse.y - mouse.sy) * 0.05;
      if (!reduced) { pts.rotation.y = mouse.sx * 0.35 + Math.sin(mat.uniforms.uTime.value * 0.25) * 0.12; pts.rotation.x = -mouse.sy * 0.12; cam.position.x = mouse.sx * 0.15; cam.lookAt(0, 0, 0);
        mat.uniforms.uMouse.value.set(mouse.sx * 1.6, mouse.sy * 1.6, 0); }
      renderer.render(scene, cam);
    };
    raf = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(raf); ro.disconnect(); io.disconnect(); window.removeEventListener("pointermove", onMove); geo.dispose(); mat.dispose(); renderer.dispose(); renderer.domElement.remove(); };
  }, []);

  useEffect(() => { api.current?.morph(shape); }, [shape]);

  return (<div ref={host} className="absolute inset-0" role="img" aria-label={`Animated particle character, ${shape} form`}>
    {!ok && <div className="absolute inset-0 m-auto h-[60%] w-[60%] rounded-full" style={{ background: "radial-gradient(circle,rgba(90,215,255,.28),transparent 65%)" }} />}
  </div>);
}
