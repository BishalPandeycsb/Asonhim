import React, { Component } from "react";
import QuickSearchP from "./QuicksearchP";


const Curl = "https://aqueous-tiaga-699bfea4a0d8.herokuapp.com/";
class Quicksearch extends Component {
  constructor() {
    super();
    this.state = {
      categories:''
    };
    
  }
 

  render() {
        
         console.log("categories ko type yo ho :",this.state.categories)
         
    return (
      <QuickSearchP data={this.state.categories}/>
    )
    }
      
      
       
    
  
   componentDidMount() {
     fetch(Curl, {
    method: "GET",
    headers: {
      "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET,HEAD,OPTIONS,POST,PUT",
      },
   })
      .then((res) => res.json())
     .then((data) => {console.log("data kina is:",data)
        this.setState({ categories: data });
     });
 }


}

export default Quicksearch;
