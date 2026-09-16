// Add or remove skills freely — just plain names, no rating needed.
import SectionHeading from './SectionHeading.jsx'
import SkillTag from './SkillTag.jsx'

const SKILL_GROUPS = [
  {
    title: 'Languages',
    items: ['Python', 'C#', 'Java', 'JavaScript', 'SQL / DBMS'],
  },
  {
    title: 'Web Dev',
    items: ['HTML/CSS', 'React'],
  },
  {
    title: 'Tools',
    items: ['VS Code', 'Unity', 'Git & GitHub'],
  },
  {
    title: 'CS Fundamentals',
    items: ['Data Structures', 'OOP Concepts'],
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
        <SectionHeading index="03" title="Skills" />

        <div className="skills-grid">
          {SKILL_GROUPS.map((group) => (
            <div className="skill-group" key={group.title}>
              <h4>{group.title}</h4>
              <div className="skill-tags">
                {group.items.map((skill) => (
                  <SkillTag key={skill} label={skill} />
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
