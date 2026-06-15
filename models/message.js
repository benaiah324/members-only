const pool = require('../db/pool');

const MESSAGES_TABLE = 'club_messages';
const USERS_TABLE = 'club_users';

const Message = {
  async findAll() {
    const { rows } = await pool.query(
      `SELECT m.id, m.title, m.text, m.created_at,
              u.id AS user_id, u.first_name, u.last_name
       FROM ${MESSAGES_TABLE} m
       JOIN ${USERS_TABLE} u ON m.user_id = u.id
       ORDER BY m.created_at DESC`
    );
    return rows;
  },

  async findById(id) {
    const { rows } = await pool.query(
      `SELECT m.*, u.first_name, u.last_name
       FROM ${MESSAGES_TABLE} m
       JOIN ${USERS_TABLE} u ON m.user_id = u.id
       WHERE m.id = $1`,
      [id]
    );
    return rows[0] || null;
  },

  async create({ title, text, userId }) {
    const { rows } = await pool.query(
      `INSERT INTO ${MESSAGES_TABLE} (title, text, user_id)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [title, text, userId]
    );
    return rows[0];
  },

  async delete(id) {
    await pool.query(`DELETE FROM ${MESSAGES_TABLE} WHERE id = $1`, [id]);
  },
};

module.exports = Message;
