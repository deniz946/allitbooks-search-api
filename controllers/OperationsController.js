const request = require("async-request");
const cheerio = require("cheerio");
const scrapeHelper = require("../helpers/scrape-helpers");
const URL = require('url').URL;
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
          downloadPath: new URL(link).pathname.replace(/\//g, ''),
          thumbnail: scrapeHelper.getThumbnail(element, $)
        });
      });

      return booksOnPage;
    } catch (error) {
      throw { errMsg: error.message, status: 500 };
    }
  }

  async downloadBook(bookId) {
    const BASE_URL = process.env.ALLITBOOKS_URL;
    const searchResultHTML = await request(`${BASE_URL}/${bookId}`);
    const $ = cheerio.load(searchResultHTML.body);
    const link = $('span.download-links>a').attr('href');
   // const bookBinary = await request(link);
    return link;
  }

  _buildSearchUrl(term, page) {
    const BASE_URL = process.env.ALLITBOOKS_URL;
    const Url = new URL(`${BASE_URL}/page/${page}/`);
    Url.searchParams.set("s", term);

    return Url.toString();
  }

  async _getHtmlContent(url) {
    const searchResultHTML = await request(url);
    return cheerio.load(searchResultHTML.body);
  }
}

module.exports = new OperationsController();
