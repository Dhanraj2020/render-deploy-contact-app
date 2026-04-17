const express = require("express");
const cors = require("cors");
const { Pool } = require('pg');
const app = express();

app.use(cors({origin: "*"}));
app.use(express.json());

const db = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

// Test connection once
db.connect()
  .then(() => console.log('DB connected'))
  .catch(err => console.error('DB connection failed:', err));

// ================= ROUTES =================

// GET all data
app.get("/api/get", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM contact_db");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json(err);
  }
});

// GET single record
app.get("/api/get/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query("SELECT * FROM contact_db WHERE id = $1", [id]);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json(err);
  }
});

// POST (insert)
app.post("/api/post", async (req, res) => {
  const { name, email, contact } = req.body;

  if (!name || !email || !contact) {
    return res.status(400).json({ message: "All fields required" });
  }

  try {
    const result = await db.query(
      "INSERT INTO contact_db (name, email, contact) VALUES ($1, $2, $3) RETURNING *",
      [name, email, contact]
    );
    res.json({ message: "Data inserted successfully" });
  } catch (err) {
    res.status(500).json(err);
  }
});

// PUT (update)
app.put("/api/update/:id", async (req, res) => {
  const { id } = req.params;
  const { name, email, contact } = req.body;

  try {
    const result = await db.query(
      "UPDATE contact_db SET name=$1, email=$2, contact=$3 WHERE id=$4 RETURNING *",
      [name, email, contact, id]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Record not found" });
    }
    res.json({ message: "Updated successfully" });
  } catch (err) {
    res.status(500).json(err);
  }
});

// DELETE
app.delete("/api/remove/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const result = await db.query("DELETE FROM contact_db WHERE id=$1", [id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Record not found" });
    }
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json(err);
  }
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
