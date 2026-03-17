import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useScroll } from '@react-three/drei';
import * as THREE from 'three';

export const DynamicModel = () => {
    const groupRef = useRef<THREE.Group>(null);
    const scroll = useScroll();

    // Create materials
    const carMaterial = useMemo(() => new THREE.MeshStandardMaterial({
        color: '#ff2222', // Red car
        roughness: 0.3,
        metalness: 0.5,
    }), []);

    const windowMaterial = useMemo(() => new THREE.MeshStandardMaterial({
        color: '#88ccff', // Light blue glass
        roughness: 0.1,
        metalness: 0.8,
    }), []);

    const wheelMaterial = useMemo(() => new THREE.MeshStandardMaterial({
        color: '#111111', // Black wheels
        roughness: 0.9,
    }), []);

    const busMaterial = useMemo(() => new THREE.MeshStandardMaterial({
        color: '#ffcc00', // Yellow school bus
        roughness: 0.4,
        metalness: 0.2,
    }), []);

    const busDetailMaterial = useMemo(() => new THREE.MeshStandardMaterial({
        color: '#222222', // Bus stripes
        roughness: 0.8,
    }), []);

    // Refs for individual objects to scale them based on scroll
    const carRef = useRef<THREE.Group>(null);
    const busRef = useRef<THREE.Group>(null);

    // We will collect wheel refs to spin them
    const wheelsRef = useRef<THREE.Mesh[]>([]);

    useFrame((_state, delta) => {
        if (!groupRef.current) return;

        // Base rotation to show the vehicle from a 2D top-down perspective
        // Rotating Math.PI/2 on X so the vehicle length (Z) points down (-Y)
        groupRef.current.rotation.x = Math.PI / 2;
        groupRef.current.rotation.y = 0;
        groupRef.current.rotation.z = 0;

        const s = scroll.offset;

        // Transformation at Education (~0.5)
        // Car is visible [0, 0.45], fades out [0.45, 0.5]
        const carScale = THREE.MathUtils.clamp(1 - Math.max(0, s - 0.45) * 20, 0, 1);
        // Bus fades in [0.45, 0.5] and becomes 1.0 from 0.5 onwards
        const busScale = THREE.MathUtils.clamp((s - 0.45) * 20, 0, 1);

        if (carRef.current) carRef.current.scale.setScalar(THREE.MathUtils.lerp(carRef.current.scale.x, carScale, 0.2));
        if (busRef.current) busRef.current.scale.setScalar(THREE.MathUtils.lerp(busRef.current.scale.x, busScale, 0.2));

        // Moving downward in discrete stops like a 2D game
        // 5 stops total: 0 = Hero, 1 = Work, 2 = Education, 3 = Projects, 4 = Hobbies
        // Since s goes from 0 to 1, s * 4 goes from 0 to 4.
        const stopIndex = Math.round(s * 4);

        // Map stop index to specific Y positions on screen
        // These can be tuned based on the layout
        const stopPositions = [
            2.5,  // Top (Hero)
            0.5,  // Work
            -1.5, // Education
            -3.5, // Projects
            -5.5  // Hobbies
        ];

        const targetY = stopPositions[stopIndex];
        const previousY = groupRef.current.position.y;

        // Drive smoothly to Target Y
        groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, targetY, 0.08);

        const deltaY = previousY - groupRef.current.position.y;

        // Spin wheels when moving
        if (Math.abs(deltaY) > 0.001) {
            wheelsRef.current.forEach(wheel => {
                if (wheel) {
                    wheel.rotation.x += delta * 15 * Math.sign(deltaY);
                }
            });
        }
    });

    const addWheel = (el: THREE.Mesh | null) => {
        if (el && !wheelsRef.current.includes(el)) {
            wheelsRef.current.push(el);
        }
    };

    return (
        <group ref={groupRef}>
            {/* Red Car */}
            <group ref={carRef} scale={0}>
                {/* Main Body */}
                <mesh material={carMaterial} position={[0, -0.2, 0]}>
                    <boxGeometry args={[1.5, 0.5, 3]} />
                </mesh>
                {/* Cabin */}
                <mesh material={windowMaterial} position={[0, 0.4, -0.2]}>
                    <boxGeometry args={[1.3, 0.6, 1.5]} />
                </mesh>
                {/* Wheels */}
                <mesh ref={el => addWheel(el)} material={wheelMaterial} position={[0.8, -0.4, 1]} rotation={[0, 0, Math.PI / 2]}>
                    <cylinderGeometry args={[0.3, 0.3, 0.2, 16]} />
                </mesh>
                <mesh ref={el => addWheel(el)} material={wheelMaterial} position={[-0.8, -0.4, 1]} rotation={[0, 0, Math.PI / 2]}>
                    <cylinderGeometry args={[0.3, 0.3, 0.2, 16]} />
                </mesh>
                <mesh ref={el => addWheel(el)} material={wheelMaterial} position={[0.8, -0.4, -1]} rotation={[0, 0, Math.PI / 2]}>
                    <cylinderGeometry args={[0.3, 0.3, 0.2, 16]} />
                </mesh>
                <mesh ref={el => addWheel(el)} material={wheelMaterial} position={[-0.8, -0.4, -1]} rotation={[0, 0, Math.PI / 2]}>
                    <cylinderGeometry args={[0.3, 0.3, 0.2, 16]} />
                </mesh>
            </group>

            {/* Yellow School Bus */}
            <group ref={busRef} scale={0}>
                {/* Main Body */}
                <mesh material={busMaterial} position={[0, 0, 0]}>
                    <boxGeometry args={[1.6, 1.2, 4]} />
                </mesh>
                {/* Strip */}
                <mesh material={busDetailMaterial} position={[0, -0.1, 0]}>
                    <boxGeometry args={[1.65, 0.1, 4.05]} />
                </mesh>
                {/* Windows */}
                <mesh material={windowMaterial} position={[0, 0.3, 0.2]}>
                    <boxGeometry args={[1.65, 0.4, 3]} />
                </mesh>
                {/* Front windshield */}
                <mesh material={windowMaterial} position={[0, 0.3, 2]}>
                    <boxGeometry args={[1.4, 0.4, 0.1]} />
                </mesh>
                {/* Wheels */}
                <mesh ref={el => addWheel(el)} material={wheelMaterial} position={[0.9, -0.6, 1.2]} rotation={[0, 0, Math.PI / 2]}>
                    <cylinderGeometry args={[0.3, 0.3, 0.2, 16]} />
                </mesh>
                <mesh ref={el => addWheel(el)} material={wheelMaterial} position={[-0.9, -0.6, 1.2]} rotation={[0, 0, Math.PI / 2]}>
                    <cylinderGeometry args={[0.3, 0.3, 0.2, 16]} />
                </mesh>
                <mesh ref={el => addWheel(el)} material={wheelMaterial} position={[0.9, -0.6, -1.2]} rotation={[0, 0, Math.PI / 2]}>
                    <cylinderGeometry args={[0.3, 0.3, 0.2, 16]} />
                </mesh>
                <mesh ref={el => addWheel(el)} material={wheelMaterial} position={[-0.9, -0.6, -1.2]} rotation={[0, 0, Math.PI / 2]}>
                    <cylinderGeometry args={[0.3, 0.3, 0.2, 16]} />
                </mesh>
            </group>
        </group>
    );
};
