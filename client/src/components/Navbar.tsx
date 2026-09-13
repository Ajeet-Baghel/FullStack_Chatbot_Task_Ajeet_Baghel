type NavbarProps = {
  onView: (view: 'home' | 'admin') => void
}

function Navbar({ onView }: NavbarProps) {
  return (
    <nav className="navbar">
      <div className="nav-brand">DroneTV</div>
      <ul className="nav-links">
        <li><button onClick={() => onView('home')} className="nav-link">Home</button></li>
        <li><a href="#services" className="nav-link">Services</a></li>
        <li><a href="#courses" className="nav-link">Courses</a></li>
        <li><a href="#contact" className="nav-link">Contact</a></li>
        <li><button onClick={() => onView('admin')} className="nav-link admin-link">Admin</button></li>
      </ul>
    </nav>
  )
}

export default Navbar
