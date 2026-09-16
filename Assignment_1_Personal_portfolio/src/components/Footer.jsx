function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="footer">
      <div className="wrap">
        <span className="copy">© {year} Aniruddha Kar. Built with React.</span>
        <div className="socials">
          <a href="https://github.com/aniruddhakar07" target="_blank" rel="noreferrer">GitHub</a>
          <a href="https://www.linkedin.com/in/aniruddhakar-dev/" target="_blank" rel="noreferrer">LinkedIn</a>
          <a href="tel:+919641130829">Phone</a>
        </div>
      </div>
    </footer>
  )
}

export default Footer
