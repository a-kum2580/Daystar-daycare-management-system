const pool = require('../config/database');

class Financial {
  static async createRecord({ type, category, amount, description, date }) {
    const [result] = await pool.execute(
      'INSERT INTO financial_records (type, category, amount, description, date) VALUES (?, ?, ?, ?, ?)',
      [type, category, amount, description, date]
    );
    return result.insertId;
  }

  static async findAllRecords() {
    const [rows] = await pool.execute('SELECT * FROM financial_records ORDER BY date DESC');
    return rows;
  }

  static async findRecordsByDateRange(startDate, endDate) {
    const [rows] = await pool.execute(
      'SELECT * FROM financial_records WHERE date BETWEEN ? AND ? ORDER BY date DESC',
      [startDate, endDate]
    );
    return rows;
  }

  static async getMonthlySummary(year, month) {
    const [rows] = await pool.execute(`
      SELECT 
        type,
        SUM(amount) as total_amount,
        COUNT(*) as record_count
      FROM financial_records
      WHERE YEAR(date) = ? AND MONTH(date) = ?
      GROUP BY type
    `, [year, month]);
    return rows;
  }

  static async getCategorySummary(year, month) {
    const [rows] = await pool.execute(`
      SELECT 
        category,
        type,
        SUM(amount) as total_amount,
        COUNT(*) as record_count
      FROM financial_records
      WHERE YEAR(date) = ? AND MONTH(date) = ?
      GROUP BY category, type
    `, [year, month]);
    return rows;
  }

  static async createBabysitterPayment({ babysitter_id, amount, date }) {
    const [result] = await pool.execute(
      'INSERT INTO babysitter_payments (babysitter_id, amount, date) VALUES (?, ?, ?)',
      [babysitter_id, amount, date]
    );
    return result.insertId;
  }

  static async updatePaymentStatus(id, status) {
    const [result] = await pool.execute(
      'UPDATE babysitter_payments SET status = ? WHERE id = ?',
      [status, id]
    );
    return result.affectedRows > 0;
  }

  static async getBabysitterPayments(babysitter_id) {
    const [rows] = await pool.execute(
      'SELECT * FROM babysitter_payments WHERE babysitter_id = ? ORDER BY date DESC',
      [babysitter_id]
    );
    return rows;
  }

  static async getPendingPayments() {
    const [rows] = await pool.execute(`
      SELECT 
        bp.*,
        b.first_name,
        b.last_name
      FROM babysitter_payments bp
      JOIN babysitters b ON bp.babysitter_id = b.id
      WHERE bp.status = 'pending'
      ORDER BY bp.date ASC
    `);
    return rows;
  }

  static async createBudgetCategory({ name, monthly_budget }) {
    const [result] = await pool.execute(
      'INSERT INTO budget_categories (name, monthly_budget) VALUES (?, ?)',
      [name, monthly_budget]
    );
    return result.insertId;
  }

  static async updateBudgetCategory(id, { name, monthly_budget }) {
    const [result] = await pool.execute(
      'UPDATE budget_categories SET name = ?, monthly_budget = ? WHERE id = ?',
      [name, monthly_budget, id]
    );
    return result.affectedRows > 0;
  }

  static async getBudgetCategories() {
    const [rows] = await pool.execute('SELECT * FROM budget_categories');
    return rows;
  }

  static async getBudgetVsActual(year, month) {
    const [rows] = await pool.execute(`
      SELECT 
        bc.name as category,
        bc.monthly_budget,
        COALESCE(SUM(fr.amount), 0) as actual_amount
      FROM budget_categories bc
      LEFT JOIN financial_records fr ON bc.name = fr.category 
        AND YEAR(fr.date) = ? 
        AND MONTH(fr.date) = ?
        AND fr.type = 'expense'
      GROUP BY bc.id, bc.name, bc.monthly_budget
    `, [year, month]);
    return rows;
  }
}

module.exports = Financial; 