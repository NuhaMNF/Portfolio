"use client";

import { useEffect, useMemo, useRef, useState, type RefObject } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { Mail } from "lucide-react";
import { profile } from "@/lib/data";
import { buildEnvelopeGeometry } from "@/lib/envelope-geometry";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";
import { useTheme } from "@/lib/hooks/useTheme";
import {
  envelopeLineFragmentShader,
  envelopePointFragmentShader,
  envelopeVertexShader,
} from "./particleMailShaders";

type SceneProgress = {
  assembly: number;
  dispersal: number;
  pointer: { x: number; y: number; active: boolean };
  rippleTime: number;
  rippleOrigin: { x: number; y: number };
  pointerMoveTime: number;
};

function buildEdgeScatter(positions: Float32Array, count: number): Float32Array {
  const scatter = new Float32Array(positions.length);
  for (let i = 0; i < count; i++) {
    const h1 = Math.abs(Math.sin(i * 12.9898) * 43758.5453);
    const h2 = Math.abs(Math.sin(i * 78.233) * 43758.5453);
    const h3 = Math.abs(Math.sin(i * 23.1415) * 43758.5453);
    const h4 = Math.abs(Math.sin(i * 5.791) * 43758.5453);
    const f1 = h1 - Math.floor(h1);
    const f2 = h2 - Math.floor(h2);
    const f3 = h3 - Math.floor(h3);
    const f4 = h4 - Math.floor(h4);

    const side = Math.floor(f1 * 4);
    const along = (f2 - 0.5) * 4.2;
    const depth = (f3 - 0.5) * 1.6;
    const out = 2.6 + f4 * 1.8;

    let x = 0;
    let y = 0;
    if (side === 0) {
      x = -out;
      y = along * 0.65;
    } else if (side === 1) {
      x = out;
      y = along * 0.65;
    } else if (side === 2) {
      x = along;
      y = out * 0.72;
    } else {
      x = along;
      y = -out * 0.72;
    }

    scatter[i * 3] = x * 0.88 + positions[i * 3] * 0.12;
    scatter[i * 3 + 1] = y * 0.88 + positions[i * 3 + 1] * 0.12;
    scatter[i * 3 + 2] = depth;
  }
  return scatter;
}

function EnvelopeCloud({
  progressRef,
  count,
  light,
}: {
  progressRef: RefObject<SceneProgress>;
  count: number;
  light: boolean;
}) {
  const pointsRef = useRef<THREE.Points>(null);
  const linesRef = useRef<THREE.LineSegments>(null);
  const groupRef = useRef<THREE.Group>(null);
  const { gl } = useThree();

  const { positions, seeds, pairs, scatter } = useMemo(() => {
    const built = buildEnvelopeGeometry(count);
    return {
      positions: built.positions,
      seeds: built.seeds,
      pairs: built.pairs,
      scatter: buildEdgeScatter(built.positions, count),
    };
  }, [count]);

  const geometry = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(positions.slice(), 3));
    g.setAttribute("a_home", new THREE.BufferAttribute(positions.slice(), 3));
    g.setAttribute("a_scatter", new THREE.BufferAttribute(scatter, 3));
    const sizeAttr = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      sizeAttr[i] = 0.85 + Math.abs(Math.sin(i * 7.13)) * 0.85;
    }
    g.setAttribute("a_size", new THREE.BufferAttribute(sizeAttr, 1));
    g.setAttribute("a_seed", new THREE.BufferAttribute(seeds, 1));
    return g;
  }, [positions, scatter, seeds, count]);

  const lineGeometry = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const segCount = pairs.length / 2;
    const homeArr = new Float32Array(segCount * 2 * 3);
    const scatterArr = new Float32Array(segCount * 2 * 3);
    const sizeArr = new Float32Array(segCount * 2);
    const seedArr = new Float32Array(segCount * 2);
    for (let s = 0; s < segCount; s++) {
      const a = pairs[s * 2];
      const b = pairs[s * 2 + 1];
      for (let k = 0; k < 3; k++) {
        homeArr[s * 6 + k] = positions[a * 3 + k];
        homeArr[s * 6 + 3 + k] = positions[b * 3 + k];
        scatterArr[s * 6 + k] = scatter[a * 3 + k];
        scatterArr[s * 6 + 3 + k] = scatter[b * 3 + k];
      }
      sizeArr[s * 2] = 1;
      sizeArr[s * 2 + 1] = 1;
      seedArr[s * 2] = seeds[a];
      seedArr[s * 2 + 1] = seeds[b];
    }
    g.setAttribute("position", new THREE.BufferAttribute(homeArr, 3));
    g.setAttribute("a_home", new THREE.BufferAttribute(homeArr, 3));
    g.setAttribute("a_scatter", new THREE.BufferAttribute(scatterArr, 3));
    g.setAttribute("a_size", new THREE.BufferAttribute(sizeArr, 1));
    g.setAttribute("a_seed", new THREE.BufferAttribute(seedArr, 1));
    return g;
  }, [positions, scatter, seeds, pairs]);

  useEffect(() => {
    return () => {
      geometry.dispose();
      lineGeometry.dispose();
    };
  }, [geometry, lineGeometry]);

  const uniforms = useMemo(
    () => ({
      u_view: { value: new THREE.Matrix4() },
      u_projection: { value: new THREE.Matrix4() },
      u_assembly: { value: 0 },
      u_dispersal: { value: 0 },
      u_time: { value: 0 },
      u_pointer: { value: new THREE.Vector2() },
      u_pointerActive: { value: 0 },
      u_rippleTime: { value: -10 },
      u_rippleOrigin: { value: new THREE.Vector2() },
      u_pixelRatio: {
        value: Math.min(1.75, typeof window !== "undefined" ? window.devicePixelRatio : 1),
      },
      u_core: { value: new THREE.Color("#fff6db") },
      u_halo: { value: new THREE.Color("#e8b75a") },
      u_line: { value: new THREE.Color("#e8c47a") },
    }),
    [],
  );

  const lineUniforms = useMemo(
    () => ({
      ...uniforms,
    }),
    [uniforms],
  );

  useEffect(() => {
    if (light) {
      uniforms.u_core.value.set("#6b4a12");
      uniforms.u_halo.value.set("#9a6b1c");
      uniforms.u_line.value.set("#8a6118");
    } else {
      uniforms.u_core.value.set("#fff6db");
      uniforms.u_halo.value.set("#e8b75a");
      uniforms.u_line.value.set("#e8c47a");
    }
  }, [light, uniforms]);

  const raycaster = useMemo(() => new THREE.Raycaster(), []);
  const plane = useMemo(() => new THREE.Plane(), []);
  const hit = useMemo(() => new THREE.Vector3(), []);
  const localHit = useMemo(() => new THREE.Vector3(), []);
  const invWorld = useMemo(() => new THREE.Matrix4(), []);
  const planeNormal = useMemo(() => new THREE.Vector3(), []);
  const planePoint = useMemo(() => new THREE.Vector3(), []);
  const lastLocal = useRef({ x: 0, y: 0 });
  const drag = useRef({
    active: false,
    moved: false,
    lastX: 0,
    lastY: 0,
    rotX: 0.06,
    rotY: -0.22,
    velX: 0,
    velY: 0,
    userSpun: false,
  });

  useEffect(() => {
    const el = gl.domElement;
    const coarse =
      typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches;
    if (coarse) return;

    el.style.cursor = "grab";

    const onDown = (e: PointerEvent) => {
      if (e.button !== 0) return;
      drag.current.active = true;
      drag.current.moved = false;
      drag.current.lastX = e.clientX;
      drag.current.lastY = e.clientY;
      drag.current.velX = 0;
      drag.current.velY = 0;
      el.setPointerCapture(e.pointerId);
      el.style.cursor = "grabbing";
    };

    const onMove = (e: PointerEvent) => {
      if (!drag.current.active) return;
      const dx = e.clientX - drag.current.lastX;
      const dy = e.clientY - drag.current.lastY;
      if (Math.hypot(dx, dy) > 2) drag.current.moved = true;
      drag.current.lastX = e.clientX;
      drag.current.lastY = e.clientY;
      const sens = 0.006;
      drag.current.rotY += dx * sens;
      drag.current.rotX += dy * sens;
      drag.current.rotX = Math.max(-0.7, Math.min(0.7, drag.current.rotX));
      drag.current.velY = dx * sens;
      drag.current.velX = dy * sens;
      drag.current.userSpun = true;
    };

    const onUp = (e: PointerEvent) => {
      if (!drag.current.active) return;
      const wasClick = !drag.current.moved;
      drag.current.active = false;
      try {
        el.releasePointerCapture(e.pointerId);
      } catch {
        /* already released */
      }
      el.style.cursor = "grab";
      if (wasClick) {
        window.location.href = `mailto:${profile.email}`;
      }
    };

    el.addEventListener("pointerdown", onDown);
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerup", onUp);
    el.addEventListener("pointercancel", onUp);

    return () => {
      el.style.cursor = "";
      el.removeEventListener("pointerdown", onDown);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerup", onUp);
      el.removeEventListener("pointercancel", onUp);
    };
  }, [gl]);

  useFrame((state) => {
    const cam = state.camera as THREE.PerspectiveCamera;
    uniforms.u_view.value.copy(cam.matrixWorldInverse);
    uniforms.u_projection.value.copy(cam.projectionMatrix);
    uniforms.u_time.value = state.clock.getElapsedTime();
    uniforms.u_assembly.value = progressRef.current.assembly;
    uniforms.u_dispersal.value = progressRef.current.dispersal;

    const group = groupRef.current;
    if (group) {
      const d = drag.current;
      if (!d.active) {
        d.rotY += d.velY;
        d.rotX += d.velX;
        d.rotX = Math.max(-0.7, Math.min(0.7, d.rotX));
        d.velY *= 0.94;
        d.velX *= 0.94;
        if (Math.abs(d.velY) < 0.00005) d.velY = 0;
        if (Math.abs(d.velX) < 0.00005) d.velX = 0;
        if (!d.userSpun) {
          d.rotX = 0.06 + state.pointer.y * 0.03;
          d.rotY = -0.22 + state.pointer.x * 0.04;
        }
      }

      group.rotation.x = d.rotX;
      group.rotation.y = d.rotY;
      group.updateWorldMatrix(true, false);

      raycaster.setFromCamera(state.pointer, cam);
      planeNormal.set(0, 0, 1).transformDirection(group.matrixWorld);
      planePoint.set(0, 0, 0).applyMatrix4(group.matrixWorld);
      plane.setFromNormalAndCoplanarPoint(planeNormal, planePoint);

      if (raycaster.ray.intersectPlane(plane, hit)) {
        invWorld.copy(group.matrixWorld).invert();
        localHit.copy(hit).applyMatrix4(invWorld);
        const progress = progressRef.current;
        progress.pointer.x = localHit.x;
        progress.pointer.y = localHit.y;
        progress.pointer.active = !d.active;

        const now = state.clock.getElapsedTime();
        const moved =
          Math.hypot(localHit.x - lastLocal.current.x, localHit.y - lastLocal.current.y) > 0.04;
        if (!d.active && moved && now - progress.pointerMoveTime > 0.12) {
          progress.rippleTime = now;
          progress.rippleOrigin.x = localHit.x;
          progress.rippleOrigin.y = localHit.y;
          progress.pointerMoveTime = now;
        }
        lastLocal.current.x = localHit.x;
        lastLocal.current.y = localHit.y;
      }
    }

    uniforms.u_pointer.value.set(progressRef.current.pointer.x, progressRef.current.pointer.y);
    uniforms.u_pointerActive.value = progressRef.current.pointer.active ? 1 : 0;
    uniforms.u_rippleTime.value = progressRef.current.rippleTime;
    uniforms.u_rippleOrigin.value.set(
      progressRef.current.rippleOrigin.x,
      progressRef.current.rippleOrigin.y,
    );

    for (const ref of [pointsRef, linesRef]) {
      const mat = ref.current?.material as THREE.ShaderMaterial | undefined;
      if (!mat?.uniforms) continue;
      mat.uniforms.u_assembly.value = uniforms.u_assembly.value;
      mat.uniforms.u_dispersal.value = uniforms.u_dispersal.value;
      mat.uniforms.u_time.value = uniforms.u_time.value;
      mat.uniforms.u_pointer.value.copy(uniforms.u_pointer.value);
      mat.uniforms.u_pointerActive.value = uniforms.u_pointerActive.value;
      mat.uniforms.u_rippleTime.value = uniforms.u_rippleTime.value;
      mat.uniforms.u_rippleOrigin.value.copy(uniforms.u_rippleOrigin.value);
    }
  });

  return (
    <group ref={groupRef} position={[0, 0.02, 0]} scale={0.92}>
      <points ref={pointsRef} geometry={geometry} frustumCulled={false}>
        <shaderMaterial
          attach="material"
          vertexShader={envelopeVertexShader}
          fragmentShader={envelopePointFragmentShader}
          uniforms={uniforms}
          glslVersion={THREE.GLSL1}
          transparent
          depthWrite={false}
          blending={light ? THREE.NormalBlending : THREE.AdditiveBlending}
        />
      </points>
      <lineSegments ref={linesRef} geometry={lineGeometry} frustumCulled={false}>
        <shaderMaterial
          attach="material"
          vertexShader={envelopeVertexShader}
          fragmentShader={envelopeLineFragmentShader}
          uniforms={lineUniforms}
          glslVersion={THREE.GLSL1}
          transparent
          depthWrite={false}
          blending={light ? THREE.NormalBlending : THREE.AdditiveBlending}
        />
      </lineSegments>
    </group>
  );
}

function ParticleMailCanvas({
  progressRef,
  light,
}: {
  progressRef: RefObject<SceneProgress>;
  light: boolean;
}) {
  const [count, setCount] = useState(220);

  useEffect(() => {
    const update = () => setCount(window.innerWidth < 768 ? 160 : 220);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return (
    <Canvas
      className="absolute inset-0"
      dpr={[1, 1.6]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      camera={{ position: [0, 0, 4.4], fov: 38, near: 0.1, far: 40 }}
      onCreated={({ gl }) => {
        gl.setClearColor("#000000", 0);
      }}
    >
      <EnvelopeCloud progressRef={progressRef} count={count} light={light} />
    </Canvas>
  );
}

export function ParticleMail() {
  const reduced = useReducedMotion();
  const theme = useTheme();
  const light = theme === "light";
  const rootRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const progressRef = useRef<SceneProgress>({
    assembly: 0,
    dispersal: 0,
    pointer: { x: 0, y: 0, active: false },
    rippleTime: -10,
    rippleOrigin: { x: 0, y: 0 },
    pointerMoveTime: -10,
  });

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) setVisible(true);
      },
      { threshold: 0.28 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!visible) return;
    if (reduced) {
      progressRef.current.assembly = 1;
      return;
    }
    const t0 = performance.now();
    const duration = 2200;
    let raf = 0;
    const tick = () => {
      const raw = Math.min(1, (performance.now() - t0) / duration);
      progressRef.current.assembly = 1 - Math.pow(1 - raw, 3);
      if (raw < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [visible, reduced]);

  return (
    <div
      ref={rootRef}
      className="relative overflow-hidden rounded-2xl border border-[var(--rule)] bg-[var(--surface)]/70 backdrop-blur-md"
    >
      <div className="flex items-center justify-between px-5 pt-4">
        <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--fg-faint)]">
          // Particle channel
        </span>
        <span className="font-mono text-[10px] text-[var(--fg-faint)]">click to mail</span>
      </div>
      <div className="relative h-[168px] w-full md:h-[188px]">
        {reduced ? (
          <a
            href={`mailto:${profile.email}`}
            data-cursor="view"
            className="flex h-full items-center justify-center text-[var(--accent)]"
            aria-label={`Email ${profile.email}`}
          >
            <Mail className="h-14 w-14" />
          </a>
        ) : (
          visible && <ParticleMailCanvas progressRef={progressRef} light={light} />
        )}
      </div>
    </div>
  );
}
