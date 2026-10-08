import { useEffect, useRef, useState } from 'react';
import { AmbientLight, BufferGeometry, Color, DirectionalLight, Mesh, MeshStandardMaterial, PerspectiveCamera, Scene, Vector3, WebGLRenderer } from 'three';
import { STLLoader } from 'three/addons/loaders/STLLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

type Action = 'left' | 'right' | 'in' | 'out' | 'reset';
export default function ModelCanvas({ src, name }: { src: string; name: string }) {
  const host = useRef<HTMLDivElement>(null);
  const action = useRef<(value: Action) => void>(() => {});
  const [status, setStatus] = useState('Loading model…');
  useEffect(() => {
    const element = host.current!;
    const abort = new AbortController();
    let renderer: WebGLRenderer;
    try { renderer = new WebGLRenderer({ antialias: true }); }
    catch { queueMicrotask(() => setStatus('3D preview is unavailable in this browser. You can still download the STL below.')); return; }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    element.appendChild(renderer.domElement);
    renderer.domElement.setAttribute('aria-label', `Interactive 3D preview of ${name}`);
    const scene = new Scene();
    scene.background = new Color('#111510');
    const camera = new PerspectiveCamera(40, 1, 0.01, 100);
    camera.position.set(3, 2, 3);
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.minDistance = 1.2;
    controls.maxDistance = 15;
    scene.add(new AmbientLight(0xffffff, 1.7));
    const light = new DirectionalLight(0xffe1b4, 3);
    light.position.set(3, 5, 4);
    scene.add(light);
    const fill = new DirectionalLight(0xb4d5ff, 2);
    fill.position.set(-4, 1, -3);
    scene.add(fill);
    const material = new MeshStandardMaterial({ color: '#efbc77', roughness: 0.5, metalness: 0.12 });
    let geometry: BufferGeometry | undefined;
    const render = () => renderer.render(scene, camera);
    const resize = () => {
      const width = Math.max(element.clientWidth, 1);
      const height = Math.max(element.clientHeight, 1);
      renderer.setSize(width, height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      render();
    };
    const observer = new ResizeObserver(resize);
    observer.observe(element);
    controls.addEventListener('change', render);
    controls.update();
    controls.saveState();
    action.current = value => {
      if (value === 'reset') controls.reset();
      else {
        const offset = camera.position.clone().sub(controls.target);
        if (value === 'left' || value === 'right') offset.applyAxisAngle(new Vector3(0, 1, 0), value === 'left' ? -Math.PI / 8 : Math.PI / 8);
        else offset.multiplyScalar(value === 'in' ? 0.8 : 1.25);
        offset.clampLength(controls.minDistance, controls.maxDistance);
        camera.position.copy(controls.target).add(offset);
        controls.update();
      }
      render();
    };
    void fetch(src, { signal: abort.signal }).then(response => {
      if (!response.ok) throw new Error('Model unavailable');
      return response.arrayBuffer();
    }).then(data => {
      if (abort.signal.aborted) return;
      geometry = new STLLoader().parse(data);
      if (!geometry.getAttribute('position')?.count) throw new Error('Empty model');
      geometry.rotateX(-Math.PI / 2);
      geometry.center();
      geometry.computeBoundingSphere();
      const radius = geometry.boundingSphere?.radius ?? 0;
      if (!Number.isFinite(radius) || radius <= 0) throw new Error('Invalid model');
      geometry.scale(1 / radius, 1 / radius, 1 / radius);
      geometry.computeVertexNormals();
      scene.add(new Mesh(geometry, material));
      setStatus('');
      resize();
    }).catch(() => {
      if (!abort.signal.aborted) setStatus('Unable to preview this model. You can still download the STL below.');
    });
    return () => {
      abort.abort();
      observer.disconnect();
      controls.dispose();
      geometry?.dispose();
      material.dispose();
      renderer.dispose();
      renderer.forceContextLoss();
      renderer.domElement.remove();
      action.current = () => {};
    };
  }, [src, name]);
  return <>
    <div className="model-stage"><div className="model-canvas" ref={host} />{status && <p className="model-status" role="status">{status}</p>}</div>
    <div className="model-controls" role="group" aria-label="3D view controls">
      {([['left', 'Rotate left'], ['right', 'Rotate right'], ['in', 'Zoom in'], ['out', 'Zoom out'], ['reset', 'Reset view']] as const).map(([value, label]) => <button key={value} type="button" disabled={!!status} onClick={() => action.current(value)}>{label}</button>)}
    </div>
  </>;
}
