// A genuinely reusable component: it renders nothing on its own, only what
// it's told to via props. AboutMe, Education, Skills, and Contact each use
// this same component with different `index`/`title` values instead of
// repeating the same markup four times.
function SectionHeading({ index, title }) {
  return (
    <div className="section-heading">
      <span className="index">{index}</span>
      <h2>{title}</h2>
    </div>
  )
}

export default SectionHeading
