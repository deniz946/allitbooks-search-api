const request = require("async-request");
const cheerio = require("cheerio");
const scrapeHelper = require("../helpers/scrape-helpers");

/*
    search url - http://www.allitebooks.org/?s=algo
    search url with page - http://www.allitebooks.org/page/2/?s=algo
*/

class OperationsController {
  async search(term, page) {
    const Url = this._buildSearchUrl(term, page);

    const searchResultHTML = await request(Url);
    const $ = cheerio.load(searchResultHTML.body);
    const booksOnPage = [];
    try {
      $("article.post").each((i, element) => {
        const link = scrapeHelper.getLink(element, $);
        booksOnPage.push({
          link,
          author: scrapeHelper.getAuthor(element, $),
          title: scrapeHelper.getTitle(element, $),
          desc: scrapeHelper.getDescription(element, $),
          downloadPath: new URL(link).pathname,
          thumbnail: scrapeHelper.getThumbnail(element, $)
        });
      });

      return booksOnPage;
    } catch (error) {
      throw { errMsg: error.message, status: 500 };
    }
  }

  async downloadBook(bookUrl) {
    const searchResultHTML = await request(bookUrl);
    const $ = cheerio.load(searchResultHTML.body);
  }

  _buildSearchUrl(term, page) {
    const Url = new URL(`${process.env.ALLITBOOKS_URL}/page/${page}/`);
    Url.searchParams.set("s", term);

    return Url.toString();
  }

  async _getHtmlContent(url) {
    const searchResultHTML = await request(URL);
    return cheerio.load(searchResultHTML.body);
  }
}

module.exports = new OperationsController();
