import './App.css'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Services from './components/Services'
import Courses from './components/Courses'
import ContactForm from './components/ContactForm'
import Chatbot from './components/Chatbot'

function App() {
  return (
    <div className="app">
      <Navbar />
      <main>
        <Hero />
        <Services />
        <Courses />
        <ContactForm />
      </main>
      <Chatbot />
    </div>
  )
}

export default App
