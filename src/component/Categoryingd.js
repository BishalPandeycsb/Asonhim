import React from "react";
import Product from "./Product";
import Carousel from "react-bootstrap/Carousel";

const CategoryingD = ({ d }) => {
  console.log("Data passed to CategoryingD is -->:", d);

  // Helper function to validate and render products
  const renderProducts = () => {
    if (d && d.length > 0) {
      return d.map((item) => {
        const { _id, title, image, price, rating, genres } = item; // Destructure `genres` for books

        if (
          !_id ||
          !title ||
          !image ||
          typeof price !== "number"
        ) {
          console.warn("Skipping invalid product data:", item);
          return null;
        }

        return (
          <div className="col-lg-6 col-xs-12" key={_id}>
            <Product
              id={_id}
              title={title}
              image={image.trim()}
              price={price}
              rating={rating} // Pass raw rating; handle rounding in Product
              genre={genres} // Pass genre only if it exists
            />
          </div>
        );
      });
    }
    return <p>No products found for this category.</p>;
  };

  return (
    <div className="quickSearchContainer">
      {/* Carousel Section */}
      <Carousel fade interval={3000} controls={true} indicators={true} pause="hover">
        <Carousel.Item>
          <img
            className="d-block w-100"
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSyGPNmhtHGnmrGY7FKGyzalhvzAIa2ljztpg&s"
            alt="Explore Books"
          />
          <Carousel.Caption>
            <h3>Explore Books</h3>
            <p>Find the best books here.</p>
          </Carousel.Caption>
        </Carousel.Item>

        <Carousel.Item>
          <img
            className="d-block w-100"
            src="https://m.media-amazon.com/images/G/01/AdProductsWebsite/images/blog/6tipsstore2._TTW_.jpg"
            alt="Discover Stories"
          />
          <Carousel.Caption>
            <h3>Discover Stories</h3>
            <p>Dive into a world of imagination.</p>
          </Carousel.Caption>
        </Carousel.Item>
      

      <Carousel.Item>
          <img
            className="d-block w-100"
            src="https://www.shutterstock.com/shutterstock/photos/2496171591/display_1500/stock-vector-dermatology-skin-care-consultation-social-media-post-banner-ads-or-square-flyer-or-poster-2496171591.jpg"
            alt="Discover Stories"
          />
          <Carousel.Caption>
            <h3>Discover Stories</h3>
            <p>Dive into a world of imagination.</p>
          </Carousel.Caption>
        </Carousel.Item>
      </Carousel>

      {/* Products Section */}
      <div className="row">{renderProducts()}</div>
    </div>
  );
};

export default CategoryingD;
