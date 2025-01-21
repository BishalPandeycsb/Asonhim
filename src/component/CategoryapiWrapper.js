import React from "react";
import { useParams } from "react-router-dom";
import Categoryapi from "./Categoryapi";

const CategoryapiWrapper = (props) => {
  const params = useParams(); // Access route parameters
  return <Categoryapi {...props} params={params} />;
};

export default CategoryapiWrapper; // Correctly export the component
