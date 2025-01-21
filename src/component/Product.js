import React from "react";
import "./Product.css";
import { useStateValue } from "./StateProvider";

function Product({ id, title, image, price, rating, genre }) {

  const [{ basket }, dispatch] = useStateValue();

  const addToBasket = () => {
    const item = {
      id,
      title,
      image,
      price,
      rating,
    };

    // Include the genre only if it exists (applicable for books)
    if (genre) {
      item.genre = genre;
    }

    // Alert the user with the added product's details
    alert(`Added to basket: ${title}${genre ? ` (Genre: ${genre})` : ""}`);
    console.log("Item added to basket:", item);
    console.log("Genre initiated:", genre);

    // Dispatch the action to add the item to the basket
    dispatch({
      type: "ADD_TO_BASKET",
      item,
    });
  };

  // Ensure rating is a valid number and round it to the nearest integer
  const validRating = typeof rating === "number" && rating > 0 ? Math.round(rating) : 0;

  return (
    <div className="container">
      <div className="product">
        <div className="product__info">
          <p>
            <center>
              <b>{title ? title.toUpperCase() : "Untitled Product"}</b>
            </center>
          </p>
          <hr />
          <center>
            <p className="product__price">
              <b>Price :$</b>
              <strong>{price || "Price Unavailable"}</strong>
            </p>
          </center>
          <center>
            <div className="product__rating">
              <b>Rating :</b>
              {Array(validRating)
                .fill()
                .map((_, i) => (
                  <p key={i}>🌟</p>
                ))}
            </div>
          </center>
        </div>
        <hr />
        <img src={image || "https://via.placeholder.com/150"} alt={title || "Product Image"} />

        <button onClick={addToBasket}>Add to Basket</button>
      </div>
    </div>
  );
}

export default Product;
