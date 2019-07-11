var express = require("express");
var router = express.Router();
const request = require("async-request");
const cheerio = require("cheerio");
const scrapeHelper = require("../helpers/scrape-helpers");
router.get("/", async function(req, res, next) {
  const URL = process.env.ALLITBOOKS_URL;

  const searchParam = req.query.search;
  const searchResultHTML = await request(URL);
  const $ = cheerio.load(searchResultHTML.body);
  const booksOnPage = [];
  try {
    $("article.post").each((i, element) => {
      booksOnPage.push({
        author: scrapeHelper.getAuthor(element, $),
        title: scrapeHelper.getTitle(element, $),
        desc: scrapeHelper.getDescription(element, $),
        link: scrapeHelper.getLink(element, $),
        thumbnail: scrapeHelper.getThumbnail(element, $)
      });
    });
  } catch (error) {
    console.log(error);
  }
  res.send(booksOnPage);
});

module.exports = router;
