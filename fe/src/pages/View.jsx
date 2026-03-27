import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import "./view.css";

const View = () => {
  const [user, setUser] = useState({});

  const { id } = useParams();

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/get/${id}`)
      .then((resp) => setUser({ ...resp.data[0] }));
  }, [id]);

  return (
    <div className="p-3">
      <h2 className="text-center">View</h2>
      <div className="card">
        <div className="card-header">
          <p>User Contact Details</p>
        </div>
        <div className="container">
          <div className="labelBox">
            <strong className="labelText">ID : </strong>
            <span className="valueText">{id}</span>
          </div>

          <div className="labelBox">
            <strong className="labelText">Name : </strong>
            <span className="valueText">{user.name}</span>
          </div>
          <div className="labelBox">
            <strong className="labelText">Email : </strong>
            <span className="valueText">{user.email}</span>
          </div>
          <div className="labelBox">
            <strong className="labelText">Contact No. : </strong>
            <span className="valueText">{user.contact}</span>
          </div>
          <Link to="/" className="btn btn-edit">
            Go Back
          </Link>
        </div>
      </div>
    </div>
  );
};

export default View;
