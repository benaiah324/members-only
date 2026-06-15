const pool = require('../db/pool');

const USERS_TABLE = 'club_users';

const User = {
  async findByEmail(email) {
    const { rows } = await pool.query(`SELECT * FROM ${USERS_TABLE} WHERE email = $1`, [email]);
    return rows[0] || null;
  },

  async findById(id) {
    const { rows } = await pool.query(`SELECT * FROM ${USERS_TABLE} WHERE id = $1`, [id]);
    return rows[0] || null;
  },

  async create({ firstName, lastName, email, password, isAdmin = false }) {
    const { rows } = await pool.query(
      `INSERT INTO ${USERS_TABLE} (first_name, last_name, email, password, membership_status, is_admin)
       VALUES ($1, $2, $3, $4, FALSE, $5)
       RETURNING id, first_name, last_name, email, membership_status, is_admin, created_at`,
      [firstName, lastName, email, password, isAdmin]
    );
    return rows[0];
  },

  async updateMembership(id, status) {
    const { rows } = await pool.query(
      `UPDATE ${USERS_TABLE} SET membership_status = $1 WHERE id = $2 RETURNING *`,
      [status, id]
    );
    return rows[0];
  },

  toSessionUser(row) {
    if (!row) return null;
    return {
      id: row.id,
      firstName: row.first_name,
      lastName: row.last_name,
      email: row.email,
      membershipStatus: row.membership_status,
      isAdmin: row.is_admin,
    };
  },
};

module.exports = User;
