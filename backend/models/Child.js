const pool = require('../config/database');

class Child {
  static async create({ first_name, last_name, date_of_birth, parent_id, special_needs }) {
    const [result] = await pool.execute(
      'INSERT INTO children (first_name, last_name, date_of_birth, parent_id, special_needs) VALUES (?, ?, ?, ?, ?)',
      [first_name, last_name, date_of_birth, parent_id, special_needs]
    );
    return result.insertId;
  }

  static async findAll() {
    const [rows] = await pool.execute(`
      SELECT c.*, p.first_name as parent_first_name, p.last_name as parent_last_name 
      FROM children c
      JOIN parents p ON c.parent_id = p.id
    `);
    return rows;
  }

  static async findById(id) {
    const [rows] = await pool.execute(`
      SELECT c.*, p.first_name as parent_first_name, p.last_name as parent_last_name 
      FROM children c
      JOIN parents p ON c.parent_id = p.id
      WHERE c.id = ?
    `, [id]);
    return rows[0];
  }

  static async update(id, { first_name, last_name, date_of_birth, parent_id, special_needs }) {
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

    if (date_of_birth) {
      updates.push('date_of_birth = ?');
      values.push(date_of_birth);
    }

    if (parent_id) {
      updates.push('parent_id = ?');
      values.push(parent_id);
    }

    if (special_needs !== undefined) {
      updates.push('special_needs = ?');
      values.push(special_needs);
    }

    if (updates.length === 0) return null;

    values.push(id);
    const query = `UPDATE children SET ${updates.join(', ')} WHERE id = ?`;
    
    const [result] = await pool.execute(query, values);
    return result.affectedRows > 0;
  }

  static async delete(id) {
    const [result] = await pool.execute(
      'DELETE FROM children WHERE id = ?',
      [id]
    );
    return result.affectedRows > 0;
  }

  static async getAttendanceStats(id) {
    const [rows] = await pool.execute(`
      SELECT 
        COUNT(*) as total_sessions,
        SUM(CASE WHEN session_type = 'full-day' THEN 1 ELSE 0 END) as full_day_sessions,
        SUM(CASE WHEN session_type = 'half-day' THEN 1 ELSE 0 END) as half_day_sessions,
        MIN(date) as first_attendance,
        MAX(date) as last_attendance
      FROM child_attendance 
      WHERE child_id = ?
    `, [id]);
    return rows[0];
  }

  static async getRecentAttendance(id, limit = 10) {
    const [rows] = await pool.execute(`
      SELECT ca.*, b.first_name as babysitter_first_name, b.last_name as babysitter_last_name
      FROM child_attendance ca
      JOIN babysitters b ON ca.babysitter_id = b.id
      WHERE ca.child_id = ?
      ORDER BY ca.date DESC
      LIMIT ?
    `, [id, limit]);
    return rows;
  }
}

module.exports = Child; 