var express = require("express");
var router = express.Router();
const OperationsController = require("../controllers/OperationsController");
const request = require("request");

router.get("/search", async function (req, res, next) {
  const searchParam = req.query.term;
  const page = req.query.page || 1;

  if (!searchParam) {
    next({ errMsg: "no search param provided" });
    return;
  }

  OperationsController.search(searchParam, page)
    .then(foundBooks => res.send(foundBooks))
    .catch(err => {
      next(err);
      throw err;
    })
});

router.get('/:bookId', async (req, res, next) => {
  const bookId = req.params.bookId;

  if (!bookId) {
    next({ errMsg: 'no book id provided' });
    return;
  }

  try {
    const bookInfo = await OperationsController.getBookLink(bookId)
    res.send(bookInfo);

  } catch (error) {
    next(error);
    throw error;
  }

})


router.get('/:bookId/download', async (req, res, next) => {
  const bookId = req.params.bookId;

  if (!bookId) {
    next({ errMsg: 'no book id provided' });
    return;
  }

  try {
    const bookInfo = await OperationsController.getBookLink(bookId)
    res.setHeader("content-disposition", "attachment; filename=logo.pdf");
    request(bookInfo.link).pipe(res);

  } catch (error) {
    next(error);
    throw error;
  }

})

module.exports = router;
