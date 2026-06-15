const pool = require('../db/pool');

const Message = {
  async findAll() {
    const { rows } = await pool.query(
      `SELECT m.id, m.title, m.text, m.created_at,
              u.id AS user_id, u.first_name, u.last_name
       FROM messages m
       JOIN users u ON m.user_id = u.id
       ORDER BY m.created_at DESC`
    );
    return rows;
  },

  async findById(id) {
    const { rows } = await pool.query(
      `SELECT m.*, u.first_name, u.last_name
       FROM messages m
       JOIN users u ON m.user_id = u.id
       WHERE m.id = $1`,
      [id]
    );
    return rows[0] || null;
  },

  async create({ title, text, userId }) {
    const { rows } = await pool.query(
      `INSERT INTO messages (title, text, user_id)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [title, text, userId]
    );
    return rows[0];
  },

  async delete(id) {
    await pool.query('DELETE FROM messages WHERE id = $1', [id]);
  },
};

module.exports = Message;
