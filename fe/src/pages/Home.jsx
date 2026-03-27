import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import "./home.css";
import { toast } from "react-toastify";
import axios from "axios";

const Home = () => {
  const [data, setData] = useState([]);

  const loadData = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/get");
      setData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to load data");
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDeleteContact = async (id) => {
    if (window.confirm("Are you sure you want to delete this record?")) {
      try {
        await axios.delete(`http://localhost:5000/api/remove/${id}`);

        setData((prev) =>
          prev.filter((item) => Number(item.id) !== Number(id)),
        );

        toast.success("Data Deleted Successfully");
      } catch (error) {
        toast.error("Failed to delete data");
      }
    }
  };
  return (
    <div className="container">
      <div className="headingBox">
        <h1 className="text-center">Contact Information</h1>
        <Link to="/add-edit-contact">
          <button className="btn btn-add-contact">Add Contact</button>
        </Link>
      </div>

      <div className="table-container">
        <table className="styled-table">
          <thead>
            <tr>
              <th>Sr.No.</th>
              <th>Name</th>
              <th>Email ID</th>
              <th>Contact No.</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {data.length ? (
              data.map((item, index) => (
                <tr key={item.id}>
                  <td data-label="Sr.No.">{index + 1}</td>
                  <td data-label="Name">{item.name}</td>
                  <td data-label="Email ID">{item.email}</td>
                  <td data-label="Contact No.">{item.contact}</td>
                  <td data-label="Action">
                    <Link to={`/update/${item.id}`}>
                      <button className="btn btn-edit">Edit</button>
                    </Link>

                    <button
                      className="btn btn-delete"
                      onClick={() => handleDeleteContact(item.id)}
                    >
                      Delete
                    </button>

                    <Link to={`/view/${item.id}`}>
                      <button className="btn btn-view">View</button>
                    </Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" style={{ textAlign: "center" }}>
                  No data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Home;
