const { pool } = require('../config/database');

class BabysitterModel {
  static async createBabysitter(userId, babysitterData) {
    const {
      firstName,
      lastName,
      phoneNumber,
      nin,
      dateOfBirth,
      nextOfKinName,
      nextOfKinPhone
    } = babysitterData;

    try {
      const [result] = await pool.execute(
        `INSERT INTO babysitters 
        (user_id, first_name, last_name, phone_number, nin, date_of_birth, next_of_kin_name, next_of_kin_phone)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [userId, firstName, lastName, phoneNumber, nin, dateOfBirth, nextOfKinName, nextOfKinPhone]
      );

      return result.insertId;
    } catch (error) {
      throw new Error(`Error creating babysitter: ${error.message}`);
    }
  }

  static async getBabysitterById(id) {
    try {
      const [rows] = await pool.execute(
        `SELECT b.*, u.email, u.role 
         FROM babysitters b 
         JOIN users u ON b.user_id = u.id 
         WHERE b.id = ?`,
        [id]
      );
      return rows[0];
    } catch (error) {
      throw new Error(`Error finding babysitter: ${error.message}`);
    }
  }

  static async getAllBabysitters() {
    try {
      const [rows] = await pool.execute(
        `SELECT b.*, u.email 
         FROM babysitters b 
         JOIN users u ON b.user_id = u.id`
      );
      return rows;
    } catch (error) {
      throw new Error(`Error fetching babysitters: ${error.message}`);
    }
  }

  static async updateBabysitter(id, updateData) {
    const allowedUpdates = [
      'first_name',
      'last_name',
      'phone_number',
      'next_of_kin_name',
      'next_of_kin_phone'
    ];

    try {
      const updates = [];
      const values = [];

      Object.keys(updateData).forEach(key => {
        if (allowedUpdates.includes(key)) {
          updates.push(`${key} = ?`);
          values.push(updateData[key]);
        }
      });

      values.push(id);

      const [result] = await pool.execute(
        `UPDATE babysitters 
         SET ${updates.join(', ')} 
         WHERE id = ?`,
        values
      );

      return result.affectedRows > 0;
    } catch (error) {
      throw new Error(`Error updating babysitter: ${error.message}`);
    }
  }

  static async deleteBabysitter(id) {
    try {
      const [result] = await pool.execute(
        'DELETE FROM babysitters WHERE id = ?',
        [id]
      );
      return result.affectedRows > 0;
    } catch (error) {
      throw new Error(`Error deleting babysitter: ${error.message}`);
    }
  }

  // Calculate babysitter payments
  static async calculateDailyPayment(babysitterId, date) {
    try {
      const [rows] = await pool.execute(
        `SELECT 
          COUNT(CASE WHEN session_type = 'half-day' THEN 1 END) as half_day_sessions,
          COUNT(CASE WHEN session_type = 'full-day' THEN 1 END) as full_day_sessions
         FROM attendance 
         WHERE babysitter_id = ? 
         AND DATE(check_in) = ?`,
        [babysitterId, date]
      );

      const { half_day_sessions, full_day_sessions } = rows[0];
      const halfDayRate = 2000; // 2,000K per half-day session
      const fullDayRate = 5000; // 5,000K per full-day session

      return {
        date,
        halfDaySessions: half_day_sessions,
        fullDaySessions: full_day_sessions,
        totalAmount: (half_day_sessions * halfDayRate) + (full_day_sessions * fullDayRate)
      };
    } catch (error) {
      throw new Error(`Error calculating payment: ${error.message}`);
    }
  }
}

module.exports = BabysitterModel; 