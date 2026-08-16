'use client';

import { useRef, useMemo, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

const COUNT = 3000;

function generatePositions(shape: number) {
    const positions = new Float32Array(COUNT * 3);
    for (let i = 0; i < COUNT; i++) {
        let x = 0, y = 0, z = 0;

        switch (shape) {
            case 0: // Smartphone (Precision Grids)
                let px = 0, py = 0;
                if (i < 400) {
                    // Outer frame
                    const p = i / 400;
                    const dist = p * 14.8;
                    if (dist < 2.4) { px = dist - 1.2; py = 2.5; }
                    else if (dist < 7.4) { px = 1.2; py = 2.5 - (dist - 2.4); }
                    else if (dist < 9.8) { px = 1.2 - (dist - 7.4); py = -2.5; }
                    else { px = -1.2; py = -2.5 + (dist - 9.8); }
                } else if (i < 800) {
                    // Inner frame
                    const p = (i - 400) / 400;
                    const dist = p * 14.0;
                    if (dist < 2.2) { px = dist - 1.1; py = 2.4; }
                    else if (dist < 7.0) { px = 1.1; py = 2.4 - (dist - 2.2); }
                    else if (dist < 9.2) { px = 1.1 - (dist - 7.0); py = -2.4; }
                    else { px = -1.1; py = -2.4 + (dist - 9.2); }
                } else if (i < 850) {
                    // Speaker
                    px = ((i - 800) / 49 - 0.5) * 0.8;
                    py = 2.2;
                } else if (i < 900) {
                    // Home bar
                    px = ((i - 850) / 49 - 0.5) * 1.0;
                    py = -2.3;
                } else {
                    // 3 internal grids (2100 points, 700 each)
                    const gridIdx = Math.floor((i - 900) / 700);
                    const gPt = (i - 900) % 700;
                    const gCol = gPt % 35; 
                    const gRow = Math.floor(gPt / 35); 
                    const gyOffset = gridIdx === 0 ? 1.0 : (gridIdx === 1 ? -0.4 : -1.8);
                    px = (gCol / 34 - 0.5) * 1.8;
                    py = gyOffset + (gRow / 19 - 0.5) * 0.8;
                }
                const tilt = 0.2;
                x = px * Math.cos(tilt);
                y = py;
                z = px * Math.sin(tilt);
                break;

            case 1: // Neural Core (Fibonacci Sphere)
                if (i < 2500) {
                    const phi = Math.acos(1 - 2 * (i + 0.5) / 2500);
                    const theta = Math.PI * (1 + Math.sqrt(5)) * (i + 0.5);
                    const r = 3;
                    x = r * Math.sin(phi) * Math.cos(theta);
                    y = r * Math.sin(phi) * Math.sin(theta);
                    z = r * Math.cos(phi);
                } else {
                    const j = i - 2500;
                    const phi = Math.acos(1 - 2 * (j + 0.5) / 500);
                    const theta = Math.PI * (1 + Math.sqrt(5)) * (j + 0.5);
                    const r = 1.2;
                    x = r * Math.sin(phi) * Math.cos(theta);
                    y = r * Math.sin(phi) * Math.sin(theta);
                    z = r * Math.cos(phi);
                }
                break;

            case 2: // IoT Hub (Torus + Core)
                if (i < 2000) {
                    const uSteps = 80;
                    const vSteps = 25;
                    const uIdx = i % uSteps;
                    const vIdx = Math.floor(i / uSteps) % vSteps;
                    const u = (uIdx / uSteps) * Math.PI * 2;
                    const v = (vIdx / vSteps) * Math.PI * 2;
                    const R = 2.0;
                    const r = 0.5;
                    x = (R + r * Math.cos(v)) * Math.cos(u);
                    y = (R + r * Math.cos(v)) * Math.sin(u);
                    z = r * Math.sin(v);
                    const temp = y; y = z; z = temp; // lay flat
                } else {
                    const j = i - 2000;
                    const phi = Math.acos(1 - 2 * (j + 0.5) / 1000);
                    const theta = Math.PI * (1 + Math.sqrt(5)) * (j + 0.5);
                    const r = 0.8;
                    x = r * Math.sin(phi) * Math.cos(theta);
                    y = r * Math.sin(phi) * Math.sin(theta);
                    z = r * Math.cos(phi);
                }
                break;

            case 3: // Cloud (Fibonacci Intersecting Spheres)
                const sphereIdx = Math.floor(i / 1000);
                const pointIdx = i % 1000;
                const cx = sphereIdx === 0 ? 0 : (sphereIdx === 1 ? -1.5 : 1.5);
                const cy = sphereIdx === 0 ? 0.5 : 0;
                const cr = sphereIdx === 0 ? 1.8 : 1.3;
                
                const phi = Math.acos(1 - 2 * (pointIdx + 0.5) / 1000);
                const theta = Math.PI * (1 + Math.sqrt(5)) * (pointIdx + 0.5);
                
                x = cx + cr * Math.sin(phi) * Math.cos(theta);
                y = cy + cr * Math.sin(phi) * Math.sin(theta);
                if (y < -0.8) y = -0.8; // flatten bottom cleanly
                z = cr * Math.cos(phi);
                break;

            case 4: // Server Stack (Fibonacci Discs)
                const layer = Math.floor(i / 1000);
                const pt = i % 1000;
                const h = (layer - 1) * 2.0;
                
                const radius = 2.0;
                const rDisk = radius * Math.sqrt((pt + 0.5) / 1000);
                const thetaDisk = Math.PI * (1 + Math.sqrt(5)) * (pt + 0.5);
                x = rDisk * Math.cos(thetaDisk);
                y = h;
                z = rDisk * Math.sin(thetaDisk);
                break;
        }

        positions[i * 3] = x;
        positions[i * 3 + 1] = y;
        positions[i * 3 + 2] = z;
    }
    return positions;
}

export function ServiceParticles({ activeIndex, light = false }: { activeIndex: number; light?: boolean }) {
    const pointsRef = useRef<THREE.Points>(null);
    const { gl } = useThree();

    // Pointer state tracking (relative to canvas viewport)
    const pointerState = useRef({
        targetNdc: new THREE.Vector2(0, 0),
        ndc: new THREE.Vector2(0, 0),
        lastNdc: new THREE.Vector2(0, 0),
        vel: 0,
        active: false,
        isOverCanvas: false,
    });

    useEffect(() => {
        const onMove = (e: PointerEvent) => {
            const canvasEl = gl.domElement;
            if (!canvasEl) return;
            const rect = canvasEl.getBoundingClientRect();
            if (!rect.width || !rect.height) return;

            // Calculate precise canvas-relative NDC [-1, 1]
            const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
            const ny = -((e.clientY - rect.top) / rect.height) * 2 + 1;

            pointerState.current.targetNdc.set(nx, ny);
            pointerState.current.isOverCanvas =
                e.clientX >= rect.left &&
                e.clientX <= rect.right &&
                e.clientY >= rect.top &&
                e.clientY <= rect.bottom;
            pointerState.current.active = true;
        };

        const onLeave = () => {
            pointerState.current.active = false;
            pointerState.current.isOverCanvas = false;
        };

        window.addEventListener('pointermove', onMove, { passive: true });
        window.addEventListener('pointerleave', onLeave);

        return () => {
            window.removeEventListener('pointermove', onMove);
            window.removeEventListener('pointerleave', onLeave);
        };
    }, [gl]);

    const dotTexture = useMemo(() => {
        const canvas = document.createElement('canvas');
        canvas.width = 32;
        canvas.height = 32;
        const ctx = canvas.getContext('2d');
        if (ctx) {
            ctx.beginPath();
            ctx.arc(16, 16, 16, 0, Math.PI * 2);
            ctx.fillStyle = '#ffffff';
            ctx.fill();
        }
        return new THREE.CanvasTexture(canvas);
    }, []);

    // Precompute all shapes
    const shapes = useMemo(() => {
        return [
            generatePositions(0),
            generatePositions(1),
            generatePositions(2),
            generatePositions(3),
            generatePositions(4),
        ];
    }, []);

    // Initial positions and colors
    const positions = useMemo(() => {
        return new Float32Array(shapes[0]);
    }, [shapes]);

    const colors = useMemo(() => {
        const cols = new Float32Array(COUNT * 3);
        const r = light ? 0.42 : 0.97;
        const g = light ? 0.30 : 0.95;
        const b = light ? 0.08 : 0.92;
        for (let i = 0; i < COUNT; i++) {
            cols[i * 3] = r;
            cols[i * 3 + 1] = g;
            cols[i * 3 + 2] = b;
        }
        return cols;
    }, [light]);

    // Reusable math objects for performance
    const mathObjects = useMemo(() => ({
        raycaster: new THREE.Raycaster(),
        worldPlane: new THREE.Plane(new THREE.Vector3(0, 0, 1), 0),
        planeNormal: new THREE.Vector3(0, 0, 1),
        hitPoint: new THREE.Vector3(),
        localCursor: new THREE.Vector3(0, 0, 0),
        invMatrix: new THREE.Matrix4(),
    }), []);

    useFrame((state, delta) => {
        const points = pointsRef.current;
        if (!points) return;

        const time = state.clock.getElapsedTime();
        const p = pointerState.current;

        // Smooth pointer tracking & velocity
        p.ndc.x += (p.targetNdc.x - p.ndc.x) * Math.min(1, delta * 9);
        p.ndc.y += (p.targetNdc.y - p.ndc.y) * Math.min(1, delta * 9);

        const speed = Math.hypot(p.ndc.x - p.lastNdc.x, p.ndc.y - p.lastNdc.y) / Math.max(delta, 0.001);
        p.vel += (Math.min(speed, 4) - p.vel) * 0.12;
        p.lastNdc.copy(p.ndc);

        // Subtle 3D Parallax & Gentle Tilting (only when over canvas area)
        const targetRotY = (p.isOverCanvas ? p.ndc.x * 0.14 : 0) + Math.sin(time * 0.35) * 0.14;
        const targetRotX = (p.isOverCanvas ? -p.ndc.y * 0.10 : 0) + Math.sin(time * 0.22) * 0.05;
        const targetRotZ = p.isOverCanvas ? p.ndc.x * p.ndc.y * 0.03 : 0;

        points.rotation.y += (targetRotY - points.rotation.y) * Math.min(1, delta * 4.5);
        points.rotation.x += (targetRotX - points.rotation.x) * Math.min(1, delta * 4.5);
        points.rotation.z += (targetRotZ - points.rotation.z) * Math.min(1, delta * 4.5);

        const targetPosX = p.isOverCanvas ? p.ndc.x * 0.16 : 0;
        const targetPosY = p.isOverCanvas ? p.ndc.y * 0.12 : 0;
        points.position.x += (targetPosX - points.position.x) * Math.min(1, delta * 3.5);
        points.position.y += (targetPosY - points.position.y) * Math.min(1, delta * 3.5);

        // Project pointer to 3D local object coordinates
        points.updateWorldMatrix(true, false);
        const { raycaster, worldPlane, planeNormal, hitPoint, localCursor, invMatrix } = mathObjects;
        invMatrix.copy(points.matrixWorld).invert();

        raycaster.setFromCamera(p.ndc, state.camera);
        worldPlane.set(planeNormal.set(0, 0, 1), 0);
        if (raycaster.ray.intersectPlane(worldPlane, hitPoint)) {
            localCursor.copy(hitPoint).applyMatrix4(invMatrix);
        } else {
            localCursor.set(p.ndc.x * 3.5, p.ndc.y * 3.5, 0);
        }

        // Direct object hover detection: only activate deformation when cursor is near/over the particle object
        const cursorDistFromCenter = Math.hypot(localCursor.x, localCursor.y);
        const isNearObject = p.active && cursorDistFromCenter < 3.8;

        // Particle shape lerping & subtle cursor-sensitive physical deformation
        const geometry = points.geometry;
        const currentPositions = geometry.attributes.position.array as Float32Array;
        const currentColors = geometry.attributes.color.array as Float32Array;
        const targetPositions = shapes[activeIndex] ?? shapes[0]!;

        const inflRadius = 1.4; // Tight proximity radius so only particles directly under cursor move
        const inflRadiusSq = inflRadius * inflRadius;
        const baseR = light ? 0.42 : 0.97;
        const baseG = light ? 0.3 : 0.95;
        const baseB = light ? 0.08 : 0.92;

        for (let i = 0; i < COUNT; i++) {
            const ix = i * 3;
            const iy = ix + 1;
            const iz = ix + 2;

            const bx = targetPositions[ix];
            const by = targetPositions[iy];
            const bz = targetPositions[iz];

            const curX = currentPositions[ix];
            const curY = currentPositions[iy];
            const curZ = currentPositions[iz];

            // Distance in local space from cursor to particle base position
            const dx = bx - localCursor.x;
            const dy = by - localCursor.y;
            const dz = bz - localCursor.z;
            const distSq = dx * dx + dy * dy + dz * dz;

            let dispX = 0;
            let dispY = 0;
            let dispZ = 0;
            let excitation = 0;

            if (isNearObject && distSq < inflRadiusSq) {
                const dist = Math.sqrt(distSq);
                const u = 1 - dist / inflRadius;
                const u2 = u * u;
                excitation = u;

                // 1. Subtle, gentle elastic deflection directly under pointer
                const repel = (u2 * 0.38) / (dist + 0.25);
                dispX += dx * repel;
                dispY += dy * repel;
                dispZ += dz * repel;

                // 2. Liquid fluid vortex swirl
                const swirl = u2 * (0.22 + p.vel * 0.08);
                dispX += -dy * swirl;
                dispY += dx * swirl;

                // 3. Liquid surface wave ripple
                const ripple = Math.sin(dist * 5.2 - time * 5.0) * u * 0.09;
                dispX += (dx / (dist + 0.1)) * ripple;
                dispY += (dy / (dist + 0.1)) * ripple;
                dispZ += ripple + Math.cos(dist * 4.0 - time * 4.2) * u2 * 0.11;

                // 4. Liquid Chromatic Iridescent Color Sheen
                const angle = Math.atan2(dy, dx);
                const fluidPhase = dist * 5.8 - time * 4.2 + angle * 1.6 + (bx + by) * 0.8;

                // Smooth chromatic spectrum (cyan -> violet -> magenta -> gold -> emerald)
                const liqR = 0.52 + 0.48 * Math.cos(fluidPhase + 0.0);
                const liqG = 0.52 + 0.48 * Math.cos(fluidPhase + 2.094);
                const liqB = 0.52 + 0.48 * Math.cos(fluidPhase + 4.188);

                // Liquid specular sheen highlights
                const spec = Math.pow(Math.max(0, Math.sin(fluidPhase * 1.5)), 4) * 0.35;

                // Fluid color blend with smooth falloff
                const mixFactor = u * (0.85 + 0.15 * Math.sin(time * 3.5 + dist * 3.0));
                const targetR = THREE.MathUtils.lerp(baseR, Math.min(1.0, liqR * 1.2 + spec), mixFactor);
                const targetG = THREE.MathUtils.lerp(baseG, Math.min(1.0, liqG * 1.2 + spec), mixFactor);
                const targetB = THREE.MathUtils.lerp(baseB, Math.min(1.0, liqB * 1.2 + spec), mixFactor);

                currentColors[ix] += (targetR - currentColors[ix]) * Math.min(1, delta * 6.5);
                currentColors[iy] += (targetG - currentColors[iy]) * Math.min(1, delta * 6.5);
                currentColors[iz] += (targetB - currentColors[iz]) * Math.min(1, delta * 6.5);
            } else {
                // Smooth relaxation back to base warm ivory white
                currentColors[ix] += (baseR - currentColors[ix]) * Math.min(1, delta * 3.2);
                currentColors[iy] += (baseG - currentColors[iy]) * Math.min(1, delta * 3.2);
                currentColors[iz] += (baseB - currentColors[iz]) * Math.min(1, delta * 3.2);
            }

            // Subtle organic breathing drift
            const breath = Math.sin(time * 1.2 + i * 0.02) * 0.015;
            const targetX = bx + dispX + breath;
            const targetY = by + dispY + breath;
            const targetZ = bz + dispZ;

            // Smooth spring return
            const lerpK = THREE.MathUtils.lerp(delta * 2.5, delta * 5.0, excitation);
            currentPositions[ix] += (targetX - curX) * lerpK;
            currentPositions[iy] += (targetY - curY) * lerpK;
            currentPositions[iz] += (targetZ - curZ) * lerpK;
        }

        geometry.attributes.position.needsUpdate = true;
        geometry.attributes.color.needsUpdate = true;
    });

    return (
        <points ref={pointsRef}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    args={[positions, 3]}
                    usage={THREE.DynamicDrawUsage}
                />
                <bufferAttribute
                    attach="attributes-color"
                    args={[colors, 3]}
                    usage={THREE.DynamicDrawUsage}
                />
            </bufferGeometry>
            <pointsMaterial
                size={0.11}
                map={dotTexture}
                alphaTest={0.5}
                vertexColors
                transparent
                opacity={light ? 0.88 : 0.92}
                sizeAttenuation
                blending={light ? THREE.NormalBlending : THREE.AdditiveBlending}
                depthWrite={false}
            />
        </points>
    );
}


