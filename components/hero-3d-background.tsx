"use client"

import { useRef } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { OrbitControls, Sphere, MeshDistortMaterial } from "@react-three/drei"
import * as THREE from "three"

function AnimatedSphere() {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.getElapsedTime() * 0.2
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.3
    }
  })

  return (
    <Sphere ref={meshRef} args={[1, 100, 100]} scale={2.5}>
      <MeshDistortMaterial color="#f59e0b" attach="material" distort={0.5} speed={2} roughness={0.2} metalness={0.8} />
    </Sphere>
  )
}

function FloatingParticles() {
  const count = 100
  const meshRef = useRef<THREE.InstancedMesh>(null)

  useFrame((state) => {
    if (meshRef.current) {
      for (let i = 0; i < count; i++) {
        const time = state.clock.getElapsedTime()
        const id = i
        const x = Math.sin(time + id) * 5
        const y = Math.cos(time + id * 0.5) * 5
        const z = Math.sin(time * 0.5 + id) * 5

        const matrix = new THREE.Matrix4()
        matrix.setPosition(x, y, z)
        meshRef.current.setMatrixAt(i, matrix)
      }
      meshRef.current.instanceMatrix.needsUpdate = true
    }
  })

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <sphereGeometry args={[0.05, 16, 16]} />
      <meshStandardMaterial color="#f59e0b" emissive="#f59e0b" emissiveIntensity={0.5} />
    </instancedMesh>
  )
}

export default function Hero3DBackground() {
  return (
    <div className="absolute inset-0 z-0 opacity-30">
      <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#f59e0b" />
        <AnimatedSphere />
        <FloatingParticles />
        <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5} />
      </Canvas>
    </div>
  )
}
