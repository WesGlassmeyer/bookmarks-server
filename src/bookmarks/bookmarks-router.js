const express = require("express");
const logger = require("../logger");
const { isWebUri } = require("valid-url");
const BookmarksService = require("./bookmarks-service");
const xss = require("xss");
const path = require("path");

const bookmarksRouter = express.Router();
const bodyParser = express.json();

const serializeBookmark = (bookmark) => ({
  id: bookmark.id,
  title: xss(bookmark.title),
  url: bookmark.url,
  description: xss(bookmark.description),
  rating: Number(bookmark.rating),
});

bookmarksRouter
  .route("/api/bookmarks")
  .get((req, res, next) => {
    BookmarksService.getAllBookmarks(req.app.get("db"))
      .then((bookmarks) => {
        res.json(bookmarks.map(serializeBookmark));
      })
      .catch(next);
  })
  .post(bodyParser, (req, res, next) => {
    const { title, url, description, rating } = req.body;

    for (const field of ["title", "url", "rating"]) {
      if (!req.body[field]) {
        logger.error(`${field} is required`);
        return res
          .status(400)
          .send({ error: { message: `'${field}' is required` } });
      }
    }

    const ratingNum = Number(rating);

    if (!isWebUri(url)) {
      logger.error(`URL is invalid`);
      return res.status(400).send({
        error: { message: `'url' must be a valid URL` },
      });
    }

    if (!Number.isInteger(ratingNum) || ratingNum < 0 || ratingNum > 5) {
      logger.error("Invalid rating provided");
      return res.status(400).send({
        error: { message: `'rating' must be a number between 0 and 5` },
      });
    }

    const newBookmark = {
      title,
      url,
      description,
      rating,
    };

    BookmarksService.insertBookmark(req.app.get("db"), newBookmark)
      .then((bookmark) => {
        logger.info(`Bookmark with id ${bookmark.id} created.`);
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${bookmark.id}`))
          .json(serializeBookmark(bookmark));
      })
      .catch(next);
  });

bookmarksRouter
  .route("/api/bookmarks/:id")
  .all((req, res, next) => {
    const { id } = req.params;
    BookmarksService.getById(req.app.get("db"), id)
      .then((bookmark) => {
        if (!bookmark) {
          logger.error(`Bookmark with id ${id} not found.`);
          return res
            .status(404)
            .send({ error: { message: `Bookmark Not Found` } });
        }
        res.bookmark = bookmark;
        next();
      })
      .catch(next);
  })
  .get((req, res) => {
    res.json(serializeBookmark(res.bookmark));
  })
  .delete((req, res, next) => {
    const { id } = req.params;
    BookmarksService.deleteBookmark(req.app.get("db"), id)
      .then((numRowsAffected) => {
        logger.info(`Bookmark with id ${id} deleted.`);
        res.status(204).end();
      })
      .catch(next);
  });

module.exports = bookmarksRouter;
