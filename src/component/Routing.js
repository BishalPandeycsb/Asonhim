import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./Login";
import Home from "./home/home.js";
import CategoryapiWrapper from "./CategoryapiWrapper.js";
import Header from "./Header";
import Checkout from "./Checkout";
import Payment from "./Payment";
import Orders from "./Orders";
import Register from "./registration.js";
import Chatbot from "./Chatbot"; // Import the Chatbot
import { auth } from "./firebase";
import { useStateValue } from "./StateProvider";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

const promise = loadStripe("pk_test_51Qh397CNRqFJMiY5grhRTKJ8pUxsV7FUKEgkktNCo6JEOlmfAupfHqBsPYqBBvrhwgdANM5LqAulqIon7Ul0F2Cs0096so3z6C");

const Routing = () => {
  const [{ basket }, dispatch] = useStateValue();

  useEffect(() => {
    auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        dispatch({ type: "SET_USER", user: authUser });
      } else {
        dispatch({ type: "SET_USER", user: null });
      }
    });
  }, [dispatch]);

  return (
    <BrowserRouter>
      <div>
        {!["/login", "/register"].includes(window.location.pathname) && <Header />}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/category/:type" element={<CategoryapiWrapper />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route
            path="/payment"
            element={
              <Elements stripe={promise}>
                <Payment />
              </Elements>
            }
          />
          <Route path="/orders" element={<Orders />} />
          <Route path="*" element={<h1>404 Not Found</h1>} />
        </Routes>
        <Chatbot /> {/* Add the Chatbot component */}
      </div>
    </BrowserRouter>
  );
};

export default Routing;
