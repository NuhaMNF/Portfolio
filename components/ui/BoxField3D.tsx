"use client";

import { useEffect, useLayoutEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";
import { useTheme } from "@/lib/hooks/useTheme";
import { useKeyGradient, type KeyGradientPreset } from "@/lib/keyGradients";
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
const LIGHT_CLEAR = "#f6f4f0";
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

function makeKeyMaterial(light: boolean, preset: KeyGradientPreset) {
  const colors = light ? preset.light : preset.dark;
  return new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    side: THREE.DoubleSide,
    toneMapped: false,
    uniforms: {
      uHalf: { value: new THREE.Vector3(KEY_W * 0.5, KEY_H * 0.5, KEY_D * 0.5) },
      uRest: { value: REST_COLOR.clone() },
      uLeft: { value: new THREE.Color(colors.left) },
      uMid: { value: new THREE.Color(colors.mid) },
      uRight: { value: new THREE.Color(colors.right) },
      uLight: { value: light ? 1 : 0 },
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
      uniform float uLight;
      varying vec3 vLocal;
      varying float vInf;
      varying float vHue;
      void main() {
        vec3 faceDist = uHalf - abs(vLocal);
        float second = max(min(faceDist.x, faceDist.y), min(max(faceDist.x, faceDist.y), faceDist.z));
        float edge = 1.0 - smoothstep(0.0, mix(0.04, 0.038, uLight), second);
        vec3 accent = vHue < 0.5
          ? mix(uLeft, uMid, vHue * 2.0)
          : mix(uMid, uRight, (vHue - 0.5) * 2.0);
        float glow = smoothstep(0.04, mix(0.62, 0.5, uLight), vInf);
        vec3 paper = vec3(0.965, 0.957, 0.941);
        vec3 rest = mix(uRest, paper, uLight);
        vec3 fillD = mix(uRest * 0.35, accent * 0.22, glow);
        vec3 fillL = mix(paper, accent * 0.92, 0.82);
        vec3 fill = mix(fillD, fillL, uLight);
        vec3 rimD = mix(rest, accent, glow);
        vec3 rimL = mix(accent, vec3(0.18, 0.2, 0.32), 0.12);
        vec3 rim = mix(rimD, rimL, uLight);
        vec3 rgb = mix(fill, rim, edge);
        float top = smoothstep(uHalf.y * 0.2, uHalf.y, vLocal.y);
        rgb += accent * top * glow * mix(0.55, 0.35, uLight);
        rgb *= mix(0.22 + glow * 2.15, 0.85 + glow * 0.55, uLight);
        float aFill = mix(0.06 + glow * 0.08, glow * 0.42, uLight);
        float aEdge = mix(0.16 + glow * 0.8, glow * 0.98, uLight);
        float alpha = mix(aFill, aEdge, edge);
        if (alpha < 0.02) discard;
        gl_FragColor = vec4(rgb, alpha);
      }
    `,
  });
}

function makeGlowTexture(light: boolean, preset: KeyGradientPreset) {
  const size = 128;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const g = canvas.getContext("2d");
  if (!g) return null;
  const grad = g.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  const colors = light ? preset.light : preset.dark;

  grad.addColorStop(0, colors.glowCore);
  grad.addColorStop(0.28, colors.glowMid);
  grad.addColorStop(1, colors.glowEdge);

  g.fillStyle = grad;
  g.fillRect(0, 0, size, size);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export function BoxFieldCanvas() {
  const theme = useTheme();
  const light = theme === "light";
  const { preset } = useKeyGradient();

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 h-full w-full"
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
          gl.setClearColor(light ? LIGHT_CLEAR : "#000000", 1);
        }}
      >
        <ThemeSync light={light} />
        <BoxFieldScene light={light} preset={preset} />
        <EffectComposer multisampling={0}>
          <Bloom
            mipmapBlur
            intensity={light ? 0.7 : 1.15}
            luminanceThreshold={light ? 0.28 : 0.22}
            luminanceSmoothing={0.45}
            radius={light ? 0.62 : 0.82}
          />
        </EffectComposer>
      </Canvas>
    </div>
  );
}

function ThemeSync({ light }: { light: boolean }) {
  const gl = useThree((s) => s.gl);
  useLayoutEffect(() => {
    gl.setClearColor(light ? LIGHT_CLEAR : "#000000", 1);
  }, [gl, light]);
  return null;
}

function BoxFieldScene({
  light,
  preset,
}: {
  light: boolean;
  preset: KeyGradientPreset;
}) {
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
      <StarPoints light={light} preset={preset} />
      <KeyField specs={specs} reduced={reduced} light={light} preset={preset} />
      <CursorGlow reduced={reduced} light={light} preset={preset} />
    </>
  );
}

function KeyField({
  specs,
  reduced,
  light,
  preset,
}: {
  specs: KeySpec[];
  reduced: boolean;
  light: boolean;
  preset: KeyGradientPreset;
}) {
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

  const material = useMemo(() => {
    return makeKeyMaterial(light, preset);
  }, [light, preset]);

  useLayoutEffect(() => {
    const colors = light ? preset.light : preset.dark;
    material.uniforms.uLeft.value.set(colors.left);
    material.uniforms.uMid.value.set(colors.mid);
    material.uniforms.uRight.value.set(colors.right);
    material.uniforms.uLight.value = light ? 1 : 0;
    invalidateFn?.();
  }, [light, preset, material]);

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
      const target = active
        ? computeInfluence(Math.hypot(spec.x - cx, spec.z - cz))
        : 0;
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

function CursorGlow({
  reduced,
  light,
  preset,
}: {
  reduced: boolean;
  light: boolean;
  preset: KeyGradientPreset;
}) {
  const group = useRef<THREE.Group>(null);
  const mat = useRef<THREE.SpriteMaterial>(null);
  const sphereMat = useRef<THREE.MeshBasicMaterial>(null);
  const tex = useMemo(() => makeGlowTexture(light, preset), [light, preset]);
  const opacity = useRef(0);

  useLayoutEffect(() => {
    if (sphereMat.current) {
      sphereMat.current.color.set(light ? preset.light.sphere : preset.dark.sphere);
    }
  }, [light, preset]);

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
    if (mat.current) mat.current.opacity = (light ? 0.72 : 0.95) * o;
    if (sphereMat.current) sphereMat.current.opacity = (light ? 0.7 : 1) * o;
  });

  return (
    <group ref={group} visible={false}>
      <mesh>
        <sphereGeometry args={[0.16, 20, 20]} />
        <meshBasicMaterial
          ref={sphereMat}
          color={light ? preset.light.sphere : preset.dark.sphere}
          transparent
          opacity={0}
          toneMapped={false}
        />
      </mesh>
      {tex && (
        <sprite scale={light ? [2.2, 2.2, 1] : [1.9, 1.9, 1]} renderOrder={2}>
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

function StarPoints({
  light,
  preset,
}: {
  light: boolean;
  preset: KeyGradientPreset;
}) {
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

  if (light) return null;

  return (
    <points geometry={geometry} frustumCulled={false}>
      <pointsMaterial
        color={preset.dark.left}
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
