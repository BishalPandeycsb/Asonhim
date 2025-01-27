import React, { useState, useEffect, useRef } from "react";
import { useStateValue } from "./StateProvider";
import axios from "axios";
import {
  Bot,
  X,
  Send,
  ChevronUp,
  ChevronDown,
  Search,
  BookOpen,
} from "lucide-react";

const EnhancedChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [books, setBooks] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [showCategories, setShowCategories] = useState(false);
  const messagesEndRef = useRef(null);
  const [{ basket }, dispatch] = useStateValue();

  const API_URL = "https://aqueous-tiaga-699bfea4a0d8.herokuapp.com";

  const suggestions = [
    "Show me popular books",
    "I need book recommendations",
    "What are the best-selling books?",
    "Show categories",
    "Find books by genre",
    "Help me find a book",
  ];

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const welcomeMessage = {
        type: "bot",
        content:
          "Hello! I'm your personal book assistant. How can I help you today?",
        timestamp: new Date().toISOString(),
      };
      setMessages([welcomeMessage]);
      fetchCategories();
    }
  }, [isOpen]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchCategories = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/`);
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const simulateTyping = async (callback) => {
    setIsTyping(true);
    await new Promise((resolve) =>
      setTimeout(resolve, 1000 + Math.random() * 1000)
    );
    setIsTyping(false);
    callback();
  };

  const handleUserMessage = async (text) => {
    const userMessage = {
      type: "user",
      content: text,
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInputText("");
    setShowSuggestions(false);

    simulateTyping(() => processUserMessage(text));
  };

  const processUserMessage = async (text) => {
    const lowerText = text.toLowerCase();

    if (lowerText.includes("popular") || lowerText.includes("best-selling")) {
      const response = "Here are some popular books you might enjoy:";
      await fetchBooks({ sort: "rating", order: "desc", limit: 5 });
      addBotMessage(response);
    } else if (
      lowerText.includes("recommend") ||
      lowerText.includes("suggestion")
    ) {
      addBotMessage(
        "I'd be happy to recommend some books! What genres interest you? (Fiction, Non-fiction, Mystery, etc.)"
      );
      setShowSuggestions(true);
    } else if (
      lowerText.includes("category") ||
      lowerText.includes("categories")
    ) {
      setShowCategories(true);
      addBotMessage(
        "Here are all our categories. Click on any category to explore:"
      );
    } else if (lowerText.includes("find")) {
      addBotMessage(
        "I can help you find books! Would you like to search by genre, author, or browse our recommendations?"
      );
      setShowSuggestions(true);
    } else if (lowerText.includes("help")) {
      addBotMessage(
        "I can help you with:\n- Finding specific books\n- Book recommendations\n- Browsing categories\n- Viewing popular books\n- Finding books by genre\nWhat would you like to do?"
      );
    } else {
      addBotMessage(
        "I'm not quite sure what you're looking for. Would you like to:\n1. Browse categories\n2. Get book recommendations\n3. Search for specific books"
      );
    }
  };

  const addBotMessage = (content) => {
    const botMessage = {
      type: "bot",
      content,
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, botMessage]);
  };

  const fetchBooks = async (params = {}) => {
    try {
      const { data } = await axios.get(`${API_URL}/category/Books`, { params });
      setBooks(data);
    } catch (error) {
      console.error("Error fetching books:", error);
    }
  };

  const addToBasket = (book) => {
    dispatch({
      type: "ADD_TO_BASKET",
      item: {
        id: book._id,
        title: book.title,
        image: book.image || "https://via.placeholder.com/150",
        price: book.price || "N/A",
        rating: book.rating || 0,
        genre: book.genres?.[0] || "Unknown",
      },
    });
    addBotMessage(
      `Great choice! "${book.title}" has been added to your basket. Would you like more recommendations?`
    );
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    addBotMessage(
      `You've selected ${category.Product}. Let me show you some items from this category.`
    );
    fetchBooks({ category: category.Product });
    setShowCategories(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-blue-500 hover:bg-blue-600 text-white rounded-full p-4 shadow-lg transition-transform hover:scale-110"
        >
          <Bot size={24} />
        </button>
      ) : (
        <div className="bg-white rounded-lg shadow-xl w-96 max-h-[600px] flex flex-col">
          <div className="bg-blue-500 p-4 rounded-t-lg flex justify-between items-center">
            <div className="flex items-center gap-2 text-white">
              <Bot size={24} />
              <span className="font-semibold">Book Assistant</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:bg-blue-600 rounded-full p-1"
            >
              <X size={20} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.type === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    message.type === "user"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {message.content}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex gap-2 text-gray-500">
                <div className="animate-bounce">●</div>
                <div className="animate-bounce delay-100">●</div>
                <div className="animate-bounce delay-200">●</div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {showCategories && (
            <div className="border-t border-gray-200 max-h-48 overflow-y-auto">
              <div className="p-2 grid grid-cols-2 gap-2">
                {categories.map((category) => (
                  <button
                    key={category._id}
                    onClick={() => handleCategorySelect(category)}
                    className="bg-gray-50 hover:bg-gray-100 text-gray-800 rounded-lg p-3 text-sm font-medium transition-colors duration-200 flex items-center justify-center gap-2"
                  >
                    <BookOpen size={16} />
                    {category.Product}
                  </button>
                ))}
              </div>
            </div>
          )}

          {showSuggestions && (
            <div className="p-2 border-t max-h-32 overflow-y-auto">
              <div className="flex flex-wrap gap-2">
                {suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => handleUserMessage(suggestion)}
                    className="bg-gray-100 hover:bg-gray-200 rounded-full px-3 py-1 text-sm"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}

          {books.length > 0 && (
            <div className="border-t p-2 max-h-48 overflow-y-auto">
              {books.map((book) => (
                <div
                  key={book._id}
                  className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded"
                >
                  <BookOpen size={20} className="text-blue-500" />
                  <div className="flex-1">
                    <div className="font-medium">{book.title}</div>
                    <div className="text-sm text-gray-500">
                      {book.genres?.[0]}
                    </div>
                  </div>
                  <button
                    onClick={() => addToBasket(book)}
                    className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                  >
                    Add
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="p-4 border-t">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={(e) =>
                  e.key === "Enter" && handleUserMessage(inputText)
                }
                placeholder="Type a message..."
                className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={() => handleUserMessage(inputText)}
                disabled={!inputText.trim()}
                className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 disabled:opacity-50"
              >
                <Send size={20} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnhancedChatbot;
