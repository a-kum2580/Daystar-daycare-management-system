const User = require('./user.model');
const Babysitter = require('./babysitter.model');
const Child = require('./child.model');
const Attendance = require('./attendance.model');
const Incident = require('./incident.model');
const Payment = require('./payment.model');
const Expense = require('./expense.model');
const Budget = require('./budget.model');
const Notification = require('./notification.model');
const ChildBabysitter = require('./childBabysitter.model');

// Define model associations

// User associations
User.hasOne(Babysitter, { foreignKey: 'userId', as: 'babysitterProfile' });
User.hasMany(Attendance, { foreignKey: 'recordedById', as: 'recordedAttendances' });
User.hasMany(Incident, { foreignKey: 'reportedById', as: 'reportedIncidents' });
User.hasMany(Incident, { foreignKey: 'notifiedById', as: 'notifiedIncidents' });
User.hasMany(Payment, { foreignKey: 'paidById', as: 'paymentsMade' });
User.hasMany(Payment, { foreignKey: 'paidToId', as: 'paymentsReceived' });
User.hasMany(Expense, { foreignKey: 'recordedById', as: 'recordedExpenses' });
User.hasMany(Budget, { foreignKey: 'createdById', as: 'createdBudgets' });
User.hasMany(Notification, { foreignKey: 'userId', as: 'notifications' });

// Babysitter associations
Babysitter.belongsTo(User, { foreignKey: 'userId', as: 'user' });
Babysitter.hasMany(Child, { foreignKey: 'babysitterId', as: 'assignedChildren' });

// Child associations
Child.belongsTo(Babysitter, { foreignKey: 'babysitterId', as: 'babysitter' });
Child.hasMany(Attendance, { foreignKey: 'personId', as: 'attendances' });
Child.hasMany(Incident, { foreignKey: 'childId', as: 'incidents' });

// Attendance associations
Attendance.belongsTo(User, { foreignKey: 'recordedById', as: 'recordedBy' });

// Incident associations
Incident.belongsTo(Child, { foreignKey: 'childId', as: 'child' });
Incident.belongsTo(User, { foreignKey: 'reportedById', as: 'reportedBy' });
Incident.belongsTo(User, { foreignKey: 'notifiedById', as: 'notifiedBy' });

// Payment associations
Payment.belongsTo(User, { foreignKey: 'paidById', as: 'payer' });
Payment.belongsTo(User, { foreignKey: 'paidToId', as: 'payee' });

// Expense associations
Expense.belongsTo(User, { foreignKey: 'recordedById', as: 'recordedBy' });

// Budget associations
Budget.belongsTo(User, { foreignKey: 'createdById', as: 'createdBy' });

// Notification associations
Notification.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// Many-to-many relationship between Child and User (babysitters)
Child.belongsToMany(User, { 
  through: ChildBabysitter,
  foreignKey: 'childId',
  otherKey: 'babysitterId',
  as: 'babysitters',
  constraints: false
});

User.belongsToMany(Child, { 
  through: ChildBabysitter,
  foreignKey: 'babysitterId',
  otherKey: 'childId',
  as: 'assignedChildren',
  constraints: false
});

// ChildBabysitter associations
ChildBabysitter.belongsTo(Child, { foreignKey: 'childId' });
ChildBabysitter.belongsTo(User, { foreignKey: 'babysitterId', as: 'babysitter' });
ChildBabysitter.belongsTo(User, { foreignKey: 'assignedBy', as: 'assigner' });

module.exports = {
  User,
  Babysitter,
  Child,
  Attendance,
  Incident,
  Payment,
  Expense,
  Budget,
  Notification,
  ChildBabysitter
}; 