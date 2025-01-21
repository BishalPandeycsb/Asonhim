import React, { useEffect, useState } from "react"; 
import Card from "./Card";

const CardApi = ({ genre }) => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!genre) {
      setError("Invalid genre provided.");
      setLoading(false);
      return;
    }

    const apiUrl = `https://aqueous-tiaga-699bfea4a0d8.herokuapp.com/category/Books?genre=${genre}`;

    fetch(apiUrl)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        setRecommendations(data.slice(0, 6)); // Limit to 5 recommendations
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch recommendations:", err.message);
        setError(err.message);
        setLoading(false);
      });
  }, [genre]);

  if (loading) return <p>Loading recommendations...</p>;
  if (error) return <p>Error loading recommendations: {error}</p>;
  if (recommendations.length === 0) return <p>No recommendations found.</p>;

  return (
    <div className="recommendations__cards">
      {recommendations.map((book) => (
        <Card
          key={book.id}
          title={book.title}
          image={book.image}
          rating={book.rating}
          price={book.price}
        />
      ))}
    </div>
  );
};

export default CardApi;
