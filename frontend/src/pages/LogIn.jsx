import Header from "../component/Header.jsx";
import { useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function LogIn() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [passwordType, setPasswordType] = useState("password");

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
  }

  return (
    <>
      <Header />
      <p>This is Log in page</p>
      <form onSubmit={handleFormSubmit}>
        <div>
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
              {passwordType === "password" ? "Show password" : "Hide password"}
            </button>
          </div>
          <button type="submit" disabled={formData.password.length < 6}>
            Log in
          </button>
        </div>
      </form>
    </>
  );
}
