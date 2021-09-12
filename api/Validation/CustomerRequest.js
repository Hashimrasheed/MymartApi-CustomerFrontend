
exports.SignInCustomerRequest = async (req, res, next) => {
  let messages = {};
  flag = true;
  messages = {};

  if (!req.body.mobile) {
    flag = false;
    messages.mobile = "Mobile number is required"
  }
  if (!flag) {
    return res.status(500).json({
      status_code: 500,
      message: "Errors",
      errors: messages,
      // data: {}
    });
  }
  next();
};