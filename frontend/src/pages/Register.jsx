import Header from "../component/Header.jsx";
import { useState } from "react";

export default function Register() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");

  function handleFullNameChange(e) {
    setFullName(e.target.value);
  }

  function handleEmailChange(e) {
    setEmail(e.target.value);
  }

  return (
    <>
      <Header />
      <p>This is Register page</p>
      <form>
        <div>
          <label htmlFor="fullName">Name</label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            placeholder="Enter your full name"
            required
            onChange={handleFullNameChange}
            value={fullName}
          />
        </div>
        <div>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Enter your email"
            required
            onChange={handleEmailChange}
            value={email}
          />
          <button type="button">Send OTP</button>
        </div>
      </form>
    </>
  );
}
