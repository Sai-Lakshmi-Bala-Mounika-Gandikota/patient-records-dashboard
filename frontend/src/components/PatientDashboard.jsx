import React, { useEffect, useState } from "react";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, PieChart, Pie, Cell, Legend,
} from "recharts";

export default function PatientDashboard() {
  const [patients, setPatients] = useState([]);
  const [query, setQuery] = useState("");

  useEffect(() => {
    fetch("/public/data/patients.json")
      .then((r) => r.json())
      .then((data) => setPatients(data))
      .catch((err) => console.error(err));
  }, []);

  // Prepare data for line chart (admissions per date)
  const admissionsByDate = Object.values(patients.reduce((acc, p) => {
    acc[p.admission_date] = acc[p.admission_date] || { date: p.admission_date, count: 0 };
    acc[p.admission_date].count += 1;
    return acc;
  }, {})).sort((a,b) => a.date.localeCompare(b.date));

  // Pie: by department
  const deptMap = patients.reduce((m, p) => {
    m[p.department] = (m[p.department] || 0) + 1;
    return m;
  }, {});
  const pieData = Object.keys(deptMap).map(k => ({ name: k, value: deptMap[k] }));

  const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#8dd1e1"];

  const filtered = patients.filter(p =>
    p.name.toLowerCase().includes(query.toLowerCase()) ||
    p.department.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="container">
      <div className="left">
        <div style={{ marginBottom: 10 }}>
          <input className="input" placeholder="Search by name or department" value={query} onChange={e=>setQuery(e.target.value)} />
        </div>

        <div style={{ display: "flex", gap: 20 }}>
          <div style={{ flex: 1 }}>
            <h3>Admissions Over Time</h3>
            <LineChart width={500} height={250} data={admissionsByDate}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Line type="monotone" dataKey="count" stroke="#8884d8" />
            </LineChart>
          </div>

          <div style={{ width: 300 }}>
            <h3>By Department</h3>
            <PieChart width={300} height={250}>
              <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70} label>
                {pieData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
              </Pie>
              <Legend />
            </PieChart>
          </div>
        </div>

        <h3>Patients</h3>
        <table className="table">
          <thead>
            <tr><th>Name</th><th>Department</th><th>Admission Date</th></tr>
          </thead>
          <tbody>
            {filtered.map(p => (
              <tr key={p.id}>
                <td>{p.name}</td>
                <td>{p.department}</td>
                <td>{p.admission_date}</td>
              </tr>
            ))}
            {filtered.length===0 && <tr><td colSpan="3">No results</td></tr>}
          </tbody>
        </table>
      </div>

      <div className="right">
        <h3>Summary</h3>
        <p>Total patients: <strong>{patients.length}</strong></p>
        <p>Departments: {Object.keys(deptMap).join(", ")}</p>
      </div>
    </div>
  );
}
