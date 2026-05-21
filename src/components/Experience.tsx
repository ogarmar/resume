import React, { useState, useEffect } from 'react';
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

  const handleEscape = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      setSelectedExp(null);
    }
  };

  useEffect(() => {
    if (selectedExp) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [selectedExp]);

  const closeModal = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setSelectedExp(null);
  };

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
                <span className="experience-sector">{exp.sector}</span>
                <span className="experience-period">{exp.start} — {exp.end}</span>
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
      <div 
        className={`experience-modal-overlay ${selectedExp ? 'active' : ''}`}
        onClick={() => closeModal()}
      >
        <div className="experience-modal" onClick={(e) => e.stopPropagation()}>
          <button
            className="experience-modal-close"
            onClick={closeModal}
          >
            ✕
          </button>

          {selectedExp && (
            <div className="experience-modal-content">
              <div className="experience-modal-header">
                <h2 className="experience-modal-role">{selectedExp.data.role}</h2>
                <p className="experience-modal-company">{selectedExp.data.company}</p>
              </div>

              <div className="experience-modal-meta">
                <p className="experience-modal-sector">
                  {selectedExp.data.sector}
                </p>
                <p className="experience-modal-period">
                  {selectedExp.data.start} — {selectedExp.data.end}
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
          )}
        </div>
      </div>
    </section>
  );
};

export default Experience;