const EDUCATION = [
  {
    years: '2023 — 2027',
    degree: 'BCA (Bachelor of Computer Applications)',
    school: 'Techno India University, Kolkata',
    score: null, // add e.g. 'CGPA: 8.2 / 10' here if you want to show it
  },
  {
    years: '2021 — 2023',
    degree: 'Higher Secondary Education',
    school: 'Tarakeswar Mahavidyalaya',
    score: null, // add your percentage/CGPA here if you'd like
  },
  {
    years: 'Completed 2021',
    degree: 'Secondary Education',
    school: 'Muktarpur High School',
    score: null, // add your percentage/CGPA here if you'd like
  },
]

function Education() {
  return (
    <section id="education">
      <div className="wrap">
        <div className="section-heading">
          <span className="index">02</span>
          <h2>Education</h2>
        </div>

        <div className="timeline">
          {EDUCATION.map((item) => (
            <div className="timeline-item" key={item.degree}>
              <div className="years">{item.years}</div>
              <h3>{item.degree}</h3>
              <div className="meta">{item.school}</div>
              {item.score && <span className="score">{item.score}</span>}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Education
