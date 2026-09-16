function Header() {
  return (
    <header className="hero" id="top">
      <div className="wrap">
        <span className="tag">// personal portfolio · rev. 2026</span>
        <h1>
          Learning to build things, one <span className="accent">weird side project</span> at a time.
        </h1>
        <p className="role">Aniruddha Kar — BCA Student · Newbie Game Dev · Augmented Coder</p>
        <p className="lede">
          I'm a 4th year BCA student who spends most of their free time messing around with code,
          games, and football. Still figuring a lot of this out — that's kind of the point.
        </p>

        <div className="cta-row">
          <a href="#contact" className="btn solid">Get in touch</a>
          <a href="#education" className="btn">View background</a>
        </div>

        <div className="hero-specs">
          <div className="spec">
            <div className="label">Based in</div>
            <div className="value">Muktarpur, Hooghly</div>
          </div>
          <div className="spec">
            <div className="label">Focus</div>
            <div className="value">Game Dev / Python / C#</div>
          </div>
          <div className="spec">
            <div className="label">Year</div>
            <div className="value">BCA — 4th Year</div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
