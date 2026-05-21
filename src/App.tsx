import React, { useEffect, useState } from 'react';
import './App.css';
import About from './components/About';
import Contact from './components/Contact';
import Experience from './components/Experience';
import Feedbacks from './components/Feedbacks';
import Hero from './components/Hero';
import Navbar from './components/Navbar';
import Tech from './components/Tech';
import Works from './components/Works';
import StarsCanvas from './components/canvas/Stars';

interface ExperienceItem {
  company: string;
  role: string;
  sector: string;
  summary: string;
  start: string;
  end: string;
  highlights: string[];
}

const App: React.FC = () => {
  const [resumeData, setResumeData] = useState<any>(null);

  useEffect(() => {
    const fetchResumeData = async () => {
      try {
        const response = await fetch('/api/resume');
        if (response.ok) {
          const data = await response.json();
          setResumeData(data);
        }
      } catch (error) {
        console.error('Error fetching resume data:', error);
      }
    };

    fetchResumeData();
  }, []);

  return (
    <div className="App">
      <Navbar />
      <Hero />
      <About />
      <Experience experience={resumeData?.experience || []} />
      <Tech />
      <Works />
      <Feedbacks />
      <Contact />
      <StarsCanvas />
    </div>
  );
};

export default App;