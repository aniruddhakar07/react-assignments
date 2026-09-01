import { useState } from 'react'

const INITIAL_FORM = { name: '', email: '', message: '' }

function Contact() {
  const [form, setForm] = useState(INITIAL_FORM)
  const [status, setStatus] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.message) {
      setStatus('// all fields are required')
      return
    }
    setStatus(`// thanks, ${form.name.split(' ')[0]} — message logged locally.`)
    setForm(INITIAL_FORM)
  }

  return (
    <section id="contact">
      <div className="wrap">
        <div className="section-heading">
          <span className="index">04</span>
          <h2>Contact</h2>
        </div>

        <div className="contact-panel">
          <div className="contact-info">
            <h3>Let's work together</h3>
            <p>
              Open to internships, freelance frontend work, and interesting collaborations.
              Reach out through any of the channels below.
            </p>
            <ul className="contact-list">
              <li>
                <span className="k">Phone</span>
                <a href="tel:+919641130829">+91 96411 30829</a>
              </li>
              <li>
                <span className="k">Email</span>
                <a href="mailto:aniruddhakar07@gmail.com">aniruddhakar07@gmail.com</a>
              </li>
              <li>
                <span className="k">GitHub</span>
                <a href="https://github.com/aniruddhakar07" target="_blank" rel="noreferrer">
                  github.com/aniruddhakar07
                </a>
              </li>
              <li>
                <span className="k">LinkedIn</span>
                <a href="https://www.linkedin.com/in/aniruddhakar-dev/" target="_blank" rel="noreferrer">
                  linkedin.com/in/aniruddhakar-dev
                </a>
              </li>
            </ul>
          </div>

          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="field">
              <label htmlFor="name">Name</label>
              <input
                id="name"
                name="name"
                type="text"
                value={form.name}
                onChange={handleChange}
                placeholder="Your name"
              />
            </div>
            <div className="field">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
              />
            </div>
            <div className="field">
              <label htmlFor="message">Message</label>
              <textarea
                id="message"
                name="message"
                value={form.message}
                onChange={handleChange}
                placeholder="What are you reaching out about?"
              />
            </div>
            <div className="form-status">{status}</div>
            <button type="submit" className="btn solid">Send message</button>
          </form>
        </div>
      </div>
    </section>
  )
}

export default Contact
