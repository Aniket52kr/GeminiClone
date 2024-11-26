import "./main.css";
import { IoCodeSlashSharp } from "react-icons/io5";
import { FaRegCompass } from "react-icons/fa";
import { FaPencilAlt } from "react-icons/fa";
import { MdFlight } from "react-icons/md";
import { FiSend } from "react-icons/fi";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchGeminiResult, getAllData, getResult, storeResult, fetchUser } from "../../Redux/Slice/Reducer"; // Ensure fetchUser is imported
import { AppDispatch, RootType } from "../../Redux/Strore";
import Loader from "../Loader/Loader";
import { useNavigate } from "react-router-dom";

const Main = () => {
  const [prompt, setPrompt] = useState<string>("");
  const [heading, setHeading] = useState<string>("");
  const [hideBtn, setHideBtn] = useState<boolean>(false);
  const navigate = useNavigate();

  const { loading, result, showResult } = useSelector(
    (state: RootType) => state.geminiSlice
  );
  const { oneUser, loading: userLoading } = useSelector(
    (state: RootType) => state.fetchUserSlice
  );

  const dispatch = useDispatch<AppDispatch>();

  // Fetch user data when the component mounts
  useEffect(() => {
    dispatch(fetchUser());
  }, [dispatch]);

  const promptHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setHeading(prompt);
    await dispatch(fetchGeminiResult({ prompt }));
    dispatch(getResult());
    
    if (oneUser?.uid) { // Ensure user ID is available
      await dispatch(getAllData({ user: oneUser.uid }));
    } else {
      console.error("User ID is not available."); // Log an error if user ID is missing
    }

    setPrompt("");
  };

  const hideBtnHandler = () => {
    setHideBtn((prev) => !prev);
  };

  const logoutHandler = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  useEffect(() => {
    if (result && showResult) {
      if (oneUser?.uid) { // Check if user ID is available before storing
        dispatch(storeResult({ heading: heading!, data: result!, user: oneUser.uid }));
      } else {
        console.error("User ID is not available. Cannot store result."); // Log an error if user ID is missing
      }
    }
  }, [result, showResult, oneUser, heading, dispatch]);

  return (
    <div className="main">
      {userLoading ? (
        <Loader />
      ) : (
        <>
          <div className="main_head">
            <p><b>Gemini</b></p>
            <img
              src={oneUser?.photo}
              alt="photo"
              className="profile"
              onClick={hideBtnHandler}
            />
          </div>
          {hideBtn && (
            <div className="logout" onClick={logoutHandler}>
              <button>Logout</button>
            </div>
          )}

          {!showResult && !loading && (
            <div className="main_mid">
              <div className="title">
                <p className="title_para">
                  <span>Hello, Developer</span>
                </p>
                <p className="title_para">How can I help you today?</p>
              </div>
              <div className="box">
                <div>
                  <p>Improve the readability of the following code</p>
                  <IoCodeSlashSharp />
                </div>
                <div>
                  <p>Give me tips to help care for a tricky plant</p>
                  <FaRegCompass />
                </div>
                <div>
                  <p>Help me craft a text response to my friend who is stressed at work</p>
                  <FaPencilAlt />
                </div>
                <div>
                  <p>Show me flights to Tokyo and give me ideas of things to do. How about Seoul too?</p>
                  <MdFlight />
                </div>
              </div>
            </div>
          )}

          <div className="result">
            {heading && (
              <div className="result_title">
                <img src={oneUser?.photo} className="profile" alt="User Profile" />
                <p>{heading}</p>
              </div>
            )}

            <div className="result_para">
              {heading && <img src="geminiIcon.jpg" alt="gemini" />}

              {loading ? (
                <Loader />
              ) : (
                showResult && (
                  <div dangerouslySetInnerHTML={{ __html: result! }} />
                )
              )}
            </div>
          </div>

          <div className="main_bottom">
            <form onSubmit={promptHandler}>
              <input
                name="prompt" // Fixed the name from 'promp' to 'prompt'
                placeholder="Enter a prompt here"
                onChange={(e) => setPrompt(e.target.value)}
                value={prompt}
              />
              <button type="submit">
                <FiSend className="submit" />
              </button>
            </form>
            <p>
              Gemini may display inaccurate info, including about people, so double-check its responses. <a>Your privacy and Gemini Apps</a>
            </p>
          </div>
        </>
      )}
    </div>
  );
};

export default Main;
