const { pool } = require('../config/database');

class FinancialRecord {
  static async create(recordData) {
    const { parent_id, child_id, amount, payment_type, status, due_date, notes } = recordData;
    const [result] = await pool.execute(
      `INSERT INTO financial_records (parent_id, child_id, amount, payment_type, status, due_date, notes)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [parent_id, child_id, amount, payment_type, status, due_date, notes]
    );
    return result.insertId;
  }

  static async findById(id) {
    const [rows] = await pool.execute(
      `SELECT fr.*, p.first_name as parent_first_name, p.last_name as parent_last_name,
              c.first_name as child_first_name, c.last_name as child_last_name
       FROM financial_records fr
       JOIN parents p ON fr.parent_id = p.id
       JOIN children c ON fr.child_id = c.id
       WHERE fr.id = ?`,
      [id]
    );
    return rows[0];
  }

  static async findByParentId(parentId) {
    const [rows] = await pool.execute(
      `SELECT fr.*, c.first_name as child_first_name, c.last_name as child_last_name
       FROM financial_records fr
       JOIN children c ON fr.child_id = c.id
       WHERE fr.parent_id = ?`,
      [parentId]
    );
    return rows;
  }

  static async updateStatus(id, status, paid_date = null) {
    await pool.execute(
      'UPDATE financial_records SET status = ?, paid_date = ? WHERE id = ?',
      [status, paid_date, id]
    );
    return this.findById(id);
  }

  static async getOverduePayments() {
    const [rows] = await pool.execute(
      `SELECT fr.*, p.first_name as parent_first_name, p.last_name as parent_last_name,
              c.first_name as child_first_name, c.last_name as child_last_name
       FROM financial_records fr
       JOIN parents p ON fr.parent_id = p.id
       JOIN children c ON fr.child_id = c.id
       WHERE fr.status = 'overdue' AND fr.due_date < CURDATE()`
    );
    return rows;
  }

  static async getMonthlyReport(year, month) {
    const [rows] = await pool.execute(
      `SELECT 
         SUM(CASE WHEN status = 'paid' THEN amount ELSE 0 END) as total_paid,
         SUM(CASE WHEN status = 'pending' THEN amount ELSE 0 END) as total_pending,
         SUM(CASE WHEN status = 'overdue' THEN amount ELSE 0 END) as total_overdue,
         COUNT(*) as total_records
       FROM financial_records
       WHERE YEAR(due_date) = ? AND MONTH(due_date) = ?`,
      [year, month]
    );
    return rows[0];
  }
}

module.exports = FinancialRecord; 