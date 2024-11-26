import "./slider.css";
import { FaBars } from "react-icons/fa6";
import { FiPlus } from "react-icons/fi";
import { RiDeleteBin6Fill } from "react-icons/ri";
import { Link, useNavigate } from "react-router-dom";
import { LuMessageSquare } from "react-icons/lu";
import { FaStar } from "react-icons/fa6";
import { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootType } from "../Redux/Strore";
import { getAllData } from "../Redux/Slice/Reducer"; // Ensure this is the correct path



const Slider = () => {
  const [sliderClose, setSliderClose] = useState<boolean>(true);
  const { oneUser } = useSelector((state: RootType) => state.fetchUserSlice);
  const { loading, allData } = useSelector(
    (state: RootType) => state.geminiSlice
  );

  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const sliderHandler = () => {
    setSliderClose((prev) => !prev);
  };

  // Memoized fetchData function
  const fetchData = useCallback(
    async (userUid: string) => {
      try {
        await dispatch(getAllData({ user: userUid }));
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    },
    [dispatch]
  );

  useEffect(() => {
    if (oneUser?.uid) {
      fetchData(oneUser.uid); // Call the function
    }
  }, [oneUser, fetchData]); // Include fetchData here

  const newChatHandler = () => {
    navigate("/new-chat"); // Navigate to the new chat page
  };

  return (
    <>
      <FaBars className="sideIcon" onClick={sliderHandler} />
      {!sliderClose && (
        <div className="slider">
          <div onClick={newChatHandler} className="new_chat_btn">
            <p>New Chat</p>
            <FiPlus />
          </div>

          <div className="slider_tasks">
            <p>Recent</p>
            <div className="tasks">
              {!loading && allData && allData.results?.length ? (
                allData.results.map((v) => (
                  <Link to={`/${v._id}`} key={v._id}>
                    <LuMessageSquare />
                    <span>{v.heading.slice(0, 40)}</span>
                    <RiDeleteBin6Fill />
                  </Link>
                ))
              ) : (
                <p>No recent chats available.</p>
              )}
            </div>
          </div>

          <div className="slider_bottom">
            <button>
              <FaStar />
              <p> Upgrade to Gemini Advance</p>
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Slider;
