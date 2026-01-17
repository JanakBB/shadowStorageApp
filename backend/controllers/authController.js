export const sendOTP = async (req, res, next) => {
  const email = req.body.email;

  // 1.Its for first time check without resend.
  // -----------------------------------------
  setTimeout(() => {
    res.status(201).json({
      success: true,
      message: `Verification code sent to ${email}`,
      otpId: "1234",
    });
  }, 3000);
};
