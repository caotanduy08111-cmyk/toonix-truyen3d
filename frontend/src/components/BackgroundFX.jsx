import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Stars, Sparkles, Float } from '@react-three/drei';

function FloatingBook({ position, scale = 1, speed = 1 }) {
  const ref = useRef();
  useFrame((state) => {
    const t = state.clock.elapsedTime * speed;
    ref.current.rotation.y = 0.5 + Math.sin(t * 0.3) * 0.5;
    ref.current.rotation.x = Math.sin(t * 0.22) * 0.15;
    ref.current.position.y = position[1] + Math.sin(t * 0.5 + position[0]) * 0.45;
  });
  return (
    <Float speed={1.4} rotationIntensity={0.3} floatIntensity={0.9}>
      <group ref={ref} position={position} scale={scale}>
        <mesh>
          <boxGeometry args={[1.5, 2.1, 0.24]} />
          <meshStandardMaterial color="#171410" roughness={0.35} metalness={0.55} />
        </mesh>
        <mesh position={[0, 0, 0.13]}>
          <boxGeometry args={[1.28, 1.9, 0.04]} />
          <meshStandardMaterial color="#D4AF37" emissive="#D4AF37" emissiveIntensity={0.3} metalness={0.85} roughness={0.3} />
        </mesh>
        <mesh position={[0.76, 0, 0]}>
          <boxGeometry args={[0.06, 2.1, 0.24]} />
          <meshStandardMaterial color="#8A1C1C" roughness={0.5} />
        </mesh>
      </group>
    </Float>
  );
}

export const BackgroundFX = () => (
  <div className="fixed inset-0 z-0 pointer-events-none" aria-hidden="true">
    <Canvas camera={{ position: [0, 0, 9], fov: 55 }} dpr={[1, 1.5]}>
      <color attach="background" args={['#050505']} />
      <fog attach="fog" args={['#050505', 8, 22]} />
      <ambientLight intensity={0.25} />
      <spotLight position={[6, 8, 6]} intensity={2.2} color="#D4AF37" angle={0.6} penumbra={1} />
      <Stars radius={70} depth={45} count={2600} factor={3} saturation={0.4} fade speed={0.6} />
      <Sparkles count={90} scale={[16, 10, 8]} size={2.2} speed={0.25} color="#D4AF37" opacity={0.55} />
      <FloatingBook position={[-5.6, 1.2, -3.5]} scale={0.9} speed={0.8} />
      <FloatingBook position={[5.8, -0.6, -4.5]} scale={1.15} speed={0.6} />
      <FloatingBook position={[4.2, 2.6, -6]} scale={0.65} speed={1} />
      <FloatingBook position={[-4.4, -2.4, -5.5]} scale={0.75} speed={0.9} />
    </Canvas>
    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-obsidian" />
  </div>
);
