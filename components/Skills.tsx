export default function Skills() {
  const skillCategories = [
    {
      title: 'AI/ML',
      skills: ['Python', 'PyTorch', 'TensorFlow', 'scikit-learn', 'XGBoost', 'Pandas', 'NumPy', 'OpenCV']
    },
    {
      title: 'Full-Stack',
      skills: ['React', 'Next.js', 'Node.js', 'FastAPI', 'Express.js', 'Tailwind CSS', 'MongoDB']
    },
    {
      title: 'Data & Databases',
      skills: ['PostgreSQL', 'MySQL', 'SQL', 'MongoDB', 'Matplotlib', 'Seaborn']
    },
    {
      title: 'DevOps & Cloud',
      skills: ['Docker', 'Git', 'AWS', 'Google Cloud', 'Vercel', 'Railway', 'CI/CD']
    },
    {
      title: 'Tools',
      skills: ['Jest', 'JUnit', 'Postman', 'Visual Paradigm', 'UML']
    }
  ];

  return (
    <div className="space-y-4">
      <div className="dialog-box">
        <h2 className="text-xl mb-4 text-gameboy-dark">Skills</h2>
        <p className="text-xs leading-relaxed text-gameboy-dark">
          Here are the technologies I work with:
        </p>
      </div>

      {skillCategories.map((category) => (
        <div key={category.title} className="dialog-box">
          <h3 className="text-sm mb-3 text-gameboy-dark font-bold">{category.title}</h3>
          <div className="flex flex-wrap gap-2">
            {category.skills.map((skill) => (
              <span
                key={skill}
                className="bg-gameboy-mid-dark text-gameboy-light px-3 py-1 text-xs rounded border-2 border-gameboy-dark"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
