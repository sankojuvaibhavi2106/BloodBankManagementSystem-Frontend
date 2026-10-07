import { useEffect, useState } from "react";
import "./App.css";

const API_URL = "http://localhost:8080/api/donors";

function App() {
  const emptyForm = {
    name: "",
    age: "",
    gender: "",
    bloodGroup: "",
    phone: "",
    email: "",
    address: "",
  };

  const [donors, setDonors] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(emptyForm);
  const [message, setMessage] = useState("");
  const [search, setSearch] = useState("");
  const [bloodFilter, setBloodFilter] = useState("");
  // READ
  const fetchDonors = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setDonors(data);
    } catch (error) {
      console.error("Error fetching donors:", error);
    }
  };

  useEffect(() => {
    fetchDonors();
  }, []);

  // FORM INPUT
  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  // CREATE + UPDATE
  const handleSubmit = async (event) => {
    event.preventDefault();

    const donorData = {
      ...formData,
      age: Number(formData.age),
    };

    try {
      let response;

      if (editingId !== null) {
        // UPDATE
        response = await fetch(`${API_URL}/${editingId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(donorData),
        });
      } else {
        // CREATE
        response = await fetch(API_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(donorData),
        });
      }

      if (!response.ok) {
        throw new Error("Operation failed");
      }

      if (editingId !== null) {
        setMessage("Donor updated successfully!");
      } else {
        setMessage("Donor added successfully!");
      }

      setFormData(emptyForm);
      setEditingId(null);
      setShowForm(false);

      await fetchDonors();
    } catch (error) {
      console.error(error);
      setMessage("Something went wrong!");
    }
  };

  // EDIT
  const handleEdit = (donor) => {
    setFormData({
      name: donor.name,
      age: donor.age,
      gender: donor.gender,
      bloodGroup: donor.bloodGroup,
      phone: donor.phone,
      email: donor.email,
      address: donor.address,
    });

    setEditingId(donor.donorId);
    setShowForm(true);
    setMessage("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // DELETE
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this donor?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Delete failed");
      }

      setMessage("Donor deleted successfully!");

      await fetchDonors();
    } catch (error) {
      console.error(error);
      setMessage("Unable to delete donor!");
    }
  };

  // CANCEL FORM
  const handleCancel = () => {
    setFormData(emptyForm);
    setEditingId(null);
    setShowForm(false);
  };
  const filteredDonors = donors.filter((donor) => {
  const matchesSearch =
    donor.name.toLowerCase().includes(search.toLowerCase()) ||
    donor.phone.includes(search) ||
    donor.email.toLowerCase().includes(search.toLowerCase());

  const matchesBloodGroup =
    bloodFilter === "" || donor.bloodGroup === bloodFilter;

  return matchesSearch && matchesBloodGroup;
});
  return (
    <div className="app">
      <header className="header">
        <h1>Blood Bank Management System</h1>
        <p>Donate Blood, Save Lives</p>
      </header>

      <main className="container">
        <section className="dashboard">
          <div className="dashboard-card">
            <h3>Total Donors</h3>
            <h2>{donors.length}</h2>
          </div>

          <div className="dashboard-card">
            <h3>Blood Groups</h3>
            <h2>8</h2>
          </div>

          <div className="dashboard-card">
            <h3>System Status</h3>
            <h2>Active</h2>
          </div>
        </section>

        {message && <div className="success-message">{message}</div>}

        <section className="donor-section">
          <div className="section-heading">
            <div>
              <h2>Registered Donors</h2>
              <p>View and manage blood donor information</p>
            </div>

            <button
              className="add-button"
              onClick={() => {
                if (showForm) {
                  handleCancel();
                } else {
                  setShowForm(true);
                  setMessage("");
                }
              }}
            >
              {showForm ? "Close Form" : "+ Add Donor"}
            </button>
          </div>

          {showForm && (
            <form className="donor-form" onSubmit={handleSubmit}>
              <h2>
                {editingId !== null ? "Edit Donor" : "Add New Donor"}
              </h2>

              <div className="form-grid">
                <input
                  type="text"
                  name="name"
                  placeholder="Donor Name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />

                <input
                  type="number"
                  name="age"
                  placeholder="Age"
                  min="18"
                  max="65"
                  value={formData.age}
                  onChange={handleChange}
                  required
                />

                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>

                <select
                  name="bloodGroup"
                  value={formData.bloodGroup}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Blood Group</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                </select>

                <input
                  type="text"
                  name="phone"
                  placeholder="Phone Number"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />

                <input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />

                <input
                  type="text"
                  name="address"
                  placeholder="Address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                />
              </div>

              <button type="submit" className="save-button">
                {editingId !== null ? "Update Donor" : "Save Donor"}
              </button>

              <button
                type="button"
                className="cancel-button"
                onClick={handleCancel}
              >
                Cancel
              </button>
            </form>
          )}
        <div className="search-section">
  <input
    type="text"
    placeholder="Search by name, phone or email..."
    value={search}
    onChange={(e) => setSearch(e.target.value)}
  />

  <select
    value={bloodFilter}
    onChange={(e) => setBloodFilter(e.target.value)}
  >
    <option value="">All Blood Groups</option>
    <option value="A+">A+</option>
    <option value="A-">A-</option>
    <option value="B+">B+</option>
    <option value="B-">B-</option>
    <option value="AB+">AB+</option>
    <option value="AB-">AB-</option>
    <option value="O+">O+</option>
    <option value="O-">O-</option>
  </select>
    </div>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Age</th>
                  <th>Gender</th>
                  <th>Blood Group</th>
                  <th>Phone</th>
                  <th>Email</th>
                  <th>Address</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredDonors.length === 0 ? (
                  <tr>
                    <td colSpan="9" className="empty">
                      No donors registered yet
                    </td>
                  </tr>
                ) : (
                  filteredDonors.map((donor) => (
                    <tr key={donor.donorId}>
                      <td>{donor.donorId}</td>
                      <td>{donor.name}</td>
                      <td>{donor.age}</td>
                      <td>{donor.gender}</td>
                      <td>{donor.bloodGroup}</td>
                      <td>{donor.phone}</td>
                      <td>{donor.email}</td>
                      <td>{donor.address}</td>

                      <td>
                        <button
                          className="edit-button"
                          onClick={() => handleEdit(donor)}
                        >
                          Edit
                        </button>

                        <button
                          className="delete-button"
                          onClick={() => handleDelete(donor.donorId)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
