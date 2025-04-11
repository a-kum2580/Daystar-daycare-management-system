const express = require('express');
const router = express.Router();
const FinancialRecord = require('../models/financialModel');
const { authenticateToken, authorizeRole } = require('../middleware/auth');
const { validateFinancialData } = require('../middleware/validation');

// Get all financial records (admin only)
router.get('/', authenticateToken, authorizeRole(['admin']), async (req, res) => {
  try {
    const { year, month } = req.query;
    if (year && month) {
      const report = await FinancialRecord.getMonthlyReport(year, month);
      return res.json(report);
    }
    const records = await FinancialRecord.getAll();
    res.json(records);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching financial records', error: error.message });
  }
});

// Get financial record by ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const record = await FinancialRecord.findById(req.params.id);
    if (!record) {
      return res.status(404).json({ message: 'Financial record not found' });
    }
    res.json(record);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching financial record', error: error.message });
  }
});

// Get financial records by parent ID
router.get('/parent/:parentId', authenticateToken, async (req, res) => {
  try {
    const records = await FinancialRecord.findByParentId(req.params.parentId);
    res.json(records);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching financial records', error: error.message });
  }
});

// Create new financial record
router.post('/', authenticateToken, authorizeRole(['admin']), validateFinancialData, async (req, res) => {
  try {
    const recordId = await FinancialRecord.create(req.body);
    const record = await FinancialRecord.findById(recordId);
    res.status(201).json(record);
  } catch (error) {
    res.status(500).json({ message: 'Error creating financial record', error: error.message });
  }
});

// Update payment status
router.patch('/:id/status', authenticateToken, async (req, res) => {
  try {
    const { status, paid_date } = req.body;
    const record = await FinancialRecord.updateStatus(req.params.id, status, paid_date);
    if (!record) {
      return res.status(404).json({ message: 'Financial record not found' });
    }
    res.json(record);
  } catch (error) {
    res.status(500).json({ message: 'Error updating payment status', error: error.message });
  }
});

// Get overdue payments
router.get('/overdue', authenticateToken, authorizeRole(['admin']), async (req, res) => {
  try {
    const overduePayments = await FinancialRecord.getOverduePayments();
    res.json(overduePayments);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching overdue payments', error: error.message });
  }
});

module.exports = router; 