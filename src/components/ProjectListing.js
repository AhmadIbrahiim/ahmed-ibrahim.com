import React from 'react'

export default function ProjectListing({ projects }) {
  return (
    <section className="projects">
      {projects.map(project => (
        <div className="each" key={project.title}>
          <h2>
            <a
              className="project-link"
              href={project.source}
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="project-icon">{project.icon}</div>
              <div className="project-title">{project.title}</div>
            </a>
          </h2>
          <p>{project.description}</p>
          <div className="buttons">
            {project.path && (
              <a
                className="button default"
                href={project.path}
                target="_blank"
                rel="noopener noreferrer"
              >
                Link 👇
              </a>
            )}
          </div>
        </div>
      ))}
    </section>
  )
}
