const dataMethod = ["body", "params", "query", "file", "headers"];
const validation = (Schema) => {
  return (req, res, next) => {
    const validationErrorArr = [];
    dataMethod.forEach((key) => {
      if (Schema[key]) {
        const validationResult = Schema[key].validate(req[key], {
          abortEarly: false,
        });
        if (validationResult.error) {
          validationErrorArr.push(validationResult.error.details);
        }
      }
    });

    if (validationErrorArr.length) {
      res.json(validationErrorArr);
    } else {
      next();
    }
  };
};
module.exports = validation;
