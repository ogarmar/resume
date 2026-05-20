import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface Skill {
  name: string;
  value: number;
  category: string;
}

interface SkillRadarProps {
  skills: Skill[];
  width?: number;
  height?: number;
}

const SkillRadar = ({ skills, width = 500, height = 500 }: SkillRadarProps) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || !skills.length) return;

    // Clear previous SVG content
    d3.select(svgRef.current).selectAll('*').remove();

    // Setup
    const margin = { top: 50, right: 50, bottom: 50, left: 50 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;
    const radius = Math.min(innerWidth, innerHeight) / 2;
    
    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${width / 2}, ${height / 2})`);
    
    // Scales
    const angleScale = d3.scalePoint()
      .domain(skills.map(d => d.name))
      .range([0, 2 * Math.PI]);
    
    const radiusScale = d3.scaleLinear()
      .domain([0, 10])
      .range([0, radius]);
    
    // Draw grid circles
    const gridCircleData = [2, 4, 6, 8, 10];
    svg.selectAll('.grid-circle')
      .data(gridCircleData)
      .enter()
      .append('circle')
      .attr('class', 'grid-circle')
      .attr('cx', 0)
      .attr('cy', 0)
      .attr('r', d => radiusScale(d))
      .attr('fill', 'none')
      .attr('stroke', '#333')
      .attr('stroke-dasharray', '4,4')
      .attr('stroke-width', 0.5);
    
    // Draw axis grid
    svg.selectAll('.axis-grid')
      .data(skills)
      .enter()
      .append('line')
      .attr('class', 'axis-grid')
      .attr('x1', 0)
      .attr('y1', 0)
      .attr('x2', (d) => radiusScale(10) * Math.cos(angleScale(d.name)! - Math.PI / 2))
      .attr('y2', (d) => radiusScale(10) * Math.sin(angleScale(d.name)! - Math.PI / 2))
      .attr('stroke', '#333')
      .attr('stroke-width', 0.5);
    
    // Draw axes
    svg.selectAll('.axis')
      .data(skills)
      .enter()
      .append('line')
      .attr('class', 'axis')
      .attr('x1', 0)
      .attr('y1', 0)
      .attr('x2', (d) => radiusScale(10) * Math.cos(angleScale(d.name)! - Math.PI / 2))
      .attr('y2', (d) => radiusScale(10) * Math.sin(angleScale(d.name)! - Math.PI / 2))
      .attr('stroke', '#555')
      .attr('stroke-width', 1);
    
    // Create radar path
    const lineGenerator = d3.lineRadial<Skill>()
      .angle(d => angleScale(d.name)! - Math.PI / 2)
      .radius(d => radiusScale(d.value))
      .curve(d3.curveLinearClosed);
    
    // Draw radar path
    svg.append('path')
      .datum(skills)
      .attr('class', 'radar-path')
      .attr('d', d => lineGenerator(d) || '')
      .attr('fill', 'rgba(65, 105, 225, 0.5)')
      .attr('stroke', '#4169e1')
      .attr('stroke-width', 2);
    
    // Draw dots for each skill point
    svg.selectAll('.skill-dot')
      .data(skills)
      .enter()
      .append('circle')
      .attr('class', 'skill-dot')
      .attr('cx', d => radiusScale(d.value) * Math.cos(angleScale(d.name)! - Math.PI / 2))
      .attr('cy', d => radiusScale(d.value) * Math.sin(angleScale(d.name)! - Math.PI / 2))
      .attr('r', 4)
      .attr('fill', '#4169e1');
    
    // Add labels
        // Add labels
        svg.selectAll('.skill-label')
        .data(skills)
        .enter()
        .append('text')
        .attr('class', 'skill-label')
        .attr('x', d => radiusScale(10.5) * Math.cos(angleScale(d.name)! - Math.PI / 2))
        .attr('y', d => radiusScale(10.5) * Math.sin(angleScale(d.name)! - Math.PI / 2))
        .attr('text-anchor', d => {
          const angle = angleScale(d.name)! - Math.PI / 2;
          if (Math.abs(Math.cos(angle)) < 0.1) return 'middle';
          return Math.cos(angle) > 0 ? 'start' : 'end';
        })
        .attr('dominant-baseline', d => {
          const angle = angleScale(d.name)! - Math.PI / 2;
          if (Math.abs(Math.sin(angle)) < 0.1) return 'middle';
          return Math.sin(angle) > 0 ? 'hanging' : 'auto';
        })
        .attr('fill', '#fff')
        .attr('font-size', '12px')
        .text(d => d.name);
    }, [skills, width, height]);
  
    return (
      <div className="skill-radar w-full flex justify-center">
        <svg ref={svgRef}></svg>
      </div>
    );
  };
  
  // Sample skills data
  const defaultSkills: Skill[] = [
    { name: 'LLMs', value: 10, category: 'AI Engineering' },
    { name: 'RAG', value: 9, category: 'AI Engineering' },
    { name: 'Prompt Eng.', value: 9, category: 'AI Engineering' },
    { name: 'LangChain', value: 8, category: 'AI Engineering' },
    { name: 'AutoML', value: 8, category: 'AI Engineering' },
    { name: 'FAISS', value: 8, category: 'AI Engineering' },
    { name: 'Pandas', value: 9, category: 'Data Science' },
    { name: 'Statistical Analysis', value: 9, category: 'Data Science' },
    { name: 'EDA', value: 8, category: 'Data Science' },
    { name: 'Scikit-learn', value: 8, category: 'Data Science' },
    { name: 'SHAP', value: 7, category: 'Data Science' },
    { name: 'Predictive Modeling', value: 8, category: 'Data Science' },
    { name: 'FastAPI', value: 9, category: 'Backend' },
    { name: 'Flask', value: 7, category: 'Backend' },
    { name: 'REST', value: 8, category: 'Backend' },
    { name: 'WebSockets', value: 8, category: 'Backend' },
    { name: 'React', value: 8, category: 'Full-Stack' },
    { name: 'TypeScript', value: 8, category: 'Full-Stack' },
    { name: 'PostgreSQL', value: 8, category: 'Backend' },
    { name: 'SQLite', value: 7, category: 'Data Infra' },
    { name: 'ETL', value: 7, category: 'Data Infra' },
    { name: 'Vector DBs', value: 7, category: 'Data Infra' },
    { name: 'AsyncIO', value: 7, category: 'Data Infra' },
    { name: 'Git', value: 8, category: 'DevOps' },
    { name: 'Docker', value: 7, category: 'DevOps' },
    { name: 'Cloud Deployment', value: 7, category: 'DevOps' },
    { name: 'Python', value: 10, category: 'Languages' },
    { name: 'SQL', value: 8, category: 'Languages' },
    { name: 'R', value: 7, category: 'Languages' },
    { name: 'JavaScript/TS', value: 8, category: 'Languages' }
  ];
  
  const SkillRadarWrapper = () => {
    return <SkillRadar skills={defaultSkills} />;
  };
  
  export default SkillRadarWrapper;