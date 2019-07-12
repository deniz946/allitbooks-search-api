var express = require("express");
var router = express.Router();
const OperationsController = require("../controllers/OperationsController");

router.get("/", async function(req, res, next) {
  const searchParam = req.query.term;
  const page = req.query.page || 1;

  if (!searchParam) {
    next({ errMsg: "no search param provided" });
    return;
  }

  try {
    const foundBooks = await OperationsController.search(searchParam, page);
    res.send(foundBooks);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
