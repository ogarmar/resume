import React from 'react';
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

const App: React.FC = () => {
  return (
    <div className="App">
      <Navbar />
      <Hero />
      <About />
      <Experience />
      <Tech />
      <Works />
      <Feedbacks />
      <Contact />
      <StarsCanvas />
    </div>
  );
};

export default App;