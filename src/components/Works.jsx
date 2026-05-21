import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import "./Works.css";

const ProjectCard = ({
  index,
  name,
  description,
  tags,
  source_code_link,
  isFeatured = false,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      viewport={{ once: true }}
      className={`project-card ${isFeatured ? "featured" : "minor"}`}
    >
      <div className="project-content">
        <h3 className="project-title">{name}</h3>
        <p className="project-description">{description}</p>

        <div className="project-tags">
          {tags.map((tag, idx) => (
            <span key={idx} className="project-tag">
              #{tag}
            </span>
          ))}
        </div>

        {source_code_link && (
          <a
            href={source_code_link}
            target="_blank"
            rel="noopener noreferrer"
            className="project-link"
          >
            View Project →
          </a>
        )}
      </div>
    </motion.div>
  );
};

const Works = () => {
  const [resumeData, setResumeData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResumeData = async () => {
      try {
        const response = await fetch("/api/resume");
        if (response.ok) {
          const data = await response.json();
          setResumeData(data);
        }
      } catch (error) {
        console.error("Error fetching resume data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchResumeData();
  }, []);

  if (loading) {
    return <div className="works-section">Loading projects...</div>;
  }

  const projects = resumeData?.projects || [];
  const featuredProjects = projects.filter((p) => !p.minor);
  const minorProjects = projects.filter((p) => p.minor);

  return (
    <section className="works-section">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        className="works-header"
      >
        <h2 className="works-title">PROJECTS</h2>
        <p className="works-description">
          Following projects showcase my skills and experience through real-world examples of my work.
          Each project is briefly described with links to code repositories. It reflects my ability to
          solve complex problems, work with different technologies, and manage projects effectively.
        </p>
      </motion.div>

      {/* Featured Projects */}
      {featuredProjects.length > 0 && (
        <div className="projects-group featured-group">
          <h3 className="group-title">Featured Projects</h3>
          <div className="projects-grid featured-grid">
            {featuredProjects.map((project, index) => (
              <ProjectCard
                key={`featured-${index}`}
                index={index}
                name={project.title}
                description={project.description}
                tags={project.tags}
                source_code_link={project.url}
                isFeatured={true}
              />
            ))}
          </div>
        </div>
      )}

      {/* Minor Projects */}
      {minorProjects.length > 0 && (
        <div className="projects-group minor-group">
          <h3 className="group-title">Other Projects</h3>
          <div className="projects-grid minor-grid">
            {minorProjects.map((project, index) => (
              <ProjectCard
                key={`minor-${index}`}
                index={index}
                name={project.title}
                description={project.description}
                tags={project.tags}
                source_code_link={project.url}
                isFeatured={false}
              />
            ))}
          </div>
        </div>
      )}
    </section>
  );
};

export default Works;