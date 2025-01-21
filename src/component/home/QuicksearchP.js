import React from 'react';
import './quicksearch.css';
import {Link} from 'react-router-dom';



const QuicksearchP = (props) => {
    

    const listcategories = ({data}) => {
        console.log("mealdata esto xa ki :",data);
        if(data){
            return data.map((item) => {
                console.log("nieb:",item);
                
                   
                return(
                      
                    <div class="col-lg-6  col-xs-12">
                      <Link to={`/Category/${item.Product}`} >
                    
                      <div class="tilecontainer">
                          <div class="tileComponent1">
                          <img src={item.ImageLink} alt={item.Product} className="blockimage" />
                          </div>
                          <div class="tileComponent2">
                              <div class="componentHeading">
                                 <h3><center>{item.Product.toUpperCase()}</center></h3> 
                              </div>
                              <div class="componentSubHeading">
                                  <center> some perfect and exclusive {item.Product} option</center>
                              </div>
                          </div>
                      </div>
                  
                 
                      
                      </Link>
                      </div>
                       
                    
                        
                        )
            })
        }
    }

    return(
        <div class="quickSearchContainer">
            <p class="quickSearchHeading">
                Quick Searches
            </p>
            <p class="quickSearchSubHeading">
                Discover your desired Products
            </p>
            <div className="row">
                {listcategories(props)}
            </div>
           
        </div>
    )
}

export default QuicksearchP