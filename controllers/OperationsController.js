const request = require("request");
const cheerio = require("cheerio");
const scrapeHelper = require("../helpers/scrape-helpers");
const URL = require('url').URL;
const Q = require('q');
/*
    search url - http://www.allitebooks.org/?s=algo
    search url with page - http://www.allitebooks.org/page/2/?s=algo
*/

class OperationsController {
  search(term, page) {
    const Url = this._buildSearchUrl(term, page);
    const deferred = Q.defer();

    request(Url, (err, response) => {
      if (err) {
        deferred.reject({ errMsg: error.message, status: 500 })
      }
      const $ = cheerio.load(response.body);
      const booksOnPage = [];

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
      deferred.resolve(booksOnPage);
    });

    return deferred.promise;
  }

  getBookLink(bookId) {
    const BASE_URL = process.env.ALLITBOOKS_URL;
    const deffered = Q.defer();

    request(`${BASE_URL}/${bookId}`, (err, response) => {
      if (err) {
        deferred.reject({ errMsg: error.message, status: 500 })
      }

      const $ = cheerio.load(response.body);
      const link = $('.download-links a').attr('href');
      const title = $('.single-title').text();
      if (!link) {
        deffered.reject({ errMsg: 'There is no book with given id', status: 404})
      }

      deffered.resolve(encodeURI(link));
    });

    return deffered.promise;
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
