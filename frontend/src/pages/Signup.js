import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = "https://endeavour-with-react-production.up.railway.app";
function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate("/");
    }
  }, [navigate]);
  const handleSignup = async (e) => {
    e.preventDefault();

    try {
      // Replace with your actual API endpoint
      const res = await fetch(`${API_URL}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (res.ok && data.access_token) {
        localStorage.setItem("token", data.access_token);
        navigate("/");
      } else {
        setError(data.message || "Signup failed");
      }
    } catch (err) {
      console.error("Signup error:", err);
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="signup-container">
      <h2>Create an Account</h2>
      <form onSubmit={handleSignup}>
        <input type="text" placeholder="Name" required />
        <input type="email" placeholder="Email" required />
        <input type="password" placeholder="Password" required />
        <button type="submit">Sign Up</button>
      </form>
      <p>
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </div>
  );
}

export default Signup;
