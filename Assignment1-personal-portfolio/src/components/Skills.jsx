// Add or remove skills freely — just plain names, no rating needed.
const SKILL_GROUPS = [
  {
    title: 'Languages',
    items: ['Python', 'C#'],
  },
  {
    title: 'Currently Into',
    items: ['Game Dev', 'Augmented Coding', 'Problem Solving'],
  },
]

function Skills() {
  return (
    <section id="skills">
      <div className="wrap">
        <div className="section-heading">
          <span className="index">03</span>
          <h2>Skills</h2>
        </div>

        <div className="skills-grid">
          {SKILL_GROUPS.map((group) => (
            <div className="skill-group" key={group.title}>
              <h4>{group.title}</h4>
              <div className="skill-tags">
                {group.items.map((skill) => (
                  <span className="skill-tag" key={skill}>{skill}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Skills
