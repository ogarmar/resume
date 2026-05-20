document.addEventListener('DOMContentLoaded', () => {
    const dataScript = document.getElementById('resume-data');
    const graphEl = document.getElementById('graph-container');

    if (!dataScript || !graphEl || !window.d3) {
        console.error('Missing required elements or D3');
        return;
    }

    try {
        // Parse the JSON data and extract projects
        const data = JSON.parse(dataScript.textContent);
        if (!data || !data.projects) {
            throw new Error('Invalid data structure');
        }

        const nodes = [];
        const links = [];

        // Create nodes and links from projects
        data.projects.forEach(project => {
            nodes.push({
                id: project.name,
                name: project.name,
                category: 'Project'
            });

            project.technologies.forEach(tech => {
                if (!nodes.find(n => n.id === tech)) {
                    nodes.push({
                        id: tech,
                        name: tech,
                        category: 'Technology'
                    });
                }

                links.push({
                    source: project.name,
                    target: tech
                });
            });
        });

        // Setup SVG
        const width = graphEl.clientWidth || 800;
        const height = graphEl.clientHeight || 600;

        graphEl.innerHTML = '';

        const svg = d3.select(graphEl)
            .append('svg')
            .attr('width', '100%')
            .attr('height', '100%')
            .attr('viewBox', `0 0 ${width} ${height}`);

        // Add container for zoom
        const g = svg.append('g');

        // Add zoom behavior
        const zoom = d3.zoom()
            .scaleExtent([0.2, 2])
            .on('zoom', (event) => {
                g.attr('transform', event.transform);
            });
        svg.call(zoom);

        // Create simulation
        const simulation = d3.forceSimulation(nodes)
            .force('link', d3.forceLink(links).id(d => d.id).distance(100))
            .force('charge', d3.forceManyBody().strength(-500))
            .force('center', d3.forceCenter(width / 2, height / 2))
            .force('collide', d3.forceCollide().radius(50));

        // Add links
        const link = g.append('g')
            .selectAll('line')
            .data(links)
            .join('line')
            .attr('class', 'link');

        // Add nodes
        const node = g.append('g')
            .selectAll('g')
            .data(nodes)
            .join('g')
            .attr('class', d => `node category-${d.category}`)
            .call(d3.drag()
                .on('start', dragstarted)
                .on('drag', dragged)
                .on('end', dragended));

        // Add circles
        node.append('circle')
            .attr('r', d => d.category === 'Project' ? 20 : 15)
            .attr('fill', d => d.category === 'Project' ? '#a78bfa' : '#22d3ee');

        // Add labels
        node.append('text')
            .text(d => d.name)
            .attr('x', 15)
            .attr('y', 5);

        // Drag functions
        function dragstarted(event, d) {
            if (!event.active) simulation.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
        }

        function dragged(event, d) {
            d.fx = event.x;
            d.fy = event.y;
        }

        function dragended(event, d) {
            if (!event.active) simulation.alphaTarget(0);
            d.fx = null;
            d.fy = null;
        }

        // Update on tick
        simulation.on('tick', () => {
            link
                .attr('x1', d => d.source.x)
                .attr('y1', d => d.source.y)
                .attr('x2', d => d.target.x)
                .attr('y2', d => d.target.y);

            node.attr('transform', d => `translate(${d.x},${d.y})`);
        });

    } catch (error) {
        console.error('Error initializing graph:', error);
    }
});