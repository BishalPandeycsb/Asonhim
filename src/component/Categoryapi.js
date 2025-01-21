import React, { Component } from "react";
import CategoryingD from "./Categoryingd";

class Categoryapi extends Component {
  constructor(props) {
    super(props);
    this.state = {
      categoryData: [], // Use an array to store category data
    };
  }

  componentDidMount() {
    this.loadCategoryData();
  }

  componentDidUpdate(prevProps) {
    // Check if the category in the URL has changed
    if (prevProps.params.type !== this.props.params.type) {
      this.loadCategoryData();
    }
  }

  loadCategoryData() {
    const { type } = this.props.params; // Access category from props
    console.log("Fetching category data for:", type);
  
    fetch(`https://aqueous-tiaga-699bfea4a0d8.herokuapp.com/category/${type}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        console.log("Fetched data:-->", data); // Log fetched data
        this.setState({ categoryData: data });
      })
      .catch((err) => {
        console.error("Error fetching data:", err);
        this.setState({ categoryData: [] }); // Clear state on error
      });
  }
  

  render() {
    console.log("Passing data to CategoryingD:", this.state.categoryData);
    return (
      <div>
        <CategoryingD d={this.state.categoryData} />
      </div>
    );
  }
  
}

export default Categoryapi;
