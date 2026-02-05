import { useEffect, useRef } from "react";
import Header from "../component/Header.jsx";
import { getHomeData } from "../api/homeApi.js";
import { useState } from "react";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

export default function Home() {
  const [detailCourse, setDetailCourse] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const effectRan = useRef(false); // Better name
  const [isProfile, setIsProfile] = useState(false);
  const [isBlur, setIsBlur] = useState(true);
  const [isWheel, setIsWheel] = useState(true);

  async function getData() {
    const toastId = toast.loading("Loading...");
    try {
      setIsLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 2000));
      const data = await getHomeData();
      setDetailCourse(true);
      setIsProfile(true);
      toast.update(toastId, {
        render: data.message,
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });
    } catch (error) {
      setIsProfile(false);
      toast.update(toastId, {
        render: error?.message || "Failed to load data",
        type: "error",
        isLoading: false,
        autoClose: 4000,
      });
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    // Prevent double execution
    if (effectRan.current === false) {
      getData();
      effectRan.current = true;
    }
  }, []);

  return (
    <div className="main-container">
      {isWheel && (
        <video
          className="video-content"
          autoPlay
          muted
          loop
          playsInline
          src="./frontEndBackEnd.mp4"
        />
      )}
      <div className="content-container">
        <div className="home-container">
          <div>
            <Header
              isProfile={isProfile}
              setIsBlur={setIsBlur}
              setIsWheel={setIsWheel}
            />
          </div>
          {isBlur && (
            <div>
              <p>This is Home page</p>
              <p>
                If you want more details about course you have to log in first.
                Thank you.
              </p>
              {!detailCourse && <Link to={"/login"}>here</Link>}
              {isLoading && <p>Loading...</p>}

              {detailCourse && (
                <div>
                  <p>More Details of Course</p>
                  <p>This is full details of course</p>
                  <p>
                    Learn Full Stack is so important more than only satisfy on
                    frontend. If you only learn frontend you must know how to
                    application looks like but backend give you full path of
                    knowledge about how to frontend act to backend, wondering
                    thing is fronted calls to backend, forwarding backend to
                    frontend with useful data and credential like cookie
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
