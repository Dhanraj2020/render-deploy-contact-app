import React, { useEffect, useState } from "react";
import { useNavigate, Link, useParams } from "react-router-dom";
import "./AddEdit.css";
import { toast } from "react-toastify";
import axios from "axios";

const AddEdit = () => {
  const initialState = {
    name: "",
    email: "",
    contact: "",
  };

  const [state, setState] = useState(initialState);
  const { name, email, contact } = state;
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setState({ ...state, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name || !email || !contact) {
      toast.error("Please provide value into each input field.");
      return;
    } else {
      if (!id) {
        axios
          .post("http://localhost:5000/api/post", { name, email, contact })
          .then(() => {
            setState(initialState);
            toast.success("Contact Added Successfully!");
            setTimeout(() => navigate("/"), 500);
          })
          .catch((err) => {
            toast.error(err.response?.data || "Something went wrong");
          });
      } else {
        axios
          .put(`http://localhost:5000/api/update/${id}`, { name, email, contact })
          .then(() => {
            setState(initialState);
            toast.success("Contact Updated Successfully!");
            setTimeout(() => navigate("/"), 500);
          })
          .catch((err) => {
            toast.error(err.response?.data || "Something went wrong");
          });
      }
      setTimeout(() => navigate("/"), 500);
    }
  };

  const { id } = useParams();

  useEffect(() => {
    if (id) {
      axios
        .get(`http://localhost:5000/api/get/${id}`)
        .then((resp) => {
          if (resp.data.length > 0) {
            setState({ ...resp.data[0] });
          }
        })
        .catch((err) => console.log("Error fetching data:", err));
    }
  }, [id]);

  return (
    <div>
      <h1 className="text-center">Add Edit</h1>
      <form className="form" onSubmit={handleSubmit}>
        <label htmlFor="name">Name</label>
        <input
          type="text"
          id="name"
          name="name"
          value={name || ""}
          placeholder="Enter your name..."
          onChange={handleInputChange}
        />

        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          name="email"
          value={email || ""}
          placeholder="Enter your email..."
          onChange={handleInputChange}
        />

        <label htmlFor="contact">Contact</label>
        <input
          type="number"
          id="contact"
          name="contact"
          value={contact || ""}
          placeholder="Enter your contact..."
          onChange={handleInputChange}
        />

        <input type="submit" value={id ? "Update" : "Save"} />
        <Link to="/">
          <input type="button" value="Go back" />
        </Link>
      </form>
    </div>
  );
};

export default AddEdit;
