import { useState, FormEvent } from 'react'

type FormData = {
  name: string
  email: string
  phone: string
  userType: string
  interest: string
  message: string
}

const initial: FormData = {
  name: '',
  email: '',
  phone: '',
  userType: 'Student',
  interest: '',
  message: ''
}

function ContactForm() {
  const [form, setForm] = useState<FormData>(initial)
  const [status, setStatus] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const validate = (data: FormData) => {
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

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    const error = validate(form)
    if (error) {
      setStatus({ type: 'error', text: error })
      return
    }
    setStatus({ type: 'success', text: 'Enquiry submitted successfully. We will contact you soon.' })
    setForm(initial)
  }

  return (
    <section id="contact" className="section">
      <h2>Contact / Enquiry</h2>
      <form className="contact-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Name"
          value={form.name}
          onChange={e => setForm({ ...form, name: e.target.value })}
        />
        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={e => setForm({ ...form, email: e.target.value })}
        />
        <input
          type="tel"
          placeholder="Phone (10 digits)"
          value={form.phone}
          onChange={e => setForm({ ...form, phone: e.target.value })}
        />
        <select
          value={form.userType}
          onChange={e => setForm({ ...form, userType: e.target.value })}
        >
          <option>Student</option>
          <option>Customer</option>
          <option>Other</option>
        </select>
        <input
          type="text"
          placeholder="Service or course of interest"
          value={form.interest}
          onChange={e => setForm({ ...form, interest: e.target.value })}
        />
        <textarea
          placeholder="Message"
          rows={4}
          value={form.message}
          onChange={e => setForm({ ...form, message: e.target.value })}
        />
        <button type="submit" className="btn">Submit</button>
        {status && <p className={`status ${status.type}`}>{status.text}</p>}
      </form>
    </section>
  )
}

export default ContactForm
