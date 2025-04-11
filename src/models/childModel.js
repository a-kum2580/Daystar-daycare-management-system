const { pool } = require('../config/database');

class Child {
  static async create(childData) {
    const { parent_id, first_name, last_name, date_of_birth, gender, allergies, special_needs } = childData;
    const [result] = await pool.execute(
      `INSERT INTO children (parent_id, first_name, last_name, date_of_birth, gender, allergies, special_needs)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [parent_id, first_name, last_name, date_of_birth, gender, allergies, special_needs]
    );
    return result.insertId;
  }

  static async findById(id) {
    const [rows] = await pool.execute(
      `SELECT c.*, p.first_name as parent_first_name, p.last_name as parent_last_name, p.phone as parent_phone
       FROM children c
       JOIN parents p ON c.parent_id = p.id
       WHERE c.id = ?`,
      [id]
    );
    return rows[0];
  }

  static async findByParentId(parentId) {
    const [rows] = await pool.execute(
      'SELECT * FROM children WHERE parent_id = ?',
      [parentId]
    );
    return rows;
  }

  static async update(id, childData) {
    const { first_name, last_name, date_of_birth, gender, allergies, special_needs } = childData;
    await pool.execute(
      `UPDATE children 
       SET first_name = ?, last_name = ?, date_of_birth = ?, gender = ?, allergies = ?, special_needs = ?
       WHERE id = ?`,
      [first_name, last_name, date_of_birth, gender, allergies, special_needs, id]
    );
    return this.findById(id);
  }

  static async delete(id) {
    await pool.execute('DELETE FROM children WHERE id = ?', [id]);
  }

  static async getAll() {
    const [rows] = await pool.execute(
      `SELECT c.*, p.first_name as parent_first_name, p.last_name as parent_last_name
       FROM children c
       JOIN parents p ON c.parent_id = p.id`
    );
    return rows;
  }
}

module.exports = Child; 