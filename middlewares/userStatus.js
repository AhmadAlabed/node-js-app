const userStatus = (req, res, next) => {
  const { isBlocked, isDeleted, emailConfirm } = req.user;
  ////////////////STATUS OF User////////////////
  if (emailConfirm === false) {
    res.status(401).json({
      message: "Please confirm your email address",
    });
    return;
  }
  if (isBlocked === true) {
    res.status(401).json({
      message: "This user has been blocked",
    });
    return;
  }
  if (isDeleted === true) {
    res.status(401).json({
      message: "This user has been deleted",
    });
    return;
  }
  ////////////////STATUS OF User////////////////
  next();
};
module.exports = userStatus;
