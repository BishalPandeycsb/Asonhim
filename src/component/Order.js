import React from 'react';
import './Order.css';
import moment from "moment";
import CheckoutProduct from "./CheckoutProduct";
import CurrencyFormat from './CurrencyFormat.js';

function Order({ order }) {
    return (
        <div className="order">
            <h3>Order:</h3>
            <hr />
            <p>
                {order.data.created
                    ? moment.unix(order.data.created).format("MMMM Do YYYY, h:mma")
                    : "Unknown date"}
            </p>
            <p className="order__id">
                <small>{order.id}</small>
            </p>

            <div className="order__items">
                {order.data.basket?.map((item) => (
                    <CheckoutProduct
                        key={item.id} // Add a unique key
                        id={item.id}
                        title={item.title}
                        image={item.image}
                        price={item.price}
                        rating={item.rating}
                        hideButton
                    />
                ))}
            </div>
            <hr />
            <CurrencyFormat
                renderText={(value) => (
                    <h3 className="order__total">Order Total: {value}</h3>
                )}
                decimalScale={2}
                value={order.data.amount / 100}
                displayType={"text"}
                thousandSeparator={true}
                prefix={"$"}
            />
        </div>
    );
}

export default Order;
