(() => {
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  // Sections (sidebar-driven)
  const sections = $$('.resume-content .section');
  const navLinks = $$('.sidebar .nav-link');
  const showSection = id => {
    sections.forEach(section => { section.classList.remove('active'); section.style.display = 'none'; });
    const activeSection = document.getElementById(id);
    if (activeSection) { activeSection.classList.add('active'); activeSection.style.display = 'block'; }
    navLinks.forEach(link => { link.classList.toggle('active', link.dataset.section === id); });
  };
  navLinks.forEach(a => {
    a.addEventListener('click', e => { e.preventDefault(); const id = a.dataset.section; if (id) showSection(id); });
  });
  showSection('overview');

  // Filter projects
  const filter = $('#project-filter');
  if (filter) {
    filter.addEventListener('input', () => {
      const q = filter.value.trim().toLowerCase();
      $$('.project').forEach(card => {
        const tags = (card.dataset.tags || '').toLowerCase();
        const title = (card.dataset.title || '').toLowerCase();
        const visible = !q || tags.includes(q) || title.includes(q);
        card.style.display = visible ? '' : 'none';
      });
    });
  }

  // Copy to clipboard
  $$('.chip.copy').forEach(btn => {
    btn.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(btn.dataset.copy || '');
        btn.classList.add('copied');
        btn.textContent = '✔ Copied';
        setTimeout(() => {
          btn.classList.remove('copied');
          btn.textContent = btn.dataset.copyLabel || btn.textContent;
          btn.textContent = (btn.dataset.copy || '').includes('@') ? `✉️ ${btn.dataset.copy}` : `📞 ${btn.dataset.copy}`;
        }, 1200);
      } catch {}
    });
  });

  // Theme toggle
  const themeBtn = $('.theme-toggle');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
  const applyTheme = t => document.documentElement.dataset.theme = t;
  const saved = localStorage.getItem('theme');
  if (saved) applyTheme(saved); else applyTheme(prefersDark.matches ? 'dark' : 'light');
  document.documentElement.setAttribute('data-theme', localStorage.getItem('theme') || (prefersDark.matches ? 'dark' : 'light'));
  themeBtn && themeBtn.addEventListener('click', () => { const next = (document.documentElement.dataset.theme === 'dark') ? 'light' : 'dark'; applyTheme(next); localStorage.setItem('theme', next); document.documentElement.setAttribute('data-theme', next); updateRadarLabelColors(); });

  // ----- Skill radar (HiDPI + wrapped labels) -----
  let radarChart = null;
  function wrapLabel(text, maxLen = 16) {
    const words = String(text).split(' ');
    const lines = [];
    let line = '';
    for (const w of words) {
      if ((line + ' ' + w).trim().length <= maxLen) {
        line = (line ? line + ' ' : '') + w;
      } else {
        if (line) lines.push(line);
        if (w.length > maxLen) {
          for (let i = 0; i < w.length; i += maxLen) lines.push(w.slice(i, i + maxLen));
          line = '';
        } else {
          line = w;
        }
      }
    }
    if (line) lines.push(line);
    return lines;
  }
  function updateRadarLabelColors() {
    if (!radarChart) return;
    const isLight = (document.documentElement.getAttribute('data-theme') === 'light');
    const color = isLight ? '#000' : '#fff';
    radarChart.options.scales.r.pointLabels.color = color;
    radarChart.options.scales.r.grid.color = isLight ? 'rgba(0,0,0,0.1)' : 'rgba(255, 255, 255, 0.1)';
    radarChart.options.scales.r.angleLines.color = isLight ? 'rgba(0,0,0,0.1)' : 'rgba(255, 255, 255, 0.1)';
    radarChart.update();
  }
  const radarEl = document.getElementById('skill-radar');
  if (radarEl) {
      const cssWidth = parseInt(window.getComputedStyle(radarEl).width, 10) || 480;
      const cssHeight = parseInt(window.getComputedStyle(radarEl).height, 10) || 360;
      const dpr = Math.max(1, Math.floor(window.devicePixelRatio || 1));
      radarEl.width = cssWidth * dpr;
      radarEl.height = cssHeight * dpr;
      const ctx = radarEl.getContext('2d');
      ctx.scale(dpr, dpr);
      const labels = ['Analysis and problem-solving', 'Lifelong learning', 'Specific instrumentation', 'Effective communication', 'Application and practical thinking', 'Planning and time management', 'Innovation and creativity', 'Comprehension and Integration', 'Teamwork and leadership'];
      radarChart = new Chart(ctx, {
          type: 'radar',
          data: { labels, datasets: [{ data: [99, 93, 93, 97, 97, 93, 97, 99, 93], backgroundColor: 'rgba(167, 139, 250, 0.16)', borderColor: 'rgb(167, 139, 250)', pointBackgroundColor: 'rgb(167, 139, 250)', borderWidth: 2, pointRadius: 3 }] },
          options: {
              layout: { padding: { top: 18, right: 18, bottom: 18, left: 18 } },
              scales: { r: { min: 0, max: 120, ticks: { stepSize: 20, display: false }, grid: { color: 'rgba(255, 255, 255, 0.1)', circular: true }, angleLines: { color: 'rgba(255, 255, 255, 0.1)' }, pointLabels: { color: '#fff', font: { size: 12 }, padding: 18, centerPointLabels: true, callback: (val) => wrapLabel(labels[val] ?? val, 16) } } },
              plugins: { legend: { display: false } },
              responsive: false,
              maintainAspectRatio: false
          }
      });
      updateRadarLabelColors();
  }

  // ----- Knowledge Graph with D3 (balanced connections) -----
  function initGraph() {
    const dataScript = document.getElementById('resume-data');
    const graphContainer = document.getElementById('graph-container');
    if (!dataScript || !graphContainer || !window.d3) { return; }

    const init = () => {
      graphContainer.innerHTML = '';
      const rect = graphContainer.getBoundingClientRect();
      const width = Math.max(200, rect.width);
      const height = Math.max(200, rect.height);

      let raw; try { raw = JSON.parse(dataScript.textContent); } catch { return; }
      const nodes = []; const links = [];

      // Create nodes
      const projectNames = (raw.projects || []).map(p => p.name);
      const techByProject = new Map();
      (raw.projects || []).forEach(project => {
        nodes.push({ id: project.name, name: project.name, category: 'Project' });
        techByProject.set(project.name, project.technologies || []);
        (project.technologies || []).forEach(tech => {
          if (!nodes.find(n => n.id === tech)) nodes.push({ id: tech, name: tech, category: 'Technology' });
          links.push({ source: project.name, target: tech });
        });
      });
      (raw.skills || []).forEach(skill => { if (!nodes.find(n => n.id === skill)) nodes.push({ id: skill, name: skill, category: 'Skill' }); });
      (raw.techs || []).forEach(tech => { if (!nodes.find(n => n.id === tech)) nodes.push({ id: tech, name: tech, category: 'Technology' }); });

      const low = s => String(s).toLowerCase();
      const degrees = new Map();
      const addLink = (a, b) => { links.push({ source: a, target: b }); degrees.set(a, (degrees.get(a)||0)+1); degrees.set(b, (degrees.get(b)||0)+1); };

      // Score helpers
      function scoreSkillToProject(skill, p) {
        let score = 0; const ls = low(skill);
        if (low(p.name).includes(ls)) score += 2;
        (p.technologies||[]).forEach(t => { if (low(t).includes(ls)) score += 1; });
        if (ls.includes('analysis') && low(p.name).includes('energy')) score += 2;
        return score;
      }
      function scoreTechToProject(tech, p) {
        const lt = low(tech);
        let score = 0;
        if (low(p.name).includes(lt)) score += 1;
        (p.technologies||[]).forEach(t => { if (low(t) === lt) score += 3; });
        return score;
      }

      // Balanced assignment: round-robin over sorted preferences
      let rrIdx = 0;
      (raw.skills || []).forEach(skill => {
        const prefs = (raw.projects || [])
          .map(p => ({ name: p.name, s: scoreSkillToProject(skill, p) }))
          .sort((a,b) => b.s - a.s);
        // Pick the first with positive score, rotated; else rotate projects list
        let chosen = null;
        for (let i = 0; i < prefs.length; i++) {
          const pick = prefs[(rrIdx + i) % prefs.length];
          if (pick.s > 0) { chosen = pick.name; break; }
        }
        if (!chosen && prefs.length) chosen = prefs[rrIdx % prefs.length].name;
        if (chosen) addLink(skill, chosen);
        rrIdx++;
      });

      rrIdx = 0;
      (raw.techs || []).forEach(tech => {
        const prefs = (raw.projects || [])
          .map(p => ({ name: p.name, s: scoreTechToProject(tech, p) }))
          .sort((a,b) => b.s - a.s);
        let chosen = null;
        for (let i = 0; i < prefs.length; i++) {
          const pick = prefs[(rrIdx + i) % prefs.length];
          if (pick.s > 0) { chosen = pick.name; break; }
        }
        if (!chosen && prefs.length) chosen = prefs[rrIdx % prefs.length].name;
        if (chosen) addLink(tech, chosen);
        rrIdx++;
      });

      // Ensure minimum degree 1
      const firstProject = projectNames[0] || null;
      if (firstProject) {
        nodes.forEach(n => { if ((degrees.get(n.id)||0) === 0 && n.id !== firstProject) addLink(n.id, firstProject); });
      }

      // Draw
      const svg = d3.select(graphContainer).append('svg')
        .attr('width', width).attr('height', height)
        .attr('viewBox', `0 0 ${width} ${height}`)
        .attr('preserveAspectRatio', 'xMidYMid meet');
      const g = svg.append('g');
      const colorByCat = { Project: '#60a5fa', Technology: '#a78bfa', Skill: '#34d399' };

      const simulation = d3.forceSimulation(nodes)
        .force('link', d3.forceLink(links).id(d => d.id).distance(d => d.source.category === 'Project' && d.target.category === 'Technology' ? 80 : 100).strength(0.7))
        .force('charge', d3.forceManyBody().strength(-520))
        .force('center', d3.forceCenter(width/2, height/2))
        .force('collide', d3.forceCollide().radius(d => d.category === 'Project' ? 34 : 26).strength(0.9));

      const link = g.append('g').selectAll('line').data(links).join('line').attr('class', 'link');
      const node = g.append('g').selectAll('g').data(nodes).join('g').attr('class', d => `node category-${d.category}`)
        .call(d3.drag().on('start', dragstarted).on('drag', dragged).on('end', dragended));
      node.append('circle').attr('r', d => d.category === 'Project' ? 16 : 12).attr('fill', d => colorByCat[d.category] || '#999');
      node.append('text').text(d => d.name).attr('x', 12).attr('y', 4);

      function dragstarted(event, d) { if (!event.active) simulation.alphaTarget(0.3).restart(); d.fx = d.x; d.fy = d.y; }
      function dragged(event, d) { d.fx = Math.max(0, Math.min(width, event.x)); d.fy = Math.max(0, Math.min(height, event.y)); }
      function dragended(event, d) { if (!event.active) simulation.alphaTarget(0); d.fx = null; d.fy = null; }

      simulation.on('tick', () => { link.attr('x1', d => d.source.x).attr('y1', d => d.source.y).attr('x2', d => d.target.x).attr('y2', d => d.target.y); node.attr('transform', d => `translate(${d.x},${d.y})`); });
    };

    const ro = new ResizeObserver(() => init()); ro.observe(graphContainer); init();
  }
  document.addEventListener('DOMContentLoaded', initGraph);

  // Print to PDF button
  const printBtn = document.getElementById('print-pdf');
  if (printBtn) {
      printBtn.addEventListener('click', () => {
          const keep = ['overview', 'experience', 'skills'];
          const hideElements = Array.from(document.getElementsByClassName('section'));
          const previous = hideElements.map(el => el.style.display);
          keep.forEach(id => { const el = document.getElementById(id); if (el) el.style.display = 'block'; });
          hideElements.forEach(el => { if (!keep.includes(el.id)) el.style.display = 'none'; });
          window.print();
          hideElements.forEach((el, i) => { el.style.display = previous[i]; });
      });
  }
})();


