import React, { useState, useEffect } from "react";
import "./Checkout.css";
import Subtotal from "./Subtotal";
import { useStateValue } from "./StateProvider";
import CheckoutProduct from "./CheckoutProduct";
import CardApi from "./CardApi";

function Checkout() {
  const [{ basket, user }] = useStateValue();
  const [genre, setGenre] = useState(null);

  useEffect(() => {
    // Extract the most recent genre from the basket
    const genres = basket.filter((item) => item.genre).map((item) => item.genre);
    if (genres.length > 0) {
      setGenre(genres[genres.length - 1]); // Use the last genre
    } else {
      setGenre(null);
    }
  }, [basket]);

  return (
    <div className="checkout">
      <div className="checkout__top">
        <div className="checkout__left">
          <img
            className="checkout__ad"
            src="https://images-na.ssl-images-amazon.com/images/G/02/UK_CCMP/TM/OCC_Amazon1._CB423492668_.jpg"
            alt="Ad Banner"
          />

          <div>
           
          
            <h2>Hello, {user?.email || "Guest"}</h2>
            <h2 className="checkout__title">Your Shopping Basket</h2>
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

        <div className="checkout__right">
          <Subtotal />
        </div>
      </div>

      {/* Recommended Products */}
      <div className="checkout__bottom">
        {genre && (
          <div className="checkout__recommendations">
            <h3>Recommended for You on {genre}</h3>
            <br />
            <CardApi genre={genre} />
          </div>
        )}
      </div>
    </div>
  );
}

export default Checkout;
