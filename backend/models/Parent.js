const pool = require('../config/database');

class Parent {
  static async create({ first_name, last_name, email, phone, address }) {
    const [result] = await pool.execute(
      'INSERT INTO parents (first_name, last_name, email, phone, address) VALUES (?, ?, ?, ?, ?)',
      [first_name, last_name, email, phone, address]
    );
    return result.insertId;
  }

  static async findAll() {
    const [rows] = await pool.execute('SELECT * FROM parents');
    return rows;
  }

  static async findById(id) {
    const [rows] = await pool.execute(
      'SELECT * FROM parents WHERE id = ?',
      [id]
    );
    return rows[0];
  }

  static async update(id, { first_name, last_name, email, phone, address }) {
    const updates = [];
    const values = [];

    if (first_name) {
      updates.push('first_name = ?');
      values.push(first_name);
    }

    if (last_name) {
      updates.push('last_name = ?');
      values.push(last_name);
    }

    if (email) {
      updates.push('email = ?');
      values.push(email);
    }

    if (phone) {
      updates.push('phone = ?');
      values.push(phone);
    }

    if (address) {
      updates.push('address = ?');
      values.push(address);
    }

    if (updates.length === 0) return null;

    values.push(id);
    const query = `UPDATE parents SET ${updates.join(', ')} WHERE id = ?`;
    
    const [result] = await pool.execute(query, values);
    return result.affectedRows > 0;
  }

  static async delete(id) {
    const [result] = await pool.execute(
      'DELETE FROM parents WHERE id = ?',
      [id]
    );
    return result.affectedRows > 0;
  }

  static async getChildren(id) {
    const [rows] = await pool.execute(
      'SELECT * FROM children WHERE parent_id = ?',
      [id]
    );
    return rows;
  }

  static async getAttendanceStats(id) {
    const [rows] = await pool.execute(`
      SELECT 
        COUNT(*) as total_sessions,
        SUM(CASE WHEN ca.session_type = 'full-day' THEN 1 ELSE 0 END) as full_day_sessions,
        SUM(CASE WHEN ca.session_type = 'half-day' THEN 1 ELSE 0 END) as half_day_sessions
      FROM child_attendance ca
      JOIN children c ON ca.child_id = c.id
      WHERE c.parent_id = ?
    `, [id]);
    return rows[0];
  }
}

module.exports = Parent; 