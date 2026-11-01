
import React, { useEffect, useState } from "react";
import "./App.css";

const API_URL =
  "https://online-event-registration-k02e.onrender.com/api/registrations";

function App() {
  const [registrations, setRegistrations] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    event: "",
    date: ""
  });

  const fetchRegistrations = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();

      if (!response.ok) throw new Error("Failed to load registrations");

      setRegistrations(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchRegistrations();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({
      name: "",
      email: "",
      event: "",
      date: ""
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        editingId ? `${API_URL}/${editingId}` : API_URL,
        {
          method: editingId ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData)
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || result.error || "Unable to save");
      }

      alert(
        result.message ||
        (editingId ? "Registration updated!" : "Registration successful!")
      );

      resetForm();
      fetchRegistrations();
    } catch (error) {
      alert("Error: " + error.message);
    }
  };

  const handleEdit = (registration) => {
    setEditingId(registration._id);

    setFormData({
      name: registration.name,
      email: registration.email,
      event: registration.event,
      date: registration.date
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this registration?")) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE"
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || result.error || "Unable to delete");
      }

      if (editingId === id) resetForm();

      await fetchRegistrations();
      alert(result.message || "Registration cancelled!");
    } catch (error) {
      alert("Error: " + error.message);
    }
  };

  return (
    <div className="app">

      <nav className="navbar">
        <div className="logo">EVENT<span>HUB.</span></div>
        <a href="#register" className="nav-link">Register Now ↗</a>
      </nav>

      <header className="hero">
        <div className="hero-content">
          <p className="hero-tag">DISCOVER · CONNECT · EXPERIENCE</p>
          <h1>Make Every<br />Moment <span>Count.</span></h1>
          <p className="hero-description">
            Discover exciting events, connect with people,
            and create unforgettable experiences.
          </p>
          <a href="#register" className="hero-button">
            Explore Events ↓
          </a>
        </div>
      </header>

      <section className="events-section">
        <div className="section-heading">
          <p className="eyebrow">WHAT'S HAPPENING</p>
          <h2>Explore Our Events</h2>
          <p>Find your next opportunity to learn, create and connect.</p>
        </div>

        <div className="event-grid">
          <div className="event-tile tech">
            <span>01 / TECHNOLOGY</span>
            <h3>Tech Fest</h3>
          </div>

          <div className="event-tile workshop">
            <span>02 / LEARNING</span>
            <h3>AI Workshop</h3>
          </div>

          <div className="event-tile hackathon">
            <span>03 / INNOVATION</span>
            <h3>Hackathon</h3>
          </div>
        </div>
      </section>

      <section className="registration-section" id="register">
        <div className="form-intro">
          <p className="eyebrow">SAVE YOUR SPOT</p>
          <h2>{editingId ? "Update Your Registration" : "Join The Experience."}</h2>
          <p>Fill in your details to reserve your place at an event.</p>
        </div>

        <form onSubmit={handleSubmit} className="registration-form">
          <label>Full Name</label>
          <input
            type="text"
            name="name"
            placeholder="Enter your name"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <label>Email Address</label>
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <label>Select Event</label>
          <select
            name="event"
            value={formData.event}
            onChange={handleChange}
            required
          >
            <option value="">Choose an event</option>
            <option value="Tech Fest">Tech Fest</option>
            <option value="AI Workshop">AI Workshop</option>
            <option value="Web Development Workshop">
              Web Development Workshop
            </option>
            <option value="Hackathon">Hackathon</option>
          </select>

          <label>Event Date</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
          />

          <button type="submit" className="submit-button">
            {editingId ? "Update Registration →" : "Complete Registration →"}
          </button>

          {editingId && (
            <button
              type="button"
              className="cancel-edit"
              onClick={resetForm}
            >
              Cancel Editing
            </button>
          )}
        </form>
      </section>

      <section className="participants-section">
        <div className="section-heading">
          <p className="eyebrow">COMMUNITY</p>
          <h2>Registered Participants</h2>
          <p>People who have already joined the experience.</p>
        </div>

        <div className="registrations">
          {registrations.length === 0 ? (
            <p className="empty-message">No registrations yet. Be the first!</p>
          ) : (
            registrations.map((registration) => (
              <div className="participant-card" key={registration._id}>
                <div className="participant-info">
                  <h3>{registration.name}</h3>
                  <p>{registration.email}</p>
                  <span>{registration.event}</span>
                  <p className="participant-date">Date: {registration.date}</p>
                </div>

                <div className="participant-actions">
                  <button
                    className="edit"
                    onClick={() => handleEdit(registration)}
                  >
                    Edit
                  </button>

                  <button
                    className="delete"
                    onClick={() => handleDelete(registration._id)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      <footer>
        <div className="logo">EVENT<span>HUB.</span></div>
        <p>Creating experiences. Connecting people.</p>
        <small>© 2026 EventHub. All rights reserved.</small>
      </footer>

    </div>
  );
}

export default App;
