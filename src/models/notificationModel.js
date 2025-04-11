const { pool } = require('../config/database');

class Notification {
  static async create(notificationData) {
    const { user_id, title, message, type } = notificationData;
    const [result] = await pool.execute(
      `INSERT INTO notifications (user_id, title, message, type)
       VALUES (?, ?, ?, ?)`,
      [user_id, title, message, type]
    );
    return result.insertId;
  }

  static async findByUserId(userId, unreadOnly = false) {
    const query = unreadOnly
      ? 'SELECT * FROM notifications WHERE user_id = ? AND is_read = FALSE ORDER BY created_at DESC'
      : 'SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC';
    
    const [rows] = await pool.execute(query, [userId]);
    return rows;
  }

  static async markAsRead(id) {
    await pool.execute(
      'UPDATE notifications SET is_read = TRUE WHERE id = ?',
      [id]
    );
    return this.findById(id);
  }

  static async markAllAsRead(userId) {
    await pool.execute(
      'UPDATE notifications SET is_read = TRUE WHERE user_id = ?',
      [userId]
    );
  }

  static async findById(id) {
    const [rows] = await pool.execute(
      'SELECT * FROM notifications WHERE id = ?',
      [id]
    );
    return rows[0];
  }

  static async delete(id) {
    await pool.execute('DELETE FROM notifications WHERE id = ?', [id]);
  }

  // Create notification for payment due
  static async createPaymentDueNotification(parentId, amount, dueDate) {
    const title = 'Payment Due';
    const message = `A payment of $${amount} is due on ${dueDate}. Please make the payment to avoid late fees.`;
    return this.create({
      user_id: parentId,
      title,
      message,
      type: 'payment'
    });
  }

  // Create notification for incident report
  static async createIncidentNotification(parentId, childName, incidentType) {
    const title = 'Incident Report';
    const message = `An incident of type ${incidentType} has been reported for ${childName}. Please check the details.`;
    return this.create({
      user_id: parentId,
      title,
      message,
      type: 'incident'
    });
  }
}

module.exports = Notification; 