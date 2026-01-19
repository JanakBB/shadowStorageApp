export const register = async (req, res, next) => {
  try {
    const { email, password, otp } = req.body;
    res.status(201).json({ message: "Registered successfully" });
  } catch (error) {
    next(error);
  }
};
