import React from "react";
import "./index.css";
import ReactDOM from "react-dom/client"; // Use 'react-dom/client' for React 18+
import Routing from "./component/Routing";
import * as serviceWorker from "./component/serviceWorker";
import reducer, { initialState } from "./component/reducer";
import { StateProvider } from "./component/StateProvider";

// Create the root element for React
const root = ReactDOM.createRoot(document.getElementById("root"));

// Render the app
root.render(
  <React.StrictMode>
    <StateProvider initialState={initialState} reducer={reducer}>
      <Routing />
    </StateProvider>
  </React.StrictMode>
);

// Service worker configuration
serviceWorker.unregister();

