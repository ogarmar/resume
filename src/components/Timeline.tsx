import React from 'react';
import { Briefcase, GraduationCap } from 'lucide-react';

const timelineData = [
  {
    id: 1,
    type: 'work',
    title: 'Senior Developer',
    company: 'Tech Corp',
    date: '2020 - Present',
    description: 'Leading development of enterprise applications'
  },
  {
    id: 2,
    type: 'education',
    title: 'MSc Computer Science',
    company: 'Tech University',
    date: '2018 - 2020',
    description: 'Specialized in Machine Learning and Data Science'
  },
  {
    id: 3,
    type: 'work',
    title: 'Software Engineer',
    company: 'StartUp Inc',
    date: '2016 - 2020',
    description: 'Full stack development with modern technologies'
  }
];

const Timeline: React.FC = () => {
  return (
    <div className="relative">
      <div className="absolute left-1/2 transform -translate-x-1/2 w-0.5 h-full bg-[var(--color-text)] opacity-20"></div>
      
      {timelineData.map((item, index) => (
        <div
          key={item.id}
          className={`relative flex items-center mb-8 ${
            index % 2 === 0 ? 'justify-start' : 'justify-end'
          }`}
        >
          <div
            className={`w-5/12 ${
              index % 2 === 0 ? 'text-right pr-8' : 'text-left pl-8 order-last'
            }`}
          >
            <div className="p-6 bg-[var(--color-bg)] border border-[var(--color-text)] rounded-lg shadow-lg hover:scale-105 transition-transform">
              <div className="flex items-center mb-2">
                {item.type === 'work' ? (
                  <Briefcase className="w-5 h-5 mr-2" />
                ) : (
                  <GraduationCap className="w-5 h-5 mr-2" />
                )}
                <h3 className="text-xl font-bold">{item.title}</h3>
              </div>
              <p className="text-sm opacity-75 mb-2">{item.company}</p>
              <p className="text-sm font-semibold mb-2">{item.date}</p>
              <p className="text-sm">{item.description}</p>
            </div>
          </div>
          
          <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-[var(--color-accent)] rounded-full"></div>
        </div>
      ))}
    </div>
  );
};

export default Timeline;