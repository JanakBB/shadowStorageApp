import Header from "../component/Header.jsx";
import { useState } from "react";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { resetPassword } from "../api/userApi.js";
import { GoogleLogin } from "@react-oauth/google";
import { loginWithGoogle } from "../api/loginWithGoogleApi.js";

export default function ForgetPassword() {
  const [formData, setFormData] = useState({
    email: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [newPasswordType, setNewPasswordType] = useState("password");
  const [confirmPasswordType, setConfirmPasswordType] = useState("password");

  const navigate = useNavigate();

  function handleEmailChange(e) {
    setFormData((prev) => ({ ...prev, email: e.target.value }));
  }

  function handleNewPasswordChange(e) {
    setFormData((prev) => ({ ...prev, newPassword: e.target.value }));
  }
  function handleConfirmPasswordChange(e) {
    setFormData((prev) => ({ ...prev, confirmPassword: e.target.value }));
  }

  function handleNewPasswordType() {
    if (newPasswordType === "password") {
      setNewPasswordType("text");
    } else {
      setNewPasswordType("password");
    }
  }
  function handleConfirmPasswordType() {
    if (confirmPasswordType === "password") {
      setConfirmPasswordType("text");
    } else {
      setConfirmPasswordType("password");
    }
  }

  async function handleFormSubmit(e) {
    e.preventDefault();

    const toastId = toast.loading("Logging in...");
    setLoading(true);

    try {
      const resetPasswordResponse = await resetPassword(formData);
      toast.update(toastId, {
        render: resetPasswordResponse.message,
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });
      setTimeout(() => navigate("/login"), 3000);
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
    <>
      <Header />
      <p>This is forget password page</p>
      <form onSubmit={handleFormSubmit}>
        <fieldset>
          <legend>Reset your password:</legend>
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
            <label htmlFor="newPassword">New password</label>
            <input
              type={newPasswordType}
              id="newPassword"
              name="newPassword"
              placeholder="Enter your new password"
              value={formData.newPassword}
              onChange={handleNewPasswordChange}
            />
            <button type="button" onClick={handleNewPasswordType}>
              {newPasswordType === "password"
                ? "Show password"
                : "Hide password"}
            </button>
          </div>
          <div>
            <label htmlFor="confirmPassword">Confirm new password</label>
            <input
              type={confirmPasswordType}
              id="confirmPassword"
              name="confirmPassword"
              placeholder="Confirm your new password"
              value={formData.confirmPassword}
              onChange={handleConfirmPasswordChange}
            />
            <button type="button" onClick={handleConfirmPasswordType}>
              {confirmPasswordType === "password"
                ? "Show password"
                : "Hide password"}
            </button>
            <button>
              {!(
                formData.newPassword.length >= 6 &&
                formData.confirmPassword.length >= 6 &&
                formData.newPassword === formData.confirmPassword
              )
                ? "❌"
                : "✅"}
            </button>
          </div>
          <button
            type="submit"
            disabled={
              !(
                formData.newPassword.length >= 6 &&
                formData.confirmPassword.length >= 6 &&
                formData.newPassword === formData.confirmPassword
              )
            }
          >
            {loading ? "Resetting new password..." : "Reset your password"}
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
        You have not register account. <Link to="/register">Register here</Link>
      </div>
      <div>
        Already have register. <Link to="/login">Log in</Link>
      </div>
    </>
  );
}
