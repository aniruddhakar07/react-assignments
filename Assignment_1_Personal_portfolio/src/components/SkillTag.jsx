// Another small reusable component: it has no idea what skills exist, it
// just renders whatever `label` it's given. Skills.jsx calls this once per
// skill, passing a different label each time via props.
function SkillTag({ label }) {
  return <span className="skill-tag">{label}</span>
}

export default SkillTag
