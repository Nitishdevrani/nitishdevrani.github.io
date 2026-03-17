import React from 'react';
import { STLViewer } from './STLViewer';

interface ProjectCardProps {
    project: {
        id: string;
        title: string;
        skill: string;
        language: string;
        objective: string;
        imagePath: string;
        type: string;
    };
    onClick: (id: string) => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, onClick }) => {
    return (
        <div className="project-card" onClick={() => onClick(project.id)}>
            {project.type === '3d_model' ? (
                <div style={{ width: '100%', height: '180px', overflow: 'hidden', position: 'relative' }}>
                    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1, pointerEvents: 'none' }}>
                        <STLViewer />
                    </div>
                </div>
            ) : (
                <img src={project.imagePath} alt={project.title} className="project-card-image" />
            )}

            <div className="project-card-content">
                <h3 className="project-card-title">{project.title}</h3>
                <div className="project-card-meta">
                    <span className="project-badge">{project.skill}</span>
                    <span className="project-badge language">{project.language}</span>
                </div>
                <p className="project-card-objective">{project.objective}</p>
            </div>
        </div>
    );
};
