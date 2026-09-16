# Assignment 1 — Personal Portfolio

An interactive personal developer portfolio built with **React 19** and **Vite**, featuring an engineering-notebook "Field Notes" dark aesthetic, smooth navigation, interactive skill showcases, and a controlled contact form.

---

## 🚀 Installation & Setup

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- npm (comes bundled with Node.js)

### Quick Start
```bash
# 1. Navigate to the project directory
cd Assignment_1_Personal_portfolio

# 2. Install dependencies
npm install

# 3. Start the Vite development server
npm run dev
```

Once started, open your browser at the local server URL (typically **http://localhost:5173**).

### Build for Production
```bash
npm run build
npm run preview
```

---

## ✨ Features

- **Hero Masthead & Spec Sheet**: Introduces personal identity, current role, location, academic background, and primary development focus.
- **Categorized Technical Skills**: Interactive skill tags categorized across 5 domains (Programming Languages, Web Development, Tools & Environments, CS Fundamentals, and Emerging Interests).
- **Academic Timeline**: Structured chronological education cards detailing secondary, higher secondary, and college milestones.
- **Controlled Contact Form**: Real-time validated input fields (Name, Email, Message) with instant visual feedback and error prevention.
- **Direct Contact & Social Links**: Quick access to Email, Phone, GitHub, and LinkedIn.
- **Responsive Navigation**: Sticky header navbar with mobile drawer navigation.
- **"Field Notes" Engineering Theme**: Dark blueprint-inspired color scheme with monospace metadata tags and hover micro-animations.

---

## 📖 How to Use

1. **Browse Sections**: Use the top navigation bar or scroll to navigate between **About**, **Education**, **Skills**, and **Contact**.
2. **Explore Skills**: Hover over skill pills in the Skills section to view domain-specific technical competencies.
3. **Send a Message (Contact Form)**:
   - Fill in **Your Name**, a valid **Email Address**, and a **Message**.
   - Try clicking **Send Message** with empty or invalid fields to test real-time client-side validation.
   - Upon valid submission, an on-screen confirmation notice appears.
4. **Mobile Navigation**: Resize your browser or view on mobile devices to test the hamburger menu toggle.

---

## 🛠️ Tech Stack

- **React 19**: Component architecture, modular UI, `useState` for mobile nav and form handling
- **Vite 6**: Rapid Hot Module Replacement (HMR) and optimized build bundling
- **Vanilla CSS**: Bespoke responsive styles, flexbox/grid layouts, custom variables

---

## 📁 Project Structure

```
Assignment_1_Personal_portfolio/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── AboutMe.jsx          # Bio & background details
│   │   ├── Contact.jsx          # Controlled contact form & social links
│   │   ├── Education.jsx        # Academic timeline cards
│   │   ├── Footer.jsx           # Copyright & quick links
│   │   ├── Header.jsx           # Hero masthead & spec sheet
│   │   ├── Navbar.jsx           # Sticky responsive navigation
│   │   ├── SectionHeading.jsx   # Monospace section headers
│   │   ├── Skills.jsx           # Categorized skill tags
│   │   └── SkillTag.jsx         # Individual skill pill badge
│   ├── App.jsx                  # Main page layout & component tree
│   ├── index.css                # Global design system & theme tokens
│   └── main.jsx                 # Vite application entry point
├── index.html
├── package.json
└── vite.config.js
```
