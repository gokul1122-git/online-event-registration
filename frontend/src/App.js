
import React, { useEffect, useState } from "react";
import "./App.css";

const API_URL = "https://online-event-registration-k02e.onrender.com/api/registrations";

function App() {
  const [registrations, setRegistrations] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    event: "",
    date: ""
  });

  const [editingId, setEditingId] = useState(null);

  // GET - Load registrations from MongoDB through the backend
  const fetchRegistrations = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.message || "Failed to load registrations");
      }

      setRegistrations(data);
    } catch (error) {
      console.error("Error fetching registrations:", error);
    }
  };

  useEffect(() => {
    fetchRegistrations();
  }, []);

  // Handle form input
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // POST - Create / PUT - Update registration
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const url = editingId
        ? `${API_URL}/${editingId}`
        : API_URL;

      const response = await fetch(url, {
        method: editingId ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || result.error || "Unable to save registration"
        );
      }

      alert(
        result.message ||
        (editingId
          ? "Registration updated successfully!"
          : "Registration created successfully!")
      );

      setEditingId(null);

      setFormData({
        name: "",
        email: "",
        event: "",
        date: ""
      });

      await fetchRegistrations();
    } catch (error) {
      console.error("Error saving registration:", error);
      alert("Error: " + error.message);
    }
  };

  // Edit - Fill the form with existing registration details
  const handleEdit = (registration) => {
    setEditingId(registration._id);

    setFormData({
      name: registration.name,
      email: registration.email,
      event: registration.event,
      date: registration.date
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  // DELETE - Remove registration
  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this registration?"
    );

    if (!confirmed) return;

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE"
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || result.error || "Unable to delete registration"
        );
      }

      if (editingId === id) {
        setEditingId(null);
        setFormData({
          name: "",
          email: "",
          event: "",
          date: ""
        });
      }

      await fetchRegistrations();
      alert(result.message || "Registration deleted successfully!");
    } catch (error) {
      console.error("Error deleting registration:", error);
      alert("Error: " + error.message);
    }
  };

  // Cancel editing and clear the form
  const handleCancelEdit = () => {
    setEditingId(null);

    setFormData({
      name: "",
      email: "",
      event: "",
      date: ""
    });
  };

  return (
    <div className="container">
      <h1>Online Event Registration</h1>

      <p className="subtitle">
        Register for your favorite events
      </p>

      <form onSubmit={handleSubmit} className="registration-form">
        <input
          type="text"
          name="name"
          placeholder="Enter your name"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Enter your email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <select
          name="event"
          value={formData.event}
          onChange={handleChange}
          required
        >
          <option value="">Select Event</option>
          <option value="Tech Fest">Tech Fest</option>
          <option value="AI Workshop">AI Workshop</option>
          <option value="Web Development Workshop">
            Web Development Workshop
          </option>
          <option value="Hackathon">Hackathon</option>
        </select>

        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          required
        />

        <button type="submit">
          {editingId ? "Update Registration" : "Register"}
        </button>

        {editingId && (
          <button type="button" onClick={handleCancelEdit}>
            Cancel Editing
          </button>
        )}
      </form>

      <h2>Registered Participants</h2>

      <div className="registrations">
        {registrations.map((registration) => (
          <div className="card" key={registration._id}>
            <h3>{registration.name}</h3>

            <p>
              <strong>Email:</strong> {registration.email}
            </p>

            <p>
              <strong>Event:</strong> {registration.event}
            </p>

            <p>
              <strong>Date:</strong> {registration.date}
            </p>

            <button
              type="button"
              className="edit"
              onClick={() => handleEdit(registration)}
            >
              Edit
            </button>

            <button
              type="button"
              className="delete"
              onClick={() => handleDelete(registration._id)}
            >
              Cancel
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
