const pool = require('../config/database');

class Incident {
  static async create({ child_id, babysitter_id, description, severity, date }) {
    const [result] = await pool.execute(
      'INSERT INTO incidents (child_id, babysitter_id, description, severity, date) VALUES (?, ?, ?, ?, ?)',
      [child_id, babysitter_id, description, severity, date]
    );
    return result.insertId;
  }

  static async findAll() {
    const [rows] = await pool.execute(`
      SELECT 
        i.*,
        c.first_name as child_first_name,
        c.last_name as child_last_name,
        b.first_name as babysitter_first_name,
        b.last_name as babysitter_last_name
      FROM incidents i
      JOIN children c ON i.child_id = c.id
      JOIN babysitters b ON i.babysitter_id = b.id
      ORDER BY i.date DESC
    `);
    return rows;
  }

  static async findById(id) {
    const [rows] = await pool.execute(`
      SELECT 
        i.*,
        c.first_name as child_first_name,
        c.last_name as child_last_name,
        b.first_name as babysitter_first_name,
        b.last_name as babysitter_last_name
      FROM incidents i
      JOIN children c ON i.child_id = c.id
      JOIN babysitters b ON i.babysitter_id = b.id
      WHERE i.id = ?
    `, [id]);
    return rows[0];
  }

  static async findByChild(child_id) {
    const [rows] = await pool.execute(`
      SELECT 
        i.*,
        b.first_name as babysitter_first_name,
        b.last_name as babysitter_last_name
      FROM incidents i
      JOIN babysitters b ON i.babysitter_id = b.id
      WHERE i.child_id = ?
      ORDER BY i.date DESC
    `, [child_id]);
    return rows;
  }

  static async findByBabysitter(babysitter_id) {
    const [rows] = await pool.execute(`
      SELECT 
        i.*,
        c.first_name as child_first_name,
        c.last_name as child_last_name
      FROM incidents i
      JOIN children c ON i.child_id = c.id
      WHERE i.babysitter_id = ?
      ORDER BY i.date DESC
    `, [babysitter_id]);
    return rows;
  }

  static async findByDateRange(startDate, endDate) {
    const [rows] = await pool.execute(`
      SELECT 
        i.*,
        c.first_name as child_first_name,
        c.last_name as child_last_name,
        b.first_name as babysitter_first_name,
        b.last_name as babysitter_last_name
      FROM incidents i
      JOIN children c ON i.child_id = c.id
      JOIN babysitters b ON i.babysitter_id = b.id
      WHERE i.date BETWEEN ? AND ?
      ORDER BY i.date DESC
    `, [startDate, endDate]);
    return rows;
  }

  static async getSeverityStats() {
    const [rows] = await pool.execute(`
      SELECT 
        severity,
        COUNT(*) as count
      FROM incidents
      GROUP BY severity
    `);
    return rows;
  }

  static async getMonthlyStats(year, month) {
    const [rows] = await pool.execute(`
      SELECT 
        COUNT(*) as total_incidents,
        SUM(CASE WHEN severity = 'high' THEN 1 ELSE 0 END) as high_severity,
        SUM(CASE WHEN severity = 'medium' THEN 1 ELSE 0 END) as medium_severity,
        SUM(CASE WHEN severity = 'low' THEN 1 ELSE 0 END) as low_severity
      FROM incidents
      WHERE YEAR(date) = ? AND MONTH(date) = ?
    `, [year, month]);
    return rows[0];
  }

  static async update(id, { description, severity }) {
    const updates = [];
    const values = [];

    if (description) {
      updates.push('description = ?');
      values.push(description);
    }

    if (severity) {
      updates.push('severity = ?');
      values.push(severity);
    }

    if (updates.length === 0) return null;

    values.push(id);
    const query = `UPDATE incidents SET ${updates.join(', ')} WHERE id = ?`;
    
    const [result] = await pool.execute(query, values);
    return result.affectedRows > 0;
  }
}

module.exports = Incident; 