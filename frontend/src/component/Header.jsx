import { Link } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import "./Header.css";

export default function Header({ isProfile, setIsBlur, setIsWheel }) {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const popupRef = useRef(null);
  const profileButtonRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        popupRef.current &&
        !popupRef.current.contains(event.target) &&
        profileButtonRef.current &&
        !profileButtonRef.current.contains(event.target)
      ) {
        setIsPopupOpen(false);
        setIsBlur(true);
      }
    };

    const handleEscapeKey = (event) => {
      if (event.key === "Escape" && isPopupOpen) {
        setIsPopupOpen(false);
        setIsBlur((prev) => !prev);
      }
    };

    if (isPopupOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscapeKey);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, [isPopupOpen]);

  const togglePopup = () => {
    setIsPopupOpen(true);
    setIsBlur(false);
  };

  const closePopup = () => {
    setIsPopupOpen(false);
    setIsBlur(true);
  };

  const handleWheelToggle = () => {
    setIsWheel((prev) => !prev);
  };
  return (
    <>
      <div className="header-main">
        <div
          onClick={handleWheelToggle}
          className="O"
          title="Wheel toggle hide/show"
        >
          <div class="half-circle"></div>
        </div>
        <div className="header-container">
          <Link to="/">Home</Link>
          <Link to="/login">Log in</Link>
          <Link to="/register">Register</Link>
          {isProfile && (
            <Link ref={profileButtonRef} onClick={togglePopup}>
              Profile
            </Link>
          )}
          {isPopupOpen && (
            <div ref={popupRef} className="popup-border popup-container">
              <div className="popup">
                <h2>Profile Details</h2>
                <p>Your profile content goes here...</p>
              </div>
              <button className="button-x" onClick={closePopup}>
                X
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
