import { lazy, Suspense, useState } from 'react';
import { Download } from 'lucide-react';
import type { DetailItem } from '../data/content';

const ModelCanvas = lazy(() => import('./ModelCanvas'));

export function ModelViewer({ models }: { models: DetailItem['models'] }) {
  const [selected, setSelected] = useState(models[0]);
  return <section className="model-viewer" aria-label="3D model viewer">
    <h2>3D models</h2>
    <p>Choose a model to explore. Drag to rotate, scroll or pinch to zoom.</p>
    <label className="model-picker">Model
      <select aria-label="Model" value={selected.src} onChange={event => setSelected(models.find(model => model.src === event.target.value)!)}>
        {models.map(model => <option key={model.src} value={model.src}>{model.name}</option>)}
      </select>
    </label>
    <Suspense fallback={<div className="model-stage" role="status">Loading 3D viewer…</div>}>
      <ModelCanvas key={selected.src} src={selected.src} name={selected.name} />
    </Suspense>
    <a className="exp-text-link model-download" href={selected.src} download={selected.fileName}>Download {selected.name} · STL <Download size={18} aria-hidden="true" /></a>
  </section>;
}
