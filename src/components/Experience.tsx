import React, { useState } from 'react';
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

interface SelectedExp {
  index: number;
  data: ExperienceItem;
}

const Experience: React.FC<ExperienceProps> = ({ experience = [] }) => {
  const [selectedExp, setSelectedExp] = useState<SelectedExp | null>(null);

  if (experience.length === 0) {
    return null;
  }

  return (
    <section className="experience-section">
      <h2 className="experience-title">EXPERIENCE</h2>
      <p className="experience-subtitle">Professional journey and key achievements</p>
      
      <div className="experience-grid">
        {experience.map((exp, index) => (
          <div
            key={index}
            className="experience-card"
            onClick={() => setSelectedExp({ index, data: exp })}
          >
            <div className="experience-card-inner">
              <div className="experience-card-header">
                <h3 className="experience-role">{exp.role}</h3>
                <p className="experience-company">{exp.company}</p>
              </div>
              
              <div className="experience-card-meta">
                <p className="experience-sector">{exp.sector}</p>
                <p className="experience-period">{exp.start} — {exp.end}</p>
              </div>
              
              <p className="experience-summary">{exp.summary}</p>
              
              <div className="experience-card-footer">
                <span className="experience-read-more">Click to expand →</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Popup */}
      {selectedExp && (
        <div className="experience-modal-overlay" onClick={() => setSelectedExp(null)}>
          <div className="experience-modal" onClick={(e) => e.stopPropagation()}>
            <button
              className="experience-modal-close"
              onClick={() => setSelectedExp(null)}
            >
              ✕
            </button>

            <div className="experience-modal-content">
              <div className="experience-modal-header">
                <h2 className="experience-modal-role">{selectedExp.data.role}</h2>
                <p className="experience-modal-company">{selectedExp.data.company}</p>
              </div>

              <div className="experience-modal-meta">
                <p className="experience-modal-sector">
                  <strong>Sector:</strong> {selectedExp.data.sector}
                </p>
                <p className="experience-modal-period">
                  <strong>Period:</strong> {selectedExp.data.start} — {selectedExp.data.end}
                </p>
              </div>

              <p className="experience-modal-summary">{selectedExp.data.summary}</p>

              <h3 className="experience-modal-highlights-title">Highlights</h3>
              <ul className="experience-modal-highlights">
                {selectedExp.data.highlights.map((highlight, idx) => (
                  <li key={idx} className="experience-modal-highlight-item">
                    {highlight}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Experience;