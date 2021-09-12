const Customer = require("../models/Customer");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { JWT_KEY } = require("../config/constant");

exports.login = function (req, res, next) {
  Customer.find({
    $and: [
      { mobile: req.body.mobile },
      { business_slug: req.body.business_slug },
    ],
  })
    .exec()
    .then((customer) => {
      if (!customer[0].status) {
        return res.status(401).json({
          status_code: 401,
          message: "Your account is inactive. Please contact admin",
        });
      }
      if (customer.length < 1) {
        return res.status(401).json({
          status_code: 401,
          message: "Auth failed",
          error: "Auth failed",
        });
      }
      else {
        bcrypt.compare(req.body.password, customer[0].password, function (
          err,
          result
        ) {
          if (err) {
            return res.status(401).json({
              status_code: 401,
              error: "Auth failed",
            });
          }
          if (result) {
            result = customer[0];
            result.password = "";
            const token = jwt.sign(
              {
                exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 365,
                data: {
                  email: customer[0].email,
                  userId: customer[0]._id,
                  business_slug: customer[0].business_slug,
                },
              },
              JWT_KEY
            );
            return res.status(200).json({
              message: "Auth Successful",
              userToken: token,
              expiresIn: "365",
              status_code: 200,
              message: "Login Successfully!",
              data: {
                user: customer[0],
              },
            });
          }
          return res.status(401).json({
            status_code: 401,
            message: "Your email id or password is wrong. Please retry with a valid credential",
            error: "Auth failed",
          });
        });
      }
    })
    .catch((err) => {
      res.status(500).json({
        status_code: 401,
        message: "Your email id or password is wrong. Please retry with a valid credential",
        error: err.message,
      });
    });
};
