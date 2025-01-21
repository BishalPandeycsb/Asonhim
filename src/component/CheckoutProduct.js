import React from 'react';
import './CheckoutProduct.css';
import { useStateValue } from "./StateProvider";

function CheckoutProduct({ id, image, title, price, rating, hideButton }) {
    const [{}, dispatch] = useStateValue();

    const removeFromBasket = () => {
        // Remove the item from the basket
        dispatch({
            type: 'REMOVE_FROM_BASKET',
            id: id,
        });
    };

    // Ensure rating is a valid positive integer
    const validRating = typeof rating === 'number' && rating > 0 ? Math.round(rating) : 0;

    return (
        <div className='checkoutProduct'>
            <img className='checkoutProduct__image' src={image || "https://via.placeholder.com/150"} alt={title || "Product Image"} />

            <div className='checkoutProduct__info'>
                <p className='checkoutProduct__title'>{title || "Untitled Product"}</p>
                <p className="checkoutProduct__price">
                    <small>$</small>
                    <strong>{price || "Price Unavailable"}</strong>
                </p>
                <div className="checkoutProduct__rating">
                    {Array(validRating)
                        .fill()
                        .map((_, i) => (
                            <p key={i}>🌟</p>
                        ))}
                    {validRating === 0 && <p>No ratings available</p>}
                </div>
                {!hideButton && (
                    <button onClick={removeFromBasket}>Remove from Basket</button>
                )}
            </div>
        </div>
    );
}

export default CheckoutProduct;
