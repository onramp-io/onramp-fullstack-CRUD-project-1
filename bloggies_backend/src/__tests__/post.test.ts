import db from "../db";
import Post from "../models/post";
import * as m from "./helpers/mocks";

let validPostId: number;
let validUserId: number;

/** Tests for Post model */
describe("Test post class", function () {
  beforeEach(async function () {
    // create a user
    await reset();

    const userAuthRes = await db.query(
      `INSERT INTO user_auth (email, hashed_pwd)
        VALUES ($1, $2)
        RETURNING id`,
      [m.TEST_EMAIL, "password"]);
    validUserId = userAuthRes.rows[0].id;

    await db.query(
      `INSERT INTO users (user_id, display_name)
        VALUES ($1, $2)`,
      [validUserId, m.TEST_DISPLAY_NAME]);

    const postRes = await db.query(
      `INSERT INTO posts(title, description, body, author_id, is_premium) 
        VALUES
            ($1, $2, 'Body text description goes here', $3, false)
        RETURNING id`,
        [m.TEST_POST_TITLE, m.TEST_POST_DESC, validUserId]);
    validPostId = postRes.rows[0].id;
  });

  test("can create new post", async function () {
    const post = await Post.createPost("Test title", "Test description", "Test body", validUserId, false);
    expect(post.title).toBe("Test title");
    expect(post.body).toBe("Test body");
    expect(post.author_id).toBe(validUserId);
  });

  test("can get post by post id", async function () {
    const post = await Post.getPost(validPostId, 'active');
    expect(post.title).toBe(m.TEST_POST_TITLE);
    expect(post.description).toBe(m.TEST_POST_DESC);
    expect(post.author_id).toBe(validUserId);
  });

  test("can update a post", async function () {
    const updateData = { title: "Lemon Soda", description: "Lemon with Sparkling Water" }
    const res = await Post.updatePost(validPostId, updateData);

    const results = await db.query(
      `SELECT title, description
      FROM posts
      WHERE id = ${validPostId}`);

    const post = results.rows[0];

    expect(res.last_updated_at).toBeDefined();
    expect(post.title).toBe(updateData.title);
    expect(post.description).toBe(updateData.description);
  });

  test("can delete post", async function () {
    await Post.deletePost(validPostId);
    const res = await db.query(
      `SELECT id, title, description, body, author_id, created_at, last_updated_at
      FROM posts
      WHERE id = ${validPostId}`);
    expect(res.rows.length).toBe(0);
  });

  test("can identify current user as not the author of a post", async function () {
    const author = await Post.checkIsAuthor(validUserId, 99999);
    expect(author).toBe(false);
  });

  test("can identify current user as the author of a post", async function () {
    const author = await Post.checkIsAuthor(validUserId, validUserId);
    expect(author).toBe(true);
  });

  afterAll(async () => {
    await reset();
    await db.end();
  });
});

async function reset() {
  await db.query("DELETE FROM posts");
  await db.query("DELETE FROM users");
  await db.query("DELETE FROM user_auth");
  await db.query("ALTER SEQUENCE posts_id_seq RESTART WITH 1");
  await db.query("ALTER SEQUENCE user_auth_id_seq RESTART WITH 1");
}