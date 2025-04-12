const pool = require('../config/database');

class Attendance {
  static async create({ child_id, babysitter_id, date, session_type }) {
    const [result] = await pool.execute(
      'INSERT INTO child_attendance (child_id, babysitter_id, date, session_type) VALUES (?, ?, ?, ?)',
      [child_id, babysitter_id, date, session_type]
    );
    return result.insertId;
  }

  static async checkIn(id) {
    const [result] = await pool.execute(
      'UPDATE child_attendance SET check_in_time = CURRENT_TIMESTAMP WHERE id = ?',
      [id]
    );
    return result.affectedRows > 0;
  }

  static async checkOut(id) {
    const [result] = await pool.execute(
      'UPDATE child_attendance SET check_out_time = CURRENT_TIMESTAMP WHERE id = ?',
      [id]
    );
    return result.affectedRows > 0;
  }

  static async findByDate(date) {
    const [rows] = await pool.execute(`
      SELECT 
        ca.*,
        c.first_name as child_first_name,
        c.last_name as child_last_name,
        b.first_name as babysitter_first_name,
        b.last_name as babysitter_last_name
      FROM child_attendance ca
      JOIN children c ON ca.child_id = c.id
      JOIN babysitters b ON ca.babysitter_id = b.id
      WHERE ca.date = ?
    `, [date]);
    return rows;
  }

  static async findByChild(child_id) {
    const [rows] = await pool.execute(`
      SELECT 
        ca.*,
        b.first_name as babysitter_first_name,
        b.last_name as babysitter_last_name
      FROM child_attendance ca
      JOIN babysitters b ON ca.babysitter_id = b.id
      WHERE ca.child_id = ?
      ORDER BY ca.date DESC
    `, [child_id]);
    return rows;
  }

  static async findByBabysitter(babysitter_id) {
    const [rows] = await pool.execute(`
      SELECT 
        ca.*,
        c.first_name as child_first_name,
        c.last_name as child_last_name
      FROM child_attendance ca
      JOIN children c ON ca.child_id = c.id
      WHERE ca.babysitter_id = ?
      ORDER BY ca.date DESC
    `, [babysitter_id]);
    return rows;
  }

  static async getDailyStats(date) {
    const [rows] = await pool.execute(`
      SELECT 
        COUNT(*) as total_children,
        SUM(CASE WHEN session_type = 'full-day' THEN 1 ELSE 0 END) as full_day_children,
        SUM(CASE WHEN session_type = 'half-day' THEN 1 ELSE 0 END) as half_day_children,
        COUNT(DISTINCT babysitter_id) as total_babysitters
      FROM child_attendance
      WHERE date = ?
    `, [date]);
    return rows[0];
  }

  static async getMonthlyStats(year, month) {
    const [rows] = await pool.execute(`
      SELECT 
        COUNT(*) as total_children,
        SUM(CASE WHEN session_type = 'full-day' THEN 1 ELSE 0 END) as full_day_children,
        SUM(CASE WHEN session_type = 'half-day' THEN 1 ELSE 0 END) as half_day_children,
        COUNT(DISTINCT babysitter_id) as total_babysitters,
        COUNT(DISTINCT child_id) as unique_children
      FROM child_attendance
      WHERE YEAR(date) = ? AND MONTH(date) = ?
    `, [year, month]);
    return rows[0];
  }
}

module.exports = Attendance; 