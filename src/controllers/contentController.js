const { validationResult } = require("express-validator");
const pool = require("../config/database");

const getAll = async (req, res) => {
  const { page = 1, limit = 10, search = "" } = req.query;
  const offset = (parseInt(page) - 1) * parseInt(limit);

  try {
    let query, countQuery, params, countParams;

    if (search) {
      query = `
        SELECT c.*, u.name AS author_name
        FROM contents c
        LEFT JOIN users u ON c.user_id = u.id
        WHERE c.title ILIKE $1 OR c.body ILIKE $1
        ORDER BY c.created_at DESC
        LIMIT $2 OFFSET $3
      `;
      countQuery = `SELECT COUNT(*) FROM contents WHERE title ILIKE $1 OR body ILIKE $1`;
      params = [`%${search}%`, parseInt(limit), offset];
      countParams = [`%${search}%`];
    } else {
      query = `
        SELECT c.*, u.name AS author_name
        FROM contents c
        LEFT JOIN users u ON c.user_id = u.id
        ORDER BY c.created_at DESC
        LIMIT $1 OFFSET $2
      `;
      countQuery = `SELECT COUNT(*) FROM contents`;
      params = [parseInt(limit), offset];
      countParams = [];
    }

    const [result, countResult] = await Promise.all([
      pool.query(query, params),
      pool.query(countQuery, countParams),
    ]);

    const total = parseInt(countResult.rows[0].count);

    return res.status(200).json({
      success: true,
      data: result.rows,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Server error." });
  }
};

const getOne = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      `SELECT c.*, u.name AS author_name
       FROM contents c
       LEFT JOIN users u ON c.user_id = u.id
       WHERE c.id = $1`,
      [id],
    );

    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Content not found." });
    }

    return res.status(200).json({ success: true, data: result.rows[0] });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Server error." });
  }
};

const create = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  const { title, body, status = "draft" } = req.body;
  const user_id = req.user.id;

  try {
    const result = await pool.query(
      "INSERT INTO contents (title, body, status, user_id) VALUES ($1, $2, $3, $4) RETURNING *",
      [title, body, status, user_id],
    );

    return res.status(201).json({
      success: true,
      message: "Content created successfully.",
      data: result.rows[0],
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Server error." });
  }
};

const update = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  const { id } = req.params;
  const { title, body, status } = req.body;
  const user_id = req.user.id;

  try {
    const existing = await pool.query("SELECT * FROM contents WHERE id = $1", [
      id,
    ]);
    if (existing.rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Content not found." });
    }
    if (existing.rows[0].user_id !== user_id) {
      return res
        .status(403)
        .json({ success: false, message: "Access denied. Not your content." });
    }

    const result = await pool.query(
      `UPDATE contents SET
        title = COALESCE($1, title),
        body = COALESCE($2, body),
        status = COALESCE($3, status),
        updated_at = NOW()
       WHERE id = $4 RETURNING *`,
      [title, body, status, id],
    );

    return res.status(200).json({
      success: true,
      message: "Content updated successfully.",
      data: result.rows[0],
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Server error." });
  }
};

const remove = async (req, res) => {
  const { id } = req.params;
  const user_id = req.user.id;

  try {
    const existing = await pool.query("SELECT * FROM contents WHERE id = $1", [
      id,
    ]);
    if (existing.rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Content not found." });
    }
    if (existing.rows[0].user_id !== user_id) {
      return res
        .status(403)
        .json({ success: false, message: "Access denied. Not your content." });
    }

    await pool.query("DELETE FROM contents WHERE id = $1", [id]);

    return res.status(200).json({
      success: true,
      message: "Content deleted successfully.",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Server error." });
  }
};

module.exports = { getAll, getOne, create, update, remove };
