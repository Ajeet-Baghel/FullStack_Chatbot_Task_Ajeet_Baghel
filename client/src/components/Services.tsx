export const services = [
  { title: 'Aerial Photography', desc: 'High-quality drone photo and video for events, real estate, and promotions.' },
  { title: 'Land Surveying', desc: 'Accurate drone-based mapping and topographic surveys for projects of any size.' },
  { title: 'Industrial Inspections', desc: 'Safe, detailed inspections of towers, roofs, and industrial structures.' },
  { title: 'Advisory & Consulting', desc: 'Guidance on drone procurement, permits, and operational best practices.' }
]

function Services() {
  return (
    <section id="services" className="section">
      <h2>Our Services</h2>
      <div className="grid">
        {services.map((service, index) => (
          <div key={index} className="card">
            <h3>{service.title}</h3>
            <p>{service.desc}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

export default Services
