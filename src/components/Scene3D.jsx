import { Component, useMemo, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Float, MeshDistortMaterial, Sparkles } from '@react-three/drei'
import * as THREE from 'three'
import { scrollState } from '../lib/scroll'

const damp = THREE.MathUtils.damp

/** Hero blob + wireframe shell + orbit rings. */
function Core() {
  const shell = useRef()
  const ringA = useRef()
  const ringB = useRef()

  useFrame((_, dt) => {
    shell.current.rotation.y += dt * 0.18
    shell.current.rotation.x += dt * 0.08
    ringA.current.rotation.z += dt * 0.35
    ringB.current.rotation.z -= dt * 0.25
  })

  return (
    <>
      <Float speed={2} rotationIntensity={0.4} floatIntensity={0.8}>
        <mesh>
          <icosahedronGeometry args={[1.35, 32]} />
          <MeshDistortMaterial
            color="#8b5cf6"
            emissive="#4c1d95"
            emissiveIntensity={0.7}
            roughness={0.12}
            metalness={0.55}
            distort={0.42}
            speed={2.2}
          />
        </mesh>
      </Float>

      <mesh ref={shell}>
        <icosahedronGeometry args={[2.1, 2]} />
        <meshBasicMaterial color="#f472b6" wireframe transparent opacity={0.22} />
      </mesh>

      <group rotation={[1.15, 0.2, 0]}>
        <mesh ref={ringA}>
          <torusGeometry args={[2.75, 0.012, 12, 160]} />
          <meshBasicMaterial color="#c084fc" transparent opacity={0.85} />
        </mesh>
      </group>
      <group rotation={[-0.5, 0.9, 0.4]}>
        <mesh ref={ringB}>
          <torusGeometry args={[3.2, 0.01, 12, 160]} />
          <meshBasicMaterial color="#f472b6" transparent opacity={0.6} />
        </mesh>
      </group>
    </>
  )
}

const SATELLITES = [
  { geo: 'box', r: 3.4, a: 0.2, y: 0.6, s: 0.38, c: '#f472b6' },
  { geo: 'octa', r: 3.7, a: 1.5, y: -0.9, s: 0.34, c: '#c084fc' },
  { geo: 'cone', r: 3.3, a: 2.7, y: 1.2, s: 0.34, c: '#fb7185' },
  { geo: 'torus', r: 3.9, a: 3.9, y: -0.3, s: 0.3, c: '#a78bfa' },
  { geo: 'dodeca', r: 3.5, a: 5.0, y: -1.3, s: 0.32, c: '#ffd1e8' },
  { geo: 'tetra', r: 4.0, a: 5.9, y: 1.0, s: 0.34, c: '#8b5cf6' },
]

function Geo({ type }) {
  switch (type) {
    case 'box':
      return <boxGeometry args={[1, 1, 1]} />
    case 'octa':
      return <octahedronGeometry args={[0.8]} />
    case 'cone':
      return <coneGeometry args={[0.7, 1.2, 3]} />
    case 'torus':
      return <torusGeometry args={[0.6, 0.22, 16, 40]} />
    case 'dodeca':
      return <dodecahedronGeometry args={[0.75]} />
    default:
      return <tetrahedronGeometry args={[0.9]} />
  }
}

function Satellites() {
  const group = useRef()
  useFrame((_, dt) => {
    group.current.rotation.y += dt * 0.22
  })
  return (
    <group ref={group}>
      {SATELLITES.map((s) => (
        <Float key={s.geo} speed={1.6 + s.a * 0.1} rotationIntensity={2} floatIntensity={1.2}>
          <mesh position={[Math.cos(s.a) * s.r, s.y, Math.sin(s.a) * s.r]} scale={s.s}>
            <Geo type={s.geo} />
            <meshStandardMaterial
              color={s.c}
              emissive={s.c}
              emissiveIntensity={0.25}
              roughness={0.25}
              metalness={0.6}
            />
          </mesh>
        </Float>
      ))}
    </group>
  )
}

/** Moves / spins the whole cluster based on scroll + pointer. */
function Rig({ children }) {
  const group = useRef()
  const { viewport } = useThree()

  useFrame((state, dt) => {
    const p = scrollState.progress
    const m = scrollState.mouse
    const narrow = viewport.width < 7
    const g = group.current

    // in the hero the orb peeks out from behind the portrait, then eases back as you scroll
    const hero = Math.max(0, 1 - p * 9)
    const targetX = narrow ? 0 : Math.cos(p * Math.PI * 5) * viewport.width * (0.27 + hero * 0.06)
    const targetY = narrow ? 1.4 - p * 2 : Math.sin(p * Math.PI * 3) * 0.9 + hero * 0.65
    const targetS = narrow ? 0.62 : 1 - Math.min(p * 1.4, 0.3) + hero * 0.3

    g.position.x = damp(g.position.x, targetX, 2.6, dt)
    g.position.y = damp(g.position.y, targetY, 2.6, dt)
    g.scale.setScalar(damp(g.scale.x, targetS, 2.6, dt))
    g.rotation.y = damp(g.rotation.y, p * Math.PI * 6 + m.x * 0.5, 2.2, dt)
    g.rotation.x = damp(g.rotation.x, m.y * 0.3 + p * 1.2, 2.2, dt)

    state.camera.position.x = damp(state.camera.position.x, m.x * 0.6, 2, dt)
    state.camera.position.y = damp(state.camera.position.y, m.y * 0.4, 2, dt)
    state.camera.lookAt(0, 0, 0)
  })

  return <group ref={group}>{children}</group>
}

/** Distant starfield that slowly drifts with scroll. */
function Stars() {
  const ref = useRef()
  const positions = useMemo(() => {
    const n = 900
    const arr = new Float32Array(n * 3)
    for (let i = 0; i < n; i++) {
      const r = 10 + Math.random() * 18
      const t = Math.random() * Math.PI * 2
      const ph = Math.acos(2 * Math.random() - 1)
      arr[i * 3] = r * Math.sin(ph) * Math.cos(t)
      arr[i * 3 + 1] = r * Math.sin(ph) * Math.sin(t)
      arr[i * 3 + 2] = r * Math.cos(ph) - 6
    }
    return arr
  }, [])

  useFrame((_, dt) => {
    ref.current.rotation.y += dt * 0.012
    ref.current.rotation.x = damp(ref.current.rotation.x, scrollState.progress * 0.8, 1.5, dt)
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.05} color="#ffd1e8" transparent opacity={0.65} sizeAttenuation depthWrite={false} />
    </points>
  )
}

class SceneBoundary extends Component {
  state = { failed: false }
  static getDerivedStateFromError() {
    return { failed: true }
  }
  render() {
    return this.state.failed ? null : this.props.children
  }
}

export default function Scene3D() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0" aria-hidden>
      <SceneBoundary>
        <Canvas
          dpr={[1, 1.6]}
          camera={{ position: [0, 0, 8], fov: 45 }}
          gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        >
          <ambientLight intensity={0.55} />
          <pointLight position={[4, 3, 5]} intensity={90} color="#c084fc" />
          <pointLight position={[-5, -2, 4]} intensity={70} color="#f472b6" />
          <directionalLight position={[0, 5, 5]} intensity={0.8} />

          <Stars />
          <Sparkles count={110} scale={[16, 9, 6]} size={3} speed={0.35} color="#ffd1e8" opacity={0.7} />
          <Rig>
            <Core />
            <Satellites />
          </Rig>
        </Canvas>
      </SceneBoundary>
    </div>
  )
}
