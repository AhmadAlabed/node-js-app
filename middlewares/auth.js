const jwt = require("jsonwebtoken");
const userModel = require("../DB/models/User");

const roles = {
  User: "User",
  Admin: "Admin",
};

const auth = (accessRoles) => {
  return async (req, res, next) => {
    // const token =
    //   req.body.token || req.query.token || req.headers["authorization"];
    const headerToken = req.headers["authorization"];
    try {
      if (
        headerToken == null ||
        headerToken == undefined ||
        !headerToken.startsWith(`${process.env.BEARER} `)
      ) {
        res
          .status(404)
          .json({ message: "A token is required for authentication" });
      } else {
        const token = headerToken.split(" ")[1];
        if (!token || token == undefined || token.length == 0) {
          res.status(401).json({ message: "Invalid Token" });
        } else {
          const decoded = jwt.verify(token, process.env.TOKEN_KEY);
          if (decoded.isLoggedIn == true) {
            const findUser = await userModel
              .findById(decoded.id)
              .select("email isBlocked isDeleted emailConfirm role");
            if (findUser) {
              if (accessRoles.includes(findUser.role)) {
                //---------------------------------------------role
                req.user = findUser;
                next();
                //---------------------------------------------End
              } else {
                res.status(401).json({
                  message: "You are not authorized to access this application",
                });
              }
            } else {
              res.status(401).json({ message: "Invalid Token" });
            }
          } else {
            res.status(401).json({ message: "Invalid Token" });
          }
        }
      }
    } catch (error) {
      res.status(500).json(error);
    }
  };
};
module.exports = {
  auth,
  roles,
};
