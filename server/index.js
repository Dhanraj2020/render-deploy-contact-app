const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");
const { Pool } = require('pg');
const app = express();

app.use(cors());
app.use(express.json());

// Use environment variables (IMPORTANT for deployment)
const { Pool } = require('pg');

const db = new Pool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASS || 'Password123!',
  database: process.env.DB_NAME || 'crud_contact',
  port: process.env.DB_PORT || 5432,
});

// Test connection
db.connect((err) => {
  if (err) {
    console.error('DB connection failed:', err);
  } else {
    console.log('DB connected');
  }
});

// Check DB connection
db.getConnection((err, connection) => {
  if (err) {
    console.error("DB connection failed:", err);
  } else {
    console.log("DB connected");
    connection.release();
  }
});


// ================= ROUTES =================

// GET all data
app.get("/api/get", (req, res) => {
  const sql = "SELECT * FROM contact_db";
  db.query(sql, (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
});

// GET single record
app.get("/api/get/:id", (req, res) => {
  const { id } = req.params;
  const sql = "SELECT * FROM contact_db WHERE id = ?";
  db.query(sql, [id], (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
});

// POST (insert)
app.post("/api/post", (req, res) => {
  const { name, email, contact } = req.body;

  if (!name || !email || !contact) {
    return res.status(400).json({ message: "All fields required" });
  }

  const sql =
    "INSERT INTO contact_db (name, email, contact) VALUES (?, ?, ?)";

  db.query(sql, [name, email, contact], (err, result) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Data inserted successfully" });
  });
});

// PUT (update)
app.put("/api/update/:id", (req, res) => {
  const { id } = req.params;
  const { name, email, contact } = req.body;

  const sql =
    "UPDATE contact_db SET name=?, email=?, contact=? WHERE id=?";

  db.query(sql, [name, email, contact, id], (err, result) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Updated successfully" });
  });
});

// DELETE
app.delete("/api/remove/:id", (req, res) => {
  const { id } = req.params;

  const sql = "DELETE FROM contact_db WHERE id=?";

  db.query(sql, [id], (err, result) => {
    if (err) return res.status(500).json(err);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Record not found" });
    }

    res.json({ message: "Deleted successfully" });
  });
});

// TEST ROUTE
app.get("/", (req, res) => {
  res.send("API is running...");
});

// ================= SERVER =================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});