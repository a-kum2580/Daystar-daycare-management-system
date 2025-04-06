import React, { useState } from 'react';
import {
  Box,
  Tabs,
  Tab,
  Paper,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { useFormik } from 'formik';
import * as yup from 'yup';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`financial-tabpanel-${index}`}
      aria-labelledby={`financial-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const incomeValidationSchema = yup.object({
  childId: yup.string().required('Child is required'),
  amount: yup.number().required('Amount is required').min(0, 'Amount must be positive'),
  paymentType: yup.string().required('Payment type is required'),
  date: yup.date().required('Date is required'),
});

const expenseValidationSchema = yup.object({
  category: yup.string().required('Category is required'),
  amount: yup.number().required('Amount is required').min(0, 'Amount must be positive'),
  description: yup.string().required('Description is required'),
  date: yup.date().required('Date is required'),
});

function Financial() {
  const [tabValue, setTabValue] = useState(0);
  const [openIncomeDialog, setOpenIncomeDialog] = useState(false);
  const [openExpenseDialog, setOpenExpenseDialog] = useState(false);

  const [income, setIncome] = useState([
    {
      id: 1,
      childName: 'John Smith',
      amount: 5000,
      paymentType: 'full-day',
      date: '2024-04-05',
    },
  ]);

  const [expenses, setExpenses] = useState([
    {
      id: 1,
      category: 'Salaries',
      amount: 200000,
      description: 'Babysitter salaries for March',
      date: '2024-04-01',
    },
  ]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const incomeFormik = useFormik({
    initialValues: {
      childId: '',
      amount: '',
      paymentType: '',
      date: '',
    },
    validationSchema: incomeValidationSchema,
    onSubmit: (values) => {
      const newIncome = {
        id: income.length + 1,
        ...values,
      };
      setIncome([...income, newIncome]);
      setOpenIncomeDialog(false);
      incomeFormik.resetForm();
    },
  });

  const expenseFormik = useFormik({
    initialValues: {
      category: '',
      amount: '',
      description: '',
      date: '',
    },
    validationSchema: expenseValidationSchema,
    onSubmit: (values) => {
      const newExpense = {
        id: expenses.length + 1,
        ...values,
      };
      setExpenses([...expenses, newExpense]);
      setOpenExpenseDialog(false);
      expenseFormik.resetForm();
    },
  });

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Financial Management
      </Typography>

      <Paper sx={{ width: '100%' }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
        >
          <Tab label="Income" />
          <Tab label="Expenses" />
          <Tab label="Budgeting" />
        </Tabs>

        <TabPanel value={tabValue} index={0}>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setOpenIncomeDialog(true)}
            >
              Add Income
            </Button>
          </Box>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Child</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>Payment Type</TableCell>
                  <TableCell>Date</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {income.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.childName}</TableCell>
                    <TableCell>UGX {item.amount.toLocaleString()}</TableCell>
                    <TableCell>{item.paymentType}</TableCell>
                    <TableCell>{item.date}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setOpenExpenseDialog(true)}
            >
              Add Expense
            </Button>
          </Box>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Category</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Date</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {expenses.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.category}</TableCell>
                    <TableCell>UGX {item.amount.toLocaleString()}</TableCell>
                    <TableCell>{item.description}</TableCell>
                    <TableCell>{item.date}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          <Typography variant="h6" gutterBottom>
            Budget Overview
          </Typography>
          {/* TODO: Add budget overview components */}
        </TabPanel>
      </Paper>

      {/* Income Dialog */}
      <Dialog open={openIncomeDialog} onClose={() => setOpenIncomeDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add Income</DialogTitle>
        <form onSubmit={incomeFormik.handleSubmit}>
          <DialogContent>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Child</InputLabel>
                  <Select
                    name="childId"
                    value={incomeFormik.values.childId}
                    onChange={incomeFormik.handleChange}
                    label="Child"
                  >
                    <MenuItem value="1">John Smith</MenuItem>
                    {/* Add more children as needed */}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Amount"
                  name="amount"
                  type="number"
                  value={incomeFormik.values.amount}
                  onChange={incomeFormik.handleChange}
                  error={incomeFormik.touched.amount && Boolean(incomeFormik.errors.amount)}
                  helperText={incomeFormik.touched.amount && incomeFormik.errors.amount}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Payment Type</InputLabel>
                  <Select
                    name="paymentType"
                    value={incomeFormik.values.paymentType}
                    onChange={incomeFormik.handleChange}
                    label="Payment Type"
                  >
                    <MenuItem value="half-day">Half Day (2,000 UGX)</MenuItem>
                    <MenuItem value="full-day">Full Day (5,000 UGX)</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Date"
                  name="date"
                  type="date"
                  value={incomeFormik.values.date}
                  onChange={incomeFormik.handleChange}
                  InputLabelProps={{ shrink: true }}
                  error={incomeFormik.touched.date && Boolean(incomeFormik.errors.date)}
                  helperText={incomeFormik.touched.date && incomeFormik.errors.date}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenIncomeDialog(false)}>Cancel</Button>
            <Button type="submit" variant="contained">
              Add Income
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Expense Dialog */}
      <Dialog open={openExpenseDialog} onClose={() => setOpenExpenseDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add Expense</DialogTitle>
        <form onSubmit={expenseFormik.handleSubmit}>
          <DialogContent>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Category</InputLabel>
                  <Select
                    name="category"
                    value={expenseFormik.values.category}
                    onChange={expenseFormik.handleChange}
                    label="Category"
                  >
                    <MenuItem value="Salaries">Salaries</MenuItem>
                    <MenuItem value="Toys">Toys and Materials</MenuItem>
                    <MenuItem value="Maintenance">Maintenance</MenuItem>
                    <MenuItem value="Utilities">Utilities</MenuItem>
                    <MenuItem value="Other">Other</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Amount"
                  name="amount"
                  type="number"
                  value={expenseFormik.values.amount}
                  onChange={expenseFormik.handleChange}
                  error={expenseFormik.touched.amount && Boolean(expenseFormik.errors.amount)}
                  helperText={expenseFormik.touched.amount && expenseFormik.errors.amount}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description"
                  name="description"
                  multiline
                  rows={3}
                  value={expenseFormik.values.description}
                  onChange={expenseFormik.handleChange}
                  error={expenseFormik.touched.description && Boolean(expenseFormik.errors.description)}
                  helperText={expenseFormik.touched.description && expenseFormik.errors.description}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Date"
                  name="date"
                  type="date"
                  value={expenseFormik.values.date}
                  onChange={expenseFormik.handleChange}
                  InputLabelProps={{ shrink: true }}
                  error={expenseFormik.touched.date && Boolean(expenseFormik.errors.date)}
                  helperText={expenseFormik.touched.date && expenseFormik.errors.date}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenExpenseDialog(false)}>Cancel</Button>
            <Button type="submit" variant="contained">
              Add Expense
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
}

export default Financial; 