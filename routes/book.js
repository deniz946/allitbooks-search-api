var express = require("express");
var router = express.Router();
const OperationsController = require("../controllers/OperationsController");
const request = require("request");

router.get("/search", async function(req, res, next) {
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
    next({errMsg: error.message, status: 300});
    throw error;
  }
});

router.get('/:bookId', async (req, res, next) => {
  const bookId = req.params.bookId;

  if(!bookId) {
    next({errMsg: 'no book id provided'});
    return;
  }

  try {
    const bookUrl = await OperationsController.downloadBook(bookId)
    res.setHeader("content-disposition", "attachment; filename=logo.pdf");
    request(bookUrl).pipe(res);
    
  } catch (error) {
    next({errMsg: error.message});
    throw error;
  }

})

module.exports = router;
