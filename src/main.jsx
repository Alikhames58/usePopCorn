import { createRoot } from "react-dom/client";
import StarRating from "./StarRating";
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById("root")).render(
  <>
  <App />
    {/* <StarRating
      maxRating={5}
      message={["Terrible", "Bad", "Okay", "Good", "Amazing"]}
    />
    <StarRating
      defaultRating={3}
      color="red"
      message={["ali", "ahmed", "mahmoud", "mohamed", "khames"]}
    /> */}
  </>
);
