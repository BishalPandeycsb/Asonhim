import React, { useState } from "react";
import "./Register.css";
import { Link, useNavigate } from "react-router-dom";
import { auth, db } from "./firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

function Register() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");

  const register = async (e) => {
    e.preventDefault();

    // Confirmation dialog
    const userAgrees = window.confirm("Your details might be used for research purposes. Click 'Yes' only if you agree.");
    
    if (userAgrees) {
      try {
        // Create user with email and password
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        const user = userCredential.user;

        // Save user data to Firestore
        await setDoc(doc(db, "info", user.uid), {
          name: name,
          email: email,
          password: password, // Note: Avoid storing passwords in plain text in production
          mobile: mobile,
        });

        // Redirect to home page after registration
        navigate("/");
      } catch (error) {
        alert(error.message);
        console.error("Error during registration:", error);
      }
    } else {
      alert("You need to agree to proceed with registration.");
    }
  };

  return (
    <div className="page">
      <img
        className="login__logo"
        src="https://cryptologos.cc/logos/aave-aave-logo.png"
        alt="Logo"
      />

      <div className="login__container">
        <center>
          <h2>Create Account</h2>
        </center>

        <form>
          <h5>Your Name</h5>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
          />

          <h5>Mobile Number</h5>
          <input
            type="text"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            placeholder="Enter your mobile number"
          />

          <h5>E-mail</h5>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
          />

          <h5>Password</h5>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
          />
          <p>Password must be at least 6 characters.</p>

          <center>
            <button
              type="submit"
              onClick={register}
              className="login__signInButton"
            >
              Register
            </button>
          </center>
        </form>

        <p>
          By signing in, you agree to the Terms and Conditions. Please see our
          Privacy Notice and Cookies Policy for more information.
        </p>
      </div>
    </div>
  );
}

export default Register;
