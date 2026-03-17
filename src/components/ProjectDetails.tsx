import React, { useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stage } from '@react-three/drei';
import { STLLoader } from 'three-stdlib';
import { useLoader } from '@react-three/fiber';

// Explicit STL Model component
const STLModel = ({ url }: { url: string }) => {
    const geom = useLoader(STLLoader, url);
    return (
        <mesh geometry={geom}>
            <meshStandardMaterial color="#64c8ff" />
        </mesh>
    );
};

interface SubProject {
    id: string;
    title: string;
    description: string;
    imagePath: string;
}

interface Project {
    id: string;
    title: string;
    skill: string;
    language: string;
    objective: string;
    description: string;
    imagePath: string;
    type: string;
    papers?: string[];
    subProjects?: SubProject[];
    models?: string[];
    modelsBasePath?: string;
    url?: string;
    tasks?: string[];
    techStack?: string[];
    deprecated?: boolean;
    galleryImages?: string[];
}

interface ProjectDetailsProps {
    project: Project | undefined;
    isActive: boolean;
    onBack: () => void;
}

export const ProjectDetails: React.FC<ProjectDetailsProps> = ({ project, isActive, onBack }) => {
    const [activeModel, setActiveModel] = useState<string | null>(null);
    const [activeImage, setActiveImage] = useState<string | null>(null);
    const [zoomLevel, setZoomLevel] = useState(1);

    const clampZoom = (value: number) => Math.min(4, Math.max(0.5, value));

    const getDocumentViewerUrl = (docPath: string) => {
        if (docPath.includes('Cloud_Economics_PPT')) {
            return `${docPath}#page=14`;
        }
        return docPath;
    };

    const openImageLightbox = (imgPath: string) => {
        setActiveImage(imgPath);
        setZoomLevel(1);
    };

    const closeImageLightbox = () => {
        setActiveImage(null);
        setZoomLevel(1);
    };

    // Reset active model when switching projects
    useEffect(() => {
        setActiveModel(null);
        setActiveImage(null);
        setZoomLevel(1);
    }, [project?.id]);

    useEffect(() => {
        if (!isActive) return;

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape' && activeImage) {
                event.preventDefault();
                closeImageLightbox();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isActive, activeImage]);

    if (!project) return null;

    // The 3D models directory contains these files
    const mainModelFiles = [
        'Brush-holder.stl',
        'Frispie.stl',
        'Hinge.stl',
        'Screw.stl',
        'Toy-Dryer.stl',
        'Wiper Fix.stl'
    ];

    const renderModelGrid = (files: string[], basePath: string, title: string) => (
        <div className="details-section">
            <h3>{title}</h3>
            <p style={{ marginBottom: '1.5rem', color: 'var(--text-secondary)' }}>
                Select a model below to load and interact with it. Only one model loads at a time for performance.
            </p>
            <div className="models-grid">
                {files.map((file) => {
                    const url = `${basePath}/${file}`;
                    const isLoaded = activeModel === url;

                    return (
                        <div key={file} className="model-card">
                            <div className="model-viewer-container">
                                {isLoaded ? (
                                    <>
                                        <button className="unload-model-btn" onClick={() => setActiveModel(null)}>
                                            Close
                                        </button>
                                        <Canvas shadows camera={{ position: [0, 0, 100], fov: 50 }}>
                                            <Stage environment="city" intensity={0.5}>
                                                <STLModel url={url} />
                                            </Stage>
                                            <OrbitControls makeDefault />
                                        </Canvas>
                                    </>
                                ) : (
                                    <div style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
                                        <p style={{ fontSize: '3rem', margin: 0, opacity: 0.2 }}>📐</p>
                                    </div>
                                )}
                            </div>
                            <h4>{file.replace('.stl', '')}</h4>
                            {!isLoaded && (
                                <button className="load-model-btn" onClick={() => setActiveModel(url)}>
                                    Load 3D Model
                                </button>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );

    return (
        <div className={`project-details-page ${isActive ? 'active' : ''}`}>
            <button className="back-button" onClick={onBack}>
                ← Back to Portfolio
            </button>

            <div className="details-header">
                <img src={project.imagePath} alt={project.title} className="details-cover" />
            </div>

            <div className="details-content">
                <h1 className="details-title">{project.title}</h1>

                <div className="details-meta">
                    <span className="project-badge">{project.skill}</span>
                    <span className="project-badge language">{project.language}</span>
                </div>

                {/* Description */}
                <div className="details-section">
                    <h3>About This Project</h3>
                    <p style={{ lineHeight: 1.8, color: 'var(--text-secondary)' }}>{project.description}</p>
                    {project.deprecated && (
                        <p style={{ marginTop: '1rem', color: 'var(--accent-secondary)' }}>
                            Note: This project is now deprecated.
                        </p>
                    )}
                </div>

                {project.url && (
                    <div className="details-section">
                        <h3>Project Link</h3>
                        <a href={project.url} target="_blank" rel="noopener noreferrer" className="read-btn">
                            Open Live Project
                        </a>
                    </div>
                )}

                {project.techStack && project.techStack.length > 0 && (
                    <div className="details-section">
                        <h3>Tech Stack</h3>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                            {project.techStack.map((tech) => (
                                <span key={tech} className="badge">{tech}</span>
                            ))}
                        </div>
                    </div>
                )}

                {project.tasks && project.tasks.length > 0 && (
                    <div className="details-section">
                        <h3>Key Contributions</h3>
                        <ul style={{ margin: 0, paddingLeft: '1.25rem', color: 'var(--text-secondary)', lineHeight: 1.8 }}>
                            {project.tasks.map((task, index) => (
                                <li key={`${project.id}-task-${index}`}>{task}</li>
                            ))}
                        </ul>
                    </div>
                )}

                {project.galleryImages && project.galleryImages.length > 0 && (
                    <div className="details-section">
                        <h3>Project Gallery</h3>
                        <div className="details-gallery-grid">
                            {project.galleryImages.map((imgPath, index) => (
                                <button
                                    key={`${project.id}-gallery-${index}`}
                                    type="button"
                                    className="details-gallery-button"
                                    onClick={() => openImageLightbox(imgPath)}
                                    aria-label={`Open ${project.title} preview ${index + 1}`}
                                >
                                    <img
                                        src={imgPath}
                                        alt={`${project.title} preview ${index + 1}`}
                                        className="details-gallery-image"
                                    />
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Robotics Sub-Projects */}
                {project.subProjects && project.subProjects.length > 0 && (
                    <div className="details-section">
                        <h3>Sub-Projects</h3>
                        <div className="projects-grid" style={{ marginTop: '1.5rem' }}>
                            {project.subProjects.map((sub: SubProject) => (
                                <div key={sub.id} className="project-card" style={{ cursor: 'default' }}>
                                    <img src={sub.imagePath} alt={sub.title} className="project-card-image" />
                                    <div className="project-card-content">
                                        <h3 className="project-card-title">{sub.title}</h3>
                                        <p className="project-card-objective">{sub.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Papers / Publications Section for this specific project */}
                {project.papers && project.papers.length > 0 && (
                    <div className="details-section">
                        <h3>Related Publications & Reports</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                            {project.papers.map((pdfPath: string, idx: number) => (
                                <div key={idx} style={{ width: '100%' }}>
                                    <p style={{ marginBottom: '1rem', color: 'var(--accent-secondary)' }}>
                                        Document {idx + 1}: {pdfPath.split('/').pop()}
                                    </p>
                                    <iframe
                                        src={getDocumentViewerUrl(pdfPath)}
                                        className="pdf-preview"
                                        title={`PDF Preview ${idx}`}
                                    />
                                    <a href={getDocumentViewerUrl(pdfPath)} target="_blank" rel="noopener noreferrer" className="read-btn" style={{ marginTop: '1rem' }}>
                                        Open PDF in New Tab
                                    </a>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Main 3D Models Interactive Section */}
                {project.type === '3d_model' && (
                    <>
                        {renderModelGrid(mainModelFiles, '/data/3d_models', 'Interactive 3D Models')}
                        {/* Also show bike-light models here */}
                        {renderModelGrid(
                            ['Cap - Cap.stl', 'Cap - Case.stl', 'Cycle-holder-bottom.stl', 'Cycle-holder-top.stl',
                                'Nut-Final.stl', 'Part Studio 1 - Botttom-Base-Sample.stl',
                                'Part Studio 1 - Botttom-Top-Sample.stl', 'Part Studio 1 - Botttom.stl', 'Part Studio 1.stl'],
                            '/data/smart-bike-light-project/3d-models',
                            'Smart Bike Light Components'
                        )}
                    </>
                )}

                {/* Bike-light specific 3D models when viewing that project */}
                {project.models && project.models.length > 0 && project.modelsBasePath && (
                    renderModelGrid(project.models, project.modelsBasePath, '3D Printed Components')
                )}
            </div>

            {activeImage && (
                <div className="image-lightbox-overlay" onClick={closeImageLightbox}>
                    <div className="image-lightbox-panel" onClick={(event) => event.stopPropagation()}>
                        <div className="image-lightbox-controls">
                            <button type="button" className="lightbox-control-btn" onClick={() => setZoomLevel((prev) => clampZoom(prev - 0.2))}>-</button>
                            <span className="lightbox-zoom-label">{Math.round(zoomLevel * 100)}%</span>
                            <button type="button" className="lightbox-control-btn" onClick={() => setZoomLevel((prev) => clampZoom(prev + 0.2))}>+</button>
                            <button type="button" className="lightbox-control-btn" onClick={() => setZoomLevel(1)}>Reset</button>
                            <button type="button" className="lightbox-control-btn" onClick={closeImageLightbox}>Close</button>
                        </div>
                        <div
                            className="image-lightbox-stage"
                            onWheel={(event) => {
                                event.preventDefault();
                                setZoomLevel((prev) => clampZoom(prev + (event.deltaY < 0 ? 0.1 : -0.1)));
                            }}
                        >
                            <img
                                src={activeImage}
                                alt={`${project.title} expanded preview`}
                                className="image-lightbox-image"
                                style={{ transform: `scale(${zoomLevel})` }}
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
