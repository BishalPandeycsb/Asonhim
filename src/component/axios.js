import axios from "axios";

const instance = axios.create({
    baseURL: "https://us-central1-ashimon-7d910.cloudfunctions.net/api", // Your Firebase function URL
});

export default instance;
//http://127.0.0.1:5001/ashimon-7d910/us-central1/api
