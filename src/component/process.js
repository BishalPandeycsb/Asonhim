import axios from "axios";
import Tesseract from "tesseract.js";

const API_URL = "https://aqueous-tiaga-699bfea4a0d8.herokuapp.com/category/Books";

/**
 * Process uploaded image and compare directly with API book images.
 */
export const processImage = async (file, setBooks) => {
  if (!file) {
    console.error("No file selected.");
    return;
  }

  // Read uploaded image and convert to Base64
  const reader = new FileReader();
  reader.readAsDataURL(file);

  reader.onload = async () => {
    const uploadedImageBase64 = await getBase64FromImage(reader.result);
    console.log("Uploaded image processed to Base64.");

    try {
      // Fetch book data from API
      const response = await axios.get(API_URL);
      const books = response.data;
      console.log("Books retrieved from API:", books);

      let matchedBook = null;

      // Compare uploaded image with API book images
      for (let book of books) {
        const bookImageBase64 = await getBase64FromUrl(book.image);
        if (compareImages(uploadedImageBase64, bookImageBase64)) {
          matchedBook = book;
          break;
        }
      }

      if (matchedBook) {
        console.log("Matching book found by image:", matchedBook);
        setBooks([matchedBook]);
      } else {
        console.log("No matching book found by image. Trying OCR for title matching...");
        extractTitleFromImage(file, books, setBooks);
      }

    } catch (error) {
      console.error("Error processing image:", error);
      setBooks([{ title: "Error processing image", author: "N/A", price: "N/A", image: "/error.jpg" }]);
    }
  };
};

/**
 * Extract book title from the uploaded image using OCR and search in API.
 */
const extractTitleFromImage = (file, books, setBooks) => {
  Tesseract.recognize(
    file,
    "eng",
    { logger: m => console.log(`OCR Progress: ${m.status} ${Math.floor(m.progress * 100)}%`) }
  ).then(({ data: { text } }) => {
    console.log("Extracted text from image:", text);

    // Clean and standardize the text
    const cleanedInput = text.toLowerCase().replace(/[^a-z0-9\s]/g, "").trim();

    // Try to match the cleaned text with book titles
    const matchedBook = books.find(book =>
      book.title.toLowerCase().replace(/[^a-z0-9\s]/g, "").includes(cleanedInput)
    );

    if (matchedBook) {
      console.log("Matching book found by title:", matchedBook);
      setBooks([matchedBook]);
    } else {
      console.log("No matching book found by title.");
      setBooks([{ title: "No matching book found", author: "N/A", price: "N/A", image: "/placeholder.jpg" }]);
    }
  }).catch(err => {
    console.error("OCR Error:", err);
    setBooks([{ title: "OCR failed", author: "N/A", price: "N/A", image: "/error.jpg" }]);
  });
};

/**
 * Convert an image URL to Base64 for comparison.
 */
const getBase64FromUrl = async (imageUrl) => {
  try {
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result.split(",")[1]);  // Extract Base64
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error("Error fetching image from URL:", error);
    return null;
  }
};

/**
 * Convert a data URL to Base64 string.
 */
const getBase64FromImage = (dataUrl) => {
  return dataUrl.split(",")[1];  // Extract the base64 part
};

/**
 * Compare two images by their Base64 data.
 */
const compareImages = (base64Image1, base64Image2) => {
  if (!base64Image1 || !base64Image2) return false;
  return base64Image1.substring(0, 1000) === base64Image2.substring(0, 1000);
};

/**
 * Process user text input and search for books by title.
 */
export const processText = async (text, setBooks) => {
  if (!text || text.trim() === "") {
    console.error("Empty input received.");
    return;
  }

  try {
    // Fetch book data from API
    const response = await axios.get(API_URL);
    const books = response.data;
    console.log("Books retrieved from API:", books);

    // Normalize text input
    const cleanedInput = text.toLowerCase().trim();

    // Search for books by matching title
    const matchedBooks = books.filter(book =>
      book.title.toLowerCase().includes(cleanedInput)
    );

    if (matchedBooks.length > 0) {
      console.log("Matching books found:", matchedBooks);
      setBooks(matchedBooks);
    } else {
      console.log("No books found for:", text);
      setBooks([{ title: "No matching book found", author: "N/A", price: "N/A", image: "/placeholder.jpg" }]);
    }
  } catch (error) {
    console.error("Error searching books:", error);
    setBooks([{ title: "Error fetching books", author: "N/A", price: "N/A", image: "/error.jpg" }]);
  }
};
