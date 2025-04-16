module.exports = {
  // User roles
  ROLES: {
    ADMIN: 'admin',
    STAFF: 'staff',
    BABYSITTER: 'babysitter'
  },

  // Session types
  SESSION_TYPES: {
    HALF_DAY: 'half-day',
    FULL_DAY: 'full-day'
  },

  // Payment rates
  PAYMENT_RATES: {
    HALF_DAY: 2000, // 2,000K per half-day session
    FULL_DAY: 5000  // 5,000K per full-day session
  },

  // Attendance status
  ATTENDANCE_STATUS: {
    PRESENT: 'present',
    ABSENT: 'absent',
    LATE: 'late',
    EARLY_DEPARTURE: 'early_departure'
  },

  // Incident types
  INCIDENT_TYPES: {
    HEALTH: 'health',
    BEHAVIOR: 'behavior',
    INJURY: 'injury',
    OTHER: 'other'
  },

  // Severity levels
  SEVERITY_LEVELS: {
    LOW: 'low',
    MEDIUM: 'medium',
    HIGH: 'high'
  },

  // Notification types
  NOTIFICATION_TYPES: {
    CHILD_STATUS: 'child_status',
    PAYMENT_REMINDER: 'payment_reminder',
    PAYMENT_OVERDUE: 'payment_overdue',
    BUDGET_ALERT: 'budget_alert',
    INCIDENT_REPORT: 'incident_report'
  },

  // Financial categories
  EXPENSE_CATEGORIES: {
    SALARIES: 'salaries',
    SUPPLIES: 'supplies',
    MAINTENANCE: 'maintenance',
    UTILITIES: 'utilities',
    OTHER: 'other'
  },

  // Income sources
  INCOME_SOURCES: {
    DAYCARE_FEE: 'daycare_fee',
    DONATION: 'donation',
    GRANT: 'grant',
    OTHER: 'other'
  },

  // Payment methods
  PAYMENT_METHODS: {
    CASH: 'cash',
    MOBILE_MONEY: 'mobile_money',
    BANK_TRANSFER: 'bank_transfer',
    CREDIT_CARD: 'credit_card',
    CHECK: 'check',
    OTHER: 'other'
  },

  // Payment status
  PAYMENT_STATUS: {
    PENDING: 'pending',
    PAID: 'paid',
    OVERDUE: 'overdue',
    CANCELLED: 'cancelled'
  },

  // Budget periods
  BUDGET_PERIODS: {
    DAILY: 'daily',
    WEEKLY: 'weekly',
    MONTHLY: 'monthly',
    YEARLY: 'yearly'
  }
}; 