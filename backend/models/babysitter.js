const pool = require('../config/database');

class Babysitter {
  static async create({ first_name, last_name, email, phone, nin, age, next_of_kin_contact }) {
    const [result] = await pool.execute(
      'INSERT INTO babysitters (first_name, last_name, email, phone, nin, age, next_of_kin_contact) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [first_name, last_name, email, phone, nin, age, next_of_kin_contact]
    );
    return result.insertId;
  }

  static async findAll() {
    const [rows] = await pool.execute('SELECT * FROM babysitters');
    return rows;
  }

  static async findById(id) {
    const [rows] = await pool.execute(
      'SELECT * FROM babysitters WHERE id = ?',
      [id]
    );
    return rows[0];
  }

  static async update(id, { first_name, last_name, email, phone, nin, age, next_of_kin_contact }) {
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

    if (nin) {
      updates.push('nin = ?');
      values.push(nin);
    }

    if (age) {
      updates.push('age = ?');
      values.push(age);
    }

    if (next_of_kin_contact) {
      updates.push('next_of_kin_contact = ?');
      values.push(next_of_kin_contact);
    }

    if (updates.length === 0) return null;

    values.push(id);
    const query = `UPDATE babysitters SET ${updates.join(', ')} WHERE id = ?`;
    
    const [result] = await pool.execute(query, values);
    return result.affectedRows > 0;
  }

  static async delete(id) {
    const [result] = await pool.execute(
      'DELETE FROM babysitters WHERE id = ?',
      [id]
    );
    return result.affectedRows > 0;
  }

  static async getAttendanceStats(id) {
    const [rows] = await pool.execute(
      `SELECT 
        COUNT(*) as total_sessions,
        SUM(CASE WHEN session_type = 'full-day' THEN 1 ELSE 0 END) as full_day_sessions,
        SUM(CASE WHEN session_type = 'half-day' THEN 1 ELSE 0 END) as half_day_sessions
      FROM child_attendance 
      WHERE babysitter_id = ?`,
      [id]
    );
    return rows[0];
  }
}

module.exports = Babysitter; 