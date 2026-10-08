import { lazy, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

const PortfolioPage = lazy(() => import('./components/PortfolioPage'))
const ProjectPages = lazy(() => import('./components/ProjectPages'))
const projectPage = new URLSearchParams(window.location.search).get('page') === 'projects'

createRoot(document.getElementById('root')!).render(
  <Suspense fallback={<p role="status">Loading portfolio…</p>}>
    {projectPage ? <ProjectPages /> : <PortfolioPage />}
  </Suspense>
)
