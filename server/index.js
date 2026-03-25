const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");
const app = express();
app.use(cors());
app.use(express.json());

// Create a pool
const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "Password123!",
  database: "crud_contact",
  port: 3306,
});

app.get("/api/get", (req, res) => {
  const sqlGet = "SELECT * FROM contact_db";
  db.query(sqlGet, (error, results) => {
    res.send(results);
  });
});

app.post("/api/post", (req, res) => {
  const { name, email, contact } = req.body;
  sqlInsert = "INSERT INTO contact_db (name, email, contact) VALUES (?, ?, ?)";
  db.query(sqlInsert, [name, email, contact], (error, result) => {
    if (error) {
      console.log(error);
    }
  });
});

app.delete("/api/remove/:id", (req, res) => {
  const { id } = req.params;
  const sqlRemove = "DELETE FROM contact_db WHERE id = ?";

  db.query(sqlRemove, [id], (error, result) => {
    if (error) {
      console.error(error);
      return res.status(500).json({ message: "Failed to delete record" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Record not found" });
    }

    res.status(200).json({ message: "Record deleted successfully" });
  });
});

app.get("/api/get/:id", (req, res) => {
  const { id } = req.params;
  const sqlGet = "SELECT * FROM contact_db WHERE id = ?";
  db.query(sqlGet, id, (error, results) => {
    if (error) {
      console.log(error);
    }
    res.send(results);
  });
});

app.put("/api/update/:id", (req, res) => {
  const { id } = req.params;
  const { name, email, contact } = req.body;
  const sqlUpdate =
    "UPDATE contact_db SET name=?, email=?, contact=? WHERE id = ?";
  db.query(sqlUpdate, [name, email, contact, id], (error, results) => {
    if (error) {
      console.log(error);
    }
    res.send(results);
  });
});

app.get("/insert-static", (req, res) => {
  // Static values
  const sqlInsert =
    "INSERT INTO contact_db (name, email, contact) VALUES (?, ?, ?)";
  const values = ["raj", "raj@gmail.com", "9876543210"];

  db.query(sqlInsert, values, (err, results) => {
    if (err) {
      console.error("Error inserting static data:", err);
      return res.status(500).send("Database error");
    }

    console.log("Static insert result:", results);
    res.send("Static data inserted successfully!");
  });
});

// PORT FIX
const PORT = process.env.PORT || 5000;

// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });
module.exports = app; //Vercel config
