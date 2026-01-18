import { sendOtpEmail } from "../services/sendOtpServer.js";

export const sendOTP = async (req, res, next) => {
  const { email } = req.body;

  try {
    // const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    // await delay(3000);
    // res.status(201).json({
    //   success: true,
    //   message: `Verification code sent to ${email}`,
    //   otpId: "1234",
    // });

    const data = await sendOtpEmail(email);
    res.status(201).json({
      success: true,
      message: `Verification code sent to ${email}`,
      data,
    });
  } catch (error) {
    next(error);
  }
};
