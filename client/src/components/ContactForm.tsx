import { useState, FormEvent } from 'react'
import { services } from './Services'
import { courses } from './Courses'

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

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    const error = validate(form)
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
          name: form.name,
          email: form.email,
          phone: form.phone,
          user_type: form.userType,
          interest: form.interest,
          message: form.message
        })
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.message || 'Unable to submit enquiry.')

      setStatus({ type: 'success', text: 'Enquiry submitted successfully. We will contact you soon.' })
      setForm(initial)
    } catch (err) {
      setStatus({ type: 'error', text: (err as Error).message })
    }
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
        <select
          value={form.interest}
          onChange={e => setForm({ ...form, interest: e.target.value })}
          aria-label="Service or course of interest"
        >
          <option value="" disabled>Select a service or course of interest</option>
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
