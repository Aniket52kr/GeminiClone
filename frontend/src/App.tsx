import Slider from "./Components/Slider";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./app.css";
import Main from "./Components/Main/Main";
import Loader from "./Components/Loader/Loader";
import LoginPage from "./Components/Login/Login";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchSingleUser } from "./Redux/Slice/User";
import { AppDispatch, RootType } from "./Redux/Strore";
import PrevData from "./Components/PrevData/PrevData";

const App = () => {
  const { oneUser } = useSelector((state: RootType) => state.fetchUserSlice);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        dispatch(fetchSingleUser({ uid: JSON.parse(token) }));
      } catch (error) {
        console.error("Failed to fetch user:", error);
      }
    }
  }, [dispatch]);

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            oneUser ? 
              <div className="app">
                <Slider />
                <Main />
              </div>
             : (
              <LoginPage />
            )
          }
        />

        <Route 
          path="/loader" 
          element={
            <Loader />
          } 
        />

        <Route 
          path="/login" 
          element={
            <LoginPage />
          } 
        />

        <Route
          path="/:id"
          element={
            <div className="app">
              <Slider />
              <PrevData />
            </div>
          }
        />

        <Route
          path="/new-chat"
          element={
            <div className="app">
              <Slider />
              <Main/>
            </div>
          }
        />
      </Routes>
      {/* {error && <div className="error">{error}</div>} */}
    </Router>
  );
};

export default App;
