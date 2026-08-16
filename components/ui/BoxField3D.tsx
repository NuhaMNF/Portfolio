"use client";

import { useEffect, useLayoutEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";
import {
  gridForViewport,
  KEY_D,
  KEY_H,
  KEY_LIFT,
  KEY_PRESS_SCALE,
  KEY_W,
  type KeySpec,
} from "@/components/ui/boxFieldLayout";

const REST_COLOR = new THREE.Color("#07060c");
const GRAD_LEFT = new THREE.Color("#4f7dff");
const GRAD_MID = new THREE.Color("#c026d3");
const GRAD_RIGHT = new THREE.Color("#fb7185");
const INFLUENCE_RADIUS_FULL = 0.95;
const INFLUENCE_RADIUS_MEDIUM = 1.85;
const INFLUENCE_RADIUS_WEAK = 2.9;
const STIFFNESS = 70;
const DAMPING = 14;
const CURSOR_DAMP_RATE = 10;
const CAMERA_ZOOM = 50;

const pointerNdc = { x: 0, y: 0, active: false };
const pointerVec = new THREE.Vector2();
const cursorLocal = { x: 0, y: 0, z: 0, active: false };
const smoothCursor = { x: 0, y: 0, z: 0, active: false };
const dummy = new THREE.Object3D();
let invalidateFn: (() => void) | null = null;
let listenerInstalled = false;

function installPointerListener() {
  if (listenerInstalled || typeof window === "undefined") return;
  listenerInstalled = true;
  window.addEventListener(
    "pointermove",
    (e) => {
      if (e.pointerType !== "mouse") return;
      pointerNdc.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointerNdc.y = -(e.clientY / window.innerHeight) * 2 + 1;
      pointerNdc.active = true;
      invalidateFn?.();
    },
    { passive: true }
  );
  const deactivate = () => {
    pointerNdc.active = false;
    invalidateFn?.();
  };
  document.documentElement.addEventListener("pointerleave", deactivate);
  window.addEventListener("blur", deactivate);
}

function smoothstep(a: number, b: number, x: number) {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
}

function computeInfluence(dist: number) {
  if (dist >= INFLUENCE_RADIUS_WEAK) return 0;
  if (dist < INFLUENCE_RADIUS_FULL) return 1;
  if (dist < INFLUENCE_RADIUS_MEDIUM) {
    return 1 - smoothstep(INFLUENCE_RADIUS_FULL, INFLUENCE_RADIUS_MEDIUM, dist) * 0.55;
  }
  return 0.45 * (1 - smoothstep(INFLUENCE_RADIUS_MEDIUM, INFLUENCE_RADIUS_WEAK, dist));
}

function useCoarsePointer() {
  return useMemo(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(pointer: coarse)").matches,
    []
  );
}

function makeKeyMaterial() {
  return new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    side: THREE.DoubleSide,
    toneMapped: false,
    uniforms: {
      uHalf: { value: new THREE.Vector3(KEY_W * 0.5, KEY_H * 0.5, KEY_D * 0.5) },
      uRest: { value: REST_COLOR.clone() },
      uLeft: { value: GRAD_LEFT.clone() },
      uMid: { value: GRAD_MID.clone() },
      uRight: { value: GRAD_RIGHT.clone() },
    },
    vertexShader: /* glsl */ `
      attribute float aInfluence;
      attribute float aHue;
      varying vec3 vLocal;
      varying float vInf;
      varying float vHue;
      void main() {
        vLocal = position;
        vInf = aInfluence;
        vHue = aHue;
        vec4 world = modelMatrix * instanceMatrix * vec4(position, 1.0);
        gl_Position = projectionMatrix * viewMatrix * world;
      }
    `,
    fragmentShader: /* glsl */ `
      uniform vec3 uHalf;
      uniform vec3 uRest;
      uniform vec3 uLeft;
      uniform vec3 uMid;
      uniform vec3 uRight;
      varying vec3 vLocal;
      varying float vInf;
      varying float vHue;
      void main() {
        vec3 faceDist = uHalf - abs(vLocal);
        float second = max(min(faceDist.x, faceDist.y), min(max(faceDist.x, faceDist.y), faceDist.z));
        float edge = 1.0 - smoothstep(0.0, 0.04, second);
        vec3 accent = vHue < 0.5
          ? mix(uLeft, uMid, vHue * 2.0)
          : mix(uMid, uRight, (vHue - 0.5) * 2.0);
        float glow = smoothstep(0.08, 0.72, vInf);
        vec3 fill = mix(uRest * 0.35, accent * 0.22, glow);
        vec3 rim = mix(uRest, accent, glow);
        vec3 rgb = mix(fill, rim, edge);
        float top = smoothstep(uHalf.y * 0.2, uHalf.y, vLocal.y);
        rgb += accent * top * glow * 0.55;
        rgb *= 0.22 + glow * 2.15;
        float alpha = mix(0.06 + glow * 0.08, 0.16 + glow * 0.8, edge);
        gl_FragColor = vec4(rgb, alpha);
      }
    `,
  });
}

function makeGlowTexture() {
  const size = 128;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const g = canvas.getContext("2d");
  if (!g) return null;
  const grad = g.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  grad.addColorStop(0, "rgba(240, 171, 252, 0.95)");
  grad.addColorStop(0.22, "rgba(232, 121, 249, 0.4)");
  grad.addColorStop(1, "rgba(168, 85, 247, 0)");
  g.fillStyle = grad;
  g.fillRect(0, 0, size, size);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export function BoxFieldCanvas() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0"
    >
      <Canvas
        orthographic
        dpr={[1, 1.75]}
        frameloop="demand"
        gl={{ antialias: true, powerPreference: "high-performance" }}
        camera={{
          position: [16, 18.5, 16],
          zoom: CAMERA_ZOOM,
          near: 0.1,
          far: 120,
        }}
        onCreated={({ camera, gl }) => {
          camera.lookAt(0, 0, 0);
          gl.setClearColor("#000000", 1);
        }}
      >
        <BoxFieldScene />
        <EffectComposer multisampling={0}>
          <Bloom
            mipmapBlur
            intensity={1.15}
            luminanceThreshold={0.22}
            luminanceSmoothing={0.35}
            radius={0.82}
          />
        </EffectComposer>
      </Canvas>
    </div>
  );
}

function BoxFieldScene() {
  const reduced = useReducedMotion();
  const coarse = useCoarsePointer();
  const activeRef = useRef(true);
  const size = useThree((s) => s.size);
  const camera = useThree((s) => s.camera);

  const specs = useMemo(
    () => gridForViewport(size.width / CAMERA_ZOOM, size.height / CAMERA_ZOOM),
    [size.width, size.height]
  );

  useLayoutEffect(() => {
    camera.lookAt(0, 0, 0);
  }, [camera]);

  useEffect(() => {
    installPointerListener();
    const onVis = () => {
      const on = !document.hidden;
      if (on === activeRef.current) return;
      activeRef.current = on;
      if (on) invalidateFn?.();
    };
    document.addEventListener("visibilitychange", onVis);
    return () => {
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  const raycaster = useMemo(() => new THREE.Raycaster(), []);
  const plane = useMemo(() => new THREE.Plane(new THREE.Vector3(0, 1, 0), 0), []);
  const hit = useMemo(() => new THREE.Vector3(), []);

  useFrame((state, dt) => {
    invalidateFn = state.invalidate;
    if (!activeRef.current) return;
    const cursorDamp = 1 - Math.exp(-CURSOR_DAMP_RATE * Math.min(dt, 0.033));

    cursorLocal.active = false;
    if (pointerNdc.active && !coarse) {
      pointerVec.set(pointerNdc.x, pointerNdc.y);
      raycaster.setFromCamera(pointerVec, state.camera);
      if (raycaster.ray.intersectPlane(plane, hit)) {
        cursorLocal.x = hit.x;
        cursorLocal.y = hit.y;
        cursorLocal.z = hit.z;
        cursorLocal.active = true;
      }
    }

    const targetX = cursorLocal.active ? cursorLocal.x : smoothCursor.x;
    const targetZ = cursorLocal.active ? cursorLocal.z : smoothCursor.z;
    smoothCursor.x += (targetX - smoothCursor.x) * cursorDamp;
    smoothCursor.z += (targetZ - smoothCursor.z) * cursorDamp;
    smoothCursor.active = cursorLocal.active;

    state.invalidate();
  });

  return (
    <>
      <StarPoints />
      <KeyField specs={specs} reduced={reduced} />
      <CursorGlow reduced={reduced} />
    </>
  );
}

function KeyField({ specs, reduced }: { specs: KeySpec[]; reduced: boolean }) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const simRef = useRef<{
    infl: Float32Array;
    vel: Float32Array;
    attr: THREE.InstancedBufferAttribute;
  } | null>(null);

  const geometry = useMemo(() => {
    const infl = new Float32Array(specs.length);
    const hues = new Float32Array(specs.length);
    for (let i = 0; i < specs.length; i++) hues[i] = specs[i].hue;
    const inflAttr = new THREE.InstancedBufferAttribute(infl, 1);
    inflAttr.setUsage(THREE.DynamicDrawUsage);
    const hueAttr = new THREE.InstancedBufferAttribute(hues, 1);
    const geo = new THREE.BoxGeometry(KEY_W, KEY_H, KEY_D);
    geo.setAttribute("aInfluence", inflAttr);
    geo.setAttribute("aHue", hueAttr);
    return geo;
  }, [specs]);

  const material = useMemo(() => makeKeyMaterial(), []);

  useEffect(() => {
    return () => {
      geometry.dispose();
      material.dispose();
    };
  }, [geometry, material]);

  useLayoutEffect(() => {
    const attr = geometry.getAttribute("aInfluence") as THREE.InstancedBufferAttribute;
    simRef.current = {
      infl: attr.array as Float32Array,
      vel: new Float32Array(specs.length),
      attr,
    };
    const mesh = meshRef.current;
    if (!mesh) return;
    dummy.rotation.set(0, 0, 0);
    dummy.scale.set(1, KEY_PRESS_SCALE, 1);
    for (let i = 0; i < specs.length; i++) {
      dummy.position.set(specs[i].x, (KEY_H * KEY_PRESS_SCALE) / 2, specs[i].z);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    }
    mesh.instanceMatrix.needsUpdate = true;
  }, [specs, geometry]);

  useFrame((_, dt) => {
    const mesh = meshRef.current;
    const sim = simRef.current;
    if (!mesh || !sim) return;
    const { infl, vel, attr } = sim;

    const clampedDt = Math.min(dt, 0.033);
    const active = smoothCursor.active;
    const cx = smoothCursor.x;
    const cz = smoothCursor.z;

    for (let i = 0; i < specs.length; i++) {
      const spec = specs[i];
      const target = active ? computeInfluence(Math.hypot(spec.x - cx, spec.z - cz)) : 0;
      if (reduced) {
        infl[i] = target;
        vel[i] = 0;
      } else {
        const acc = (target - infl[i]) * STIFFNESS - vel[i] * DAMPING;
        vel[i] += acc * clampedDt;
        infl[i] += vel[i] * clampedDt;
        if (infl[i] < 0.0008 && target === 0) {
          infl[i] = 0;
          vel[i] = 0;
        }
      }

      const sy = KEY_PRESS_SCALE + infl[i] * (1 - KEY_PRESS_SCALE);
      const lift = reduced ? 0 : infl[i] * KEY_LIFT;
      dummy.position.set(spec.x, (KEY_H * sy) / 2 + lift, spec.z);
      dummy.rotation.set(0, 0, 0);
      dummy.scale.set(1, sy, 1);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    }

    attr.needsUpdate = true;
    mesh.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh
      key={geometry.uuid}
      ref={meshRef}
      args={[geometry, material, specs.length]}
      frustumCulled={false}
    />
  );
}

function CursorGlow({ reduced }: { reduced: boolean }) {
  const group = useRef<THREE.Group>(null);
  const mat = useRef<THREE.SpriteMaterial>(null);
  const sphereMat = useRef<THREE.MeshBasicMaterial>(null);
  const tex = useMemo(() => makeGlowTexture(), []);
  const opacity = useRef(0);

  useFrame((_, dt) => {
    const g = group.current;
    if (!g) return;
    const target = smoothCursor.active && !reduced ? 1 : 0;
    opacity.current += (target - opacity.current) * (1 - Math.exp(-10 * Math.min(dt, 0.033)));
    const o = opacity.current;
    g.visible = o > 0.01;
    g.position.set(
      smoothCursor.x,
      KEY_H * 0.5 + KEY_LIFT + 0.28,
      smoothCursor.z
    );
    if (mat.current) mat.current.opacity = 0.95 * o;
    if (sphereMat.current) sphereMat.current.opacity = o;
  });

  return (
    <group ref={group} visible={false}>
      <mesh>
        <sphereGeometry args={[0.16, 20, 20]} />
        <meshBasicMaterial
          ref={sphereMat}
          color="#f5d0fe"
          transparent
          opacity={0}
          toneMapped={false}
        />
      </mesh>
      {tex && (
        <sprite scale={[1.9, 1.9, 1]} renderOrder={2}>
          <spriteMaterial
            ref={mat}
            map={tex}
            transparent
            depthWrite={false}
            blending={THREE.AdditiveBlending}
            opacity={0}
            toneMapped={false}
          />
        </sprite>
      )}
    </group>
  );
}

function StarPoints() {
  const geometry = useMemo(() => {
    const count = 140;
    const positions = new Float32Array(count * 3);
    const rand = (n: number) => (n * 9301 + 49297) % 233280;
    let s = 42;
    for (let i = 0; i < count; i++) {
      s = rand(s);
      positions[i * 3] = (s / 233280 - 0.5) * 46;
      s = rand(s);
      positions[i * 3 + 1] = (s / 233280 - 0.5) * 22;
      s = rand(s);
      positions[i * 3 + 2] = (s / 233280 - 0.5) * 46;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return geo;
  }, []);

  useEffect(() => {
    return () => geometry.dispose();
  }, [geometry]);

  return (
    <points geometry={geometry} frustumCulled={false}>
      <pointsMaterial
        color="#c4b5fd"
        size={1.35}
        sizeAttenuation={false}
        transparent
        opacity={0.28}
        depthWrite={false}
        toneMapped={false}
      />
    </points>
  );
}
