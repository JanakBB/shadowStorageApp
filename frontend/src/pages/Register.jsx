import Header from "../component/Header.jsx";
import { useState } from "react";
import { sendOTP } from "../api/authApi.js";
import { toast } from "react-toastify";

export default function Register() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    otp: "",
  });

  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);

  function handleFullNameChange(e) {
    setFormData((prev) => ({ ...prev, fullName: e.target.value }));
  }

  function handleEmailChange(e) {
    setFormData((prev) => ({ ...prev, email: e.target.value }));
  }

  function handleVerifyOTP(e) {
    setFormData((prev) => ({ ...prev, otp: e.target.value }));
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

  return (
    <>
      <Header />
      <p>This is Register page</p>
      <form>
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
              disabled={step === 2}
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
              disabled={step === 2}
            />
            {step === 1 ? (
              <button type="button" onClick={handleSendOTP} disabled={loading}>
                {loading ? "Sending OTP..." : "Send OTP"}
              </button>
            ) : (
              <button type="button" onClick={() => setStep(1)}>
                Edit Email and Name
              </button>
            )}
          </div>
        </div>
        {step === 2 && (
          <div>
            <label htmlFor="verify-otp">Verify OTP</label>
            <input
              type="number"
              id="verify-otp"
              placeholder="Enter your OTP here"
              value={formData.otp}
              onChange={handleVerifyOTP}
            />
            <button type="button">Verify OTP</button>
          </div>
        )}
      </form>
    </>
  );
}
