import Header from "../component/Header.jsx";
import { useEffect, useState } from "react";
import { sendOTP, verifyOTP } from "../api/authApi.js";
import { toast } from "react-toastify";
import { registerUser } from "../api/userApi.js";
import { Link, useNavigate } from "react-router-dom";

export default function Register() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [passwordType, setPasswordType] = useState("password");
  const [countDown, setCountDown] = useState(60);

  const navigate = useNavigate();

  function handleFullNameChange(e) {
    setFormData((prev) => ({ ...prev, fullName: e.target.value }));
  }

  function handleEmailChange(e) {
    setFormData((prev) => ({ ...prev, email: e.target.value }));
  }

  function handleVerifyOTPChange(e) {
    setOtp(e.target.value);
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

  function handleEditEmailAndName() {
    setStep(1);
    setCountDown(60);
  }

  async function handleSendOTP() {
    // After create Backend we apply this for better looks.
    // ----------------------------------------------------
    if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      toast.error("Please enter a valid email");
      return;
    }
    const toastId = toast.loading("Sending OTP...");
    setLoading(true);
    try {
      await sendOTP(formData.email);
      toast.update(toastId, {
        render: "OTP sent successfully! Check your email.",
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });
      setStep(2);
    } catch (error) {
      toast.update(toastId, {
        render: error?.message || "Failed to send OTP",
        type: "error",
        isLoading: false,
        autoClose: 4000,
      });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (countDown <= -1) {
      setStep(1);
    }
    if (step !== 2) return;
    const countDownId = setInterval(() => {
      setCountDown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(countDownId);
  }, [countDown, step]);

  async function handleOTPVerify() {
    if (otp.length !== 6) {
      toast.error("Please enter OTP length exactly 6");
      return;
    }
    const toastId = toast.loading("Verifying OTP...");
    setLoading(true);
    try {
      await verifyOTP(formData.email, otp);
      toast.update(toastId, {
        render: "OTP verified successfully",
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });
      setStep(3);
    } catch (error) {
      toast.update(toastId, {
        render: error?.message || "Failed OTP verified",
        type: "error",
        isLoading: false,
        autoClose: 4000,
      });
    } finally {
      setLoading(false);
    }
  }

  async function handleFormSubmit(e) {
    e.preventDefault();
    const toastId = toast.loading("Registering...");
    setLoading(true);
    try {
      await registerUser({ ...formData, otp });
      toast.update(toastId, {
        render: "Registered successfully",
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });
      setTimeout(() => navigate("/login"), 3000);
    } catch (error) {
      toast.update(toastId, {
        render: error?.message || "Failed to register",
        type: "error",
        isLoading: false,
        autoClose: 4000,
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Header />
      <p>This is Register page</p>
      <form onSubmit={handleFormSubmit}>
        <div>
          <div>
            <label htmlFor="fullName">Name</label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              placeholder="Enter your full name"
              onChange={handleFullNameChange}
              value={formData.fullName}
              disabled={step >= 2}
            />
          </div>
          <div>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email"
              onChange={handleEmailChange}
              value={formData.email}
              disabled={step >= 2}
            />
            {step === 1 ? (
              <button type="button" onClick={handleSendOTP} disabled={loading}>
                {loading ? "Sending OTP..." : "Send OTP"}
              </button>
            ) : (
              <button type="button" onClick={handleEditEmailAndName}>
                Edit Email and Name
              </button>
            )}
          </div>
          {step === 2 && (
            <div>
              <label htmlFor="verify-otp">Verify OTP</label>
              <input
                type="number"
                id="verify-otp"
                placeholder="Enter your OTP here"
                value={formData.otp}
                onChange={handleVerifyOTPChange}
              />
              <button type="button" onClick={handleOTPVerify}>
                Verify OTP
              </button>
              <button type="button">{countDown}</button>
            </div>
          )}
          {step === 3 && (
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
            </div>
          )}
          {step === 3 && (
            <button type="submit" disabled={formData.password.length < 6}>
              Register
            </button>
          )}
        </div>
      </form>
      <div>
        Already have register. <Link to="/login">Log in</Link>
      </div>
    </>
  );
}
