// src/Router.tsx
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login.js";
import Signup from "./pages/Signup.js";
import App from "./App";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" />;
};

function AppRoutes() {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <PrivateRoute>
              <App />
            </PrivateRoute>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </Router>
  );
}

export default AppRoutes;
