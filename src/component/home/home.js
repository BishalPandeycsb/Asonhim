import React from "react";
import "./home.css";
import Footer from '../Footer'
import Carousel from "react-bootstrap/Carousel";
import Quicksearch from "./Quicksearch";


function Home() {
  return (
    
    <div className="container">
      <div className="home__image">
        
          <Carousel fade>
            <Carousel.Item>
          
              <img
                className="d-block w-100"
                src={`./images/1.jpg`}
                alt="First slide"
              />

              <Carousel.Caption>
                <h3>Ashimon </h3>
                <p>E-commerce website</p>
              </Carousel.Caption>
              </Carousel.Item>
              <Carousel.Item>
              <img
                className="d-block w-100"
                src={`./images/2.jpg`}
                alt="First slide"
              />

              <Carousel.Caption>
                <h3>Ashimon </h3>
                <p>E-commerce website</p>
              </Carousel.Caption>
            </Carousel.Item>
            <Carousel.Item>
              <img
                className="d-block w-100"
                src={`./images/3.jpg`}
                alt="First slide"
              />

              <Carousel.Caption>
                <h3>Ashimon </h3>
                <p>E-commerce website</p>
              </Carousel.Caption>
            </Carousel.Item>
            <Carousel.Item>
              <img
                className="d-block w-100"
                src="https://images-eu.ssl-images-amazon.com/images/G/31/AmazonVideo/2021/X-site/Multititle/May/M17/reg/3000x1200_Hero-Tall_JPN._CB667961979_.jpg"
                alt="Prime Customers"
              />

              <Carousel.Caption>
                <h3>Ashimon </h3>
                <p>E-commerce website</p>
              </Carousel.Caption>
            </Carousel.Item>
            
            
          </Carousel>
        
      </div>
       
      <div className="home__row" >
      <Quicksearch/>
      </div>
      <div className="home_bottom">
       <Footer/> 
      </div>
    </div>
  );
}

export default Home;
