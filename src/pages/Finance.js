import React, { useState, useEffect } from "react";
import { DashboardLayout } from "../components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { financialService } from "../services";
import { toast } from "sonner";

export function Finance() {
  const [summary, setSummary] = useState(null);
  const [incomes, setIncomes] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchFinancialData();
  }, []);

  const fetchFinancialData = async () => {
    try {
      setLoading(true);
      
      // Fetch summary data
      const summaryData = await financialService.getFinancialSummary();
      setSummary(summaryData);
      
      // Fetch categories
      const categoriesData = await financialService.getAllCategories();
      setCategories(categoriesData);
      
      // Fetch incomes
      const incomesData = await financialService.getAllIncome();
      setIncomes(incomesData);
      
      // Fetch expenses
      const expensesData = await financialService.getAllExpenses();
      setExpenses(expensesData);
      
      setError(null);
    } catch (err) {
      console.error("Error fetching financial data:", err);
      setError("Failed to load financial data");
      toast.error("Failed to load financial data");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Financial Management</h1>
        <Button onClick={fetchFinancialData}>Refresh Data</Button>
      </div>
      
      <Tabs defaultValue="overview">
        <TabsList className="mb-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="income">Income</TabsTrigger>
          <TabsTrigger value="expenses">Expenses</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Financial Overview</CardTitle>
              <CardDescription>Summary of income, expenses, and net income</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="h-[300px] flex items-center justify-center">
                  <p className="text-gray-500">Loading financial data...</p>
                </div>
              ) : error ? (
                <div className="h-[300px] flex items-center justify-center">
                  <p className="text-red-500">{error}</p>
                </div>
              ) : !summary ? (
                <div className="h-[300px] flex items-center justify-center border rounded-md border-dashed border-gray-300 bg-gray-50">
                  <p className="text-gray-500">No financial summary available</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h3 className="text-sm font-medium text-green-800">Total Income</h3>
                    <p className="text-2xl font-bold text-green-600">${summary.total_income.toFixed(2)}</p>
                  </div>
                  <div className="bg-red-50 p-4 rounded-lg">
                    <h3 className="text-sm font-medium text-red-800">Total Expenses</h3>
                    <p className="text-2xl font-bold text-red-600">${summary.total_expenses.toFixed(2)}</p>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h3 className="text-sm font-medium text-blue-800">Net Income</h3>
                    <p className="text-2xl font-bold text-blue-600">${summary.net_income.toFixed(2)}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="income">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Income Records</CardTitle>
              <CardDescription>View and manage income records</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-end mb-4">
                <Button>Add Income</Button>
              </div>
              
              {loading ? (
                <div className="h-[300px] flex items-center justify-center">
                  <p className="text-gray-500">Loading income data...</p>
                </div>
              ) : error ? (
                <div className="h-[300px] flex items-center justify-center">
                  <p className="text-red-500">{error}</p>
                </div>
              ) : incomes.length === 0 ? (
                <div className="h-[300px] flex items-center justify-center border rounded-md border-dashed border-gray-300 bg-gray-50">
                  <p className="text-gray-500">No income records found</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Source</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {incomes.map((income) => (
                      <TableRow key={income.id}>
                        <TableCell>{new Date(income.date).toLocaleDateString()}</TableCell>
                        <TableCell>${income.amount.toFixed(2)}</TableCell>
                        <TableCell>{income.source}</TableCell>
                        <TableCell>{income.description || '-'}</TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm" className="mr-2">Edit</Button>
                          <Button variant="destructive" size="sm">Delete</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="expenses">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Expense Records</CardTitle>
              <CardDescription>View and manage expense records</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-end mb-4">
                <Button>Add Expense</Button>
              </div>
              
              {loading ? (
                <div className="h-[300px] flex items-center justify-center">
                  <p className="text-gray-500">Loading expense data...</p>
                </div>
              ) : error ? (
                <div className="h-[300px] flex items-center justify-center">
                  <p className="text-red-500">{error}</p>
                </div>
              ) : expenses.length === 0 ? (
                <div className="h-[300px] flex items-center justify-center border rounded-md border-dashed border-gray-300 bg-gray-50">
                  <p className="text-gray-500">No expense records found</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Payee</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {expenses.map((expense) => (
                      <TableRow key={expense.id}>
                        <TableCell>{new Date(expense.date).toLocaleDateString()}</TableCell>
                        <TableCell>${expense.amount.toFixed(2)}</TableCell>
                        <TableCell>
                          {categories.find(c => c.id === expense.category_id)?.name || 'Unknown'}
                        </TableCell>
                        <TableCell>{expense.payee}</TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm" className="mr-2">Edit</Button>
                          <Button variant="destructive" size="sm">Delete</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="categories">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Expense Categories</CardTitle>
              <CardDescription>View and manage expense categories</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-end mb-4">
                <Button>Add Category</Button>
              </div>
              
              {loading ? (
                <div className="h-[300px] flex items-center justify-center">
                  <p className="text-gray-500">Loading category data...</p>
                </div>
              ) : error ? (
                <div className="h-[300px] flex items-center justify-center">
                  <p className="text-red-500">{error}</p>
                </div>
              ) : categories.length === 0 ? (
                <div className="h-[300px] flex items-center justify-center border rounded-md border-dashed border-gray-300 bg-gray-50">
                  <p className="text-gray-500">No categories found</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Budget</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {categories.map((category) => (
                      <TableRow key={category.id}>
                        <TableCell>{category.name}</TableCell>
                        <TableCell>{category.description || '-'}</TableCell>
                        <TableCell>{category.budget ? `$${category.budget.toFixed(2)}` : '-'}</TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm" className="mr-2">Edit</Button>
                          <Button variant="destructive" size="sm">Delete</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
}

export default Finance; 