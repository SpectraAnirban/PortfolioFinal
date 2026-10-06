import { useEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { ContactShadows, Float, RoundedBox, Sparkles } from '@react-three/drei';
import * as THREE from 'three';
import { createCodeScreen, createStatusScreen } from './codeScreen.js';

/*
  A stylised developer at a desk. The monitor's code is typed live from a canvas texture;
  every typed character presses a keyboard key and dips the matching hand.
  Coordinates: the developer sits at +z facing -z (toward the monitors).
*/

const PALETTE = {
  hoodie: '#6d4cff',
  hoodieDark: '#4a2fd1',
  skin: '#c98d66',
  hair: '#17110e',
  pants: '#1d2133',
  desk: '#231c2c',
  metal: '#3a3f55',
  keyBase: '#151826',
  key: '#2a2f45',
  frame: '#10121c',
};

const UP = new THREE.Vector3(0, 1, 0);
const tmpDir = new THREE.Vector3();

// Places a unit-height cylinder so it spans from point a to point b.
function spanBetween(mesh, a, b) {
  tmpDir.subVectors(b, a);
  const len = tmpDir.length();
  mesh.position.copy(a).addScaledVector(tmpDir, 0.5);
  mesh.scale.set(1, len, 1);
  mesh.quaternion.setFromUnitVectors(UP, tmpDir.normalize());
}

function Limb({ radius = 0.055, color }) {
  return (
    <mesh castShadow>
      <cylinderGeometry args={[radius, radius * 0.92, 1, 12]} />
      <meshStandardMaterial color={color} roughness={0.75} />
    </mesh>
  );
}

const KEY_COLS = 14;
const KEY_ROWS = 4;

function Workstation({ typingRef }) {
  const code = useMemo(() => createCodeScreen(), []);
  const status = useMemo(() => createStatusScreen(), []);
  useEffect(() => () => { code.dispose(); status.dispose(); }, [code, status]);

  // ---- Keyboard (instanced keys) ----
  const keysRef = useRef();
  const keyPress = useMemo(() => new Float32Array(KEY_COLS * KEY_ROWS), []);
  const keyPos = useMemo(() => {
    const arr = [];
    for (let r = 0; r < KEY_ROWS; r++) {
      for (let c = 0; c < KEY_COLS; c++) {
        arr.push(new THREE.Vector3(-0.39 + c * 0.06, 1.052, 0.115 + r * 0.058));
      }
    }
    return arr;
  }, []);
  const glowRef = useRef();

  // ---- Developer rig ----
  const rig = useMemo(() => ({
    shoulderL: new THREE.Vector3(-0.27, 1.47, 0.97),
    shoulderR: new THREE.Vector3(0.27, 1.47, 0.97),
    handL: new THREE.Vector3(),
    handR: new THREE.Vector3(),
    elbowL: new THREE.Vector3(),
    elbowR: new THREE.Vector3(),
    pressL: 0,
    pressR: 0,
    targetL: new THREE.Vector3(-0.17, 1.08, 0.2),
    targetR: new THREE.Vector3(0.17, 1.08, 0.2),
  }), []);
  const upperL = useRef(), foreL = useRef(), upperR = useRef(), foreR = useRef();
  const handLRef = useRef(), handRRef = useRef();
  const headRef = useRef(), torsoRef = useRef();
  const steamRefs = [useRef(), useRef(), useRef()];

  const dummy = useMemo(() => new THREE.Object3D(), []);
  const clock = useRef({ next: 0, blink: 0, status: 0 });

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    const dt = Math.min(delta, 0.05);
    const c = clock.current;

    // Typing clock: ~18 chars/s with natural pauses at line ends.
    if (t >= c.next) {
      const ch = code.step();
      if (ch === null) {
        c.next = t + 2.2; // pause, then the snippet restarts
      } else {
        const isNewline = ch === '\n';
        c.next = t + (isNewline ? 0.32 : 0.035 + Math.random() * 0.05);
        if (ch.trim()) {
          // Press a key on the half of the keyboard matching a hand.
          const left = Math.random() < 0.5;
          const col = left ? Math.floor(Math.random() * 7) : 7 + Math.floor(Math.random() * 7);
          const row = Math.floor(Math.random() * KEY_ROWS);
          keyPress[row * KEY_COLS + col] = 1;
          const kp = keyPos[row * KEY_COLS + col];
          if (left) { rig.pressL = 1; rig.targetL.set(kp.x, 1.08, kp.z); } else { rig.pressR = 1; rig.targetR.set(kp.x, 1.08, kp.z); }
        } else if (isNewline) {
          keyPress[3 * KEY_COLS + 13] = 1; // "enter"
          rig.pressR = 1;
        }
        typingRef.current = (typingRef.current || 0) + 1;
      }
      code.draw(Math.floor(t * 2) % 2 === 0);
    }
    if (t - c.status > 0.5) { status.draw(t); c.status = t; }

    // Keys
    if (keysRef.current) {
      for (let i = 0; i < keyPos.length; i++) {
        keyPress[i] = Math.max(0, keyPress[i] - dt * 9);
        const p = keyPos[i];
        dummy.position.set(p.x, p.y - keyPress[i] * 0.012, p.z);
        dummy.scale.set(i === 3 * KEY_COLS + 13 ? 1.6 : 1, 1, 1);
        dummy.updateMatrix();
        keysRef.current.setMatrixAt(i, dummy.matrix);
      }
      keysRef.current.instanceMatrix.needsUpdate = true;
    }
    if (glowRef.current) glowRef.current.color.setHSL((t * 0.05) % 1, 0.8, 0.55);

    // Hands: ease toward the last key, dip on press, then decay.
    rig.pressL = Math.max(0, rig.pressL - dt * 8);
    rig.pressR = Math.max(0, rig.pressR - dt * 8);
    rig.handL.lerp(rig.targetL, 1 - Math.pow(0.0005, dt)).setY(1.085 - rig.pressL * 0.03 + Math.sin(t * 3) * 0.004);
    rig.handR.lerp(rig.targetR, 1 - Math.pow(0.0005, dt)).setY(1.085 - rig.pressR * 0.03 + Math.sin(t * 3 + 1) * 0.004);
    rig.handL.x = Math.min(rig.handL.x, -0.06);
    rig.handR.x = Math.max(rig.handR.x, 0.06);

    // Elbows hang below and outside the shoulder→hand line.
    rig.elbowL.lerpVectors(rig.shoulderL, rig.handL, 0.48).add({ x: -0.1, y: -0.17, z: 0.1 });
    rig.elbowR.lerpVectors(rig.shoulderR, rig.handR, 0.48).add({ x: 0.1, y: -0.17, z: 0.1 });

    if (upperL.current) {
      spanBetween(upperL.current, rig.shoulderL, rig.elbowL);
      spanBetween(foreL.current, rig.elbowL, rig.handL);
      spanBetween(upperR.current, rig.shoulderR, rig.elbowR);
      spanBetween(foreR.current, rig.elbowR, rig.handR);
      handLRef.current.position.copy(rig.handL);
      handRRef.current.position.copy(rig.handR);
    }

    // Subtle breathing, focus nods and an occasional glance at the side monitor.
    if (headRef.current) {
      const glance = Math.max(0, Math.sin(t * 0.35) - 0.82) * 4;
      headRef.current.rotation.y = THREE.MathUtils.lerp(headRef.current.rotation.y, glance * 0.45, 0.08);
      headRef.current.rotation.x = -0.12 + Math.sin(t * 1.7) * 0.025;
    }
    if (torsoRef.current) torsoRef.current.scale.setScalar(1 + Math.sin(t * 1.4) * 0.008);

    // Coffee steam
    steamRefs.forEach((r, i) => {
      if (!r.current) return;
      const p = (t * 0.35 + i / 3) % 1;
      r.current.position.set(0.98 + Math.sin(t * 2 + i) * 0.015, 1.16 + p * 0.28, 0.22);
      r.current.material.opacity = Math.sin(p * Math.PI) * 0.35;
      r.current.scale.setScalar(0.6 + p * 0.9);
    });
  });

  const hoodie = <meshStandardMaterial color={PALETTE.hoodie} roughness={0.7} />;

  return (
    <group>
      {/* Desk */}
      <RoundedBox args={[2.7, 0.06, 1.15]} radius={0.02} position={[0, 0.98, 0]} castShadow receiveShadow>
        <meshStandardMaterial color={PALETTE.desk} roughness={0.55} metalness={0.1} />
      </RoundedBox>
      {[[-1.25, -0.48], [1.25, -0.48], [-1.25, 0.48], [1.25, 0.48]].map(([x, z]) => (
        <mesh key={`${x}${z}`} position={[x, 0.475, z]} castShadow>
          <boxGeometry args={[0.05, 0.95, 0.05]} />
          <meshStandardMaterial color={PALETTE.metal} metalness={0.6} roughness={0.35} />
        </mesh>
      ))}

      {/* Main monitor */}
      <group position={[0, 1.58, -0.32]}>
        <RoundedBox args={[1.42, 0.92, 0.05]} radius={0.025} castShadow>
          <meshStandardMaterial color={PALETTE.frame} roughness={0.4} metalness={0.4} />
        </RoundedBox>
        <mesh position={[0, 0.01, 0.027]}>
          <planeGeometry args={[1.34, 0.8375]} />
          <meshBasicMaterial map={code.texture} toneMapped={false} />
        </mesh>
        {/* Screen bar light */}
        <mesh position={[0, 0.49, 0.02]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.018, 0.018, 0.7, 12]} />
          <meshStandardMaterial color="#20243a" emissive="#ffd9a8" emissiveIntensity={0.4} />
        </mesh>
        <mesh position={[0, -0.6, -0.05]}><cylinderGeometry args={[0.03, 0.035, 0.32, 12]} /><meshStandardMaterial color={PALETTE.metal} metalness={0.7} roughness={0.3} /></mesh>
      </group>
      <mesh position={[0, 1.02, -0.37]} receiveShadow><cylinderGeometry args={[0.2, 0.22, 0.02, 32]} /><meshStandardMaterial color={PALETTE.metal} metalness={0.7} roughness={0.3} /></mesh>

      {/* Side monitor (portrait) */}
      <group position={[-1.02, 1.5, -0.12]} rotation={[0, 0.55, 0]}>
        <RoundedBox args={[0.56, 0.7, 0.04]} radius={0.02} castShadow>
          <meshStandardMaterial color={PALETTE.frame} roughness={0.4} metalness={0.4} />
        </RoundedBox>
        <mesh position={[0, 0, 0.022]}>
          <planeGeometry args={[0.52, 0.65]} />
          <meshBasicMaterial map={status.texture} toneMapped={false} />
        </mesh>
        <mesh position={[0, -0.47, -0.03]}><cylinderGeometry args={[0.025, 0.03, 0.26, 12]} /><meshStandardMaterial color={PALETTE.metal} metalness={0.7} roughness={0.3} /></mesh>
      </group>

      {/* Keyboard */}
      <RoundedBox args={[0.92, 0.03, 0.27]} radius={0.01} position={[0, 1.025, 0.2]} castShadow>
        <meshStandardMaterial color={PALETTE.keyBase} roughness={0.5} metalness={0.3} />
      </RoundedBox>
      <mesh position={[0, 1.012, 0.2]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.98, 0.33]} />
        <meshBasicMaterial ref={glowRef} transparent opacity={0.35} toneMapped={false} />
      </mesh>
      <instancedMesh ref={keysRef} args={[null, null, KEY_COLS * KEY_ROWS]} castShadow>
        <boxGeometry args={[0.05, 0.018, 0.048]} />
        <meshStandardMaterial color={PALETTE.key} roughness={0.45} metalness={0.2} />
      </instancedMesh>

      {/* Mouse, mug + steam, plant */}
      <mesh position={[0.66, 1.03, 0.22]} scale={[1, 0.5, 1.5]} castShadow><sphereGeometry args={[0.04, 16, 12]} /><meshStandardMaterial color="#e6e8f2" roughness={0.3} /></mesh>
      <group position={[0.98, 1.01, 0.22]}>
        <mesh position={[0, 0.07, 0]} castShadow><cylinderGeometry args={[0.055, 0.05, 0.14, 24]} /><meshStandardMaterial color="#f2f0ea" roughness={0.35} /></mesh>
        <mesh position={[0.06, 0.075, 0]} rotation={[0, 0, Math.PI / 2]}><torusGeometry args={[0.03, 0.009, 8, 16]} /><meshStandardMaterial color="#f2f0ea" roughness={0.35} /></mesh>
      </group>
      {steamRefs.map((r, i) => (
        <mesh key={i} ref={r}><sphereGeometry args={[0.025, 10, 8]} /><meshBasicMaterial color="#ffffff" transparent opacity={0} depthWrite={false} /></mesh>
      ))}
      <group position={[1.12, 1.01, -0.33]}>
        <mesh position={[0, 0.09, 0]} castShadow><cylinderGeometry args={[0.09, 0.07, 0.18, 20]} /><meshStandardMaterial color="#2b2f45" roughness={0.6} /></mesh>
        {[0, 1, 2, 3, 4, 5, 6].map((i) => (
          <mesh key={i} position={[Math.cos(i * 0.9) * 0.05, 0.3 + (i % 3) * 0.05, Math.sin(i * 0.9) * 0.05]} rotation={[Math.cos(i * 0.9) * 0.5, i, Math.sin(i * 0.9) * 0.5]} scale={[0.6, 2.2, 0.25]} castShadow>
            <sphereGeometry args={[0.06, 10, 8]} />
            <meshStandardMaterial color={i % 2 ? '#2f9e6a' : '#3cbf7f'} roughness={0.6} flatShading />
          </mesh>
        ))}
      </group>

      {/* Chair */}
      <group position={[0, 0, 1.02]}>
        <RoundedBox args={[0.62, 0.08, 0.56]} radius={0.03} position={[0, 0.74, 0]} castShadow><meshStandardMaterial color="#1a1d2b" roughness={0.6} /></RoundedBox>
        <RoundedBox args={[0.6, 0.78, 0.07]} radius={0.04} position={[0, 1.2, 0.32]} rotation={[0.12, 0, 0]} castShadow><meshStandardMaterial color="#1a1d2b" roughness={0.6} /></RoundedBox>
        <mesh position={[0, 0.4, 0]}><cylinderGeometry args={[0.035, 0.035, 0.66, 12]} /><meshStandardMaterial color={PALETTE.metal} metalness={0.7} roughness={0.3} /></mesh>
        {[0, 1, 2, 3, 4].map((i) => (
          <mesh key={i} position={[Math.cos((i / 5) * Math.PI * 2) * 0.17, 0.06, Math.sin((i / 5) * Math.PI * 2) * 0.17]} rotation={[0, -(i / 5) * Math.PI * 2, 0]}>
            <boxGeometry args={[0.34, 0.03, 0.04]} />
            <meshStandardMaterial color={PALETTE.metal} metalness={0.7} roughness={0.3} />
          </mesh>
        ))}
      </group>

      {/* Developer */}
      <group>
        <group ref={torsoRef} position={[0, 1.2, 1.0]} rotation={[-0.16, 0, 0]}>
          <mesh castShadow><capsuleGeometry args={[0.235, 0.36, 8, 20]} />{hoodie}</mesh>
          {/* hood */}
          <mesh position={[0, 0.3, 0.13]} scale={[1, 0.6, 0.8]} castShadow><sphereGeometry args={[0.17, 16, 12]} /><meshStandardMaterial color={PALETTE.hoodieDark} roughness={0.75} /></mesh>
        </group>
        {/* hips + legs */}
        <mesh position={[0, 0.86, 1.02]} castShadow><boxGeometry args={[0.44, 0.16, 0.34]} /><meshStandardMaterial color={PALETTE.pants} roughness={0.8} /></mesh>
        {[-0.12, 0.12].map((x) => (
          <group key={x}>
            <mesh position={[x, 0.84, 0.78]} rotation={[Math.PI / 2, 0, 0]} castShadow><capsuleGeometry args={[0.085, 0.42, 6, 12]} /><meshStandardMaterial color={PALETTE.pants} roughness={0.8} /></mesh>
            <mesh position={[x, 0.45, 0.55]} castShadow><capsuleGeometry args={[0.07, 0.62, 6, 12]} /><meshStandardMaterial color={PALETTE.pants} roughness={0.8} /></mesh>
            <RoundedBox args={[0.12, 0.07, 0.24]} radius={0.03} position={[x, 0.04, 0.5]} castShadow><meshStandardMaterial color="#e9e9ef" roughness={0.5} /></RoundedBox>
          </group>
        ))}
        {/* arms */}
        <group ref={upperL}><Limb radius={0.07} color={PALETTE.hoodie} /></group>
        <group ref={foreL}><Limb radius={0.058} color={PALETTE.hoodie} /></group>
        <group ref={upperR}><Limb radius={0.07} color={PALETTE.hoodie} /></group>
        <group ref={foreR}><Limb radius={0.058} color={PALETTE.hoodie} /></group>
        {[handLRef, handRRef].map((r, i) => (
          <mesh key={i} ref={r} castShadow scale={[1, 0.55, 1.25]}><sphereGeometry args={[0.05, 14, 10]} /><meshStandardMaterial color={PALETTE.skin} roughness={0.6} /></mesh>
        ))}
        {/* head */}
        <mesh position={[0, 1.55, 0.95]}><cylinderGeometry args={[0.06, 0.07, 0.12, 12]} /><meshStandardMaterial color={PALETTE.skin} roughness={0.6} /></mesh>
        <group ref={headRef} position={[0, 1.72, 0.93]}>
          <mesh castShadow><sphereGeometry args={[0.165, 24, 20]} /><meshStandardMaterial color={PALETTE.skin} roughness={0.6} /></mesh>
          <mesh position={[0, 0.03, 0.02]} scale={[1.06, 1, 1.08]} castShadow>
            <sphereGeometry args={[0.165, 24, 16, 0, Math.PI * 2, 0, Math.PI * 0.55]} />
            <meshStandardMaterial color={PALETTE.hair} roughness={0.9} />
          </mesh>
          {/* headphones */}
          <mesh position={[0, 0.02, 0]}><torusGeometry args={[0.185, 0.018, 10, 32, Math.PI]} /><meshStandardMaterial color="#111" roughness={0.4} metalness={0.3} /></mesh>
          {[-1, 1].map((s) => (
            <mesh key={s} position={[s * 0.18, 0.0, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
              <cylinderGeometry args={[0.065, 0.065, 0.05, 20]} />
              <meshStandardMaterial color="#141420" emissive="#22d3ee" emissiveIntensity={0.25} roughness={0.4} />
            </mesh>
          ))}
        </group>
      </group>
    </group>
  );
}

// Floating capability tags orbiting the desk.
function TechTags() {
  const tags = ['Node.js', 'React', 'MySQL', 'Docker', 'RabbitMQ', 'Socket.IO', 'AWS S3', 'Sequelize'];
  const textures = useMemo(() => tags.map((label) => {
    const c = document.createElement('canvas');
    c.width = 512; c.height = 128;
    const ctx = c.getContext('2d');
    ctx.fillStyle = 'rgba(14,16,28,0.85)';
    ctx.strokeStyle = 'rgba(124,92,255,0.9)';
    ctx.lineWidth = 4;
    ctx.beginPath(); ctx.roundRect(6, 6, 500, 116, 58); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#e9ebf3';
    ctx.font = '600 54px "Space Grotesk", sans-serif';
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText(label, 256, 68);
    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }), []); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => () => textures.forEach((t) => t.dispose()), [textures]);

  const group = useRef();
  useFrame((_, d) => { if (group.current) group.current.rotation.y += d * 0.12; });

  return (
    <group ref={group} position={[0, 1.4, 0.2]}>
      {textures.map((tex, i) => {
        const a = (i / textures.length) * Math.PI * 2;
        return (
          <Float key={i} speed={1.6} floatIntensity={0.6} rotationIntensity={0}>
            <sprite position={[Math.cos(a) * 1.4, Math.sin(i * 1.7) * 0.3 + 0.5, Math.sin(a) * 1.5]} scale={[0.46, 0.115, 1]}>
              <spriteMaterial map={tex} transparent depthWrite={false} />
            </sprite>
          </Float>
        );
      })}
    </group>
  );
}

function Rig({ compact }) {
  const { camera, pointer, size } = useThree();
  const target = useMemo(() => new THREE.Vector3(0, 1.25, 0.25), []);
  // Pull the camera back on narrow canvases so the whole desk stays in frame.
  const base = useMemo(() => {
    const offset = new THREE.Vector3(3.1, 1.05, 3.45);
    const aspect = size.width / Math.max(size.height, 1);
    offset.multiplyScalar(Math.max(1, 1.05 / aspect) * (compact ? 1.08 : 1));
    return offset.add(target);
  }, [size.width, size.height, compact, target]);
  useFrame(() => {
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, base.x + pointer.x * 0.6, 0.04);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, base.y + pointer.y * 0.35, 0.04);
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, base.z, 0.04);
    camera.lookAt(target);
  });
  return null;
}

export default function DeveloperScene({ active = true, compact = false, onKeystroke }) {
  const typingRef = useRef(0);
  useEffect(() => {
    if (!onKeystroke) return;
    const id = setInterval(() => onKeystroke(typingRef.current), 250);
    return () => clearInterval(id);
  }, [onKeystroke]);

  return (
    <Canvas
      shadows
      dpr={[1, 1.75]}
      frameloop={active ? 'always' : 'never'}
      camera={{ position: [3.1, 2.3, 3.7], fov: 36 }}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
    >
      <ambientLight intensity={0.35} />
      <hemisphereLight args={['#b8a8ff', '#0b0d17', 0.45]} />
      <directionalLight position={[4, 6, 3]} intensity={1.2} castShadow shadow-mapSize={[1024, 1024]} shadow-camera-left={-3} shadow-camera-right={3} shadow-camera-top={3} shadow-camera-bottom={-3} />
      <pointLight position={[0, 1.6, 0.4]} intensity={1.6} distance={2.5} color="#7fd3ff" />
      <pointLight position={[-2.5, 2.2, -1.5]} intensity={18} distance={7} color="#7c5cff" />
      <pointLight position={[2.6, 1.2, -1.2]} intensity={10} distance={6} color="#22d3ee" />
      <spotLight position={[0, 2.1, -0.15]} angle={0.7} penumbra={0.8} intensity={4} distance={2} color="#ffd9a8" />

      <Workstation typingRef={typingRef} />
      <TechTags />
      <Sparkles count={60} scale={[5, 3, 5]} position={[0, 1.6, 0]} size={2.2} speed={0.3} color="#a99bff" opacity={0.6} />

      <ContactShadows position={[0, 0.005, 0]} opacity={0.6} scale={7} blur={2.4} far={2.5} resolution={512} />
      <Rig compact={compact} />
    </Canvas>
  );
}
