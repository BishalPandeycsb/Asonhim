import React, { useState, useEffect } from "react";
import { useStateValue } from "./StateProvider";  // Correct import
import { processImage,processText} from './process';
import axios from "axios";
import "./Chatbot.css";

const Chatbot = ({  }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [messages, setMessages] = useState([]); 
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [books, setBooks] = useState([]);
  const [{ basket }, dispatch] = useStateValue([]);
  const [selectedFilters, setSelectedFilters] = useState({});
  const [inputText, setInputText] = useState("");

  const API_URL = "https://aqueous-tiaga-699bfea4a0d8.herokuapp.com";

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      // Display welcome message when chatbot is opened
      setMessages([
        { user: "Bot", text: "Hey, I am Abbot! How can I help you with the books?" },
      ]);
      fetchCategories();
    }
  }, [isOpen]);

  const toggleChatbot = () => {
    console.log("Current isOpen before toggle:", isOpen);
    setIsOpen(!isOpen);
  };
  

  const fetchCategories = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/`);
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleCategorySelection = (category) => {
    if (category.Product === "Books") {
      setSelectedCategory(category.Product);
      setSelectedFilters({});
      setBooks([]);
    } else {
      window.location.href = `http://localhost:3000/Category/${category.Product}`;
    }
  };

  const handleFilterSelection = (key, value) => {
    setSelectedFilters((prevFilters) => {
      let updatedFilters = { ...prevFilters };

      if (key === "rating") {
        updatedFilters["minRating"] = value;
        updatedFilters["maxRating"] = 5;
      } else if (key === "price") {
        updatedFilters["minPrice"] = value.min;
        updatedFilters["maxPrice"] = value.max;
      } else {
        updatedFilters[key] = value;
      }

      fetchFilteredBooks(updatedFilters);
      return updatedFilters;
    });
  };

  const addToBasket = (book) => {
    const item = {
      id: book._id,
      title: book.title,
      image: book.image || "https://via.placeholder.com/150",
      price: book.price || "N/A",
      rating: book.rating || 0,
      genre: book.genres || "Unknown",
    };

    // Alert the user about added item
    alert(`Added to basket: ${item.title} (Genre: ${item.genre})`);
    console.log("Item added to basket:", item);

    // Dispatch action to add the book to basket
    dispatch({
      type: "ADD_TO_BASKET",
      item,
    });
  };


  const fetchFilteredBooks = async (filters) => {
    const queryParams = new URLSearchParams(filters).toString();
    try {
      const { data } = await axios.get(`${API_URL}/category/Books?${queryParams}`);
      setBooks(data);
    } catch (error) {
      console.error("Error fetching books:", error);
    }
  };

  const filterOptions = {
    genre: ["Fiction", "Non-fiction", "Travel", "Sports", "Business", "Science Fiction", "History", "Finance"],
    language: ["English", "Spanish", "Portuguese", "Italian", "German"],
    rating: ["1", "2", "3", "4", "5"],
    price: [
      { label: "0-100", min: 0, max: 100 },
      { label: "100-200", min: 100, max: 200 },
      { label: "200-300", min: 200, max: 300 },
      { label: "300+", min: 300, max: 500 },
    ],
  };

  return (
    <div className="chatbot-container">
      {!isOpen ? (
        <button className="chatbot-toggle" onClick={toggleChatbot}>
          🤖
        </button>
      ) : (
        <div className="chatbot-content">
          <div className="chatbot-header">
            <span>AB-Mon</span>
            <button className="close-chatbot" onClick={toggleChatbot}>✖</button>
          </div>

          {!selectedCategory ? (
            <div className="category-section">
              
              {categories.map((category) => (
                <button
                  key={category._id}
                  className="category-button"
                  onClick={() => handleCategorySelection(category)}
                >
                  {category.Product}
                </button>
              ))}
            </div>
          ) : (
            <div className="filter-section">
              {Object.entries(filterOptions).map(([key, options]) => (
                <div key={key} className="filter-group">
                  <div className="filter-label">{key.charAt(0).toUpperCase() + key.slice(1)}</div>
                  <div className="filter-buttons-grid">
                    {options.map((option) => (
                      <button
                        key={option.label || option}
                        className="filter-button"
                        onClick={() => handleFilterSelection(key, option.label || option)}
                      >
                        {option.label || option}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {books.length > 0 && (
            <div className="book-list">
              {books.map((book) => (
                <div key={book._id} className="book-card">
                  <img src={book.image || "/placeholder.jpg"} alt={book.title} className="book-image" />
                  <div className="book-details">
                    <h5>{book.title}</h5>
                    <p><strong>Author:</strong> {book.author || "N/A"}</p>
                    <p><strong>Genre:</strong> {Array.isArray(book.genres) ? book.genres.join(", ") : book.genres || "N/A"}</p>
                    <p><strong>Language:</strong> {book.language || "N/A"}</p>
                    <p><strong>Price: $</strong>{book.price || "0.00"}</p>
                    <p><strong>Rating:</strong> {"⭐".repeat(Math.round(book.rating || 0))}</p>
                    <button onClick={() => addToBasket(book)} className="add-to-basket">Add to Basket</button>
                  </div>
                </div>
              ))}
            </div>
          )}

<div className="chatbot-footer">
  <div className="input-wrapper">
    <label htmlFor="file-upload" className="upload-icon">📎</label>
    <input
  type="file"
  id="file-upload"
  accept="image/*"
  style={{ display: "none" }}
  onChange={(e) => processImage(e.target.files[0], setBooks)}
/>

<input
  type="text"
  placeholder="Type a book title..."
  value={inputText}
  onChange={(e) => setInputText(e.target.value)}
  onKeyPress={(e) => e.key === 'Enter' && processText(inputText, setBooks)}
/>


   
  </div>
  <button className="send-button" onClick={() => processText(inputText, setBooks)}>
  Send
</button>
<button className="close-chatbot" onClick={toggleChatbot}>✖</button>
</div>



        </div>
      )}
    </div>
  );
};

export default Chatbot;
