import React, { useState, useEffect } from 'react';
import './Payment.css';
import { useStateValue } from "./StateProvider";
import CheckoutProduct from "./CheckoutProduct";
import { Link, useNavigate } from "react-router-dom";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import CurrencyFormat from './CurrencyFormat.js';
import { getBasketTotal } from "./reducer";
import axios from './axios';
import { collection, doc, setDoc } from "firebase/firestore";
import { db } from "./firebase";

function Payment() {
    const [{ basket, user }, dispatch] = useStateValue();
    const navigate = useNavigate();

    const stripe = useStripe();
    const elements = useElements();

    const [succeeded, setSucceeded] = useState(false);
    const [processing, setProcessing] = useState(false);
    const [error, setError] = useState(null);
    const [disabled, setDisabled] = useState(true);
    const [clientSecret, setClientSecret] = useState(null);

    // Fetch client secret whenever the basket changes
    useEffect(() => {
        const getClientSecret = async () => {
            if (basket?.length === 0) return; // Skip if basket is empty

            try {
                const total = getBasketTotal(basket) * 100; // Convert to cents
                const response = await axios.post(`/payments/create?total=${total}`);

                if (response.data.clientSecret) {
                    setClientSecret(response.data.clientSecret);
                } else {
                    console.error("No client secret returned from the server.");
                }
            } catch (error) {
                console.error("Error fetching client secret:", error);
                setError("Failed to prepare payment. Please try again.");
            }
        };

        getClientSecret();
    }, [basket]);

    // Handle form submission
    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!clientSecret) {
            setError("Payment cannot proceed at this time. Please try again later.");
            return;
        }

        const cardElement = elements.getElement(CardElement);
        if (!cardElement) {
            setError("Card details are missing. Please check the form.");
            return;
        }

        setProcessing(true);
        setError(null);  // Clear previous errors

        try {
            const { paymentIntent, error: stripeError } = await stripe.confirmCardPayment(clientSecret, {
                payment_method: { card: cardElement },
            });

            if (stripeError) {
                console.error("Stripe Payment Error:", stripeError);
                setError(stripeError.message || "Payment failed. Please try again.");
                setProcessing(false);
                return;
            }

            // Save order to Firestore
            const ordersRef = collection(db, 'users', user?.uid, 'orders');
            await setDoc(doc(ordersRef, paymentIntent.id), {
                basket: basket,
                amount: paymentIntent.amount,
                created: paymentIntent.created,
            });

            setSucceeded(true);
            setProcessing(false);
            dispatch({ type: 'EMPTY_BASKET' });

            navigate('/orders');
        } catch (error) {
            console.error("Error during payment confirmation:", error);
            setError("Payment processing error. Please try again.");
            setProcessing(false);
        }
    };

    // Handle input changes in the CardElement
    const handleChange = (event) => {
        setDisabled(event.empty);
        setError(event.error ? event.error.message : "");
    };

    return (
        <div className="payment">
            <div className="payment__container">
                <h1>
                    Checkout (
                    <Link to="/checkout">{basket?.length} items</Link>
                    )
                </h1>

                {/* Payment section - Delivery Address */}
                <div className="payment__section">
                    <div className="payment__title">
                        <h3>Delivery Address</h3>
                    </div>
                    <div className="payment__address">
                        <p>{user?.email}</p>
                        <p>123 React Lane</p>
                        <p>Los Angeles, CA</p>
                    </div>
                </div>

                {/* Payment section - Review Items */}
                <div className="payment__section">
                    <div className="payment__title">
                        <h3>Review Items and Delivery</h3>
                    </div>
                    <div className="payment__items">
                        {basket.map((item) => (
                            <CheckoutProduct
                                key={item.id}
                                id={item.id}
                                title={item.title}
                                image={item.image}
                                price={item.price}
                                rating={item.rating}
                            />
                        ))}
                    </div>
                </div>

                {/* Payment section - Payment Method */}
                <div className="payment__section">
                    <div className="payment__title">
                        <h3>Payment Method</h3>
                    </div>
                    <div className="payment__details">
                        <form onSubmit={handleSubmit}>
                            <CardElement onChange={handleChange} />
                            <div className="payment__priceContainer">
                                <CurrencyFormat
                                    renderText={(value) => (
                                        <h3>Order Total: {value}</h3>
                                    )}
                                    decimalScale={2}
                                    value={getBasketTotal(basket)}
                                    displayType={"text"}
                                    thousandSeparator={true}
                                    prefix={"$"}
                                />
                                <button disabled={processing || disabled || succeeded}>
                                    <span>{processing ? "Processing..." : "Buy Now"}</span>
                                </button>
                            </div>

                            {/* Display Errors */}
                            {error && (
                                <div className="payment__error">
                                    <p>{error}</p>
                                </div>
                            )}
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Payment;
