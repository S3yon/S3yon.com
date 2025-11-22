export default function Bio() {
  return (
    <div className="space-y-4">
      <div className="dialog-box">
        <h2 className="text-xl mb-4 text-gameboy-dark">Hello!</h2>
        <p className="text-xs leading-relaxed text-gameboy-dark mb-4">
          Welcome to my portfolio. I'm a Machine Learning Developer and Full-Stack Engineer.
        </p>
      </div>

      <div className="dialog-box">
        <h3 className="text-sm mb-3 text-gameboy-dark">About Me</h3>
        <div className="text-xs leading-loose text-gameboy-dark space-y-2">
          <p>
            📚 Student at Sheridan College studying Software Development & Network Engineering (3.9 GPA)
          </p>
          <p>
            🔬 Currently working as ML Developer at Sheridan Centre for Applied AI
          </p>
          <p>
            🏆 Built diagnostic AI achieving 97.2% accuracy on pediatric X-rays using PyTorch
          </p>
          <p>
            🎯 Won Most Impactful Award at DevOps for GenAI hackathon
          </p>
          <p>
            💡 Passionate about AI/ML, full-stack development, and building innovative solutions
          </p>
        </div>
      </div>

      <div className="dialog-box">
        <h3 className="text-sm mb-3 text-gameboy-dark">Education</h3>
        <div className="text-xs leading-loose text-gameboy-dark">
          <p className="font-bold">Sheridan College</p>
          <p>Software Development & Network Engineering</p>
          <p>GPA: 3.9 | May 2024 - Aug 2027</p>
        </div>
      </div>
    </div>
  );
}
