export default function Projects() {
  const projects = [
    {
      title: 'HemoStat',
      award: 'Most Impactful Award @ DevOps for GenAI',
      date: 'Nov 2025',
      tech: ['Python', 'Docker', 'Redis', 'LangChain', 'GPT-4', 'Claude'],
      description: [
        'Engineered multi-agent system with 4 autonomous agents for Docker container health monitoring',
        'Integrated GPT-4 & Claude APIs via LangChain for AI-powered root cause analysis',
        'Built production monitoring stack with Prometheus, Grafana, & Streamlit dashboard'
      ]
    },
    {
      title: '404cast',
      award: '',
      date: 'Jan 2025',
      tech: ['React', 'Vite', 'Node.js', 'MongoDB', 'Express.js', 'Google Maps API'],
      description: [
        'Engineered full-stack weather platform with React/Vite frontend',
        'Integrated Google Maps API and deployed Progressive Web App functionality',
        'Designed MongoDB schemas with Express.js REST endpoints'
      ]
    },
    {
      title: 'ThyroTrack',
      award: '2nd Place @ AI in Healthcare',
      date: 'Feb 2025',
      tech: ['Python', 'XGBoost', 'Pandas', 'Scikit-Learn', 'Imblearn'],
      description: [
        'Built AI-powered health monitoring app for thyroid patients',
        'Trained XGBoost model achieving 91% accuracy identifying issues',
        'Developed interactive app for daily health journaling and trend tracking'
      ]
    }
  ];

  return (
    <div className="space-y-4">
      <div className="dialog-box">
        <h2 className="text-xl mb-4 text-gameboy-dark">Projects</h2>
        <p className="text-xs leading-relaxed text-gameboy-dark">
          Check out some of my recent work:
        </p>
      </div>

      {projects.map((project) => (
        <div key={project.title} className="dialog-box">
          <div className="mb-3">
            <h3 className="text-sm font-bold text-gameboy-dark">{project.title}</h3>
            {project.award && (
              <p className="text-xs text-gameboy-mid-dark mt-1">🏆 {project.award}</p>
            )}
            <p className="text-xs text-gameboy-mid-dark mt-1">📅 {project.date}</p>
          </div>

          <div className="flex flex-wrap gap-1 mb-3">
            {project.tech.map((tech) => (
              <span
                key={tech}
                className="bg-gameboy-mid-dark text-gameboy-light px-2 py-1 text-xs rounded border border-gameboy-dark"
                style={{ fontSize: '0.65rem' }}
              >
                {tech}
              </span>
            ))}
          </div>

          <ul className="text-xs leading-relaxed text-gameboy-dark space-y-2">
            {project.description.map((item, idx) => (
              <li key={idx} className="flex">
                <span className="mr-2">▸</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
