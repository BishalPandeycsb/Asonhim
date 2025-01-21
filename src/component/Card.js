import React from "react";
import "./Card.css";
import { useStateValue } from "./StateProvider";

const Card = ({ id, title, image, price, rating, genre }) => {
  const [{ basket }, dispatch] = useStateValue();

  const addToBasket = () => {
    // Prepare the item to dispatch
    const item = {
      id,
      title,
      image,
      price,
      rating,
    };

    // Include genre only if it's provided
    if (genre) {
      item.genre = genre;
    }

    // Dispatch the item into the data layer
    dispatch({
      type: "ADD_TO_BASKET",
      item,
    });

    alert(`${title} has been added to your basket!`);
  };

  const validRating = typeof rating === "number" && rating > 0 ? Math.round(rating) : 0;
  const formattedPrice = price ? `$${price.toFixed(2)}` : "Price Unavailable";

  return (
    <div className="card">
      <img 
        src={image || "https://via.placeholder.com/220x140"} 
        alt={title || "Product Image"} 
        className="card-image" 
      />
      <div className="card-content">
        <h2 className="card-title">{title || "Untitled Product"}</h2>
        <div className="card-rating">
        <strong>Rating</strong>
          {Array(validRating)
            .fill()
            .map((_, i) => (
              <span key={i} aria-label="star">⭐</span>
            ))}
        </div>
        <p className="card-price"><strong>Price :$</strong>{formattedPrice}</p>
        <button className="add-to-basket" onClick={addToBasket}>
          Add to Basket
        </button>
      </div>
    </div>
  );
};

export default Card;
