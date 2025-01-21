import React, { useState } from "react";
import "./Login.css";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "./firebase";
import { signInWithEmailAndPassword } from "firebase/auth";

function Login() {
  const navigate = useNavigate(); // Correct hook name is `useNavigate`
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const signIn = async (e) => {
    e.preventDefault(); // Stops page refresh

    try {
      // Sign in with email and password
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log("Signed in:", userCredential.user);

      // Redirect to the home page
      navigate("/");
    } catch (error) {
      alert(error.message); // Display error message
      console.error("Error during sign-in:", error);
    }
  };

  return (
    <div className="login">
      <Link to="/">
        <img
          className="login__logo"
          src="https://cryptologos.cc/logos/aave-aave-logo.png"
          alt="Logo"
        />
      </Link>

      <div className="login__container">
        <h2>Sign-in</h2>

        <form>
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

          <button
            type="submit"
            onClick={signIn}
            className="login__signInButton"
          >
            Sign In
          </button>
        </form>

        <p>
          By signing-in you agree to the AMAZON FAKE CLONE Conditions of Use &
          Sale. Please see our Privacy Notice and Cookies Policy.
        </p>

        <hr />

        <center>
          <h3>If New!</h3>
        </center>
        <Link to="/register">
          <button className="login__registerButton">Register</button>
        </Link>
      </div>
    </div>
  );
}

export default Login;
