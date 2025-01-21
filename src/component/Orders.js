import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from './firebase';
import './Orders.css';
import { useStateValue } from './StateProvider';
import Order from './Order';

function Orders() {
    const [{ user }] = useStateValue();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (user) {
            const ordersRef = collection(db, 'users', user.uid, 'orders');
            const q = query(ordersRef, orderBy('created', 'desc'));

            const unsubscribe = onSnapshot(
                q,
                (snapshot) => {
                    setOrders(
                        snapshot.docs.map((doc) => ({
                            id: doc.id,
                            data: doc.data(),
                        }))
                    );
                    setLoading(false);
                },
                (err) => {
                    console.error("Error fetching orders:", err);
                    setError("Failed to load orders. Please try again later.");
                    setLoading(false);
                }
            );

            return () => unsubscribe();
        } else {
            setOrders([]);
            setLoading(false);
        }
    }, [user]);

    if (loading) {
        return (
            <div className="orders">
                <h2>Loading your orders...</h2>
            </div>
        );
    }

    if (error) {
        return (
            <div className="orders">
                <h2>Error</h2>
                <p>{error}</p>
            </div>
        );
    }

    return (
        <div className="orders">
            <h2>
                <center>Your Orders</center>
            </h2>

            <div className="orders__order">
                {orders.length > 0 ? (
                    orders.map((order) => <Order key={order.id} order={order} />)
                ) : (
                    <p>No orders found.</p>
                )}
            </div>
        </div>
    );
}

export default Orders;
