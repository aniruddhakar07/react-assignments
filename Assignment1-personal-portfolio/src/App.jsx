import Navbar from './components/Navbar.jsx'
import Header from './components/Header.jsx'
import AboutMe from './components/AboutMe.jsx'
import Education from './components/Education.jsx'
import Skills from './components/Skills.jsx'
import Contact from './components/Contact.jsx'
import Footer from './components/Footer.jsx'

function App() {
  return (
    <>
      <Navbar />
      <Header />
      <main>
        <AboutMe />
        <Education />
        <Skills />
        <Contact />
      </main>
      <Footer />
    </>
  )
}

export default App
