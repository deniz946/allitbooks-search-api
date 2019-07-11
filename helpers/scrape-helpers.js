"use strict";

function getTitle(element, context) {
  return context(".entry-title", element).text();
}

function getAuthor(element, context) {
  const dirtyAuthor = context(".entry-author", element).text();
  const author = dirtyAuthor.replace("By: ", "");
  return author;
}

function getDescription(element, context) {
  return context(".entry-summary", element).text();
}

function getLink(element, context) {
  const title = context(".entry-title", element);
  return context("a", title).attr("href");
}

function getThumbnail(element, context) {
  const thumbnailElement = context(".entry-thumbnail", element);
  return context("img", thumbnailElement).attr("src");
}

module.exports = {
  getTitle,
  getAuthor,
  getDescription,
  getLink,
  getThumbnail
};
