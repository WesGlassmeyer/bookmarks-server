const knex = require("knex");
const fixtures = require("./bookmarks-fixtures");
const app = require("../src/app");
// TODO: remove when updating POST and DELETE
const store = require("../src/store");

describe("Bookmark Endpoints", function () {
  let db;

  before("make knex instance", () => {
    db = knex({
      client: "pg",
      connection: process.env.TEST_DB_URL,
    });
    app.set("db", db);
  });

  after("disconnect from db", () => db.destroy());

  before("clean the table", () => db("bookmarks").truncate());

  afterEach("cleanup", () => db("bookmarks").truncate());

  describe("GET /bookmarks", () => {
    context("Given there are bookmarks in the database", () => {
      const testBookmarks = fixtures.makeBookmarksArray();

      beforeEach("insert bookmarks", () => {
        return db.into("bookmarks").insert(testBookmarks);
      });

      it("gets the bookmarks from the store", () => {
        return supertest(app)
          .get("/bookmarks")
          .set("Authorization", `Bearer ${process.env.API_TOKEN}`)
          .expect(200, testBookmarks);
      });
    });
    context(`Given no bookmarks`, () => {
      it(`responds with 200 and an empty list`, () => {
        return supertest(app)
          .get("/bookmarks")
          .set("Authorization", `Bearer ${process.env.API_TOKEN}`)
          .expect(200, []);
      });
    });
  });

  describe("GET /bookmarks/:id", () => {
    context(`Given no bookmarks`, () => {
      it(`responds 404 when bookmark doesn't exist`, () => {
        return supertest(app)
          .get(`/bookmarks/999`)
          .set("Authorization", `Bearer ${process.env.API_TOKEN}`)
          .expect(404, "Bookmark Not Found");
      });
    });
    context("Given there are bookmarks in the database", () => {
      const testBookmarks = fixtures.makeBookmarksArray();

      beforeEach("insert bookmarks", () => {
        return db.into("bookmarks").insert(testBookmarks);
      });

      it("responds with 200 and the specified bookmark", () => {
        const bookmarkId = 2;
        const expectedBookmark = testBookmarks[bookmarkId - 1];
        return supertest(app)
          .get(`/bookmarks/${bookmarkId}`)
          .set("Authorization", `Bearer ${process.env.API_TOKEN}`)
          .expect(200, expectedBookmark);
      });
    });
  });
});
