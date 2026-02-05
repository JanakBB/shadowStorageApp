import Header from "../component/Header.jsx";
import { useState } from "react";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../api/userApi.js";
import { GoogleLogin } from "@react-oauth/google";
import { loginWithGoogle } from "../api/loginWithGoogleApi.js";

export default function LogIn() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [passwordType, setPasswordType] = useState("password");
  const [isWheel, setIsWheel] = useState(true);

  const navigate = useNavigate();

  function handleEmailChange(e) {
    setFormData((prev) => ({ ...prev, email: e.target.value }));
  }

  function handlePasswordChange(e) {
    setFormData((prev) => ({ ...prev, password: e.target.value }));
  }

  function handlePasswordType() {
    if (passwordType === "password") {
      setPasswordType("text");
    } else {
      setPasswordType("password");
    }
  }

  async function handleFormSubmit(e) {
    e.preventDefault();

    const toastId = toast.loading("Logging in...");
    setLoading(true);

    try {
      const loginResponse = await login(formData);
      toast.update(toastId, {
        render: loginResponse.message,
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });
      setTimeout(() => navigate("/"), 3000);
    } catch (error) {
      toast.update(toastId, {
        render: error?.message || "Failed to log in",
        type: "error",
        isLoading: false,
        autoClose: 4000,
      });
    } finally {
      setLoading(false);
    }
  }

  const handleGoogleSuccess = async (credentialResponse) => {
    const toastId = toast.loading("Login with google...");
    setLoading(true);
    try {
      const data = await loginWithGoogle(credentialResponse.credential);
      toast.update(toastId, {
        render: data.message,
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });
      setTimeout(() => navigate("/"), 3000);
    } catch (error) {
      toast.update(toastId, {
        render: error?.message || "Failed to login with google",
        type: "error",
        isLoading: false,
        autoClose: 4000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleError = () => {
    toast.loading("Google authentication failed.");
  };

  return (
    <div className="main-container">
      {isWheel && (
        <video
          className="video-content"
          autoPlay
          muted
          loop
          playsInline
          src="./fundamental.mp4"
        />
      )}
      <div className="content-container">
        <div>
          <Header setIsWheel={setIsWheel} />
        </div>
        <p>This is Log in page for learning more 📖</p>
        <form onSubmit={handleFormSubmit}>
          <fieldset>
            <legend>Personalia:</legend>
            <div>
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Enter your email"
                onChange={handleEmailChange}
                value={formData.email}
              />
            </div>
            <div>
              <label htmlFor="password">Password</label>
              <input
                type={passwordType}
                id="password"
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handlePasswordChange}
              />
              <button type="button" onClick={handlePasswordType}>
                {passwordType === "password"
                  ? "Show password"
                  : "Hide password"}
              </button>
              <Link to="/forget-password">Forget password?</Link>
            </div>
            <button type="submit" disabled={formData.password.length < 6}>
              {loading ? "Logging in..." : "Log in"}
            </button>
          </fieldset>
        </form>
        <fieldset>
          <legend>Or continue with</legend>
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleError}
            type="icon"
            size="large"
          />
        </fieldset>
        <div>
          You have not register account.{" "}
          <Link to="/register">Register here</Link>
        </div>
      </div>
    </div>
  );
}
