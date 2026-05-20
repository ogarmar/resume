import { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text } from '@react-three/drei';
import * as THREE from 'three';

// Define project type
interface Project {
  id: number;
  name: string;
  description: string;
  technologies: string[];
  link: string;
  position: [number, number, number];
  color: string;
}

// Sample projects data
const projects: Project[] = [
  {
    id: 1,
    name: "Portfolio Website",
    description: "Interactive 3D portfolio built with React and Three.js",
    technologies: ["React", "Three.js", "TypeScript"],
    link: "https://example.com/portfolio",
    position: [3, 0, 0],
    color: "#ff5733"
  },
  {
    id: 2,
    name: "E-commerce Platform",
    description: "Full-stack e-commerce solution with payment integration",
    technologies: ["Next.js", "MongoDB", "Stripe"],
    link: "https://example.com/ecommerce",
    position: [-3, 1, 2],
    color: "#33ff57"
  },
  {
    id: 3,
    name: "AI Chat Application",
    description: "Real-time chat app with AI-powered responses",
    technologies: ["React", "Node.js", "Socket.io", "OpenAI"],
    link: "https://example.com/chat",
    position: [0, -2, -3],
    color: "#3357ff"
  },
  {
    id: 4,
    name: "Mobile Fitness App",
    description: "Cross-platform fitness tracking application",
    technologies: ["React Native", "Firebase", "Redux"],
    link: "https://example.com/fitness",
    position: [2, 2, -2],
    color: "#f3ff33"
  },
  {
    id: 5,
    name: "Blockchain Explorer",
    description: "Tool for visualizing blockchain transactions",
    technologies: ["Vue.js", "Web3.js", "D3.js"],
    link: "https://example.com/blockchain",
    position: [-2, -1, -2],
    color: "#ff33f5"
  }
];

// Project sphere component
const ProjectSphere = ({ 
  position, 
  color, 
  name, 
  onHover, 
  onLeave, 
  onClick 
}: { 
  position: [number, number, number]; 
  color: string; 
  name: string; 
  onHover: () => void; 
  onLeave: () => void; 
  onClick: () => void; 
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.005;
      meshRef.current.rotation.y += 0.005;
    }
  });

  return (
    <group position={position}>
      <mesh 
        ref={meshRef} 
        onPointerOver={onHover}
        onPointerOut={onLeave}
        onClick={onClick}
      >
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <Text
        position={[0, -0.8, 0]}
        fontSize={0.2}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        {name}
      </Text>
    </group>
  );
};

// Main component
const ProjectGalaxy = () => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [hoveredProject, setHoveredProject] = useState<Project | null>(null);

  // Handle project click
  const handleProjectClick = (project: Project) => {
    setSelectedProject(project);
  };

  // Handle project hover
  const handleProjectHover = (project: Project) => {
    // Functionality can be added later if needed
  };

  // Handle project leave
  const handleProjectLeave = () => {
    // Functionality can be added later if needed
  };

  // Close project details
  const closeProjectDetails = () => {
    setSelectedProject(null);
  };

  // Effect to handle escape key press
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeProjectDetails();
      }
    };

    window.addEventListener('keydown', handleEscKey);
    return () => {
      window.removeEventListener('keydown', handleEscKey);
    };
  }, []);

  return (
    <div className="w-full h-screen relative">
      <Canvas camera={{ position: [0, 0, 10], fov: 60 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <OrbitControls enableZoom={true} enablePan={true} enableRotate={true} />
        
        {/* Background stars */}
        {Array.from({ length: 200 }).map((_, i) => {
          const position: [number, number, number] = [
            (Math.random() - 0.5) * 30,
            (Math.random() - 0.5) * 30,
            (Math.random() - 0.5) * 30
          ];
          return (
            <mesh key={i} position={position}>
              <sphereGeometry args={[0.05, 8, 8]} />
              <meshBasicMaterial color="white" />
            </mesh>
          );
        })}
        
        {/* Project spheres */}
        {projects.map((project) => (
          <ProjectSphere
            key={project.id}
            position={project.position}
            color={project.color}
            name={project.name}
            onHover={() => handleProjectHover(project)}
            onLeave={handleProjectLeave}
            onClick={() => handleProjectClick(project)}
          />
        ))}
      </Canvas>
      
      {/* Project details modal */}
      {selectedProject && (
        <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-70 z-10">
          <div className="bg-gray-900 p-6 rounded-lg max-w-md">
            <h2 className="text-2xl font-bold text-white mb-2">{selectedProject.name}</h2>
            <p className="text-gray-300 mb-4">{selectedProject.description}</p>
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-white mb-1">Technologies:</h3>
              <div className="flex flex-wrap gap-2">
                {selectedProject.technologies.map((tech, index) => (
                  <span key={index} className="bg-blue-600 px-2 py-1 rounded text-sm text-white">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex justify-between">
              <a 
                href={selectedProject.link} 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
              >
                View Project
              </a>
              <button 
                onClick={closeProjectDetails}
                className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectGalaxy;