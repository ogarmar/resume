import React from 'react';
import { experiences } from '../constants/index';

const Experience: React.FC = () => {
  return (
    <section>
      <h2>Work Experience</h2>
      <ul>
        {experiences.map((exp, idx) => (
          <li key={idx} style={{ marginBottom: '2rem' }}>
            <h3>{exp.title} - {exp.company_name}</h3>
            <p>{exp.date}</p>
            <ul>
              {exp.points.map((point, i) => (
                <li key={i}>{point}</li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default Experience;