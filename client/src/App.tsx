import { useState } from 'react'
import './App.css'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Services from './components/Services'
import Courses from './components/Courses'
import ContactForm from './components/ContactForm'
import Chatbot from './components/Chatbot'
import Admin from './components/Admin'

function App() {
  const [view, setView] = useState<'home' | 'admin'>('home')

  return (
    <div className="app">
      <Navbar onView={setView} />
      {view === 'home' ? (
        <>
          <main>
            <Hero />
            <Services />
            <Courses />
            <ContactForm />
          </main>
          <Chatbot />
        </>
      ) : (
        <main>
          <Admin onBack={() => setView('home')} />
        </main>
      )}
    </div>
  )
}

export default App
