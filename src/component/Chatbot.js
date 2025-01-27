import React, { useState, useEffect } from "react";
import { useStateValue } from "./StateProvider";
import { processImage, processText } from "./process";
import axios from "axios";
import "./Chatbot.css";

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [messages, setMessages] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [books, setBooks] = useState([]);
  const [{ basket }, dispatch] = useStateValue([]);
  const [selectedFilters, setSelectedFilters] = useState({});
  const [inputText, setInputText] = useState("");
  const [showDefaultOptions, setShowDefaultOptions] = useState(false); // To toggle default options
  const [showFilters, setShowFilters] = useState(false); // To toggle filters visibility

  const API_URL = "https://aqueous-tiaga-699bfea4a0d8.herokuapp.com";

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      // Display welcome message when chatbot is opened
      setMessages([
        {
          user: "Bot",
          text: "Hey, I am Abbot! How can I help you with the books today?",
        },
      ]);
      fetchCategories();
    }
  }, [isOpen]);

  const toggleChatbot = () => {
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
      setShowFilters(true); // Show filters when Books category is selected
    } else {
      window.location.href = `https://ashim-project.vercel.app/Category/${category.Product}`;
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

    alert(`Added to basket: ${item.title} (Genre: ${item.genre})`);
    dispatch({
      type: "ADD_TO_BASKET",
      item,
    });
  };

  const fetchFilteredBooks = async (filters) => {
    const queryParams = new URLSearchParams(filters).toString();
    try {
      const { data } = await axios.get(
        `${API_URL}/category/Books?${queryParams}`
      );
      setBooks(data);
    } catch (error) {
      console.error("Error fetching books:", error);
    }
  };

  const handleUserMessage = async (text) => {
    // Add user message to the chat
    setMessages((prevMessages) => [...prevMessages, { user: "User", text }]);

    // Process the user message and get bot response
    const botResponse = await getBotResponse(text);
    setMessages((prevMessages) => [
      ...prevMessages,
      { user: "Bot", text: botResponse },
    ]);

    // Clear input after sending
    setInputText("");
  };

  const getBotResponse = async (userMessage) => {
    // Simple response logic based on user input
    if (
      userMessage.toLowerCase().includes("hello") ||
      userMessage.toLowerCase().includes("hi")
    ) {
      return "Hello! How can I assist you with books today?";
    } else if (userMessage.toLowerCase().includes("recommend")) {
      return "Sure! What genre are you interested in? (e.g., Fiction, Non-fiction, Travel)";
    } else if (userMessage.toLowerCase().includes("show categories")) {
      setShowDefaultOptions(true); // Show default categories
      return "Here are the available categories:";
    } else if (userMessage.toLowerCase().includes("hide categories")) {
      setShowDefaultOptions(false); // Hide default categories
      return "Categories are now hidden. How else can I assist you?";
    } else if (userMessage.toLowerCase().includes("hide filters")) {
      setShowFilters(false); // Hide filters
      return "Filters are now hidden. How else can I assist you?";
    } else {
      return "I'm here to help you with books. Could you please provide more details?";
    }
  };

  const filterOptions = {
    genre: [
      "Fiction",
      "Non-fiction",
      "Travel",
      "Sports",
      "Business",
      "Science Fiction",
      "History",
      "Finance",
    ],
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
    <div
      style={{ position: "fixed", bottom: "20px", right: "20px", zIndex: 1000 }}
    >
      {!isOpen ? (
        <button
          onClick={toggleChatbot}
          style={{
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "50%",
            width: "60px",
            height: "60px",
            fontSize: "24px",
            cursor: "pointer",
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
          }}
        >
          🤖
        </button>
      ) : (
        <div
          style={{
            width: "350px",
            backgroundColor: "#fff",
            borderRadius: "10px",
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
            display: "flex",
            flexDirection: "column",
            maxHeight: "500px",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              padding: "10px",
              backgroundColor: "#007bff",
              color: "white",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span>Abbot - Book Assistant</span>
            <button
              onClick={toggleChatbot}
              style={{
                backgroundColor: "transparent",
                border: "none",
                color: "white",
                fontSize: "16px",
                cursor: "pointer",
              }}
            >
              ✖
            </button>
          </div>

          <div
            style={{
              flex: 1,
              padding: "10px",
              overflowY: "auto",
              borderBottom: "1px solid #ddd",
            }}
          >
            {messages.map((message, index) => (
              <div
                key={index}
                style={{
                  marginBottom: "10px",
                  textAlign: message.user === "User" ? "right" : "left",
                }}
              >
                <div
                  style={{
                    display: "inline-block",
                    padding: "8px 12px",
                    borderRadius: "10px",
                    backgroundColor:
                      message.user === "User" ? "#007bff" : "#f1f1f1",
                    color: message.user === "User" ? "white" : "black",
                    maxWidth: "80%",
                  }}
                >
                  <strong>{message.user}:</strong> {message.text}
                </div>
              </div>
            ))}
          </div>

          {showDefaultOptions && (
            <div style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>
              {!selectedCategory ? (
                <div>
                  <h4>Categories</h4>
                  {categories.map((category) => (
                    <button
                      key={category._id}
                      onClick={() => handleCategorySelection(category)}
                      style={{
                        display: "block",
                        width: "100%",
                        padding: "8px",
                        margin: "5px 0",
                        backgroundColor: "#f1f1f1",
                        border: "none",
                        borderRadius: "5px",
                        cursor: "pointer",
                      }}
                    >
                      {category.Product}
                    </button>
                  ))}
                </div>
              ) : (
                <div>
                  <h4>Filters</h4>
                  {showFilters && (
                    <>
                      {Object.entries(filterOptions).map(([key, options]) => (
                        <div key={key}>
                          <div style={{ fontWeight: "bold", margin: "5px 0" }}>
                            {key.charAt(0).toUpperCase() + key.slice(1)}
                          </div>
                          <div
                            style={{
                              display: "flex",
                              flexWrap: "wrap",
                              gap: "5px",
                            }}
                          >
                            {options.map((option) => (
                              <button
                                key={option.label || option}
                                onClick={() =>
                                  handleFilterSelection(
                                    key,
                                    option.label || option
                                  )
                                }
                                style={{
                                  padding: "5px 10px",
                                  backgroundColor: "#f1f1f1",
                                  border: "none",
                                  borderRadius: "5px",
                                  cursor: "pointer",
                                }}
                              >
                                {option.label || option}
                              </button>
                            ))}
                          </div>
                        </div>
                      ))}
                      <button
                        onClick={() => setShowFilters(false)}
                        style={{
                          marginTop: "10px",
                          padding: "8px 12px",
                          backgroundColor: "#007bff",
                          color: "white",
                          border: "none",
                          borderRadius: "5px",
                          cursor: "pointer",
                        }}
                      >
                        Hide Filters
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          )}

          <div style={{ padding: "10px", display: "flex", gap: "10px" }}>
            <input
              type="text"
              placeholder="Type a message..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={(e) =>
                e.key === "Enter" && handleUserMessage(inputText)
              }
              style={{
                flex: 1,
                padding: "8px",
                border: "1px solid #ddd",
                borderRadius: "5px",
              }}
            />
            <button
              onClick={() => handleUserMessage(inputText)}
              style={{
                padding: "8px 12px",
                backgroundColor: "#007bff",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
