import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Center, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

// Represents the STL viewer component
// Uses a default placeholder TorusKnot until an actual .stl url is provided
export const STLViewer = ({ url: _url }: { url?: string }) => {
    return (
        <div style={{ width: '100%', height: '300px', borderRadius: '16px', overflow: 'hidden', background: 'rgba(0,0,0,0.5)' }}>
            <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
                <ambientLight intensity={0.5} />
                <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
                <Suspense fallback={<primitive object={new THREE.Mesh(new THREE.BoxGeometry(), new THREE.MeshBasicMaterial({ wireframe: true }))} />}>
                    <Center>
                        {/* If url is provided, you would use useLoader(STLLoader, url) here */}
                        {/* For now, placeholder interactive model */}
                        <mesh>
                            <torusKnotGeometry args={[1, 0.25, 128, 16]} />
                            <meshStandardMaterial color="#00ffcc" metalness={0.5} roughness={0.2} />
                        </mesh>
                    </Center>
                </Suspense>
                <OrbitControls enableZoom={false} autoRotate />
            </Canvas>
        </div>
    );
};
