import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [employees, setEmployees] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    department: "",
    salary: "",
  });

  const [search, setSearch] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("All");
  const [editingId, setEditingId] = useState(null);

  const API_URL = "http://localhost:5100/employees";

  // Fetch Employees
  const getEmployees = async () => {
    try {
      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error("Failed to fetch employees");
      }

      const data = await response.json();
      setEmployees(data);
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

  useEffect(() => {
    getEmployees();
  }, []);

  // Handle Form Input
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Add / Update Employee
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingId !== null) {
        await fetch(`${API_URL}/${editingId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });

        setEditingId(null);
      } else {
        await fetch(API_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });
      }

      setFormData({
        name: "",
        department: "",
        salary: "",
      });

      getEmployees();
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // Delete Employee
  const deleteEmployee = async (id) => {
    try {
      await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });

      getEmployees();
    } catch (error) {
      console.error(error);
    }
  };

  // Edit Employee
  const editEmployee = (employee) => {
    setFormData({
      name: employee.name,
      department: employee.department,
      salary: employee.salary,
    });

    setEditingId(employee.id);
  };

  // Search & Filter
  const filteredEmployees = employees.filter((employee) => {
    const matchesSearch = employee.name
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesDepartment =
      departmentFilter === "All" ||
      employee.department === departmentFilter;

    return matchesSearch && matchesDepartment;
  });

  const departments = [
    "All",
    ...new Set(employees.map((emp) => emp.department)),
  ];

  return (
    <div className="container">
      <h1>Employee Management System</h1>

      <h3>Total Employees: {filteredEmployees.length}</h3>

      {/* Search + Filter */}
      <div className="controls">
        <input
          type="text"
          placeholder="Search Employee..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          value={departmentFilter}
          onChange={(e) => setDepartmentFilter(e.target.value)}
        >
          {departments.map((dept, index) => (
            <option key={index} value={dept}>
              {dept}
            </option>
          ))}
        </select>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="form">
        <input
          type="text"
          name="name"
          placeholder="Employee Name"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="department"
          placeholder="Department"
          value={formData.department}
          onChange={handleChange}
          required
        />

        <input
          type="number"
          name="salary"
          placeholder="Salary"
          value={formData.salary}
          onChange={handleChange}
          required
        />

        <button type="submit">
          {editingId !== null ? "Update Employee" : "Add Employee"}
        </button>
      </form>

      {/* Employee Cards */}
      <div className="employee-grid">
        {filteredEmployees.length > 0 ? (
          filteredEmployees.map((employee) => (
            <div key={employee.id} className="card">
              <h3>{employee.name}</h3>

              <p>Department: {employee.department}</p>

              <p>Salary: ₹{employee.salary}</p>

              <div className="btn-group">
                <button
                  className="edit-btn"
                  onClick={() => editEmployee(employee)}
                >
                  Edit
                </button>

                <button
                  className="delete-btn"
                  onClick={() => {
                    if (window.confirm("Delete this employee?")) {
                      deleteEmployee(employee.id);
                    }
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <p>No employees found.</p>
        )}
      </div>
    </div>
  );
}

export default App;