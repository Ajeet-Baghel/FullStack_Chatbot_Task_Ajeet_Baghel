export const courses = [
  { title: 'Basic Drone Piloting', desc: 'Hands-on training for beginners to master controls and safety protocols.' },
  { title: 'Aerial Photography Masterclass', desc: 'Shoot, edit, and deliver cinematic drone content for clients.' },
  { title: 'Surveying & Mapping', desc: 'Learn photogrammetry, mapping workflows, and data processing.' },
  { title: 'DGCA Certification Prep', desc: 'Prepare for the official drone operator certification in India.' }
]

function Courses() {
  return (
    <section id="courses" className="section">
      <h2>Courses & Training</h2>
      <div className="grid">
        {courses.map((course, index) => (
          <div key={index} className="card">
            <h3>{course.title}</h3>
            <p>{course.desc}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

export default Courses
