import { useState, useEffect, useRef, FormEvent } from 'react'
import './Chatbot.css'
import { services } from './Services'
import { courses } from './Courses'

type Message = { role: 'user' | 'bot'; text: string }

type Enquiry = {
  name: string
  email: string
  phone: string
  userType: string
  interest: string
  message: string
}

const questions = [
  'What services does DroneTV provide?',
  'What courses / training are available?',
  'How can I contact DroneTV?',
  'How can I register?',
  'I am interested in a service.',
  'I am a student.',
  'I want to speak with someone.'
]

const getResponse = (input: string): string => {
  const text = input.toLowerCase()
  if (text.includes('interested in a service')) {
    return 'Great! Please submit an enquiry and our team will reach out to discuss your requirements.'
  }
  if (text.includes('student')) {
    return 'We have special courses and support for students. Submit an enquiry to learn more.'
  }
  if (text.includes('speak') || text.includes('someone')) {
    return 'Please submit an enquiry, and our team will call you back shortly.'
  }
  if (text.includes('service') && !text.includes('course')) {
    return 'DroneTV provides aerial photography, land surveying, industrial inspections, and advisory services.'
  }
  if (text.includes('course') || text.includes('training')) {
    return 'We offer Basic Drone Piloting, Aerial Photography Masterclass, Surveying & Mapping, and DGCA Certification Prep.'
  }
  if (text.includes('contact')) {
    return 'You can contact DroneTV through the contact form or the details on the website.'
  }
  if (text.includes('register') || text.includes('enroll')) {
    return 'You can register for any course by filling out the enquiry form with your details.'
  }
  return "I'm not sure I understood. Try one of the FAQs or submit an enquiry."
}

const initialEnquiry: Enquiry = {
  name: '',
  email: '',
  phone: '',
  userType: 'Student',
  interest: '',
  message: ''
}

function Chatbot() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    { role: 'bot', text: 'Hi! How can I help you today? Ask a question or choose one below.' }
  ])
  const [input, setInput] = useState('')
  const [showEnquiry, setShowEnquiry] = useState(false)
  const [showFaq, setShowFaq] = useState(false)
  const [enquiry, setEnquiry] = useState<Enquiry>(initialEnquiry)
  const [status, setStatus] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const addMessage = (msg: Message) => setMessages(prev => [...prev, msg])

  const sendMessage = (text: string) => {
    if (!text.trim()) return
    setShowFaq(false)
    addMessage({ role: 'user', text })
    const reply = getResponse(text)
    setTimeout(() => addMessage({ role: 'bot', text: reply }), 300)
  }

  const handleSend = (e: FormEvent) => {
    e.preventDefault()
    sendMessage(input)
    setInput('')
  }

  const handleReset = () => {
    setMessages([{ role: 'bot', text: 'Hi! How can I help you today? Ask a question or choose one below.' }])
    setShowEnquiry(false)
    setShowFaq(false)
    setStatus(null)
  }

  const validateEnquiry = (data: Enquiry) => {
    if (!data.name || !data.email || !data.phone || !data.interest || !data.message) {
      return 'All required fields must be filled.'
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      return 'Invalid email format.'
    }
    if (!/^\d{10}$/.test(data.phone)) {
      return 'Phone number must be 10 digits.'
    }
    return ''
  }

  const submitEnquiry = async (e: FormEvent) => {
    e.preventDefault()
    const error = validateEnquiry(enquiry)
    if (error) {
      setStatus({ type: 'error', text: error })
      return
    }

    setStatus(null)
    try {
      const response = await fetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: enquiry.name,
          email: enquiry.email,
          phone: enquiry.phone,
          user_type: enquiry.userType,
          interest: enquiry.interest,
          message: enquiry.message
        })
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.message || 'Unable to submit enquiry.')

      addMessage({ role: 'bot', text: `Thanks ${enquiry.name}, we have received your enquiry and will contact you soon.` })
      setEnquiry(initialEnquiry)
      setShowEnquiry(false)
    } catch (err) {
      setStatus({ type: 'error', text: (err as Error).message })
    }
  }

  return (
    <div className="chatbot-container">
      {open && (
        <div className="chatbot-window">
          <div className="chatbot-header">
            <span className="chatbot-title">AI Support</span>
            <div className="chatbot-actions">
              <button onClick={handleReset} className="icon-btn">Reset</button>
              <button onClick={() => setOpen(false)} className="icon-btn close">×</button>
            </div>
          </div>

          <div className="chatbot-messages" aria-live="polite">
            {messages.map((msg, i) => (
              <div key={i} className={`chatbot-bubble ${msg.role}`}>
                {msg.text}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {showEnquiry ? (
            <form className="chatbot-enquiry" onSubmit={submitEnquiry}>
              <input
                type="text"
                placeholder="Name"
                value={enquiry.name}
                onChange={e => setEnquiry({ ...enquiry, name: e.target.value })}
              />
              <input
                type="email"
                placeholder="Email"
                value={enquiry.email}
                onChange={e => setEnquiry({ ...enquiry, email: e.target.value })}
              />
              <input
                type="tel"
                placeholder="Phone (10 digits)"
                value={enquiry.phone}
                onChange={e => setEnquiry({ ...enquiry, phone: e.target.value })}
              />
              <select
                value={enquiry.userType}
                onChange={e => setEnquiry({ ...enquiry, userType: e.target.value })}
              >
                <option>Student</option>
                <option>Customer</option>
                <option>Other</option>
              </select>
              <select
                value={enquiry.interest}
                onChange={e => setEnquiry({ ...enquiry, interest: e.target.value })}
                aria-label="Service or course of interest"
              >
                <option value="" disabled>Select a service or course</option>
                <optgroup label="Services">
                  {services.map(service => (
                    <option key={service.title} value={service.title}>{service.title}</option>
                  ))}
                </optgroup>
                <optgroup label="Courses & Training">
                  {courses.map(course => (
                    <option key={course.title} value={course.title}>{course.title}</option>
                  ))}
                </optgroup>
              </select>
              <textarea
                placeholder="Message"
                rows={2}
                value={enquiry.message}
                onChange={e => setEnquiry({ ...enquiry, message: e.target.value })}
              />
              <div className="chatbot-form-actions">
                <button type="submit" className="btn small">Send</button>
                <button type="button" onClick={() => setShowEnquiry(false)} className="btn small secondary">Back</button>
              </div>
              {status && <p className={`status ${status.type}`}>{status.text}</p>}
            </form>
          ) : (
            <div className="chatbot-controls">
              <button
                type="button"
                onClick={() => setShowFaq(current => !current)}
                className="faq-toggle"
                aria-expanded={showFaq}
                aria-controls="chatbot-faq-list"
              >
                FAQs
                <span aria-hidden="true">{showFaq ? '−' : '+'}</span>
              </button>
              {showFaq && (
                <div id="chatbot-faq-list" className="chatbot-questions">
                  {questions.map((q, i) => (
                    <button key={i} type="button" onClick={() => sendMessage(q)} className="question-btn">
                      {q}
                    </button>
                  ))}
                </div>
              )}
              <form className="chatbot-input" onSubmit={handleSend}>
                <input
                  type="text"
                  placeholder="Type a question..."
                  value={input}
                  onChange={e => setInput(e.target.value)}
                />
                <button type="submit" className="btn small">Send</button>
              </form>
              <button onClick={() => { setShowEnquiry(true); setShowFaq(false); setStatus(null) }} className="enquiry-toggle">
                I want to submit an enquiry
              </button>
            </div>
          )}
        </div>
      )}
      <button className="chatbot-fab" onClick={() => setOpen(!open)}>
        {open ? 'Close' : 'Chat'}
      </button>
    </div>
  )
}

export default Chatbot
