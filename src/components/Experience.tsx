import React from 'react';
import './ExperienceCard.css';

interface ExperienceItem {
  company: string;
  role: string;
  sector: string;
  summary: string;
  start: string;
  end: string;
  highlights: string[];
}

interface ExperienceProps {
  experience?: ExperienceItem[];
}

const Experience: React.FC<ExperienceProps> = ({ experience = [] }) => {
  return (
    <section className="experience-section">
      <h2 className="experience-title">EXPERIENCE</h2>
      <div className="experience-container">
        {experience.map((exp, index) => (
          <div key={index} className="experience-card">
            <div className="experience-card-header">
              <div className="experience-role-company">
                <h3 className="experience-role">{exp.role}</h3>
                <p className="experience-company">{exp.company}</p>
              </div>
              <div className="experience-meta">
                <p className="experience-sector">{exp.sector}</p>
                <p className="experience-period">
                  {exp.start} — {exp.end}
                </p>
              </div>
            </div>
            
            <p className="experience-summary">{exp.summary}</p>
            
            <ul className="experience-highlights">
              {exp.highlights.map((highlight, idx) => (
                <li key={idx} className="highlight-item">
                  {highlight}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Experience;